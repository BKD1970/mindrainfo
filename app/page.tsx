import Link from "next/link";
import ScrollVideo from "@/components/ScrollVideo";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";

const categories = [
  {
    name: "Career",
    href: "/career",
    icon: "🚀",
    description:
      "Explore career paths, skills, job opportunities and practical career guidance.",
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: "💼",
    description:
      "Find useful information about jobs, recruitment, skills and career opportunities.",
  },
  {
    name: "Tools",
    href: "/tools",
    icon: "🛠️",
    description:
      "Discover useful online tools that can make your work easier.",
  },
  {
    name: "Shop",
    href: "/shop",
    icon: "📦",
    description:
      "Explore useful digital and physical products designed to solve practical problems.",
  },
];

export default async function Home() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching homepage articles:", error);
  }

  const latestArticles = articles ?? [];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050816] text-white">

      {/* =====================================================
          MAIN BACKGROUND
      ====================================================== */}

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

      {/* =====================================================
          HEADER
      ====================================================== */}

      <SiteHeader />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative min-h-[560px] overflow-hidden md:min-h-[650px]">

        <video
  autoPlay
  muted
  loop
  playsInline
  className="absolute inset-0 h-full w-full object-cover"
>
  <source src="/mindrainfo-hero.mp4" type="video/mp4" />
</video>

<div className="absolute inset-0 bg-[#050816]/70" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 text-center md:py-32">

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300 backdrop-blur-md">

            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

            Knowledge for your next step

          </div>

          <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight md:text-7xl">

            Learn.

            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}Build.
            </span>

            <span className="text-white">
              {" "}Grow.
            </span>

          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/55 md:text-xl">
            Practical knowledge, career guidance, job opportunities, useful tools
            and products to help you learn, build and grow.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              href="/articles"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 font-semibold shadow-lg shadow-cyan-500/20 transition hover:-translate-y-1 hover:shadow-cyan-500/30"
            >
              Explore Resources
            </Link>

            <Link
              href="/career"
              className="rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white/90 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10"
            >
              Career Guides
            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}

      <section className="mx-auto w-full max-w-7xl px-6 py-20">

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Explore MindraInfo
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Find something useful.
          </h2>

          <p className="mt-3 max-w-2xl text-white/50">
            Discover practical information, career opportunities, useful tools
            and products designed to help you learn, build and grow.
          </p>

        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => (

            <Link
              key={category.name}
              href={category.href}
              className="group relative flex w-full min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:bg-white/[0.07]"
            >

              <div className="relative z-10 flex w-full min-w-0 flex-col">

                <div className="mb-5 text-4xl transition duration-300 group-hover:scale-110">
                  {category.icon}
                </div>

                <h3 className="text-xl font-bold">
                  {category.name}
                </h3>

                <p className="mt-3 max-w-full text-sm leading-6 text-white/50">
                  {category.description}
                </p>

                <span className="mt-6 inline-block text-sm font-semibold text-cyan-400 transition group-hover:translate-x-1">
                  Explore →
                </span>

              </div>

            </Link>

          ))}

        </div>

      </section>

      {/* =====================================================
    MINDRAINFO INTRO VIDEO
====================================================== */}

<section className="mx-auto w-full max-w-7xl px-6 py-20">

  <div className="mb-8">

    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
      Welcome to MindraInfo
    </p>

    <h2 className="mt-3 text-3xl font-bold md:text-4xl">
      Discover MindraInfo.
    </h2>

    <p className="mt-3 max-w-2xl text-white/50">
      Explore a growing ecosystem of knowledge, technology, opportunities
      and useful solutions.
    </p>

  </div>

  <ScrollVideo
    src="/mindrainfo-intro.mp4"
    className="aspect-video w-full rounded-[2rem] border border-white/10 bg-black shadow-2xl"
  />

</section>

      {/* =====================================================
          LATEST ARTICLES
      ====================================================== */}

      <section className="border-y border-white/5 bg-white/[0.015]">

        <div className="mx-auto w-full max-w-7xl px-6 py-20">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
                Knowledge Hub
              </p>

              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Latest Articles
              </h2>

            </div>

            <Link
              href="/articles"
              className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
            >
              View all articles →
            </Link>

          </div>

          <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-3">

            {latestArticles.map((article) => (

              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group flex w-full min-w-0 flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.06]"
              >

                <p className="text-sm font-medium text-cyan-400">
                  {article.category || "MindraInfo"}
                </p>

                <h3 className="mt-4 text-xl font-bold leading-8 transition group-hover:text-cyan-300">
                  {article.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-white/45">
                  {article.description || article.excerpt || ""}
                </p>

                <span className="mt-6 inline-block text-sm font-semibold text-white/70 transition group-hover:text-cyan-400">
                  Read article →
                </span>

              </Link>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
    MINDRAINFO PRODUCTS VIDEO
====================================================== */}

<section className="mx-auto w-full max-w-7xl px-6 py-20">

  <div className="mb-8">

    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
      MindraInfo Products
    </p>

    <h2 className="mt-3 text-3xl font-bold md:text-4xl">
      Useful products. Real solutions.
    </h2>

    <p className="mt-3 max-w-2xl text-white/50">
      Discover the future of MindraInfo — from software and digital solutions
      to thoughtfully designed physical products.
    </p>

  </div>

  <ScrollVideo
    src="/mindrainfo-products.mp4"
    className="aspect-video w-full rounded-[2rem] border border-white/10 bg-black shadow-2xl"
  />

</section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="mx-auto w-full max-w-5xl px-6 py-24 text-center">

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 backdrop-blur-xl md:p-16">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Start Today
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Your next opportunity could start here.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/50">
            Learn new skills, understand technology and discover opportunities
            designed to help you build a better future.
          </p>

          <Link
            href="/articles"
            className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 px-8 py-4 font-bold shadow-lg shadow-blue-500/20 transition hover:-translate-y-1"
          >
            Explore MindraInfo
          </Link>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-white/10">

        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-white/40 md:flex-row">

          <p>
            © 2026 MindraInfo. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-5">

            <Link
              href="/career"
              className="transition hover:text-white"
            >
              Career
            </Link>

            <Link
              href="/jobs"
              className="transition hover:text-white"
            >
              Jobs
            </Link>

            <Link
              href="/tools"
              className="transition hover:text-white"
            >
              Tools
            </Link>

            <Link
              href="/shop"
              className="transition hover:text-white"
            >
              Products
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}