type TimerDisplayProps = {
  remainingSeconds: number;
};

function TimerDisplay({ remainingSeconds }: TimerDisplayProps) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return (
    <div className="timer-display">
      {formattedMinutes}:{formattedSeconds}
    </div>
  );
}

export default TimerDisplay;
