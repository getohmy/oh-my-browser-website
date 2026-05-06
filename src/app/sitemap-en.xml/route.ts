import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://omb.org.cn";

const publicPaths = [
  "",
  "/install",
  "/guide",
  "/guide/ide-agent",
  "/guide/agent-platform",
  "/privacy",
  "/terms",
  "/demo-page",
  "/pro",
];

export function GET() {
  const lastmod = new Date().toISOString().split("T")[0];

  const urls = publicPaths
    .map((path) => {
      const enUrl = `${BASE_URL}/en${path}`;
      const zhUrl = `${BASE_URL}/zh-CN${path}`;
      const canonicalUrl = `${BASE_URL}${path}`;
      return `  <url>
    <loc>${enUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${zhUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${canonicalUrl}"/>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
