const http = require("http");

const PORT = process.env.PORT || 8000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const HOME_HEADER_TEXT =
  process.env.HOME_HEADER_TEXT ||
  "Agentic Development Team with Github Copilot";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ status: "ok", service: "api", timestamp: new Date().toISOString() })
    );
    return;
  }

  if (req.method === "GET" && req.url === "/get-home-header") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ header: HOME_HEADER_TEXT }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`api app running on port ${PORT}`);
});