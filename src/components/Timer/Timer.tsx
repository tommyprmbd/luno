import TimerMode from "./TimerMode";
import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";
import { useTimer } from "../../hooks/useTimer";

function Timer() {
  const { mode, status, remainingSeconds, start, pause, reset, changeMode } =
    useTimer();

  return (
    <section className="timer">
      <TimerMode mode={mode} onChange={changeMode} />
      <TimerDisplay remainingSeconds={remainingSeconds} />
      <TimerControls
        status={status}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />
    </section>
  );
}

export default Timer;
