"use client";

import { useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";

type PdfTextPage = {
  pageNumber: number;
  text: string;
};

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfTextPage[]>([]);
  const [fileName, setFileName] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");

  const readPdf = async (selectedFile: File) => {
    setError("");
    setIsReading(true);
    setPages([]);

    try {
      if (selectedFile.type !== "application/pdf") {
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

      const pdf = await loadingTask.promise;

      const extractedPages: PdfTextPage[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const textContent = await page.getTextContent();

        const text = textContent.items
          .map((item) => {
            if ("str" in item) {
              return item.str;
            }

            return "";
          })
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        extractedPages.push({
          pageNumber,
          text,
        });
      }

      setFile(selectedFile);
      setFileName(selectedFile.name.replace(/\.pdf$/i, ""));
      setPages(extractedPages);

      if (extractedPages.every((page) => !page.text)) {
        setError(
          "No selectable text was found in this PDF. It may be a scanned/image-only PDF."
        );
      }
    } catch (err) {
      console.error("PDF reading error:", err);

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
      readPdf(selectedFile);
    }

    event.target.value = "";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      readPdf(droppedFile);
    }
  };

  const convertToWord = async () => {
    if (!pages.length) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const children: Paragraph[] = [];

      pages.forEach((page) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Page ${page.pageNumber}`,
                bold: true,
                size: 24,
              }),
            ],
            spacing: {
              before: 240,
              after: 180,
            },
          })
        );

        if (page.text) {
          const paragraphs = page.text
            .split(/\n+/)
            .map((text) => text.trim())
            .filter(Boolean);

          paragraphs.forEach((text) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text,
                    size: 22,
                  }),
                ],
                spacing: {
                  after: 160,
                  line: 280,
                },
              })
            );
          });
        } else {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "[No selectable text found on this page]",
                  italics: true,
                  size: 20,
                }),
              ],
              spacing: {
                after: 160,
              },
            })
          );
        }
      });

      const wordDocument = new Document({
        sections: [
          {
            properties: {},
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(wordDocument);

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName || "converted-document"}.docx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Word conversion error:", err);

      setError(
        "Something went wrong while creating the Word document."
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

  const totalCharacters = pages.reduce(
    (total, page) => total + page.text.length,
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
                x="8"
                y="5"
                width="32"
                height="38"
                rx="5"
                fill="#2563EB"
              />

              <path
                d="M15 14H32M15 20H32M15 26H32M15 32H27"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            PDF to Word Converter
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Extract text from your PDF and convert it into an editable
            Microsoft Word document.
          </p>
        </section>

        {/* Main card */}
        <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_25px_70px_rgba(15,23,42,0.10)] backdrop-blur">

          <div className="border-b border-slate-100 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <svg
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M8 13h8M8 17h6" />
                </svg>
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Upload your PDF
                </h2>

                <p className="text-xs text-slate-500">
                  Your file is processed directly in your browser
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">

            {/* Upload */}
            {!file && !isReading && (
              <label
                htmlFor="pdf-file"
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={handleDrop}
                className="group flex min-h-[270px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center transition-all hover:border-blue-400 hover:bg-blue-50/40"
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
                    className="h-8 w-8 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M12 16V4" />
                    <path d="M8 8l4-4 4 4" />
                    <path d="M5 20h14" />
                  </svg>
                </div>

                <h3 className="text-base font-semibold text-slate-800">
                  Drop your PDF here
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  or{" "}
                  <span className="font-semibold text-blue-600">
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
              <div className="flex min-h-[270px] flex-col items-center justify-center rounded-[24px] border border-blue-100 bg-blue-50/50">
                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                <p className="font-semibold text-slate-800">
                  Reading your PDF...
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Extracting text from the document
                </p>
              </div>
            )}

            {/* File selected */}
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
                        {totalCharacters.toLocaleString()} characters
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

                {/* Output filename */}
                <div className="mt-6">
                  <label
                    htmlFor="word-name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Word file name
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                    <input
                      id="word-name"
                      type="text"
                      value={fileName}
                      onChange={(event) =>
                        setFileName(event.target.value)
                      }
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-800 outline-none"
                    />

                    <div className="flex items-center border-l border-slate-100 bg-slate-50 px-4 text-sm font-medium text-slate-400">
                      .docx
                    </div>
                  </div>
                </div>

                {/* Convert */}
                <button
                  type="button"
                  onClick={convertToWord}
                  disabled={isConverting || !pages.length}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConverting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Creating Word document...
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

                      Convert to Word
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

        {/* Feature cards */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">

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
              Simple conversion
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Upload a PDF and create an editable Word document.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <svg
                className="h-5 w-5 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              Browser processing
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Text extraction happens directly in your browser.
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
              Editable output
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Download the extracted content as a standard .docx file.
            </p>
          </div>

        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Best results are obtained with PDFs containing selectable text.
          Scanned PDFs require OCR and are not supported yet.
        </p>

      </div>
    </main>
  );
}