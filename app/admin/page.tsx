"use client";

import Link from "next/link";

const roles = [
  {
    title: "Owner",
    description: "Full access to the entire MindraInfo administration.",
    icon: "👑",
    href: "/admin/login?role=owner",
    color:
      "from-amber-400/20 via-yellow-400/10 to-orange-400/20",
    border: "hover:border-amber-300",
    glow: "group-hover:shadow-amber-500/20",
  },
  {
    title: "Jobs Manager",
    description: "Manage jobs, applications and job content.",
    icon: "💼",
    href: "/admin/login?role=jobs",
    color:
      "from-emerald-400/20 via-green-400/10 to-teal-400/20",
    border: "hover:border-emerald-300",
    glow: "group-hover:shadow-emerald-500/20",
  },
  {
    title: "Articles Manager",
    description: "Create, edit and publish MindraInfo articles.",
    icon: "📝",
    href: "/admin/login?role=articles",
    color:
      "from-purple-400/20 via-violet-400/10 to-fuchsia-400/20",
    border: "hover:border-purple-300",
    glow: "group-hover:shadow-purple-500/20",
  },
  {
    title: "Shop Manager",
    description: "Manage products and the MindraInfo Shop.",
    icon: "🛍️",
    href: "/admin/login?role=shop",
    color:
      "from-pink-400/20 via-rose-400/10 to-red-400/20",
    border: "hover:border-pink-300",
    glow: "group-hover:shadow-pink-500/20",
  },
  {
    title: "Technology Manager",
    description: "Manage technology topics and technical content.",
    icon: "💻",
    href: "/admin/login?role=technology",
    color:
      "from-blue-400/20 via-cyan-400/10 to-sky-400/20",
    border: "hover:border-blue-300",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    title: "Orders Manager",
    description: "Manage customer orders and payment status.",
    icon: "📦",
    href: "/admin/login?role=orders",
    color:
      "from-cyan-400/20 via-sky-400/10 to-blue-400/20",
    border: "hover:border-cyan-300",
    glow: "group-hover:shadow-cyan-500/20",
  },
];

export default function AdminPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* ANIMATED BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="absolute -right-32 top-20 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl [animation-delay:1s]" />

        <div className="absolute bottom-[-180px] left-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl [animation-delay:2s]" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            <span className="text-emerald-400">Mindra</span>
            <span>Info</span>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/10 hover:text-white"
          >
            ← Website
          </Link>

        </div>

      </header>

      {/* MAIN */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-20">

        {/* TITLE */}
        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-5 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300 backdrop-blur">
            Private Administration
          </div>

          <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
            Who are you?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
            Select your role to continue to the MindraInfo administration
            system.
          </p>

        </div>

        {/* ROLE CARDS */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {roles.map((role) => (
            <Link
              key={role.title}
              href={role.href}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:bg-white/[0.10] hover:shadow-2xl ${role.border} ${role.glow}`}
            >

              {/* CARD GLOW */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 transition duration-500 group-hover:opacity-100`}
              />

              <div className="relative">

                <div className="mb-6 flex items-center justify-between">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-3xl shadow-lg backdrop-blur">
                    {role.icon}
                  </div>

                  <div className="text-white/20 transition duration-300 group-hover:translate-x-1 group-hover:text-white/70">
                    →
                  </div>

                </div>

                <h2 className="text-xl font-black">
                  {role.title}
                </h2>

                <p className="mt-2 min-h-[48px] text-sm leading-6 text-white/50">
                  {role.description}
                </p>

                <div className="mt-6 text-sm font-bold text-emerald-300">
                  Continue as {role.title} →
                </div>

              </div>

            </Link>
          ))}

        </div>

        {/* SECURITY MESSAGE */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-center text-xs leading-5 text-white/40 backdrop-blur-xl">
          Your selected role does not grant access by itself. MindraInfo
          verifies your account and permissions before allowing access.
        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20">

        <div className="mx-auto max-w-7xl px-6 py-7 text-center text-xs text-white/30">
          © 2026 MindraInfo · Private Administration
        </div>

      </footer>

    </main>
  );
}