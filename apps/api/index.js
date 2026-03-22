const http = require("http");

const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  // Allow all origins in development; restrict to specific origins in production.
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (req.method === "GET" && req.url === "/get-title") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Planner Flow");
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`api app running on port ${PORT}`);
});
