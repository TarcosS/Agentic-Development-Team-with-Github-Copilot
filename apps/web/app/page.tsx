export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>Next.js + TypeScript + App Router is ready.</h1>
        <p style={{ marginTop: "0.75rem", color: "#6b7280" }}>
          Welcome! This is the starting point of your application.
        </p>
      </div>
    </main>
  );
}