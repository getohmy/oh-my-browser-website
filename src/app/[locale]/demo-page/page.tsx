import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://omb.org.cn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("metadata.demo.title"),
    description: t("metadata.demo.description"),
    alternates: {
      canonical: `${BASE_URL}/demo-page`,
      languages: {
        en: `${BASE_URL}/en/demo-page`,
        "zh-CN": `${BASE_URL}/zh-CN/demo-page`,
        "x-default": `${BASE_URL}/demo-page`,
      },
    },
    robots: "index, follow",
    other: {
      "omb-demo": "v1",
    },
  };
}

export default function DemoPage() {
  const t = useTranslations();

  return (
    <main>
      <h1>{t("demo.title")}</h1>

      <p>{t("demo.p1")}</p>
      <p>{t("demo.p2")}</p>
      <p>{t("demo.p3")}</p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/public/demo-placeholder.png"
        alt={t("demo.img.alt")}
        width={800}
        height={450}
      />

      <ul>
        <li>{t("demo.list.item1")}</li>
        <li>{t("demo.list.item2")}</li>
        <li>{t("demo.list.item3")}</li>
      </ul>

      <aside>
        <p>{t("demo.agent.prompt")}</p>
      </aside>
    </main>
  );
}
