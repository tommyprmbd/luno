export const STORAGE_KEY = {
  tasks: "luno:tasks",
  activeTaskId: "luno:active-task-id",
  sessions: "luno:sessions",
  timerSettings: "luno-timer-settings",
} as const;

// shortcut: keep the last 5000 sessions (~0.5 MB); upgrade to pagination if
// users need more history.
export const MAX_STORED_SESSIONS = 5000;
