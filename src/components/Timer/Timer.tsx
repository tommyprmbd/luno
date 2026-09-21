import TimerMode from "./TimerMode";
import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";
import { useTimer } from "../../hooks/useTimer";
import type { Task } from "../../types/task";

type TimerProps = {
  activeTask: Task | null;
};

function Timer({ activeTask }: TimerProps) {
  const { mode, status, remainingSeconds, start, pause, reset, changeMode } =
    useTimer();

  return (
    <section className="timer">
      {activeTask && <div className="timer-task">{activeTask.title}</div>}

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
