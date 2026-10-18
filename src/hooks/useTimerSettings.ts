import { DEFAULT_TIMER_SETTINGS } from "../constants/timer";
import type { TimerSettings } from "../types/timer";
import { useLocalStorage } from "./useLocalStorage";

// durations are seconds; interval is a whole number of Pomodoros.
// cap the interval so the progress dots cannot hang the UI.
const MAX_DURATION_SECONDS = 24 * 60 * 60;
const MAX_LONG_BREAK_INTERVAL = 60;

const toPositiveInt = (value: unknown, fallback: number, max: number) =>
  typeof value === "number" && Number.isInteger(value) && value > 0 && value <= max
    ? value
    : fallback;

function readTimerSettings(value: unknown): TimerSettings | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const stored = value as Partial<Record<keyof TimerSettings, unknown>>;

  return {
    pomodoroDuration: toPositiveInt(
      stored.pomodoroDuration,
      DEFAULT_TIMER_SETTINGS.pomodoroDuration,
      MAX_DURATION_SECONDS,
    ),
    shortBreakDuration: toPositiveInt(
      stored.shortBreakDuration,
      DEFAULT_TIMER_SETTINGS.shortBreakDuration,
      MAX_DURATION_SECONDS,
    ),
    longBreakDuration: toPositiveInt(
      stored.longBreakDuration,
      DEFAULT_TIMER_SETTINGS.longBreakDuration,
      MAX_DURATION_SECONDS,
    ),
    longBreakInterval: toPositiveInt(
      stored.longBreakInterval,
      DEFAULT_TIMER_SETTINGS.longBreakInterval,
      MAX_LONG_BREAK_INTERVAL,
    ),
  };
}

export function useTimerSettings() {
  const [settings, setSettings] = useLocalStorage<TimerSettings>(
    "luno-timer-settings",
    DEFAULT_TIMER_SETTINGS,
    readTimerSettings,
  );

  return {
    settings,
    setSettings,
  }
}
