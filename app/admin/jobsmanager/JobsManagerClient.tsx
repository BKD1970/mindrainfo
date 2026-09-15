"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

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

  approved_by: string | null;
  approved_at: string | null;
  published_at: string | null;
  verified_at: string | null;
  expires_at: string | null;
};

type JobSource = {
  id: number;
  job_id: number;
  source_name: string;
  source_url: string;
  source_type: string | null;
  is_primary: boolean;
};

type ManagerFilter =
  | "all"
  | "needs_approval"
  | "published"
  | "expired_archived";

type JobForm = {
  company: string;
  title: string;
  location: string;

  sector: string;
  job_category: string;
  sub_category: string;

  government_level: string;
  state: string;
  state_code: string;

  organization: string;
  department: string;
  ministry: string;

  type: string;
  employment_type: string;
  work_mode: string;

  experience_min: string;
  experience_max: string;

  education: string;

  salary_min: string;
  salary_max: string;
  salary_currency: string;

  vacancies: string;

  age_limit: string;
  age_relaxation: string;

  application_start: string;
  application_deadline: string;
  exam_date: string;

  notification_type: string;

  skills: string;
  description: string;

  company_initial: string;

  source_name: string;
  source_url: string;

  apply_url: string;

  provider_logo_url: string;

  is_government: boolean;

  posted: string;

  additional_sources: string;
};

const emptyForm: JobForm = {
  company: "",
  title: "",
  location: "",

  sector: "Private",
  job_category: "Other",
  sub_category: "",

  government_level: "",
  state: "",
  state_code: "",

  organization: "",
  department: "",
  ministry: "",

  type: "Full-time",
  employment_type: "Full-time",
  work_mode: "On-site",

  experience_min: "",
  experience_max: "",

  education: "",

  salary_min: "",
  salary_max: "",
  salary_currency: "INR",

  vacancies: "",

  age_limit: "",
  age_relaxation: "",

  application_start: "",
  application_deadline: "",
  exam_date: "",

  notification_type: "",

  skills: "",
  description: "",

  company_initial: "",

  source_name: "",
  source_url: "",

  apply_url: "",

  provider_logo_url: "",

  is_government: false,

  posted: "New",

  additional_sources: "",
};

const stateOptions = [
  ["", "Select State"],
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

const privateCategories = [
  "Other",
  "Data Analyst",
  "Data Scientist",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "AI Engineer",
  "Machine Learning Engineer",
  "Cybersecurity",
  "Cloud / DevOps",
  "UI/UX Designer",
  "Video Editor",
  "Graphic Designer",
  "Digital Marketing",
  "Sales",
  "Marketing",
  "Finance",
  "Human Resources",
  "Operations",
  "Customer Support",
  "Content Writer",
  "Legal",
  "Administration",
];

const governmentCategories = [
  "Government Recruitment",
  "Civil Services",
  "SSC",
  "UPSC",
  "Banking",
  "Railway",
  "Defence",
  "Police",
  "Teaching",
  "Healthcare",
  "Engineering",
  "Research",
  "PSU",
  "State Government",
  "Other Government",
];

function formatDateForInput(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() - offset * 60 * 1000
  );

  return localDate.toISOString().slice(0, 16);
}

function convertInputDateToIso(value: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function isDeadlinePassed(job: Job) {
  if (!job.application_deadline) {
    return false;
  }

  const deadline = new Date(
    job.application_deadline
  );

  if (Number.isNaN(deadline.getTime())) {
    return false;
  }

  return deadline.getTime() < Date.now();
}

function getEffectiveStatus(job: Job) {
  if (
    job.status === "expired" ||
    job.status === "archived" ||
    isDeadlinePassed(job)
  ) {
    return "expired_archived";
  }

  if (
    job.published === true ||
    job.status === "published"
  ) {
    return "published";
  }

  return "needs_approval";
}

function statusLabel(
  status: ManagerFilter
) {
  if (status === "all") {
    return "All Jobs";
  }

  if (status === "published") {
    return "Published";
  }

  if (status === "expired_archived") {
    return "Expired / Archived";
  }

  return "Needs Approval";
}

function statusClasses(
  status: string
) {
  if (status === "published") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (status === "expired_archived") {
    return "bg-orange-50 text-orange-700 border-orange-200";
  }

  return "bg-blue-50 text-blue-700 border-blue-200";
}

function scrollToJobsSection() {
  document
    .getElementById("jobs-list-section")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
}

export default function JobsManagerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const [jobSources, setJobSources] = useState<
    Record<string, JobSource[]>
  >({});

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [form, setForm] =
    useState<JobForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [managerFilter, setManagerFilter] =
    useState<ManagerFilter>("all");

  const [addJobOpen, setAddJobOpen] =
    useState(false);

  const [discoveryEnabled, setDiscoveryEnabled] =
    useState<boolean | null>(null);

  const [discoveryControlLoading, setDiscoveryControlLoading] =
    useState(false);

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();

    window.location.replace(
      "/admin/login?role=jobs"
    );
  }

  async function loadDiscoverySetting() {
    const { data, error } = await supabaseBrowser
      .from("job_discovery_settings")
      .select("id, enabled")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error(
        "Error loading discovery setting:",
        error
      );
      setDiscoveryEnabled(null);
      return;
    }

    setDiscoveryEnabled(
      typeof data?.enabled === "boolean"
        ? data.enabled
        : null
    );
  }

  async function toggleDiscovery() {
    if (discoveryEnabled === null || discoveryControlLoading) {
      return;
    }

    setDiscoveryControlLoading(true);

    try {
      const newEnabled = !discoveryEnabled;

      const {
        data: userData,
      } = await supabaseBrowser.auth.getUser();

      const { error } = await supabaseBrowser
        .from("job_discovery_settings")
        .update({
          enabled: newEnabled,
          updated_at: new Date().toISOString(),
          updated_by: userData.user?.id ?? null,
        })
        .eq("id", 1);

      if (error) {
        throw error;
      }

      setDiscoveryEnabled(newEnabled);

      setMessage(
        newEnabled
          ? "Job discovery started. Scheduled discovery can now check the active permitted sources."
          : "Job discovery stopped. Scheduled discovery will not collect new jobs."
      );
    } catch (error) {
      console.error(
        "Error updating discovery setting:",
        error
      );

      setMessage(
        error instanceof Error
          ? `Discovery control failed: ${error.message}`
          : "Discovery control failed."
      );
    } finally {
      setDiscoveryControlLoading(false);
    }
  }

  async function loadJobs() {
    setLoading(true);

    const { data, error } =
      await supabaseBrowser
        .from("jobs")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Error loading jobs:",
        error
      );

      setMessage(
        `Error loading jobs: ${error.message}`
      );

      setLoading(false);

      return;
    }

    const loadedJobs =
      (data ?? []) as Job[];

    setJobs(loadedJobs);

    if (loadedJobs.length > 0) {
      const ids = loadedJobs.map(
        (job) => job.id
      );

      const {
        data: sources,
        error: sourceError,
      } = await supabaseBrowser
        .from("job_sources")
        .select("*")
        .in("job_id", ids)
        .order("created_at", {
          ascending: true,
        });

      if (sourceError) {
        console.error(
          "Error loading job sources:",
          sourceError
        );
      } else {
        const sourceMap: Record<
          string,
          JobSource[]
        > = {};

        for (const source of (sources ??
          []) as JobSource[]) {
          const key = String(
            source.job_id
          );

          if (!sourceMap[key]) {
            sourceMap[key] = [];
          }

          sourceMap[key].push(source);
        }

        setJobSources(sourceMap);
      }
    } else {
      setJobSources({});
    }

    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
    loadDiscoverySetting();
  }, []);

  function chooseManagerFilter(
    filter: ManagerFilter
  ) {
    setManagerFilter(filter);

    setTimeout(() => {
      scrollToJobsSection();
    }, 50);
  }

  function updateForm<K extends keyof JobForm>(
    field: K,
    value: JobForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEditing(job: Job) {
    setEditingId(job.id);

    setAddJobOpen(true);

    const canonicalApplyUrl =
      job.apply_url ??
      job.applyUrl ??
      "";

    const sources =
      jobSources[String(job.id)] ?? [];

    const additionalSources =
      sources
        .filter(
          (source) =>
            !source.is_primary
        )
        .map(
          (source) =>
            `${source.source_name} | ${source.source_url}`
        )
        .join("\n");

    setForm({
      company: job.company ?? "",
      title: job.title ?? "",
      location: job.location ?? "",

      sector: job.sector ?? "Private",

      job_category:
        job.job_category ??
        job.category ??
        "Other",

      sub_category:
        job.sub_category ?? "",

      government_level:
        job.government_level ?? "",

      state: job.state ?? "",

      state_code:
        job.state_code ?? "",

      organization:
        job.organization ?? "",

      department:
        job.department ?? "",

      ministry:
        job.ministry ?? "",

      type:
        job.type ?? "Full-time",

      employment_type:
        job.employment_type ??
        job.type ??
        "Full-time",

      work_mode:
        job.work_mode ?? "On-site",

      experience_min:
        job.experience_min !== null &&
        job.experience_min !== undefined
          ? String(
              job.experience_min
            )
          : "",

      experience_max:
        job.experience_max !== null &&
        job.experience_max !== undefined
          ? String(
              job.experience_max
            )
          : "",

      education:
        job.education ?? "",

      salary_min:
        job.salary_min !== null &&
        job.salary_min !== undefined
          ? String(job.salary_min)
          : "",

      salary_max:
        job.salary_max !== null &&
        job.salary_max !== undefined
          ? String(job.salary_max)
          : "",

      salary_currency:
        job.salary_currency ?? "INR",

      vacancies:
        job.vacancies !== null &&
        job.vacancies !== undefined
          ? String(job.vacancies)
          : "",

      age_limit:
        job.age_limit ?? "",

      age_relaxation:
        job.age_relaxation ?? "",

      application_start:
        formatDateForInput(
          job.application_start
        ),

      application_deadline:
        formatDateForInput(
          job.application_deadline
        ),

      exam_date:
        formatDateForInput(
          job.exam_date
        ),

      notification_type:
        job.notification_type ?? "",

      skills:
        Array.isArray(job.skills)
          ? job.skills.join(", ")
          : "",

      description:
        job.description ?? "",

      company_initial:
        job.company_initial ??
        job.company
          ?.charAt(0)
          .toUpperCase() ??
        "",

      source_name:
        job.source_name ?? "",

      source_url:
        job.source_url ?? "",

      apply_url:
        canonicalApplyUrl,

      provider_logo_url:
        job.provider_logo_url ?? "",

      is_government:
        job.is_government ?? false,

      posted:
        job.posted ?? "New",

      additional_sources:
        additionalSources,
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

    setAddJobOpen(false);

    setMessage("");
  }

  function parseOptionalInteger(
    value: string
  ) {
    const cleaned = value.trim();

    if (!cleaned) {
      return null;
    }

    const parsed = Number(cleaned);

    return Number.isInteger(parsed)
      ? parsed
      : null;
  }

  function parseOptionalNumber(
    value: string
  ) {
    const cleaned = value.trim();

    if (!cleaned) {
      return null;
    }

    const parsed = Number(cleaned);

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  async function saveSources(
    jobId: number,
    primarySourceName: string,
    primarySourceUrl: string
  ) {
    const {
      error: deleteError,
    } = await supabaseBrowser
      .from("job_sources")
      .delete()
      .eq("job_id", jobId);

    if (deleteError) {
      throw new Error(
        `Could not update job sources: ${deleteError.message}`
      );
    }

    const sourcesToInsert: Array<{
      job_id: number;
      source_name: string;
      source_url: string;
      source_type: string;
      is_primary: boolean;
    }> = [];

    if (
      primarySourceName.trim() &&
      primarySourceUrl.trim()
    ) {
      sourcesToInsert.push({
        job_id: jobId,
        source_name:
          primarySourceName.trim(),
        source_url:
          primarySourceUrl.trim(),
        source_type:
          form.is_government
            ? "government"
            : "private",
        is_primary: true,
      });
    }

    const lines = form.additional_sources
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      const separatorIndex =
        line.indexOf("|");

      if (separatorIndex === -1) {
        continue;
      }

      const sourceName = line
        .slice(
          0,
          separatorIndex
        )
        .trim();

      const sourceUrl = line
        .slice(
          separatorIndex + 1
        )
        .trim();

      if (
        !sourceName ||
        !sourceUrl
      ) {
        continue;
      }

      sourcesToInsert.push({
        job_id: jobId,
        source_name: sourceName,
        source_url: sourceUrl,
        source_type:
          "additional",
        is_primary: false,
      });
    }

    if (
      sourcesToInsert.length > 0
    ) {
      const {
        error: insertError,
      } = await supabaseBrowser
        .from("job_sources")
        .insert(
          sourcesToInsert
        );

      if (insertError) {
        throw new Error(
          `Could not save job sources: ${insertError.message}`
        );
      }
    }
  }

  async function saveJob(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const company =
        form.company.trim();

      const skillsArray =
        form.skills
          .split(",")
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean);

      const jobData = {
        company,

        title:
          form.title.trim(),

        location:
          form.location.trim(),

        type:
          form.employment_type ||
          form.type,

        experience:
          form.experience_min ||
          form.experience_max
            ? `${form.experience_min || "0"}–${
                form.experience_max || "+"
              } years`
            : "",

        posted:
          form.posted.trim() ||
          "New",

        category:
          form.job_category,

        skills:
          skillsArray,

        description:
          form.description.trim(),

        company_initial:
          form.company_initial.trim() ||
          company
            .charAt(0)
            .toUpperCase(),

        applyUrl:
          form.apply_url.trim() ||
          null,

        apply_url:
          form.apply_url.trim() ||
          null,

        sector:
          form.sector,

        job_category:
          form.job_category,

        sub_category:
          form.sub_category.trim() ||
          null,

        government_level:
          form.government_level.trim() ||
          null,

        state:
          form.state.trim() ||
          null,

        state_code:
          form.state_code.trim() ||
          null,

        organization:
          form.organization.trim() ||
          null,

        department:
          form.department.trim() ||
          null,

        ministry:
          form.ministry.trim() ||
          null,

        work_mode:
          form.work_mode ||
          null,

        employment_type:
          form.employment_type ||
          null,

        experience_min:
          parseOptionalInteger(
            form.experience_min
          ),

        experience_max:
          parseOptionalInteger(
            form.experience_max
          ),

        education:
          form.education.trim() ||
          null,

        salary_min:
          parseOptionalNumber(
            form.salary_min
          ),

        salary_max:
          parseOptionalNumber(
            form.salary_max
          ),

        salary_currency:
          form.salary_currency ||
          "INR",

        vacancies:
          parseOptionalInteger(
            form.vacancies
          ),

        age_limit:
          form.age_limit.trim() ||
          null,

        age_relaxation:
          form.age_relaxation.trim() ||
          null,

        application_start:
          convertInputDateToIso(
            form.application_start
          ),

        application_deadline:
          convertInputDateToIso(
            form.application_deadline
          ),

        exam_date:
          convertInputDateToIso(
            form.exam_date
          ),

        notification_type:
          form.notification_type.trim() ||
          null,

        source_name:
          form.source_name.trim() ||
          null,

        source_url:
          form.source_url.trim() ||
          null,

        provider_logo_url:
          form.provider_logo_url.trim() ||
          null,

        is_government:
          form.is_government,

        expires_at:
          convertInputDateToIso(
            form.application_deadline
          ),
      };

      /*
       * EDIT
       */
      if (editingId !== null) {
        const {
          data,
          error,
        } = await supabaseBrowser
          .from("jobs")
          .update(jobData)
          .eq("id", editingId)
          .select("id");

        if (error) {
          throw new Error(
            `Error updating job: ${error.message}`
          );
        }

        if (
          !data ||
          data.length === 0
        ) {
          throw new Error(
            "Job was not updated. Your Jobs Manager permission may not be active."
          );
        }

        await saveSources(
          editingId,
          form.source_name,
          form.source_url
        );

        setMessage(
          "Job updated successfully."
        );

        setEditingId(null);

        setForm(emptyForm);

        setAddJobOpen(false);

        await loadJobs();

        return;
      }

      /*
       * ADD
       */
      const {
        data,
        error,
      } = await supabaseBrowser
        .from("jobs")
        .insert({
          ...jobData,

          published: false,

          status:
            "needs_approval",

          approved_by: null,
          approved_at: null,
          published_at: null,
          verified_at: null,
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(
          `Error adding job: ${error.message}`
        );
      }

      if (!data?.id) {
        throw new Error(
          "The job was not created."
        );
      }

      await saveSources(
        data.id,
        form.source_name,
        form.source_url
      );

      setMessage(
        "Job saved to Needs Approval."
      );

      setForm(emptyForm);

      setAddJobOpen(false);

      await loadJobs();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred."
      );
    } finally {
      setSaving(false);
    }
  }

  async function verifyJob(job: Job) {
    setMessage(
      `Verifying "${job.title ?? "job"}"...`
    );

    const {
      data,
      error,
    } = await supabaseBrowser
      .from("jobs")
      .update({
        verified_at:
          new Date().toISOString(),

        status:
          "needs_approval",

        published: false,

        published_at: null,
      })
      .eq("id", job.id)
      .select(
        "id, status, published"
      );

    if (error) {
      setMessage(
        `Verification failed: ${error.message}`
      );

      return;
    }

    if (!data || data.length === 0) {
      setMessage(
        "The job was not updated."
      );

      return;
    }

    setMessage(
      `"${job.title}" is verified and ready for approval.`
    );

    await loadJobs();
  }

  async function approveAndPublish(
    job: Job
  ) {
    const confirmed =
      window.confirm(
        `Approve and publish "${job.title}" by ${job.company}?\n\nThis will make the job immediately visible on the public Jobs page.`
      );

    if (!confirmed) {
      return;
    }

    setMessage(
      `Publishing "${job.title}"...`
    );

    const {
      data: userData,
    } =
      await supabaseBrowser.auth.getUser();

    const {
      data,
      error,
    } = await supabaseBrowser
      .from("jobs")
      .update({
        published: true,

        status:
          "published",

        approved_by:
          userData.user?.id ??
          null,

        approved_at:
          new Date().toISOString(),

        published_at:
          new Date().toISOString(),
      })
      .eq("id", job.id)
      .select(
        "id, published, status"
      );

    if (error) {
      setMessage(
        `Publishing failed: ${error.message}`
      );

      return;
    }

    if (!data || data.length === 0) {
      setMessage(
        "The job was not published."
      );

      return;
    }

    setMessage(
      `"${job.title}" is now published.`
    );

    await loadJobs();
  }

  async function unpublishJob(
    job: Job
  ) {
    const confirmed =
      window.confirm(
        `Unpublish "${job.title}"?\n\nIt will disappear from the public Jobs page.`
      );

    if (!confirmed) {
      return;
    }

    setMessage(
      `Unpublishing "${job.title}"...`
    );

    const {
      data,
      error,
    } = await supabaseBrowser
      .from("jobs")
      .update({
        published: false,

        status:
          "needs_approval",

        published_at: null,
      })
      .eq("id", job.id)
      .select(
        "id, published, status"
      );

    if (error) {
      setMessage(
        `Unpublish failed: ${error.message}`
      );

      return;
    }

    if (!data || data.length === 0) {
      setMessage(
        "The job was not unpublished."
      );

      return;
    }

    setMessage(
      `"${job.title}" returned to Needs Approval.`
    );

    await loadJobs();
  }

  async function archiveJob(
    job: Job
  ) {
    const confirmed =
      window.confirm(
        `Archive "${job.title}"?\n\nIt will be hidden from the public Jobs page.`
      );

    if (!confirmed) {
      return;
    }

    setMessage(
      `Archiving "${job.title}"...`
    );

    const {
      data,
      error,
    } = await supabaseBrowser
      .from("jobs")
      .update({
        published: false,
        status: "archived",
      })
      .eq("id", job.id)
      .select(
        "id, published, status"
      );

    if (error) {
      setMessage(
        `Archive failed: ${error.message}`
      );

      return;
    }

    if (!data || data.length === 0) {
      setMessage(
        "The job was not archived."
      );

      return;
    }

    setMessage(
      `"${job.title}" moved to Expired / Archived.`
    );

    await loadJobs();
  }

  async function restoreJob(
    job: Job
  ) {
    const confirmed =
      window.confirm(
        `Restore "${job.title}"?\n\nIt will return to Needs Approval and require approval again.`
      );

    if (!confirmed) {
      return;
    }

    setMessage(
      `Restoring "${job.title}"...`
    );

    const {
      data,
      error,
    } = await supabaseBrowser
      .from("jobs")
      .update({
        published: false,

        status:
          "needs_approval",

        approved_by: null,
        approved_at: null,
        published_at: null,
      })
      .eq("id", job.id)
      .select(
        "id, published, status"
      );

    if (error) {
      setMessage(
        `Restore failed: ${error.message}`
      );

      return;
    }

    if (!data || data.length === 0) {
      setMessage(
        "The job was not restored."
      );

      return;
    }

    setMessage(
      `"${job.title}" restored to Needs Approval.`
    );

    await loadJobs();
  }

  async function deleteJob(
    job: Job
  ) {
    const confirmed =
      window.confirm(
        `Permanently delete "${job.title}" at ${job.company}?\n\nThis cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setMessage(
      `Deleting "${job.title}"...`
    );

    try {
      /*
       * Discovery candidates can retain a reference to the job they created.
       * Clear that reference first so PostgreSQL's foreign-key constraint
       * does not block permanent deletion of the job.
       *
       * The candidate record itself is intentionally preserved as processing
       * history; only its created_job_id link is cleared.
       */
      const { error: candidateLinkError } =
        await supabaseBrowser
          .from("job_discovery_candidates")
          .update({
            created_job_id: null,
          })
          .eq("created_job_id", job.id);

      if (candidateLinkError) {
        throw new Error(
          `Could not release discovery candidate references: ${candidateLinkError.message}`
        );
      }

      const {
        data,
        error,
      } = await supabaseBrowser
        .from("jobs")
        .delete()
        .eq("id", job.id)
        .select("id");

      if (error) {
        throw new Error(
          `Delete failed: ${error.message}`
        );
      }

      if (!data || data.length === 0) {
        throw new Error(
          "The job was not deleted."
        );
      }

      if (editingId === job.id) {
        cancelEditing();
      }

      setMessage(
        `"${job.title}" was permanently deleted.`
      );

      await loadJobs();
    } catch (error) {
      console.error(
        "Error deleting job:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not delete the job."
      );
    }
  }

  const counts = useMemo(() => {
    const result = {
      all: jobs.length,
      needs_approval: 0,
      published: 0,
      expired_archived: 0,
    };

    for (const job of jobs) {
      const status =
        getEffectiveStatus(job);

      if (
        status ===
        "needs_approval"
      ) {
        result.needs_approval++;
      }

      if (
        status ===
        "published"
      ) {
        result.published++;
      }

      if (
        status ===
        "expired_archived"
      ) {
        result.expired_archived++;
      }
    }

    return result;
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (
      managerFilter === "all"
    ) {
      return jobs;
    }

    return jobs.filter(
      (job) =>
        getEffectiveStatus(
          job
        ) === managerFilter
    );
  }, [
    jobs,
    managerFilter,
  ]);

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-gray-900">

      {/* HEADER */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-5">

          <div className="min-w-0">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
              MindraInfo
            </p>

            <h1 className="mt-0.5 text-lg font-black sm:text-xl">
              Jobs Manager
            </h1>

          </div>

          <div className="flex shrink-0 items-center gap-1.5">

            <Link
              href="/jobs"
              target="_blank"
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[11px] font-bold text-gray-700 transition hover:bg-gray-100 sm:px-3 sm:text-xs"
            >
              🌐 Jobs
            </Link>

            <Link
              href="/admin"
              className="hidden rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100 sm:block"
            >
              ← Director
            </Link>

            <button
              type="button"
              onClick={
                handleSignOut
              }
              className="rounded-lg bg-red-600 px-2.5 py-2 text-[11px] font-bold text-white transition hover:bg-red-700 sm:px-3 sm:text-xs"
            >
              Sign Out
            </button>

          </div>

        </div>

      </header>


      {/* PAGE CONTENT */}

      <section className="mx-auto max-w-7xl px-3 py-5 sm:px-5 sm:py-8">

        <div className="mb-5">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
            Job Administration
          </p>

          <h2 className="mt-1.5 text-2xl font-black sm:text-3xl">
            Manage Jobs
          </h2>

          <p className="mt-1.5 max-w-3xl text-xs leading-6 text-gray-500 sm:text-sm">
            Discover, verify, approve, publish,
            archive and manage all job postings
            from Jobs Manager.
          </p>

        </div>


        {/* DISCOVERY CONTROL */}

        <section className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                  Automated Job Discovery
                </p>

                {discoveryEnabled === true && (
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
                    ● Running
                  </span>
                )}

                {discoveryEnabled === false && (
                  <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-bold text-red-700">
                    ● Stopped
                  </span>
                )}

                {discoveryEnabled === null && (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold text-gray-500">
                    Checking...
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                Controls whether the scheduled discovery process may check the active permitted job sources.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleDiscovery}
              disabled={
                discoveryEnabled === null ||
                discoveryControlLoading
              }
              className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                discoveryEnabled
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {discoveryControlLoading
                ? "Updating..."
                : discoveryEnabled
                  ? "⏹ Stop Discovery"
                  : "▶ Start Discovery"}
            </button>
          </div>
        </section>

        {/* STATUS CARDS */}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">

          {/* ALL */}

          <button
            type="button"
            onClick={() =>
              chooseManagerFilter(
                "all"
              )
            }
            className={`group rounded-2xl border bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4 ${
              managerFilter === "all"
                ? "border-gray-900 ring-1 ring-gray-900/10"
                : "border-gray-200"
            }`}
          >

            <div className="flex items-start justify-between gap-2">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 sm:text-[10px]">
                  All Jobs
                </p>

                <p className="mt-1 text-2xl font-black sm:text-3xl">
                  {counts.all}
                </p>
              </div>

              <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-black transition group-hover:bg-gray-900 group-hover:text-white">
                →
              </span>

            </div>

          </button>


          {/* NEEDS APPROVAL */}

          <button
            type="button"
            onClick={() =>
              chooseManagerFilter(
                "needs_approval"
              )
            }
            className={`group rounded-2xl border bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4 ${
              managerFilter ===
              "needs_approval"
                ? "border-blue-500 ring-1 ring-blue-500/10"
                : "border-gray-200"
            }`}
          >

            <div className="flex items-start justify-between gap-2">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-500 sm:text-[10px]">
                  Needs Approval
                </p>

                <p className="mt-1 text-2xl font-black sm:text-3xl">
                  {counts.needs_approval}
                </p>
              </div>

              <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                →
              </span>

            </div>

          </button>


          {/* PUBLISHED */}

          <button
            type="button"
            onClick={() =>
              chooseManagerFilter(
                "published"
              )
            }
            className={`group rounded-2xl border bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4 ${
              managerFilter ===
              "published"
                ? "border-emerald-500 ring-1 ring-emerald-500/10"
                : "border-gray-200"
            }`}
          >

            <div className="flex items-start justify-between gap-2">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-600 sm:text-[10px]">
                  Published
                </p>

                <p className="mt-1 text-2xl font-black sm:text-3xl">
                  {counts.published}
                </p>
              </div>

              <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-sm font-black text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                →
              </span>

            </div>

          </button>


          {/* EXPIRED */}

          <button
            type="button"
            onClick={() =>
              chooseManagerFilter(
                "expired_archived"
              )
            }
            className={`group rounded-2xl border bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4 ${
              managerFilter ===
              "expired_archived"
                ? "border-orange-500 ring-1 ring-orange-500/10"
                : "border-gray-200"
            }`}
          >

            <div className="flex items-start justify-between gap-2">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-orange-600 sm:text-[10px]">
                  Expired / Archived
                </p>

                <p className="mt-1 text-2xl font-black sm:text-3xl">
                  {counts.expired_archived}
                </p>
              </div>

              <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-orange-50 text-sm font-black text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                →
              </span>

            </div>

          </button>

        </div>


        {/* ADD JOB BUTTON */}

        <div className="mt-4">

          <button
            type="button"
            onClick={() =>
              setAddJobOpen(
                (current) =>
                  !current
              )
            }
            className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-left text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
          >

            <div className="flex items-center justify-between">

              <span>
                {addJobOpen
                  ? "✕ Close Add Job"
                  : "＋ Add a Job Manually"}
              </span>

              <span className="text-lg">
                {addJobOpen
                  ? "↑"
                  : "↓"}
              </span>

            </div>

          </button>

        </div>


        {/* ADD / EDIT FORM */}

        {addJobOpen && (
          <form
            onSubmit={saveJob}
            className="mt-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
          >

            <div className="mb-5 flex items-center justify-between gap-3">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                  {editingId !== null
                    ? "Editing Job"
                    : "Manual Job Entry"}
                </p>

                <h3 className="mt-1 text-lg font-black">
                  {editingId !== null
                    ? "Edit Job"
                    : "Add Job"}
                </h3>

              </div>

              {editingId !==
                null && (
                <button
                  type="button"
                  onClick={
                    cancelEditing
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}

            </div>


            {/* BASIC */}

            <div className="grid gap-3 sm:grid-cols-2">

              <input
                required
                value={form.company}
                onChange={(e) =>
                  updateForm(
                    "company",
                    e.target.value
                  )
                }
                placeholder="Company / Organization"
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />

              <input
                required
                value={form.title}
                onChange={(e) =>
                  updateForm(
                    "title",
                    e.target.value
                  )
                }
                placeholder="Job title / Post name"
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />

              <input
                required
                value={form.location}
                onChange={(e) =>
                  updateForm(
                    "location",
                    e.target.value
                  )
                }
                placeholder="Job location"
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />

              <input
                value={form.organization}
                onChange={(e) =>
                  updateForm(
                    "organization",
                    e.target.value
                  )
                }
                placeholder="Organization / Recruiting body"
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />

            </div>


            {/* CLASSIFICATION */}

            <div className="mt-5">

              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Classification
              </p>

              <div className="grid gap-3 sm:grid-cols-3">

                <select
                  value={form.sector}
                  onChange={(e) =>
                    updateForm(
                      "sector",
                      e.target.value
                    )
                  }
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                >
                  <option>
                    Private
                  </option>
                  <option>
                    Government
                  </option>
                  <option>
                    PSU
                  </option>
                  <option>
                    Banking
                  </option>
                  <option>
                    Railway
                  </option>
                  <option>
                    Defence
                  </option>
                  <option>
                    Education
                  </option>
                  <option>
                    Healthcare
                  </option>
                  <option>
                    Research
                  </option>
                  <option>
                    Other
                  </option>
                </select>


                <select
                  value={
                    form.job_category
                  }
                  onChange={(e) =>
                    updateForm(
                      "job_category",
                      e.target.value
                    )
                  }
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                >
                  {(form.is_government
                    ? governmentCategories
                    : privateCategories
                  ).map(
                    (category) => (
                      <option
                        key={
                          category
                        }
                        value={
                          category
                        }
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>


                <input
                  value={
                    form.sub_category
                  }
                  onChange={(e) =>
                    updateForm(
                      "sub_category",
                      e.target.value
                    )
                  }
                  placeholder="Sub-category"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />

              </div>


              <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">

                <input
                  type="checkbox"
                  checked={
                    form.is_government
                  }
                  onChange={(e) =>
                    updateForm(
                      "is_government",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4"
                />

                <span className="text-sm font-semibold">
                  Government job / notification
                </span>

              </label>

            </div>


            {/* GOVERNMENT */}

            <div className="mt-5">

              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Government Information
              </p>

              <div className="grid gap-3 sm:grid-cols-3">

                <select
                  value={
                    form.government_level
                  }
                  onChange={(e) =>
                    updateForm(
                      "government_level",
                      e.target.value
                    )
                  }
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                >
                  <option value="">
                    Government level
                  </option>
                  <option>
                    Central
                  </option>
                  <option>
                    State
                  </option>
                  <option>
                    Union Territory
                  </option>
                </select>


                <select
                  value={
                    form.state_code
                  }
                  onChange={(e) => {
                    const code =
                      e.target.value;

                    const match =
                      stateOptions.find(
                        ([stateCode]) =>
                          stateCode ===
                          code
                      );

                    updateForm(
                      "state_code",
                      code
                    );

                    updateForm(
                      "state",
                      match
                        ? match[1].replace(
                            /\s*\([A-Z]{2}\)$/,
                            ""
                          )
                        : ""
                    );
                  }}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
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


                <input
                  value={
                    form.department
                  }
                  onChange={(e) =>
                    updateForm(
                      "department",
                      e.target.value
                    )
                  }
                  placeholder="Department"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />


                <input
                  value={
                    form.ministry
                  }
                  onChange={(e) =>
                    updateForm(
                      "ministry",
                      e.target.value
                    )
                  }
                  placeholder="Ministry"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />


                <input
                  value={
                    form.notification_type
                  }
                  onChange={(e) =>
                    updateForm(
                      "notification_type",
                      e.target.value
                    )
                  }
                  placeholder="Notification type"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 sm:col-span-2"
                />

              </div>

            </div>


            {/* EMPLOYMENT */}

            <div className="mt-5">

              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Employment Details
              </p>

              <div className="grid gap-3 sm:grid-cols-3">

                <select
                  value={
                    form.employment_type
                  }
                  onChange={(e) =>
                    updateForm(
                      "employment_type",
                      e.target.value
                    )
                  }
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                >
                  <option>
                    Full-time
                  </option>
                  <option>
                    Part-time
                  </option>
                  <option>
                    Internship
                  </option>
                  <option>
                    Contract
                  </option>
                  <option>
                    Apprenticeship
                  </option>
                  <option>
                    Temporary
                  </option>
                  <option>
                    Freelance
                  </option>
                </select>


                <select
                  value={
                    form.work_mode
                  }
                  onChange={(e) =>
                    updateForm(
                      "work_mode",
                      e.target.value
                    )
                  }
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                >
                  <option>
                    On-site
                  </option>
                  <option>
                    Hybrid
                  </option>
                  <option>
                    Remote
                  </option>
                </select>


                <input
                  type="number"
                  min="0"
                  value={
                    form.experience_min
                  }
                  onChange={(e) =>
                    updateForm(
                      "experience_min",
                      e.target.value
                    )
                  }
                  placeholder="Min experience (years)"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />


                <input
                  type="number"
                  min="0"
                  value={
                    form.experience_max
                  }
                  onChange={(e) =>
                    updateForm(
                      "experience_max",
                      e.target.value
                    )
                  }
                  placeholder="Max experience (years)"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />


                <input
                  value={
                    form.education
                  }
                  onChange={(e) =>
                    updateForm(
                      "education",
                      e.target.value
                    )
                  }
                  placeholder="Qualification / Education"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 sm:col-span-2"
                />

              </div>

            </div>


            {/* REQUIREMENTS */}

            <div className="mt-5">

              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Requirements & Salary
              </p>

              <div className="grid gap-3 sm:grid-cols-3">

                <input
                  type="number"
                  min="0"
                  value={
                    form.vacancies
                  }
                  onChange={(e) =>
                    updateForm(
                      "vacancies",
                      e.target.value
                    )
                  }
                  placeholder="Vacancies"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />

                <input
                  value={
                    form.age_limit
                  }
                  onChange={(e) =>
                    updateForm(
                      "age_limit",
                      e.target.value
                    )
                  }
                  placeholder="Age limit"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />

                <input
                  value={
                    form.age_relaxation
                  }
                  onChange={(e) =>
                    updateForm(
                      "age_relaxation",
                      e.target.value
                    )
                  }
                  placeholder="Age relaxation"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />


                <input
                  type="number"
                  min="0"
                  value={
                    form.salary_min
                  }
                  onChange={(e) =>
                    updateForm(
                      "salary_min",
                      e.target.value
                    )
                  }
                  placeholder="Salary minimum"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />

                <input
                  type="number"
                  min="0"
                  value={
                    form.salary_max
                  }
                  onChange={(e) =>
                    updateForm(
                      "salary_max",
                      e.target.value
                    )
                  }
                  placeholder="Salary maximum"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />

                <select
                  value={
                    form.salary_currency
                  }
                  onChange={(e) =>
                    updateForm(
                      "salary_currency",
                      e.target.value
                    )
                  }
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                >
                  <option value="INR">
                    INR
                  </option>
                  <option value="USD">
                    USD
                  </option>
                  <option value="EUR">
                    EUR
                  </option>
                  <option value="GBP">
                    GBP
                  </option>
                </select>

              </div>

            </div>


            {/* DATES */}

            <div className="mt-5">

              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Important Dates
              </p>

              <div className="grid gap-3 sm:grid-cols-3">

                <label className="text-xs font-semibold text-gray-500">
                  Application start

                  <input
                    type="datetime-local"
                    value={
                      form.application_start
                    }
                    onChange={(e) =>
                      updateForm(
                        "application_start",
                        e.target.value
                      )
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="text-xs font-semibold text-gray-500">
                  Application deadline

                  <input
                    type="datetime-local"
                    value={
                      form.application_deadline
                    }
                    onChange={(e) =>
                      updateForm(
                        "application_deadline",
                        e.target.value
                      )
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="text-xs font-semibold text-gray-500">
                  Exam date

                  <input
                    type="datetime-local"
                    value={
                      form.exam_date
                    }
                    onChange={(e) =>
                      updateForm(
                        "exam_date",
                        e.target.value
                      )
                    }
                    className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500"
                  />
                </label>

              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="mt-5">

              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Job Information
              </p>

              <input
                value={form.skills}
                onChange={(e) =>
                  updateForm(
                    "skills",
                    e.target.value
                  )
                }
                placeholder="Skills: Excel, SQL, Power BI"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />

              <textarea
                required
                value={
                  form.description
                }
                onChange={(e) =>
                  updateForm(
                    "description",
                    e.target.value
                  )
                }
                placeholder="Complete job description, responsibilities, requirements..."
                rows={7}
                className="mt-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm leading-6 outline-none focus:border-emerald-500"
              />

            </div>


            {/* SOURCES */}

            <div className="mt-5">

              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Sources
              </p>

              <div className="grid gap-3 sm:grid-cols-2">

                <input
                  value={
                    form.source_name
                  }
                  onChange={(e) =>
                    updateForm(
                      "source_name",
                      e.target.value
                    )
                  }
                  placeholder="Primary source name"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />

                <input
                  type="url"
                  value={
                    form.source_url
                  }
                  onChange={(e) =>
                    updateForm(
                      "source_url",
                      e.target.value
                    )
                  }
                  placeholder="Primary source URL"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />

              </div>

              <textarea
                value={
                  form.additional_sources
                }
                onChange={(e) =>
                  updateForm(
                    "additional_sources",
                    e.target.value
                  )
                }
                rows={3}
                placeholder={`Additional sources:\nSSC | https://...\nEmployment News | https://...`}
                className="mt-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm leading-6 outline-none focus:border-emerald-500"
              />

            </div>


            {/* APPLICATION */}

            <div className="mt-5">

              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Application & Provider
              </p>

              <div className="grid gap-3 sm:grid-cols-2">

                <input
                  type="url"
                  value={
                    form.apply_url
                  }
                  onChange={(e) =>
                    updateForm(
                      "apply_url",
                      e.target.value
                    )
                  }
                  placeholder="Original application URL"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />

                <input
                  type="url"
                  value={
                    form.provider_logo_url
                  }
                  onChange={(e) =>
                    updateForm(
                      "provider_logo_url",
                      e.target.value
                    )
                  }
                  placeholder="Provider / company logo URL"
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />

              </div>

            </div>


            {/* SAVE */}

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-5">

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {saving
                  ? "Saving..."
                  : editingId !==
                      null
                  ? "💾 Save Changes"
                  : "Save to Needs Approval"}
              </button>

              {editingId !==
                null && (
                <button
                  type="button"
                  onClick={
                    cancelEditing
                  }
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}

              {message && (
                <span className="text-xs font-semibold text-gray-500">
                  {message}
                </span>
              )}

            </div>

          </form>
        )}


        {/* JOB LIST SECTION */}

        <div
          id="jobs-list-section"
          className="mt-8 scroll-mt-20"
        >

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                Job Queue
              </p>

              <h2 className="mt-1 text-2xl font-black">
                {statusLabel(
                  managerFilter
                )}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {filteredJobs.length}{" "}
                {filteredJobs.length ===
                1
                  ? "job"
                  : "jobs"}{" "}
                in this view
              </p>

            </div>


            {/* FILTER BUTTONS */}

            <div className="flex flex-wrap gap-1.5">

              {(
                [
                  [
                    "all",
                    "All",
                  ],
                  [
                    "needs_approval",
                    "Needs Approval",
                  ],
                  [
                    "published",
                    "Published",
                  ],
                  [
                    "expired_archived",
                    "Expired / Archived",
                  ],
                ] as Array<
                  [
                    ManagerFilter,
                    string
                  ]
                >
              ).map(
                ([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      chooseManagerFilter(
                        value
                      )
                    }
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition sm:text-xs ${
                      managerFilter ===
                      value
                        ? "bg-gray-900 text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}

            </div>

          </div>


          {/* BULK APPROVAL */}

          {managerFilter ===
            "needs_approval" &&
            filteredJobs.length >
              0 && (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-bold text-blue-800">
                    Approval Queue
                  </p>

                  <p className="mt-0.5 text-[11px] leading-5 text-blue-700">
                    Review individual jobs,
                    or approve every job in
                    this queue after verification.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const confirmed =
                      window.confirm(
                        `Approve and publish all ${filteredJobs.length} jobs currently in Needs Approval?`
                      );

                    if (!confirmed) {
                      return;
                    }

                    setMessage(
                      "Publishing approved jobs..."
                    );

                    const {
                      data: userData,
                    } =
                      await supabaseBrowser.auth.getUser();

                    const now =
                      new Date().toISOString();

                    const ids =
                      filteredJobs.map(
                        (job) =>
                          job.id
                      );

                    const {
                      error,
                    } =
                      await supabaseBrowser
                        .from("jobs")
                        .update({
                          published:
                            true,

                          status:
                            "published",

                          approved_by:
                            userData.user
                              ?.id ??
                            null,

                          approved_at:
                            now,

                          published_at:
                            now,
                        })
                        .in(
                          "id",
                          ids
                        );

                    if (error) {
                      setMessage(
                        `Bulk publish failed: ${error.message}`
                      );

                      return;
                    }

                    setMessage(
                      `${ids.length} jobs published successfully.`
                    );

                    await loadJobs();
                  }}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                >
                  🚀 Approve All & Publish
                </button>

              </div>
            )}


          {/* LOADING */}

          {loading ? (

            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-8 text-center">

              <p className="text-xs text-gray-500">
                Loading jobs...
              </p>

            </div>

          ) : filteredJobs.length >
            0 ? (

            <div className="mt-4 space-y-3">

              {filteredJobs.map(
                (job) => {

                  const status =
                    getEffectiveStatus(
                      job
                    );

                  const sources =
                    jobSources[
                      String(
                        job.id
                      )
                    ] ?? [];

                  const deadlinePassed =
                    isDeadlinePassed(
                      job
                    );

                  const description =
                    job.description ??
                    "No description available.";

                  return (
                    <article
                      key={
                        job.id
                      }
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                    >

                      {/* TOP */}

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-1.5">

                            <h3 className="text-base font-black leading-6 sm:text-lg">
                              {job.title ||
                                "Untitled Job"}
                            </h3>

                            <span
                              className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${statusClasses(
                                status
                              )}`}
                            >
                              {statusLabel(
                                status as ManagerFilter
                              )}
                            </span>

                          </div>

                          <p className="mt-0.5 text-xs font-bold text-emerald-600">
                            {job.company ||
                              "Company not specified"}
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-gray-500">
                            {job.location ||
                              "Location not specified"}{" "}
                            •{" "}
                            {job.employment_type ||
                              job.type ||
                              "Job"}{" "}
                            •{" "}
                            {job.experience ||
                              "Experience not specified"}
                          </p>

                          <div className="mt-1.5 flex flex-wrap gap-1.5">

                            {(job.sector ||
                              job.job_category) && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-semibold text-gray-600">
                                {job.sector ||
                                  "Sector"}{" "}
                                •{" "}
                                {job.job_category ||
                                  job.category}
                              </span>
                            )}

                            {job.state_code && (
                              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                                {job.state_code}
                              </span>
                            )}

                            {job.work_mode && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-semibold text-gray-600">
                                {job.work_mode}
                              </span>
                            )}

                          </div>

                        </div>


                      </div>


                      {/* DESCRIPTION */}

                      <div className="mt-3 rounded-xl bg-gray-50 p-3">

                        <p className="text-xs leading-6 text-gray-600">
                          {description.length >
                          260
                            ? `${description.slice(
                                0,
                                260
                              )}…`
                            : description}
                        </p>

                      </div>


                      {/* META */}

                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">

                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-2.5">

                          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-gray-400">
                            Primary Source
                          </p>

                          <p className="mt-1 truncate text-[11px] font-semibold">
                            {job.source_name ||
                              "Not specified"}
                          </p>

                        </div>


                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-2.5">

                          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-gray-400">
                            Sources
                          </p>

                          <p className="mt-1 text-[11px] font-semibold">
                            {sources.length}
                          </p>

                        </div>


                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-2.5">

                          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-gray-400">
                            Deadline
                          </p>

                          <p className="mt-1 text-[11px] font-semibold">
                            {job.application_deadline
                              ? new Date(
                                  job.application_deadline
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Not specified"}
                          </p>

                        </div>

                      </div>


                      {deadlinePassed && (
                        <div className="mt-2 rounded-xl bg-orange-50 px-3 py-2 text-[10px] font-bold text-orange-700">
                          ⚠️ Application deadline has passed.
                        </div>
                      )}


                      {/* ACTIONS */}

                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">

                        <Link
                          href={`/jobs/${job.id}`}
                          target="_blank"
                          className="rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[10px] font-bold text-gray-700 hover:bg-gray-100"
                        >
                          👁️ View
                        </Link>


                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              job
                            )
                          }
                          className="rounded-lg bg-blue-600 px-2.5 py-2 text-[10px] font-bold text-white hover:bg-blue-700"
                        >
                          ✏️ Edit
                        </button>


                        {status ===
                          "needs_approval" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                verifyJob(
                                  job
                                )
                              }
                              className="rounded-lg bg-indigo-600 px-2.5 py-2 text-[10px] font-bold text-white hover:bg-indigo-700"
                            >
                              ✅ Verify
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                approveAndPublish(
                                  job
                                )
                              }
                              className="rounded-lg bg-emerald-600 px-2.5 py-2 text-[10px] font-bold text-white hover:bg-emerald-700"
                            >
                              🚀 Approve
                            </button>
                          </>
                        )}


                        {status ===
                          "published" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                unpublishJob(
                                  job
                                )
                              }
                              className="rounded-lg bg-amber-500 px-2.5 py-2 text-[10px] font-bold text-white hover:bg-amber-600"
                            >
                              📢 Unpublish
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                archiveJob(
                                  job
                                )
                              }
                              className="rounded-lg bg-orange-500 px-2.5 py-2 text-[10px] font-bold text-white hover:bg-orange-600"
                            >
                              🗃️ Archive
                            </button>
                          </>
                        )}


                        {status ===
                          "expired_archived" && (
                          <button
                            type="button"
                            onClick={() =>
                              restoreJob(
                                job
                              )
                            }
                            className="rounded-lg bg-emerald-600 px-2.5 py-2 text-[10px] font-bold text-white hover:bg-emerald-700"
                          >
                            ♻️ Restore
                          </button>
                        )}


                        <button
                          type="button"
                          onClick={() =>
                            deleteJob(
                              job
                            )
                          }
                          className="rounded-lg bg-red-600 px-2.5 py-2 text-[10px] font-bold text-white hover:bg-red-700"
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          ) : (

            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-8 text-center">

              <div className="text-3xl">
                📭
              </div>

              <h3 className="mt-2 text-lg font-black">
                No jobs here
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Jobs will appear here according
                to their workflow status.
              </p>

            </div>

          )}

        </div>


        {/* STATUS MESSAGE */}

        {message && (
          <div className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-700 shadow-xl">
            {message}
          </div>
        )}

      </section>

    </main>
  );
}