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

  it("should call onPause when PAUSE is clicked", async () => {
    const user = userEvent.setup();
    const onPause = vi.fn();

    render(
      <TimerControls
        status="running"
        onStart={vi.fn()}
        onPause={onPause}
        onReset={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "PAUSE" }));

    expect(onPause).toHaveBeenCalled();
  });

  it("should call onReset when RESET is clicked while running", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(
      <TimerControls
        status="running"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={onReset}
      />,
    );

    await user.click(screen.getByRole("button", { name: "RESET" }));

    expect(onReset).toHaveBeenCalled();
  });

  it("should call onStart when RESUME is clicked", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(
      <TimerControls
        status="paused"
        onStart={onStart}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "RESUME" }));

    expect(onStart).toHaveBeenCalled();
  });
});
