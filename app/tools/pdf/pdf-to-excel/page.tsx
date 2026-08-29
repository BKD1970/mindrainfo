"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

type ExtractedPage = {
  pageNumber: number;
  rows: string[][];
};

export default function PdfToExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<ExtractedPage[]>([]);
  const [fileName, setFileName] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");

  const extractPdfData = async (selectedFile: File) => {
    setError("");
    setIsReading(true);
    setPages([]);

    try {
      if (
        selectedFile.type !== "application/pdf" &&
        !selectedFile.name.toLowerCase().endsWith(".pdf")
      ) {
        throw new Error("Please select a PDF file.");
      }

      const pdfjsLib = await import("pdfjs-dist");

      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const arrayBuffer = await selectedFile.arrayBuffer();

      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
      });

      const pdfDocument = await loadingTask.promise;

      const extractedPages: ExtractedPage[] = [];

      for (
        let pageNumber = 1;
        pageNumber <= pdfDocument.numPages;
        pageNumber++
      ) {
        const page = await pdfDocument.getPage(pageNumber);

        const textContent = await page.getTextContent();

        const items = textContent.items
          .filter((item) => "str" in item)
          .map((item) => {
            if ("str" in item && "transform" in item) {
              return {
                text: item.str,
                x: item.transform[4],
                y: item.transform[5],
              };
            }

            return {
              text: "",
              x: 0,
              y: 0,
            };
          })
          .filter((item) => item.text.trim());

        const yGroups: {
          y: number;
          items: {
            text: string;
            x: number;
          }[];
        }[] = [];

        items.forEach((item) => {
          const existingGroup = yGroups.find(
            (group) => Math.abs(group.y - item.y) < 5
          );

          if (existingGroup) {
            existingGroup.items.push({
              text: item.text,
              x: item.x,
            });
          } else {
            yGroups.push({
              y: item.y,
              items: [
                {
                  text: item.text,
                  x: item.x,
                },
              ],
            });
          }
        });

        yGroups.sort((a, b) => b.y - a.y);

        const rows = yGroups.map((group) => {
          group.items.sort((a, b) => a.x - b.x);

          return group.items.map((item) => item.text.trim());
        });

        extractedPages.push({
          pageNumber,
          rows,
        });
      }

      setFile(selectedFile);
      setFileName(
        selectedFile.name.replace(/\.pdf$/i, "")
      );
      setPages(extractedPages);

      const hasData = extractedPages.some(
        (page) => page.rows.length > 0
      );

      if (!hasData) {
        setError(
          "No selectable text was found in this PDF. Scanned or image-only PDFs require OCR."
        );
      }
    } catch (err) {
      console.error("PDF extraction error:", err);

      setFile(null);
      setPages([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to read this PDF file."
      );
    } finally {
      setIsReading(false);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      extractPdfData(selectedFile);
    }

    event.target.value = "";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      extractPdfData(droppedFile);
    }
  };

  const convertToExcel = () => {
    if (!pages.length) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const workbook = XLSX.utils.book_new();

      pages.forEach((page) => {
        const worksheetRows = page.rows.map((row) => [...row]);

        const worksheet = XLSX.utils.aoa_to_sheet(
          worksheetRows.length > 0
            ? worksheetRows
            : [["No selectable text found on this page"]]
        );

        const columnWidths: {
          wch: number;
        }[] = [];

        worksheetRows.forEach((row) => {
          row.forEach((cell, index) => {
            const length = String(cell).length;

            if (
              !columnWidths[index] ||
              length > columnWidths[index].wch
            ) {
              columnWidths[index] = {
                wch: Math.min(Math.max(length + 2, 10), 45),
              };
            }
          });
        });

        worksheet["!cols"] = columnWidths;

        let sheetName = `Page ${page.pageNumber}`;

        if (sheetName.length > 31) {
          sheetName = sheetName.substring(0, 31);
        }

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          sheetName
        );
      });

      XLSX.writeFile(
        workbook,
        `${fileName || "converted-document"}.xlsx`
      );
    } catch (err) {
      console.error("Excel conversion error:", err);

      setError(
        "Something went wrong while creating the Excel file."
      );
    } finally {
      setIsConverting(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPages([]);
    setFileName("");
    setError("");
  };

  const totalRows = pages.reduce(
    (total, page) => total + page.rows.length,
    0
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef4ff_45%,#f8fafc_100%)] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Heading */}
        <section className="mb-8 text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-white shadow-[0_12px_35px_rgba(37,99,235,0.14)] ring-1 ring-slate-200">
            <svg
              viewBox="0 0 48 48"
              className="h-9 w-9"
              fill="none"
            >
              <rect
                x="6"
                y="6"
                width="36"
                height="36"
                rx="6"
                fill="#16A34A"
              />

              <path
                d="M14 14H34M14 21H34M14 28H34M14 35H34"
                stroke="white"
                strokeWidth="2"
              />

              <path
                d="M21 10V38M29 10V38"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            PDF to Excel Converter
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Extract table-like data from your PDF and convert it
            into an editable Excel spreadsheet.
          </p>
        </section>

        {/* Main converter */}
        <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_25px_70px_rgba(15,23,42,0.10)] backdrop-blur">

          {/* Top bar */}
          <div className="border-b border-slate-100 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                <svg
                  className="h-5 w-5 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 5h16v14H4z" />
                  <path d="M4 10h16M9 5v14M15 5v14" />
                </svg>
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Upload your PDF
                </h2>

                <p className="text-xs text-slate-500">
                  PDF files with selectable text work best
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">

            {/* Upload area */}
            {!file && !isReading && (
              <label
                htmlFor="pdf-file"
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={handleDrop}
                className="group flex min-h-[270px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center transition-all hover:border-green-400 hover:bg-green-50/40"
              >
                <input
                  id="pdf-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-transform group-hover:-translate-y-1">
                  <svg
                    className="h-8 w-8 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8M8 17h5" />
                  </svg>
                </div>

                <h3 className="text-base font-semibold text-slate-800">
                  Drop your PDF here
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  or{" "}
                  <span className="font-semibold text-green-600">
                    browse from your device
                  </span>
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
                  <span className="font-semibold text-red-500">
                    PDF
                  </span>
                  PDF document
                </div>
              </label>
            )}

            {/* Reading */}
            {isReading && (
              <div className="flex min-h-[270px] flex-col items-center justify-center rounded-[24px] border border-green-100 bg-green-50/50">
                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

                <p className="font-semibold text-slate-800">
                  Reading your PDF...
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Extracting table data
                </p>
              </div>
            )}

            {/* Selected file */}
            {file && !isReading && (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5 sm:p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500 shadow-lg shadow-red-500/20">
                      <span className="text-sm font-bold text-white">
                        PDF
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        PDF document
                      </p>

                      <p className="mt-1 truncate font-semibold text-slate-800">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB
                        {" • "}
                        {pages.length} pages
                        {" • "}
                        {totalRows.toLocaleString()} rows detected
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="self-start rounded-xl px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 sm:self-center"
                  >
                    Remove
                  </button>
                </div>

                {/* File name */}
                <div className="mt-6">
                  <label
                    htmlFor="excel-name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Excel file name
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                    <input
                      id="excel-name"
                      type="text"
                      value={fileName}
                      onChange={(event) =>
                        setFileName(event.target.value)
                      }
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-800 outline-none"
                    />

                    <div className="flex items-center border-l border-slate-100 bg-slate-50 px-4 text-sm font-medium text-slate-400">
                      .xlsx
                    </div>
                  </div>
                </div>

                {/* Convert */}
                <button
                  type="button"
                  onClick={convertToExcel}
                  disabled={isConverting || !pages.length}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConverting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Creating Excel file...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M12 3v12" />
                        <path d="M8 11l4 4 4-4" />
                        <path d="M5 21h14" />
                      </svg>

                      Convert to Excel
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-5 flex gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5M12 16h.01" />
                </svg>

                <p>{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <svg
                className="h-5 w-5 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 5h16v14H4z" />
                <path d="M4 10h16M9 5v14M15 5v14" />
              </svg>
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              Excel output
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Download extracted PDF data as a standard .xlsx file.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <svg
                className="h-5 w-5 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 3v18M3 12h18" />
              </svg>
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              Multiple pages
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Each PDF page is placed into its own Excel worksheet.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
              <svg
                className="h-5 w-5 text-violet-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 3h9l3 3v15H6z" />
                <path d="M14 3v4h4M9 13h6M9 17h4" />
              </svg>
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              Browser based
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              PDF data is extracted directly in your browser.
            </p>
          </div>

        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Best results are obtained from PDFs containing structured,
          selectable text. Scanned PDFs require OCR.
        </p>

      </div>
    </main>
  );
}