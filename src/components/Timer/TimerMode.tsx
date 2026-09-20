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

      <button
        className={mode === "long-break" ? "timer-mode-active" : ""}
        onClick={() => onChange("long-break")}
      >
        Long Break
      </button>
    </div>
  );
}
export default TimerMode;
