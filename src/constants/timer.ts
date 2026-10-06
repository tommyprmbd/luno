import type { TimerMode } from "../types/timer";

export const TIMER_DURATION: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  "short-break": 5 * 60,
  "long-break": 15 * 60,
};

export const DEFAULT_TIMER_SETTINGS = {
  pomodoroDuration: TIMER_DURATION.pomodoro / 60,
  shortBreakDuration: TIMER_DURATION["short-break"] / 60,
  longBreakDuration: TIMER_DURATION["long-break"] / 60,
  longBreakInterval: 4,
} as const;
