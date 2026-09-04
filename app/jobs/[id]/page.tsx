import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase";

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
  published: boolean;
};

type JobPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDetailsPage({
  params,
}: JobPageProps) {
  const { id } = await params;

  const jobId = Number(id);

  if (!Number.isInteger(jobId)) {
    notFound();
  }

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("published", true)
    .single<Job>();

  if (error || !job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">

      {/* HEADER */}

      <SiteHeader />

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-gray-200 bg-white">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-teal-300/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">

          {/* BACK */}

          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            ← Back to Jobs
          </Link>

          {/* JOB HEADER */}

          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-start">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-50 text-3xl font-black text-emerald-600 shadow-sm">
              {job.company_initial}
            </div>

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3">

                <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700">
                  {job.posted}
                </span>

                <span className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-bold text-gray-600">
                  {job.category}
                </span>

              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                {job.title}
              </h1>

              <p className="mt-4 text-xl font-bold text-emerald-600">
                {job.company}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-gray-600">

                <span>
                  📍 {job.location}
                </span>

                <span>
                  💼 {job.type}
                </span>

                <span>
                  🎓 {job.experience}
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* MAIN CONTENT */}

      <section className="mx-auto max-w-6xl px-6 py-14">

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* DESCRIPTION */}

          <div className="rounded-[2rem] border border-gray-200 bg-white p-7 shadow-sm md:p-10">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
                Job Description
              </p>

              <h2 className="mt-3 text-3xl font-black">
                About this opportunity
              </h2>

            </div>

            <div className="mt-8 whitespace-pre-line text-base leading-8 text-gray-600">
              {job.description}
            </div>

            {/* SKILLS */}

            {job.skills && job.skills.length > 0 && (
              <div className="mt-10 border-t border-gray-100 pt-8">

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                  Skills & Requirements
                </p>

                <div className="mt-5 flex flex-wrap gap-2">

                  {job.skills.map((skill) => (

                    <span
                      key={skill}
                      className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              </div>
            )}

          </div>

          {/* APPLICATION CARD */}

          <aside className="h-fit lg:sticky lg:top-24">

            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-7 shadow-sm">

              <div className="text-3xl">
                🚀
              </div>

              <h2 className="mt-4 text-2xl font-black">
                Ready to apply?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Apply directly through the original employer or recruiter
                website.
              </p>

              {job.applyUrl ? (

                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
                >
                  View & Apply →
                </a>

              ) : (

                <div className="mt-7 rounded-xl bg-white px-5 py-4 text-center text-sm font-bold text-gray-500">
                  Application Link Coming Soon
                </div>

              )}

            </div>

            {/* JOB SUMMARY */}

            <div className="mt-5 rounded-[2rem] border border-gray-200 bg-white p-7 shadow-sm">

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                Job Summary
              </p>

              <div className="mt-5 space-y-4 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Company
                  </span>

                  <span className="text-right font-bold">
                    {job.company}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Location
                  </span>

                  <span className="text-right font-bold">
                    {job.location}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Job Type
                  </span>

                  <span className="text-right font-bold">
                    {job.type}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Experience
                  </span>

                  <span className="text-right font-bold">
                    {job.experience}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Category
                  </span>

                  <span className="text-right font-bold">
                    {job.category}
                  </span>
                </div>

              </div>

            </div>

          </aside>

        </div>

      </section>

      {/* ORIGINAL SOURCE */}

      <section className="mx-auto max-w-5xl px-6 pb-20">

        <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-8 text-center md:p-12">

          <div className="text-4xl">
            🔗
          </div>

          <h2 className="mt-5 text-2xl font-black md:text-3xl">
            Apply through the original source.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
            MindraInfo helps you discover career opportunities. When an
            application link is available, you will be directed to the
            original employer or recruiter website.
          </p>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">

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