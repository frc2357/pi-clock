import fetch from "node-fetch";

const API_URL = "http://python-nfc-pi-clock:4000/nfc_tag_id";

const assignNFC = async (userName) => {
  response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName }),
  });
  return await response.json();
};

const setnfc = async (req, res) => {
  const { userName } = req.body;

  console.log('setting nfc for "' + userName + "'");
  const { success, message } = await assignNFC(userName);
  console.log("success: ", success, ", message: ", message);

  if (success) {
    res.success({});
  } else {
    res.status(400);
    res.send({ error: message });
  }
};

export default setnfc;
