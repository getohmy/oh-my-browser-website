"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sha256hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

function getAnonId(): string {
  try {
    let id = localStorage.getItem("omb_anon_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("omb_anon_id", id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function WaitlistForm() {
  const t = useTranslations();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) return;

    setStatus("loading");
    try {
      const email_hash = await sha256hex(email);
      const anonymous_id = getAnonId();
      const url =
        (process.env.NEXT_PUBLIC_API_URL || "https://api.omb.org.cn") +
        "/api/v1/extension/telemetry/events";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: [
            {
              event_name: "pro_waitlist_signed",
              anonymous_id,
              context: { email_hash, locale },
            },
          ],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
      {status !== "success" && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("pro.waitlist.placeholder")}
            required
            disabled={status === "loading"}
            style={{
              flex: "1 1 200px",
              padding: "0.5rem 0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading" || !EMAIL_RE.test(email)}
            style={{
              padding: "0.5rem 1.25rem",
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              cursor: status === "loading" ? "not-allowed" : "pointer",
              opacity: status === "loading" ? 0.6 : 1,
            }}
          >
            {t("pro.waitlist.submit")}
          </button>
        </div>
      )}
      {status === "success" && (
        <p style={{ color: "#16a34a", fontSize: "0.875rem" }}>
          {t("pro.waitlist.success")}
        </p>
      )}
      {status === "error" && (
        <p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "0.5rem" }}>
          {t("pro.waitlist.error")}
        </p>
      )}
    </form>
  );
}
