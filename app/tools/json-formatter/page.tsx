"use client";

import Link from "next/link";
import { useState } from "react";

export default function JsonFormatterPage() {
  const [json, setJson] = useState("");
  const [error, setError] = useState("");

  const formatJson = () => {
    if (!json.trim()) {
      setError("Please enter JSON first.");
      return;
    }

    try {
      const parsed = JSON.parse(json);
      setJson(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid JSON."
      );
    }
  };

  const minifyJson = () => {
    if (!json.trim()) {
      setError("Please enter JSON first.");
      return;
    }

    try {
      const parsed = JSON.parse(json);
      setJson(JSON.stringify(parsed));
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid JSON."
      );
    }
  };

  const validateJson = () => {
    if (!json.trim()) {
      setError("Please enter JSON first.");
      return;
    }

    try {
      JSON.parse(json);
      setError("");
      alert("Valid JSON ✓");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid JSON."
      );
    }
  };

  const copyJson = async () => {
    if (!json) return;

    try {
      await navigator.clipboard.writeText(json);
      alert("JSON copied to clipboard.");
    } catch {
      alert("Unable to copy JSON.");
    }
  };

  const downloadJson = () => {
    if (!json.trim()) return;

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "formatted.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/tools"
          className="mb-6 inline-flex text-sm font-bold text-blue-600 hover:text-blue-800"
        >
          ← Back to Tools
        </Link>

        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">{`{ }`}</div>

          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            JSON Formatter
          </h1>

          <p className="mt-3 text-slate-600">
            Format, validate, minify and download JSON data.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl md:p-7">
          <textarea
            value={json}
            onChange={(e) => {
              setJson(e.target.value);
              setError("");
            }}
            placeholder={`Paste JSON here...\n\nExample:\n{"name":"MindraInfo","type":"website"}`}
            className="min-h-[400px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-950 p-5 font-mono text-sm leading-7 text-green-300 outline-none focus:ring-4 focus:ring-blue-100"
            spellCheck={false}
          />

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              ❌ {error}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={formatJson}
              className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
            >
              ✨ Format
            </button>

            <button
              onClick={minifyJson}
              className="rounded-xl bg-purple-600 px-5 py-3 font-bold text-white hover:bg-purple-700"
            >
              Minify
            </button>

            <button
              onClick={validateJson}
              className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
            >
              ✓ Validate
            </button>

            <button
              onClick={copyJson}
              disabled={!json}
              className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              📋 Copy
            </button>

            <button
              onClick={downloadJson}
              disabled={!json}
              className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              ⬇️ Download
            </button>

            <button
              onClick={() => {
                setJson("");
                setError("");
              }}
              className="rounded-xl border border-red-200 px-5 py-3 font-bold text-red-600 hover:bg-red-50"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}