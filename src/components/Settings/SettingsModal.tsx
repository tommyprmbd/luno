import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  MAX_LONG_BREAK_INTERVAL,
  MAX_TIMER_DURATION_SECONDS,
} from "../../constants/timer";
import type { NotificationPermissionState } from "../../types/notification";
import type { TimerSettings } from "../../types/timer";
import Button from "../ui/Button";
import Input from "../ui/Input";

type SettingsModalProps = {
  settings: TimerSettings;
  notificationPermission: NotificationPermissionState;
  onEnableNotifications: () => void;
  onSave: (settings: TimerSettings) => void;
  onClose: () => void;
};

type Draft = {
  pomodoro: string;
  shortBreak: string;
  longBreak: string;
  interval: string;
};

type DraftErrors = Partial<Record<keyof Draft, string>>;

const MAX_MINUTES = MAX_TIMER_DURATION_SECONDS / 60;
const DURATION_ERROR = `Enter a whole number from 1 to ${MAX_MINUTES}.`;
const INTERVAL_ERROR = `Enter a whole number from 1 to ${MAX_LONG_BREAK_INTERVAL}.`;

const FUTURE_FEATURES: { id: string; label: string; hint?: string }[] = [
  { id: "settings-auto-start-breaks", label: "Auto-start breaks" },
  { id: "settings-auto-start-pomodoros", label: "Auto-start pomodoros" },
  {
    id: "settings-hydration-reminders",
    label: "Hydration reminders",
    hint: "Periodic mindful water alerts",
  },
];

const toDraft = (settings: TimerSettings): Draft => ({
  pomodoro: String(settings.pomodoroDuration / 60),
  shortBreak: String(settings.shortBreakDuration / 60),
  longBreak: String(settings.longBreakDuration / 60),
  interval: String(settings.longBreakInterval),
});

function parseWholeNumber(value: string, max: number) {
  const trimmed = value.trim();

  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const number = Number(trimmed);

  return number >= 1 && number <= max ? number : null;
}

function SettingsModal({
  settings,
  notificationPermission,
  onEnableNotifications,
  onSave,
  onClose,
}: SettingsModalProps) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(settings));
  const [errors, setErrors] = useState<DraftErrors>({});

  function updateDraft(key: keyof Draft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const pomodoro = parseWholeNumber(draft.pomodoro, MAX_MINUTES);
    const shortBreak = parseWholeNumber(draft.shortBreak, MAX_MINUTES);
    const longBreak = parseWholeNumber(draft.longBreak, MAX_MINUTES);
    const interval = parseWholeNumber(draft.interval, MAX_LONG_BREAK_INTERVAL);

    const nextErrors: DraftErrors = {};

    if (pomodoro === null) nextErrors.pomodoro = DURATION_ERROR;
    if (shortBreak === null) nextErrors.shortBreak = DURATION_ERROR;
    if (longBreak === null) nextErrors.longBreak = DURATION_ERROR;
    if (interval === null) nextErrors.interval = INTERVAL_ERROR;

    if (
      pomodoro === null ||
      shortBreak === null ||
      longBreak === null ||
      interval === null
    ) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      pomodoroDuration: pomodoro * 60,
      shortBreakDuration: shortBreak * 60,
      longBreakDuration: longBreak * 60,
      longBreakInterval: interval,
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
      'button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    // shortcut: keep the legacy settings-* classes so a stale dev-CSS cache
    // still styles the dialog; remove once clients have reloaded the rename.
    <div
      className="modal-backdrop settings-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-icon" aria-hidden="true">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <h2 id="settings-title">Orbit Configuration</h2>
          </div>

          <Button variant="icon" aria-label="Close" onClick={onClose}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </Button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="settings-group">
            <div className="settings-grid">
              <div className="settings-field">
                <label htmlFor="settings-pomodoro">Pomodoro</label>
                <Input
                  id="settings-pomodoro"
                  aria-label="Pomodoro duration (minutes)"
                  type="number"
                  min="1"
                  max={MAX_MINUTES}
                  step="1"
                  autoFocus
                  value={draft.pomodoro}
                  onChange={(event) =>
                    updateDraft("pomodoro", event.target.value)
                  }
                  aria-invalid={Boolean(errors.pomodoro)}
                  aria-describedby={
                    errors.pomodoro ? "settings-pomodoro-error" : undefined
                  }
                />
                {errors.pomodoro && (
                  <span
                    id="settings-pomodoro-error"
                    className="settings-error"
                    role="alert"
                  >
                    {errors.pomodoro}
                  </span>
                )}
              </div>

              <div className="settings-field">
                <label htmlFor="settings-short-break">Short break</label>
                <Input
                  id="settings-short-break"
                  aria-label="Short break duration (minutes)"
                  type="number"
                  min="1"
                  max={MAX_MINUTES}
                  step="1"
                  value={draft.shortBreak}
                  onChange={(event) =>
                    updateDraft("shortBreak", event.target.value)
                  }
                  aria-invalid={Boolean(errors.shortBreak)}
                  aria-describedby={
                    errors.shortBreak
                      ? "settings-short-break-error"
                      : undefined
                  }
                />
                {errors.shortBreak && (
                  <span
                    id="settings-short-break-error"
                    className="settings-error"
                    role="alert"
                  >
                    {errors.shortBreak}
                  </span>
                )}
              </div>

              <div className="settings-field">
                <label htmlFor="settings-long-break">Long break</label>
                <Input
                  id="settings-long-break"
                  aria-label="Long break duration (minutes)"
                  type="number"
                  min="1"
                  max={MAX_MINUTES}
                  step="1"
                  value={draft.longBreak}
                  onChange={(event) =>
                    updateDraft("longBreak", event.target.value)
                  }
                  aria-invalid={Boolean(errors.longBreak)}
                  aria-describedby={
                    errors.longBreak ? "settings-long-break-error" : undefined
                  }
                />
                {errors.longBreak && (
                  <span
                    id="settings-long-break-error"
                    className="settings-error"
                    role="alert"
                  >
                    {errors.longBreak}
                  </span>
                )}
              </div>

              <div className="settings-field">
                <label htmlFor="settings-interval">Interval</label>
                <Input
                  id="settings-interval"
                  aria-label="Long break interval (Pomodoros)"
                  type="number"
                  min="1"
                  max={MAX_LONG_BREAK_INTERVAL}
                  step="1"
                  value={draft.interval}
                  onChange={(event) =>
                    updateDraft("interval", event.target.value)
                  }
                  aria-invalid={Boolean(errors.interval)}
                  aria-describedby={
                    errors.interval ? "settings-interval-error" : undefined
                  }
                />
                {errors.interval && (
                  <span
                    id="settings-interval-error"
                    className="settings-error"
                    role="alert"
                  >
                    {errors.interval}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          <div className="settings-toggles">
            {FUTURE_FEATURES.map(({ id, label, hint }) => (
              <label key={id} className="settings-toggle" htmlFor={id}>
                <span>
                  <span className="settings-toggle-label">{label}</span>
                  {hint && (
                    <span className="settings-toggle-hint">{hint}</span>
                  )}
                </span>
                <span className="settings-soon">SOON 🚀</span>
                <input id={id} type="checkbox" aria-label={label} disabled />
              </label>
            ))}
          </div>

          <section
            className="settings-notifications"
            aria-labelledby="settings-notifications-title"
          >
            <h3 id="settings-notifications-title">Notifications</h3>
            <p>Get a browser notification when a timer session finishes.</p>

            {notificationPermission === "default" && (
              <Button onClick={onEnableNotifications}>
                ENABLE NOTIFICATIONS
              </Button>
            )}

            {notificationPermission === "granted" && (
              <p role="status">Notifications are enabled.</p>
            )}

            {notificationPermission === "denied" && (
              <p role="status">
                Notifications are blocked. Allow them in your browser settings.
              </p>
            )}

            {notificationPermission === "unsupported" && (
              <p role="status">
                This browser does not support notifications.
              </p>
            )}
          </section>

          <div className="modal-footer">
            <Button variant="text" onClick={onClose}>
              CANCEL
            </Button>
            <Button type="submit">SAVE</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsModal;
