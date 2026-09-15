"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const BUSINESS_TYPES = [
  "Startup",
  "Retail",
  "E-commerce",
  "Service Business",
  "Technology / Software",
  "Manufacturing",
  "Food & Restaurant",
  "Education",
  "Consulting",
  "Other",
];

const BUSINESS_STAGES = [
  "Just an idea",
  "Planning",
  "Already operating",
  "Need to improve existing business",
  "Ready to launch",
];

const HELP_OPTIONS = [
  "Business Planning",
  "Market Research",
  "Website",
  "Mobile App",
  "E-commerce",
  "Digital Marketing",
  "Branding",
  "Automation",
  "Technology",
  "Data / Analytics",
  "Business Strategy",
  "Other",
];

const MAX_PROPOSAL_SIZE = 20 * 1024 * 1024;

const ALLOWED_PROPOSAL_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
];

const ALLOWED_PROPOSAL_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "zip",
];

type FormState = {
  full_name: string;
  email: string;
  phone: string;
  city_location: string;
  business_type: string;
  estimated_budget: string;
  business_stage: string;
  business_idea: string;
  help_needed: string;
  additional_information: string;
  consent: boolean;
};

const initialForm: FormState = {
  full_name: "",
  email: "",
  phone: "",
  city_location: "",
  business_type: "",
  estimated_budget: "",
  business_stage: "",
  business_idea: "",
  help_needed: "",
  additional_information: "",
  consent: false,
};

type UploadInfo = {
  path: string;
  name: string;
  size: number;
  type: string;
};

export default function BusinessConsultingForm() {
  const [form, setForm] =
    useState<FormState>(initialForm);

  const [selectedHelp, setSelectedHelp] =
    useState<string[]>([]);

  const [helpDropdownOpen, setHelpDropdownOpen] =
    useState(false);

  const helpDropdownRef =
  useRef<HTMLDivElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [proposalFile, setProposalFile] =
    useState<File | null>(null);

  const [uploadedProposal, setUploadedProposal] =
    useState<UploadInfo | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        helpDropdownRef.current &&
        !helpDropdownRef.current.contains(target)
      ) {
        setHelpDropdownOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [helpDropdownRef]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleHelpOption(option: string) {
    setSelectedHelp((current) => {
      const exists = current.includes(option);

      const updated = exists
        ? current.filter(
            (item) => item !== option
          )
        : [...current, option];

      setForm((currentForm) => ({
        ...currentForm,
        help_needed: updated.join(", "),
      }));

      return updated;
    });
  }

  function removeHelpOption(option: string) {
    setSelectedHelp((current) => {
      const updated = current.filter(
        (item) => item !== option
      );

      setForm((currentForm) => ({
        ...currentForm,
        help_needed: updated.join(", "),
      }));

      return updated;
    });
  }

  function handleProposalSelect(
    file: File | null
  ) {
    setError("");
    setMessage("");

    if (!file) {
      setProposalFile(null);
      setUploadedProposal(null);
      return;
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "";

    if (
      !ALLOWED_PROPOSAL_EXTENSIONS.includes(
        extension
      )
    ) {
      setError(
        "Only PDF, DOC, DOCX or ZIP files are allowed."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (
      !ALLOWED_PROPOSAL_TYPES.includes(
        file.type
      )
    ) {
      setError(
        "The selected project proposal file type is not supported."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (file.size <= 0) {
      setError(
        "The selected project proposal file is empty."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (file.size > MAX_PROPOSAL_SIZE) {
      setError(
        "Project proposal must be 20 MB or smaller."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setProposalFile(file);
    setUploadedProposal(null);
  }

  function removeProposal() {
    setProposalFile(null);
    setUploadedProposal(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function formatFileSize(bytes: number) {
    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${Math.max(
      1,
      Math.round(bytes / 1024)
    )} KB`;
  }

  async function prepareProposalUpload(
    file: File
  ): Promise<UploadInfo> {
    const uploadUrlResponse = await fetch(
      "/api/business-consultation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create-upload-url",
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
        }),
      }
    );

    const uploadUrlData =
      await uploadUrlResponse.json();

    if (
      !uploadUrlResponse.ok ||
      !uploadUrlData?.success
    ) {
      throw new Error(
        uploadUrlData?.error ||
          "Unable to prepare the project proposal upload."
      );
    }

    const supabaseModule =
      await import("@/lib/supabase-browser");

    const supabaseBrowser =
      supabaseModule.supabaseBrowser;

    const { error: uploadError } =
      await supabaseBrowser.storage
        .from("business-proposals")
        .uploadToSignedUrl(
          uploadUrlData.path,
          uploadUrlData.token,
          file
        );

    if (uploadError) {
      throw uploadError;
    }

    return {
      path: uploadUrlData.path,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  }

  async function deleteUploadedProposal(
    path: string
  ) {
    try {
      await fetch(
        "/api/business-consultation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "delete-upload",
            path,
          }),
        }
      );
    } catch (cleanupError) {
      console.error(
        "Proposal cleanup error:",
        cleanupError
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (!form.phone.trim()) {
      setError(
        "Please enter your phone number."
      );
      return;
    }

    if (!form.business_type) {
      setError(
        "Please select your business type."
      );
      return;
    }

    if (!form.business_stage) {
      setError(
        "Please select your business stage."
      );
      return;
    }

    if (!form.business_idea.trim()) {
      setError(
        "Please describe your business idea."
      );
      return;
    }

    if (selectedHelp.length === 0) {
      setError(
        "Please select at least one type of help you need."
      );
      return;
    }

    if (!form.consent) {
      setError(
        "Please confirm that you agree to be contacted regarding your consultation request."
      );
      return;
    }

    setSubmitting(true);

    let uploadedPath: string | null = null;

    try {
      let proposalUpload: UploadInfo | null =
        uploadedProposal;

      if (proposalFile && !proposalUpload) {
        setMessage(
          "Uploading your project proposal..."
        );

        proposalUpload =
          await prepareProposalUpload(
            proposalFile
          );

        uploadedPath =
          proposalUpload.path;

        setUploadedProposal(
          proposalUpload
        );
      }

      const requestPayload = {
        ...form,

        proposal_file_path:
          proposalUpload?.path ?? null,

        proposal_file_name:
          proposalUpload?.name ?? null,

        proposal_file_size:
          proposalUpload?.size ?? null,

        proposal_file_type:
          proposalUpload?.type ?? null,
      };

      setMessage(
        "Submitting your consultation request..."
      );

      const response = await fetch(
        "/api/business-consultation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            requestPayload
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "We could not submit your consultation request."
        );
      }

      setForm(initialForm);
      setSelectedHelp([]);
      setHelpDropdownOpen(false);
      setProposalFile(null);
      setUploadedProposal(null);
      setMessage(
        "Your consultation request has been submitted successfully. We will contact you soon."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      if (uploadedPath) {
        await deleteUploadedProposal(
          uploadedPath
        );

        setUploadedProposal(null);
      }

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );

      setMessage("");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10";

  const labelClass =
    "text-sm font-bold text-slate-800";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <div className="mb-7">
        <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">
          Tell us about your business
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Share a few details and we will understand
          how MindraInfo can help you.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Full Name{" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={form.full_name}
            onChange={(event) =>
              updateField(
                "full_name",
                event.target.value
              )
            }
            placeholder="Your full name"
            className={inputClass}
            autoComplete="name"
          />
        </div>

        <div>
          <label className={labelClass}>
            Email{" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField(
                "email",
                event.target.value
              )
            }
            placeholder="you@example.com"
            className={inputClass}
            autoComplete="email"
          />
        </div>

        <div>
          <label className={labelClass}>
            Phone Number{" "}
            <span className="text-red-500">*</span>
          </label>

          <input
            type="tel"
            value={form.phone}
            onChange={(event) =>
              updateField(
                "phone",
                event.target.value
              )
            }
            placeholder="+91 XXXXX XXXXX"
            className={inputClass}
            autoComplete="tel"
          />
        </div>

        <div>
          <label className={labelClass}>
            City / Location
          </label>

          <input
            type="text"
            value={form.city_location}
            onChange={(event) =>
              updateField(
                "city_location",
                event.target.value
              )
            }
            placeholder="City or location"
            className={inputClass}
            autoComplete="address-level2"
          />
        </div>

        <div>
          <label className={labelClass}>
            Business Type{" "}
            <span className="text-red-500">*</span>
          </label>

          <select
            value={form.business_type}
            onChange={(event) =>
              updateField(
                "business_type",
                event.target.value
              )
            }
            className={inputClass}
          >
            <option value="">
              Select business type
            </option>

            {BUSINESS_TYPES.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Estimated Budget
          </label>

          <input
            type="text"
            value={form.estimated_budget}
            onChange={(event) =>
              updateField(
                "estimated_budget",
                event.target.value
              )
            }
            placeholder="Example: ₹50,000 – ₹2,00,000"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>
            Business Stage{" "}
            <span className="text-red-500">*</span>
          </label>

          <select
            value={form.business_stage}
            onChange={(event) =>
              updateField(
                "business_stage",
                event.target.value
              )
            }
            className={inputClass}
          >
            <option value="">
              Select your current stage
            </option>

            {BUSINESS_STAGES.map(
              (stage) => (
                <option
                  key={stage}
                  value={stage}
                >
                  {stage}
                </option>
              )
            )}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>
            Business Idea / Description{" "}
            <span className="text-red-500">*</span>
          </label>

          <textarea
            value={form.business_idea}
            onChange={(event) =>
              updateField(
                "business_idea",
                event.target.value
              )
            }
            placeholder="Tell us what you want to build, sell or improve..."
            rows={6}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div
          className="sm:col-span-2"
          ref={helpDropdownRef}
        >
          <label className={labelClass}>
            What Help Do You Need?{" "}
            <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setHelpDropdownOpen(
                  (current) => !current
                )
              }
              className={`${inputClass} flex min-h-[50px] items-center justify-between gap-3 text-left`}
            >
              <span className="flex flex-1 flex-wrap gap-2">
                {selectedHelp.length === 0 ? (
                  <span className="text-slate-400">
                    Select one or more options
                  </span>
                ) : (
                  selectedHelp.map(
                    (option) => (
                      <span
                        key={option}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                      >
                        {option}

                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            removeHelpOption(
                              option
                            );
                          }}
                          className="cursor-pointer rounded-full px-1 hover:bg-emerald-100"
                          aria-label={`Remove ${option}`}
                        >
                          ×
                        </span>
                      </span>
                    )
                  )
                )}
              </span>

              <span
                className={`shrink-0 text-slate-400 transition ${
                  helpDropdownOpen
                    ? "rotate-180"
                    : ""
                }`}
              >
                ▾
              </span>
            </button>

            {helpDropdownOpen && (
              <div className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                {HELP_OPTIONS.map(
                  (option) => {
                    const selected =
                      selectedHelp.includes(
                        option
                      );

                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() =>
                          toggleHelpOption(
                            option
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition hover:bg-slate-50"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-black ${
                            selected
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>

                        <span
                          className={
                            selected
                              ? "font-bold text-slate-900"
                              : "text-slate-700"
                          }
                        >
                          {option}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Select all services that may be useful
            for your business.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>
            Project Proposal
            <span className="ml-2 text-xs font-semibold text-slate-400">
              Optional
            </span>
          </label>

          <div className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
              onChange={(event) =>
                handleProposalSelect(
                  event.target.files?.[0] ??
                    null
                )
              }
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-white hover:file:bg-slate-800"
            />

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Accepted: PDF, DOC, DOCX or ZIP.
              Maximum size: 20 MB.
            </p>

            {proposalFile && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-emerald-800">
                    📎 {proposalFile.name}
                  </p>

                  <p className="mt-1 text-xs text-emerald-600">
                    {formatFileSize(
                      proposalFile.size
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeProposal}
                  disabled={submitting}
                  className="shrink-0 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>
            Additional Information
          </label>

          <textarea
            value={
              form.additional_information
            }
            onChange={(event) =>
              updateField(
                "additional_information",
                event.target.value
              )
            }
            placeholder="Anything else we should know?"
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) =>
                updateField(
                  "consent",
                  event.target.checked
                )
              }
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />

            <span className="text-sm leading-6 text-slate-600">
              I agree to be contacted by
              MindraInfo regarding this business
              consultation request.
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-7 w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting
          ? "Please wait..."
          : "Submit Consultation Request →"}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-slate-400">
        Your information is used to review and respond
        to your consultation request.
      </p>
    </form>
  );
}