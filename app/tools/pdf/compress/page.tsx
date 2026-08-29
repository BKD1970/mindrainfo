"use client";

import Link from "next/link";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import SiteHeader from "@/components/SiteHeader";

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState("");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const compressionPercentage =
    file && compressedBlob
      ? Math.max(
          0,
          ((file.size - compressedBlob.size) / file.size) * 100
        )
      : 0;

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");
    setCompressedBlob(null);

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setError("Please select a valid PDF file.");
      return;
    }

    setFile(selectedFile);
  };

  const compressPDF = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    try {
      setIsCompressing(true);
      setError("");
      setCompressedBlob(null);

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await PDFDocument.load(arrayBuffer);

      /*
       * pdf-lib does not perform image recompression.
       * This first version focuses on rebuilding the PDF
       * structure and removing unnecessary document metadata.
       */

      pdf.setTitle("");
      pdf.setAuthor("");
      pdf.setSubject("");
      pdf.setKeywords([]);
      pdf.setProducer("MindraInfo PDF Tools");
      pdf.setCreator("MindraInfo");

      const compressedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const safeBuffer = new ArrayBuffer(compressedBytes.byteLength);

      new Uint8Array(safeBuffer).set(compressedBytes);

      const blob = new Blob([safeBuffer], {
        type: "application/pdf",
      });

      setCompressedBlob(blob);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to compress this PDF. The file may be damaged or protected."
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadPDF = () => {
    if (!compressedBlob || !file) return;

    const url = URL.createObjectURL(compressedBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${file.name.replace(/\.pdf$/i, "")}-compressed.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setFile(null);
    setCompressedBlob(null);
    setError("");
    setIsCompressing(false);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">
      <SiteHeader />

      {/* HERO */}

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-orange-300/20 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Link
            href="/tools/pdf"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-500"
          >
            ← Back to PDF Tools
          </Link>

          <div className="mx-auto mt-10 max-w-3xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-orange-100 text-4xl shadow-sm">
              📦
            </div>

            <h1 className="mt-7 text-5xl font-black tracking-tight md:text-6xl">
              Compress PDF
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Reduce the size of your PDF while keeping the document
              usable and readable.
            </p>
          </div>
        </div>
      </section>

      {/* TOOL */}

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xl md:p-10">
          {!file && (
            <label className="group flex min-h-[330px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-gray-300 bg-gray-50 px-6 text-center transition hover:border-orange-400 hover:bg-orange-50/40">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm transition group-hover:scale-105">
                📄
              </div>

              <h2 className="mt-6 text-2xl font-black">
                Select a PDF file
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                Choose the PDF you want to compress. Your file is processed
                directly in your browser.
              </p>

              <span className="mt-7 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white transition group-hover:bg-orange-500">
                Choose PDF
              </span>

              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {file && !compressedBlob && (
            <div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                      📄
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-bold">
                        {file.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={resetTool}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-orange-50 p-6">
                <div className="flex gap-4">
                  <div className="text-xl">ℹ️</div>

                  <div>
                    <p className="font-bold">
                      Ready to compress
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Click the button below to optimize the PDF structure
                      and remove unnecessary document metadata.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={compressPDF}
                disabled={isCompressing}
                className="mt-8 w-full rounded-2xl bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCompressing
                  ? "Compressing PDF..."
                  : "Compress PDF →"}
              </button>
            </div>
          )}

          {compressedBlob && file && (
            <div>
              <div className="rounded-3xl bg-gray-900 p-8 text-white md:p-10">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-3xl">
                    ✓
                  </div>

                  <h2 className="mt-5 text-3xl font-black">
                    PDF compression complete
                  </h2>

                  <p className="mt-3 text-gray-400">
                    Your processed PDF is ready.
                  </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">
                      Original size
                    </p>

                    <p className="mt-2 text-2xl font-black">
                      {formatSize(file.size)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">
                      New size
                    </p>

                    <p className="mt-2 text-2xl font-black">
                      {formatSize(compressedBlob.size)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-orange-500 p-5">
                    <p className="text-sm text-orange-100">
                      Size reduction
                    </p>

                    <p className="mt-2 text-2xl font-black">
                      {compressionPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {compressedBlob.size >= file.size && (
                <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                  <p className="font-bold text-yellow-800">
                    This PDF could not be reduced significantly.
                  </p>

                  <p className="mt-1 text-sm leading-6 text-yellow-700">
                    The original PDF may already be optimized or may contain
                    compressed images. The generated file is still valid and
                    available for download.
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={downloadPDF}
                  className="flex-1 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600"
                >
                  Download Compressed PDF ↓
                </button>

                <button
                  onClick={resetTool}
                  className="rounded-2xl border border-gray-200 bg-white px-6 py-4 font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Compress Another
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* PRIVACY */}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-center">
          <div className="text-xl">🔒</div>

          <h3 className="mt-3 font-bold">
            Your files stay on your device
          </h3>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            This tool processes your PDF in your browser. MindraInfo does not
            save the uploaded file in your database.
          </p>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">
          <p>© 2026 MindraInfo. All rights reserved.</p>

          <Link
            href="/tools/pdf"
            className="font-semibold text-orange-500 hover:text-orange-600"
          >
            PDF Tools →
          </Link>
        </div>
      </footer>
    </main>
  );
}