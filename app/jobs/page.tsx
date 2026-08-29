"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";

type Job = {
  id: number;
  company: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  posted: string;
  category: string;
  skills: string[];
  description: string;
  company_initial: string;
  applyUrl: string | null;
};

const categories = [
  "All Jobs",
  "Data Analytics",
  "Software",
  "AI",
  "IT",
  "Freshers",
  "Remote",
];

export default function JobsPage() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState("All Jobs");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
  console.error("Error loading jobs:", error);
} else {
  console.log("PUBLISHED JOBS FROM SUPABASE:", data);
  setJobs(data ?? []);
}
      setLoading(false);
    }

    loadJobs();
  }, []);

  
  const scrollLeft = () => {
    carouselRef.current?.scrollBy({
      left: -420,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({
      left: 420,
      behavior: "smooth",
    });
  };

  const filteredJobs =
    selectedCategory === "All Jobs"
      ? jobs
      : jobs.filter((job) => {
          if (selectedCategory === "Freshers") {
            return job.experience.toLowerCase().includes("fresh");
          }

          if (selectedCategory === "Remote") {
            return job.location.toLowerCase() === "remote";
          }

          if (selectedCategory === "IT") {
            return ["Software", "AI", "Data Analytics"].includes(
              job.category
            );
          }

          return job.category === selectedCategory;
        });

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f4] text-gray-900">

      {/* HEADER */}
<SiteHeader />

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-emerald-300/25 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-48 h-[400px] w-[400px] rounded-full bg-teal-300/20 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-180px] right-[25%] h-[420px] w-[420px] rounded-full bg-blue-300/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur-md">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

              Career Opportunities

            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">

              Find your next
              <br />

              <span className="text-emerald-600">
                opportunity.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              Discover jobs, internships and career opportunities across
              technology, data, AI and other growing fields.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6">

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex gap-3 overflow-x-auto pb-2">

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

          <div className="mt-5 grid gap-4 md:grid-cols-3">

            <select
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-emerald-500"
              defaultValue="India"
            >
              <option>India</option>
              <option>Remote</option>
              <option>Bengaluru</option>
              <option>Bhubaneswar</option>
              <option>Hyderabad</option>
              <option>Pune</option>
              <option>Delhi</option>
              <option>Mumbai</option>
            </select>

            <select
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-emerald-500"
              defaultValue="Any Experience"
            >
              <option>Any Experience</option>
              <option>Freshers</option>
              <option>0–2 years</option>
              <option>2–5 years</option>
              <option>5+ years</option>
            </select>

            <select
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-emerald-500"
              defaultValue="All Job Types"
            >
              <option>All Job Types</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>

          </div>

        </div>

      </section>

      {/* =====================================================
          JOBS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="flex items-end justify-between gap-6">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
              Job Opportunities
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Latest jobs
            </h2>

            <p className="mt-4 text-gray-600">
              Explore opportunities and find your next career move.
            </p>

          </div>

          <div className="hidden gap-3 md:flex">

            <button
              onClick={scrollLeft}
              aria-label="Scroll jobs left"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-xl font-bold shadow-sm transition hover:bg-gray-100"
            >
              ←
            </button>

            <button
              onClick={scrollRight}
              aria-label="Scroll jobs right"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-xl font-bold shadow-sm transition hover:bg-gray-100"
            >
              →
            </button>

          </div>

        </div>

        {filteredJobs.length > 0 ? (

          <div
            ref={carouselRef}
            className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8"
          >

            {filteredJobs.map((job) => (

              <article
                key={job.id}
                className="group min-w-[320px] snap-start rounded-[2rem] border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl md:min-w-[390px]"
              >

                {/* Company header */}

                <div className="flex items-start justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-black text-emerald-600">
                    {job.company_initial}
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {job.posted}
                  </span>

                </div>

                {/* Main information */}

                <div className="mt-7">

                  <p className="text-sm font-semibold text-emerald-600">
                    {job.company}
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    {job.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {job.description}
                  </p>

                </div>

                {/* Job details */}

                <div className="mt-6 space-y-2 text-sm text-gray-600">

                  <div>
                    📍 {job.location}
                  </div>

                  <div>
                    💼 {job.type}
                  </div>

                  <div>
                    🎓 {job.experience}
                  </div>

                </div>

                {/* Skills */}

                <div className="mt-6 flex flex-wrap gap-2">

                  {job.skills.map((skill) => (

                    <span
                      key={skill}
                      className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

                {/* Application */}

                <div className="mt-7 border-t border-gray-100 pt-6">

                  {job.applyUrl ? (

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-700"
                    >
                      View & Apply →
                    </a>

                  ) : (

                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-xl bg-gray-200 px-5 py-3.5 font-bold text-gray-500"
                    >
                      Application Link Coming Soon
                    </button>

                  )}

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-12 text-center">

            <div className="text-4xl">
              🔎
            </div>

            <h3 className="mt-4 text-2xl font-bold">
              No jobs found
            </h3>

            <p className="mt-2 text-gray-500">
              Try selecting another job category.
            </p>

          </div>

        )}

        <p className="mt-2 text-center text-sm text-gray-400 md:hidden">
          ← Swipe left or right to explore jobs →
        </p>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="border-y border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              How MindraInfo Jobs Works
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Simple for job seekers.
            </h2>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Discover",
                text: "Find relevant opportunities through categories, locations and experience levels.",
              },
              {
                number: "02",
                title: "Understand",
                text: "Read a concise summary of the role, requirements, skills and other important information.",
              },
              {
                number: "03",
                title: "Apply",
                text: "Follow the original employer or recruiter application link to apply directly.",
              },
            ].map((item) => (

              <div
                key={item.number}
                className="rounded-3xl border border-gray-200 bg-gray-50 p-7"
              >

                <div className="text-sm font-black text-emerald-600">
                  {item.number}
                </div>

                <h3 className="mt-4 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          ORIGINAL SOURCE
      ====================================================== */}

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">

        <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-10 md:p-14">

          <div className="text-4xl">
            🔗
          </div>

          <h2 className="mt-5 text-3xl font-black">
            Apply through the original source.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            MindraInfo helps you discover opportunities. When a verified
            application link is available, you will be directed to the
            original employer or recruiter website to complete your
            application.
          </p>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">

          <p>
            © 2026 MindraInfo. All rights reserved.
          </p>

          <Link
            href="/"
            className="font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Back to MindraInfo →
          </Link>

        </div>

      </footer>

    </main>
  );
}