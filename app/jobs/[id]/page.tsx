import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Job = {
  id: number;
  created_at: string;

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

type JobSource = {
  id: number;
  job_id: number;
  source_name: string;
  source_url: string;
  source_type: string | null;
  is_primary: boolean;
};

type JobPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDateTime(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getApplyUrl(job: Job) {
  return job.apply_url ?? job.applyUrl ?? null;
}

function getExperienceText(job: Job) {
  if (
    typeof job.experience_min === "number" ||
    typeof job.experience_max === "number"
  ) {
    const min =
      typeof job.experience_min === "number"
        ? job.experience_min
        : 0;

    const max =
      typeof job.experience_max === "number"
        ? job.experience_max
        : null;

    if (max === null) {
      return `${min}+ years`;
    }

    if (min === max) {
      return `${min} years`;
    }

    return `${min}–${max} years`;
  }

  return job.experience || null;
}

function formatSalary(job: Job) {
  if (
    job.salary_min === null &&
    job.salary_max === null
  ) {
    return null;
  }

  const currency =
    job.salary_currency || "INR";

  const formatter = new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 0,
    }
  );

  if (
    job.salary_min !== null &&
    job.salary_max !== null
  ) {
    return `${currency} ${formatter.format(
      job.salary_min
    )} – ${formatter.format(
      job.salary_max
    )}`;
  }

  if (job.salary_min !== null) {
    return `${currency} ${formatter.format(
      job.salary_min
    )}+`;
  }

  return `${currency} ${formatter.format(
    job.salary_max ?? 0
  )}`;
}

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { id } = await params;

  const jobId = Number(id);

  if (!Number.isInteger(jobId)) {
    return {
      title: "Job Not Found",
      description:
        "The requested job could not be found on MindraInfo.",
    };
  }

  const { data: job } = await supabase
    .from("jobs")
    .select(
      "title, company, location, description"
    )
    .eq("id", jobId)
    .eq("published", true)
    .single();

  if (!job) {
    return {
      title: "Job Not Found",
      description:
        "The requested job could not be found on MindraInfo.",
    };
  }

  return {
    title: `${job.title} at ${job.company}`,
    description:
      `${job.title} at ${job.company} in ${job.location}. Find job details, requirements, skills, important dates and application information on MindraInfo.`,
    alternates: {
      canonical:
        `https://mindrainfo.in/jobs/${jobId}`,
    },
  };
}

export default async function JobDetailsPage({
  params,
}: JobPageProps) {
  const { id } = await params;

  const jobId = Number(id);

  if (!Number.isInteger(jobId)) {
    notFound();
  }

  const {
    data: job,
    error,
  } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("published", true)
    .single<Job>();

  if (error || !job) {
    notFound();
  }

  const {
    data: sourcesData,
  } = await supabase
    .from("job_sources")
    .select("*")
    .eq("job_id", job.id)
    .order("is_primary", {
      ascending: false,
    })
    .order("created_at", {
      ascending: true,
    });

  const sources =
    (sourcesData ?? []) as JobSource[];

  const applyUrl =
    getApplyUrl(job);

  const experienceText =
    getExperienceText(job);

  const salaryText =
    formatSalary(job);

  const category =
    job.job_category ??
    job.category ??
    null;

  const employmentType =
    job.employment_type ??
    job.type ??
    null;

  const jobUrl =
    `https://mindrainfo.in/jobs/${job.id}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": `${jobUrl}#jobposting`,

    title:
      job.title || undefined,

    description:
      job.description || undefined,

    url: jobUrl,

    datePosted:
      job.created_at || undefined,

    validThrough:
      job.application_deadline ||
      undefined,

    employmentType:
      employmentType || undefined,

    hiringOrganization: {
      "@type": "Organization",
      name:
        job.organization ||
        job.company ||
        "MindraInfo Job Provider",

      url:
        job.source_url ||
        undefined,
    },

    jobLocation: {
      "@type": "Place",

      address: {
        "@type": "PostalAddress",

        addressLocality:
          job.location ||
          undefined,

        addressRegion:
          job.state ||
          undefined,

        addressCountry:
          "IN",
      },
    },

    occupationalCategory:
      category || undefined,

    educationRequirements:
      job.education || undefined,

    experienceRequirements:
      experienceText || undefined,

    baseSalary:
      salaryText
        ? {
            "@type": "MonetaryAmount",
            currency:
              job.salary_currency ||
              "INR",
            value: {
              "@type":
                "QuantitativeValue",

              minValue:
                job.salary_min ??
                undefined,

              maxValue:
                job.salary_max ??
                undefined,

              unitText:
                "YEAR",
            },
          }
        : undefined,

    identifier: {
      "@type": "PropertyValue",
      name: "MindraInfo Job ID",
      value: String(job.id),
    },

    industry:
      job.sector ||
      undefined,
  };

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">

      {/* JOBPOSTING STRUCTURED DATA */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            structuredData
          ).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />


      {/* HEADER */}

      <SiteHeader />


      {/* HERO */}

      <section className="relative overflow-hidden border-b border-gray-200 bg-white">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-teal-300/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">

          {/* BACK */}

          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 sm:text-sm"
          >
            ← Back to Jobs
          </Link>


          {/* HEADER INFORMATION */}

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:gap-8">

            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-emerald-50 text-3xl font-black text-emerald-600 shadow-sm">

              {job.provider_logo_url ? (
                <img
                  src={
                    job.provider_logo_url
                  }
                  alt=""
                  className="h-full w-full object-contain p-3"
                />
              ) : (
                job.company_initial ||
                job.company
                  ?.charAt(0)
                  .toUpperCase() ||
                "J"
              )}

            </div>


            <div className="min-w-0 flex-1">

              {/* BADGES */}

              <div className="flex flex-wrap items-center gap-2">

                {job.posted && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                    {job.posted}
                  </span>
                )}

                {category && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-600">
                    {category}
                  </span>
                )}

                {job.sector && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                    {job.sector}
                  </span>
                )}

                {job.is_government && (
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700">
                    Government
                  </span>
                )}

              </div>


              <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
                {job.title}
              </h1>

              <p className="mt-3 text-xl font-bold text-emerald-600">
                {job.company}
              </p>


              {/* QUICK DETAILS */}

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-gray-600 sm:text-sm">

                {job.location && (
                  <span>
                    📍 {job.location}
                  </span>
                )}

                {employmentType && (
                  <span>
                    💼 {employmentType}
                  </span>
                )}

                {experienceText && (
                  <span>
                    🎓 {experienceText}
                  </span>
                )}

                {job.work_mode && (
                  <span>
                    🏠 {job.work_mode}
                  </span>
                )}

                {job.state_code && (
                  <span>
                    🇮🇳 {job.state_code}
                  </span>
                )}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* MAIN CONTENT */}

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">

        <div className="grid gap-7 lg:grid-cols-[1fr_330px]">


          {/* LEFT CONTENT */}

          <div className="space-y-7">


            {/* DESCRIPTION */}

            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-9">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600">
                Job Description
              </p>

              <h2 className="mt-2 text-2xl font-black md:text-3xl">
                About this opportunity
              </h2>

              <div className="mt-6 whitespace-pre-line text-sm leading-8 text-gray-600 md:text-base">
                {job.description ||
                  "Job description not available."}
              </div>


              {/* SKILLS */}

              {job.skills &&
                job.skills.length >
                  0 && (
                  <div className="mt-8 border-t border-gray-100 pt-7">

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                      Skills & Requirements
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {job.skills.map(
                        (skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700"
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )}

            </div>


            {/* GOVERNMENT / RECRUITMENT INFORMATION */}

            {(job.is_government ||
              job.government_level ||
              job.organization ||
              job.department ||
              job.ministry ||
              job.vacancies ||
              job.age_limit ||
              job.age_relaxation ||
              job.notification_type) && (

              <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-9">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                  Recruitment Information
                </p>

                <h2 className="mt-2 text-2xl font-black md:text-3xl">
                  Important details
                </h2>


                <div className="mt-6 grid gap-3 sm:grid-cols-2">


                  {job.organization && (
                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Organization
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {job.organization}
                      </p>

                    </div>
                  )}


                  {job.department && (
                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Department
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {job.department}
                      </p>

                    </div>
                  )}


                  {job.ministry && (
                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Ministry
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {job.ministry}
                      </p>

                    </div>
                  )}


                  {job.government_level && (
                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Government Level
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {job.government_level}
                      </p>

                    </div>
                  )}


                  {job.state && (
                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        State
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {job.state}
                        {job.state_code
                          ? ` (${job.state_code})`
                          : ""}
                      </p>

                    </div>
                  )}


                  {job.vacancies !==
                    null && (
                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Vacancies
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {job.vacancies}
                      </p>

                    </div>
                  )}


                  {job.notification_type && (
                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Notification Type
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {job.notification_type}
                      </p>

                    </div>
                  )}


                  {job.age_limit && (
                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Age Limit
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {job.age_limit}
                      </p>

                    </div>
                  )}


                  {job.age_relaxation && (
                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Age Relaxation
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {job.age_relaxation}
                      </p>

                    </div>
                  )}

                </div>

              </div>
            )}


            {/* CAREER DETAILS */}

            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-9">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600">
                Job Details
              </p>

              <h2 className="mt-2 text-2xl font-black md:text-3xl">
                Career information
              </h2>


              <div className="mt-6 grid gap-3 sm:grid-cols-2">


                {job.location && (
                  <div className="rounded-2xl bg-gray-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      {job.location}
                    </p>

                  </div>
                )}


                {employmentType && (
                  <div className="rounded-2xl bg-gray-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Employment Type
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      {employmentType}
                    </p>

                  </div>
                )}


                {job.work_mode && (
                  <div className="rounded-2xl bg-gray-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Work Mode
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      {job.work_mode}
                    </p>

                  </div>
                )}


                {experienceText && (
                  <div className="rounded-2xl bg-gray-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Experience
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      {experienceText}
                    </p>

                  </div>
                )}


                {job.education && (
                  <div className="rounded-2xl bg-gray-50 p-4 sm:col-span-2">

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Qualification
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      {job.education}
                    </p>

                  </div>
                )}


                {salaryText && (
                  <div className="rounded-2xl bg-gray-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Salary
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      {salaryText}
                    </p>

                  </div>
                )}

              </div>

            </div>


            {/* IMPORTANT DATES */}

            {(job.application_start ||
              job.application_deadline ||
              job.exam_date) && (

              <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-9">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                  Important Dates
                </p>

                <h2 className="mt-2 text-2xl font-black md:text-3xl">
                  Application timeline
                </h2>


                <div className="mt-6 grid gap-3 sm:grid-cols-3">


                  {job.application_start && (
                    <div className="rounded-2xl bg-emerald-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600">
                        Application Starts
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {formatDate(
                          job.application_start
                        )}
                      </p>

                    </div>
                  )}


                  {job.application_deadline && (
                    <div className="rounded-2xl bg-orange-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-600">
                        Apply By
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {formatDateTime(
                          job.application_deadline
                        )}
                      </p>

                    </div>
                  )}


                  {job.exam_date && (
                    <div className="rounded-2xl bg-blue-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">
                        Exam Date
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {formatDateTime(
                          job.exam_date
                        )}
                      </p>

                    </div>
                  )}

                </div>

              </div>
            )}


            {/* SOURCES */}

            {sources.length > 0 && (
              <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-9">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                  Verified Sources
                </p>

                <h2 className="mt-2 text-2xl font-black md:text-3xl">
                  Original information sources
                </h2>

                <div className="mt-6 space-y-2">

                  {sources.map(
                    (source) => (
                      <a
                        key={
                          source.id
                        }
                        href={
                          source.source_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >

                        <span className="truncate">
                          {source.source_name}
                        </span>

                        <span className="shrink-0">
                          Open →
                        </span>

                      </a>
                    )
                  )}

                </div>

              </div>
            )}

          </div>


          {/* RIGHT SIDEBAR */}

          <aside className="h-fit lg:sticky lg:top-24">


            {/* APPLICATION */}

            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6 shadow-sm">

              <div className="text-3xl">
                🚀
              </div>

              <h2 className="mt-3 text-2xl font-black">
                Ready to apply?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Apply directly through the
                original employer or official
                recruitment website.
              </p>


              {applyUrl ? (

                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
                >
                  View & Apply →
                </a>

              ) : (

                <div className="mt-6 rounded-xl bg-white px-5 py-3.5 text-center text-xs font-bold text-gray-500">
                  Application Link Coming Soon
                </div>

              )}

            </div>


            {/* QUICK SUMMARY */}

            <div className="mt-4 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Job Summary
              </p>

              <div className="mt-5 space-y-3 text-xs">


                {job.company && (
                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Company
                    </span>

                    <span className="text-right font-bold">
                      {job.company}
                    </span>

                  </div>
                )}


                {job.location && (
                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Location
                    </span>

                    <span className="text-right font-bold">
                      {job.location}
                    </span>

                  </div>
                )}


                {job.state_code && (
                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      State
                    </span>

                    <span className="text-right font-bold">
                      {job.state_code}
                    </span>

                  </div>
                )}


                {job.sector && (
                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Sector
                    </span>

                    <span className="text-right font-bold">
                      {job.sector}
                    </span>

                  </div>
                )}


                {category && (
                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Category
                    </span>

                    <span className="text-right font-bold">
                      {category}
                    </span>

                  </div>
                )}


                {employmentType && (
                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Job Type
                    </span>

                    <span className="text-right font-bold">
                      {employmentType}
                    </span>

                  </div>
                )}


                {experienceText && (
                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Experience
                    </span>

                    <span className="text-right font-bold">
                      {experienceText}
                    </span>

                  </div>
                )}


                {job.work_mode && (
                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Work Mode
                    </span>

                    <span className="text-right font-bold">
                      {job.work_mode}
                    </span>

                  </div>
                )}


                {salaryText && (
                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Salary
                    </span>

                    <span className="text-right font-bold">
                      {salaryText}
                    </span>

                  </div>
                )}


                {job.vacancies !==
                  null && (
                  <div className="flex justify-between gap-4">

                    <span className="text-gray-500">
                      Vacancies
                    </span>

                    <span className="text-right font-bold">
                      {job.vacancies}
                    </span>

                  </div>
                )}

              </div>

            </div>


            {/* SOURCE BUTTON */}

            {job.source_url && (
              <a
                href={
                  job.source_url
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-100"
              >
                🔗 Open Original Source →
              </a>
            )}

          </aside>

        </div>

      </section>


      {/* ORIGINAL SOURCE */}

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20">

        <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-8 text-center md:p-12">

          <div className="text-4xl">
            🔗
          </div>

          <h2 className="mt-5 text-2xl font-black md:text-3xl">
            Apply through the original source.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600">
            MindraInfo helps you discover
            career opportunities. When an
            application link is available,
            you will be directed to the
            original employer or official
            recruitment website.
          </p>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-7 text-xs text-gray-500 sm:px-6 md:flex-row">

          <p>
            © 2026 MindraInfo. All rights reserved.
          </p>

          <Link
            href="/jobs"
            className="font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            ← Back to Jobs
          </Link>

        </div>

      </footer>

    </main>
  );
}
