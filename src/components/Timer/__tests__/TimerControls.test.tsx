import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TimerControls from "../TimerControls";

describe("TimerControls", () => {
  it("should show START when idle", () => {
    render(
      <TimerControls
        status="idle"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "START" })).toBeInTheDocument();
  });

  it("should call onStart", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(
      <TimerControls
        status="idle"
        onStart={onStart}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "START" }));

    expect(onStart).toHaveBeenCalled();
  });

  it("should show PAUSE and RESET when running", () => {
    render(
      <TimerControls
        status="running"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "PAUSE" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "RESET" })).toBeInTheDocument();
  });

  it("should show RESUME and RESET when paused", () => {
    render(
      <TimerControls
        status="paused"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "RESUME" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "RESET" })).toBeInTheDocument();
  });
});
