async function getTitle(): Promise<string> {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${apiBase}/get-title`, { cache: "no-store" });
    if (!res.ok) {
      return "Planner Flow";
    }
    return (await res.text()).trim();
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