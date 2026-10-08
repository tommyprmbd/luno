export type TimerMode = "pomodoro" | "short-break" | "long-break";

export type TimerStatus = "idle" | "running" | "paused";

export interface TimerSettings {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}
