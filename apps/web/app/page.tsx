const FALLBACK_TITLE = "Planner Flow";

async function getTitle(): Promise<string> {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${apiBase}/get-title`, { cache: "no-store" });
    if (!res.ok) return FALLBACK_TITLE;
    const data: unknown = await res.json();
    if (
      data !== null &&
      typeof data === "object" &&
      "title" in data &&
      typeof (data as { title: unknown }).title === "string"
    ) {
      return (data as { title: string }).title;
    }
    return FALLBACK_TITLE;
  } catch {
    return FALLBACK_TITLE;
  }
}

export default async function HomePage() {
  const title = await getTitle();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <h1>{title}</h1>
    </main>
  );
}