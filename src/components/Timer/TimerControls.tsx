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
        <button className="start-button" onClick={onPause}>
          PAUSE
        </button>

        <button className="reset-button" onClick={onReset}>
          RESET
        </button>
      </div>
    );
  }

  return (
    <div className="timer-controls">
      <button className="start-button" onClick={onStart}>
        {status === "paused" ? "RESUME" : "START"}
      </button>

      {status === "paused" && (
        <button className="reset-button" onClick={onReset}>
          RESET
        </button>
      )}
    </div>
  );
}
export default TimerControls;
