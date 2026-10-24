import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Header from "../Header";

describe("Header", () => {
  it("should open history and settings", async () => {
    const user = userEvent.setup();
    const onOpenHistory = vi.fn();
    const onOpenSettings = vi.fn();

    render(
      <Header
        onOpenHistory={onOpenHistory}
        onOpenSettings={onOpenSettings}
      />,
    );

    await user.click(screen.getByRole("button", { name: "History" }));
    await user.click(screen.getByRole("button", { name: "Settings" }));

    expect(onOpenHistory).toHaveBeenCalledTimes(1);
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("should explain that the rainfall soundscape is unavailable", async () => {
    const user = userEvent.setup();

    render(<Header onOpenHistory={vi.fn()} onOpenSettings={vi.fn()} />);

    const sound = screen.getByRole("button", {
      name: "Rainfall soundscape",
    });

    await user.click(sound);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Rainfall soundscape isn't available yet.",
    );

    await user.click(sound);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("should show about info", async () => {
    const user = userEvent.setup();

    render(<Header onOpenHistory={vi.fn()} onOpenSettings={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "About" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "local-first focus timer",
    );
  });
});
