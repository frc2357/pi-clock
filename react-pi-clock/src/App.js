import "./App.css";
import useGapi from "./hooks/useGapi";
import Timeclock from "./Timeclock";
import SignInPanel from "./SignInPanel";
import SignOutPanel from "./SignOutPanel";

function App() {
  const {
    isGapiInited,
    isGapiSignedIn,
    isNfcSet,
    gapiSignIn,
    gapiSignOut,
    whosClockedIn,
    userName,
    getClockInTime,
    clockIn,
    clockOut,
  } = useGapi();

  const isClockedIn = !!getClockInTime(userName);

  let body = null;
  let signOutPanel = null;

  if (isGapiInited) {
    if (isGapiSignedIn) {
      if (!!whosClockedIn) {
        body = (
          <Timeclock
            userName={userName}
            getClockInTime={getClockInTime}
            isClockedIn={isClockedIn}
            clockIn={clockIn}
            clockOut={clockOut}
          />
        );
      } else {
        body = <div>Loading...</div>;
      }

      signOutPanel = (
        <SignOutPanel
          gapiSignOut={gapiSignOut}
          userName={userName}
          isNfcSet={isNfcSet}
        />
      );
    } else {
      body = <SignInPanel gapiSignIn={gapiSignIn} />;
    }
  } else {
    body = <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img
          className="App-logo"
          src="FRC2357 Logo for Dark Background.svg"
          alt="FRC2357 Logo"
        />
        <h1 className="App-title">Timeclock 2357</h1>
      </header>
      <div className="App-body">
        {body}
        {signOutPanel}
      </div>
      <footer className="App-footer">
        <a className="App-link" href="https://github.com/frc2357/pi-clock">
          Created by FIRST Robotics Team 2357 "System Meltdown"
        </a>
      </footer>
    </div>
  );
}

export default App;
