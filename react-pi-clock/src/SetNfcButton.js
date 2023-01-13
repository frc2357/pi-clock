import useSetNfc from "./hooks/useSetNfc";
import "./SetNfcButton.css";

const SetNfcButton = ({ userName }) => {
  const { isSettingNfc, setNfc } = useSetNfc(userName);

  const onClick = () => {
    setNfc();
  };

  if (isSettingNfc) {
    return (
      <button className="SetNfcButton-button" disabled={false}>
        <img
          className="SetNfcButton-loading"
          src="/loading-orange.gif"
          alt="Loading"
        />
      </button>
    );
  }

  return (
    <button className="SetNfcButton-button" onClick={onClick}>
      <p className="SetNfcButton-icon">🪪</p>
      <p className="SetNfcButton-text">Set NFC</p>
    </button>
  );
};

export default SetNfcButton;
