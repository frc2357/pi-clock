import express from "express";
import bodyParser from "body-parser";
import generateConfig from "./generate-config.js";
import setnfc from "./setnfc.js";

const PORT = 80;

generateConfig();

const app = express();
const jsonParser = bodyParser.json();

app.use("/", express.static("react-app/build"));
app.post("/setnfc", jsonParser, setnfc);

app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));
