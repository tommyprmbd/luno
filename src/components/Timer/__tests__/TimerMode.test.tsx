import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TimerMode from "../TimerMode";

describe("TimerMode", () => {
  it("should render all timer modes", () => {
    render(<TimerMode mode="pomodoro" onChange={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Pomodoro" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Short Break" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Long Break" }),
    ).toBeInTheDocument();
  });

  it("should change timer mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimerMode mode="pomodoro" onChange={onChange} />);

    await user.click(
      screen.getByRole("button", {
        name: "Short Break",
      }),
    );

    expect(onChange).toHaveBeenCalledWith("short-break");
  });
});
