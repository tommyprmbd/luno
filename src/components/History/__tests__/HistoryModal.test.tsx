import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SessionRecord } from "../../../types/session";
import HistoryModal from "../HistoryModal";

const now = new Date();
const today = (hour: number, minute: number) =>
  new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
  ).getTime();
const yesterday = (hour: number, minute: number) =>
  new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
    hour,
    minute,
  ).getTime();

const sessions: SessionRecord[] = [
  {
    mode: "pomodoro",
    completedAt: yesterday(16, 0),
    durationSeconds: 1500,
    taskTitle: "Write docs",
  },
  {
    mode: "pomodoro",
    completedAt: today(9, 30),
    durationSeconds: 1500,
    taskTitle: "Build Luno",
  },
  {
    mode: "short-break",
    completedAt: today(9, 55),
    durationSeconds: 300,
    taskTitle: null,
  },
];

function renderModal(records: SessionRecord[] = sessions) {
  const onClose = vi.fn();

  render(<HistoryModal sessions={records} onClose={onClose} />);

  return { onClose, user: userEvent.setup() };
}

describe("HistoryModal", () => {
  it("should show today's focus summary and recent sessions", () => {
    renderModal();

    expect(
      screen.getByRole("dialog", { name: "Session history" }),
    ).toBeInTheDocument();

    expect(screen.getByText("1 focus session")).toBeInTheDocument();
    expect(screen.getByText("25m focused")).toBeInTheDocument();
    expect(screen.getByText("All time: 50m focused")).toBeInTheDocument();
    expect(screen.getByText("Build Luno")).toBeInTheDocument();
    expect(screen.getByText("Write docs")).toBeInTheDocument();
    expect(screen.getByText("Short break")).toBeInTheDocument();
    expect(screen.getAllByText("Focus")).toHaveLength(2);
  });

  it("should list sessions newest first even when stored out of order", () => {
    renderModal([sessions[0], sessions[2], sessions[1]]);

    const items = screen.getAllByRole("listitem");

    expect(items[0]).toHaveTextContent("Short break");
    expect(items[1]).toHaveTextContent("Build Luno");
    expect(items[2]).toHaveTextContent("Write docs");
  });

  it("should show an empty state when there is no history", () => {
    renderModal([]);

    expect(screen.getByText("0 focus sessions")).toBeInTheDocument();
    expect(screen.getByText("All time: 0m focused")).toBeInTheDocument();
    expect(
      screen.getByText(
        "No sessions yet. Finish a Pomodoro to start your history.",
      ),
    ).toBeInTheDocument();
  });

  it("should close on Escape", async () => {
    const { onClose, user } = renderModal();

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("should close on the CLOSE button", async () => {
    const { onClose, user } = renderModal();

    await user.click(screen.getByRole("button", { name: "CLOSE" }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("should close when the backdrop is clicked", () => {
    const { onClose } = renderModal();
    const dialog = screen.getByRole("dialog");

    fireEvent.click(dialog.parentElement!);

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("should focus CLOSE and keep Tab inside the dialog", async () => {
    const { user } = renderModal();
    const close = screen.getByRole("button", { name: "CLOSE" });

    expect(close).toHaveFocus();

    await user.tab();

    expect(close).toHaveFocus();
  });
});
