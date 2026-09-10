import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mindrainfo.in";

  // Get all published articles
  const { data: articles } = await supabase
    .from("articles")
    .select("slug")
    .eq("published", true);

  // Get all published jobs
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id")
    .eq("published", true);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      priority: 1,
    },
    {
      url: `${baseUrl}/ai`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/career`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/data-analytics`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jobs`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/technology`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop`,
      priority: 0.8,
    },

    // AI
    {
      url: `${baseUrl}/ai/tools`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai/generative-ai`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai/prompt-engineering`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai/automation`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai/careers`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai/machine-learning`,
      priority: 0.8,
    },

    // Tools
    {
      url: `${baseUrl}/tools/pdf`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/compress`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/excel-to-pdf`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/pdf-to-excel`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/word-to-pdf`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/pdf-to-word`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/jpg-to-pdf`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/pdf-to-jpg`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/merge`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/organize`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/pdf-to-powerpoint`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/powerpoint-to-pdf`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/rotate`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/pdf/split`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/ai-prompt-helper`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/csv-viewer`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/image-compressor`,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/json-formattor`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/mindrasave`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/text-formatter`,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/word-counter`,
      priority: 0.8,
    },
  ];

  // Add published article URLs
  const articlePages: MetadataRoute.Sitemap =
    articles?.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      priority: 0.7,
    })) ?? [];

  // Add published job URLs
  const jobPages: MetadataRoute.Sitemap =
    jobs?.map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      priority: 0.7,
    })) ?? [];

  return [...staticPages, ...articlePages, ...jobPages];
}