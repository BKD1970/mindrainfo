const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

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
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

/*
  Download endpoint
*/
app.post("/download", (req, res) => {
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

  const timestamp = Date.now();

  const outputTemplate = path.join(
    downloadsDir,
    `mindrasave-${timestamp}.%(ext)s`
  );

  const isYouTube = /(?:youtube\.com|youtu\.be)/i.test(url);

  let args = [
    "--no-playlist",
    "--restrict-filenames",
    "--no-warnings",
    "--newline",
    "-o",
    outputTemplate,
  ];

  /*
    YouTube

    Do NOT force web_embedded.
    Let the current yt-dlp YouTube extractor choose
    its available client strategy.
  */
  if (isYouTube) {
    args.push(
      "--extractor-args",
      "youtube:player_client=default"
    );
  }

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

    Prefer MP4-compatible video/audio formats.
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
  console.log(`YouTube: ${isYouTube}`);
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
      return res.status(500).json({
        error: "Could not start the media downloader.",
      });
    }
  });

  ytDlp.on("close", (code) => {
    console.log(`yt-dlp process finished with code: ${code}`);

    if (code !== 0) {
      console.error("yt-dlp exited with code:", code);
      console.error("yt-dlp error:", errorOutput.slice(-4000));

      if (!res.headersSent) {
        return res.status(500).json({
          error: "The media could not be downloaded.",
          details: errorOutput.slice(-2000),
        });
      }

      return;
    }

    /*
      Find downloaded file.
    */
    const files = fs
      .readdirSync(downloadsDir)
      .filter((file) =>
        file.startsWith(`mindrasave-${timestamp}.`)
      );

    if (files.length === 0) {
      console.error(
        "Download completed but output file was not found."
      );

      return res.status(500).json({
        error:
          "Download completed but the output file was not found.",
      });
    }

    const temporaryFilename = files[0];

    const temporaryPath = path.join(
      downloadsDir,
      temporaryFilename
    );

    /*
      Extract title from temporary filename.
    */
    const temporaryBaseName = path.basename(
      temporaryFilename,
      path.extname(temporaryFilename)
    );

    let title = temporaryBaseName
      .replace(`mindrasave-${timestamp}-`, "")
      .replace(`mindrasave-${timestamp}`, "");

    /*
      Fallback title.
    */
    if (!title.trim()) {
      title = "download";
    }

    const finalFilename = `MS-${title}.${format}`;

    const finalPath = path.join(
      downloadsDir,
      finalFilename
    );

    /*
      Rename downloaded file.
    */
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

      return res.status(500).json({
        error: "The downloaded file could not be prepared.",
      });
    }

    console.log(`Download ready: ${finalFilename}`);

    /*
      Send file.
    */
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

        /*
          Cleanup.
        */
        fs.unlink(
          finalPath,
          (cleanupError) => {
            if (cleanupError) {
              console.error(
                "Cleanup error:",
                cleanupError
              );
            } else {
              console.log(
                `Cleaned up: ${finalFilename}`
              );
            }
          }
        );
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(
    `MindraSave backend running on port ${PORT}`
  );
});