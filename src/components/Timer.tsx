import { useState } from "react";

type TimerProps = {
  title: string;
  minutes: number;
};

function Timer({ title, minutes }: TimerProps) {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div>
      <h2>{title}</h2>
      <div>{minutes}:00</div>

      {isRunning ? (
        <button onClick={() => setIsRunning(false)}>PAUSE</button>
      ) : (
        <button onClick={() => setIsRunning(true)}>START</button>
      )}
    </div>
  );
}

export default Timer;
