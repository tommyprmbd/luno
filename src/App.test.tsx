import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { TIMER_DURATION } from "./constants/timer";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render the timer and task list", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "START" })).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "New Task" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Add a task to get started.")).toBeInTheDocument();
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
        name: "ADD",
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
        name: "ADD",
      }),
    );

    await user.type(input, "Write tests");

    await user.click(
      screen.getByRole("button", {
        name: "ADD",
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
        name: "ADD",
      }),
    );

    await user.type(input, "Write tests");

    await user.click(
      screen.getByRole("button", {
        name: "ADD",
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
        name: "ADD",
      }),
    );

    await user.type(input, "Write tests");

    await user.click(
      screen.getByRole("button", {
        name: "ADD",
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
        name: "ADD",
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

  it("should show long break after four completed pomodoros", () => {
    vi.useFakeTimers();

    try {
      render(<App />);

      act(() => {
        screen
          .getByRole("button", {
            name: "START",
          })
          .click();
      });

      for (let session = 1; session <= 4; session++) {
        act(() => {
          vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
        });

        if (session < 4) {
          expect(
            screen.getByRole("button", {
              name: "Short Break",
            }),
          ).toBeInTheDocument();

          act(() => {
            vi.advanceTimersByTime(TIMER_DURATION["short-break"] * 1000);
          });

          expect(
            screen.getByRole("button", {
              name: "Pomodoro",
            }),
          ).toBeInTheDocument();
        }
      }

      expect(
        screen.getByRole("button", {
          name: "Long Break",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByLabelText("Pomodoro progress: 4 of 4 completed"),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "PAUSE",
        }),
      ).toBeInTheDocument();
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
            name: "ADD",
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

      act(() => {
        screen.getByRole("button", { name: "START" }).click();
      });

      act(() => {
        vi.advanceTimersByTime(TIMER_DURATION.pomodoro * 1000);
      });

      expect(
        screen.getByLabelText("Pomodoro progress: 1 of 4 completed"),
      ).toBeInTheDocument();

      expect(screen.getByRole("button", { name: "RESET" })).toBeInTheDocument();

      act(() => {
        screen.getByRole("button", { name: "RESET" }).click();
      });

      expect(
        screen.getByLabelText("Pomodoro progress: 1 of 4 completed"),
      ).toBeInTheDocument();

      expect(screen.getByRole("button", { name: "START" })).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
