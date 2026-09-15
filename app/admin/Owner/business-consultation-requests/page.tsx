"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

type ConsultationStatus = "new" | "contacted" | "in_progress" | "completed" | "closed";

type ConsultationRequest = {
  id: string;
  created_at: string;
  updated_at?: string;
  full_name: string;
  email: string;
  phone: string;
  city_location: string | null;
  business_type: string;
  estimated_budget: string | null;
  business_stage: string;
  business_idea: string;
  help_needed: string;
  additional_information: string | null;
  consent: boolean;
  proposal_file_path: string | null;
  proposal_file_name: string | null;
  proposal_file_size: number | null;
  proposal_file_type: string | null;
  status: ConsultationStatus;
};

type Filter = "all" | ConsultationStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
];

const STATUS_OPTIONS: ConsultationStatus[] = ["new", "contacted", "in_progress", "completed", "closed"];

function formatStatus(status: string) {
  switch (status) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "closed":
      return "Closed";
    default:
      return status;
  }
}

function statusClasses(status: string) {
  switch (status) {
    case "new":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "contacted":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "in_progress":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "closed":
      return "border-slate-200 bg-slate-100 text-slate-600";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function formatFileSize(bytes: number | null) {
  if (!bytes || bytes <= 0) return "";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return value;
  }
}

export default function BusinessConsultationRequestsPage() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadRequests() {
    setLoading(true);
    setError("");

    try {
      const { data: sessionData } = await supabaseBrowser.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        window.location.replace("/admin/login?role=owner");
        return;
      }

      const response = await fetch("/api/admin/business-consultation-requests", {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        window.location.replace("/admin/login?role=owner");
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load consultation requests.");
      }

      const nextRequests: ConsultationRequest[] = Array.isArray(data?.requests) ? data.requests : [];
      setRequests(nextRequests);

      setSelectedRequest((current) => {
        if (!current) return null;
        return nextRequests.find((item) => item.id === current.id) ?? null;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load consultation requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((request) => request.status === filter);
  }, [requests, filter]);

  const counts = useMemo(() => ({
    all: requests.length,
    new: requests.filter((request) => request.status === "new").length,
    contacted: requests.filter((request) => request.status === "contacted").length,
    in_progress: requests.filter((request) => request.status === "in_progress").length,
    completed: requests.filter((request) => request.status === "completed").length,
    closed: requests.filter((request) => request.status === "closed").length,
  }), [requests]);

  async function updateStatus(requestId: string, status: ConsultationStatus) {
    if (!requestId) {
      setError("This consultation request has no valid Request ID.");
      return;
    }

    setSavingId(requestId);
    setMessage("");
    setError("");

    try {
      const { data: sessionData } = await supabaseBrowser.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        window.location.replace("/admin/login?role=owner");
        return;
      }

      const response = await fetch("/api/admin/business-consultation-requests", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: requestId, status }),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        window.location.replace("/admin/login?role=owner");
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || "Unable to update request status.");
      }

      setMessage("Request status updated successfully.");
      await loadRequests();

      setSelectedRequest((current) => {
        if (!current || current.id !== requestId) return current;
        return data?.request ?? current;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update request status.");
    } finally {
      setSavingId(null);
    }
  }

  async function downloadProposal(request: ConsultationRequest) {
    if (!request.proposal_file_path) {
      setError("No project proposal is attached to this request.");
      return;
    }

    setError("");
    setMessage("Preparing secure proposal download...");

    try {
      const { data: sessionData } = await supabaseBrowser.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        window.location.replace("/admin/login?role=owner");
        return;
      }

      const response = await fetch("/api/admin/business-consultation-requests/proposal", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: request.proposal_file_path }),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        window.location.replace("/admin/login?role=owner");
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || "Unable to prepare the proposal download.");
      }

      if (!data?.url) {
        throw new Error("A secure download URL could not be created.");
      }

      window.open(data.url, "_blank", "noopener,noreferrer");
      setMessage("Secure proposal download opened.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to download the proposal.");
    }
  }

  async function handleSignOut() {
    await supabaseBrowser.auth.signOut();
    window.location.replace("/admin/login?role=owner");
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600">MindraInfo Owner</p>
            <h1 className="mt-1 text-xl font-black sm:text-2xl">Business Consultation Requests</h1>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/Owner" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 sm:px-4 sm:text-sm">
              ← Owner
            </Link>

            <button type="button" onClick={handleSignOut} className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 sm:px-4 sm:text-sm">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Business Consulting</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Manage consultation requests</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Review entrepreneur requests, project proposals and consultation progress from one Owner-only section.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-2xl border p-4 text-left shadow-sm transition ${
                filter === item.value
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className={`text-[10px] font-black uppercase tracking-[0.14em] ${filter === item.value ? "text-white/60" : "text-slate-400"}`}>
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-black">{counts[item.value]}</p>
            </button>
          ))}
        </div>

        {message && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Loading consultation requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="text-4xl">📭</div>
              <h3 className="mt-3 text-lg font-black">No consultation requests</h3>
              <p className="mt-1 text-sm text-slate-500">Requests matching this status will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <article key={request.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black">{request.full_name}</h3>
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${statusClasses(request.status)}`}>
                          {formatStatus(request.status)}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <span className="font-bold text-slate-400">Business</span>
                          <p className="font-semibold">{request.business_type}</p>
                        </div>

                        <div>
                          <span className="font-bold text-slate-400">Stage</span>
                          <p className="font-semibold">{request.business_stage}</p>
                        </div>

                        <div>
                          <span className="font-bold text-slate-400">Location</span>
                          <p className="font-semibold">{request.city_location || "Not provided"}</p>
                        </div>

                        <div>
                          <span className="font-bold text-slate-400">Submitted</span>
                          <p className="font-semibold">{formatDate(request.created_at)}</p>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">{request.business_idea}</p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(request)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                      >
                        View Details
                      </button>

                      {request.proposal_file_path && (
                        <button
                          type="button"
                          onClick={() => downloadProposal(request)}
                          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                        >
                          📎 Proposal
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-400">
                      Help needed: <span className="font-semibold text-slate-600">{request.help_needed}</span>
                    </p>

                    <select
                      value={request.status}
                      disabled={savingId === request.id}
                      onChange={(event) => updateStatus(request.id, event.target.value as ConsultationStatus)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{formatStatus(status)}</option>
                      ))}
                    </select>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedRequest && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 p-4">
          <div className="mx-auto my-8 max-w-3xl rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                  Consultation Request #{selectedRequest.id}
                </p>
                <h2 className="mt-2 text-2xl font-black">{selectedRequest.full_name}</h2>
                <p className="mt-1 text-sm text-slate-500">{formatDate(selectedRequest.created_at)}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-lg font-bold text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Email</p>
                <p className="mt-1 break-all text-sm font-semibold">{selectedRequest.email}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Phone</p>
                <p className="mt-1 text-sm font-semibold">{selectedRequest.phone}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">City / Location</p>
                <p className="mt-1 text-sm font-semibold">{selectedRequest.city_location || "Not provided"}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Business Type</p>
                <p className="mt-1 text-sm font-semibold">{selectedRequest.business_type}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Business Stage</p>
                <p className="mt-1 text-sm font-semibold">{selectedRequest.business_stage}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Estimated Budget</p>
                <p className="mt-1 text-sm font-semibold">{selectedRequest.estimated_budget || "Not provided"}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Help Needed</p>
                <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6">{selectedRequest.help_needed}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Business Idea / Description</p>
                <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7">{selectedRequest.business_idea}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Additional Information</p>
                <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7">
                  {selectedRequest.additional_information || "No additional information provided."}
                </p>
              </div>

              <div className="sm:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Project Proposal</p>

                {selectedRequest.proposal_file_path ? (
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-900">
                        📎 {selectedRequest.proposal_file_name || "Project proposal"}
                      </p>
                      <p className="mt-1 text-xs text-emerald-700">
                        {formatFileSize(selectedRequest.proposal_file_size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => downloadProposal(selectedRequest)}
                      className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                    >
                      Download Proposal
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-emerald-700">No project proposal was attached.</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-400">
                  Current status: <span className="font-bold text-slate-700">{formatStatus(selectedRequest.status)}</span>
                </p>

                <select
                  value={selectedRequest.status}
                  disabled={savingId === selectedRequest.id}
                  onChange={(event) => updateStatus(selectedRequest.id, event.target.value as ConsultationStatus)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold outline-none focus:border-emerald-500 disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{formatStatus(status)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}