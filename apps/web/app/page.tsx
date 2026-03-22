"use client";

import { useEffect, useState } from "react";

type HealthStatus = "loading" | "ok" | "error";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function HomePage() {
  const [status, setStatus] = useState<HealthStatus>("loading");
  const [detail, setDetail] = useState<string>("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/healthz`)
      .then(async (res) => {
        if (!res.ok) {
          setStatus("error");
          setDetail(`HTTP ${res.status}`);
          return;
        }
        const data = await res.json();
        if (data.status === "ok") {
          setStatus("ok");
          setDetail("API is reachable and healthy.");
        } else {
          setStatus("error");
          setDetail(`Unexpected status: ${data.status}`);
        }
      })
      .catch((err: unknown) => {
        setStatus("error");
        setDetail(err instanceof Error ? err.message : "Network error");
      });
  }, []);

  const badge =
    status === "loading"
      ? { color: "#6b7280", label: "Checking…" }
      : status === "ok"
        ? { color: "#16a34a", label: "Healthy" }
        : { color: "#dc2626", label: "Unavailable" };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", width: "100%", maxWidth: "480px" }}>
        <h1 style={{ margin: 0 }}>Next.js + TypeScript + App Router is ready.</h1>

        <div
          style={{
            width: "100%",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            background: "#ffffff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span style={{ fontWeight: 600, fontSize: "1rem" }}>Health Check</span>
            <span
              style={{
                background: badge.color,
                color: "#fff",
                borderRadius: "9999px",
                padding: "0.2rem 0.75rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.03em",
              }}
            >
              {badge.label}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
            {status === "loading"
              ? "Querying API health endpoint…"
              : status === "ok"
                ? detail
                : `Error: ${detail}`}
          </p>
        </div>
      </div>
    </main>
  );
}
