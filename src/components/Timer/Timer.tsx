import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";
import type { Task } from "../../types/task";
import type { TimerMode as TimerModeType, TimerStatus } from "../../types/timer";
import TimerMode from "./TimerMode";

type TimerProps = {
  activeTask: Task | null;
  mode: TimerModeType;
  status: TimerStatus;
  remainingSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onChangeMode: (mode: TimerModeType) => void;
};

function Timer({ activeTask, mode, status, remainingSeconds, onStart, onPause, onReset, onChangeMode }: TimerProps) {
  return (
    <section className="timer">
      {activeTask && <div className="timer-task">{activeTask.title}</div>}

      <TimerMode mode={mode} onChange={onChangeMode} />
      
      <TimerDisplay remainingSeconds={remainingSeconds} />
      
      <TimerControls
        status={status}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
      />
    </section>
  );
}

export default Timer;
