import fetch from "node-fetch";

const API_URL = "http://python-nfc-pi-clock:4000/nfc_tag_assign";

const assignNFC = async (userName) => {
  const response = await fetch(API_URL, {
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
  let response;
  try {
    response = await assignNFC(userName);

    if (response.success) {
      res.success({});
    } else {
      res.status(400);
      res.send({ error: response.message });
    }
  } catch (err) {
    res.status(500);
    res.send({ error: response.message });
  }
};

export default setnfc;
