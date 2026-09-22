import { act, renderHook } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { useTimer } from "../useTimer";
import { TIMER_DURATION } from "../../constants/timer";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with pomodoro mode", () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.mode).toBe("pomodoro");
    expect(result.current.status).toBe("idle");
    expect(result.current.remainingSeconds).toBe(
      TIMER_DURATION.pomodoro,
    );
  });

  it("should start the timer", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    expect(result.current.status).toBe("running");
  });

  it("should pause the timer", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.pause();
    });

    expect(result.current.status).toBe("paused");
  });

  it("should decrease remaining seconds while running", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.remainingSeconds).toBe(
      TIMER_DURATION.pomodoro - 3,
    );
  });

  it("should reset the timer", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(10000);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.remainingSeconds).toBe(
      TIMER_DURATION.pomodoro,
    );
  });

  it("should change timer mode", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.changeMode("short-break");
    });

    expect(result.current.mode).toBe("short-break");
    expect(result.current.status).toBe("idle");
    expect(result.current.remainingSeconds).toBe(
      TIMER_DURATION["short-break"],
    );
  });

  it("should stop at zero when timer finishes", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
    });

    expect(result.current.remainingSeconds).toBe(0);
    expect(result.current.status).toBe("idle");
  });
});