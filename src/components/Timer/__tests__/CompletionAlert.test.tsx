import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CompletionAlert from "../CompletionAlert";

describe("CompletionAlert", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should show the completion message as an alert dialog", () => {
    render(
      <CompletionAlert
        message="Pomodoro complete. Time for a break."
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("alertdialog", {
        name: "Pomodoro complete. Time for a break.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Closing in 5s")).toBeInTheDocument();
  });

  it("should count down and close after five seconds", () => {
    vi.useFakeTimers();

    const onClose = vi.fn();

    render(
      <CompletionAlert message="Pomodoro complete." onClose={onClose} />,
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("Closing in 2s")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
