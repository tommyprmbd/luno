type TimerProgressProps = {
  completedPomodoros: number;
  longBreakInterval: number;
};

function TimerProgress({
  completedPomodoros,
  longBreakInterval,
}: TimerProgressProps) {
  return (
    <div
      className="timer-progress"
      role="status"
      aria-label={`Pomodoro progress: ${completedPomodoros} of ${longBreakInterval} completed`}
    >
      {Array.from({ length: longBreakInterval }, (_, index) => (
        <span
          key={index}
          className={
            index < completedPomodoros
              ? "timer-progress-dot completed"
              : "timer-progress-dot"
          }
        >
          ●
        </span>
      ))}
    </div>
  );
}

export default TimerProgress;
