import type { TimerMode } from "../../types/timer";

type TimerModeProps = {
  mode: TimerMode;
  onChange: (mode: TimerMode) => void;
};

function TimerMode({ mode, onChange }: TimerModeProps) {
  return (
    <div className="timer-mode">
      <button
        className={mode === "pomodoro" ? "timer-mode-active" : ""}
        onClick={() => onChange("pomodoro")}
      >
        Pomodoro
      </button>

      <button
        className={mode === "short-break" ? "timer-mode-active" : ""}
        onClick={() => onChange("short-break")}
      >
        Short Break
      </button>
    </div>
  );
}
export default TimerMode;
