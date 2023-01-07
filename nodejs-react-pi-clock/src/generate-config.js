/**
 * This script generates a timeclock-config.js file from environment variables
 */
import fs from "fs";

const CONFIG_FILE_PATH = "./react-app/build/timeclock-config.js";

function getEnv(envVarName) {
  const value = process.env[envVarName];

  if (!value || value.length === 0) {
    console.error(`Environment variable ${envVarName} is required`);
  }

  return value;
}

function generateConfig() {
  console.log("Generating config from environment variables...");

  const clientId = getEnv("CLIENT_ID");
  const apiKey = getEnv("API_KEY");
  const spreadsheetId = getEnv("SPREADSHEET_ID");

  const timeclockConfig = {
    clientId,
    apiKey,
    spreadsheetId,
  };

  const fileBody =
    "window.timeclockConfig = " + JSON.stringify(timeclockConfig);

  try {
    fs.writeFileSync(CONFIG_FILE_PATH, fileBody);
  } catch (err) {
    console.error(err);
  }

  console.log("complete!");
}

export default generateConfig;
