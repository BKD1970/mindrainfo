"use client";

import Link from "next/link";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import SiteHeader from "@/components/SiteHeader";

type SplitMode = "all" | "range" | "selected";

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const [splitMode, setSplitMode] = useState<SplitMode>("range");

  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  const [selectedPages, setSelectedPages] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD PDF
  ========================================================= */

  const loadPDF = async (selectedFile: File | null) => {
    if (!selectedFile) return;

    setError("");

    const isPDF =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();

      const pdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: false,
      });

      const count = pdf.getPageCount();

      setFile(selectedFile);
      setPageCount(count);

      setStartPage(1);
      setEndPage(count);
      setSelectedPages("");

    } catch (err) {
      console.error(err);

      setFile(null);
      setPageCount(0);

      setError(
        "This PDF could not be opened. It may be damaged, encrypted, or unsupported."
      );
    }
  };

  /* =========================================================
     CLEAR FILE
  ========================================================= */

  const clearFile = () => {
    setFile(null);
    setPageCount(0);
    setStartPage(1);
    setEndPage(1);
    setSelectedPages("");
    setError("");
  };

  /* =========================================================
     FILE SIZE
  ========================================================= */

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  /* =========================================================
     PARSE SELECTED PAGES
  ========================================================= */

  const getSelectedPageIndexes = (): number[] => {
    if (splitMode === "all") {
      return Array.from({ length: pageCount }, (_, index) => index);
    }

    if (splitMode === "range") {
      const start = Math.max(1, Math.min(startPage, pageCount));
      const end = Math.max(start, Math.min(endPage, pageCount));

      return Array.from(
        { length: end - start + 1 },
        (_, index) => start - 1 + index
      );
    }

    const pages = selectedPages
      .split(",")
      .map((value) => Number(value.trim()))
      .filter(
        (value) =>
          Number.isInteger(value) &&
          value >= 1 &&
          value <= pageCount
      );

    return [...new Set(pages)].map((page) => page - 1);
  };

  /* =========================================================
     SPLIT PDF
  ========================================================= */

  const splitPDF = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setError("");

    const pageIndexes = getSelectedPageIndexes();

    if (pageIndexes.length === 0) {
      setError("Please select at least one valid page.");
      return;
    }

    if (splitMode === "range" && startPage > endPage) {
      setError("The starting page cannot be greater than the ending page.");
      return;
    }

    if (
      splitMode === "selected" &&
      selectedPages.trim() === ""
    ) {
      setError("Enter the page numbers you want to extract.");
      return;
    }

    setIsProcessing(true);

    try {
      const sourceBytes = await file.arrayBuffer();

      const sourcePDF = await PDFDocument.load(sourceBytes, {
        ignoreEncryption: false,
      });

      /*
       * If the user selected a single range/all pages,
       * create one output PDF.
       */

      const outputPDF = await PDFDocument.create();

      const copiedPages = await outputPDF.copyPages(
        sourcePDF,
        pageIndexes
      );

      copiedPages.forEach((page) => {
        outputPDF.addPage(page);
      });

      const outputBytes = await outputPDF.save();

      /*
       * Convert Uint8Array to a normal ArrayBuffer
       * for TypeScript/Blob compatibility.
       */

      const outputBuffer = new ArrayBuffer(outputBytes.byteLength);

      new Uint8Array(outputBuffer).set(outputBytes);

      const blob = new Blob([outputBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = getOutputFileName();

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to split this PDF. The file may be damaged, encrypted, or unsupported."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /* =========================================================
     OUTPUT FILE NAME
  ========================================================= */

  const getOutputFileName = () => {
    if (!file) return "split-pdf.pdf";

    const originalName = file.name.replace(/\.pdf$/i, "");

    if (splitMode === "range") {
      return `${originalName}-pages-${startPage}-${endPage}.pdf`;
    }

    if (splitMode === "selected") {
      return `${originalName}-selected-pages.pdf`;
    }

    return `${originalName}-split.pdf`;
  };

  /* =========================================================
     SELECTED PAGE TEXT
  ========================================================= */

  const selectedPageIndexes = getSelectedPageIndexes();

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">
      <SiteHeader />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-orange-300/25 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 pb-10 pt-20 md:pt-28">
          <Link
            href="/tools/pdf"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-500"
          >
            ← Back to PDF Tools
          </Link>

          <div className="mt-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 text-4xl shadow-sm">
              ✂️
            </div>

            <h1 className="mt-7 text-5xl font-black tracking-tight md:text-6xl">
              Split PDF
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Extract the pages you need from a PDF and download them as a
              new document.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          TOOL
      ===================================================== */}

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xl md:p-10">
          {!file ? (
            /* =================================================
               UPLOAD
            ================================================= */

            <label
              htmlFor="pdf-upload"
              className="group flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center transition hover:border-orange-400 hover:bg-orange-50/40"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl shadow-sm transition group-hover:scale-105">
                📤
              </div>

              <h2 className="mt-6 text-2xl font-black">
                Select a PDF
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                Upload one PDF document and choose which pages you want to
                extract.
              </p>

              <span className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition group-hover:bg-orange-600">
                Choose PDF
              </span>

              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(event) => {
                  loadPDF(event.target.files?.[0] || null);
                  event.currentTarget.value = "";
                }}
              />
            </label>
          ) : (
            <>
              {/* =================================================
                 FILE INFORMATION
              ================================================= */}

              <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-2xl">
                  📄
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {pageCount}{" "}
                    {pageCount === 1 ? "page" : "pages"} ·{" "}
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearFile}
                  className="rounded-xl px-4 py-2 text-sm font-bold text-gray-500 transition hover:bg-red-50 hover:text-red-500"
                >
                  Remove
                </button>
              </div>

              {/* =================================================
                 SPLIT OPTIONS
              ================================================= */}

              <div className="mt-8">
                <h2 className="text-2xl font-black">
                  Choose pages
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Select how you want to extract pages from your PDF.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {/* ALL */}

                  <button
                    type="button"
                    onClick={() => setSplitMode("all")}
                    className={`rounded-2xl border p-5 text-left transition ${
                      splitMode === "all"
                        ? "border-orange-400 bg-orange-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-orange-200"
                    }`}
                  >
                    <div className="text-2xl">📚</div>

                    <h3 className="mt-4 font-black">
                      All Pages
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Create a new PDF containing every page.
                    </p>
                  </button>

                  {/* RANGE */}

                  <button
                    type="button"
                    onClick={() => setSplitMode("range")}
                    className={`rounded-2xl border p-5 text-left transition ${
                      splitMode === "range"
                        ? "border-orange-400 bg-orange-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-orange-200"
                    }`}
                  >
                    <div className="text-2xl">↔️</div>

                    <h3 className="mt-4 font-black">
                      Page Range
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Extract a continuous range such as pages 3–8.
                    </p>
                  </button>

                  {/* SELECTED */}

                  <button
                    type="button"
                    onClick={() => setSplitMode("selected")}
                    className={`rounded-2xl border p-5 text-left transition ${
                      splitMode === "selected"
                        ? "border-orange-400 bg-orange-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-orange-200"
                    }`}
                  >
                    <div className="text-2xl">🔢</div>

                    <h3 className="mt-4 font-black">
                      Selected Pages
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Enter individual pages such as 1, 4, 7.
                    </p>
                  </button>
                </div>

                {/* =================================================
                   RANGE INPUT
                ================================================= */}

                {splitMode === "range" && (
                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold">
                        From page
                      </label>

                      <input
                        type="number"
                        min={1}
                        max={pageCount}
                        value={startPage}
                        onChange={(event) =>
                          setStartPage(
                            Math.max(
                              1,
                              Math.min(
                                pageCount,
                                Number(event.target.value)
                              )
                            )
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 font-bold outline-none transition focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold">
                        To page
                      </label>

                      <input
                        type="number"
                        min={1}
                        max={pageCount}
                        value={endPage}
                        onChange={(event) =>
                          setEndPage(
                            Math.max(
                              1,
                              Math.min(
                                pageCount,
                                Number(event.target.value)
                              )
                            )
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 font-bold outline-none transition focus:border-orange-500"
                      />
                    </div>
                  </div>
                )}

                {/* =================================================
                   SELECTED PAGES INPUT
                ================================================= */}

                {splitMode === "selected" && (
                  <div className="mt-7">
                    <label className="text-sm font-bold">
                      Page numbers
                    </label>

                    <input
                      type="text"
                      value={selectedPages}
                      onChange={(event) =>
                        setSelectedPages(event.target.value)
                      }
                      placeholder="Example: 1, 3, 5, 8"
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 font-semibold outline-none transition focus:border-orange-500"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Enter page numbers separated by commas.
                    </p>
                  </div>
                )}
              </div>

              {/* =================================================
                 PREVIEW SUMMARY
              ================================================= */}

              <div className="mt-8 rounded-2xl bg-gray-900 p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                  Selection
                </p>

                <p className="mt-3 text-xl font-black">
                  {selectedPageIndexes.length}{" "}
                  {selectedPageIndexes.length === 1
                    ? "page"
                    : "pages"}{" "}
                  selected
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  {splitMode === "all"
                    ? `Pages 1–${pageCount}`
                    : splitMode === "range"
                    ? `Pages ${startPage}–${endPage}`
                    : selectedPages || "No pages selected"}
                </p>
              </div>

              {/* =================================================
                 ERROR
              ================================================= */}

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              {/* =================================================
                 SPLIT BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={splitPDF}
                disabled={isProcessing || selectedPageIndexes.length === 0}
                className="mt-8 flex w-full items-center justify-center rounded-2xl bg-orange-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                {isProcessing ? (
                  <>
                    <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Preparing PDF...
                  </>
                ) : (
                  <>Split PDF →</>
                )}
              </button>
            </>
          )}

          {/* =================================================
             PRIVACY
          ================================================= */}

          <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
            <div className="flex gap-3">
              <div className="text-xl">🔒</div>

              <div>
                <p className="font-bold text-green-800">
                  Your files stay on your device
                </p>

                <p className="mt-1 text-sm leading-6 text-green-700">
                  This tool processes your PDF directly in your browser.
                  Your file is not uploaded to or stored in the MindraInfo
                  database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INFORMATION
      ===================================================== */}

      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
              <div className="text-2xl">📄</div>

              <h3 className="mt-5 text-lg font-black">
                Extract Pages
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Extract a specific range or individual pages from a PDF.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
              <div className="text-2xl">⚡</div>

              <h3 className="mt-5 text-lg font-black">
                Browser Processing
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your document is processed locally instead of being stored
                on the website.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
              <div className="text-2xl">⬇️</div>

              <h3 className="mt-5 text-lg font-black">
                Download Instantly
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Generate the new PDF and download it immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-gray-200 bg-[#f7f7f4]">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">
          <p>© 2026 MindraInfo. All rights reserved.</p>

          <Link
            href="/tools/pdf"
            className="font-semibold text-orange-500 transition hover:text-orange-600"
          >
            PDF Tools →
          </Link>
        </div>
      </footer>
    </main>
  );
}