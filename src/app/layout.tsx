import type { Metadata } from "next";
// Self-hosted via next/font/local (woff2 files in src/app/fonts/) — avoids
// next/font/google's hardcoded fonts.googleapis.com / fonts.gstatic.com fetch
// at build time, which is blocked from mainland China and breaks `next build`.
// Same Layout-Shift / preload optimisations as next/font/google. Files come
// from @fontsource/{inter,jetbrains-mono} (OFL) — see package.json deps.
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oh My Browser",
  description: "MCP-native browser infrastructure for AI agents and agent platforms.",
};

const inter = localFont({
  src: [
    { path: "./fonts/Inter-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Inter-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Inter-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Inter-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const jetbrainsMono = localFont({
  src: [
    { path: "./fonts/JetBrainsMono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMono-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/JetBrainsMono-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/JetBrainsMono-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
