const FALLBACK_HEADER = "Welcome to Planner Flow";

async function getHomeHeader(): Promise<string> {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiBase}/get-home-header`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return FALLBACK_HEADER;
    const data = (await res.json()) as { text?: unknown };
    return typeof data.text === "string" && data.text.trim()
      ? data.text
      : FALLBACK_HEADER;
  } catch {
    return FALLBACK_HEADER;
  }
}

export default async function HomePage() {
  const headerText = await getHomeHeader();

  return (
    <main className="hero">
      <h1 className="hero-title">{headerText}</h1>
    </main>
  );
}