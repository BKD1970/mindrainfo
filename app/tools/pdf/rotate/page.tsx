"use client";

import Link from "next/link";
import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import SiteHeader from "@/components/SiteHeader";

type Rotation = 90 | 180 | 270;

export default function RotatePDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState<Rotation>(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState("");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");
    setResultBlob(null);

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setError("Please select a valid PDF file.");
      return;
    }

    setFile(selectedFile);
  };

  const rotatePDF = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");
      setResultBlob(null);

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await PDFDocument.load(arrayBuffer);

      const pages = pdf.getPages();

      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;

        const newRotation =
          (currentRotation + rotation) % 360;

        page.setRotation(degrees(newRotation));
      });

      const pdfBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const safeBuffer = new ArrayBuffer(pdfBytes.byteLength);

      new Uint8Array(safeBuffer).set(pdfBytes);

      const blob = new Blob([safeBuffer], {
        type: "application/pdf",
      });

      setResultBlob(blob);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to rotate this PDF. The file may be damaged, protected, or unsupported."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = () => {
    if (!resultBlob || !file) return;

    const url = URL.createObjectURL(resultBlob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${file.name.replace(
      /\.pdf$/i,
      ""
    )}-rotated.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setFile(null);
    setResultBlob(null);
    setError("");
    setIsProcessing(false);
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
              🔄
            </div>

            <h1 className="mt-7 text-5xl font-black tracking-tight md:text-6xl">
              Rotate PDF
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Rotate every page of your PDF by 90°, 180° or 270°
              and download the corrected document.
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
                Choose the PDF you want to rotate. Your file is
                processed directly in your browser.
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

          {file && !resultBlob && (
            <div>
              {/* FILE */}

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

              {/* ROTATION */}

              <div className="mt-8">
                <h2 className="text-xl font-black">
                  Choose rotation
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  The selected rotation will be applied to every page.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      value: 90 as Rotation,
                      label: "90°",
                      icon: "↻",
                    },
                    {
                      value: 180 as Rotation,
                      label: "180°",
                      icon: "⟳",
                    },
                    {
                      value: 270 as Rotation,
                      label: "270°",
                      icon: "↺",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setRotation(option.value)
                      }
                      className={`rounded-2xl border p-6 text-center transition ${
                        rotation === option.value
                          ? "border-orange-500 bg-orange-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/40"
                      }`}
                    >
                      <div
                        className={`text-4xl ${
                          rotation === option.value
                            ? "text-orange-500"
                            : "text-gray-400"
                        }`}
                      >
                        {option.icon}
                      </div>

                      <p className="mt-3 font-black">
                        {option.label}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Rotate pages
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTION */}

              <button
                onClick={rotatePDF}
                disabled={isProcessing}
                className="mt-8 w-full rounded-2xl bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing
                  ? "Rotating PDF..."
                  : `Rotate PDF ${rotation}° →`}
              </button>
            </div>
          )}

          {/* RESULT */}

          {resultBlob && file && (
            <div>
              <div className="rounded-3xl bg-gray-900 p-8 text-white md:p-10">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-3xl">
                    ✓
                  </div>

                  <h2 className="mt-5 text-3xl font-black">
                    PDF rotated successfully
                  </h2>

                  <p className="mt-3 text-gray-400">
                    All pages were rotated by {rotation}°.
                  </p>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">
                      Original file
                    </p>

                    <p className="mt-2 truncate font-bold">
                      {file.name}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">
                      Rotation
                    </p>

                    <p className="mt-2 text-2xl font-black text-orange-400">
                      {rotation}°
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={downloadPDF}
                  className="flex-1 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600"
                >
                  Download Rotated PDF ↓
                </button>

                <button
                  onClick={resetTool}
                  className="rounded-2xl border border-gray-200 bg-white px-6 py-4 font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Rotate Another
                </button>
              </div>
            </div>
          )}

          {/* ERROR */}

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
            This tool processes your PDF directly in your browser.
            MindraInfo does not save your uploaded PDF in its database.
          </p>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">
          <p>
            © 2026 MindraInfo. All rights reserved.
          </p>

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