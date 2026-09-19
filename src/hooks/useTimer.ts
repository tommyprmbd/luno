import { useEffect, useState } from "react";
import type { TimerMode, TimerStatus } from "../types/timer";
import { TIMER_DURATION } from "../constants/timer";

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [remainingSeconds, setRemainingSeconds] = useState(
    TIMER_DURATION.pomodoro,
  );

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          clearInterval(interval);
          setStatus("idle");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  function start() {
    setStatus("running");
  }

  function pause() {
    setStatus("paused");
  }

  function reset() {
    setStatus("idle");
    setRemainingSeconds(TIMER_DURATION[mode]);
  }

  function changeMode(newMode: TimerMode) {
    setMode(newMode);
    setStatus("idle");
    setRemainingSeconds(TIMER_DURATION[newMode]);
  }

  return {
    mode,
    status,
    remainingSeconds,
    start,
    pause,
    reset,
    changeMode,
  };
}
