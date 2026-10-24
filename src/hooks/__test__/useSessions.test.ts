import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MAX_STORED_SESSIONS, STORAGE_KEY } from "../../constants/storage";
import type { SessionRecord } from "../../types/session";
import {
  formatDuration,
  getLocalDateKey,
  getTodayFocusSummary,
  getTotalFocusSummary,
  useSessions,
} from "../useSessions";

const at = (day: number, hour: number, minute: number) =>
  new Date(2026, 9, day, hour, minute).getTime();

const makeSession = (
  overrides: Partial<SessionRecord> = {},
): SessionRecord => ({
  mode: "pomodoro",
  completedAt: at(20, 10, 0),
  durationSeconds: 1500,
  taskTitle: "Build Luno",
  ...overrides,
});

describe("useSessions", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with no sessions", () => {
    const { result } = renderHook(() => useSessions());

    expect(result.current.sessions).toEqual([]);
  });

  it("should add and persist a session", () => {
    const { result } = renderHook(() => useSessions());
    const session = makeSession();

    act(() => {
      result.current.addSession(session);
    });

    expect(result.current.sessions).toEqual([session]);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY.sessions)!);

    expect(stored).toEqual([session]);
  });

  it("should append sessions in completion order", () => {
    const { result } = renderHook(() => useSessions());
    const first = makeSession();
    const second = makeSession({
      completedAt: at(20, 10, 30),
      durationSeconds: 300,
      mode: "short-break",
      taskTitle: null,
    });

    act(() => {
      result.current.addSession(first);
      result.current.addSession(second);
    });

    expect(result.current.sessions).toEqual([first, second]);
  });

  it("should keep valid persisted sessions and drop malformed ones", () => {
    const valid = makeSession();

    localStorage.setItem(
      STORAGE_KEY.sessions,
      JSON.stringify([
        valid,
        null,
        { ...valid, mode: "nap" },
        { ...valid, durationSeconds: 0 },
        { ...valid, completedAt: "yesterday" },
        { ...valid, taskTitle: undefined },
      ]),
    );

    const { result } = renderHook(() => useSessions());

    expect(result.current.sessions).toEqual([valid]);
  });

  it("should keep only the most recent sessions", () => {
    const seeded = Array.from(
      { length: MAX_STORED_SESSIONS + 1 },
      (_, index) => makeSession({ completedAt: index + 1 }),
    );

    localStorage.setItem(STORAGE_KEY.sessions, JSON.stringify(seeded));

    const { result } = renderHook(() => useSessions());

    expect(result.current.sessions).toHaveLength(MAX_STORED_SESSIONS);
    expect(result.current.sessions[0].completedAt).toBe(2);
    expect(result.current.sessions.at(-1)?.completedAt).toBe(
      MAX_STORED_SESSIONS + 1,
    );

    const newest = makeSession({ completedAt: MAX_STORED_SESSIONS + 2 });

    act(() => {
      result.current.addSession(newest);
    });

    expect(result.current.sessions).toHaveLength(MAX_STORED_SESSIONS);
    expect(result.current.sessions[0].completedAt).toBe(3);
    expect(result.current.sessions.at(-1)).toEqual(newest);
  });
});

describe("session summaries", () => {
  it("should use local calendar days", () => {
    expect(getLocalDateKey(new Date(2026, 9, 20, 23, 59).getTime())).toBe(
      "2026-10-20",
    );
    expect(getLocalDateKey(new Date(2026, 9, 21, 0, 0).getTime())).toBe(
      "2026-10-21",
    );
  });

  it("should total only today's completed focus sessions", () => {
    const sessions = [
      makeSession({ completedAt: at(20, 9, 0), durationSeconds: 1500 }),
      makeSession({ completedAt: at(20, 11, 0), durationSeconds: 1800 }),
      makeSession({
        completedAt: at(20, 12, 0),
        durationSeconds: 300,
        mode: "short-break",
        taskTitle: null,
      }),
      makeSession({ completedAt: at(19, 23, 59), durationSeconds: 1500 }),
      makeSession({
        completedAt: at(20, 13, 0),
        durationSeconds: 900,
        mode: "long-break",
        taskTitle: null,
      }),
    ];

    expect(getTodayFocusSummary(sessions, at(20, 18, 0))).toEqual({
      count: 2,
      totalSeconds: 3300,
    });
  });

  it("should total all completed focus sessions across days", () => {
    const sessions = [
      makeSession({ completedAt: at(20, 9, 0), durationSeconds: 1500 }),
      makeSession({ completedAt: at(19, 9, 0), durationSeconds: 1800 }),
      makeSession({
        completedAt: at(20, 12, 0),
        durationSeconds: 300,
        mode: "short-break",
        taskTitle: null,
      }),
    ];

    expect(getTotalFocusSummary(sessions)).toEqual({
      count: 2,
      totalSeconds: 3300,
    });
  });

  it("should not carry sessions across the local midnight boundary", () => {
    const sessions = [
      makeSession({ completedAt: at(20, 0, 0) }),
      makeSession({ completedAt: at(19, 23, 59) }),
    ];

    expect(getTodayFocusSummary(sessions, at(20, 0, 0))).toEqual({
      count: 1,
      totalSeconds: 1500,
    });

    expect(getTodayFocusSummary(sessions, at(21, 0, 0))).toEqual({
      count: 0,
      totalSeconds: 0,
    });
  });

  it("should format durations and totals compactly", () => {
    expect(formatDuration(0)).toBe("0m");
    expect(formatDuration(45)).toBe("45s");
    expect(formatDuration(90)).toBe("1m 30s");
    expect(formatDuration(1500)).toBe("25m");
    expect(formatDuration(3600)).toBe("1h");
    expect(formatDuration(3900)).toBe("1h 5m");
  });
});
