const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

const COBALT_URL =
  process.env.COBALT_URL ||
  "https://mindrasave-cobalt.onrender.com";

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mindrainfo-six.vercel.app",
    ],
  })
);

app.use(express.json());

const downloadsDir = path.join(__dirname, "downloads");

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

/*
  Health check
*/
app.get("/", (req, res) => {
  res.json({
    name: "MindraSave Backend",
    status: "running",
    cobalt: COBALT_URL,
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    cobalt: COBALT_URL,
  });
});

/*
  Detect YouTube
*/
function isYouTubeUrl(url) {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}

/*
  Download YouTube through our self-hosted Cobalt instance.
*/
async function downloadFromCobalt(url, format, timestamp) {
  console.log("");
  console.log("========================================");
  console.log("MindraSave YouTube → Cobalt");
  console.log(`Cobalt URL: ${COBALT_URL}`);
  console.log(`Source URL: ${url}`);
  console.log(`Requested format: ${format}`);
  console.log("========================================");

  const cobaltResponse = await fetch(COBALT_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  url,
  videoQuality: "720",
  youtubeVideoCodec: "h264",
  youtubeVideoContainer: "mp4",
  downloadMode: format === "mp3" ? "audio" : "auto",
  ...(format === "mp3"
    ? {
        audioFormat: "mp3",
        audioBitrate: "128",
      }
    : {}),
}),
  });

  const cobaltData = await cobaltResponse.json();

  console.log("Cobalt response:");
  console.log(JSON.stringify(cobaltData, null, 2));

  if (!cobaltResponse.ok) {
    throw new Error(
      cobaltData?.error?.code ||
        cobaltData?.text ||
        "Cobalt request failed."
    );
  }

  /*
    Cobalt normally returns:
      status: "tunnel"
      or
      status: "redirect"

    with:
      url: "https://..."
  */
  if (
    cobaltData.status !== "tunnel" &&
    cobaltData.status !== "redirect"
  ) {
    throw new Error(
      cobaltData?.error?.code ||
        cobaltData?.text ||
        `Cobalt returned status: ${cobaltData.status}`
    );
  }

  if (!cobaltData.url) {
    throw new Error("Cobalt did not return a media URL.");
  }

  const mediaUrl = cobaltData.url;

  console.log(`Cobalt media URL received.`);

  const temporaryBase = path.join(
    downloadsDir,
    `mindrasave-${timestamp}`
  );

  const inputExtension =
    format === "mp3" ? "mp4" : "mp4";

  const inputPath = `${temporaryBase}.${inputExtension}`;
  const outputPath = `${temporaryBase}.${format}`;

  /*
    Download the media returned by Cobalt.
  */
  const mediaResponse = await fetch(mediaUrl);

  if (!mediaResponse.ok) {
    throw new Error(
      `Unable to retrieve the media from Cobalt. HTTP ${mediaResponse.status}`
    );
  }

  const mediaBuffer = Buffer.from(
    await mediaResponse.arrayBuffer()
  );

  fs.writeFileSync(inputPath, mediaBuffer);

  console.log(
    `Temporary media saved: ${inputPath}`
  );

  /*
    MP4
  */
  if (format === "mp4") {
    /*
      Cobalt already returned a playable video.
      We simply use the downloaded file as the result.
    */

    return {
      path: inputPath,
      filename: `MS-youtube-${timestamp}.mp4`,
      cleanup: [inputPath],
    };
  }

  /*
    MP3
  */
  console.log("Extracting MP3 with FFmpeg...");

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-i",
      inputPath,
      "-vn",
      "-codec:a",
      "libmp3lame",
      "-b:a",
      "192k",
      outputPath,
    ]);

    let ffmpegError = "";

    ffmpeg.stderr.on("data", (data) => {
      const message = data.toString();

      ffmpegError += message;

      console.log(message.trim());
    });

    ffmpeg.on("error", (error) => {
      reject(error);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `FFmpeg failed with code ${code}: ${ffmpegError.slice(
              -2000
            )}`
          )
        );
      }
    });
  });

  fs.unlinkSync(inputPath);

  console.log(`MP3 ready: ${outputPath}`);

  return {
    path: outputPath,
    filename: `MS-youtube-${timestamp}.mp3`,
    cleanup: [outputPath],
  };
}

/*
  Existing yt-dlp downloader for non-YouTube services.
*/
function downloadWithYtDlp(url, format, timestamp, res) {
  const outputTemplate = path.join(
    downloadsDir,
    `mindrasave-${timestamp}.%(ext)s`
  );

  let args = [
    "--no-playlist",
    "--restrict-filenames",
    "--no-warnings",
    "--newline",
    "-o",
    outputTemplate,
  ];

  /*
    MP3
  */
  if (format === "mp3") {
    args.push(
      "-x",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "192K"
    );
  }

  /*
    MP4
  */
  if (format === "mp4") {
    args.push(
      "-f",
      "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
      "--merge-output-format",
      "mp4"
    );
  }

  args.push(url);

  console.log("");
  console.log("========================================");
  console.log(`MindraSave request: ${format.toUpperCase()}`);
  console.log(`URL: ${url}`);
  console.log("YouTube: false");
  console.log("Using existing yt-dlp downloader");
  console.log("yt-dlp arguments:");
  console.log(args.join(" "));
  console.log("========================================");

  const ytDlp = spawn("yt-dlp", args);

  let errorOutput = "";

  ytDlp.stderr.on("data", (data) => {
    const message = data.toString();

    errorOutput += message;

    console.log(message.trim());
  });

  ytDlp.stdout.on("data", (data) => {
    console.log(data.toString().trim());
  });

  ytDlp.on("error", (error) => {
    console.error("Failed to start yt-dlp:", error);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Could not start the media downloader.",
      });
    }
  });

  ytDlp.on("close", (code) => {
    console.log(
      `yt-dlp process finished with code: ${code}`
    );

    if (code !== 0) {
      console.error(
        "yt-dlp error:",
        errorOutput.slice(-4000)
      );

      if (!res.headersSent) {
        res.status(500).json({
          error: "The media could not be downloaded.",
        });
      }

      return;
    }

    const files = fs
      .readdirSync(downloadsDir)
      .filter((file) =>
        file.startsWith(`mindrasave-${timestamp}.`)
      );

    if (files.length === 0) {
      if (!res.headersSent) {
        res.status(500).json({
          error:
            "Download completed but the output file was not found.",
        });
      }

      return;
    }

    const temporaryFilename = files[0];

    const temporaryPath = path.join(
      downloadsDir,
      temporaryFilename
    );

    const finalFilename =
      `MS-download-${timestamp}.${format}`;

    const finalPath = path.join(
      downloadsDir,
      finalFilename
    );

    try {
      fs.renameSync(
        temporaryPath,
        finalPath
      );
    } catch (error) {
      console.error(
        "Failed to rename downloaded file:",
        error
      );

      if (!res.headersSent) {
        res.status(500).json({
          error:
            "The downloaded file could not be prepared.",
        });
      }

      return;
    }

    res.download(
      finalPath,
      finalFilename,
      (error) => {
        if (error) {
          console.error(
            "File download error:",
            error
          );
        }

        fs.unlink(
          finalPath,
          (cleanupError) => {
            if (cleanupError) {
              console.error(
                "Cleanup error:",
                cleanupError
              );
            }
          }
        );
      }
    );
  });
}

/*
  Main download endpoint
*/
app.post("/download", async (req, res) => {
  const { url, format } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      error: "A valid media URL is required.",
    });
  }

  if (!["mp4", "mp3"].includes(format)) {
    return res.status(400).json({
      error: "Format must be mp4 or mp3.",
    });
  }

  const cleanUrl = url.trim();
  const timestamp = Date.now();

  /*
    YouTube → Cobalt
  */
  if (isYouTubeUrl(cleanUrl)) {
    try {
      const result = await downloadFromCobalt(
        cleanUrl,
        format,
        timestamp
      );

      console.log(
        `Sending YouTube file: ${result.filename}`
      );

      res.download(
        result.path,
        result.filename,
        (error) => {
          if (error) {
            console.error(
              "YouTube file download error:",
              error
            );
          }

          for (const file of result.cleanup) {
            fs.unlink(
              file,
              (cleanupError) => {
                if (cleanupError) {
                  console.error(
                    "YouTube cleanup error:",
                    cleanupError
                  );
                } else {
                  console.log(
                    `Cleaned up: ${file}`
                  );
                }
              }
            );
          }
        }
      );
    } catch (error) {
      console.error(
        "YouTube/Cobalt error:",
        error
      );

      if (!res.headersSent) {
        res.status(500).json({
          error:
            "The YouTube video could not be downloaded.",
          details:
            error instanceof Error
              ? error.message
              : "Unknown Cobalt error.",
        });
      }
    }

    return;
  }

  /*
    Everything else → existing yt-dlp
  */
  downloadWithYtDlp(
    cleanUrl,
    format,
    timestamp,
    res
  );
});

app.listen(PORT, () => {
  console.log(
    `MindraSave backend running on port ${PORT}`
  );

  console.log(
    `Cobalt YouTube engine: ${COBALT_URL}`
  );
});