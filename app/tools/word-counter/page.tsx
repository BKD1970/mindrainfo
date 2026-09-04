"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();

    const words = trimmed ? trimmed.split(/\s+/).length : 0;

    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((item) => item.trim()).length
      : 0;

    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter((item) => item.trim()).length
      : 0;

    const lines = text
      ? text.split("\n").filter((item) => item.trim()).length
      : 0;

    const readingTime = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;

    return {
      words,
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, "").length,
      sentences,
      paragraphs,
      lines,
      readingTime,
    };
  }, [text]);

  const copyText = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      alert("Text copied to clipboard.");
    } catch {
      alert("Unable to copy text.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/tools"
          className="mb-6 inline-flex text-sm font-bold text-orange-600 hover:text-orange-800"
        >
          ← Back to Tools
        </Link>

        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🔢</div>

          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Word Counter
          </h1>

          <p className="mt-3 text-slate-600">
            Count words, characters, sentences, paragraphs and reading time.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl md:p-7">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here..."
            className="min-h-[350px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-7 text-slate-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          />

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={copyText}
              disabled={!text}
              className="rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              📋 Copy Text
            </button>

            <button
              onClick={() => setText("")}
              disabled={!text}
              className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <Stat label="Words" value={stats.words} />
            <Stat label="Characters" value={stats.characters} />
            <Stat
              label="Characters (No Spaces)"
              value={stats.charactersNoSpaces}
            />
            <Stat label="Sentences" value={stats.sentences} />
            <Stat label="Paragraphs" value={stats.paragraphs} />
            <Stat label="Lines" value={stats.lines} />
            <Stat
              label="Reading Time"
              value={stats.readingTime ? `${stats.readingTime} min` : "0 min"}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl bg-orange-50 p-5 text-center">
      <p className="text-2xl font-extrabold text-orange-700">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}