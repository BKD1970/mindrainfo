"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";

export default function TextFormatterPage() {
  const [text, setText] = useState("");

  const wordCount = useMemo(() => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [text]);

  const characterCount = text.length;

  const transform = (type: string) => {
    let result = text;

    switch (type) {
      case "uppercase":
        result = text.toUpperCase();
        break;

      case "lowercase":
        result = text.toLowerCase();
        break;

      case "title":
        result = text
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase());
        break;

      case "sentence":
        result = text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s+\w)/g, (match) =>
            match.toUpperCase()
          );
        break;

      case "trim":
        result = text
          .split("\n")
          .map((line) => line.trim())
          .join("\n");
        break;

      case "remove-spaces":
        result = text.replace(/[ \t]+/g, " ").trim();
        break;

      case "remove-blank":
        result = text
          .split("\n")
          .filter((line) => line.trim() !== "")
          .join("\n");
        break;

      default:
        break;
    }

    setText(result);
  };

  const copyText = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      alert("Text copied to clipboard.");
    } catch {
      alert("Unable to copy the text.");
    }
  };

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/tools"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Tools
          </Link>

          <div className="mb-8 text-center">
            <div className="mb-3 text-5xl">✍️</div>

            <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              Text Formatter
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Clean, format and transform your text quickly.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl md:p-7">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="min-h-[320px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-7 text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => transform("uppercase")}
                className="rounded-xl bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-200"
              >
                UPPERCASE
              </button>

              <button
                onClick={() => transform("lowercase")}
                className="rounded-xl bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700 transition hover:bg-purple-200"
              >
                lowercase
              </button>

              <button
                onClick={() => transform("title")}
                className="rounded-xl bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-200"
              >
                Title Case
              </button>

              <button
                onClick={() => transform("sentence")}
                className="rounded-xl bg-green-100 px-4 py-2 text-sm font-bold text-green-700 transition hover:bg-green-200"
              >
                Sentence case
              </button>

              <button
                onClick={() => transform("trim")}
                className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-200"
              >
                Trim Lines
              </button>

              <button
                onClick={() => transform("remove-spaces")}
                className="rounded-xl bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700 transition hover:bg-orange-200"
              >
                Fix Spaces
              </button>

              <button
                onClick={() => transform("remove-blank")}
                className="rounded-xl bg-pink-100 px-4 py-2 text-sm font-bold text-pink-700 transition hover:bg-pink-200"
              >
                Remove Blank Lines
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={copyText}
                disabled={!text}
                className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                📋 Copy Text
              </button>

              <button
                onClick={() => setText("")}
                disabled={!text}
                className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-2xl bg-indigo-50 p-4 text-center">
                <p className="text-2xl font-extrabold text-indigo-700">
                  {wordCount}
                </p>
                <p className="text-sm text-slate-600">Words</p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4 text-center">
                <p className="text-2xl font-extrabold text-purple-700">
                  {characterCount}
                </p>
                <p className="text-sm text-slate-600">Characters</p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4 text-center">
                <p className="text-2xl font-extrabold text-blue-700">
                  {text ? text.split("\n").length : 0}
                </p>
                <p className="text-sm text-slate-600">Lines</p>
              </div>

              <div className="rounded-2xl bg-green-50 p-4 text-center">
                <p className="text-2xl font-extrabold text-green-700">
                  {text ? text.trim().length : 0}
                </p>
                <p className="text-sm text-slate-600">Trimmed Characters</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}