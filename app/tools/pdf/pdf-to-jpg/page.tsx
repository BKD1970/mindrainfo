"use client";

import Link from "next/link";
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import SiteHeader from "@/components/SiteHeader";

// Use the worker bundled with the installed pdfjs-dist package.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

type PreviewPage = {
  pageNumber: number;
  imageUrl: string;
};

export default function PdfToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PreviewPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [quality, setQuality] = useState(0.9);
  const [scale, setScale] = useState(1.5);
  const [error, setError] = useState("");

  const loadPDF = async (selectedFile: File) => {
    setError("");
    setPages([]);

    try {
      setLoading(true);
      setFile(selectedFile);

      const arrayBuffer = await selectedFile.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      }).promise;

      const renderedPages: PreviewPage[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({
          scale,
        });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Unable to create canvas.");
        }

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        await page.render({
          canvasContext: context,
          viewport,
          canvas: canvas,
        }).promise;

        const imageUrl = canvas.toDataURL("image/jpeg", quality);

        renderedPages.push({
          pageNumber,
          imageUrl,
        });
      }

      setPages(renderedPages);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to read or render this PDF. The file may be damaged, protected, or unsupported."
      );
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }

    loadPDF(selectedFile);
  };

  const downloadPage = (page: PreviewPage) => {
    const link = document.createElement("a");

    link.href = page.imageUrl;
    link.download = `page-${page.pageNumber}.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadAllAsZip = async () => {
    if (pages.length === 0) return;

    try {
      setConverting(true);

      const zip = new JSZip();

      pages.forEach((page) => {
        const base64Data = page.imageUrl.split(",")[1];

        zip.file(
          `page-${page.pageNumber}.jpg`,
          base64Data,
          {
            base64: true,
          }
        );
      });

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

      const url = URL.createObjectURL(zipBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "mindrainfo-pdf-pages.zip";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Unable to create the ZIP file.");
    } finally {
      setConverting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPages([]);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">
      <SiteHeader />

      {/* HERO */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <Link
            href="/tools/pdf"
            className="text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            ← Back to PDF Tools
          </Link>

          <div className="mt-8 max-w-3xl">
            <div className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
              PDF Tool
            </div>

            <h1 className="mt-5 text-5xl font-black tracking-tight md:text-6xl">
              PDF to JPG
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Convert PDF pages into high-quality JPG images. Download
              individual pages or download all pages together as a ZIP file.
            </p>
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {!file ? (
          <label className="mx-auto flex min-h-[440px] max-w-5xl cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-gray-300 bg-white px-6 text-center shadow-sm transition hover:border-orange-400 hover:bg-orange-50/30">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 text-4xl">
              📄
            </div>

            <h2 className="mt-6 text-2xl font-black">
              Upload your PDF
            </h2>

            <p className="mt-3 max-w-lg text-gray-500">
              Select a PDF and MindraInfo will convert each page into a JPG
              image directly in your browser.
            </p>

            <span className="mt-7 rounded-xl bg-orange-500 px-7 py-3.5 font-bold text-white transition hover:bg-orange-600">
              Select PDF
            </span>

            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* PREVIEW */}
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    PDF Pages
                  </h2>

                  <p className="mt-1 max-w-xl truncate text-sm text-gray-500">
                    {file.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearFile}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-bold transition hover:bg-gray-100"
                >
                  Choose Another
                </button>
              </div>

              {loading ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

                  <p className="mt-5 font-semibold text-gray-600">
                    Rendering PDF pages...
                  </p>
                </div>
              ) : error ? (
                <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
                  <p className="font-bold">Conversion failed</p>
                  <p className="mt-2 text-sm">{error}</p>
                </div>
              ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {pages.map((page) => (
                    <div
                      key={page.pageNumber}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
                    >
                      <div className="flex h-72 items-center justify-center p-4">
                        <img
                          src={page.imageUrl}
                          alt={`PDF page ${page.pageNumber}`}
                          className="max-h-full max-w-full rounded-lg object-contain shadow-md"
                        />
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
                        <span className="text-sm font-bold">
                          Page {page.pageNumber}
                        </span>

                        <button
                          type="button"
                          onClick={() => downloadPage(page)}
                          className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-orange-500"
                        >
                          Download JPG
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SETTINGS */}
            <aside className="h-fit rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">
                JPG Settings
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Adjust image quality and resolution before downloading.
              </p>

              {/* QUALITY */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold">
                    JPG Quality
                  </label>

                  <span className="text-sm font-bold text-orange-500">
                    {Math.round(quality * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="mt-4 w-full accent-orange-500"
                />
              </div>

              {/* SCALE */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold">
                    Resolution
                  </label>

                  <span className="text-sm font-bold text-orange-500">
                    {scale}×
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.25"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="mt-4 w-full accent-orange-500"
                />

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  Higher resolution produces larger and sharper JPG files.
                </p>
              </div>

              {/* RENDER BUTTON */}
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  if (file) loadPDF(file);
                }}
                className="mt-8 w-full rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                {loading ? "Rendering..." : "Apply Settings"}
              </button>

              {/* DOWNLOAD ALL */}
              <button
                type="button"
                disabled={pages.length === 0 || converting}
                onClick={downloadAllAsZip}
                className="mt-3 w-full rounded-xl bg-gray-900 px-5 py-4 text-sm font-black text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                {converting
                  ? "Creating ZIP..."
                  : `Download All (${pages.length})`}
              </button>

              {/* PRIVACY */}
              <div className="mt-7 rounded-2xl bg-green-50 p-4">
                <div className="flex gap-3">
                  <span className="text-lg">🔒</span>

                  <div>
                    <p className="text-sm font-bold text-green-700">
                      Your files stay private
                    </p>

                    <p className="mt-1 text-xs leading-5 text-green-700/70">
                      PDF processing happens in your browser. Your file is not
                      uploaded to or stored in the MindraInfo database.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>

      {/* INFO */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-2xl">1️⃣</div>

              <h3 className="mt-4 text-lg font-black">
                Upload PDF
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Select the PDF you want to convert.
              </p>
            </div>

            <div>
              <div className="text-2xl">2️⃣</div>

              <h3 className="mt-4 text-lg font-black">
                Preview pages
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Every PDF page is rendered as an image so you can check the
                result before downloading.
              </p>
            </div>

            <div>
              <div className="text-2xl">3️⃣</div>

              <h3 className="mt-4 text-lg font-black">
                Download JPG
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Download individual pages or all converted pages as one ZIP
                file.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-[#f7f7f4]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">
          <p>© 2026 MindraInfo. All rights reserved.</p>

          <Link
            href="/tools/pdf"
            className="font-semibold text-orange-500 hover:text-orange-600"
          >
            Back to PDF Tools →
          </Link>
        </div>
      </footer>
    </main>
  );
}