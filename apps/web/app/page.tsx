import { formatPercentage } from "@/src/lib/formatPercentage";

export default function HomePage() {
  // TODO: replace with real data once a data source is wired up
  const completionRatio = 0.73;
  const completionLabel = formatPercentage(completionRatio, { mode: "ratio" });

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <h1>Next.js + TypeScript + App Router is ready.</h1>
      <p>Example usage of formatPercentage: {completionLabel} complete</p>
    </main>
  );
}