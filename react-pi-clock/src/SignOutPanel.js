import "./SignOutPanel.css";

const SignOutPanel = ({ gapiSignOut }) => {
  const onClick = () => {
    gapiSignOut();
  };

  return (
    <div className="SignOutPanel">
      <button className="SignOutPanel-button" onClick={onClick}>
        <img
          className="SignOutPanel-button-icon"
          src="google-icon.svg"
          alt="Google logo"
        />
        <p>Sign out</p>
      </button>
    </div>
  );
};

export default SignOutPanel;
