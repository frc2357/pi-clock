import SetNfcButton from "./SetNfcButton";
import "./SignOutPanel.css";

const SignOutPanel = ({ gapiSignOut, userName, isNfcSet }) => {
  const onClick = () => {
    gapiSignOut();
  };

  const nfcButton = !isNfcSet ? <SetNfcButton userName={userName} /> : null;

  return (
    <div className="SignOutPanel">
      <button className="SignOutPanel-button" onClick={onClick}>
        <img
          className="SignOutPanel-button-icon"
          src="/google-icon.svg"
          alt="Google logo"
        />
        <p>Sign out</p>
      </button>
      {nfcButton}
    </div>
  );
};

export default SignOutPanel;
