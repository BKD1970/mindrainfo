import Link from "next/link";

const menuItems = [
  {
    name: "Home",
    href: "/",
    icon: "🏠",
  },
  {
    name: "Career",
    href: "/career",
    icon: "🚀",
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: "💼",
  },
  {
    name: "Tools",
    href: "/tools",
    icon: "🛠️",
  },
  {
    name: "Shop",
    href: "/shop",
    icon: "📦",
  },
  {
    name: "Technology",
    href: "/technology",
    icon: "💻",
  },
  {
    name: "Articles",
    href: "/articles",
    icon: "📚",
  },
];

export default function PublicHeader() {
  return (
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

        {/* DESKTOP NAVIGATION */}

        <nav className="hidden min-w-0 items-center gap-6 lg:flex">

          <Link
            href="/career"
            className="whitespace-nowrap text-sm font-medium text-white/65 transition hover:text-cyan-400"
          >
            Career
          </Link>

          <Link
            href="/jobs"
            className="whitespace-nowrap text-sm font-medium text-white/65 transition hover:text-cyan-400"
          >
            Jobs
          </Link>

          <Link
            href="/tools"
            className="whitespace-nowrap text-sm font-medium text-white/65 transition hover:text-cyan-400"
          >
            Tools
          </Link>

          <Link
            href="/shop"
            className="whitespace-nowrap text-sm font-medium text-white/65 transition hover:text-cyan-400"
          >
            Shop
          </Link>

          <Link
            href="/technology"
            className="whitespace-nowrap text-sm font-medium text-white/65 transition hover:text-cyan-400"
          >
            Technology
          </Link>

        </nav>

        {/* MENU + SEARCH */}

        <div className="ml-4 flex shrink-0 items-center gap-2">

          {/* HAMBURGER MENU */}

          <details className="relative">

            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-white/80 backdrop-blur-md transition hover:border-cyan-400/30 hover:bg-white/10 hover:text-white">
              ☰
            </summary>

            <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0a1025]/95 p-2 shadow-2xl backdrop-blur-xl">

              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                Menu
              </p>

              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-cyan-400"
                >
                  {item.icon} {item.name}
                </Link>
              ))}

            </div>

          </details>

          {/* SEARCH */}

          <Link
            href="/search"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition hover:border-cyan-400/30 hover:bg-white/10 hover:text-white"
          >
            🔍 Search
          </Link>

        </div>

      </div>
    </header>
  );
}