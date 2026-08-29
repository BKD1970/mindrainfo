"use client";

import Link from "next/link";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import SiteHeader from "@/components/SiteHeader";

type PageItem = {
  id: string;
  originalIndex: number;
  thumbnail: string;
  selected: boolean;
};

export default function OrganizePDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  /*
   * Render the actual PDF pages using PDF.js.
   */
  const renderPDFPages = async (selectedFile: File) => {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const workerUrl =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs";

    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

    const arrayBuffer = await selectedFile.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
    });

    const pdf = await loadingTask.promise;

    const renderedPages: PageItem[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const baseViewport = page.getViewport({
        scale: 1,
      });

      const targetWidth = 320;

      const scale =
        targetWidth / baseViewport.width;

      const viewport = page.getViewport({
        scale,
      });

      const canvas = document.createElement("canvas");

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to create PDF preview.");
      }

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      await page.render({
        canvas,
        canvasContext: context,
        viewport,
      }).promise;

      renderedPages.push({
        id: `${Date.now()}-${i}`,
        originalIndex: i - 1,
        thumbnail: canvas.toDataURL("image/jpeg", 0.85),
        selected: true,
      });
    }

    return renderedPages;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");
    setResultBlob(null);
    setPages([]);

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setError("Please select a valid PDF file.");
      return;
    }

    try {
      setIsLoading(true);
      setFile(selectedFile);

      const renderedPages = await renderPDFPages(
        selectedFile
      );

      setPages(renderedPages);
    } catch (err) {
      console.error(err);

      setFile(null);
      setPages([]);

      setError(
        "Unable to read or render this PDF. The file may be damaged, protected, or unsupported."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePageSelection = (index: number) => {
    setPages((currentPages) =>
      currentPages.map((page, i) =>
        i === index
          ? {
              ...page,
              selected: !page.selected,
            }
          : page
      )
    );
  };

  const deletePage = (index: number) => {
    setPages((currentPages) =>
      currentPages.filter((_, i) => i !== index)
    );
  };

  const selectAll = () => {
    setPages((currentPages) =>
      currentPages.map((page) => ({
        ...page,
        selected: true,
      }))
    );
  };

  const deselectAll = () => {
    setPages((currentPages) =>
      currentPages.map((page) => ({
        ...page,
        selected: false,
      }))
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    event.preventDefault();

    if (
      draggedIndex === null ||
      draggedIndex === targetIndex
    ) {
      return;
    }

    setPages((currentPages) => {
      const updatedPages = [...currentPages];

      const [movedPage] = updatedPages.splice(
        draggedIndex,
        1
      );

      updatedPages.splice(targetIndex, 0, movedPage);

      return updatedPages;
    });

    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const organizePDF = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    const selectedPages = pages.filter(
      (page) => page.selected
    );

    if (selectedPages.length === 0) {
      setError("Please select at least one page.");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");
      setResultBlob(null);

      const arrayBuffer = await file.arrayBuffer();

      const sourcePDF = await PDFDocument.load(
        arrayBuffer
      );

      const outputPDF = await PDFDocument.create();

      const pageIndexes = selectedPages.map(
        (page) => page.originalIndex
      );

      const copiedPages = await outputPDF.copyPages(
        sourcePDF,
        pageIndexes
      );

      copiedPages.forEach((page) => {
        outputPDF.addPage(page);
      });

      const pdfBytes = await outputPDF.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const safeBuffer = new ArrayBuffer(
        pdfBytes.byteLength
      );

      new Uint8Array(safeBuffer).set(pdfBytes);

      const blob = new Blob([safeBuffer], {
        type: "application/pdf",
      });

      setResultBlob(blob);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to organize this PDF. Please try another file."
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
    )}-organized.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setFile(null);
    setPages([]);
    setResultBlob(null);
    setError("");
    setIsLoading(false);
    setIsProcessing(false);
    setDraggedIndex(null);
  };

  const selectedCount = pages.filter(
    (page) => page.selected
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">
      <SiteHeader />

      {/* HERO */}

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-orange-300/20 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <Link
            href="/tools/pdf"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-500"
          >
            ← Back to PDF Tools
          </Link>

          <div className="mx-auto mt-10 max-w-3xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-orange-100 text-4xl shadow-sm">
              📑
            </div>

            <h1 className="mt-7 text-5xl font-black tracking-tight md:text-6xl">
              Organize PDF
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Reorder, select and remove PDF pages before
              downloading your organized document.
            </p>
          </div>
        </div>
      </section>

      {/* TOOL */}

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xl md:p-10">

          {/* UPLOAD */}

          {!file && !isLoading && (
            <label className="group flex min-h-[330px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-gray-300 bg-gray-50 px-6 text-center transition hover:border-orange-400 hover:bg-orange-50/40">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm transition group-hover:scale-105">
                📄
              </div>

              <h2 className="mt-6 text-2xl font-black">
                Select a PDF file
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                Upload a PDF and organize its pages directly
                in your browser.
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

          {/* LOADING */}

          {isLoading && (
            <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

              <h2 className="mt-6 text-xl font-black">
                Rendering your PDF...
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Preparing previews of every page.
              </p>
            </div>
          )}

          {/* PAGES */}

          {file && pages.length > 0 && !resultBlob && (
            <div>

              {/* FILE INFO */}

              <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                    📄
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold">
                      {file.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {pages.length} pages ·{" "}
                      {formatSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetTool}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:text-red-500"
                >
                  Remove PDF
                </button>
              </div>

              {/* TOOLBAR */}

              <div className="mt-8 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    Organize pages
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Drag pages to reorder them. Click the
                    checkmark to include or exclude a page.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={selectAll}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
                  >
                    Select All
                  </button>

                  <button
                    onClick={deselectAll}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* ACTUAL PDF PAGE PREVIEWS */}

              <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {pages.map((page, index) => (
                  <div
                    key={page.id}
                    draggable
                    onDragStart={() =>
                      handleDragStart(index)
                    }
                    onDragOver={(event) =>
                      handleDragOver(event, index)
                    }
                    onDragEnd={handleDragEnd}
                    className={`group relative rounded-2xl border bg-white p-3 shadow-sm transition ${
                      draggedIndex === index
                        ? "scale-95 border-orange-500 opacity-50"
                        : page.selected
                        ? "border-gray-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
                        : "border-gray-200 opacity-45"
                    }`}
                  >

                    {/* CHECK */}

                    <button
                      onClick={() =>
                        togglePageSelection(index)
                      }
                      className={`absolute left-5 top-5 z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-black shadow-md ${
                        page.selected
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-gray-300 bg-white text-transparent"
                      }`}
                      aria-label={
                        page.selected
                          ? "Deselect page"
                          : "Select page"
                      }
                    >
                      ✓
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() => deletePage(index)}
                      className="absolute right-4 top-4 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-400 opacity-0 shadow-md transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                      aria-label="Delete page"
                    >
                      ×
                    </button>

                    {/* REAL PDF PREVIEW */}

                    <div className="overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={page.thumbnail}
                        alt={`PDF page ${index + 1}`}
                        className="block h-auto w-full"
                        draggable={false}
                      />
                    </div>

                    {/* PAGE NUMBER */}

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm font-black">
                        Page {index + 1}
                      </p>

                      <span className="cursor-grab text-lg leading-none text-gray-400">
                        ⋮⋮
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      Original page{" "}
                      {page.originalIndex + 1}
                    </p>
                  </div>
                ))}
              </div>

              {/* SUMMARY */}

              <div className="mt-10 rounded-2xl bg-gray-50 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-bold">
                    {selectedCount} of {pages.length} pages
                    selected
                  </p>

                  <p className="text-sm text-gray-500">
                    Drag & drop pages to change their order
                  </p>
                </div>
              </div>

              {/* ORGANIZE */}

              <button
                onClick={organizePDF}
                disabled={
                  isProcessing ||
                  selectedCount === 0
                }
                className="mt-8 w-full rounded-2xl bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing
                  ? "Organizing PDF..."
                  : "Organize & Download PDF →"}
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
                    PDF organized successfully
                  </h2>

                  <p className="mt-3 text-gray-400">
                    Your selected pages have been arranged
                    in the order you chose.
                  </p>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">
                      Pages included
                    </p>

                    <p className="mt-2 text-2xl font-black">
                      {selectedCount}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">
                      Original file
                    </p>

                    <p className="mt-2 truncate font-bold">
                      {file.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={downloadPDF}
                  className="flex-1 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600"
                >
                  Download Organized PDF ↓
                </button>

                <button
                  onClick={resetTool}
                  className="rounded-2xl border border-gray-200 bg-white px-6 py-4 font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Organize Another
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
            Your PDF is processed directly in your browser.
            MindraInfo does not save uploaded files in its
            database.
          </p>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">
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