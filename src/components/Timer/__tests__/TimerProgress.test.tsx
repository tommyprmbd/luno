import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TimerProgress from "../TimerProgress";

describe("TimerProgress", () => {
  it("should show the current orbit for the configured interval", () => {
    render(<TimerProgress completedPomodoros={0} longBreakInterval={4} />);

    expect(
      screen.getByLabelText("Pomodoro progress: 0 of 4 completed"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Orbit 1 \/ 4/)).toBeInTheDocument();
  });

  it("should move to the next orbit after a completed pomodoro", () => {
    render(<TimerProgress completedPomodoros={2} longBreakInterval={4} />);

    expect(
      screen.getByLabelText("Pomodoro progress: 2 of 4 completed"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Orbit 3 \/ 4/)).toBeInTheDocument();
  });

  it("should not exceed the final orbit", () => {
    render(<TimerProgress completedPomodoros={4} longBreakInterval={4} />);

    expect(screen.getByText(/Orbit 4 \/ 4/)).toBeInTheDocument();
  });

  it("should reflect a custom long break interval", () => {
    render(<TimerProgress completedPomodoros={1} longBreakInterval={3} />);

    expect(
      screen.getByLabelText("Pomodoro progress: 1 of 3 completed"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Orbit 2 \/ 3/)).toBeInTheDocument();
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
