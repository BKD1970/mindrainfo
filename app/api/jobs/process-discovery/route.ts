import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  ai_valid_record: boolean | null;
};

type ExistingJob = {
  id: number;
  company: string | null;
  title: string | null;
  apply_url: string | null;
  source_url: string | null;
};

type JobSource = {
  id: number;
  job_id: number;
  source_name: string | null;
  source_url: string | null;
  source_role: string | null;
  is_primary: boolean | null;
};

function normalizeText(value: string | null | undefined): string {
  return (value || "")
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function normalizeUrl(value: string | null | undefined): string {
  if (!value) return "";

  try {
    const url = new URL(value.trim());

    const removableParams = new Set([
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
      "mc_cid",
      "mc_eid",
    ]);

    [...url.searchParams.keys()].forEach((key) => {
      if (removableParams.has(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    });

    url.hash = "";

    const normalizedPath =
      url.pathname.length > 1
        ? url.pathname.replace(/\/+$/, "")
        : url.pathname;

    return `${url.protocol}//${url.host}${normalizedPath}${
      url.search ? `?${url.searchParams.toString()}` : ""
    }`.toLowerCase();
  } catch {
    return value.trim().toLowerCase().replace(/\/+$/, "");
  }
}

function hashCandidate(candidate: Candidate): string {
  const source = `${normalizeUrl(candidate.external_url)}|${normalizeText(
    candidate.title
  )}|${normalizeText(candidate.raw_content).slice(0, 5000)}`;

  return crypto.createHash("sha256").update(source).digest("hex");
}

function isStrongTitleMatch(
  candidateTitle: string | null,
  jobTitle: string | null,
  candidateCompany: string | null,
  jobCompany: string | null
): boolean {
  const titleA = normalizeText(candidateTitle);
  const titleB = normalizeText(jobTitle);

  if (!titleA || !titleB || titleA !== titleB) {
    return false;
  }

  const companyA = normalizeText(candidateCompany);
  const companyB = normalizeText(jobCompany);

  if (!companyA || !companyB) {
    return false;
  }

  return companyA === companyB;
}

/**
 * Phase 1 deterministic merge.
 *
 * Important:
 * - Zero Gemini requests.
 * - Rejected AI candidates are ignored.
 * - Matching is based only on candidate.external_url
 *   against existing job_sources.source_url.
 * - candidate.source_url is NOT used to identify the job because one
 *   discovery page can represent many different jobs.
 */
async function runPhase1Merge(
  supabase: any,
  candidatesToMerge: Candidate[]
): Promise<{
  merged: number;
  skipped: number;
  errors: number;
}> {
  let merged = 0;
  let skipped = 0;
  let errors = 0;

  if (candidatesToMerge.length === 0) {
    return {
      merged: 0,
      skipped: 0,
      errors: 0,
    };
  }

  const { data: jobSources, error: jobSourcesError } = await supabase
    .from("job_sources")
    .select(
      "id, job_id, source_name, source_url, source_role, is_primary"
    );

  if (jobSourcesError) {
    throw jobSourcesError;
  }

  const sources = (jobSources || []) as JobSource[];

  /**
   * Map normalized source URL -> unique job IDs.
   *
   * A URL that belongs to more than one job is treated as ambiguous
   * and will not be merged.
   */
  const sourceUrlToJobIds = new Map<string, Set<number>>();

  for (const source of sources) {
    const normalizedSourceUrl = normalizeUrl(source.source_url);

    if (!normalizedSourceUrl) {
      continue;
    }

    if (!sourceUrlToJobIds.has(normalizedSourceUrl)) {
      sourceUrlToJobIds.set(normalizedSourceUrl, new Set<number>());
    }

    sourceUrlToJobIds.get(normalizedSourceUrl)!.add(source.job_id);
  }

  /**
   * Keep track of source URLs already attached to each job so we
   * never create duplicate job_sources rows.
   */
  const existingUrlsByJob = new Map<number, Set<string>>();

  for (const source of sources) {
    const normalizedSourceUrl = normalizeUrl(source.source_url);

    if (!normalizedSourceUrl) {
      continue;
    }

    if (!existingUrlsByJob.has(source.job_id)) {
      existingUrlsByJob.set(source.job_id, new Set<string>());
    }

    existingUrlsByJob.get(source.job_id)!.add(normalizedSourceUrl);
  }

  for (const candidate of candidatesToMerge) {
    try {
      /**
       * Candidates explicitly rejected by Gemini must never be merged.
       */
      if (candidate.ai_valid_record === false) {
        skipped += 1;
        continue;
      }

      const candidateExternalUrl = normalizeUrl(candidate.external_url);

      if (!candidateExternalUrl) {
        skipped += 1;
        continue;
      }

      const matchingJobIds =
        sourceUrlToJobIds.get(candidateExternalUrl);

      /**
       * No exact match or ambiguous match:
       * do not guess in Phase 1.
       */
      if (!matchingJobIds || matchingJobIds.size !== 1) {
        skipped += 1;
        continue;
      }

      const matchedJobId = [...matchingJobIds][0];

      if (!existingUrlsByJob.has(matchedJobId)) {
        existingUrlsByJob.set(matchedJobId, new Set<string>());
      }

      const jobExistingUrls =
        existingUrlsByJob.get(matchedJobId)!;

      const sourceRowsToInsert: Array<{
        job_id: number;
        source_name: string;
        source_url: string;
        source_role: string;
        is_primary: boolean;
      }> = [];

      /**
       * Attach the discovery source if it is not already stored.
       */
      const candidateSourceUrl = normalizeUrl(candidate.source_url);

      if (
        candidateSourceUrl &&
        !jobExistingUrls.has(candidateSourceUrl)
      ) {
        sourceRowsToInsert.push({
          job_id: matchedJobId,
          source_name:
            candidate.source_name || "MindraInfo Discovery Source",
          source_url: candidate.source_url,
          source_role: "discovery",
          is_primary: false,
        });

        jobExistingUrls.add(candidateSourceUrl);
      }

      /**
       * Attach the exact external/application URL if it is not
       * already stored.
       */
      if (
        candidateExternalUrl &&
        !jobExistingUrls.has(candidateExternalUrl)
      ) {
        sourceRowsToInsert.push({
          job_id: matchedJobId,
          source_name:
            candidate.source_name || "MindraInfo Discovery Source",
          source_url: candidate.external_url,
          source_role: "application",
          is_primary: false,
        });

        jobExistingUrls.add(candidateExternalUrl);
      }

      /**
       * The explicit `any` Supabase client type prevents the
       * TypeScript generic inference error here while keeping the
       * actual Supabase operation unchanged.
       */
      if (sourceRowsToInsert.length > 0) {
        const { error: sourceInsertError } = await supabase
          .from("job_sources")
          .insert(sourceRowsToInsert as any);

        if (sourceInsertError) {
          throw sourceInsertError;
        }
      }

      /**
       * Mark candidate as a duplicate of the existing job.
       *
       * We deliberately do not modify:
       * - ai_valid_record
       * - ai_processed_at
       * - created_job_id
       */
      const { error: candidateUpdateError } = await supabase
        .from("job_discovery_candidates")
        .update({
          processing_status: "duplicate",
          duplicate_of_job_id: matchedJobId,
          processed_at: new Date().toISOString(),
          last_error: null,
        } as any)
        .eq("id", candidate.id);

      if (candidateUpdateError) {
        throw candidateUpdateError;
      }

      merged += 1;
    } catch (candidateError) {
      errors += 1;

      const message =
        candidateError instanceof Error
          ? candidateError.message
          : "Unknown Phase 1 merge error.";

      /**
       * Record the error but do not crash the entire batch.
       */
      await supabase
        .from("job_discovery_candidates")
        .update({
          last_error: message,
        } as any)
        .eq("id", candidate.id);
    }
  }

  return {
    merged,
    skipped,
    errors,
  };
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!cronSecret) {
    return NextResponse.json(
      {
        success: false,
        error: "CRON_SECRET is not configured.",
      },
      { status: 500 }
    );
  }

  if (!serviceRoleKey) {
    return NextResponse.json(
      {
        success: false,
        error: "SUPABASE_SERVICE_ROLE_KEY is not configured.",
      },
      { status: 500 }
    );
  }

  if (!supabaseUrl) {
    return NextResponse.json(
      {
        success: false,
        error: "NEXT_PUBLIC_SUPABASE_URL is not configured.",
      },
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized.",
      },
      { status: 401 }
    );
  }

  /**
   * Typed as `any` so the existing processing code and the new Phase 1
   * helper do not trigger Supabase generic inference errors.
   */
  const supabase: any = createClient(
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
    const { data: candidates, error: candidatesError } =
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
            raw_content,
            content_hash,
            processing_status,
            ai_valid_record
          `
        )
        .eq("processing_status", "new")
        .order("discovered_at", { ascending: true })
        .limit(100);

    if (candidatesError) {
      return NextResponse.json(
        {
          success: false,
          error: candidatesError.message,
        },
        { status: 500 }
      );
    }

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({
        success: true,
        mode: "processing-only",
        summary: {
          candidatesChecked: 0,
          processed: 0,
          duplicates: 0,
          existingJobMatches: 0,
          errors: 0,
          phase1Merged: 0,
          phase1Skipped: 0,
          phase1Errors: 0,
        },
      });
    }

    const { data: existingJobs, error: jobsError } =
      await supabase
        .from("jobs")
        .select("id, company, title, apply_url, source_url");

    if (jobsError) {
      return NextResponse.json(
        {
          success: false,
          error: jobsError.message,
        },
        { status: 500 }
      );
    }

    const jobs = (existingJobs || []) as ExistingJob[];
    const candidateList = candidates as Candidate[];

    const seenUrls = new Map<string, number>();
    const seenHashes = new Map<string, number>();

    /**
     * Only candidates that became "processed" in this execution
     * are sent through Phase 1.
     *
     * This prevents already-processed or AI-rejected candidates from
     * being unexpectedly reprocessed.
     */
    const candidatesProcessedThisRun: Candidate[] = [];

    let processed = 0;
    let duplicates = 0;
    let existingJobMatches = 0;
    let errors = 0;

    for (const candidate of candidateList) {
      try {
        const normalizedExternalUrl = normalizeUrl(
          candidate.external_url
        );

        const generatedHash = hashCandidate(candidate);

        const duplicateCandidateId =
          seenUrls.get(normalizedExternalUrl) ||
          seenHashes.get(generatedHash) ||
          null;

        if (duplicateCandidateId) {
          const { error: duplicateUpdateError } =
            await supabase
              .from("job_discovery_candidates")
              .update({
                processing_status: "duplicate",
                duplicate_of_candidate_id:
                  duplicateCandidateId,
                processed_at: new Date().toISOString(),
                content_hash:
                  candidate.content_hash || generatedHash,
                last_error: null,
              } as any)
              .eq("id", candidate.id);

          if (duplicateUpdateError) {
            throw duplicateUpdateError;
          }

          duplicates += 1;
          continue;
        }

        seenUrls.set(normalizedExternalUrl, candidate.id);
        seenHashes.set(generatedHash, candidate.id);

        let matchedJob: ExistingJob | null = null;

        for (const job of jobs) {
          const candidateUrl = normalizedExternalUrl;
          const jobApplyUrl = normalizeUrl(job.apply_url);
          const jobSourceUrl = normalizeUrl(job.source_url);

          if (
            candidateUrl &&
            (candidateUrl === jobApplyUrl ||
              candidateUrl === jobSourceUrl)
          ) {
            matchedJob = job;
            break;
          }
        }

        if (!matchedJob) {
          const candidateTitle = normalizeText(candidate.title);

          for (const job of jobs) {
            if (
              candidateTitle &&
              isStrongTitleMatch(
                candidate.title,
                job.title,
                candidate.source_name,
                job.company
              )
            ) {
              matchedJob = job;
              break;
            }
          }
        }

        if (matchedJob) {
          const {
            error: existingJobUpdateError,
          } = await supabase
            .from("job_discovery_candidates")
            .update({
              processing_status: "duplicate",
              duplicate_of_job_id: matchedJob.id,
              processed_at: new Date().toISOString(),
              content_hash:
                candidate.content_hash || generatedHash,
              last_error: null,
            } as any)
            .eq("id", candidate.id);

          if (existingJobUpdateError) {
            throw existingJobUpdateError;
          }

          existingJobMatches += 1;
          duplicates += 1;
          continue;
        }

        const { error: processedUpdateError } =
          await supabase
            .from("job_discovery_candidates")
            .update({
              processing_status: "processed",
              processed_at: new Date().toISOString(),
              content_hash:
                candidate.content_hash || generatedHash,
              last_error: null,
            } as any)
            .eq("id", candidate.id);

        if (processedUpdateError) {
          throw processedUpdateError;
        }

        candidatesProcessedThisRun.push(candidate);
        processed += 1;
      } catch (candidateError) {
        errors += 1;

        const message =
          candidateError instanceof Error
            ? candidateError.message
            : "Unknown processing error.";

        await supabase
          .from("job_discovery_candidates")
          .update({
            processing_status: "error",
            last_error: message,
          } as any)
          .eq("id", candidate.id);
      }
    }

    /**
     * Phase 1 deterministic multi-source merge.
     *
     * ZERO Gemini requests.
     */
    const phase1Result = await runPhase1Merge(
      supabase,
      candidatesProcessedThisRun
    );

    return NextResponse.json({
      success: true,
      mode: "processing-only",
      summary: {
        candidatesChecked: candidateList.length,
        processed: processed - phase1Result.merged,
        duplicates: duplicates + phase1Result.merged,
        existingJobMatches,
        errors,
        phase1Merged: phase1Result.merged,
        phase1Skipped: phase1Result.skipped,
        phase1Errors: phase1Result.errors,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected processing error.",
      },
      { status: 500 }
    );
  }
}