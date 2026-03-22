const http = require("http");

const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/healthz") {
    const body = JSON.stringify({
      status: "ok",
      service: "api",
      timestamp: new Date().toISOString(),
    });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(body);
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`api app running on port ${PORT}`);
});
