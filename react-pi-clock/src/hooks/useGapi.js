import { useState, useEffect } from "react";

const TIMESHEET_NAME = "Timesheet";
const TIMESHEET_RANGE = "Timesheet!A2:C";
const ROSTER_RANGE = "Roster!A2:C";
const MAX_SHIFT_LENGTH_HOURS = 12;
const MAX_SHIFT_LENGTH_MS = MAX_SHIFT_LENGTH_HOURS * 60 * 60 * 1000;

const parseWhosClockedIn = (rows) => {
  const now = Date.now();

  return rows.filter((row) => {
    if (row.length === 3) {
      // They're already clocked out
      return false;
    }

    const timeIn = Date.parse(row[1]);
    if (timeIn < now - MAX_SHIFT_LENGTH_MS) {
      // They clocked in too long ago
      return false;
    }

    // If we've reached here, this time entry is still clocked in and recent
    return true;
  });
};

const getClockInEntryRow = (rows) => (userName) => {
  if (!rows || !userName) {
    return false;
  }
  return rows.find((row) => {
    if (row[0] !== userName || row.length === 3) {
      // It's either not the right user or has a clock out time.
      return false;
    }
    const timeIn = Date.parse(row[1]);
    if (timeIn < Date.now() - MAX_SHIFT_LENGTH_MS) {
      // This is too old
      return false;
    }

    // If we've reached here, this time entry is the right user, not clocked out, and recent.
    return true;
  });
};

const getClockInTime = (whosClockedIn) => (userName) => {
  const row = getClockInEntryRow(whosClockedIn)(userName);
  if (!row) {
    return false;
  }
  const timeIn = Date.parse(row[1]);
  return timeIn;
};

const getRosterRow = (roster, userName) => {
  if (!roster || !userName) {
    return [];
  }
  return roster.find((row) => row[0] === userName);
};

const addRosterRow = async (userName, setRoster) => {
  await fetchRoster(setRoster);

  const totalHoursQuery = `=SUM(QUERY(Timesheet!A2:D, "SELECT D WHERE A = '${userName}'"))`;

  let response;

  try {
    response = await window.gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: window.timeclockConfig.spreadsheetId,
      range: ROSTER_RANGE,
      valueInputOption: "USER_ENTERED",
      majorDimension: "ROWS",
      values: [[userName, totalHoursQuery, ""]],
    });
  } catch (err) {
    console.error("Error adding to roster:", err);
    return false;
  }

  const result = response.result;
  if (result.updates.updatedCells !== 3) {
    console.error(
      `Error adding to roster: ${result.updates.updatedCells} cells appended.`
    );
  }
  fetchRoster(setRoster);
  return true;
};

const fetchTimesheet = async (setWhosClockedIn) => {
  let response;
  try {
    response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: window.timeclockConfig.spreadsheetId,
      range: TIMESHEET_RANGE,
    });
  } catch (err) {
    console.error("Error fetching who's clocked in:", err);
    return false;
  }

  const rows = response.result?.values || [];
  setWhosClockedIn(parseWhosClockedIn(rows));
  return rows;
};

const fetchRoster = async (setRoster) => {
  let response;
  try {
    response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: window.timeclockConfig.spreadsheetId,
      range: ROSTER_RANGE,
    });
  } catch (err) {
    console.error("Error fetching roster:", err);
    return false;
  }

  const rows = response.result?.values || [];
  setRoster(rows);
  return rows;
};

const fetchUserName = async (setUserName) => {
  let response;
  try {
    response = await window.gapi.client.people.people.get({
      resourceName: "people/me",
      "requestMask.includeField": "person.names",
    });
  } catch (err) {
    console.error("Error fetching user name:", err);
    return false;
  }

  const names = response.result.names;
  const primaryName = names.find((name) => name.metadata.primary);
  setUserName(primaryName.displayName);
  return primaryName.displayName;
};

const clockIn = (userName, setWhosClockedIn, setRoster) => async () => {
  const now = new Date();
  const timeString = now.toLocaleString();

  await fetchRoster(setRoster);

  let response;

  try {
    response = await window.gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: window.timeclockConfig.spreadsheetId,
      range: TIMESHEET_RANGE,
      valueInputOption: "USER_ENTERED",
      majorDimension: "ROWS",
      values: [[userName, timeString, ""]],
    });
  } catch (err) {
    console.error("Error clocking in:", err);
    return false;
  }

  const result = response.result;
  if (result.updates.updatedCells !== 3) {
    console.error(
      `Error clocking in: ${result.updates.updatedCells} cells appended.`
    );
  }
  fetchTimesheet(setWhosClockedIn);
  return true;
};

const clockOut = (userName, setWhosClockedIn) => async () => {
  const now = new Date();
  const timeString = now.toLocaleString();
  const rows = await fetchTimesheet(setWhosClockedIn);
  const row = getClockInEntryRow(rows)(userName);
  if (!row) {
    return false;
  }
  const rowIndex = rows.indexOf(row) + 2; // +1 for 0 offset, and +1 for header
  const timeIn = Date.parse(row[1]);
  const durationHours = (now - timeIn) / 1000 / 60 / 60;

  const range = `${TIMESHEET_NAME}!C${rowIndex}:D${rowIndex}`;

  let response;

  try {
    response = await window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: window.timeclockConfig.spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      majorDimension: "ROWS",
      values: [[timeString, durationHours]],
    });
  } catch (err) {
    console.error("Error clocking in:", err);
    return false;
  }

  const result = response.result;
  if (result.updatedCells !== 2) {
    console.error(`Error clocking out: ${result.updatedCells} cells updated.`);
  }
  fetchTimesheet(setWhosClockedIn);
  return true;
};

const initialFetch = async (setUserName, setWhosClockedIn, setRoster) => {
  fetchTimesheet(setWhosClockedIn);
  const userName = await fetchUserName(setUserName);
  const rosterRows = await fetchRoster(setRoster);

  // If this user isn't added to the roster, do that now.
  if (!getRosterRow(rosterRows, userName)) {
    addRosterRow(userName, setRoster);
  }
};

const useGapi = () => {
  const [isGapiInited, setGapiInited] = useState(false);
  const [isGapiSignedIn, setGapiSignedIn] = useState(false);
  const [whosClockedIn, setWhosClockedIn] = useState(null);
  const [roster, setRoster] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    window.onGApiClientInit = () => {
      setGapiInited(true);
    };
    window.onGApiClientSignIn = () => {
      setGapiSignedIn(true);
      initialFetch(setUserName, setWhosClockedIn, setRoster);
    };
    window.onGApiClientSignOut = () => {
      setGapiSignedIn(false);
    };
  }, []);

  return {
    isGapiInited,
    isGapiSignedIn,
    roster,
    whosClockedIn,
    userName,
    getClockInTime: getClockInTime(whosClockedIn),
    clockIn: clockIn(userName, setWhosClockedIn, setRoster),
    clockOut: clockOut(userName, setWhosClockedIn),
    gapiSignIn: window.gapiSignIn,
    gapiSignOut: window.gapiSignOut,
  };
};

export default useGapi;
