import express from "express";
import generateConfig from "./generate-config.js";

const PORT = 80;

generateConfig();

const app = express();

app.use("/", express.static("react-app/build"));

app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));
