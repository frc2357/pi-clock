import "./App.css";
import useGapi from "./hooks/useGapi";
import Timeclock from "./Timeclock";
import SignInPanel from "./SignInPanel";

function App() {
  const {
    isGapiInited,
    isGapiSignedIn,
    gapiSignIn,
    gapiSignOut,
    whosClockedIn,
    userName,
    getClockInTime,
    clockIn,
    clockOut,
  } = useGapi();

  const isClockedIn = !!getClockInTime(userName);

  let body;

  if (isGapiInited) {
    if (isGapiSignedIn) {
      if (!!whosClockedIn) {
        body = (
          <Timeclock
            userName={userName}
            gapiSignOut={gapiSignOut}
            getClockInTime={getClockInTime}
            isClockedIn={isClockedIn}
            clockIn={clockIn}
            clockOut={clockOut}
          />
        );
      } else {
        body = <div>Loading...</div>;
      }
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
          src="/FRC2357 Logo for Dark Background.svg"
          alt="FRC2357 Logo"
        />
        <h1 className="App-title">Timeclock 2357</h1>
      </header>
      <div className="App-body">{body}</div>
      <footer className="App-footer">
        <a className="App-link" href="https://github.com/frc2357/pi-clock">
          Created by FIRST Robotics Team 2357 "System Meltdown"
        </a>
      </footer>
    </div>
  );
}

export default App;
