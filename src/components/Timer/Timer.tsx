import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";
import type { Task } from "../../types/task";
import type {
  TimerMode as TimerModeType,
  TimerStatus,
} from "../../types/timer";
import TimerMode from "./TimerMode";
import TimerProgress from "./TimerProgress";

const MODE_TAGLINE: Record<TimerModeType, string> = {
  pomodoro: "Deep Focus Orbit",
  "short-break": "Mindful Breath Interval",
  "long-break": "Restorative Orbit Rest",
};

type TimerProps = {
  activeTask: Task | null;
  mode: TimerModeType;
  status: TimerStatus;
  remainingSeconds: number;
  completedPomodoros: number;
  longBreakInterval: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onChangeMode: (mode: TimerModeType) => void;
};

function Timer({
  activeTask,
  mode,
  status,
  remainingSeconds,
  completedPomodoros,
  longBreakInterval,
  onStart,
  onPause,
  onReset,
  onChangeMode,
}: TimerProps) {
  return (
    <>
      <section className="timer">
        <TimerMode mode={mode} onChange={onChangeMode} />

        <TimerDisplay remainingSeconds={remainingSeconds} />

        <p className="timer-tagline">
          <span
            className={`timer-tagline-dot timer-tagline-dot-${mode}`}
            aria-hidden="true"
          />
          {MODE_TAGLINE[mode]}
        </p>

        <TimerControls
          status={status}
          onStart={onStart}
          onPause={onPause}
          onReset={onReset}
        />

        <TimerProgress
          completedPomodoros={completedPomodoros}
          longBreakInterval={longBreakInterval}
        />
      </section>

      {activeTask && (
        <div className="active-task">
          <span className="active-task-icon" aria-hidden="true">
            🎯
          </span>
          <div>
            <span className="active-task-label">CURRENT INTENTION</span>
            <p className="active-task-title">{activeTask.title}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Timer;
