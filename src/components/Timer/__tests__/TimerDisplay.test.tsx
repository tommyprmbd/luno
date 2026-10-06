import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TimerDisplay from "../TimerDisplay";

describe("TimerDisplay", () => {
  it("should display formatted time", () => {
    render(<TimerDisplay remainingSeconds={1500} />);

    expect(screen.getByText("25:00")).toBeInTheDocument();
    expect(screen.getByRole("timer")).toBeInTheDocument();
  });

  it("should display zero-padded seconds", () => {
    render(<TimerDisplay remainingSeconds={65} />);

    expect(screen.getByText("01:05")).toBeInTheDocument();
    expect(screen.getByRole("timer")).toBeInTheDocument();
  });
});
