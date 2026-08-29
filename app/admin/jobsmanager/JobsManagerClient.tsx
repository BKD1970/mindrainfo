"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

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

const emptyForm = {
  company: "",
  title: "",
  location: "",
  type: "Full-time",
  experience: "",
  posted: "Featured",
  category: "Data Analytics",
  skills: "",
  description: "",
  company_initial: "",
  applyUrl: "",
};

export default function JobsManagerPage() {
  async function handleSignOut() {
    /*
     * Sign out using the SAME Supabase SSR browser client
     * used by the admin login page.
     */
    await supabaseBrowser.auth.signOut();

    /*
     * Use a full browser navigation so the new logged-out
     * session is picked up by the server/proxy immediately.
     */
    window.location.replace("/admin/login?role=jobs");
  }

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState(emptyForm);

  async function loadJobs() {
    setLoading(true);

    const { data, error } = await supabaseBrowser
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading jobs:", error);
    } else {
      setJobs(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function updateForm(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function addJob(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const skillsArray = form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const { error } = await supabaseBrowser
      .from("jobs")
      .insert({
        company: form.company.trim(),
        title: form.title.trim(),
        location: form.location.trim(),
        type: form.type,
        experience: form.experience.trim(),
        posted: form.posted.trim(),
        category: form.category,
        skills: skillsArray,
        description: form.description.trim(),
        company_initial:
          form.company_initial.trim() ||
          form.company.trim().charAt(0).toUpperCase(),
        applyUrl: form.applyUrl.trim() || null,
        published: false,
      });

    if (error) {
      console.error("Error adding job:", error);
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage(
        "Job saved successfully as a draft."
      );

      setForm(emptyForm);

      await loadJobs();
    }

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">

      {/* HEADER */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              MindraInfo
            </p>

            <h1 className="mt-1 text-2xl font-black">
              Jobs Manager
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <Link
              href="/admin"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-gray-100"
            >
              ← Director Panel
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Sign Out
            </button>

          </div>

        </div>

      </header>

      {/* CONTENT */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="max-w-3xl">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
            Job Administration
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Add a Job
          </h2>

          <p className="mt-3 text-gray-600">
            Add a new job to your Supabase database.
            New jobs are saved as drafts first.
          </p>

        </div>

        {/* ADD JOB FORM */}

        <form
          onSubmit={addJob}
          className="mt-10 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm"
        >

          <div className="grid gap-5 md:grid-cols-2">

            <input
              required
              value={form.company}
              onChange={(e) =>
                updateForm("company", e.target.value)
              }
              placeholder="Company name"
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <input
              required
              value={form.title}
              onChange={(e) =>
                updateForm("title", e.target.value)
              }
              placeholder="Job title"
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <input
              required
              value={form.location}
              onChange={(e) =>
                updateForm("location", e.target.value)
              }
              placeholder="Location"
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <select
              value={form.type}
              onChange={(e) =>
                updateForm("type", e.target.value)
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>

            <input
              required
              value={form.experience}
              onChange={(e) =>
                updateForm("experience", e.target.value)
              }
              placeholder="Experience e.g. 0–2 years"
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <select
              value={form.category}
              onChange={(e) =>
                updateForm("category", e.target.value)
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option>Data Analytics</option>
              <option>Software</option>
              <option>AI</option>
              <option>IT</option>
            </select>

            <input
              value={form.posted}
              onChange={(e) =>
                updateForm("posted", e.target.value)
              }
              placeholder="Label e.g. Featured"
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <input
              value={form.company_initial}
              onChange={(e) =>
                updateForm(
                  "company_initial",
                  e.target.value
                )
              }
              placeholder="Company initial e.g. M"
              maxLength={1}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500"
            />

          </div>

          <input
            required
            value={form.skills}
            onChange={(e) =>
              updateForm("skills", e.target.value)
            }
            placeholder="Skills separated by commas: Excel, SQL, Power BI"
            className="mt-5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <textarea
            required
            value={form.description}
            onChange={(e) =>
              updateForm("description", e.target.value)
            }
            placeholder="Short job description"
            rows={5}
            className="mt-5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <input
            type="url"
            value={form.applyUrl}
            onChange={(e) =>
              updateForm("applyUrl", e.target.value)
            }
            placeholder="Original application URL"
            className="mt-5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <div className="mt-6 flex flex-wrap items-center gap-4">

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving
                ? "Saving..."
                : "Save Job as Draft"}
            </button>

            {message && (
              <p className="text-sm font-semibold text-gray-600">
                {message}
              </p>
            )}

          </div>

        </form>

        {/* EXISTING JOBS */}

        <div className="mt-16">

          <h2 className="text-3xl font-black">
            Existing Jobs
          </h2>

          {loading ? (

            <p className="mt-6 text-gray-500">
              Loading jobs...
            </p>

          ) : jobs.length > 0 ? (

            <div className="mt-6 space-y-4">

              {jobs.map((job) => (

                <div
                  key={job.id}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                >

                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="text-xl font-black">
                          {job.title}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            job.published
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {job.published
                            ? "Published"
                            : "Draft"}
                        </span>

                      </div>

                      <p className="mt-2 font-semibold text-emerald-600">
                        {job.company}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        {job.location} • {job.type} •{" "}
                        {job.experience}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <p className="mt-6 text-gray-500">
              No jobs found.
            </p>

          )}

        </div>

      </section>

    </main>
  );
}
