import type { TimerMode } from "./timer";

export type CompletedSession = {
  mode: TimerMode;
  completedAt: number;
  durationSeconds: number;
};

// only completed sessions are stored; resetting or abandoning a session never
// creates a record.
export type SessionRecord = CompletedSession & {
  taskTitle: string | null;
};
