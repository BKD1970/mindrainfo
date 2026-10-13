import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

/**
 * IMPORTANT:
 * The live non-www URL redirected to www during review. Keep this host
 * consistent with app/layout.tsx metadataBase, canonical tags, Vercel domain
 * redirects, internal links, and the property you use in Search Console.
 * If you intentionally choose the non-www host instead, change this value
 * and make every other canonical URL/redirect agree with that choice.
 */
const BASE_URL = "https://www.mindrainfo.in";

/** Refresh the generated sitemap periodically so published database content
 * can be discovered without requiring a deployment for every content change.
 */
export const revalidate = 3600;

type SitemapItem = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only include public, indexable URLs that are intended to appear in Search.
  // Before deploying, verify every manually listed route returns a successful
  // page response and is not noindex or canonicalized to a different URL.
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/career`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/data-analytics`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/ai`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/technology`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/jobs`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/tools`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/articles`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/shop`, changeFrequency: "weekly", priority: 0.8 },

    // Games and learning experiences
    { url: `${BASE_URL}/games`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/gyangokul`, changeFrequency: "monthly", priority: 0.7 },

    // AI topic pages
    { url: `${BASE_URL}/ai/tools`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/ai/generative-ai`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/ai/prompt-engineering`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/ai/automation`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/ai/careers`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/ai/machine-learning`, changeFrequency: "weekly", priority: 0.8 },

    // PDF tools. Keep only routes that really exist and return a successful
    // response on the public site. The editor URL must be rechecked after deploy.
    { url: `${BASE_URL}/tools/pdf`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/pdf-editor`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/compress`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/excel-to-pdf`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/pdf-to-excel`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/word-to-pdf`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/pdf-to-word`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/jpg-to-pdf`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/pdf-to-jpg`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/merge`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/organize`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/pdf-to-powerpoint`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/powerpoint-to-pdf`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/rotate`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/pdf/split`, changeFrequency: "monthly", priority: 0.8 },

    // Other standalone tool routes
    { url: `${BASE_URL}/tools/ai-prompt-helper`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/csv-viewer`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/image-compressor`, changeFrequency: "monthly", priority: 0.8 },
    // Corrected to match the route linked by the Tools page.
    { url: `${BASE_URL}/tools/json-formatter`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/mindrasave`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/text-formatter`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/word-counter`, changeFrequency: "monthly", priority: 0.8 },

    // Public policy page
    { url: `${BASE_URL}/crawling-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  let articlePages: MetadataRoute.Sitemap = [];
  let jobPages: MetadataRoute.Sitemap = [];
  let productPages: MetadataRoute.Sitemap = [];

  // Use independent settled requests so one failed Supabase query does not
  // prevent the other types of published pages from appearing in the sitemap.
  const results = await Promise.allSettled([
    supabase.from("articles").select("slug").eq("published", true),
    supabase.from("jobs").select("id").eq("published", true),
    supabase.from("products").select("slug").eq("published", true),
  ]);

  const articlesResult = results[0];
  if (articlesResult.status === "fulfilled") {
    if (articlesResult.value.error) {
      console.error("Sitemap: failed to load published articles:", articlesResult.value.error.message);
    } else {
      articlePages = (articlesResult.value.data ?? []).flatMap((article) => {
        const slug = typeof article.slug === "string" ? article.slug.trim() : "";
        if (!slug) return [];
        return [{
          url: `${BASE_URL}/articles/${encodeURIComponent(slug)}`,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }];
      });
    }
  } else {
    console.error("Sitemap: article query rejected:", articlesResult.reason);
  }

  const jobsResult = results[1];
  if (jobsResult.status === "fulfilled") {
    if (jobsResult.value.error) {
      console.error("Sitemap: failed to load published jobs:", jobsResult.value.error.message);
    } else {
      jobPages = (jobsResult.value.data ?? []).flatMap((job) => {
        if (job.id === null || job.id === undefined || String(job.id).trim() === "") return [];
        return [{
          url: `${BASE_URL}/jobs/${encodeURIComponent(String(job.id))}`,
          changeFrequency: "daily" as const,
          priority: 0.7,
        }];
      });
    }
  } else {
    console.error("Sitemap: job query rejected:", jobsResult.reason);
  }

  const productsResult = results[2];
  if (productsResult.status === "fulfilled") {
    if (productsResult.value.error) {
      console.error("Sitemap: failed to load published products:", productsResult.value.error.message);
    } else {
      productPages = (productsResult.value.data ?? []).flatMap((product) => {
        const slug = typeof product.slug === "string" ? product.slug.trim() : "";
        if (!slug) return [];
        return [{
          url: `${BASE_URL}/shop/${encodeURIComponent(slug)}`,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }];
      });
    }
  } else {
    console.error("Sitemap: product query rejected:", productsResult.reason);
  }

  // Prevent duplicate URLs from ever being emitted.
  const uniquePages = new Map<string, SitemapItem>();
  for (const item of [...staticPages, ...articlePages, ...jobPages, ...productPages]) {
    if (!uniquePages.has(item.url)) uniquePages.set(item.url, item);
  }

  return [...uniquePages.values()];
}
