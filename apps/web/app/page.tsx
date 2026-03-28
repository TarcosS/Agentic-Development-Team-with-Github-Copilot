"use client";

import { useEffect, useState } from "react";
import { api, type MessageResponse } from "@/lib/api";

export default function HomePage() {
  const [data, setData] = useState<MessageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getMessage()
      .then((res) => setData(res))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      {loading && <p>Loading…</p>}
      {error && (
        <p style={{ color: "red" }}>
          Could not reach API: {error}
        </p>
      )}
      {data && (
        <div style={{ textAlign: "center" }}>
          <h1>{data.message}</h1>
          <p style={{ color: "#888", fontSize: "0.9rem" }}>
            {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </main>
  );
}
