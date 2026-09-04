"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, useMemo, useState } from "react";

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const next = csv[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      value += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(value);
      value = "";

      if (row.some((cell) => cell.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);

    if (row.some((cell) => cell.trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

export default function CsvViewerPage() {
  const [data, setData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState("");
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState(false);

  const loadFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      alert("Please select a CSV file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const content = String(reader.result || "");
      setData(parseCSV(content));
      setFileName(file.name);
      setSearch("");
    };

    reader.readAsText(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      loadFile(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      loadFile(file);
    }
  };

  const filteredRows = useMemo(() => {
    if (!search.trim()) return data;

    const term = search.toLowerCase();

    return data.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(term))
    );
  }, [data, search]);

  const columns = useMemo(() => {
    return data.reduce((max, row) => Math.max(max, row.length), 0);
  }, [data]);

  const clear = () => {
    setData([]);
    setFileName("");
    setSearch("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/tools"
          className="mb-6 inline-flex text-sm font-bold text-emerald-600 hover:text-emerald-800"
        >
          ← Back to Tools
        </Link>

        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">📊</div>

          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            CSV Viewer
          </h1>

          <p className="mt-3 text-slate-600">
            Upload and inspect CSV datasets in a clean table.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl md:p-7">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition ${
              dragging
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50"
            }`}
          >
            <div className="mb-4 text-5xl">📁</div>

            <p className="text-lg font-bold text-slate-800">
              Drop your CSV file here
            </p>

            <p className="mt-2 text-sm text-slate-500">
              or click to browse your computer
            </p>

            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {data.length > 0 && (
            <>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="rounded-xl bg-emerald-50 px-4 py-3">
                  <span className="text-sm text-slate-500">File: </span>
                  <span className="font-bold text-emerald-700">
                    {fileName}
                  </span>
                </div>

                <div className="rounded-xl bg-blue-50 px-4 py-3">
                  <span className="font-bold text-blue-700">
                    {data.length} rows
                  </span>
                </div>

                <div className="rounded-xl bg-purple-50 px-4 py-3">
                  <span className="font-bold text-purple-700">
                    {columns} columns
                  </span>
                </div>

                <button
                  onClick={clear}
                  className="rounded-xl border border-red-200 px-4 py-3 font-bold text-red-600 hover:bg-red-50"
                >
                  Clear
                </button>
              </div>

              <div className="mt-6">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search inside CSV..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                <div className="max-h-[600px] overflow-auto">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <thead className="sticky top-0 bg-slate-900 text-white">
                      <tr>
                        <th className="whitespace-nowrap border-b border-slate-700 px-4 py-3">
                          #
                        </th>

                        {Array.from({ length: columns }).map((_, index) => (
                          <th
                            key={index}
                            className="whitespace-nowrap border-b border-slate-700 px-4 py-3 font-bold"
                          >
                            {data[0]?.[index] || `Column ${index + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRows.slice(1).map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="border-b border-slate-100 hover:bg-emerald-50/50"
                        >
                          <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-500">
                            {rowIndex + 1}
                          </td>

                          {Array.from({ length: columns }).map(
                            (_, columnIndex) => (
                              <td
                                key={columnIndex}
                                className="whitespace-nowrap px-4 py-3 text-slate-700"
                              >
                                {row[columnIndex] || ""}
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {search && (
                <p className="mt-3 text-sm text-slate-500">
                  Showing {Math.max(filteredRows.length - 1, 0)} matching data
                  rows.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}