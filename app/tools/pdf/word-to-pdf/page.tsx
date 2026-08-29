"use client";

import { useState } from "react";
import * as mammoth from "mammoth";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 50,
    paddingRight: 50,
    fontFamily: "Helvetica",
    color: "#1e293b",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0f172a",
  },

  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
  },
});

type PdfDocumentProps = {
  title: string;
  paragraphs: string[];
};

function PdfDocument({ title, paragraphs }: PdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>{title || "Document"}</Text>

        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <Text key={index} style={pdfStyles.paragraph}>
              {paragraph}
            </Text>
          ))
        ) : (
          <Text style={pdfStyles.paragraph}>
            No readable text was found in this document.
          </Text>
        )}
      </Page>
    </Document>
  );
}

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");

  const readWordFile = async (selectedFile: File) => {
    setError("");
    setIsReading(true);

    try {
      const extension = selectedFile.name
        .split(".")
        .pop()
        ?.toLowerCase();

      if (extension !== "docx") {
        setError(
          "Please select a Microsoft Word .docx file. Older .doc files are not supported by this browser-based converter."
        );
        setFile(null);
        setParagraphs([]);
        return;
      }

      const arrayBuffer = await selectedFile.arrayBuffer();

      const result = await mammoth.extractRawText({
        arrayBuffer,
      });

      const extractedParagraphs = result.value
        .split(/\r?\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

      setFile(selectedFile);
      setTitle(selectedFile.name.replace(/\.docx$/i, ""));
      setParagraphs(extractedParagraphs);

      if (extractedParagraphs.length === 0) {
        setError(
          "The Word document was opened, but no readable text was found."
        );
      }
    } catch (err) {
      console.error("Word document reading error:", err);

      setFile(null);
      setParagraphs([]);
      setError(
        "We couldn't read this Word document. Please make sure it is a valid .docx file."
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
      readWordFile(selectedFile);
    }

    event.target.value = "";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      readWordFile(droppedFile);
    }
  };

  const handleConvert = async () => {
    if (!paragraphs.length) {
      setError("Please upload a Word document first.");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const blob = await pdf(
        <PdfDocument
          title={title}
          paragraphs={paragraphs}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${title || "document"}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF conversion error:", err);

      setError(
        "Something went wrong while creating the PDF. Please try again."
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setTitle("");
    setParagraphs([]);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef4ff_45%,#f8fafc_100%)] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Page heading */}
        <section className="mb-8 text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-white shadow-[0_12px_35px_rgba(37,99,235,0.14)] ring-1 ring-slate-200">
            <svg
              viewBox="0 0 48 48"
              className="h-9 w-9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="11"
                y="5"
                width="26"
                height="38"
                rx="5"
                fill="#2563EB"
              />
              <path
                d="M18 15H30M18 21H30M18 27H27"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M18 34H24"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Word to PDF Converter
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Convert your Microsoft Word documents into clean PDF files
            quickly and securely.
          </p>
        </section>

        {/* Main converter card */}
        <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_25px_70px_rgba(15,23,42,0.10)] backdrop-blur">

          {/* Top bar */}
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
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  />
                  <path d="M14 2v6h6" />
                  <path d="M8 13h8M8 17h6" />
                </svg>
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Upload your Word document
                </h2>

                <p className="text-xs text-slate-500">
                  Your document is processed in your browser
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">

            {/* Upload area */}
            {!file && (
              <label
                htmlFor="word-file"
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`group relative flex min-h-[270px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 scale-[1.01]"
                    : "border-slate-200 bg-slate-50/70 hover:border-blue-400 hover:bg-blue-50/40"
                }`}
              >
                <input
                  id="word-file"
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-transform duration-200 group-hover:-translate-y-1">
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
                    <path d="M5 20v-3" />
                    <path d="M19 20v-3" />
                  </svg>
                </div>

                <h3 className="text-base font-semibold text-slate-800">
                  Drop your Word file here
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  or{" "}
                  <span className="font-semibold text-blue-600">
                    browse from your device
                  </span>
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
                  <span className="font-semibold text-blue-600">
                    .DOCX
                  </span>
                  Microsoft Word document
                </div>
              </label>
            )}

            {/* Reading state */}
            {isReading && (
              <div className="flex min-h-[270px] flex-col items-center justify-center rounded-[24px] border border-blue-100 bg-blue-50/50">
                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                <p className="font-semibold text-slate-800">
                  Reading your document...
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Please wait a moment
                </p>
              </div>
            )}

            {/* Selected file */}
            {file && !isReading && (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5 sm:p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
                      <svg
                        className="h-7 w-7 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                        <path d="M8 13h8M8 17h6" />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Word document
                      </p>

                      <p className="mt-1 truncate font-semibold text-slate-800">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB
                        {" • "}
                        {paragraphs.length} text sections detected
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemove}
                    className="self-start rounded-xl px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 sm:self-center"
                  >
                    Remove
                  </button>
                </div>

                {/* PDF title */}
                <div className="mt-6">
                  <label
                    htmlFor="pdf-title"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    PDF file name
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                    <input
                      id="pdf-title"
                      type="text"
                      value={title}
                      onChange={(event) =>
                        setTitle(event.target.value)
                      }
                      placeholder="Enter PDF file name"
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                    <div className="flex items-center border-l border-slate-100 bg-slate-50 px-4 text-sm font-medium text-slate-400">
                      .pdf
                    </div>
                  </div>
                </div>

                {/* Convert button */}
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={isConverting || !paragraphs.length}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConverting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Creating your PDF...
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
                      Convert to PDF
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
              Easy to use
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Upload your Word document and convert it in a few clicks.
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
              Your document is processed locally in the browser.
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
                <path d="M9 13h6M9 17h4M14 3v4h4" />
              </svg>
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              PDF output
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Download a clean A4 PDF directly to your device.
            </p>
          </div>
        </section>

        {/* Supported format note */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Currently supports Microsoft Word .DOCX files.
        </p>
      </div>
    </main>
  );
}