"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { articles } from "@/content/articles";

const searchPages = [
  {
    title: "Career",
    description:
      "Explore career paths, skills, jobs and practical career guidance.",
    category: "Career",
    href: "/career",
    icon: "🚀",
  },
  {
    title: "Data Analytics",
    description:
      "Learn Excel, SQL, Power BI and the essential skills for becoming a data analyst.",
    category: "Data Analytics",
    href: "/data-analytics",
    icon: "📊",
  },
  {
    title: "Artificial Intelligence",
    description:
      "Discover artificial intelligence, useful AI tools, automation and emerging technology.",
    category: "AI",
    href: "/ai",
    icon: "🤖",
  },
  {
    title: "AI Tools",
    description:
      "Discover useful AI tools for writing, research, coding, design and productivity.",
    category: "AI",
    href: "/ai/tools",
    icon: "🧰",
  },
  {
    title: "Generative AI",
    description:
      "Understand how AI can generate text, images, audio, video and other content.",
    category: "AI",
    href: "/ai/generative-ai",
    icon: "✨",
  },
  {
    title: "Prompt Engineering",
    description:
      "Learn how to create better prompts and communicate effectively with AI.",
    category: "AI",
    href: "/ai/prompt-engineering",
    icon: "💬",
  },
  {
    title: "AI Automation",
    description:
      "Explore how AI can automate repetitive tasks and improve productivity.",
    category: "AI",
    href: "/ai/automation",
    icon: "⚙️",
  },
  {
    title: "AI & Careers",
    description:
      "Understand how artificial intelligence is changing jobs and creating new opportunities.",
    category: "AI",
    href: "/ai/careers",
    icon: "🚀",
  },
  {
    title: "Machine Learning",
    description:
      "Learn the fundamentals of machine learning and how computers learn patterns from data.",
    category: "AI",
    href: "/ai/machine-learning",
    icon: "🧠",
  },
  {
    title: "Technology",
    description:
      "Understand modern technology, software, websites, apps and digital trends.",
    category: "Technology",
    href: "/technology",
    icon: "💻",
  },
  {
    title: "Jobs",
    description:
      "Find useful information about jobs, recruitment, skills and career opportunities.",
    category: "Jobs",
    href: "/jobs",
    icon: "💼",
  },
  {
    title: "Tools",
    description:
      "Discover useful online tools that can make your work easier.",
    category: "Tools",
    href: "/tools",
    icon: "🛠️",
  },
];

const articleSearchItems = articles
  .filter((article) => article.available)
  .map((article) => ({
  title: article.title,
  description: article.description,
  category: article.category,
  href: `/articles/${article.slug}`,
      icon: article.icon,
  }));

const searchItems = [
  ...searchPages,
  ...articleSearchItems,
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return searchItems;
    }

    return searchItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)
      );
    });
  }, [query]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Animated background */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,0.24),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(6,182,212,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.20),transparent_38%),linear-gradient(135deg,#050816,#0a1025,#050816)]" />

        <div className="absolute -left-40 top-20 h-96 w-96 animate-pulse rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute -right-40 top-40 h-[420px] w-[420px] animate-pulse rounded-full bg-cyan-400/15 blur-3xl [animation-delay:2s]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[500px] w-[500px] animate-pulse rounded-full bg-purple-500/15 blur-3xl [animation-delay:4s]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group">
            <span className="text-2xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Mindra
              </span>
              <span className="text-white">Info</span>
            </span>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition hover:border-cyan-400/30 hover:bg-white/10 hover:text-white"
          >
            ← Home
          </Link>
        </div>
      </header>

      {/* Search Hero */}

      <section className="mx-auto max-w-5xl px-6 pb-12 pt-20 text-center md:pt-28">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm font-semibold text-cyan-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          MindraInfo Search
        </div>

        <h1 className="text-5xl font-black tracking-tight md:text-6xl">
          Find what you{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            need.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/50">
          Search careers, data analytics, AI, technology, jobs, tools and
          useful resources across MindraInfo.
        </p>

        {/* Search box */}

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3 shadow-2xl backdrop-blur-xl sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white/40">
                🔍
              </span>

              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search AI, Excel, jobs, career..."
                className="w-full rounded-xl border border-white/10 bg-black/20 px-12 py-4 text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-purple-400">
              Search Results
            </p>

            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              {query
                ? `Results for "${query}"`
                : "Explore MindraInfo"}
            </h2>
          </div>

          <p className="text-sm text-white/40">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <Link
                key={`${item.category}-${item.title}`}
                href={item.href}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-cyan-500/5"
              >
                {/* Hover glow */}

                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-cyan-400/20" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                      {item.icon}
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/40">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold leading-7 transition group-hover:text-cyan-300">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/45">
                    {item.description}
                  </p>

                  <div className="mt-6 text-sm font-semibold text-cyan-400 transition group-hover:translate-x-1">
                    Open → 
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* No results */

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-20 text-center backdrop-blur-xl">
            <div className="text-5xl">🔎</div>

            <h3 className="mt-6 text-2xl font-bold">
              No results found
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-white/45">
              We couldn't find anything matching your search. Try another
              keyword such as AI, Excel, Career, Jobs or Tools.
            </p>

            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-7 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold transition hover:-translate-y-1"
            >
              Browse Everything
            </button>
          </div>
        )}
      </section>

      {/* Footer */}

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-white/40 md:flex-row">
          <p>© 2026 MindraInfo. All rights reserved.</p>

          <Link
            href="/"
            className="font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            Back to MindraInfo →
          </Link>
        </div>
      </footer>
    </main>
  );
}