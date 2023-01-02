import express from "express";

const PORT = 80;

const app = express();

app.use("/", express.static("react-app/build"));

app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));
