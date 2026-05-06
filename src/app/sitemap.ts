import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://omb.org.cn";

const publicRoutes: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/install", priority: 1.0, changeFrequency: "weekly" },
  { path: "/guide", priority: 0.8, changeFrequency: "weekly" },
  { path: "/guide/ide-agent", priority: 0.8, changeFrequency: "weekly" },
  { path: "/guide/agent-platform", priority: 0.8, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.8, changeFrequency: "weekly" },
  { path: "/terms", priority: 0.8, changeFrequency: "weekly" },
  { path: "/demo-page", priority: 0.8, changeFrequency: "weekly" },
  { path: "/pro", priority: 0.8, changeFrequency: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of publicRoutes) {
    const canonicalUrl = `${BASE_URL}${route.path}`;
    const enUrl = `${BASE_URL}/en${route.path}`;
    const zhUrl = `${BASE_URL}/zh-CN${route.path}`;

    // Default locale entry (as-needed prefix — no prefix = English default)
    entries.push({
      url: canonicalUrl,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          en: enUrl,
          "zh-CN": zhUrl,
          "x-default": canonicalUrl,
        },
      },
    });

    // Explicit zh-CN locale entry
    entries.push({
      url: zhUrl,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          en: enUrl,
          "zh-CN": zhUrl,
          "x-default": canonicalUrl,
        },
      },
    });
  }

  return entries;
}
