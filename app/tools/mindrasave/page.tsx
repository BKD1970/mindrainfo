"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";

type DownloadFormat = "mp4" | "mp3";

export default function MindraSavePage() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<DownloadFormat>("mp4");
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setError("");

    if (!url.trim()) {
      setError("Please paste a video or audio link first.");
      return;
    }

    try {
      new URL(url.trim());
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    setIsDownloading(true);

    try {
      const response = await fetch("http://localhost:4000/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
          format,
        }),
      });

      if (!response.ok) {
        let message = "The media could not be downloaded.";

        try {
          const data = await response.json();

          if (data?.error) {
            message = data.error;
          }
        } catch {
          // Keep the default error message.
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error("The downloaded file is empty.");
      }

      const contentDisposition =
        response.headers.get("Content-Disposition");

      let filename =
        format === "mp4"
          ? "mindrasave-video.mp4"
          : "mindrasave-audio.mp3";

      if (contentDisposition) {
        const filenameMatch =
          contentDisposition.match(/filename="?([^"]+)"?/i);

        if (filenameMatch?.[1]) {
          filename = filenameMatch[1];
        }
      }

      const downloadUrl = window.URL.createObjectURL(blob);

const link = document.createElement("a");
link.href = downloadUrl;
link.download = filename;

document.body.appendChild(link);
link.click();
link.remove();

// Give the browser time to start the download
setTimeout(() => {
  window.URL.revokeObjectURL(downloadUrl);
}, 1000);
    } catch (err) {
      console.error("MindraSave download error:", err);

      if (err instanceof TypeError) {
        setError(
          "MindraSave backend is not running. Start the backend and try again."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-orange-300/25 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-48 h-[420px] w-[420px] rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-20 md:py-28">
          <div className="text-center">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
              MindraInfo Media Tool
            </div>

            {/* TITLE */}
            <h1 className="mt-7 text-5xl font-black tracking-tight md:text-7xl">
              Mindra<span className="text-orange-500">Save</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              Save supported online videos and audio from a link with a
              simple and easy-to-use interface.
            </p>

            {/* MAIN TOOL CARD */}
            <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-gray-200 bg-white p-5 shadow-xl md:p-7">
              {/* FEATURES */}
              <div className="-mx-1 overflow-x-auto pb-2">
                <div className="flex min-w-max gap-3 px-1">
                  {/* VIDEO */}
                  <div className="flex min-w-[125px] items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left transition hover:border-orange-200 hover:bg-orange-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-lg">
                      🎬
                    </div>

                    <div>
                      <p className="text-sm font-black">Video</p>
                      <p className="text-[11px] text-gray-500">MP4</p>
                    </div>
                  </div>

                  {/* AUDIO */}
                  <div className="flex min-w-[125px] items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left transition hover:border-orange-200 hover:bg-orange-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-lg">
                      🎵
                    </div>

                    <div>
                      <p className="text-sm font-black">Audio</p>
                      <p className="text-[11px] text-gray-500">MP3</p>
                    </div>
                  </div>

                  {/* SHORTS */}
                  <div className="flex min-w-[125px] items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left transition hover:border-orange-200 hover:bg-orange-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-lg">
                      📱
                    </div>

                    <div>
                      <p className="text-sm font-black">Shorts</p>
                      <p className="text-[11px] text-gray-500">
                        9:16 Video
                      </p>
                    </div>
                  </div>

                  {/* SIMPLE */}
                  <div className="flex min-w-[125px] items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left transition hover:border-orange-200 hover:bg-orange-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-lg">
                      ⚡
                    </div>

                    <div>
                      <p className="text-sm font-black">Simple</p>
                      <p className="text-[11px] text-gray-500">
                        Easy to use
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* INPUT AREA */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <label
                  htmlFor="media-url"
                  className="block text-left text-sm font-bold text-gray-700"
                >
                  Paste your media link
                </label>

                <div className="mt-3 flex flex-col gap-3 md:flex-row">
                  <input
                    id="media-url"
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isDownloading) {
                        handleDownload();
                      }
                    }}
                    placeholder="Paste a video or audio link..."
                    disabled={isDownloading}
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="rounded-xl bg-orange-500 px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {isDownloading ? "Processing..." : "Download →"}
                  </button>
                </div>

                {/* FORMAT SELECTOR */}
                <div className="mt-5">
                  <p className="text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                    Download format
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormat("mp4")}
                      disabled={isDownloading}
                      className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                        format === "mp4"
                          ? "border-orange-500 bg-orange-500 text-white shadow-md"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-orange-200 hover:bg-orange-50"
                      }`}
                    >
                      🎬 MP4 Video
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormat("mp3")}
                      disabled={isDownloading}
                      className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                        format === "mp3"
                          ? "border-orange-500 bg-orange-500 text-white shadow-md"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-orange-200 hover:bg-orange-50"
                      }`}
                    >
                      🎵 MP3 Audio
                    </button>
                  </div>
                </div>

                {/* STATUS */}
                <div className="mt-4 min-h-6">
                  {isDownloading && (
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-orange-500">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500" />
                      Processing your {format.toUpperCase()} download...
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-semibold leading-6 text-red-600">
                      {error}
                    </div>
                  )}
                </div>

                <p className="mt-3 text-left text-xs leading-5 text-gray-500">
                  Select MP4 for video or MP3 for audio, paste a supported
                  link, and click Download.
                </p>
              </div>
            </div>

            {/* SUPPORTED MEDIA */}
            <div className="mx-auto mt-7 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Designed for video & audio links
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">
          <p>© 2026 MindraInfo. All rights reserved.</p>

          <Link
            href="/tools"
            className="font-semibold text-orange-500 transition hover:text-orange-600"
          >
            ← Back to Tools
          </Link>
        </div>
      </footer>
    </main>
  );
}
