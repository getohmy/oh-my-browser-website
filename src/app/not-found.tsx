import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — Oh My Browser",
  description: "The page you are looking for does not exist.",
  robots: "noindex",
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "#fff",
        color: "#111",
      }}
    >
      <p
        style={{
          fontSize: "5rem",
          fontWeight: 700,
          color: "#e5e7eb",
          lineHeight: 1,
          margin: 0,
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          marginTop: "1rem",
          marginBottom: "0.5rem",
        }}
      >
        Page not found
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "0.25rem" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        您访问的页面不存在或已被移动。
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          backgroundColor: "#111827",
          color: "#fff",
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        Go to home page / 返回首页
      </Link>
    </main>
  );
}
