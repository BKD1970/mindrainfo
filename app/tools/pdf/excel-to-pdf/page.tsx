"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Document as PdfDocument,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

type SpreadsheetData = {
  name: string;
  rows: string[][];
};

const pdfStyles = StyleSheet.create({
  page: {
    padding: 28,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#0f172a",
  },

  sheetTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1e293b",
  },

  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },

  row: {
    flexDirection: "row",
  },

  cell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#cbd5e1",
    padding: 5,
    fontSize: 7,
    color: "#334155",
  },

  lastCell: {
    borderRightWidth: 0,
  },

  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
  },
});

function ExcelPdfDocument({
  workbook,
  title,
}: {
  workbook: SpreadsheetData[];
  title: string;
}) {
  return (
    <PdfDocument>
      {workbook.map((sheet, sheetIndex) => (
        <Page
          key={sheetIndex}
          size="A4"
          orientation="landscape"
          style={pdfStyles.page}
        >
          <Text style={pdfStyles.title}>{title}</Text>

          <Text style={pdfStyles.sheetTitle}>
            {sheet.name}
          </Text>

          <View style={pdfStyles.table}>
            {sheet.rows.map((row, rowIndex) => (
              <View style={pdfStyles.row} key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <Text
                    key={cellIndex}
                    style={[
                      pdfStyles.cell,
                      cellIndex === row.length - 1
                        ? pdfStyles.lastCell
                        : {},
                      rowIndex === 0
                        ? pdfStyles.headerCell
                        : {},
                    ]}
                  >
                    {cell}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </Page>
      ))}
    </PdfDocument>
  );
}

export default function ExcelToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SpreadsheetData[]>([]);
  const [fileName, setFileName] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");

  const readExcelFile = async (selectedFile: File) => {
    setError("");
    setIsReading(true);
    setSheets([]);

    try {
      const extension = selectedFile.name
        .split(".")
        .pop()
        ?.toLowerCase();

      if (!["xlsx", "xls", "csv"].includes(extension || "")) {
        throw new Error(
          "Please select an Excel (.xlsx, .xls) or CSV file."
        );
      }

      const arrayBuffer = await selectedFile.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
        cellDates: true,
      });

      const extractedSheets: SpreadsheetData[] =
        workbook.SheetNames.map((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];

          const rows = XLSX.utils.sheet_to_json<string[]>(
            worksheet,
            {
              header: 1,
              defval: "",
              raw: false,
            }
          );

          return {
            name: sheetName,
            rows: rows.map((row) =>
              row.map((cell) => String(cell ?? ""))
            ),
          };
        });

      setFile(selectedFile);
      setFileName(
        selectedFile.name.replace(/\.(xlsx|xls|csv)$/i, "")
      );
      setSheets(extractedSheets);

      if (
        extractedSheets.length === 0 ||
        extractedSheets.every((sheet) => sheet.rows.length === 0)
      ) {
        setError("The selected spreadsheet does not contain any data.");
      }
    } catch (err) {
      console.error("Excel reading error:", err);

      setFile(null);
      setSheets([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to read this spreadsheet."
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
      readExcelFile(selectedFile);
    }

    event.target.value = "";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      readExcelFile(droppedFile);
    }
  };

  const convertToPdf = async () => {
    if (!sheets.length) {
      setError("Please upload an Excel file first.");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      const blob = await pdf(
        <ExcelPdfDocument
          workbook={sheets}
          title={fileName || "Excel Document"}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName || "excel-document"}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Excel to PDF conversion error:", err);

      setError(
        "Something went wrong while creating the PDF."
      );
    } finally {
      setIsConverting(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setSheets([]);
    setFileName("");
    setError("");
  };

  const totalRows = sheets.reduce(
    (total, sheet) => total + sheet.rows.length,
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
            Excel to PDF Converter
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Convert Excel spreadsheets into clean, printable PDF
            documents directly in your browser.
          </p>
        </section>

        {/* Main Card */}
        <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_25px_70px_rgba(15,23,42,0.10)] backdrop-blur">

          {/* Top */}
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
                  Upload your spreadsheet
                </h2>

                <p className="text-xs text-slate-500">
                  XLSX, XLS and CSV files are supported
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">

            {/* Upload */}
            {!file && !isReading && (
              <label
                htmlFor="excel-file"
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={handleDrop}
                className="group flex min-h-[270px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center transition-all hover:border-green-400 hover:bg-green-50/40"
              >
                <input
                  id="excel-file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-transform group-hover:-translate-y-1">
                  <svg
                    className="h-8 w-8 text-green-600"
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
                  Drop your Excel file here
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  or{" "}
                  <span className="font-semibold text-green-600">
                    browse from your device
                  </span>
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
                  <span className="font-semibold text-green-600">
                    XLSX
                  </span>
                  Excel spreadsheet
                </div>
              </label>
            )}

            {/* Reading */}
            {isReading && (
              <div className="flex min-h-[270px] flex-col items-center justify-center rounded-[24px] border border-green-100 bg-green-50/50">
                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

                <p className="font-semibold text-slate-800">
                  Reading your spreadsheet...
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Preparing your data for PDF conversion
                </p>
              </div>
            )}

            {/* File selected */}
            {file && !isReading && (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5 sm:p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-600 shadow-lg shadow-green-600/20">
                      <span className="text-sm font-bold text-white">
                        XLS
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Spreadsheet
                      </p>

                      <p className="mt-1 truncate font-semibold text-slate-800">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB
                        {" • "}
                        {sheets.length} sheet
                        {sheets.length !== 1 ? "s" : ""}
                        {" • "}
                        {totalRows.toLocaleString()} rows
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

                {/* Output name */}
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
                  disabled={isConverting || !sheets.length}
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

        {/* Feature cards */}
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
              Multiple sheets
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Convert workbooks containing multiple spreadsheet sheets.
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
              Easy conversion
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Turn spreadsheet data into a printable PDF with one click.
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
              Clean PDF output
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Download your spreadsheet as a landscape A4 PDF.
            </p>
          </div>

        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Supports .XLSX, .XLS and .CSV spreadsheet files.
        </p>

      </div>
    </main>
  );
}