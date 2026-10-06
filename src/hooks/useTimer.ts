import { useCallback, useEffect, useState } from "react";
import type { TimerMode, TimerStatus, TimerSettings } from "../types/timer";
import { useTimerSettings } from "./useTimerSettings";

const getDurationInSeconds = (mode: TimerMode, settings: TimerSettings) => {
  switch (mode) {
    case "pomodoro":
      return settings.pomodoroDuration;

    case "short-break":
      return settings.shortBreakDuration;

    case "long-break":
      return settings.longBreakDuration;
  }
};

export function useTimer() {
  const { settings } = useTimerSettings();

  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [remainingSeconds, setRemainingSeconds] = useState(
    getDurationInSeconds("pomodoro", settings),
  );
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const start = useCallback(() => {
    setStatus("running");
  }, []);

  const pause = useCallback(() => {
    setStatus("paused");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setRemainingSeconds(getDurationInSeconds(mode, settings));
  }, [mode, settings]);

  const changeMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode);
      setStatus("idle");
      setRemainingSeconds(getDurationInSeconds(newMode, settings));
    },
    [settings],
  );

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

          if (nextCompletedPomodoros % settings.longBreakInterval === 0) {
            setMode("long-break");
            return getDurationInSeconds("long-break", settings);
          }

          setMode("short-break");
          return getDurationInSeconds("short-break", settings);
        }

        if (mode === "long-break") {
          setCompletedPomodoros(0);
        }

        setMode("pomodoro");
        return getDurationInSeconds("pomodoro", settings);
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [status, mode, completedPomodoros, settings]);

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
