"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";

const categories = [
  "All",
  "Career",
  "Data Analytics",
  "AI",
  "AI & Careers",
  "Technology",
  "Tools",
];

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [supabaseArticles, setSupabaseArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  async function fetchArticles() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
    } else {
      setSupabaseArticles(data || []);
    }

    setLoading(false);
  }

  fetchArticles();
}, []);

const allArticles = supabaseArticles;

const filteredArticles =
  selectedCategory === "All"
    ? allArticles
    : allArticles.filter(
        (article) => article.category === selectedCategory
      );

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* HEADER */}
<SiteHeader />

      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-32">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
            MindraInfo Resources
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Learn something useful.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Every day.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/55">
            Practical articles, tutorials, career guidance, AI knowledge,
            technology insights and useful resources.
          </p>

        </div>
      </section>

      {/* CATEGORY FILTER */}

      <section className="border-y border-white/10 bg-white/[0.02]">

        <div className="mx-auto max-w-7xl overflow-x-auto px-6 py-5">

          <div className="flex min-w-max gap-3">

            {categories.map((category) => {

              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/5"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-cyan-400/20 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );

            })}

          </div>

        </div>
      </section>

      {/* ARTICLES */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-400">
              Knowledge Hub
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {selectedCategory === "All"
                ? "Latest Articles"
                : `${selectedCategory} Articles`}
            </h2>

            <p className="mt-3 text-white/45">
              Showing {filteredArticles.length} article
              {filteredArticles.length !== 1 ? "s" : ""}.
            </p>

          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/50">
            {selectedCategory}
          </div>

        </div>

        {/* ARTICLES GRID */}

        {filteredArticles.length > 0 ? (

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredArticles.map((article) => (

              <article
                key={article.slug}
                className="group flex min-h-[390px] flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/20 hover:bg-white/[0.06]"
              >

                <div className="text-4xl">
                  {article.icon}
                </div>

                <p className="mt-6 text-sm font-semibold text-cyan-400">
                  {article.category}
                </p>

                <h3 className="mt-3 text-2xl font-bold leading-8 transition group-hover:text-cyan-300">
                  {article.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-white/50">
                  {article.description}
                </p>

                <div className="mt-7">

                  {article.available !== false ? (

                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center text-sm font-bold text-cyan-400 transition hover:text-cyan-300"
                    >
                      Read Article →
                    </Link>

                  ) : (

                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/40">
                      Coming Soon
                    </span>

                  )}

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-16 text-center">

            <div className="text-5xl">
              📚
            </div>

            <h3 className="mt-5 text-2xl font-black">
              No articles in this category yet.
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-white/45">
              We're building more resources for this section. Try another
              category or come back later.
            </p>

            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="mt-7 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-7 py-3 font-bold transition hover:-translate-y-1"
            >
              View All Articles
            </button>

          </div>

        )}

      </section>

      {/* CTA */}

      <section className="mx-auto max-w-5xl px-6 pb-24">

        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-10 text-center md:p-14">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Keep Learning
          </p>

          <h2 className="mt-4 text-3xl font-black md:text-4xl">
            Knowledge becomes valuable when you use it.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/50">
            Explore MindraInfo and build practical skills that can help you
            learn, work and grow.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-7 py-3.5 font-bold transition hover:-translate-y-1"
          >
            Explore MindraInfo
          </Link>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-white/40 md:flex-row">

          <p>
            © 2026 MindraInfo. All rights reserved.
          </p>

          <Link
            href="/"
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Back to Home →
          </Link>

        </div>

      </footer>

    </main>
  );
}

