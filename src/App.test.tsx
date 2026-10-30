import { StrictMode } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import {
  AMBIENCE_RAIN,
  DEFAULT_AMBIENCE_VOLUME,
  SOUND_FX,
} from "./constants/audio";
import { TIMER_DURATION } from "./constants/timer";

type SentNotification = {
  title: string;
  options?: NotificationOptions;
};

let sentNotifications: SentNotification[] = [];

class MockNotification {
  static permission: NotificationPermission = "default";
  static requestPermission = vi.fn(async () => MockNotification.permission);

  constructor(title: string, options?: NotificationOptions) {
    sentNotifications.push({ title, options });
  }
}

class MockAudio {
  static instances: MockAudio[] = [];
  static playImpl = () => Promise.resolve();

  src: string;
  loop = false;
  volume = 1;
  play = vi.fn(() => MockAudio.playImpl());
  pause = vi.fn();

  constructor(src?: string) {
    this.src = src ?? "";
    MockAudio.instances.push(this);
  }
}

const audioSources = () => MockAudio.instances.map((audio) => audio.src);

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    sentNotifications = [];
    MockNotification.permission = "default";
    MockNotification.requestPermission = vi.fn(
      async () => MockNotification.permission,
    );
    MockAudio.instances = [];
    MockAudio.playImpl = () => Promise.resolve();
    vi.stubGlobal("Notification", MockNotification);
    vi.stubGlobal("Audio", MockAudio);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should render the timer and task list", () => {
    render(<App />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "START" })).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "New Task" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Add a task to get started.")).toBeInTheDocument();
  });

  it("should play the start cue for every session start", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      expect(audioSources()).toEqual([SOUND_FX.pomodoroStart]);

      act(() => {
        screen.getByRole("button", { name: "PAUSE" }).click();
      });
      act(() => {
        screen.getByRole("button", { name: "RESUME" }).click();
      });

      expect(audioSources()).toEqual([SOUND_FX.pomodoroStart]);

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      // starting the break reuses the same start cue as a pomodoro.
      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      expect(audioSources()).toEqual([
        SOUND_FX.pomodoroStart,
        SOUND_FX.pomodoroFinish,
        SOUND_FX.pomodoroStart,
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should play the matching cue when a session finishes", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });
      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(audioSources().at(-1)).toBe(SOUND_FX.pomodoroFinish);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });
      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION["short-break"] * 1000);
      });

      expect(audioSources().at(-1)).toBe(SOUND_FX.breakFinish);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should keep working when a cue cannot play", () => {
    MockAudio.playImpl = () => Promise.reject(new Error("blocked"));
    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });
      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(
        screen.getByRole("alertdialog", {
          name: "Pomodoro complete. Time for a break.",
        }),
      ).toBeInTheDocument();
      expect(
        JSON.parse(localStorage.getItem("luno:sessions") ?? "[]"),
      ).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should toggle the rainfall soundscape from the header", async () => {
    const user = userEvent.setup();

    render(<App />);

    const sound = screen.getByRole("button", {
      name: "Rainfall soundscape",
    });

    await user.click(sound);

    const rain = MockAudio.instances.find(
      (audio) => audio.src === AMBIENCE_RAIN,
    );

    expect(rain?.volume).toBe(DEFAULT_AMBIENCE_VOLUME / 100);
    expect(rain?.play).toHaveBeenCalledTimes(1);
    expect(sound).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Turn Off" }));

    expect(rain?.pause).toHaveBeenCalledTimes(1);
    expect(sound).toHaveAttribute("aria-pressed", "false");
  });

  it("should apply saved timer settings and persist them", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Settings" }));

    const pomodoro = screen.getByLabelText("Pomodoro duration (minutes)");
    const shortBreak = screen.getByLabelText(
      "Short break duration (minutes)",
    );
    const longBreak = screen.getByLabelText("Long break duration (minutes)");
    const interval = screen.getByLabelText(
      "Long break interval (Pomodoros)",
    );

    await user.clear(pomodoro);
    await user.type(pomodoro, "30");
    await user.clear(shortBreak);
    await user.type(shortBreak, "10");
    await user.clear(longBreak);
    await user.type(longBreak, "20");
    await user.clear(interval);
    await user.type(interval, "3");

    await user.click(screen.getByRole("button", { name: "SAVE" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveTextContent("30:00");

    expect(
      screen.getByLabelText("Pomodoro progress: 0 of 3 completed"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Short Break" }));

    expect(screen.getByRole("timer")).toHaveTextContent("10:00");

    expect(JSON.parse(localStorage.getItem("luno-timer-settings")!)).toEqual({
      pomodoroDuration: 1800,
      shortBreakDuration: 600,
      longBreakDuration: 1200,
      longBreakInterval: 3,
    });
  });

  it("should discard timer settings when cancelled", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Settings" }));

    const pomodoro = screen.getByLabelText("Pomodoro duration (minutes)");

    await user.clear(pomodoro);
    await user.type(pomodoro, "30");
    await user.click(screen.getByRole("button", { name: "CANCEL" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveTextContent("25:00");

    expect(
      JSON.parse(localStorage.getItem("luno-timer-settings")!).pomodoroDuration,
    ).toBe(1500);
  });

  it("should show saved settings when reopened", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Settings" }));

    const pomodoro = screen.getByLabelText("Pomodoro duration (minutes)");

    await user.clear(pomodoro);
    await user.type(pomodoro, "30");
    await user.click(screen.getByRole("button", { name: "SAVE" }));

    await user.click(screen.getByRole("button", { name: "Settings" }));

    expect(
      screen.getByLabelText("Pomodoro duration (minutes)"),
    ).toHaveValue(30);
  });

  it("should keep saved settings after reload", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole("button", { name: "Settings" }));

    const pomodoro = screen.getByLabelText("Pomodoro duration (minutes)");

    await user.clear(pomodoro);
    await user.type(pomodoro, "30");
    await user.click(screen.getByRole("button", { name: "SAVE" }));

    expect(screen.getByRole("timer")).toHaveTextContent("30:00");

    unmount();
    render(<App />);

    expect(screen.getByRole("timer")).toHaveTextContent("30:00");
  });

  it("should request notification permission from settings", async () => {
    const user = userEvent.setup();

    MockNotification.requestPermission.mockImplementation(async () => {
      MockNotification.permission = "granted";
      return "granted";
    });

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Settings" }));

    expect(
      screen.getByText(
        "Get a browser notification when a timer session finishes.",
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "ENABLE NOTIFICATIONS" }),
    );

    expect(
      await screen.findByText("Notifications are enabled."),
    ).toBeInTheDocument();
  });

  it("should keep a running session duration and apply settings on reset", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      act(() => {
        screen.getByRole("button", { name: "Settings" }).click();
      });

      fireEvent.change(
        screen.getByLabelText("Pomodoro duration (minutes)"),
        { target: { value: "30" } },
      );

      act(() => {
        screen.getByRole("button", { name: "SAVE" }).click();
      });

      expect(screen.getByRole("timer")).toHaveTextContent("24:57");

      act(() => {
        screen.getByRole("button", { name: "RESET" }).click();
      });

      expect(screen.getByRole("timer")).toHaveTextContent("30:00");
    } finally {
      vi.useRealTimers();
    }
  });

  it("should select a task while timer is idle", async () => {
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByRole("textbox", {
      name: "New Task",
    });

    await user.type(input, "Build Luno");

    await user.click(
      screen.getByRole("button", {
        name: "Add Task",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "FOCUS",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "START",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("checkbox", {
        name: "Build Luno",
      }),
    ).not.toBeChecked();

    expect(screen.getAllByText("Build Luno")).toHaveLength(2);
  });

  it("should not allow selecting another task while timer is running", async () => {
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByRole("textbox", {
      name: "New Task",
    });

    await user.type(input, "Build Luno");

    await user.click(
      screen.getByRole("button", {
        name: "Add Task",
      }),
    );

    await user.type(input, "Write tests");

    await user.click(
      screen.getByRole("button", {
        name: "Add Task",
      }),
    );

    const focusButtons = screen.getAllByRole("button", {
      name: "FOCUS",
    });

    await user.click(focusButtons[0]);

    await user.click(
      screen.getByRole("button", {
        name: "START",
      }),
    );

    expect(screen.getAllByText("Build Luno")).toHaveLength(2);

    expect(
      screen.getAllByRole("button", {
        name: "FOCUS",
      })[1],
    ).toBeDisabled();
  });

  it("should not allow toggling another task while timer is running", async () => {
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByRole("textbox", {
      name: "New Task",
    });

    await user.type(input, "Build Luno");

    await user.click(
      screen.getByRole("button", {
        name: "Add Task",
      }),
    );

    await user.type(input, "Write tests");

    await user.click(
      screen.getByRole("button", {
        name: "Add Task",
      }),
    );

    await user.click(
      screen.getAllByRole("button", {
        name: "FOCUS",
      })[0],
    );

    await user.click(
      screen.getByRole("button", {
        name: "START",
      }),
    );

    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes[1]).toBeDisabled();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("should allow task selection again after timer is paused", async () => {
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByRole("textbox", {
      name: "New Task",
    });

    await user.type(input, "Build Luno");

    await user.click(
      screen.getByRole("button", {
        name: "Add Task",
      }),
    );

    await user.type(input, "Write tests");

    await user.click(
      screen.getByRole("button", {
        name: "Add Task",
      }),
    );

    await user.click(
      screen.getAllByRole("button", {
        name: "FOCUS",
      })[0],
    );

    await user.click(
      screen.getByRole("button", {
        name: "START",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "PAUSE",
      }),
    );

    await user.click(
      screen.getAllByRole("button", {
        name: "FOCUS",
      })[1],
    );

    expect(screen.getAllByText("Write tests")).toHaveLength(2);
  });

  it("should allow deleting a task while timer is running", async () => {
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByRole("textbox", {
      name: "New Task",
    });

    await user.type(input, "Build Luno");

    await user.click(
      screen.getByRole("button", {
        name: "Add Task",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "FOCUS",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "START",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Delete Build Luno",
      }),
    );

    expect(screen.queryByText("Build Luno")).not.toBeInTheDocument();

    expect(screen.getByText("Add a task to get started.")).toBeInTheDocument();
  });

  it("should update pomodoro progress when a pomodoro finishes", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      expect(
        screen.getByLabelText("Pomodoro progress: 0 of 4 completed"),
      ).toBeInTheDocument();

      act(() => {
        screen
          .getByRole("button", {
            name: "START",
          })
          .click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(
        screen.getByLabelText("Pomodoro progress: 1 of 4 completed"),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "Short Break",
        }),
      ).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("should show the completion alert and auto dismiss it after five seconds", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(
        screen.getByRole("alertdialog", {
          name: "Pomodoro complete. Time for a break.",
        }),
      ).toBeInTheDocument();
      expect(screen.getByText("Closing in 5s")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("should show long break after four completed pomodoros", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      for (let session = 1; session <= 4; session++) {
        // Start Pomodoro manually.
        act(() => {
          screen.getByRole("button", { name: "START" }).click();
        });

        // Complete Pomodoro.
        act(() => {
          vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
        });

        if (session < 4) {
          expect(
            screen.getByRole("button", { name: "Short Break" }),
          ).toBeInTheDocument();

          // Start short break manually.
          act(() => {
            screen.getByRole("button", { name: "START" }).click();
          });

          // Complete short break.
          act(() => {
            vi.advanceTimersByTime(TIMER_DURATION["short-break"] * 1000);
          });

          expect(
            screen.getByRole("button", { name: "Pomodoro" }),
          ).toHaveAttribute("aria-pressed", "true");
        }
      }

      expect(
        screen.getByRole("button", { name: "Long Break" }),
      ).toHaveAttribute("aria-pressed", "true");

      expect(
        screen.getByLabelText("Pomodoro progress: 4 of 4 completed"),
      ).toBeInTheDocument();

      expect(screen.getByRole("button", { name: "START" })).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("should not automatically complete the active task when pomodoro finishes", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      const input = screen.getByRole("textbox", {
        name: "New Task",
      });

      act(() => {
        input.focus();
      });

      act(() => {
        const event = new Event("input", {
          bubbles: true,
        });

        Object.defineProperty(input, "value", {
          value: "Build Luno",
          writable: true,
        });

        input.dispatchEvent(event);
      });

      act(() => {
        screen
          .getByRole("button", {
            name: "Add Task",
          })
          .click();
      });

      act(() => {
        screen
          .getByRole("button", {
            name: "FOCUS",
          })
          .click();
      });

      act(() => {
        screen
          .getByRole("button", {
            name: "START",
          })
          .click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(screen.getByRole("checkbox")).not.toBeChecked();

      expect(screen.getAllByText("Build Luno")).toHaveLength(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should count a completed pomodoro on the active task", () => {
    localStorage.setItem(
      "luno:tasks",
      JSON.stringify([
        { id: "task-1", title: "Build Luno", completed: false, completedPomodoros: 0 },
      ]),
    );
    localStorage.setItem("luno:active-task-id", JSON.stringify("task-1"));

    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      const stored = JSON.parse(localStorage.getItem("luno:tasks")!);

      expect(stored[0].completedPomodoros).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should not count a completed break", () => {
    localStorage.setItem(
      "luno:tasks",
      JSON.stringify([
        { id: "task-1", title: "Build Luno", completed: false, completedPomodoros: 0 },
      ]),
    );
    localStorage.setItem("luno:active-task-id", JSON.stringify("task-1"));

    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION["short-break"] * 1000);
      });

      const stored = JSON.parse(localStorage.getItem("luno:tasks")!);

      expect(stored[0].completedPomodoros).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should not count a pomodoro when no task is active", () => {
    localStorage.setItem(
      "luno:tasks",
      JSON.stringify([
        { id: "task-1", title: "Build Luno", completed: false, completedPomodoros: 0 },
      ]),
    );

    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      const stored = JSON.parse(localStorage.getItem("luno:tasks")!);

      expect(stored[0].completedPomodoros).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should record a completed pomodoro session", () => {
    localStorage.setItem(
      "luno:tasks",
      JSON.stringify([
        { id: "task-1", title: "Build Luno", completed: false, completedPomodoros: 0 },
      ]),
    );
    localStorage.setItem("luno:active-task-id", JSON.stringify("task-1"));

    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      const stored = JSON.parse(localStorage.getItem("luno:sessions")!);

      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({
        mode: "pomodoro",
        durationSeconds: TIMER_DURATION.pomodoro,
        taskTitle: "Build Luno",
      });
      expect(stored[0].completedAt).toEqual(expect.any(Number));

      act(() => {
        screen.getByRole("button", { name: "History" }).click();
      });

      const dialog = screen.getByRole("dialog", { name: "Session history" });

      expect(dialog).toBeInTheDocument();
      expect(screen.getByText("1 Pomo")).toBeInTheDocument();
      expect(within(dialog).getAllByRole("listitem")).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should record breaks without attributing them to a task", () => {
    localStorage.setItem(
      "luno:tasks",
      JSON.stringify([
        { id: "task-1", title: "Build Luno", completed: false, completedPomodoros: 0 },
      ]),
    );
    localStorage.setItem("luno:active-task-id", JSON.stringify("task-1"));

    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION["short-break"] * 1000);
      });

      const stored = JSON.parse(localStorage.getItem("luno:sessions")!);

      expect(stored.map((session: { mode: string }) => session.mode)).toEqual([
        "pomodoro",
        "short-break",
      ]);
      expect(stored[0].taskTitle).toBe("Build Luno");
      expect(stored[1].taskTitle).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("should record a focus session without an active task", () => {
    localStorage.setItem(
      "luno:tasks",
      JSON.stringify([
        { id: "task-1", title: "Build Luno", completed: false, completedPomodoros: 0 },
      ]),
    );

    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      const stored = JSON.parse(localStorage.getItem("luno:sessions")!);

      expect(stored).toHaveLength(1);
      expect(stored[0].taskTitle).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("should record history when the notification API fails", () => {
    vi.stubGlobal(
      "Notification",
      class {
        static get permission(): NotificationPermission {
          throw new Error("notifications blocked");
        }
      },
    );

    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(JSON.parse(localStorage.getItem("luno:sessions")!)).toHaveLength(1);

      act(() => {
        screen.getByRole("button", { name: "History" }).click();
      });

      expect(screen.getByText("1 Pomo")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("should record and notify only once per completion in StrictMode", () => {
    MockNotification.permission = "granted";
    localStorage.setItem(
      "luno:tasks",
      JSON.stringify([
        { id: "task-1", title: "Build Luno", completed: false, completedPomodoros: 0 },
      ]),
    );
    localStorage.setItem("luno:active-task-id", JSON.stringify("task-1"));

    vi.useFakeTimers();

    try {
      render(
        <StrictMode>
          <App />
        </StrictMode>,
      );

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(JSON.parse(localStorage.getItem("luno:sessions")!)).toHaveLength(1);
      expect(sentNotifications).toHaveLength(1);
      expect(
        JSON.parse(localStorage.getItem("luno:tasks")!)[0].completedPomodoros,
      ).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should notify when a focus or break session completes", () => {
    MockNotification.permission = "granted";

    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION["short-break"] * 1000);
      });

      expect(sentNotifications).toEqual([
        {
          title: "Pomodoro complete",
          options: {
            body: "Time for a break.",
            tag: "luno-session-complete",
          },
        },
        {
          title: "Short break complete",
          options: {
            body: "Ready for another Pomodoro?",
            tag: "luno-session-complete",
          },
        },
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should keep working without notifications when permission is denied", () => {
    MockNotification.permission = "denied";

    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(sentNotifications).toEqual([]);
      expect(
        screen.getByLabelText("Pomodoro progress: 1 of 4 completed"),
      ).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("should keep working when notifications are unsupported", () => {
    vi.stubGlobal("Notification", undefined);

    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(sentNotifications).toEqual([]);
      expect(
        screen.getByLabelText("Pomodoro progress: 1 of 4 completed"),
      ).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("should not notify when a session is reset", () => {
    MockNotification.permission = "granted";

    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      act(() => {
        screen.getByRole("button", { name: "RESET" }).click();
      });

      expect(sentNotifications).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should show persisted history after reload", async () => {
    const now = new Date();
    const todayAt = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      10,
      0,
    ).getTime();

    localStorage.setItem(
      "luno:sessions",
      JSON.stringify([
        {
          mode: "pomodoro",
          completedAt: todayAt,
          durationSeconds: 1500,
          taskTitle: "Build Luno",
        },
      ]),
    );

    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "History" }));

    expect(screen.getByText("1 Pomo")).toBeInTheDocument();
    expect(screen.getByText("Today's Focus").closest(".history-stat")).toHaveTextContent("25m");
    expect(screen.getByText("Build Luno")).toBeInTheDocument();
  });

  it("should not allow changing timer mode while running", () => {
    render(<App />);

    act(() => {
      screen
        .getByRole("button", {
          name: "START",
        })
        .click();
    });

    act(() => {
      screen
        .getByRole("button", {
          name: "Short Break",
        })
        .click();
    });

    expect(
      screen.getByRole("button", {
        name: "Pomodoro",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Short Break",
      }),
    ).toBeInTheDocument();
  });

  it("should preserve remaining time when paused and resume from it", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByText("24:55")).toBeInTheDocument();

      act(() => {
        screen.getByRole("button", { name: "PAUSE" }).click();
      });

      expect(screen.getByText("24:55")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "RESUME" }),
      ).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByText("24:55")).toBeInTheDocument();

      act(() => {
        screen.getByRole("button", { name: "RESUME" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByText("24:50")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("should reset timer without resetting pomodoro progress", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      // Start Pomodoro.
      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      // Complete Pomodoro; next mode becomes short break.
      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(
        screen.getByLabelText("Pomodoro progress: 1 of 4 completed"),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: "Short Break" }),
      ).toHaveAttribute("aria-pressed", "true");

      // Start the short break, pause it, then reset it.
      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      act(() => {
        screen.getByRole("button", { name: "PAUSE" }).click();
      });

      act(() => {
        screen.getByRole("button", { name: "RESET" }).click();
      });

      // Progress must remain unchanged.
      expect(
        screen.getByLabelText("Pomodoro progress: 1 of 4 completed"),
      ).toBeInTheDocument();

      expect(screen.getByRole("button", { name: "START" })).toBeInTheDocument();

      expect(screen.getByRole("timer")).toHaveTextContent("05:00");
    } finally {
      vi.useRealTimers();
    }
  });

  it("should not add an empty task", async () => {
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByRole("textbox", {
      name: "New Task",
    });

    await user.type(input, "   ");

    await user.click(
      screen.getByRole("button", {
        name: "Add Task",
      }),
    );

    expect(screen.getByText("Add a task to get started.")).toBeInTheDocument();
  });

  it("should render a long task title", async () => {
    const user = userEvent.setup();

    render(<App />);

    const longTitle =
      "This is a very long task title that should remain usable on small screens";

    await user.type(
      screen.getByRole("textbox", {
        name: "New Task",
      }),
      longTitle,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Add Task",
      }),
    );

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it("should update the document title with the current timer and mode", () => {
    render(<App />);

    expect(document.title).toBe("25:00 - Pomodoro | Luno");
  });

  it("should update the document title when the timer runs", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(document.title).toBe("24:57 - Pomodoro | Luno");
    } finally {
      vi.useRealTimers();
    }
  });

  it("should show the current break mode in the document title", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(document.title).toBe("05:00 - Short Break | Luno");
    } finally {
      vi.useRealTimers();
    }
  });

  it("should reflect the configured long break interval in the progress label", () => {
    localStorage.setItem(
      "luno-timer-settings",
      JSON.stringify({
        pomodoroDuration: 1500,
        shortBreakDuration: 300,
        longBreakDuration: 900,
        longBreakInterval: 3,
      }),
    );

    render(<App />);

    expect(
      screen.getByLabelText("Pomodoro progress: 0 of 3 completed"),
    ).toBeInTheDocument();
  });
});
