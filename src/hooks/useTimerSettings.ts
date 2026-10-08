import { DEFAULT_TIMER_SETTINGS } from "../constants/timer";
import type { TimerSettings } from "../types/timer";
import { useLocalStorage } from "./useLocalStorage";

export function useTimerSettings() {
  const [settings, setSettings] = useLocalStorage<TimerSettings>(
    "luno-timer-settings",
    DEFAULT_TIMER_SETTINGS,
  );

  return {
    settings,
    setSettings,
  }
}
