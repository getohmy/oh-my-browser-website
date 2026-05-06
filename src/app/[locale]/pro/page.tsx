import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { WaitlistForm } from "@/components/WaitlistForm";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://omb.org.cn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("metadata.pro.title"),
    description: t("metadata.pro.description"),
    alternates: {
      canonical: `${BASE_URL}/pro`,
      languages: {
        en: `${BASE_URL}/en/pro`,
        "zh-CN": `${BASE_URL}/zh-CN/pro`,
        "x-default": `${BASE_URL}/pro`,
      },
    },
    robots: "index, follow",
  };
}

export default function ProPage() {
  const t = useTranslations();

  return (
    <main>
      <h1>{t("pro.title")}</h1>
      <h2>{t("pro.waitlist.heading")}</h2>
      <WaitlistForm />
    </main>
  );
}
