const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function getTitle(): Promise<string> {
  try {
    const res = await fetch(`${API_BASE_URL}/get-title`, { cache: "no-store" });
    if (!res.ok) return "Planner Flow";
    return await res.text();
  } catch {
    return "Planner Flow";
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
