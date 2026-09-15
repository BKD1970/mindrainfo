import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GEMINI_MODEL = "gemini-3.5-flash-lite";

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type Candidate = {
  id: number;
  source_registry_id: number;
  source_name: string | null;
  source_url: string;
  external_url: string;
  title: string | null;
  raw_content: string | null;
  content_hash: string | null;
  processing_status: string;
  ai_processed_at: string | null;
  created_job_id: number | null;
};

type AiJob = {
  is_valid_job_record: boolean;
  rejection_reason: string;

  company: string;
  title: string;
  location: string;

  sector:
    | "government"
    | "private"
    | "psu"
    | "banking"
    | "railway"
    | "defence"
    | "other";

  job_category: string;
  sub_category: string;

  government_level:
    | "central"
    | "state"
    | "other";

  state: string;
  state_code: string;

  organization: string;
  department: string;
  ministry: string;

  work_mode:
    | "onsite"
    | "remote"
    | "hybrid"
    | "field"
    | "other";

  employment_type:
    | "full-time"
    | "part-time"
    | "contract"
    | "temporary"
    | "internship"
    | "apprenticeship"
    | "other";

  experience_min: number;
  experience_max: number;

  education: string;

  salary_min: number;
  salary_max: number;
  salary_currency: string;

  vacancies: number;

  age_limit: string;
  age_relaxation: string;

  application_start: string;
  application_deadline: string;
  exam_date: string;

  notification_type:
    | "recruitment"
    | "application-opening"
    | "deadline-extension"
    | "admit-card"
    | "exam-date"
    | "result"
    | "answer-key"
    | "cancellation"
    | "corrigendum"
    | "other";

  description: string;

  skills: string[];

  apply_url: string;
  provider_logo_url: string;
};

/*
  Gemini structured-output schema.

  We intentionally use simple non-nullable JSON types here.
  Unknown values are represented by:
  - "" for text
  - 0 for numbers
  - [] for arrays

  The application converts those values back to database nulls.
*/
const responseSchema = {
  type: "object",

  properties: {
    is_valid_job_record: {
      type: "boolean",
      description:
        "True only when this candidate contains an actual job vacancy, recruitment notice, or official recruitment-related notification. False for home pages, about pages, general information, publications, books, tenders unrelated to recruitment, contact pages, and other non-job content.",
    },

    rejection_reason: {
      type: "string",
      description:
        "Short reason for rejection when is_valid_job_record is false. Empty string when valid.",
    },

    company: {
      type: "string",
      description:
        "Employer, company, organization, board, commission, institution or recruiting authority.",
    },

    title: {
      type: "string",
      description:
        "Actual job title or recruitment/official recruitment-notification title.",
    },

    location: {
      type: "string",
      description:
        "Job location when explicitly supported by the source.",
    },

    sector: {
      type: "string",
      enum: [
        "government",
        "private",
        "psu",
        "banking",
        "railway",
        "defence",
        "other",
      ],
    },

    job_category: {
      type: "string",
      description:
        "Examples: Data Analyst, Software Engineer, Clerk, Teacher, Nurse, Civil Engineer.",
    },

    sub_category: {
      type: "string",
      description:
        "More specific category when supported. Empty string when unavailable.",
    },

    government_level: {
      type: "string",
      enum: [
        "central",
        "state",
        "other",
      ],
    },

    state: {
      type: "string",
      description:
        "Indian state or union territory when explicitly supported. Empty when not applicable.",
    },

    state_code: {
      type: "string",
      description:
        "Indian state/UT code such as KA, OD, MH, DL. Empty when unavailable.",
    },

    organization: {
      type: "string",
      description:
        "Official organization name.",
    },

    department: {
      type: "string",
      description:
        "Government department or organizational department if available.",
    },

    ministry: {
      type: "string",
      description:
        "Indian government ministry if available.",
    },

    work_mode: {
      type: "string",
      enum: [
        "onsite",
        "remote",
        "hybrid",
        "field",
        "other",
      ],
    },

    employment_type: {
      type: "string",
      enum: [
        "full-time",
        "part-time",
        "contract",
        "temporary",
        "internship",
        "apprenticeship",
        "other",
      ],
    },

    experience_min: {
      type: "integer",
      description:
        "Minimum years of experience. Use 0 when unknown or not applicable.",
    },

    experience_max: {
      type: "integer",
      description:
        "Maximum years of experience. Use 0 when unknown or not applicable.",
    },

    education: {
      type: "string",
      description:
        "Required qualification or education.",
    },

    salary_min: {
      type: "number",
      description:
        "Minimum salary/pay amount only when explicitly available. Use 0 when unknown.",
    },

    salary_max: {
      type: "number",
      description:
        "Maximum salary/pay amount only when explicitly available. Use 0 when unknown.",
    },

    salary_currency: {
      type: "string",
      description:
        "Currency code. Usually INR for Indian jobs.",
    },

    vacancies: {
      type: "integer",
      description:
        "Number of vacancies only when explicitly available. Use 0 when unknown.",
    },

    age_limit: {
      type: "string",
      description:
        "Age eligibility or limit.",
    },

    age_relaxation: {
      type: "string",
      description:
        "Age relaxation information.",
    },

    application_start: {
      type: "string",
      description:
        "Application start date in YYYY-MM-DD format. Empty when unavailable.",
    },

    application_deadline: {
      type: "string",
      description:
        "Application closing/deadline date in YYYY-MM-DD format. Empty when unavailable.",
    },

    exam_date: {
      type: "string",
      description:
        "Exam date in YYYY-MM-DD format. Empty when unavailable.",
    },

    notification_type: {
      type: "string",
      enum: [
        "recruitment",
        "application-opening",
        "deadline-extension",
        "admit-card",
        "exam-date",
        "result",
        "answer-key",
        "cancellation",
        "corrigendum",
        "other",
      ],
    },

    description: {
      type: "string",
      description:
        "Concise factual description based only on the source content.",
    },

    skills: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "Skills, role requirements or relevant keywords explicitly supported by the source.",
    },

    apply_url: {
      type: "string",
      description:
        "Official application URL only when explicitly supported by the source. Empty otherwise.",
    },

    provider_logo_url: {
      type: "string",
      description:
        "Official provider logo URL only if explicitly present in the supplied source content. Empty otherwise.",
    },
  },

  required: [
    "is_valid_job_record",
    "rejection_reason",
    "company",
    "title",
    "location",
    "sector",
    "job_category",
    "sub_category",
    "government_level",
    "state",
    "state_code",
    "organization",
    "department",
    "ministry",
    "work_mode",
    "employment_type",
    "experience_min",
    "experience_max",
    "education",
    "salary_min",
    "salary_max",
    "salary_currency",
    "vacancies",
    "age_limit",
    "age_relaxation",
    "application_start",
    "application_deadline",
    "exam_date",
    "notification_type",
    "description",
    "skills",
    "apply_url",
    "provider_logo_url",
  ],
};

function cleanString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed || null;
}

function cleanNumber(value: unknown): number | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return null;
  }

  return value;
}

function cleanInteger(value: unknown): number | null {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value <= 0
  ) {
    return null;
  }

  return value;
}

function normalizeDate(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const valueTrimmed = value.trim();

  if (!valueTrimmed) {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(valueTrimmed)) {
    return null;
  }

  const date = new Date(`${valueTrimmed}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return valueTrimmed;
}

function isValidHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  try {
    const url = new URL(value.trim());

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

async function sleep(milliseconds: number) {
  await new Promise((resolve) =>
    setTimeout(resolve, milliseconds)
  );
}

function isRetryableGeminiStatus(status: number) {
  return (
    status === 408 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

async function reserveAiRequest(
  supabase: any
): Promise<boolean> {
  const { data, error } = await supabase.rpc(
    "reserve_ai_request"
  );

  if (error) {
    throw new Error(
      `Could not reserve Gemini request quota: ${error.message}`
    );
  }

  return data === true;
}

async function callGemini(
  apiKey: string,
  candidate: Candidate,
  supabase: any
): Promise<AiJob> {
  const rawContent = (
    candidate.raw_content || ""
  ).slice(0, 20000);

  const prompt = `
You are the job-content classification and extraction engine for MindraInfo, an Indian jobs information platform.

Your first and most important task is to decide whether the supplied candidate is actually a JOB or an OFFICIAL RECRUITMENT-RELATED NOTIFICATION.

A candidate is VALID when it is about things such as:
- job vacancy
- recruitment advertisement
- recruitment notification
- application opening
- application deadline
- deadline extension
- admit card for a recruitment examination
- exam date for recruitment
- recruitment result
- recruitment answer key
- recruitment cancellation
- recruitment corrigendum
- official recruitment notice

A candidate is INVALID when it is merely:
- Home
- About Us
- Contact Us
- general website information
- books or publications
- shopping
- general news unrelated to recruitment
- generic announcements unrelated to recruitment
- organization information without recruitment
- navigation page
- archive/index page that contains no specific recruitment information
- tender/procurement information unrelated to employment
- any other content that does not describe a job or recruitment-related notification

CRITICAL RULE:
Do NOT convert a webpage simply because it comes from a government website into a job.

For example:
"About Us" = INVALID.
"Home" = INVALID.
"Buy Books From Publications Division Website" = INVALID.
"SSC Selection Post Recruitment 2026" = VALID.

Use ONLY the supplied source content.
Do not invent facts.
Do not guess missing dates, salary, vacancies, qualifications, URLs or other fields.

For an INVALID candidate:
- set is_valid_job_record to false
- explain why in rejection_reason
- the remaining fields may contain empty/default values.

For a VALID candidate:
- set is_valid_job_record to true
- set rejection_reason to empty string
- extract the structured job/notification information carefully.

Important:
A recruitment-related notification can be valid even if it is not a brand-new vacancy. Admit cards, results, answer keys, deadline extensions and corrigenda are legitimate recruitment records.

The apply_url must be an actual official application URL explicitly found in the source content.
Do not invent it.

Dates must use YYYY-MM-DD only when an exact date is available.

SOURCE NAME:
${candidate.source_name || ""}

SOURCE PAGE:
${candidate.source_url}

CANDIDATE URL:
${candidate.external_url}

CANDIDATE TITLE:
${candidate.title || ""}

SOURCE CONTENT:
${rawContent}
`;

  let response: Response | null = null;
  let responseText = "";

  const maxAttempts = 4;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    /*
      IMPORTANT QUOTA RULE:

      Every actual Gemini HTTP attempt must first reserve
      exactly one request from the daily quota.

      Therefore:
      - first attempt = 1 quota unit
      - retry attempt = another quota unit
      - every retry is counted
      - if quota is exhausted, Gemini is NOT called
    */
    const quotaReserved =
      await reserveAiRequest(supabase);

    if (!quotaReserved) {
      throw new Error(
        "Daily Gemini request limit has been reached. No Gemini request was made."
      );
    }

    response = await fetch(
      `${GEMINI_URL}?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],

          generationConfig: {
            responseMimeType:
              "application/json",

            responseSchema,

            thinkingConfig: {
              thinkingLevel: "low",
            },
          },
        }),

        signal:
          AbortSignal.timeout(120000),
      }
    );

    responseText =
      await response.text();

    if (response.ok) {
      break;
    }

    if (
      !isRetryableGeminiStatus(
        response.status
      ) ||
      attempt === maxAttempts
    ) {
      throw new Error(
        `Gemini API ${response.status}: ${responseText.slice(
          0,
          1500
        )}`
      );
    }

    const delay =
      Math.min(
        5000 *
          Math.pow(
            2,
            attempt - 1
          ),
        30000
      ) +
      Math.floor(
        Math.random() * 2000
      );

    await sleep(delay);
  }

  if (!response) {
    throw new Error(
      "Gemini request was not executed."
    );
  }

  let data: any;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      "Gemini returned an invalid API response."
    );
  }

  const generatedText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (
    typeof generatedText !== "string" ||
    !generatedText.trim()
  ) {
    throw new Error(
      "Gemini returned no structured content."
    );
  }

  let parsed: AiJob;

  try {
    parsed = JSON.parse(generatedText);
  } catch {
    throw new Error(
      `Gemini output was not valid JSON: ${generatedText.slice(
        0,
        1500
      )}`
    );
  }

  return parsed;
}

export async function GET(
  request: NextRequest
) {
  const cronSecret =
    process.env.CRON_SECRET;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const geminiApiKey =
    process.env.GEMINI_API_KEY;

  if (!cronSecret) {
    return NextResponse.json(
      {
        success: false,
        error:
          "CRON_SECRET is not configured.",
      },
      { status: 500 }
    );
  }

  if (!serviceRoleKey) {
    return NextResponse.json(
      {
        success: false,
        error:
          "SUPABASE_SERVICE_ROLE_KEY is not configured.",
      },
      { status: 500 }
    );
  }

  if (!supabaseUrl) {
    return NextResponse.json(
      {
        success: false,
        error:
          "NEXT_PUBLIC_SUPABASE_URL is not configured.",
      },
      { status: 500 }
    );
  }

  if (!geminiApiKey) {
    return NextResponse.json(
      {
        success: false,
        error:
          "GEMINI_API_KEY is not configured.",
      },
      { status: 500 }
    );
  }

  const authorization =
    request.headers.get("authorization");

  if (
    authorization !==
    `Bearer ${cronSecret}`
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized.",
      },
      { status: 401 }
    );
  }

  const supabase: any =
    createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

  try {
    /*
      AI ENABLE / DISABLE CONTROL
    */
    const {
      data: aiSettings,
      error: aiSettingsError,
    } = await supabase
      .from("job_ai_settings")
      .select(
        "enabled, model, max_candidates_per_run, daily_request_limit"
      )
      .eq("id", 1)
      .maybeSingle();

    if (aiSettingsError) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Could not load AI settings: ${aiSettingsError.message}`,
        },
        { status: 500 }
      );
    }

    /*
      FAIL SAFE:
      If settings do not exist or enabled is not explicitly true,
      Gemini processing is stopped.
    */
    if (!aiSettings || aiSettings.enabled !== true) {
      return NextResponse.json({
        success: true,
        mode: "ai-processing-stopped",
        message:
          "AI job processing is currently stopped by admin control.",
        summary: {
          candidatesChecked: 0,
          validJobs: 0,
          rejectedCandidates: 0,
          jobsCreated: 0,
          errors: 0,
        },
        timestamp:
          new Date().toISOString(),
      });
    }

    /*
      Keep the current model exactly as requested.
    */
    if (
      aiSettings.model &&
      aiSettings.model !== GEMINI_MODEL
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `AI settings model must remain ${GEMINI_MODEL}. Current setting: ${aiSettings.model}`,
        },
        { status: 500 }
      );
    }

    /*
      HARD RUN LIMIT:
      Regardless of the database setting, this processor will
      process at most ONE candidate per execution.
    */
    const configuredMaxCandidates =
      Number.isInteger(
        aiSettings.max_candidates_per_run
      )
        ? aiSettings.max_candidates_per_run
        : 1;

    const maxCandidatesPerRun =
      Math.min(
        Math.max(
          configuredMaxCandidates,
          1
        ),
        1
      );

    /*
      First check whether any daily Gemini request quota remains.
      This check is only for reporting / early stop.

      No Gemini request is made here.
    */
    const { data: usageRow, error: usageError } =
      await supabase
        .from("job_ai_usage")
        .select(
          "usage_date, request_count"
        )
        .eq(
          "usage_date",
          new Date().toISOString().slice(0, 10)
        )
        .maybeSingle();

    if (usageError) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Could not read AI usage: ${usageError.message}`,
        },
        { status: 500 }
      );
    }

    const dailyLimit =
      Number.isInteger(
        aiSettings.daily_request_limit
      ) &&
      aiSettings.daily_request_limit > 0
        ? aiSettings.daily_request_limit
        : 0;

    const requestCount =
      Number.isInteger(
        usageRow?.request_count
      )
        ? usageRow.request_count
        : 0;

    if (
      dailyLimit <= 0 ||
      requestCount >= dailyLimit
    ) {
      return NextResponse.json({
        success: true,
        mode: "ai-processing-quota-reached",
        message:
          "Daily Gemini request limit has been reached. No Gemini request was made.",
        summary: {
          candidatesChecked: 0,
          validJobs: 0,
          rejectedCandidates: 0,
          jobsCreated: 0,
          errors: 0,
        },
        quota: {
          dailyRequestLimit:
            dailyLimit,
          requestsUsed:
            requestCount,
          requestsRemaining: 0,
        },
        timestamp:
          new Date().toISOString(),
      });
    }

    /*
      QUEUE:

      Only candidates already deterministically processed
      are eligible for Gemini.

      We also explicitly exclude candidates that have already
      been assigned to a created job.
    */
    const {
      data: candidates,
      error: candidatesError,
    } = await supabase
      .from(
        "job_discovery_candidates"
      )
      .select(
        `
          id,
          source_registry_id,
          source_name,
          source_url,
          external_url,
          title,
          raw_content,
          content_hash,
          processing_status,
          ai_processed_at,
          created_job_id
        `
      )
      .eq(
        "processing_status",
        "processed"
      )
      .is(
        "ai_processed_at",
        null
      )
      .is(
        "created_job_id",
        null
      )
      .order(
        "discovered_at",
        {
          ascending: true,
        }
      )
      .limit(
        maxCandidatesPerRun
      );

    if (candidatesError) {
      return NextResponse.json(
        {
          success: false,
          error:
            candidatesError.message,
        },
        { status: 500 }
      );
    }

    const candidateList =
      (candidates || []) as Candidate[];

    if (
      candidateList.length === 0
    ) {
      return NextResponse.json({
        success: true,
        mode:
          "ai-processing-only",
        summary: {
          candidatesChecked: 0,
          validJobs: 0,
          rejectedCandidates: 0,
          jobsCreated: 0,
          errors: 0,
        },
        message:
          "No processed candidates are waiting for AI processing.",
        quota: {
          dailyRequestLimit:
            dailyLimit,
          requestsUsed:
            requestCount,
          requestsRemaining:
            Math.max(
              dailyLimit -
                requestCount,
              0
            ),
        },
      });
    }

    let validJobs = 0;
    let rejectedCandidates = 0;
    let jobsCreated = 0;
    let errors = 0;

    const results: Array<
      Record<string, unknown>
    > = [];

    for (const candidate of candidateList) {
      try {
        /*
          This is the only place where Gemini is invoked.

          reserveAiRequest() runs immediately before every
          actual HTTP request to Gemini.
        */
        const aiJob =
          await callGemini(
            geminiApiKey,
            candidate,
            supabase
          );

        const isValid =
          aiJob.is_valid_job_record === true;

        /*
          HARD SAFETY CHECK:
          Invalid AI classifications can NEVER
          create a job record.
        */
        if (!isValid) {
          const rejectionReason =
            cleanString(
              aiJob.rejection_reason
            ) ||
            "Candidate does not contain a valid job or recruitment-related notification.";

          const {
            error:
              rejectionUpdateError,
          } = await supabase
            .from(
              "job_discovery_candidates"
            )
            .update({
              ai_valid_record:
                false,

              ai_rejection_reason:
                rejectionReason,

              ai_processed_at:
                new Date().toISOString(),

              created_job_id:
                null,

              last_error:
                null,
            })
            .eq(
              "id",
              candidate.id
            );

          if (
            rejectionUpdateError
          ) {
            throw rejectionUpdateError;
          }

          rejectedCandidates += 1;

          results.push({
            candidateId:
              candidate.id,

            success: true,

            classification:
              "rejected",

            reason:
              rejectionReason,
          });

          continue;
        }

        validJobs += 1;

        const company =
          cleanString(
            aiJob.company
          ) ||
          cleanString(
            aiJob.organization
          ) ||
          cleanString(
            candidate.source_name
          ) ||
          "Organization";

        const title =
          cleanString(
            aiJob.title
          ) ||
          cleanString(
            candidate.title
          ) ||
          "Untitled Job";

        const description =
          cleanString(
            aiJob.description
          ) ||
          "Job details extracted from the official source.";

        const skills =
          Array.isArray(
            aiJob.skills
          )
            ? aiJob.skills
                .filter(
                  (
                    skill
                  ): skill is string =>
                    typeof skill ===
                      "string" &&
                    skill.trim()
                      .length > 0
                )
                .map(
                  (
                    skill
                  ) =>
                    skill.trim()
                )
                .slice(
                  0,
                  20
                )
            : [];

        /*
          For an application link:
          prefer a URL explicitly extracted by AI.

          If none exists, the candidate page itself
          is retained as a safe fallback only when
          it is a valid HTTP(S) URL.
        */
        const extractedApplyUrl =
          isValidHttpUrl(
            aiJob.apply_url
          )
            ? aiJob.apply_url.trim()
            : null;

        const fallbackCandidateUrl =
          isValidHttpUrl(
            candidate.external_url
          )
            ? candidate.external_url
            : null;

        const applyUrl =
          extractedApplyUrl ||
          fallbackCandidateUrl;

        const providerLogoUrl =
          isValidHttpUrl(
            aiJob.provider_logo_url
          )
            ? aiJob.provider_logo_url.trim()
            : null;

        const experienceMin =
          cleanInteger(
            aiJob.experience_min
          );

        const experienceMax =
          cleanInteger(
            aiJob.experience_max
          );

        let experience:
          string | null = null;

        if (
          experienceMin !== null ||
          experienceMax !== null
        ) {
          if (
            experienceMin !== null &&
            experienceMax !== null
          ) {
            experience =
              `${experienceMin}-${experienceMax} years`;
          } else if (
            experienceMin !== null
          ) {
            experience =
              `${experienceMin}+ years`;
          } else if (
            experienceMax !== null
          ) {
            experience =
              `Up to ${experienceMax} years`;
          }
        }

        const jobPayload = {
          company,

          title,

          location:
            cleanString(
              aiJob.location
            ),

          type:
            cleanString(
              aiJob.employment_type
            ),

          experience,

          posted:
            "Recently discovered",

          category:
            cleanString(
              aiJob.job_category
            ) || "Other",

          skills,

          description,

          company_initial:
            company
              .charAt(0)
              .toUpperCase(),

          applyUrl:

            applyUrl,

          published:
            false,

          sector:
            cleanString(
              aiJob.sector
            ),

          job_category:
            cleanString(
              aiJob.job_category
            ),

          sub_category:
            cleanString(
              aiJob.sub_category
            ),

          government_level:
            cleanString(
              aiJob.government_level
            ),

          state:
            cleanString(
              aiJob.state
            ),

          state_code:
            cleanString(
              aiJob.state_code
            ),

          organization:
            cleanString(
              aiJob.organization
            ) || company,

          department:
            cleanString(
              aiJob.department
            ),

          ministry:
            cleanString(
              aiJob.ministry
            ),

          work_mode:
            cleanString(
              aiJob.work_mode
            ),

          employment_type:
            cleanString(
              aiJob.employment_type
            ),

          experience_min:
            experienceMin,

          experience_max:
            experienceMax,

          education:
            cleanString(
              aiJob.education
            ),

          salary_min:
            cleanNumber(
              aiJob.salary_min
            ),

          salary_max:
            cleanNumber(
              aiJob.salary_max
            ),

          salary_currency:
            cleanString(
              aiJob.salary_currency
            ) || "INR",

          vacancies:
            cleanInteger(
              aiJob.vacancies
            ),

          age_limit:
            cleanString(
              aiJob.age_limit
            ),

          age_relaxation:
            cleanString(
              aiJob.age_relaxation
            ),

          application_start:
            normalizeDate(
              aiJob.application_start
            ),

          application_deadline:
            normalizeDate(
              aiJob.application_deadline
            ),

          exam_date:
            normalizeDate(
              aiJob.exam_date
            ),

          notification_type:
            cleanString(
              aiJob.notification_type
            ),

          source_name:
            cleanString(
              candidate.source_name
            ) ||
            cleanString(
              aiJob.organization
            ) ||
            company,

          source_url:
            candidate.source_url,

          apply_url:
            applyUrl,

          provider_logo_url:
            providerLogoUrl,

          is_government:
            aiJob.sector ===
            "government",

          status:
            "needs_approval",

          approved_by:
            null,

          approved_at:
            null,

          published_at:
            null,

          verified_at:
            null,

          expires_at:
            null,
        };

        /*
          Final application-level guard:
          even if Gemini says valid, a title is
          still mandatory before creating a job.
        */
        if (!title.trim()) {
          throw new Error(
            "Valid candidate has no usable job title."
          );
        }

        const {
          data: createdJob,
          error: jobError,
        } = await supabase
          .from("jobs")
          .insert(jobPayload)
          .select("id")
          .single();

        if (
          jobError ||
          !createdJob
        ) {
          throw new Error(
            jobError?.message ||
              "Job was not created."
          );
        }

        const {
          error: sourceError,
        } = await supabase
          .from(
            "job_sources"
          )
          .insert([
            {
              job_id:
                createdJob.id,

              source_name:
                cleanString(
                  candidate.source_name
                ) ||
                "Official Source",

              source_url:
                candidate.source_url,

              source_role:
                "authoritative",

              source_type:
                aiJob.sector ===
                "private"
                  ? "private"
                  : aiJob.sector ===
                    "psu"
                  ? "psu"
                  : "government",

              is_primary:
                true,
            },

            {
              job_id:
                createdJob.id,

              source_name:
                cleanString(
                  candidate.source_name
                ) ||
                "Official Source",

              source_url:
                candidate.external_url,

              source_role:
                "application",

              source_type:
                aiJob.sector ===
                "private"
                  ? "private"
                  : aiJob.sector ===
                    "psu"
                  ? "psu"
                  : "government",

              is_primary:
                false,
            },
          ]);

        if (sourceError) {
          await supabase
            .from("jobs")
            .delete()
            .eq(
              "id",
              createdJob.id
            );

          throw new Error(
            `Job source could not be saved: ${sourceError.message}`
          );
        }

        const {
          error:
            candidateUpdateError,
        } = await supabase
          .from(
            "job_discovery_candidates"
          )
          .update({
            ai_valid_record:
              true,

            ai_rejection_reason:
              null,

            ai_processed_at:
              new Date().toISOString(),

            created_job_id:
              createdJob.id,

            last_error:
              null,
          })
          .eq(
            "id",
            candidate.id
          );

        if (
          candidateUpdateError
        ) {
          await supabase
            .from(
              "job_sources"
            )
            .delete()
            .eq(
              "job_id",
              createdJob.id
            );

          await supabase
            .from("jobs")
            .delete()
            .eq(
              "id",
              createdJob.id
            );

          throw new Error(
            `Candidate could not be marked as AI processed: ${candidateUpdateError.message}`
          );
        }

        jobsCreated += 1;

        results.push({
          candidateId:
            candidate.id,

          jobId:
            createdJob.id,

          classification:
            "valid-job",

          title,

          status:
            "needs_approval",

          success:
            true,
        });
      } catch (candidateError) {
        errors += 1;

        const message =
          candidateError instanceof Error
            ? candidateError.message
            : "Unknown AI processing error.";

        await supabase
          .from(
            "job_discovery_candidates"
          )
          .update({
            last_error:
              message,
          })
          .eq(
            "id",
            candidate.id
          );

        results.push({
          candidateId:
            candidate.id,

          success:
            false,

          error:
            message,
        });
      }
    }

    /*
      Read final usage after processing so the response shows
      the actual number of Gemini attempts used today.
    */
    const {
      data: finalUsage,
      error: finalUsageError,
    } = await supabase
      .from("job_ai_usage")
      .select(
        "usage_date, request_count"
      )
      .eq(
        "usage_date",
        new Date().toISOString().slice(0, 10)
      )
      .maybeSingle();

    if (finalUsageError) {
      return NextResponse.json({
        success: true,
        mode:
          "ai-processing-only",
        summary: {
          candidatesChecked:
            candidateList.length,

          validJobs,

          rejectedCandidates,

          jobsCreated,

          errors,
        },
        results,
        quota: {
          dailyRequestLimit:
            dailyLimit,

          requestsUsed:
            "unavailable",

          requestsRemaining:
            "unavailable",
        },
      });
    }

    const finalRequestCount =
      Number.isInteger(
        finalUsage?.request_count
      )
        ? finalUsage.request_count
        : 0;

    return NextResponse.json({
      success: true,

      mode:
        "ai-processing-only",

      summary: {
        candidatesChecked:
          candidateList.length,

        validJobs,

        rejectedCandidates,

        jobsCreated,

        errors,
      },

      results,

      quota: {
        model:
          GEMINI_MODEL,

        dailyRequestLimit:
          dailyLimit,

        requestsUsed:
          finalRequestCount,

        requestsRemaining:
          Math.max(
            dailyLimit -
              finalRequestCount,
            0
          ),

        maxCandidatesPerRun:
          maxCandidatesPerRun,
      },

      timestamp:
        new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected AI processing error.",
      },
      { status: 500 }
    );
  }
}