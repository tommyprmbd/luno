import { STORAGE_KEY } from "../constants/storage";
import type { SessionRecord } from "../types/session";
import { useLocalStorage } from "./useLocalStorage";

const MODES = new Set(["pomodoro", "short-break", "long-break"]);

const isSessionRecord = (value: unknown): value is SessionRecord => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const session = value as SessionRecord;

  return (
    MODES.has(session.mode) &&
    typeof session.completedAt === "number" &&
    Number.isFinite(session.completedAt) &&
    session.completedAt > 0 &&
    typeof session.durationSeconds === "number" &&
    Number.isInteger(session.durationSeconds) &&
    session.durationSeconds > 0 &&
    (session.taskTitle === null || typeof session.taskTitle === "string")
  );
};

const readSessions = (value: unknown): SessionRecord[] | null =>
  Array.isArray(value) ? value.filter(isSessionRecord) : null;

export function useSessions() {
  const [sessions, setSessions] = useLocalStorage<SessionRecord[]>(
    STORAGE_KEY.sessions,
    [],
    readSessions,
  );

  function addSession(session: SessionRecord) {
    setSessions((current) => [...current, session]);
  }

  return { sessions, addSession };
}

export function getLocalDateKey(timestamp: number) {
  const date = new Date(timestamp);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const sumFocusSessions = (sessions: SessionRecord[]) =>
  sessions.reduce(
    (summary, session) => {
      if (session.mode === "pomodoro") {
        summary.count += 1;
        summary.totalSeconds += session.durationSeconds;
      }

      return summary;
    },
    { count: 0, totalSeconds: 0 },
  );

export function getTodayFocusSummary(
  sessions: SessionRecord[],
  now = Date.now(),
) {
  const today = getLocalDateKey(now);

  return sumFocusSessions(
    sessions.filter(
      (session) => getLocalDateKey(session.completedAt) === today,
    ),
  );
}

export function getTotalFocusSummary(sessions: SessionRecord[]) {
  return sumFocusSessions(sessions);
}

export function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));

  if (seconds === 0) {
    return "0m";
  }

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return remainder > 0 ? `${minutes}m ${remainder}s` : `${minutes}m`;
}
