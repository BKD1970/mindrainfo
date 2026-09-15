import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mindrainfo.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/auth/", "/_next/",  "/private/","/internal/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
