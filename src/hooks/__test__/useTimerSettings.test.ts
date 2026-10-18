import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { useTimerSettings } from "../useTimerSettings";

describe("useTimerSettings", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should use default timer settings", () => {
    const { result } = renderHook(() => useTimerSettings());

    expect(result.current.settings).toEqual({
      pomodoroDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 900,
      longBreakInterval: 4,
    });
  });

  it("should update timer settings", () => {
    const { result } = renderHook(() => useTimerSettings());

    act(() => {
      result.current.setSettings({
        pomodoroDuration: 30,
        shortBreakDuration: 10,
        longBreakDuration: 20,
        longBreakInterval: 3,
      });
    });

    expect(result.current.settings).toEqual({
      pomodoroDuration: 30,
      shortBreakDuration: 10,
      longBreakDuration: 20,
      longBreakInterval: 3,
    });
  });

  it("should persist timer settings", () => {
    const { result, unmount } = renderHook(() => useTimerSettings());

    act(() => {
      result.current.setSettings({
        pomodoroDuration: 30,
        shortBreakDuration: 10,
        longBreakDuration: 20,
        longBreakInterval: 3,
      });
    });

    unmount();

    const { result: newResult } = renderHook(() => useTimerSettings());

    expect(newResult.current.settings).toEqual({
      pomodoroDuration: 30,
      shortBreakDuration: 10,
      longBreakDuration: 20,
      longBreakInterval: 3,
    });
  });

  it("should fall back to defaults when persisted settings are not an object", () => {
    localStorage.setItem("luno-timer-settings", JSON.stringify(42));

    const { result } = renderHook(() => useTimerSettings());

    expect(result.current.settings).toEqual({
      pomodoroDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 900,
      longBreakInterval: 4,
    });
  });

  it("should replace invalid values with defaults", () => {
    localStorage.setItem(
      "luno-timer-settings",
      JSON.stringify({
        pomodoroDuration: 0,
        shortBreakDuration: -5,
        longBreakDuration: "900",
        longBreakInterval: 500000000,
      }),
    );

    const { result } = renderHook(() => useTimerSettings());

    expect(result.current.settings).toEqual({
      pomodoroDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 900,
      longBreakInterval: 4,
    });
  });

  it("should merge valid persisted values with defaults", () => {
    localStorage.setItem(
      "luno-timer-settings",
      JSON.stringify({ pomodoroDuration: 30 }),
    );

    const { result } = renderHook(() => useTimerSettings());

    expect(result.current.settings).toEqual({
      pomodoroDuration: 30,
      shortBreakDuration: 300,
      longBreakDuration: 900,
      longBreakInterval: 4,
    });
  });
});
