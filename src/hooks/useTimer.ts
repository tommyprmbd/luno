import { useEffect, useState } from "react";
import type { TimerMode, TimerStatus } from "../types/timer";
import { TIMER_DURATION } from "../constants/timer";

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [remainingSeconds, setRemainingSeconds] = useState(
    TIMER_DURATION.pomodoro,
  );
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current > 1) {
          return current - 1;
        }

        if (mode === "pomodoro") {
          const nextCompletedPomodoros = completedPomodoros + 1;

          setCompletedPomodoros(nextCompletedPomodoros);

          if (nextCompletedPomodoros % 4 === 0) {
            setMode("long-break");
            return TIMER_DURATION["long-break"];
          }

          setMode("short-break");
          return TIMER_DURATION["short-break"];
        }

        if (mode === "long-break") {
          setCompletedPomodoros(0);
        }

        setMode("pomodoro");
        return TIMER_DURATION.pomodoro;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [status, mode, completedPomodoros]);

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
    completedPomodoros,
  };
}
