import Link from "next/link";
import { articles } from "@/content/articles";

const categories = [
  {
    name: "Career",
    href: "/career",
    icon: "🚀",
    description:
      "Explore career paths, skills, job opportunities and practical career guidance.",
  },
  {
    name: "Data Analytics",
    href: "/data-analytics",
    icon: "📊",
    description:
      "Learn Excel, SQL, Power BI and the essential skills for becoming a data analyst.",
  },
  {
    name: "AI",
    href: "/ai",
    icon: "🤖",
    description:
      "Discover artificial intelligence, useful AI tools, automation and emerging technology.",
  },
  {
    name: "Technology",
    href: "/technology",
    icon: "💻",
    description:
      "Understand modern technology, software, websites, apps and digital trends.",
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
];
export default function Home() {
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

      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">

        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">

          {/* LOGO */}

          <Link href="/" className="shrink-0">

            <span className="text-2xl font-black tracking-tight">

              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Mindra
              </span>

              <span className="text-white">
                Info
              </span>

            </span>

          </Link>

          {/* NAVIGATION */}

          <nav className="hidden min-w-0 items-center gap-6 lg:flex">

            {categories.map((category) => (

              <Link
                key={category.name}
                href={category.href}
                className="whitespace-nowrap text-sm font-medium text-white/65 transition hover:text-cyan-400"
              >
                {category.name}
              </Link>

            ))}

          </nav>

          {/* SEARCH */}

          <Link
            href="/search"
            className="ml-4 shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition hover:border-cyan-400/30 hover:bg-white/10 hover:text-white"
          >
            🔍 Search
          </Link>

        </div>

      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative">

        <div className="mx-auto w-full max-w-7xl px-6 py-24 text-center md:py-32">

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

            Practical knowledge, career guidance, artificial intelligence,
            technology and data analytics resources for students and
            professionals.

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
            Discover practical information and resources across careers,
            analytics, artificial intelligence and technology.
          </p>

        </div>

        {/* IMPORTANT: explicit grid columns and full width */}

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => (

            <Link
              key={category.name}
              href={category.href}
              className="group relative flex w-full min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:bg-white/[0.07]"
            >

              {/* =================================================
                  AI DESIGN B — SUBTLE
              ================================================== */}

              {category.name === "AI" && (

                <div className="pointer-events-none absolute inset-0 opacity-[0.12]">

                  <div className="absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-purple-300 shadow-[0_0_15px_5px_rgba(168,85,247,0.5)]" />

                  <div className="absolute left-[55%] top-[30%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_15px_5px_rgba(34,211,238,0.5)]" />

                  <div className="absolute left-[35%] top-[65%] h-2 w-2 rounded-full bg-purple-300 shadow-[0_0_15px_5px_rgba(168,85,247,0.5)]" />

                  <div className="absolute right-[15%] top-[55%] h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_15px_5px_rgba(96,165,250,0.5)]" />

                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 300 250"
                    fill="none"
                  >

                    <path
                      d="M45 55 L165 75 L105 165 L250 140"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-purple-300"
                    />

                    <path
                      d="M165 75 L250 140"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-cyan-300"
                    />

                  </svg>

                </div>

              )}

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

            {articles.slice(0, 3).map((article) => (

              <Link
                key={article.title}
                href={`/articles/${article.slug}`}
                className="group flex w-full min-w-0 flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.06]"
              >

                <p className="text-sm font-medium text-cyan-400">
                  MindraInfo
                </p>

                <h3 className="mt-4 text-xl font-bold leading-8 transition group-hover:text-cyan-300">
                  {article.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-white/45">
                  Practical information and guidance to help you learn and
                  build useful skills.
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
              href="/data-analytics"
              className="transition hover:text-white"
            >
              Data Analytics
            </Link>

            <Link
              href="/ai"
              className="transition hover:text-white"
            >
              AI
            </Link>

            <Link
              href="/technology"
              className="transition hover:text-white"
            >
              Technology
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

          </div>

        </div>

      </footer>

    </main>
  );
}