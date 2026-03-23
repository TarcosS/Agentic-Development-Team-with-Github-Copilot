const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function getHomeHeader(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/get-home-header`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    const data = await res.json();
    return typeof data.text === "string" ? data.text : "Welcome";
  } catch (err) {
    console.error("[HomePage] Failed to fetch /get-home-header:", err);
    return null;
  }
}

export default async function HomePage() {
  const headline = await getHomeHeader();

  return (
    <main className="hero">
      {headline !== null ? (
        <h1 className="hero-title">{headline}</h1>
      ) : (
        <p className="hero-error">Failed to load content. Please try again later.</p>
      )}
    </main>
  );
}
