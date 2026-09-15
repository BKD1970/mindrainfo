"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";

type Job = {
  id: number;
  company: string | null;
  title: string | null;
  location: string | null;
  type: string | null;
  experience: string | null;
  posted: string | null;
  category: string | null;
  skills: string[] | null;
  description: string | null;
  company_initial: string | null;

  applyUrl: string | null;
  apply_url: string | null;

  published: boolean | null;

  sector: string | null;
  job_category: string | null;
  sub_category: string | null;

  government_level: string | null;
  state: string | null;
  state_code: string | null;

  organization: string | null;
  department: string | null;
  ministry: string | null;

  work_mode: string | null;
  employment_type: string | null;

  experience_min: number | null;
  experience_max: number | null;

  education: string | null;

  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;

  vacancies: number | null;

  age_limit: string | null;
  age_relaxation: string | null;

  application_start: string | null;
  application_deadline: string | null;
  exam_date: string | null;

  notification_type: string | null;

  source_name: string | null;
  source_url: string | null;

  provider_logo_url: string | null;

  is_government: boolean | null;

  status: string | null;
};

type SectorFilter =
  | "All Jobs"
  | "Government"
  | "Private"
  | "PSU"
  | "Banking"
  | "Railway"
  | "Defence";

type ExperienceFilter =
  | "Any Experience"
  | "Freshers"
  | "0–2 years"
  | "2–5 years"
  | "5+ years";

const sectorFilters: SectorFilter[] = [
  "All Jobs",
  "Government",
  "Private",
  "PSU",
  "Banking",
  "Railway",
  "Defence",
];

const stateOptions = [
  ["", "State-wise"],
  ["AN", "Andaman and Nicobar Islands (AN)"],
  ["AP", "Andhra Pradesh (AP)"],
  ["AR", "Arunachal Pradesh (AR)"],
  ["AS", "Assam (AS)"],
  ["BR", "Bihar (BR)"],
  ["CH", "Chandigarh (CH)"],
  ["CG", "Chhattisgarh (CG)"],
  ["DL", "Delhi (DL)"],
  ["GA", "Goa (GA)"],
  ["GJ", "Gujarat (GJ)"],
  ["HR", "Haryana (HR)"],
  ["HP", "Himachal Pradesh (HP)"],
  ["JK", "Jammu and Kashmir (JK)"],
  ["JH", "Jharkhand (JH)"],
  ["KA", "Karnataka (KA)"],
  ["KL", "Kerala (KL)"],
  ["LA", "Ladakh (LA)"],
  ["LD", "Lakshadweep (LD)"],
  ["MP", "Madhya Pradesh (MP)"],
  ["MH", "Maharashtra (MH)"],
  ["MN", "Manipur (MN)"],
  ["ML", "Meghalaya (ML)"],
  ["MZ", "Mizoram (MZ)"],
  ["NL", "Nagaland (NL)"],
  ["OD", "Odisha (OD)"],
  ["PY", "Puducherry (PY)"],
  ["PB", "Punjab (PB)"],
  ["RJ", "Rajasthan (RJ)"],
  ["SK", "Sikkim (SK)"],
  ["TN", "Tamil Nadu (TN)"],
  ["TS", "Telangana (TS)"],
  ["TR", "Tripura (TR)"],
  ["UP", "Uttar Pradesh (UP)"],
  ["UK", "Uttarakhand (UK)"],
  ["WB", "West Bengal (WB)"],
];

function parseExperience(job: Job) {
  if (typeof job.experience_min === "number") {
    return {
      min: job.experience_min,
      max:
        typeof job.experience_max === "number"
          ? job.experience_max
          : Infinity,
    };
  }

  const text = (job.experience ?? "").toLowerCase();

  if (
    text.includes("fresh") ||
    text.includes("no experience")
  ) {
    return {
      min: 0,
      max: 0,
    };
  }

  const numbers = text.match(/\d+(?:\.\d+)?/g);

  if (!numbers || numbers.length === 0) {
    return {
      min: 0,
      max: Infinity,
    };
  }

  const values = numbers.map(Number);

  if (text.includes("+")) {
    return {
      min: values[0],
      max: Infinity,
    };
  }

  if (
    values.length >= 2 &&
    (
      text.includes("-") ||
      text.includes("–") ||
      text.includes("to")
    )
  ) {
    return {
      min: values[0],
      max: values[1],
    };
  }

  return {
    min: values[0],
    max: values[0],
  };
}

function matchesExperience(
  job: Job,
  filter: ExperienceFilter
) {
  if (filter === "Any Experience") {
    return true;
  }

  const { min, max } = parseExperience(job);

  if (filter === "Freshers") {
    return min === 0;
  }

  if (filter === "0–2 years") {
    return min <= 2 && max >= 0;
  }

  if (filter === "2–5 years") {
    return min <= 5 && max >= 2;
  }

  if (filter === "5+ years") {
    return max >= 5;
  }

  return true;
}

function getCanonicalApplyUrl(job: Job) {
  return job.apply_url ?? job.applyUrl ?? null;
}

function matchesSector(
  job: Job,
  selected: SectorFilter
) {
  if (selected === "All Jobs") {
    return true;
  }

  const sector = (job.sector ?? "").toLowerCase();

  const category = (
    job.job_category ??
    job.category ??
    ""
  ).toLowerCase();

  const government =
    job.is_government === true ||
    sector === "government";

  if (selected === "Government") {
    return government;
  }

  if (selected === "Private") {
    return !government && sector === "private";
  }

  if (selected === "PSU") {
    return (
      sector === "psu" ||
      category.includes("psu")
    );
  }

  if (selected === "Banking") {
    return (
      sector === "banking" ||
      category.includes("bank")
    );
  }

  if (selected === "Railway") {
    return (
      sector === "railway" ||
      category.includes("railway")
    );
  }

  if (selected === "Defence") {
    return (
      sector === "defence" ||
      category.includes("defence")
    );
  }

  return true;
}

function matchesState(
  job: Job,
  selectedState: string
) {
  if (!selectedState) {
    return true;
  }

  return (
    (job.state_code ?? "").toUpperCase() ===
    selectedState.toUpperCase()
  );
}

function formatDeadline(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPosted(value: string | null) {
  if (!value) {
    return "Recently posted";
  }

  return value;
}

export default function JobsPage() {
  const [selectedSector, setSelectedSector] =
    useState<SectorFilter>("All Jobs");

  const [selectedCategory, setSelectedCategory] =
    useState("Categories");

  const [selectedState, setSelectedState] =
    useState("");

  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceFilter>("Any Experience");

  const [selectedJobType, setSelectedJobType] =
    useState("Job Types");

  const [selectedWorkMode, setSelectedWorkMode] =
    useState("Work Modes");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [expandedJobs, setExpandedJobs] =
    useState<number[]>([]);

  const [showAll, setShowAll] =
    useState(false);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("jobs")
        .select("*")
        .eq("published", true)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Error loading jobs:",
          error
        );

        setJobs([]);
      } else {
        setJobs(
          (data ?? []) as Job[]
        );
      }

      setLoading(false);
    }

    loadJobs();
  }, []);

  /*
   * CATEGORIES ARE BUILT FROM ALL PUBLISHED JOBS.
   *
   * Therefore:
   * All Jobs -> Government + Private + PSU +
   * Banking + Railway + Defence + everything else
   *
   * Categories -> categories found across ALL
   * published jobs, regardless of sector.
   */
  const categoryOptions =
    useMemo(() => {
      const values = jobs
        .map(
          (job) =>
            job.job_category ??
            job.category ??
            ""
        )
        .map((value) =>
          value.trim()
        )
        .filter(Boolean);

      return [
        "Categories",
        ...Array.from(
          new Set(values)
        ).sort(),
      ];
    }, [jobs]);


  const jobTypeOptions =
    useMemo(() => {
      const values = jobs
        .map(
          (job) =>
            job.employment_type ??
            job.type ??
            ""
        )
        .map((value) =>
          value.trim()
        )
        .filter(Boolean);

      return [
        "Job Types",
        ...Array.from(
          new Set(values)
        ).sort(),
      ];
    }, [jobs]);


  const workModeOptions =
    useMemo(() => {
      const values = jobs
        .map(
          (job) =>
            job.work_mode ?? ""
        )
        .map((value) =>
          value.trim()
        )
        .filter(Boolean);

      return [
        "Work Modes",
        ...Array.from(
          new Set(values)
        ).sort(),
      ];
    }, [jobs]);


  /*
   * FILTERED JOBS
   */
  const filteredJobs = useMemo(() => {
    const query =
      searchQuery
        .trim()
        .toLowerCase();

    return jobs.filter((job) => {
      const category =
        job.job_category ??
        job.category ??
        "";

      const type =
        job.employment_type ??
        job.type ??
        "";

      const searchableText = [
        job.title ?? "",
        job.company ?? "",
        job.location ?? "",
        job.state ?? "",
        job.state_code ?? "",
        category,
        job.sector ?? "",
        job.description ?? "",
        ...(job.skills ?? []),
      ]
        .join(" ")
        .toLowerCase();

      /*
       * SEARCH
       */
      if (
        query &&
        !searchableText.includes(query)
      ) {
        return false;
      }

      /*
       * SECTOR
       *
       * All Jobs intentionally returns
       * every published job.
       */
      if (
        !matchesSector(
          job,
          selectedSector
        )
      ) {
        return false;
      }

      /*
       * CATEGORY
       *
       * Categories are collected from
       * all published jobs.
       */
      if (
        selectedCategory !==
          "Categories" &&
        category !== selectedCategory
      ) {
        return false;
      }

      /*
       * STATE
       */
      if (
        !matchesState(
          job,
          selectedState
        )
      ) {
        return false;
      }

      /*
       * EXPERIENCE
       */
      if (
        !matchesExperience(
          job,
          selectedExperience
        )
      ) {
        return false;
      }

      /*
       * JOB TYPE
       */
      if (
        selectedJobType !==
          "Job Types" &&
        type !== selectedJobType
      ) {
        return false;
      }

      /*
       * WORK MODE
       */
      if (
        selectedWorkMode !==
          "Work Modes" &&
        job.work_mode !==
          selectedWorkMode
      ) {
        return false;
      }

      return true;
    });
  }, [
    jobs,
    searchQuery,
    selectedSector,
    selectedCategory,
    selectedState,
    selectedExperience,
    selectedJobType,
    selectedWorkMode,
  ]);


  /*
   * Maximum 36 initial cards on desktop:
   * 6 columns × 6 rows.
   *
   * Mobile uses the full filtered set inside
   * the 20-card vertical columns.
   */
  const visibleJobs = showAll
    ? filteredJobs
    : filteredJobs.slice(0, 36);


  function toggleReadMore(
    jobId: number
  ) {
    setExpandedJobs((current) =>
      current.includes(jobId)
        ? current.filter(
            (id) => id !== jobId
          )
        : [
            ...current,
            jobId,
          ]
    );
  }


  function resetFilters() {
    setSelectedSector("All Jobs");
    setSelectedCategory("Categories");
    setSelectedState("");
    setSelectedExperience(
      "Any Experience"
    );
    setSelectedJobType("Job Types");
    setSelectedWorkMode("Work Modes");
    setSearchQuery("");
    setShowAll(false);
  }


  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f4] text-gray-900">

      {/* HEADER */}

      <SiteHeader />


      {/* HERO */}

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-emerald-300/25 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-48 h-[400px] w-[400px] rounded-full bg-teal-300/20 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-180px] right-[25%] h-[420px] w-[420px] rounded-full bg-blue-300/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 md:py-32">

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
              Discover government and private
              opportunities across technology,
              data, AI, business and other growing
              fields.
            </p>

          </div>

        </div>

      </section>


      {/* FILTERS */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6">

        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

          {/* SEARCH */}

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="relative flex-1">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔎
              </span>

              <input
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search jobs, companies, skills..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500"
              />

            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-600 transition hover:bg-gray-100"
            >
              Reset Filters
            </button>

          </div>


          {/* MAIN TABS */}

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">

            {sectorFilters.map(
              (sector) => (

                <button
                  key={sector}
                  type="button"
                  onClick={() => {
                    setSelectedSector(
                      sector
                    );

                    setShowAll(false);
                  }}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                    selectedSector ===
                    sector
                      ? "bg-gray-900 text-white shadow-md"
                      : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {sector}
                </button>

              )
            )}

          </div>


          {/* SECONDARY FILTERS */}

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

            <select
              value={
                selectedCategory
              }
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-xs font-semibold outline-none focus:border-emerald-500"
            >
              {categoryOptions.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>


            <select
              value={
                selectedState
              }
              onChange={(e) =>
                setSelectedState(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-xs font-semibold outline-none focus:border-emerald-500"
            >

              {stateOptions.map(
                ([code, label]) => (
                  <option
                    key={code}
                    value={code}
                  >
                    {label}
                  </option>
                )
              )}

            </select>


            <select
              value={
                selectedExperience
              }
              onChange={(e) =>
                setSelectedExperience(
                  e.target.value as ExperienceFilter
                )
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-xs font-semibold outline-none focus:border-emerald-500"
            >

              <option value="Any Experience">
                Experience
              </option>

              <option value="Freshers">
                Freshers
              </option>

              <option value="0–2 years">
                0–2 years
              </option>

              <option value="2–5 years">
                2–5 years
              </option>

              <option value="5+ years">
                5+ years
              </option>

            </select>


            <select
              value={
                selectedJobType
              }
              onChange={(e) =>
                setSelectedJobType(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-xs font-semibold outline-none focus:border-emerald-500"
            >

              {jobTypeOptions.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                )
              )}

            </select>


            <select
              value={
                selectedWorkMode
              }
              onChange={(e) =>
                setSelectedWorkMode(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-xs font-semibold outline-none focus:border-emerald-500"
            >

              {workModeOptions.map(
                (mode) => (
                  <option
                    key={mode}
                    value={mode}
                  >
                    {mode}
                  </option>
                )
              )}

            </select>

          </div>


          {/* RESULTS */}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">

            <p className="text-xs text-gray-500">

              <span className="font-bold text-gray-900">
                {filteredJobs.length}
              </span>{" "}

              {filteredJobs.length === 1
                ? "job"
                : "jobs"}{" "}
              found

            </p>

            {selectedSector ===
              "Government" && (
              <p className="text-[11px] font-semibold text-blue-600">
                Central & State Government
                opportunities
              </p>
            )}

          </div>

        </div>

      </section>


      {/* JOBS */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600">
              Job Opportunities
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Latest jobs
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Explore verified opportunities
              and apply through the original
              source.
            </p>

          </div>

          <p className="text-xs text-gray-400">
            Showing{" "}
            {visibleJobs.length}{" "}
            of{" "}
            {filteredJobs.length}
          </p>

        </div>


        {loading ? (

          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-12 text-center">

            <div className="text-3xl">
              ⏳
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Loading jobs...
            </p>

          </div>

        ) : visibleJobs.length > 0 ? (

          <>

            {/* DESKTOP / TABLET
                6 COLUMNS × 6 ROWS */}

            <div className="mt-8 hidden gap-3 md:grid md:grid-cols-6">

              {visibleJobs.map(
                (job) => {

                  const expanded =
                    expandedJobs.includes(
                      job.id
                    );

                  const description =
                    job.description ??
                    "Job description not available.";

                  const displayDescription =
                    expanded
                      ? description
                      : description.length > 130
                      ? `${description.slice(
                          0,
                          130
                        )}…`
                      : description;

                  const applyUrl =
                    getCanonicalApplyUrl(
                      job
                    );

                  const deadline =
                    formatDeadline(
                      job.application_deadline
                    );

                  return (
                    <article
                      key={job.id}
                      className="group relative flex min-h-[310px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
                    >

                      {job.provider_logo_url && (
                        <div
                          className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat opacity-[0.055]"
                          style={{
                            backgroundImage:
                              `url("${job.provider_logo_url}")`,
                          }}
                        />
                      )}

                      <div className="relative z-10 flex h-full flex-col">

                        <div className="flex items-start justify-between gap-2">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-sm font-black text-emerald-600">

                            {job.provider_logo_url ? (
                              <img
                                src={
                                  job.provider_logo_url
                                }
                                alt=""
                                className="h-full w-full object-contain p-1.5"
                              />
                            ) : (
                              job.company_initial ||
                              job.company
                                ?.charAt(0)
                                .toUpperCase() ||
                              "J"
                            )}

                          </div>

                          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-700">
                            {formatPosted(
                              job.posted
                            )}
                          </span>

                        </div>


                        <div className="mt-3">

                          <p className="truncate text-[10px] font-bold text-emerald-600">
                            {job.company ||
                              "Organization"}
                          </p>

                          <h3 className="mt-1 line-clamp-2 text-sm font-black leading-5">
                            {job.title ||
                              "Untitled Job"}
                          </h3>

                        </div>


                        <div className="mt-2 space-y-1 text-[9px] leading-4 text-gray-500">

                          <div>
                            📍{" "}
                            {job.location ||
                              "Location not specified"}
                          </div>

                          <div>
                            💼{" "}
                            {job.employment_type ||
                              job.type ||
                              "Job"}
                          </div>

                          <div>
                            🎓{" "}
                            {job.experience ||
                              "Experience not specified"}
                          </div>

                        </div>


                        <div className="mt-3">

                          <p className="text-[9px] leading-4 text-gray-600">
                            {displayDescription}
                          </p>

                          {description.length >
                            130 && (
                            <button
                              type="button"
                              onClick={() =>
                                toggleReadMore(
                                  job.id
                                )
                              }
                              className="mt-1 text-[9px] font-bold text-blue-600 hover:text-blue-800"
                            >
                              {expanded
                                ? "Show less ↑"
                                : "Read more →"}
                            </button>
                          )}

                        </div>


                        <div className="mt-3 flex flex-wrap gap-1">

                          {(job.state_code ||
                            job.job_category ||
                            job.category) && (
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-[8px] font-semibold text-gray-600">
                              {job.state_code
                                ? `${job.state_code} • `
                                : ""}
                              {job.job_category ||
                                job.category}
                            </span>
                          )}

                          {job.work_mode && (
                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[8px] font-semibold text-blue-700">
                              {job.work_mode}
                            </span>
                          )}

                        </div>


                        <div className="mt-auto pt-3">

                          {deadline && (
                            <p className="mb-2 text-[8px] font-semibold text-gray-400">
                              Apply by:{" "}
                              {deadline}
                            </p>
                          )}

                          {applyUrl ? (
                            <a
                              href={
                                applyUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center rounded-lg bg-emerald-600 px-2.5 py-2 text-[9px] font-bold text-white transition hover:bg-emerald-700"
                            >
                              View & Apply →
                            </a>
                          ) : (
                            <Link
                              href={`/jobs/${job.id}`}
                              className="flex items-center justify-center rounded-lg bg-gray-900 px-2.5 py-2 text-[9px] font-bold text-white transition hover:bg-gray-800"
                            >
                              View Details →
                            </Link>
                          )}

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

{/* MOBILE JOB GRID
    10 COLUMNS HORIZONTALLY
    ROW-WISE ORDER:

    Row 1  → Job 1  ... Job 10
    Row 2  → Job 11 ... Job 20
    Row 3  → Job 21 ... Job 30
    etc.

    About 3 cards are visible initially.
    Swipe LEFT / RIGHT to see the remaining columns.
*/}

<div className="mt-8 overflow-x-auto overscroll-x-contain pb-4 md:hidden">
  <div
    className="grid gap-2"
    style={{
      gridTemplateColumns:
        "repeat(10, 31vw)",
      gridAutoRows:
        "minmax(250px, auto)",
      width: "max-content",
    }}
  >

    {filteredJobs.map((job) => {

      const expanded =
        expandedJobs.includes(job.id);

      const description =
        job.description ??
        "Job description not available.";

      const displayDescription =
        expanded
          ? description
          : description.length > 105
          ? `${description.slice(
              0,
              105
            )}…`
          : description;

      const applyUrl =
        getCanonicalApplyUrl(job);

      return (
        <article
          key={job.id}
          className="group relative flex min-h-[250px] w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-2.5 shadow-sm"
        >

          {/* LOGO SHADOW */}

          {job.provider_logo_url && (
            <div
              className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat opacity-[0.055]"
              style={{
                backgroundImage:
                  `url("${job.provider_logo_url}")`,
              }}
            />
          )}


          <div className="relative z-10 flex h-full flex-col">

            {/* TOP */}

            <div className="flex items-start justify-between gap-1">

              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-emerald-50 text-[10px] font-black text-emerald-600">

                {job.provider_logo_url ? (
                  <img
                    src={
                      job.provider_logo_url
                    }
                    alt=""
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  job.company_initial ||
                  job.company
                    ?.charAt(0)
                    .toUpperCase() ||
                  "J"
                )}

              </div>

              <span className="max-w-[70%] truncate rounded-full bg-emerald-50 px-1.5 py-1 text-[6px] font-bold text-emerald-700">
                {formatPosted(job.posted)}
              </span>

            </div>


            {/* TITLE */}

            <div className="mt-2">

              <p className="truncate text-[8px] font-bold text-emerald-600">
                {job.company ||
                  "Organization"}
              </p>

              <h3 className="mt-0.5 line-clamp-2 text-[11px] font-black leading-4">
                {job.title ||
                  "Untitled Job"}
              </h3>

            </div>


            {/* META */}

            <div className="mt-2 space-y-0.5 text-[7px] leading-3.5 text-gray-500">

              <div className="truncate">
                📍{" "}
                {job.location ||
                  "Location"}
              </div>

              <div className="truncate">
                💼{" "}
                {job.employment_type ||
                  job.type ||
                  "Job"}
              </div>

              <div className="line-clamp-2">
                🎓{" "}
                {job.experience ||
                  "Experience"}
              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="mt-2">

              <p className="text-[7px] leading-3.5 text-gray-600">
                {displayDescription}
              </p>

              {description.length >
                105 && (
                <button
                  type="button"
                  onClick={() =>
                    toggleReadMore(
                      job.id
                    )
                  }
                  className="mt-1 text-[7px] font-bold text-blue-600"
                >
                  {expanded
                    ? "Show less ↑"
                    : "Read more →"}
                </button>
              )}

            </div>


            {/* TAGS */}

            <div className="mt-2 flex flex-wrap gap-1">

              {(job.state_code ||
                job.job_category ||
                job.category) && (
                <span className="max-w-full truncate rounded-full bg-gray-100 px-1.5 py-0.5 text-[6px] font-semibold text-gray-600">
                  {job.state_code
                    ? `${job.state_code} • `
                    : ""}
                  {job.job_category ||
                    job.category}
                </span>
              )}

            </div>


            {/* APPLY */}

            <div className="mt-auto pt-2">

              {applyUrl ? (
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-md bg-emerald-600 px-1.5 py-1.5 text-[7px] font-bold text-white"
                >
                  Apply →
                </a>
              ) : (
                <Link
                  href={`/jobs/${job.id}`}
                  className="flex items-center justify-center rounded-md bg-gray-900 px-1.5 py-1.5 text-[7px] font-bold text-white"
                >
                  Details →
                </Link>
              )}

            </div>

          </div>

        </article>
      );
    })}

  </div>
</div>


{/* MOBILE SCROLL MESSAGE */}

<p className="mt-2 text-center text-[10px] text-gray-400 md:hidden">
  ← Swipe left or right to see more jobs →
</p>


            {/* SEE ALL */}

            {filteredJobs.length > 36 && (
              <div className="mt-6 text-center">

                <button
                  type="button"
                  onClick={() =>
                    setShowAll(
                      (current) =>
                        !current
                    )
                  }
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-100"
                >
                  {showAll
                    ? "Show 36 Jobs ↑"
                    : `See All ${filteredJobs.length} Jobs →`}
                </button>

              </div>
            )}

          </>

        ) : (

          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-10 text-center">

            <div className="text-4xl">
              🔎
            </div>

            <h3 className="mt-4 text-xl font-bold">
              No jobs found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try changing one or more filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-bold text-white"
            >
              Reset Filters
            </button>

          </div>

        )}

      </section>


      {/* HOW IT WORKS */}

      <section className="border-y border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">

          <div className="mb-10">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
              How MindraInfo Jobs Works
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Simple for job seekers.
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Discover",
                text: "Find relevant opportunities through categories, locations, experience and work modes.",
              },
              {
                number: "02",
                title: "Understand",
                text: "Read the key information, skills, requirements and important dates before applying.",
              },
              {
                number: "03",
                title: "Apply",
                text: "Follow the original employer or official recruitment link to complete your application.",
              },
            ].map(
              (item) => (

                <div
                  key={item.number}
                  className="rounded-3xl border border-gray-200 bg-gray-50 p-6"
                >

                  <div className="text-sm font-black text-emerald-600">
                    {item.number}
                  </div>

                  <h3 className="mt-3 text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {item.text}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ORIGINAL SOURCE */}

      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">

        <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-8 sm:p-10 md:p-14">

          <div className="text-4xl">
            🔗
          </div>

          <h2 className="mt-5 text-2xl font-black sm:text-3xl">
            Apply through the original source.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600">
            MindraInfo helps you discover
            opportunities. When a verified
            application link is available,
            you will be directed to the
            original employer or official
            recruitment website.
          </p>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-7 text-xs text-gray-500 sm:px-6 md:flex-row">

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
