import { useEffect, useState } from "react";
import "./Timeclock.css";

const CLOCK_UPDATE_INTERVAL_MS = 1000;

const dateTime = new Date();

const Clock = () => {
  const [time, setTime] = useState(Date.now());

  const updateClock = () => {
    setTime(Date.now());
  };

  useEffect(() => {
    const timerId = setInterval(updateClock, CLOCK_UPDATE_INTERVAL_MS);
    const cleanup = () => {
      clearInterval(timerId);
    };
    return cleanup;
  });

  dateTime.setTime(time);

  return <div className="Timeclock-clock">{dateTime.toLocaleTimeString()}</div>;
};

const ClockedInSince = ({ clockInTime }) => {
  const timeString = new Date(clockInTime).toLocaleTimeString();

  return (
    <div className="Timeclock-clock-in-since">
      Clocked in since {timeString}
    </div>
  );
};

const ClockInButton = ({ onClick }) => {
  return (
    <button className="Timeclock-button-clock-in" onClick={onClick}>
      <div>➡🕗</div>
      <div>Clock-In</div>
    </button>
  );
};

const ClockOutButton = ({ onClick }) => {
  return (
    <button className="Timeclock-button-clock-out" onClick={onClick}>
      <div>🕗➡</div>
      <div>Clock-Out</div>
    </button>
  );
};

const Timeclock = ({
  userName,
  getClockInTime,
  isClockedIn,
  clockIn,
  clockOut,
}) => {
  const clockInTime = getClockInTime(userName);
  const clockedInSince = isClockedIn ? (
    <ClockedInSince clockInTime={clockInTime} />
  ) : null;

  const button = isClockedIn ? (
    <ClockOutButton onClick={clockOut} />
  ) : (
    <ClockInButton onClick={clockIn} />
  );

  return (
    <div className="Timeclock-panel">
      <h2 className="Timeclock-welcome">Welcome {userName}</h2>
      <Clock />
      {clockedInSince}
      {button}
    </div>
  );
};

export default Timeclock;
