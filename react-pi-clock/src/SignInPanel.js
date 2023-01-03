import "./SignInPanel.css";

const SignInPanel = ({ gapiSignIn }) => {
  const onClick = () => {
    gapiSignIn();
  };

  return (
    <div className="SignInPanel">
      <button className="SignInPanel-button" onClick={onClick}>
        <img
          className="SignInPanel-button-icon"
          src="/google-icon.svg"
          alt="Google logo"
        />
        <p>Sign in with Google</p>
      </button>
    </div>
  );
};

export default SignInPanel;
