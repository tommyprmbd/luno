import type { TimerMode } from "../types/timer";

export const TIMER_DURATION: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  'short-break': 5 * 60,
}