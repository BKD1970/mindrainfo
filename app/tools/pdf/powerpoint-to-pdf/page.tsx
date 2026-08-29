"use client";

import { useState } from "react";
import JSZip from "jszip";
import {
  Document as PdfDocument,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

type SlideData = {
  slideNumber: number;
  title: string;
  text: string[];
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 42,
    fontFamily: "Helvetica",
  },

  slideNumber: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 18,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 24,
  },

  text: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#334155",
    marginBottom: 10,
  },

  bullet: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#334155",
    marginBottom: 9,
    paddingLeft: 12,
  },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 42,
    right: 42,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
    fontSize: 8,
    color: "#94a3b8",
  },
});

function PowerPointPdfDocument({
  slides,
  title,
}: {
  slides: SlideData[];
  title: string;
}) {
  return (
    <PdfDocument>
      {slides.map((slide) => (
        <Page
          key={slide.slideNumber}
          size="A4"
          style={styles.page}
        >
          <Text style={styles.slideNumber}>
            Slide {slide.slideNumber}
          </Text>

          <Text style={styles.title}>
            {slide.title || `Slide ${slide.slideNumber}`}
          </Text>

          <View>
            {slide.text.map((text, index) => (
              <Text
                key={index}
                style={
                  text.startsWith("•")
                    ? styles.bullet
                    : styles.text
                }
              >
                {text}
              </Text>
            ))}
          </View>

          <Text style={styles.footer}>
            {title}
          </Text>
        </Page>
      ))}
    </PdfDocument>
  );
}

function extractTextFromXml(xml: string): string[] {
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(
    xml,
    "application/xml"
  );

  const textNodes = Array.from(
    xmlDocument.getElementsByTagName("a:t")
  );

  return textNodes
    .map((node) => node.textContent?.trim() || "")
    .filter(Boolean);
}

export default function PowerPointToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [fileName, setFileName] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");

  const readPowerPoint = async (selectedFile: File) => {
    setError("");
    setIsReading(true);
    setSlides([]);

    try {
      const extension = selectedFile.name
        .split(".")
        .pop()
        ?.toLowerCase();

      if (extension !== "pptx") {
        throw new Error(
          "Please select a PowerPoint .pptx file."
        );
      }

      const arrayBuffer = await selectedFile.arrayBuffer();

      const zip = await JSZip.loadAsync(arrayBuffer);

      const slideFiles = Object.keys(zip.files)
        .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
        .sort((a, b) => {
          const numberA = Number(
            a.match(/slide(\d+)\.xml/i)?.[1] || 0
          );

          const numberB = Number(
            b.match(/slide(\d+)\.xml/i)?.[1] || 0
          );

          return numberA - numberB;
        });

      if (!slideFiles.length) {
        throw new Error(
          "No PowerPoint slides were found in this file."
        );
      }

      const extractedSlides: SlideData[] = [];

      for (let index = 0; index < slideFiles.length; index++) {
        const slideFile = zip.files[slideFiles[index]];

        const xml = await slideFile.async("text");

        const textItems = extractTextFromXml(xml);

        const title = textItems[0] || "";

        const body = textItems.slice(1);

        extractedSlides.push({
          slideNumber: index + 1,
          title,
          text: body,
        });
      }

      setFile(selectedFile);

      setFileName(
        selectedFile.name.replace(/\.pptx$/i, "")
      );

      setSlides(extractedSlides);

      if (
        extractedSlides.every(
          (slide) =>
            !slide.title &&
            slide.text.length === 0
        )
      ) {
        setError(
          "No readable text was found in this PowerPoint presentation."
        );
      }
    } catch (err) {
      console.error("PowerPoint reading error:", err);

      setFile(null);
      setSlides([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to read this PowerPoint file."
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
      readPowerPoint(selectedFile);
    }

    event.target.value = "";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      readPowerPoint(droppedFile);
    }
  };

  const convertToPdf = async () => {
    if (!slides.length) {
      setError(
        "Please upload a PowerPoint presentation first."
      );
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const blob = await pdf(
        <PowerPointPdfDocument
          slides={slides}
          title={fileName || "PowerPoint Presentation"}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${
        fileName || "powerpoint-presentation"
      }.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        "PowerPoint to PDF conversion error:",
        err
      );

      setError(
        "Something went wrong while creating the PDF."
      );
    } finally {
      setIsConverting(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setSlides([]);
    setFileName("");
    setError("");
  };

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
                x="5"
                y="6"
                width="38"
                height="36"
                rx="6"
                fill="#F97316"
              />

              <path
                d="M14 15H34M14 21H34M14 27H28"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <path
                d="M14 34H24"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            PowerPoint to PDF Converter
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Convert the text content of your PowerPoint
            presentation into a clean PDF document directly
            in your browser.
          </p>

        </section>

        {/* Main Card */}
        <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_25px_70px_rgba(15,23,42,0.10)] backdrop-blur">

          {/* Header */}
          <div className="border-b border-slate-100 px-5 py-5 sm:px-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">

                <svg
                  className="h-5 w-5 text-orange-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 5h16v14H4z" />
                  <path d="M8 9h8M8 13h6M8 17h4" />
                </svg>

              </div>

              <div>

                <h2 className="font-semibold text-slate-900">
                  Upload your PowerPoint
                </h2>

                <p className="text-xs text-slate-500">
                  PPTX files are supported
                </p>

              </div>

            </div>

          </div>

          <div className="p-5 sm:p-8">

            {/* Upload */}
            {!file && !isReading && (

              <label
                htmlFor="powerpoint-file"
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={handleDrop}
                className="group flex min-h-[270px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center transition-all hover:border-orange-400 hover:bg-orange-50/40"
              >

                <input
                  id="powerpoint-file"
                  type="file"
                  accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-transform group-hover:-translate-y-1">

                  <svg
                    className="h-8 w-8 text-orange-600"
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
                  Drop your PowerPoint here
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  or{" "}
                  <span className="font-semibold text-orange-600">
                    browse from your device
                  </span>
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">

                  <span className="font-semibold text-orange-600">
                    PPTX
                  </span>

                  PowerPoint presentation

                </div>

              </label>

            )}

            {/* Reading */}
            {isReading && (

              <div className="flex min-h-[270px] flex-col items-center justify-center rounded-[24px] border border-orange-100 bg-orange-50/50">

                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />

                <p className="font-semibold text-slate-800">
                  Reading your presentation...
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Extracting slide content
                </p>

              </div>

            )}

            {/* File selected */}
            {file && !isReading && (

              <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5 sm:p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/20">

                      <span className="text-sm font-bold text-white">
                        PPT
                      </span>

                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        PowerPoint presentation
                      </p>

                      <p className="mt-1 truncate font-semibold text-slate-800">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB
                        {" • "}
                        {slides.length} slide
                        {slides.length !== 1 ? "s" : ""}
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

                {/* Filename */}
                <div className="mt-6">

                  <label
                    htmlFor="pdf-name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    PDF file name
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">

                    <input
                      id="pdf-name"
                      type="text"
                      value={fileName}
                      onChange={(event) =>
                        setFileName(event.target.value)
                      }
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-800 outline-none"
                    />

                    <div className="flex items-center border-l border-slate-100 bg-slate-50 px-4 text-sm font-medium text-slate-400">
                      .pdf
                    </div>

                  </div>

                </div>

                {/* Convert */}
                <button
                  type="button"
                  onClick={convertToPdf}
                  disabled={
                    isConverting ||
                    !slides.length
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isConverting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      Creating PDF...
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

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">

              <svg
                className="h-5 w-5 text-orange-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 5h16v14H4z" />
                <path d="M8 9h8M8 13h6M8 17h4" />
              </svg>

            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              Slide conversion
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Convert readable PowerPoint slide content into PDF pages.
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
              Multiple slides
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Each PowerPoint slide becomes a separate PDF page.
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
              The presentation is processed directly in your browser.
            </p>

          </div>

        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          This browser version converts slide text and does not
          reproduce PowerPoint themes, animations, charts, images,
          or exact slide positioning.
        </p>

      </div>
    </main>
  );
}