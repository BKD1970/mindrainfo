"use client";

import Link from "next/link";
import { useEffect, useRef,useState } from "react";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  const handleScroll = () => {
    setMenuOpen(false);
  };

  const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("mousedown", handleOutsideClick);
  document.addEventListener("touchstart", handleOutsideClick);

  return () => {
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("mousedown", handleOutsideClick);
    document.removeEventListener("touchstart", handleOutsideClick);
  };
}, []);

  const categories = [
    { name: "Career", href: "/career" },
    { name: "Data Analytics", href: "/data-analytics" },
    { name: "AI", href: "/ai" },
    { name: "Technology", href: "/technology" },
    { name: "Jobs", href: "/jobs" },
    { name: "Shop", href: "/shop" },
    { name: "Tools", href: "/tools" },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* SINGLE COLORFUL LIQUID HEADER */}
        <div
          className="
            relative
            flex
            h-[68px]
            items-center
            overflow-visible
            rounded-[22px]
            border
            border-white/20
            px-5
            shadow-[0_12px_35px_rgba(30,40,120,0.28)]
            sm:px-7
          "
          style={{
            background:
              "linear-gradient(115deg, #172554 0%, #1d4ed8 28%, #4338ca 52%, #7e22ce 76%, #4f46e5 100%)",
          }}
        >
          {/* Liquid glow */}
          <div
            className="
              pointer-events-none
              absolute
              -left-16
              -top-20
              h-40
              w-72
              rounded-full
              bg-cyan-400/25
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              left-[35%]
              -top-24
              h-48
              w-72
              rounded-full
              bg-blue-400/20
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -right-10
              -bottom-24
              h-48
              w-80
              rounded-full
              bg-fuchsia-400/25
              blur-3xl
            "
          />

          {/* Glass highlight */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              h-1/2
              rounded-t-[22px]
              bg-gradient-to-b
              from-white/[0.13]
              to-transparent
            "
          />

          {/* MINDRAINFO LOGO */}
          <Link
            href="/"
            className="
              relative
              z-10
              shrink-0
              text-[21px]
              font-bold
              tracking-[-0.045em]
              transition-opacity
              hover:opacity-85
            "
          >
            <span className="text-[#22c7ff]">Mindra</span>
            <span className="text-white">Info</span>
          </Link>

          {/* RIGHT SIDE */}
          <nav className="relative z-20 ml-auto flex items-center gap-1.5 sm:gap-2">

            {/* HOME */}
            <Link
              href="/"
              aria-label="Home"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-white
                transition-all
                duration-200
                hover:bg-white/15
              "
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 10 9-7 9 7" />
                <path d="M5 9v11h14V9" />
                <path d="M9 20v-6h6v6" />
              </svg>
            </Link>

            {/* MENU */}
            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className={`
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-white
                  transition-all
                  duration-200
                  ${menuOpen ? "bg-white/20" : "hover:bg-white/15"}
                `}
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
              </button>

              {/* CLICKABLE MENU DROPDOWN */}
              {menuOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[48px]
                    z-50
                    w-56
                    rounded-[18px]
                    border
                    border-white/20
                    bg-[#172554]/95
                    p-2
                    shadow-[0_20px_45px_rgba(0,0,0,0.25)]
                    backdrop-blur-xl
                  "
                >
                  {categories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      onClick={() => setMenuOpen(false)}
                      className="
                        block
                        rounded-[12px]
                        px-4
                        py-2.5
                        text-[14px]
                        text-white/85
                        transition-all
                        hover:bg-white/10
                        hover:text-white
                      "
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* SEARCH */}
            <Link
              href="/search"
              aria-label="Search"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-white
                transition-all
                duration-200
                hover:bg-white/15
              "
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </Link>

          </nav>
        </div>
      </div>
    </header>
  );
}