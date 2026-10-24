type TimerControlsProps = {
  status: "idle" | "running" | "paused";
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

function TimerControls({
  status,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  if (status === "running") {
    return (
      <div className="timer-controls">
        <button type="button" className="reset-button" onClick={onReset}>
          RESET
        </button>

        <button type="button" className="start-button" onClick={onPause}>
          PAUSE
        </button>
      </div>
    );
  }

  return (
    <div className="timer-controls">
      {status === "paused" && (
        <button type="button" className="reset-button" onClick={onReset}>
          RESET
        </button>
      )}

      <button type="button" className="start-button" onClick={onStart}>
        {status === "paused" ? "RESUME" : "START"}
      </button>
    </div>
  );
}
export default TimerControls;
