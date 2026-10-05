import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
    expect(result.current.remainingSeconds).toBe(TIMER_DURATION.pomodoro);
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

    expect(result.current.remainingSeconds).toBe(TIMER_DURATION.pomodoro - 3);
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
    expect(result.current.remainingSeconds).toBe(TIMER_DURATION.pomodoro);
  });

  it("should change timer mode", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.changeMode("short-break");
    });

    expect(result.current.mode).toBe("short-break");
    expect(result.current.status).toBe("idle");
    expect(result.current.remainingSeconds).toBe(TIMER_DURATION["short-break"]);
  });

  it("should stop at zero when timer finishes", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
    });

    expect(result.current.remainingSeconds).toBe(TIMER_DURATION["short-break"]);
    expect(result.current.mode).toBe("short-break");
    expect(result.current.status).toBe("running");
  });

  it("should switch to short break when pomodoro finishes", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
    });

    expect(result.current.mode).toBe("short-break");
    expect(result.current.status).toBe("running");
    expect(result.current.remainingSeconds).toBe(TIMER_DURATION["short-break"]);

    vi.useRealTimers();
  });

  it("should switch to long break after four completed pomodoros", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    for (let session = 1; session <= 4; session++) {
      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(result.current.completedPomodoros).toBe(session);

      if (session < 4) {
        expect(result.current.mode).toBe("short-break");

        act(() => {
          vi.advanceTimersByTime(TIMER_DURATION["short-break"] * 1000);
        });

        expect(result.current.mode).toBe("pomodoro");
        expect(result.current.status).toBe("running");
      }
    }

    expect(result.current.mode).toBe("long-break");
    expect(result.current.remainingSeconds).toBe(TIMER_DURATION["long-break"]);
    expect(result.current.status).toBe("running");
  });

  it("should not increment completed pomodoros when a break finishes", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
    });

    expect(result.current.completedPomodoros).toBe(1);
    expect(result.current.mode).toBe("short-break");

    act(() => {
      vi.advanceTimersByTime(TIMER_DURATION["short-break"] * 1000);
    });

    expect(result.current.completedPomodoros).toBe(1);
    expect(result.current.mode).toBe("pomodoro");
    expect(result.current.status).toBe("running");
  });

  it("should preserve completed pomodoros when timer is reset", () => {
    vi.useFakeTimers();

    try {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(result.current.completedPomodoros).toBe(1);

      act(() => {
        result.current.reset();
      });

      expect(result.current.completedPomodoros).toBe(1);
      expect(result.current.status).toBe("idle");
      expect(result.current.remainingSeconds).toBe(
        TIMER_DURATION["short-break"],
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it("should preserve completed pomodoros when mode changes manually", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.changeMode("short-break");
    });

    expect(result.current.completedPomodoros).toBe(0);

    act(() => {
      result.current.changeMode("pomodoro");
    });

    expect(result.current.completedPomodoros).toBe(0);
    expect(result.current.mode).toBe("pomodoro");
    expect(result.current.remainingSeconds).toBe(TIMER_DURATION.pomodoro);
  });

  it("should reset completed pomodoros after long break finishes", () => {
    vi.useFakeTimers();

    try {
      const { result } = renderHook(() => useTimer());

      for (let session = 1; session <= 4; session++) {
        act(() => {
          result.current.changeMode("pomodoro");
          result.current.start();
        });

        act(() => {
          vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
        });

        expect(result.current.completedPomodoros).toBe(session);

        if (session < 4) {
          expect(result.current.mode).toBe("short-break");

          act(() => {
            result.current.start();
          });

          act(() => {
            vi.advanceTimersByTime(TIMER_DURATION["short-break"] * 1000);
          });

          expect(result.current.status).toBe("running");
        }
      }

      expect(result.current.completedPomodoros).toBe(4);
      expect(result.current.mode).toBe("long-break");
      expect(result.current.remainingSeconds).toBe(
        TIMER_DURATION["long-break"],
      );
      expect(result.current.status).toBe("running");

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION["long-break"] * 1000);
      });

      expect(result.current.completedPomodoros).toBe(0);
      expect(result.current.mode).toBe("pomodoro");
      expect(result.current.remainingSeconds).toBe(TIMER_DURATION.pomodoro);
      expect(result.current.status).toBe("running");
    } finally {
      vi.useRealTimers();
    }
  });

  it("should automatically start short break after pomodoro finishes", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
    });

    expect(result.current.mode).toBe("short-break");
    expect(result.current.status).toBe("running");
    expect(result.current.remainingSeconds).toBe(TIMER_DURATION["short-break"]);
    expect(result.current.completedPomodoros).toBe(1);
  });

  it("should automatically start pomodoro after short break finishes", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
    });

    act(() => {
      vi.advanceTimersByTime(TIMER_DURATION["short-break"] * 1000);
    });

    expect(result.current.mode).toBe("pomodoro");
    expect(result.current.status).toBe("running");
    expect(result.current.remainingSeconds).toBe(TIMER_DURATION.pomodoro);
  });

  it("should automatically start pomodoro after long break finishes", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start();
    });

    for (let i = 0; i < 4; i += 1) {
      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      if (i < 3) {
        act(() => {
          vi.advanceTimersByTime(TIMER_DURATION["short-break"] * 1000);
        });
      }
    }

    expect(result.current.mode).toBe("long-break");
    expect(result.current.status).toBe("running");
    expect(result.current.completedPomodoros).toBe(4);

    act(() => {
      vi.advanceTimersByTime(TIMER_DURATION["long-break"] * 1000);
    });

    expect(result.current.mode).toBe("pomodoro");
    expect(result.current.status).toBe("running");
    expect(result.current.remainingSeconds).toBe(TIMER_DURATION.pomodoro);
    expect(result.current.completedPomodoros).toBe(0);
  });
});
