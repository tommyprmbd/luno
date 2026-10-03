import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TimerProgress from "../TimerProgress";

describe("TimerProgress", () => {
  it("should show four progress indicators", () => {
    render(<TimerProgress completedPomodoros={0} />);

    expect(
      screen.getByLabelText("Pomodoro progress: 0 of 4 completed"),
    ).toBeInTheDocument();
  });

  it("should mark completed pomodoros", () => {
    render(<TimerProgress completedPomodoros={2} />);

    const progress = screen.getByLabelText(
      "Pomodoro progress: 2 of 4 completed",
    );

    expect(progress.querySelectorAll(".completed")).toHaveLength(2);
  });

  it("should mark all pomodoros as completed", () => {
    render(<TimerProgress completedPomodoros={4} />);

    const progress = screen.getByLabelText(
      "Pomodoro progress: 4 of 4 completed",
    );

    expect(progress.querySelectorAll(".completed")).toHaveLength(4);
  });
});
