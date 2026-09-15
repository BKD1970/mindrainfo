import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SourceRegistry = {
  id: number;
  source_name: string;
  source_type: string;
  source_scope: string | null;
  state_code: string | null;
  source_url: string;
  collection_method: string;
  active: boolean;
  permitted_to_collect: boolean;
  priority: number;
  parser_key: string | null;
};

type DiscoveredCandidate = {
  external_url: string;
  title: string;
  raw_content: string;
};

const TARGET_PARSERS = new Set([
  "employment_news_all_jobs",
  "upsc_recruitment",
  "ssc_main",
  "drdo_vacancies",
  "ibps_recruitment",
]);

const MAX_CANDIDATES_PER_SOURCE = 15;

function getAdminSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

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

function normalizeUrl(
  href: string,
  baseUrl: string
) {
  try {
    const url = new URL(href, baseUrl);

    url.hash = "";

    return url.toString();
  } catch {
    return null;
  }
}

function cleanText(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanTitle(value: string) {
  return cleanText(value)
    .replace(/\s+/g, " ")
    .trim();
}

function createContentHash(
  title: string,
  url: string,
  rawContent: string
) {
  return createHash("sha256")
    .update(
      `${title}\n${url}\n${rawContent}`
    )
    .digest("hex");
}

function isUsefulLink(
  url: string,
  sourceUrl: string
) {
  try {
    const candidate = new URL(url);
    const source = new URL(sourceUrl);

    if (
      candidate.protocol !== "http:" &&
      candidate.protocol !== "https:"
    ) {
      return false;
    }

    if (
      candidate.hostname !==
      source.hostname
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function extractLinks(
  html: string,
  source: SourceRegistry
) {
  const results: DiscoveredCandidate[] =
    [];

  const anchorRegex =
    /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match: RegExpExecArray | null;

  while (
    (match =
      anchorRegex.exec(html)) !== null
  ) {
    const href = match[1];
    const anchorHtml = match[2];

    const url = normalizeUrl(
      href,
      source.source_url
    );

    if (!url) {
      continue;
    }

    const isAllowedIbpsRegistrationLink =
      source.parser_key ===
        "ibps_recruitment" &&
      new URL(url).hostname ===
        "ibpsreg.ibps.in";

    if (
      !isAllowedIbpsRegistrationLink &&
      !isUsefulLink(
        url,
        source.source_url
      )
    ) {
      continue;
    }

    const title =
      cleanTitle(anchorHtml);

    if (!title || title.length < 4) {
      continue;
    }

    if (
      url === source.source_url
    ) {
      continue;
    }

    /*
     * EMPLOYMENT NEWS
     *
     * Collect job/detail links from the
     * Employment News listing area.
     */
    if (
      source.parser_key ===
      "employment_news_all_jobs"
    ) {
      const lowerUrl = url.toLowerCase();
      const lowerTitle = title.toLowerCase();

      const isWithinEmploymentNews =
        lowerUrl.includes("/newemp/");

      const isMainListing =
        lowerUrl.includes("alljobs.aspx");

      const blockedTerms = [
        "home",
        "about",
        "contact",
        "subscription",
        "subscribe",
        "publication",
        "book",
        "books",
        "career article",
        "web exclusive",
        "grievance",
        "policy",
        "amendment",
        "business policy",
        "discount structure",
      ];

      const hasBlockedTerm =
        blockedTerms.some(
          (term) =>
            lowerTitle.includes(term) ||
            lowerUrl.includes(term)
        );

      const isRelevant =
        isWithinEmploymentNews &&
        !isMainListing &&
        !hasBlockedTerm;

      if (!isRelevant) {
        continue;
      }
    }

    /*
     * UPSC
     *
     * Collect recruitment advertisement
     * pages and attached PDFs.
     */
    if (
      source.parser_key ===
      "upsc_recruitment"
    ) {
      const lowerUrl =
        url.toLowerCase();

      const lowerTitle =
        title.toLowerCase();

      const isPdf =
        lowerUrl.endsWith(".pdf") ||
        lowerUrl.includes(".pdf?");

      const isRelevant =
        isPdf ||
        lowerTitle.includes(
          "advertisement"
        ) ||
        lowerTitle.includes(
          "recruitment"
        ) ||
        lowerUrl.includes(
          "/recruitment/"
        );

      if (!isRelevant) {
        continue;
      }
    }

    /*
     * SSC
     *
     * The current SSC notice board uses
     * attachment URLs for PDFs.
     */
    if (
      source.parser_key ===
      "ssc_main"
    ) {
      const lowerUrl =
        url.toLowerCase();

      const lowerTitle =
        title.toLowerCase();

      const isAttachment =
        lowerUrl.includes(
          "/api/attachment/"
        );

      const isRelevantText =
        lowerTitle.includes(
          "notice"
        ) ||
        lowerTitle.includes(
          "recruitment"
        ) ||
        lowerTitle.includes(
          "result"
        ) ||
        lowerTitle.includes(
          "answer key"
        ) ||
        lowerTitle.includes(
          "admit card"
        ) ||
        lowerTitle.includes(
          "vacanc"
        ) ||
        lowerTitle.includes(
          "examination"
        );

      if (
        !isAttachment &&
        !isRelevantText
      ) {
        continue;
      }
    }

    /*
     * DRDO
     *
     * Collect individual vacancy detail
     * pages, not the main listing/archive.
     */
    if (
      source.parser_key ===
      "drdo_vacancies"
    ) {
      const lowerUrl =
        url.toLowerCase();

      const lowerTitle =
        title.toLowerCase();

      const isVacancyPage =
        lowerUrl.includes(
          "/drdo/offerings/vacancies"
        );

      const isListingPage =
        lowerUrl.endsWith(
          "/vacancies"
        ) ||
        lowerUrl.endsWith(
          "/vacancies/"
        ) ||
        lowerUrl.includes(
          "page="
        );

      const isArchive =
        lowerUrl.includes(
          "/archive"
        ) ||
        lowerTitle.includes(
          "archive"
        );

      const recruitmentWords = [
        "recruit",
        "vacanc",
        "application",
        "internship",
        "apprentice",
        "fellowship",
        "jrf",
        "research associate",
        "walk in",
        "engagement",
        "post of",
      ];

      const looksLikeRecruitment =
        recruitmentWords.some(
          (word) =>
            lowerTitle.includes(word)
        );

      const isVacancyDetail =
        isVacancyPage &&
        !isListingPage &&
        !isArchive &&
        looksLikeRecruitment;

      if (!isVacancyDetail) {
        continue;
      }
    }

    /*
     * IBPS
     *
     * Collect specific recruitment/application
     * pages from the official IBPS website.
     */
    if (
      source.parser_key ===
      "ibps_recruitment"
    ) {
      const lowerUrl =
        url.toLowerCase();

      const lowerTitle =
        title.toLowerCase();

      const isOfficialIbps =
        lowerUrl.includes(
          "ibpsreg.ibps.in/"
        ) ||
        lowerUrl.includes(
          "ibps.in/"
        );

      const recruitmentWords = [
        "recruitment",
        "officer",
        "assistant",
        "specialist",
        "probationary",
        "customer service",
        "scale",
        "clerk",
        "security",
        "manager",
        "application",
      ];

      const looksLikeRecruitment =
        recruitmentWords.some(
          (word) =>
            lowerTitle.includes(word) ||
            lowerUrl.includes(word)
        );

      const isRelevant =
        isOfficialIbps &&
        looksLikeRecruitment;

      if (!isRelevant) {
        continue;
      }
    }

    /*
     * Avoid duplicate URLs in the same
     * source response.
     */
    if (
      results.some(
        (item) =>
          item.external_url ===
          url
      )
    ) {
      continue;
    }

    results.push({
      external_url: url,
      title,
      raw_content:
        `${title}\nSource: ${source.source_name}\nDiscovered from: ${source.source_url}`,
    });

    if (
      results.length >=
      MAX_CANDIDATES_PER_SOURCE
    ) {
      break;
    }
  }

  return results;
}

async function fetchSource(
  source: SourceRegistry
) {
  const response =
    await fetch(
      source.source_url,
      {
        method: "GET",
        headers: {
          "User-Agent":
            "MindraInfoJobsBot/1.0 (+https://mindrainfo.in/jobs)",
          Accept:
            "text/html,application/xhtml+xml",
        },
        cache: "no-store",
        signal:
          AbortSignal.timeout(
            15000
          ),
      }
    );

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText}`
    );
  }

  const contentType =
    response.headers.get(
      "content-type"
    ) ?? "";

  if (
    !contentType.includes("text/html") &&
    !contentType.includes(
      "application/xhtml+xml"
    )
  ) {
    throw new Error(
      `Unsupported content type: ${contentType}`
    );
  }

  return response.text();
}

async function updateSourceSuccess(
  supabase: ReturnType<
    typeof getAdminSupabase
  >,
  sourceId: number
) {
  const now =
    new Date().toISOString();

  await supabase
    .from("job_sources_registry")
    .update({
      last_checked_at: now,
      last_success_at: now,
      last_error: null,
      updated_at: now,
    })
    .eq("id", sourceId);
}

async function updateSourceError(
  supabase: ReturnType<
    typeof getAdminSupabase
  >,
  sourceId: number,
  message: string
) {
  await supabase
    .from("job_sources_registry")
    .update({
      last_checked_at:
        new Date().toISOString(),
      last_error:
        message.slice(0, 1000),
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", sourceId);
}

async function processSource(
  supabase: ReturnType<
    typeof getAdminSupabase
  >,
  source: SourceRegistry
) {
  const html =
    await fetchSource(source);

  const candidates =
    extractLinks(
      html,
      source
    );

  let inserted = 0;
  let duplicates = 0;

  for (const candidate of candidates) {
    const contentHash =
      createContentHash(
        candidate.title,
        candidate.external_url,
        candidate.raw_content
      );

    const {
      error,
    } = await supabase
      .from(
        "job_discovery_candidates"
      )
      .insert({
        source_registry_id:
          source.id,

        source_name:
          source.source_name,

        source_url:
          source.source_url,

        external_url:
          candidate.external_url,

        title:
          candidate.title,

        raw_content:
          candidate.raw_content,

        content_hash:
          contentHash,

        processing_status:
          "new",
      });

    if (error) {
      /*
       * PostgreSQL unique violation means
       * this source URL is already known.
       */
      if (
        error.code ===
        "23505"
      ) {
        duplicates++;
        continue;
      }

      throw new Error(
        `Candidate insert failed: ${error.message}`
      );
    }

    inserted++;
  }

  return {
    discovered:
      candidates.length,
    inserted,
    duplicates,
  };
}

export async function GET(
  request: NextRequest
) {
  try {
    /*
     * CRON SECURITY
     */
    const cronSecret =
      process.env.CRON_SECRET;

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

    const authorization =
      request.headers.get(
        "authorization"
      );

    if (
      authorization !==
      `Bearer ${cronSecret}`
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const supabase =
      getAdminSupabase();

    /*
     * START / STOP DISCOVERY CONTROL
     *
     * enabled = true  -> normal discovery
     * enabled = false -> stop before any source is fetched
     */
    const {
      data: discoverySettings,
      error: discoverySettingsError,
    } = await supabase
      .from("job_discovery_settings")
      .select("enabled")
      .eq("id", 1)
      .maybeSingle();

    if (discoverySettingsError) {
      throw new Error(
        `Could not load discovery settings: ${discoverySettingsError.message}`
      );
    }

    /*
     * Fail safe:
     * If the control row does not exist, discovery is stopped.
     */
    const discoveryEnabled =
      discoverySettings?.enabled === true;

    if (!discoveryEnabled) {
      return NextResponse.json({
        success: true,
        mode: "discovery-stopped",
        message:
          "Job discovery is currently stopped by admin control.",
        summary: {
          sourcesChecked: 0,
          successfulSources: 0,
          failedSources: 0,
          discovered: 0,
          inserted: 0,
          duplicates: 0,
        },
        timestamp:
          new Date().toISOString(),
      });
    }

    /*
     * ONLY ACTIVE + PERMITTED SOURCES
     */
    const {
      data: sources,
      error: sourceError,
    } = await supabase
      .from(
        "job_sources_registry"
      )
      .select(
        "id, source_name, source_type, source_scope, state_code, source_url, collection_method, active, permitted_to_collect, priority, parser_key"
      )
      .eq(
        "active",
        true
      )
      .eq(
        "permitted_to_collect",
        true
      )
      .in(
        "parser_key",
        Array.from(
          TARGET_PARSERS
        )
      )
      .order(
        "priority",
        {
          ascending: true,
        }
      );

    if (sourceError) {
      throw new Error(
        `Could not load source registry: ${sourceError.message}`
      );
    }

    const results: Array<{
      source:
        string;
      success:
        boolean;
      discovered:
        number;
      inserted:
        number;
      duplicates:
        number;
      error?:
        string;
    }> = [];

    /*
     * PROCESS EACH SOURCE SEPARATELY
     */
    for (
      const source of
        (sources ??
          []) as SourceRegistry[]
    ) {
      if (
        !source.parser_key ||
        !TARGET_PARSERS.has(
          source.parser_key
        )
      ) {
        continue;
      }

      try {
        const result =
          await processSource(
            supabase,
            source
          );

        await updateSourceSuccess(
          supabase,
          source.id
        );

        results.push({
          source:
            source.source_name,
          success: true,
          ...result,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unknown source error";

        await updateSourceError(
          supabase,
          source.id,
          message
        );

        results.push({
          source:
            source.source_name,
          success: false,
          discovered: 0,
          inserted: 0,
          duplicates: 0,
          error: message,
        });
      }
    }

    const summary =
      results.reduce(
        (
          total,
          result
        ) => {
          total.sourcesChecked++;

          if (
            result.success
          ) {
            total.successfulSources++;
          } else {
            total.failedSources++;
          }

          total.discovered +=
            result.discovered;

          total.inserted +=
            result.inserted;

          total.duplicates +=
            result.duplicates;

          return total;
        },
        {
          sourcesChecked: 0,
          successfulSources: 0,
          failedSources: 0,
          discovered: 0,
          inserted: 0,
          duplicates: 0,
        }
      );

    return NextResponse.json({
      success: true,
      mode: "discovery-only",
      summary,
      results,
      timestamp:
        new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "JOB DISCOVERY ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}