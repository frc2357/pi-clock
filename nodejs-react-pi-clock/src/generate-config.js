/**
 * This script generates a timeclock-config.js file from environment variables
 */
import fs from "fs";

const CONFIG_FILE_PATH = "./react-app/build/timeclock-config.js";

console.log("Generating config from environment variables...");

const clientId = getEnv("CLIENT_ID");
const apiKey = getEnv("API_KEY");
const spreadsheetId = getEnv("SPREADSHEET_ID");
const timesheetName = getEnv("TIMESHEET_NAME");
const timesheetRange = getEnv("TIMESHEET_RANGE");
const rosterName = getEnv("ROSTER_NAME");
const rosterRange = getEnv("ROSTER_RANGE");
const maxShiftLengthHours = getEnv("MAX_SHIFT_LENGTH_HOURS");

const timeclockConfig = {
  clientId,
  apiKey,
  spreadsheetId,
  timesheetName,
  timesheetRange,
  rosterName,
  rosterRange,
  maxShiftLengthHours,
};

const fileBody = "window.timeclockConfig = " + JSON.stringify(timeclockConfig);

try {
  fs.writeFileSync(CONFIG_FILE_PATH, fileBody);
} catch (err) {
  console.error(err);
}

console.log("complete!");

function getEnv(envVarName) {
  const value = process.env[envVarName];

  if (!value || value.length === 0) {
    console.error(`Environment variable ${envVarName} is required`);
  }

  return value;
}
