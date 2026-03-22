const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/get-title", (req, res) => {
    res.type("text/plain").send("Planner Flow");
});

app.listen(PORT, () => {
    console.log(`api app running on port ${PORT}`);
});