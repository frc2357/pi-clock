import express from "express";

const PORT = 80;

const app = express();

app.get("/", (req, res) => {
  res.send("Test from express");
});

app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));
