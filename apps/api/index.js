const http = require("http");

const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/get-title") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Planner Flow");
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`api app running on port ${PORT}`);
});
