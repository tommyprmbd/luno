import { useCallback, useEffect, useRef, useState } from "react";
import type { CompletedSession } from "../types/session";
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
  const { settings, setSettings } = useTimerSettings();

  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [remainingSeconds, setRemainingSeconds] = useState(
    getDurationInSeconds("pomodoro", settings),
  );
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [lastCompletedSession, setLastCompletedSession] =
    useState<CompletedSession | null>(null);

  // the duration of the session currently running, captured at start so a
  // settings change mid-session does not rewrite its history record.
  const sessionDurationRef = useRef(
    getDurationInSeconds("pomodoro", settings),
  );

  const start = useCallback(() => {
    if (status === "idle") {
      sessionDurationRef.current = remainingSeconds;
    }

    setStatus("running");
  }, [remainingSeconds, status]);

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

  const updateSettings = useCallback(
    (nextSettings: TimerSettings) => {
      setSettings(nextSettings);

      // Running/paused sessions keep their current duration; an idle timer
      // reflects the new duration immediately.
      if (status === "idle") {
        setRemainingSeconds(getDurationInSeconds(mode, nextSettings));
      }
    },
    [mode, setSettings, status],
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

        // the current session has finished. the next session is selected, but never auto-started
        setStatus("idle");
        setLastCompletedSession({
          mode,
          completedAt: Date.now(),
          durationSeconds: sessionDurationRef.current,
        });

        if (mode === "pomodoro") {
          const nextCompletedPomodoros = completedPomodoros + 1;

          setCompletedPomodoros(nextCompletedPomodoros);

          const nextMode: TimerMode =
            nextCompletedPomodoros % settings.longBreakInterval === 0
              ? "long-break"
              : "short-break";

          setMode(nextMode);
          return getDurationInSeconds(nextMode, settings);
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
    lastCompletedSession,
    longBreakInterval: settings.longBreakInterval,
    settings,
    updateSettings,
  };
}
