import SetNfcButton from "./SetNfcButton";
import "./SignOutPanel.css";

const SignOutPanel = ({ gapiSignOut, userName, nfcId }) => {
  const onClick = () => {
    gapiSignOut();
  };

  const nfcButton =
    !nfcId || nfcId.length === 0 ? (
      <SetNfcButton userName={userName} nfcId={nfcId} />
    ) : null;

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
