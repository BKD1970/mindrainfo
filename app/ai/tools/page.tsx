"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  "All",
  "Writing",
  "Research",
  "Coding",
  "Design",
  "Video",
  "Productivity",
];

const aiTools = [
  {
    name: "ChatGPT",
    category: "Productivity",
    icon: "🤖",
    description:
      "AI assistant for writing, learning, brainstorming, coding, analysis and everyday tasks.",
    website: "https://chatgpt.com",
  },
  {
    name: "Google Gemini",
    category: "Research",
    icon: "✨",
    description:
      "Google's AI assistant for answering questions, research, writing, analysis and creative tasks.",
    website: "https://gemini.google.com",
  },
  {
    name: "Claude",
    category: "Writing",
    icon: "🧠",
    description:
      "AI assistant designed for writing, analysis, reasoning, research and working with documents.",
    website: "https://claude.ai",
  },
  {
    name: "Perplexity",
    category: "Research",
    icon: "🔎",
    description:
      "AI-powered search and research assistant designed to provide answers with web sources.",
    website: "https://www.perplexity.ai",
  },
  {
    name: "GitHub Copilot",
    category: "Coding",
    icon: "💻",
    description:
      "AI coding assistant that helps developers write, understand and improve code.",
    website: "https://github.com/features/copilot",
  },
  {
    name: "Canva AI",
    category: "Design",
    icon: "🎨",
    description:
      "AI-powered creative tools for presentations, graphics, images, social media and design.",
    website: "https://www.canva.com",
  },
  {
    name: "Adobe Firefly",
    category: "Design",
    icon: "🔥",
    description:
      "Generative AI tools for creating and editing images and creative content.",
    website: "https://firefly.adobe.com",
  },
  {
    name: "Runway",
    category: "Video",
    icon: "🎬",
    description:
      "AI-powered creative platform for generating and editing video and visual content.",
    website: "https://runwayml.com",
  },
  {
    name: "Microsoft Copilot",
    category: "Productivity",
    icon: "🪟",
    description:
      "AI assistant from Microsoft for productivity, research, writing and everyday tasks.",
    website: "https://copilot.microsoft.com",
  },
  {
    name: "Grammarly",
    category: "Writing",
    icon: "✍️",
    description:
      "Writing assistant that helps improve grammar, clarity, tone and communication.",
    website: "https://www.grammarly.com",
  },
  {
    name: "Cursor",
    category: "Coding",
    icon: "⌨️",
    description:
      "AI-powered code editor designed to help developers understand and build software faster.",
    website: "https://cursor.com",
  },
  {
    name: "Notion AI",
    category: "Productivity",
    icon: "📝",
    description:
      "AI features integrated into Notion for writing, summarizing, organizing and managing information.",
    website: "https://www.notion.com/product/ai",
  },
];

export default function AIToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredTools = aiTools.filter((tool) => {
    const matchesCategory =
      selectedCategory === "All" ||
      tool.category === selectedCategory;

    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f4] text-gray-900">

      {/* HEADER */}

      <header className="relative z-20 border-b border-gray-200 bg-white/85 backdrop-blur-md">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            <span className="text-purple-600">Mindra</span>
            <span>Info</span>
          </Link>

          <Link
            href="/ai"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-gray-100"
          >
            ← AI Hub
          </Link>

        </div>

      </header>

      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-300/25 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-4 py-2 text-sm font-semibold text-purple-600 shadow-sm backdrop-blur-md">

              <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />

              AI Tools Directory

            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">

              Find the right
              <br />

              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                AI tool.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              Discover useful AI tools for writing, research, coding,
              design, video and productivity.
            </p>

          </div>

        </div>

      </section>

      {/* SEARCH */}

      <section className="mx-auto max-w-7xl px-6">

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="relative">

            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl">
              🔎
            </span>

            <input
              type="text"
              placeholder="Search AI tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-14 pr-5 outline-none transition focus:border-purple-400 focus:bg-white"
            />

          </div>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-1">

            {categories.map((category) => (

              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-gray-900 text-white shadow-md"
                    : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>

            ))}

          </div>

        </div>

      </section>

      {/* TOOLS */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="mb-10 flex items-end justify-between gap-5">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              Explore
            </p>

            <h2 className="mt-3 text-4xl font-black">
              AI Tools
            </h2>

          </div>

          <p className="text-sm text-gray-500">
            {filteredTools.length} tools
          </p>

        </div>

        {filteredTools.length === 0 ? (

          <div className="rounded-3xl border border-gray-200 bg-white p-16 text-center">

            <div className="text-5xl">
              🔎
            </div>

            <h3 className="mt-5 text-2xl font-black">
              No tools found
            </h3>

            <p className="mt-2 text-gray-500">
              Try another search or category.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredTools.map((tool) => (

              <article
                key={tool.name}
                className="group relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-purple-300 hover:shadow-xl"
              >

                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-purple-200/25 blur-2xl transition group-hover:bg-purple-300/40" />

                <div className="relative z-10">

                  <div className="flex items-start justify-between">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-3xl transition duration-300 group-hover:scale-110">
                      {tool.icon}
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                      {tool.category}
                    </span>

                  </div>

                  <h3 className="mt-7 text-2xl font-black">
                    {tool.name}
                  </h3>

                  <p className="mt-3 min-h-[84px] text-sm leading-7 text-gray-600">
                    {tool.description}
                  </p>

                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 flex w-full items-center justify-center rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-purple-600"
                  >
                    Visit Official Website →
                  </a>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

      {/* NOTE */}

      <section className="mx-auto max-w-5xl px-6 pb-24">

        <div className="rounded-[2rem] border border-purple-100 bg-purple-50 p-8 text-center md:p-12">

          <div className="text-4xl">
            🧠
          </div>

          <h2 className="mt-5 text-3xl font-black">
            AI is a tool, not a replacement for judgment.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            AI tools can make work faster, but always review important
            information and understand how the tool should be used.
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
            href="/ai"
            className="font-semibold text-purple-600 hover:text-purple-700"
          >
            ← Back to AI
          </Link>

        </div>

      </footer>

    </main>
  );
}