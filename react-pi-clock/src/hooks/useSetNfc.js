import { useState } from "react";

const url = "/setnfc";

const fetchSetNfc = async (setSettingNfc, setComplete, setError, userName) => {
  setSettingNfc(true);
  setComplete(false);

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName }),
    });

    setSettingNfc(false);

    if (!response.ok) {
      throw Error("NFC set failed");
    }

    const responseJson = await response.json();

    if (responseJson.error) {
      throw Error("NFC set error: " + responseJson.error);
    }

    setComplete(true);
  } catch (err) {
    console.error("Error sending /setnfc request:", err);
    setComplete(true);
    setError(err);
  }
};

const useSetNfc = (userName) => {
  const [isSettingNfc, setSettingNfc] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const [error, setError] = useState(null);

  const setNfc = () => {
    return fetchSetNfc(setSettingNfc, setComplete, setError, userName);
  };

  return {
    isSettingNfc,
    isComplete,
    error,
    setNfc,
  };
};

export default useSetNfc;
