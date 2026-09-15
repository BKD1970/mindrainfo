import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Candidate = {
  id: number;
  source_registry_id: number;
  source_name: string;
  source_url: string;
  external_url: string;
  title: string;
  processing_status: string;
  duplicate_of_job_id: number | null;
  duplicate_of_candidate_id: number | null;
  created_job_id: number | null;
  ai_valid_record: boolean | null;
};

type Job = {
  id: number;
  title: string | null;
  company: string | null;
};

type JobSource = {
  id: number;
  job_id: number;
  source_name: string;
  source_url: string;
  source_type: string | null;
  source_role: string | null;
  is_primary: boolean;
};

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function normalizeUrl(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);

    url.hash = "";

    url.hostname = url.hostname.toLowerCase();

    if (
      (url.protocol === "https:" &&
        url.port === "443") ||
      (url.protocol === "http:" &&
        url.port === "80")
    ) {
      url.port = "";
    }

    return url.toString();
  } catch {
    return value
      .trim()
      .toLowerCase()
      .replace(/#.*$/, "");
  }
}

function normalizeTitle(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSourceRole(
  sourceUrl: string,
  sourceName: string
) {
  const url = sourceUrl.toLowerCase();
  const name = sourceName.toLowerCase();

  if (
    url.includes("apply") ||
    url.includes("registration") ||
    url.includes("register") ||
    url.includes("ibpsreg.") ||
    name.includes("registration") ||
    name.includes("application")
  ) {
    return "application";
  }

  return "discovery";
}

function getSourceType(
  sourceName: string
) {
  const value = sourceName.toLowerCase();

  if (
    value.includes("employment news") ||
    value.includes("upsc") ||
    value.includes("ssc") ||
    value.includes("railway") ||
    value.includes("ibps") ||
    value.includes("drdo") ||
    value.includes("government")
  ) {
    return "government";
  }

  return "private";
}

async function addSourceToJob(
  supabase: ReturnType<typeof getAdminSupabase>,
  jobId: number,
  sourceName: string,
  sourceUrl: string
) {
  const normalizedUrl = normalizeUrl(sourceUrl);

  const { data: existingSources, error: sourceLookupError } =
    await supabase
      .from("job_sources")
      .select(
        "id, job_id, source_name, source_url, source_type, source_role, is_primary"
      )
      .eq("job_id", jobId);

  if (sourceLookupError) {
    throw new Error(
      `Could not inspect existing job sources: ${sourceLookupError.message}`
    );
  }

  const alreadyAttached = (
    (existingSources ?? []) as JobSource[]
  ).some(
    (source) =>
      normalizeUrl(source.source_url) === normalizedUrl
  );

  if (alreadyAttached) {
    return {
      inserted: false,
      alreadyAttached: true,
    };
  }

  const sourceRole = getSourceRole(
    sourceUrl,
    sourceName
  );

  const { error: insertError } = await supabase
    .from("job_sources")
    .insert({
      job_id: jobId,
      source_name: sourceName.trim(),
      source_url: sourceUrl.trim(),
      source_type: getSourceType(sourceName),
      source_role: sourceRole,
      is_primary: false,
    });

  if (insertError) {
    throw new Error(
      `Could not attach source to job: ${insertError.message}`
    );
  }

  return {
    inserted: true,
    alreadyAttached: false,
  };
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      {
        error: "CRON_SECRET is not configured.",
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
        error: "Unauthorized.",
      },
      { status: 401 }
    );
  }

  try {
    const supabase = getAdminSupabase();

    const { data: candidates, error: candidateError } =
  await supabase
    .from("job_discovery_candidates")
    .select(
      `
        id,
        source_registry_id,
        source_name,
        source_url,
        external_url,
        title,
        processing_status,
        duplicate_of_job_id,
        duplicate_of_candidate_id,
        created_job_id,
        ai_valid_record
      `
    )
    .eq("processing_status", "processed")
    .is("created_job_id", null)
    .is("duplicate_of_job_id", null)
    .or("ai_valid_record.is.null,ai_valid_record.eq.true")
    .order("discovered_at", {
      ascending: true,
    })
    .limit(100);

    if (candidateError) {
      return NextResponse.json(
        {
          error: candidateError.message,
        },
        { status: 500 }
      );
    }

    const candidateRows =
      (candidates ?? []) as Candidate[];

    if (candidateRows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No mergeable candidates found.",
        checked: 0,
        merged: 0,
        unmatched: 0,
      });
    }

    const { data: jobs, error: jobsError } =
      await supabase
        .from("jobs")
        .select(
          "id, title, company"
        );

    if (jobsError) {
      return NextResponse.json(
        {
          error: jobsError.message,
        },
        { status: 500 }
      );
    }

    const jobRows =
      (jobs ?? []) as Job[];

    const { data: allSources, error: sourceError } =
      await supabase
        .from("job_sources")
        .select(
          "id, job_id, source_name, source_url, source_type, source_role, is_primary"
        );

    if (sourceError) {
      return NextResponse.json(
        {
          error: sourceError.message,
        },
        { status: 500 }
      );
    }

    const sourceRows =
      (allSources ?? []) as JobSource[];

    const sourceJobMap =
      new Map<string, number>();

    for (const source of sourceRows) {
      const normalized =
        normalizeUrl(source.source_url);

      if (
        normalized &&
        !sourceJobMap.has(normalized)
      ) {
        sourceJobMap.set(
          normalized,
          source.job_id
        );
      }
    }

    const titleJobMap =
      new Map<string, number[]>();

    for (const job of jobRows) {
      const title =
        normalizeTitle(job.title);

      if (!title) {
        continue;
      }

      const current =
        titleJobMap.get(title) ?? [];

      current.push(job.id);

      titleJobMap.set(
        title,
        current
      );
    }

    let merged = 0;
    let unmatched = 0;
    let skipped = 0;

    const results: Array<{
      candidate_id: number;
      action: string;
      job_id: number | null;
      reason: string;
    }> = [];

    for (const candidate of candidateRows) {
      const candidateExternalUrl =
        normalizeUrl(
          candidate.external_url
        );

      const candidateSourceUrl =
        normalizeUrl(
          candidate.source_url
        );

      let matchedJobId:
        | number
        | null = null;

      let reason = "";

      if (
        candidateExternalUrl &&
        sourceJobMap.has(
          candidateExternalUrl
        )
      ) {
        matchedJobId =
          sourceJobMap.get(
            candidateExternalUrl
          ) ?? null;

        reason =
          "Exact application/source URL match.";
      }

      if (
        matchedJobId === null &&
        candidateSourceUrl &&
        sourceJobMap.has(
          candidateSourceUrl
        )
      ) {
        matchedJobId =
          sourceJobMap.get(
            candidateSourceUrl
          ) ?? null;

        reason =
          "Exact discovery/source URL match.";
      }

      /*
       * Phase 1 deliberately does NOT auto-merge by
       * title alone. Generic or slightly different
       * recruitment titles could otherwise merge
       * different recruitments incorrectly.
       */
      if (matchedJobId === null) {
        const normalizedCandidateTitle =
          normalizeTitle(
            candidate.title
          );

        const possibleJobs =
          titleJobMap.get(
            normalizedCandidateTitle
          ) ?? [];

        if (
          possibleJobs.length === 1 &&
          normalizedCandidateTitle.length >= 20
        ) {
          matchedJobId =
            possibleJobs[0];

          reason =
            "Exact normalized title match.";
        }
      }

      if (matchedJobId === null) {
        unmatched++;

        results.push({
          candidate_id: candidate.id,
          action: "unmatched",
          job_id: null,
          reason:
            "No deterministic match found.",
        });

        continue;
      }

      try {
        const attachExternal =
          candidate.external_url.trim();

        const attachSource =
          candidate.source_url.trim();

        if (attachExternal) {
          const result =
            await addSourceToJob(
              supabase,
              matchedJobId,
              candidate.source_name,
              attachExternal
            );

          if (
            result.alreadyAttached &&
            attachSource
          ) {
            await addSourceToJob(
              supabase,
              matchedJobId,
              candidate.source_name,
              attachSource
            );
          }
        }

        if (
          attachSource &&
          normalizeUrl(
            attachSource
          ) !==
            normalizeUrl(
              attachExternal
            )
        ) {
          await addSourceToJob(
            supabase,
            matchedJobId,
            candidate.source_name,
            attachSource
          );
        }

        const {
          error: updateError,
        } = await supabase
          .from("job_discovery_candidates")
          .update({
            duplicate_of_job_id:
              matchedJobId,
            processing_status:
              "duplicate",
            processed_at:
              new Date().toISOString(),
            last_error: null,
          })
          .eq("id", candidate.id);

        if (updateError) {
          throw new Error(
            `Could not update candidate ${candidate.id}: ${updateError.message}`
          );
        }

        merged++;

        results.push({
          candidate_id: candidate.id,
          action: "merged",
          job_id: matchedJobId,
          reason,
        });
      } catch (error) {
        skipped++;

        results.push({
          candidate_id: candidate.id,
          action: "error",
          job_id: matchedJobId,
          reason:
            error instanceof Error
              ? error.message
              : "Unknown merge error.",
        });
      }
    }

    /*
     * These variables are intentionally calculated but
     * not used for title-only broad matching beyond the
     * conservative exact-match rule above.
     */
    void titleJobMap;

    return NextResponse.json({
      success: true,
      checked: candidateRows.length,
      merged,
      unmatched,
      skipped,
      results,
    });
  } catch (error) {
    console.error(
      "Job source merge error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected merge error.",
      },
      { status: 500 }
    );
  }
}
