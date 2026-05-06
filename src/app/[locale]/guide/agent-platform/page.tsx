import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://omb.org.cn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isZh = locale === "zh-CN";
  const ogLocale = isZh ? "zh_CN" : "en_US";

  return {
    title: t("metadata.guide.agent-platform.title"),
    description: t("metadata.guide.agent-platform.description"),
    alternates: {
      canonical: `${BASE_URL}/guide/agent-platform`,
      languages: {
        en: `${BASE_URL}/en/guide/agent-platform`,
        "zh-CN": `${BASE_URL}/zh-CN/guide/agent-platform`,
        "x-default": `${BASE_URL}/guide/agent-platform`,
      },
    },
    robots: "index, follow",
    openGraph: {
      type: "website",
      url: `${BASE_URL}/${locale}/guide/agent-platform`,
      title: t("metadata.guide.agent-platform.title"),
      description: t("metadata.guide.agent-platform.description"),
      locale: ogLocale,
      siteName: "Oh My Browser",
      images: [
        {
          url: "/og-default.svg",
          width: 1200,
          height: 630,
          alt: "Oh My Browser Agent Platform Guide",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.guide.agent-platform.title"),
      description: t("metadata.guide.agent-platform.description"),
      images: ["/og-default.svg"],
    },
  };
}

export default function GuideAgentPlatformPage() {
  const t = useTranslations();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Agent Platform Guide — Oh My Browser",
    author: {
      "@type": "Organization",
      name: "Oh My Browser",
    },
    datePublished: "2026-04-25",
  };

  return (
    <main>
      <JsonLd data={jsonLd} />
      <h1>{t("guide.agent-platform.title")}</h1>
    </main>
  );
}
