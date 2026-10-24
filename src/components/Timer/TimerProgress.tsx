type TimerProgressProps = {
  completedPomodoros: number;
  longBreakInterval: number;
};

function TimerProgress({
  completedPomodoros,
  longBreakInterval,
}: TimerProgressProps) {
  const currentOrbit = Math.min(completedPomodoros + 1, longBreakInterval);

  return (
    <div
      className="timer-progress"
      role="status"
      aria-label={`Pomodoro progress: ${completedPomodoros} of ${longBreakInterval} completed`}
    >
      <span className="timer-orbit-badge" aria-hidden="true">
        🎯 Orbit {currentOrbit} / {longBreakInterval}
      </span>
    </div>
  );
}

export default TimerProgress;
