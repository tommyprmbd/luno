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
  const isRunning = status === "running";

  return (
    <div className="timer-controls">
      {status !== "idle" && (
        <button
          type="button"
          className="reset-button"
          aria-label="RESET"
          onClick={onReset}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}

      <button
        type="button"
        className={`start-button${isRunning ? " start-button-paused" : ""}`}
        onClick={isRunning ? onPause : onStart}
      >
        <span className="start-button-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            {isRunning ? (
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            ) : (
              <path d="M8 5v14l11-7z" />
            )}
          </svg>
        </span>
        {isRunning ? "PAUSE" : status === "paused" ? "RESUME" : "START"}
      </button>
    </div>
  );
}
export default TimerControls;
