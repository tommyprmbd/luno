import type { TimerMode as TimerModeType } from "../../types/timer";

type TimerModeProps = {
  mode: TimerModeType;
  onChange: (mode: TimerModeType) => void;
};

function TimerMode({ mode, onChange }: TimerModeProps) {
  return (
    <div className="timer-mode">
      <button
        className={mode === "pomodoro" ? "timer-mode-active" : ""}
        aria-pressed={mode === "pomodoro"}
        onClick={() => onChange("pomodoro")}
      >
        <span className="timer-mode-icon" aria-hidden="true">
          🍅
        </span>
        Pomodoro
      </button>

      <button
        className={mode === "short-break" ? "timer-mode-active" : ""}
        aria-label="Short Break"
        aria-pressed={mode === "short-break"}
        onClick={() => onChange("short-break")}
      >
        <span className="timer-mode-icon" aria-hidden="true">
          ☕
        </span>
        Short
      </button>

      <button
        className={mode === "long-break" ? "timer-mode-active" : ""}
        aria-label="Long Break"
        aria-pressed={mode === "long-break"}
        onClick={() => onChange("long-break")}
      >
        <span className="timer-mode-icon" aria-hidden="true">
          🌿
        </span>
        Long
      </button>
    </div>
  );
}
export default TimerMode;
