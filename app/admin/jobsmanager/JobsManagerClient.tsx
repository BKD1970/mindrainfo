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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    window.location.replace("/admin/login?role=jobs");
  }

  async function loadJobs() {
    setLoading(true);

    const { data, error } = await supabaseBrowser
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading jobs:", error);
      setMessage(`Error loading jobs: ${error.message}`);
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

  function startEditing(job: Job) {
    setEditingId(job.id);

    setForm({
      company: job.company ?? "",
      title: job.title ?? "",
      location: job.location ?? "",
      type: job.type ?? "Full-time",
      experience: job.experience ?? "",
      posted: job.posted ?? "Featured",
      category: job.category ?? "Data Analytics",
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : "",
      description: job.description ?? "",
      company_initial: job.company_initial ?? "",
      applyUrl: job.applyUrl ?? "",
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  async function saveJob(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const skillsArray = form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const jobData = {
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
    };

    /*
     * EDIT EXISTING JOB
     */
    if (editingId !== null) {
      const { data, error } = await supabaseBrowser
        .from("jobs")
        .update(jobData)
        .eq("id", editingId)
        .select("id");

      console.log("JOB UPDATE RESULT:", {
        editingId,
        data,
        error,
      });

      if (error) {
        console.error("Error updating job:", error);
        setMessage(`Error updating job: ${error.message}`);
      } else if (!data || data.length === 0) {
        setMessage(
          "⚠️ Job was not updated. Check your Supabase RLS UPDATE policy."
        );
        console.error(
          "No job was updated. The UPDATE RLS policy may be blocking this operation."
        );
      } else {
        setMessage("Job updated successfully.");
        setEditingId(null);
        setForm(emptyForm);
        await loadJobs();
      }
    }

    /*
     * ADD NEW JOB
     */
    else {
      const { data, error } = await supabaseBrowser
        .from("jobs")
        .insert({
          ...jobData,
          published: false,
        })
        .select("id, published");

      console.log("JOB INSERT RESULT:", {
        data,
        error,
      });

      if (error) {
        console.error("Error adding job:", error);
        setMessage(`Error adding job: ${error.message}`);
      } else if (!data || data.length === 0) {
        setMessage(
          "⚠️ Job was not created. Check your Supabase RLS INSERT policy."
        );
      } else {
        setMessage("Job saved successfully as a draft.");
        setForm(emptyForm);
        await loadJobs();
      }
    }

    setSaving(false);
  }

  /*
   * PUBLISH / UNPUBLISH
   */
  async function togglePublished(job: Job) {
    const newStatus = !job.published;

    setMessage(
      newStatus
        ? `Publishing "${job.title}"...`
        : `Unpublishing "${job.title}"...`
    );

    const { data, error } = await supabaseBrowser
      .from("jobs")
      .update({
        published: newStatus,
      })
      .eq("id", job.id)
      .select("id, published");

    console.log("PUBLISH UPDATE RESULT:", {
      jobId: job.id,
      requestedStatus: newStatus,
      data,
      error,
    });

    /*
     * DATABASE ERROR
     */
    if (error) {
      console.error("Error changing publish status:", error);

      setMessage(
        `Error changing publish status: ${error.message}`
      );

      return;
    }

    /*
     * NO ROW UPDATED
     *
     * This is particularly important because an RLS policy
     * can prevent the row from being changed without giving
     * us the result we expect.
     */
    if (!data || data.length === 0) {
      setMessage(
        "⚠️ No row was changed. Check your Supabase RLS UPDATE policy."
      );

      console.error(
        "No job was updated. The Supabase UPDATE RLS policy may be blocking this operation."
      );

      return;
    }

    /*
     * VERIFY ACTUAL DATABASE VALUE
     */
    const updatedJob = data[0];

    if (updatedJob.published !== newStatus) {
      setMessage(
        "⚠️ Supabase returned an unexpected publish status."
      );

      console.error(
        "Unexpected published value:",
        updatedJob
      );

      return;
    }

    /*
     * SUCCESS
     */
    setMessage(
      newStatus
        ? `"${job.title}" is now published.`
        : `"${job.title}" has been unpublished.`
    );

    await loadJobs();
  }

  /*
   * DELETE JOB
   */
  async function deleteJob(job: Job) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${job.title}" at ${job.company}?\n\nThis cannot be undone.`
    );

    if (!confirmed) return;

    setMessage(`Deleting "${job.title}"...`);

    const { data, error } = await supabaseBrowser
      .from("jobs")
      .delete()
      .eq("id", job.id)
      .select("id");

    console.log("JOB DELETE RESULT:", {
      jobId: job.id,
      data,
      error,
    });

    /*
     * DATABASE ERROR
     */
    if (error) {
      console.error("Error deleting job:", error);

      setMessage(
        `Error deleting job: ${error.message}`
      );

      return;
    }

    /*
     * NO ROW DELETED
     */
    if (!data || data.length === 0) {
      setMessage(
        "⚠️ Job was not deleted. Check your Supabase RLS DELETE policy."
      );

      console.error(
        "No job was deleted. The Supabase DELETE RLS policy may be blocking this operation."
      );

      return;
    }

    /*
     * SUCCESS
     */
    if (editingId === job.id) {
      cancelEditing();
    }

    setMessage(`"${job.title}" was deleted.`);

    await loadJobs();
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
            {editingId !== null
              ? "Edit Job"
              : "Add a Job"}
          </h2>

          <p className="mt-3 text-gray-600">
            {editingId !== null
              ? "Modify the job details and save your changes."
              : "Add a new job to your Supabase database. New jobs are saved as drafts first."}
          </p>

        </div>

        {/* ADD / EDIT FORM */}

        <form
          onSubmit={saveJob}
          className="mt-10 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm"
        >

          {editingId !== null && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">

              <div>
                <p className="font-bold text-blue-800">
                  Editing existing job
                </p>

                <p className="mt-1 text-sm text-blue-700">
                  Changes will be saved to the existing job.
                </p>
              </div>

              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
              >
                Cancel
              </button>

            </div>
          )}

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
                : editingId !== null
                ? "💾 Save Changes"
                : "Save Job as Draft"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>
            )}

            {message && (
              <p className="text-sm font-semibold text-gray-600">
                {message}
              </p>
            )}

          </div>

        </form>

        {/* EXISTING JOBS */}

        <div className="mt-16">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>
              <h2 className="text-3xl font-black">
                Existing Jobs
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage, edit, publish, unpublish or delete your jobs.
              </p>
            </div>

            <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-sm">
              {jobs.length}{" "}
              {jobs.length === 1 ? "Job" : "Jobs"}
            </div>

          </div>

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

                  <div className="flex flex-col gap-5">

                    {/* JOB INFORMATION */}

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

                      <div className="text-sm text-gray-400">
                        ID: {job.id}
                      </div>

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-5">

                      {/* VIEW */}

                      <Link
                        href={`/jobs/${job.id}`}
                        target="_blank"
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
                      >
                        👁️ View
                      </Link>

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() => startEditing(job)}
                        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                      >
                        ✏️ Edit
                      </button>

                      {/* PUBLISH / UNPUBLISH */}

                      <button
                        type="button"
                        onClick={() => togglePublished(job)}
                        className={`rounded-xl px-4 py-2.5 text-sm font-bold text-white transition ${
                          job.published
                            ? "bg-amber-500 hover:bg-amber-600"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {job.published
                          ? "📢 Unpublish"
                          : "📢 Publish"}
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() => deleteJob(job)}
                        className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                      >
                        🗑️ Delete
                      </button>

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