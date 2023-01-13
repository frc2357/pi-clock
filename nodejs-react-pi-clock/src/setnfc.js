import fetch from "node-fetch";

const API_URL = "http://python-nfc-pi-clock:4000/nfc_tag_id";

const fetchNFCTag = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  console.log("data:", data);
  return data.nfc_tag_id;
};

const setnfc = async (req, res) => {
  const { userName, nfcId } = req.body;
  const currentNfcId = await fetchNFCTag();
  console.log(
    "[setnfc] username: ",
    userName,
    ", nfcId: ",
    nfcId,
    ", current tag: ",
    currentNfcId
  );
  res.send({ success: false, message: "not implemented" });
};

export default setnfc;
