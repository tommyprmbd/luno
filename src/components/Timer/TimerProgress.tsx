type TimerProgressProps = {
  completedPomodoros: number;
};

function TimerProgress({ completedPomodoros }: TimerProgressProps) {
  return (
    <div
      className="timer-progress"
      role="status"
      aria-label={`Pomodoro progress: ${completedPomodoros} of 4 completed`}
    >
      {[0, 1, 2, 3].map((index) => (
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
