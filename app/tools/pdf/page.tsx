"use client";

import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Merge,
  Scissors,
  Minimize2,
  RotateCw,
  Layers3,
  Image,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
} from "lucide-react";

const tools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files into one document.",
    icon: Merge,
    color: "violet",
    href: "/tools/pdf/merge",
  },
  {
    title: "Split PDF",
    description: "Separate pages or selected sections into new PDFs.",
    icon: Scissors,
    color: "blue",
    href: "/tools/pdf/split",
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF file size while keeping good quality.",
    icon: Minimize2,
    color: "emerald",
    href: "/tools/pdf/compress",
  },
  {
    title: "Rotate PDF",
    description: "Rotate one or multiple PDF pages with ease.",
    icon: RotateCw,
    color: "amber",
    href: "/tools/pdf/rotate",
  },
  {
    title: "Organize PDF",
    description: "Reorder, remove and arrange PDF pages.",
    icon: Layers3,
    color: "pink",
    href: "/tools/pdf/organize",
  },
  {
    title: "JPG to PDF",
    description: "Convert JPG images into a clean PDF document.",
    icon: Image,
    color: "cyan",
    href: "/tools/pdf/jpg-to-pdf",
  },
  {
    title: "PDF to JPG",
    description: "Convert PDF pages into high-quality JPG images.",
    icon: Image,
    color: "indigo",
    href: "/tools/pdf/pdf-to-jpg",
  },
      // =====================================================
  // OFFICE ↔ PDF CONVERSION
  // =====================================================

  {
    title: "Word → PDF",
    description: "Convert Word DOC and DOCX documents into PDF files.",
    icon: FileText,
    color: "blue",
    href: "/tools/pdf/word-to-pdf",
  },
  {
    title: "PDF → Word",
    description: "Convert PDF documents into editable Word files.",
    icon: FileText,
    color: "violet",
    href: "/tools/pdf/pdf-to-word",
  },
  {
    title: "Excel → PDF",
    description: "Convert Excel XLS and XLSX spreadsheets into PDF files.",
    icon: FileText,
    color: "emerald",
    href: "/tools/pdf/excel-to-pdf",
  },
  {
    title: "PDF → Excel",
    description: "Convert PDF tables and data into editable Excel files.",
    icon: FileText,
    color: "cyan",
    href: "/tools/pdf/pdf-to-excel",
  },
  {
    title: "PowerPoint → PDF",
    description: "Convert PowerPoint PPT and PPTX presentations into PDF.",
    icon: FileText,
    color: "amber",
    href: "/tools/pdf/powerpoint-to-pdf",
  },
  {
    title: "PDF → PowerPoint",
    description: "Convert PDF pages into editable PowerPoint presentations.",
    icon: FileText,
    color: "pink",
    href: "/tools/pdf/pdf-to-powerpoint",
  },
];

const colorStyles: Record<
  string,
  {
    icon: string;
    glow: string;
    hover: string;
  }
> = {
  violet: {
    icon: "bg-violet-500/10 text-violet-600",
    glow: "group-hover:bg-violet-500/15",
    hover: "group-hover:border-violet-300",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-600",
    glow: "group-hover:bg-blue-500/15",
    hover: "group-hover:border-blue-300",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600",
    glow: "group-hover:bg-emerald-500/15",
    hover: "group-hover:border-emerald-300",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600",
    glow: "group-hover:bg-amber-500/15",
    hover: "group-hover:border-amber-300",
  },
  pink: {
    icon: "bg-pink-500/10 text-pink-600",
    glow: "group-hover:bg-pink-500/15",
    hover: "group-hover:border-pink-300",
  },
  cyan: {
    icon: "bg-cyan-500/10 text-cyan-600",
    glow: "group-hover:bg-cyan-500/15",
    hover: "group-hover:border-cyan-300",
  },
  indigo: {
    icon: "bg-indigo-500/10 text-indigo-600",
    glow: "group-hover:bg-indigo-500/15",
    hover: "group-hover:border-indigo-300",
  },
};

export default function PdfToolsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">

      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

        {/* TOP NAVIGATION */}
        <div className="flex items-center justify-between">

          <Link
            href="/tools"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:-translate-x-1 hover:border-slate-300 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            All Tools
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 sm:flex">
            <Lock className="h-3.5 w-3.5" />
            Private Processing
          </div>

        </div>

        {/* HERO */}
        <section className="relative mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

          <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-violet-100 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-48 w-48 rounded-full bg-cyan-100/60 blur-3xl" />

          <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">

            <div className="max-w-3xl">

              {/* ICON */}
              <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 shadow-sm">
                <FileText className="h-8 w-8 text-violet-600" />
              </div>

              {/* LABEL */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
                <Sparkles className="h-3.5 w-3.5" />
                PDF Tools
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Everything you need to
                <span className="block bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  work with PDF files.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                Convert, organize, compress and manage your PDF documents
                directly from your browser with simple, focused tools.
              </p>

              {/* BENEFITS */}
              <div className="mt-8 flex flex-wrap gap-3">

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Fast processing
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  No account required
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                  <Lock className="h-4 w-4 text-blue-500" />
                  Your files stay private
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* TOOLS SECTION */}
        <section className="mt-12">

          <div className="mb-6 flex items-end justify-between gap-4">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
                Choose a tool
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                PDF tools
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Select what you want to do with your document.
              </p>
            </div>

            <div className="hidden rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-500 sm:block">
              {tools.length} tools
            </div>

          </div>

          {/* TOOL GRID */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {tools.map((tool) => {
              const Icon = tool.icon;
              const styles = colorStyles[tool.color];

              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className={`group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] ${styles.hover}`}
                >

                  {/* HOVER GLOW */}
                  <div
                    className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition duration-500 group-hover:opacity-100 ${styles.glow}`}
                  />

                  <div className="relative">

                    <div className="flex items-start justify-between">

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110 ${styles.icon}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 transition duration-300 group-hover:translate-x-1 group-hover:bg-slate-100">
                        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-slate-700" />
                      </div>

                    </div>

                    <h3 className="mt-6 text-xl font-black tracking-tight text-slate-900">
                      {tool.title}
                    </h3>

                    <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                      {tool.description}
                    </p>

                    <div className="mt-5 text-sm font-bold text-slate-700 transition group-hover:text-violet-600">
                      Open tool
                    </div>

                  </div>

                </Link>
              );
            })}

          </div>
        </section>

        {/* PRIVACY NOTICE */}
        <section className="mt-12 overflow-hidden rounded-[1.75rem] border border-emerald-200 bg-gradient-to-r from-emerald-50 to-cyan-50">

          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>

            <div>
              <h3 className="font-black text-slate-900">
                Designed with privacy in mind
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Files are intended to be processed temporarily for the
                requested operation. We are not building a personal file
                storage system for these tools.
              </p>
            </div>

          </div>

        </section>

        {/* FOOTER */}
        <div className="pb-8 pt-10 text-center text-xs text-slate-400">
          MindraInfo PDF Tools
        </div>

      </div>
    </main>
  );
}