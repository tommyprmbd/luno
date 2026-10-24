import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_TIMER_SETTINGS } from "../../../constants/timer";
import type { NotificationPermissionState } from "../../../types/notification";
import type { TimerSettings } from "../../../types/timer";
import SettingsModal from "../SettingsModal";

function renderModal(
  settings: TimerSettings = { ...DEFAULT_TIMER_SETTINGS },
  notificationPermission: NotificationPermissionState = "default",
) {
  const onSave = vi.fn();
  const onClose = vi.fn();
  const onEnableNotifications = vi.fn();

  render(
    <SettingsModal
      settings={settings}
      notificationPermission={notificationPermission}
      onEnableNotifications={onEnableNotifications}
      onSave={onSave}
      onClose={onClose}
    />,
  );

  return { onSave, onClose, onEnableNotifications, user: userEvent.setup() };
}

describe("SettingsModal", () => {
  it("should show the current settings and focus the first field", () => {
    renderModal();

    expect(
      screen.getByRole("dialog", { name: "Orbit Configuration" }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Pomodoro duration (minutes)"),
    ).toHaveValue(25);
    expect(
      screen.getByLabelText("Short break duration (minutes)"),
    ).toHaveValue(5);
    expect(
      screen.getByLabelText("Long break duration (minutes)"),
    ).toHaveValue(15);
    expect(
      screen.getByLabelText("Long break interval (Pomodoros)"),
    ).toHaveValue(4);

    expect(
      screen.getByLabelText("Pomodoro duration (minutes)"),
    ).toHaveFocus();
  });

  it("should show saved settings instead of defaults", () => {
    renderModal({
      pomodoroDuration: 1800,
      shortBreakDuration: 600,
      longBreakDuration: 1200,
      longBreakInterval: 3,
    });

    expect(
      screen.getByLabelText("Pomodoro duration (minutes)"),
    ).toHaveValue(30);
    expect(
      screen.getByLabelText("Short break duration (minutes)"),
    ).toHaveValue(10);
    expect(
      screen.getByLabelText("Long break duration (minutes)"),
    ).toHaveValue(20);
    expect(
      screen.getByLabelText("Long break interval (Pomodoros)"),
    ).toHaveValue(3);
  });

  it("should explain notifications and request permission", async () => {
    const { onEnableNotifications, user } = renderModal();

    expect(
      screen.getByText(
        "Get a browser notification when a timer session finishes.",
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "ENABLE NOTIFICATIONS" }),
    );

    expect(onEnableNotifications).toHaveBeenCalledOnce();
  });

  it.each([
    ["granted", "Notifications are enabled."],
    [
      "denied",
      "Notifications are blocked. Allow them in your browser settings.",
    ],
    ["unsupported", "This browser does not support notifications."],
  ] as const)("should show the %s notification state", (permission, text) => {
    renderModal(undefined, permission);

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "ENABLE NOTIFICATIONS" }),
    ).not.toBeInTheDocument();
  });

  it("should save minutes as seconds", async () => {
    const { onSave, user } = renderModal();

    const pomodoro = screen.getByLabelText("Pomodoro duration (minutes)");
    const shortBreak = screen.getByLabelText(
      "Short break duration (minutes)",
    );
    const longBreak = screen.getByLabelText("Long break duration (minutes)");
    const interval = screen.getByLabelText(
      "Long break interval (Pomodoros)",
    );

    await user.clear(pomodoro);
    await user.type(pomodoro, "30");
    await user.clear(shortBreak);
    await user.type(shortBreak, "10");
    await user.clear(longBreak);
    await user.type(longBreak, "20");
    await user.clear(interval);
    await user.type(interval, "3");

    await user.click(screen.getByRole("button", { name: "SAVE" }));

    expect(onSave).toHaveBeenCalledWith({
      pomodoroDuration: 1800,
      shortBreakDuration: 600,
      longBreakDuration: 1200,
      longBreakInterval: 3,
    });
  });

  it("should close without saving when cancelled", async () => {
    const { onSave, onClose, user } = renderModal();

    await user.click(screen.getByRole("button", { name: "CANCEL" }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("should show validation feedback and keep the modal open for invalid input", async () => {
    const { onSave, user } = renderModal();

    const pomodoro = screen.getByLabelText("Pomodoro duration (minutes)");

    await user.clear(pomodoro);
    await user.type(pomodoro, "0");
    await user.click(screen.getByRole("button", { name: "SAVE" }));

    expect(
      screen.getByText("Enter a whole number from 1 to 1440."),
    ).toBeInTheDocument();
    expect(pomodoro).toHaveAttribute("aria-invalid", "true");
    expect(onSave).not.toHaveBeenCalled();

    await user.clear(pomodoro);
    await user.type(pomodoro, "30");

    expect(
      screen.queryByText("Enter a whole number from 1 to 1440."),
    ).not.toBeInTheDocument();
  });

  it("should list upcoming options as disabled", () => {
    renderModal();

    for (const label of [
      "Auto-start breaks",
      "Auto-start pomodoros",
      "Hydration reminders",
    ]) {
      expect(screen.getByLabelText(label)).toBeDisabled();
    }

    expect(screen.getAllByText("SOON 🚀")).toHaveLength(3);
  });

  it("should close on Escape", async () => {
    const { onClose, user } = renderModal();

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("should keep keyboard focus inside the dialog", async () => {
    const { user } = renderModal();

    const save = screen.getByRole("button", { name: "SAVE" });
    save.focus();

    await user.tab();

    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });
});
