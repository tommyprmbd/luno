import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TimerProgress from "../TimerProgress";

describe("TimerProgress", () => {
  it("should show progress indicators for the configured interval", () => {
    render(<TimerProgress completedPomodoros={0} longBreakInterval={4} />);

    expect(
      screen.getByLabelText("Pomodoro progress: 0 of 4 completed"),
    ).toBeInTheDocument();
  });

  it("should mark completed pomodoros", () => {
    render(<TimerProgress completedPomodoros={2} longBreakInterval={4} />);

    const progress = screen.getByLabelText(
      "Pomodoro progress: 2 of 4 completed",
    );

    expect(progress.querySelectorAll(".completed")).toHaveLength(2);
  });

  it("should mark all pomodoros as completed", () => {
    render(<TimerProgress completedPomodoros={4} longBreakInterval={4} />);

    const progress = screen.getByLabelText(
      "Pomodoro progress: 4 of 4 completed",
    );

    expect(progress.querySelectorAll(".completed")).toHaveLength(4);
  });

  it("should reflect a custom long break interval", () => {
    render(<TimerProgress completedPomodoros={1} longBreakInterval={3} />);

    const progress = screen.getByLabelText(
      "Pomodoro progress: 1 of 3 completed",
    );

    expect(progress.querySelectorAll(".timer-progress-dot")).toHaveLength(3);
    expect(progress.querySelectorAll(".completed")).toHaveLength(1);
  });

  it("should expose pomodoro progress to assistive technology", () => {
    render(<TimerProgress completedPomodoros={2} longBreakInterval={4} />);

    expect(
      screen.getByRole("status", {
        name: "Pomodoro progress: 2 of 4 completed",
      }),
    ).toBeInTheDocument();
  });
});
