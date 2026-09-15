import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://mindrainfo.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /*
   * ============================================================
   * DYNAMIC CONTENT
   * ============================================================
   *
   * Only public/published records are included.
   */

  const [
    { data: articles },
    { data: jobs },
    { data: products },
  ] = await Promise.all([
    supabase
      .from("articles")
      .select("slug")
      .eq("published", true),

    supabase
      .from("jobs")
      .select("id")
      .eq("published", true),

    supabase
      .from("products")
      .select("slug")
      .eq("published", true),
  ]);

  /*
   * ============================================================
   * STATIC PUBLIC PAGES
   * ============================================================
   */

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${BASE_URL}/career`,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/data-analytics`,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/ai`,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/technology`,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/jobs`,
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/tools`,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/articles`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/shop`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    /*
     * ==========================================================
     * MINDAGAMES
     * ==========================================================
     */

    {
      url: `${BASE_URL}/games`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    /*
     * ==========================================================
     * AI
     * ==========================================================
     */

    {
      url: `${BASE_URL}/ai/tools`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/ai/generative-ai`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/ai/prompt-engineering`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/ai/automation`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/ai/careers`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/ai/machine-learning`,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    /*
     * ==========================================================
     * PDF / DIGITAL TOOLS
     * ==========================================================
     */

    {
      url: `${BASE_URL}/tools/pdf`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/compress`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/excel-to-pdf`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/pdf-to-excel`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/word-to-pdf`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/pdf-to-word`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/jpg-to-pdf`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/pdf-to-jpg`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/merge`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/organize`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/pdf-to-powerpoint`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/powerpoint-to-pdf`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/rotate`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/pdf/split`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/ai-prompt-helper`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/csv-viewer`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/image-compressor`,
      changeFrequency: "monthly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/tools/json-formattor`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/mindrasave`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/text-formatter`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/tools/word-counter`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    /*
     * ==========================================================
     * PUBLIC POLICY PAGE
     * ==========================================================
     */

    {
      url: `${BASE_URL}/crawling-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  /*
   * ============================================================
   * PUBLISHED ARTICLE PAGES
   * ============================================================
   */

  const articlePages: MetadataRoute.Sitemap =
    articles?.map((article) => ({
      url: `${BASE_URL}/articles/${article.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    })) ?? [];

  /*
   * ============================================================
   * PUBLISHED JOB PAGES
   * ============================================================
   */

  const jobPages: MetadataRoute.Sitemap =
    jobs?.map((job) => ({
      url: `${BASE_URL}/jobs/${job.id}`,
      changeFrequency: "daily",
      priority: 0.7,
    })) ?? [];

  /*
   * ============================================================
   * PUBLISHED SHOP PRODUCT PAGES
   * ============================================================
   */

  const productPages: MetadataRoute.Sitemap =
    products?.map((product) => ({
      url: `${BASE_URL}/shop/${product.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })) ?? [];

  /*
   * ============================================================
   * FINAL SITEMAP
   * ============================================================
   */

  return [
    ...staticPages,
    ...articlePages,
    ...jobPages,
    ...productPages,
  ];
}