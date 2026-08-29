"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { PDFDocument } from "pdf-lib";

type PDFFile = {
  id: string;
  file: File;
};

export default function MergePDFPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  /* =========================================================
     FILE SELECTION
  ========================================================= */

  const addFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setError("");

    const incomingFiles = Array.from(selectedFiles);

    const invalidFiles = incomingFiles.filter(
      (file) =>
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    );

    if (invalidFiles.length > 0) {
      setError("Only PDF files can be added.");
      return;
    }

    const newFiles: PDFFile[] = incomingFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
    }));

    setFiles((current) => [...current, ...newFiles]);
  };

  /* =========================================================
     REMOVE FILE
  ========================================================= */

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((item) => item.id !== id));
    setError("");
  };

  /* =========================================================
     CLEAR ALL
  ========================================================= */

  const clearAll = () => {
    setFiles([]);
    setError("");
  };

  /* =========================================================
     DRAG & DROP REORDER
  ========================================================= */

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();

    if (draggedIndex === null || draggedIndex === index) return;

    setFiles((current) => {
      const updated = [...current];

      const draggedItem = updated[draggedIndex];

      updated.splice(draggedIndex, 1);
      updated.splice(index, 0, draggedItem);

      return updated;
    });

    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  /* =========================================================
     FORMAT FILE SIZE
  ========================================================= */

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  /* =========================================================
     MERGE PDFs
  ========================================================= */

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError("Please add at least two PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setError("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();

        const sourcePdf = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: false,
        });

        const pageIndexes = sourcePdf
          .getPages()
          .map((_, index) => index);

        const copiedPages = await mergedPdf.copyPages(
          sourcePdf,
          pageIndexes
        );

        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedBytes = await mergedPdf.save();

const pdfBuffer = new ArrayBuffer(mergedBytes.byteLength);
new Uint8Array(pdfBuffer).set(mergedBytes);

const blob = new Blob([pdfBuffer], {
  type: "application/pdf",
});

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "merged-mindrainfo.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to merge these PDFs. One or more files may be damaged, encrypted, or unsupported."
      );
    } finally {
      setIsMerging(false);
    }
  };

  /* =========================================================
     TOTAL SIZE
  ========================================================= */

  const totalSize = files.reduce(
    (total, item) => total + item.file.size,
    0
  );

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
              📄
            </div>

            <h1 className="mt-7 text-5xl font-black tracking-tight md:text-6xl">
              Merge PDF
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Combine multiple PDF files into one document. Arrange them in
              your preferred order and download the merged PDF instantly.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN TOOL
      ===================================================== */}

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xl md:p-10">
          {/* UPLOAD AREA */}

          <label
            htmlFor="pdf-upload"
            className="group flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center transition hover:border-orange-400 hover:bg-orange-50/40"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl shadow-sm transition group-hover:scale-105">
              📤
            </div>

            <h2 className="mt-6 text-2xl font-black">
              Select PDF files
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
              Drag and drop PDFs here or click to browse your computer.
              You can select multiple PDF files.
            </p>

            <span className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition group-hover:bg-orange-600">
              Choose PDF Files
            </span>

            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf,.pdf"
              multiple
              className="hidden"
              onChange={(event) => {
                addFiles(event.target.files);
                event.currentTarget.value = "";
              }}
            />
          </label>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* FILE LIST */}

          {files.length > 0 && (
            <div className="mt-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-black">
                    Your PDF files
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {files.length}{" "}
                    {files.length === 1 ? "file" : "files"} ·{" "}
                    {formatFileSize(totalSize)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearAll}
                  className="text-sm font-bold text-gray-500 transition hover:text-red-500"
                >
                  Clear all
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {files.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(event) =>
                      handleDragOver(event, index)
                    }
                    onDragEnd={handleDragEnd}
                    className={`flex cursor-grab items-center gap-4 rounded-2xl border bg-white p-4 transition active:cursor-grabbing ${
                      draggedIndex === index
                        ? "border-orange-400 bg-orange-50 shadow-md"
                        : "border-gray-200 hover:border-orange-200 hover:shadow-sm"
                    }`}
                  >
                    {/* ORDER */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-black text-gray-500">
                      {index + 1}
                    </div>

                    {/* PDF ICON */}

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl">
                      📄
                    </div>

                    {/* NAME */}

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">
                        {item.file.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatFileSize(item.file.size)}
                      </p>
                    </div>

                    {/* DRAG */}

                    <div
                      className="hidden text-gray-300 sm:block"
                      title="Drag to reorder"
                    >
                      ⋮⋮
                    </div>

                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={() => removeFile(item.id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove ${item.file.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* ADD MORE */}

              <label
                htmlFor="add-more-pdfs"
                className="mt-5 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 px-5 py-3.5 text-sm font-bold text-gray-600 transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-500"
              >
                + Add more PDF files

                <input
                  id="add-more-pdfs"
                  type="file"
                  accept="application/pdf,.pdf"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    addFiles(event.target.files);
                    event.currentTarget.value = "";
                  }}
                />
              </label>

              {/* MERGE BUTTON */}

              <button
                type="button"
                onClick={mergePDFs}
                disabled={isMerging || files.length < 2}
                className="mt-8 flex w-full items-center justify-center rounded-2xl bg-orange-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                {isMerging ? (
                  <>
                    <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Merging PDFs...
                  </>
                ) : (
                  <>Merge PDF →</>
                )}
              </button>

              {files.length < 2 && (
                <p className="mt-3 text-center text-xs text-gray-400">
                  Add at least two PDF files to merge.
                </p>
              )}
            </div>
          )}

          {/* PRIVACY */}

          <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
            <div className="flex gap-3">
              <div className="text-xl">🔒</div>

              <div>
                <p className="font-bold text-green-800">
                  Your files stay on your device
                </p>

                <p className="mt-1 text-sm leading-6 text-green-700">
                  This tool processes your PDFs directly in your browser.
                  Your files are not uploaded to the MindraInfo database.
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
              <div className="text-2xl">📑</div>

              <h3 className="mt-5 text-lg font-black">
                Multiple PDFs
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Select multiple PDF documents and combine them into a
                single file.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
              <div className="text-2xl">↕️</div>

              <h3 className="mt-5 text-lg font-black">
                Reorder Pages
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Arrange your documents before merging by dragging them
                into the required order.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-7">
              <div className="text-2xl">⚡</div>

              <h3 className="mt-5 text-lg font-black">
                Instant Download
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Generate and download the merged PDF without creating
                an account.
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