import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  MAX_LONG_BREAK_INTERVAL,
  MAX_TIMER_DURATION_SECONDS,
} from "../../constants/timer";
import type { NotificationPermissionState } from "../../types/notification";
import type { TimerSettings } from "../../types/timer";

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
        <h2 id="settings-title">Settings</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="settings-fields">
            <div className="settings-field">
              <label htmlFor="settings-pomodoro">
                Pomodoro duration (minutes)
              </label>
              <input
                id="settings-pomodoro"
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
              <label htmlFor="settings-short-break">
                Short break duration (minutes)
              </label>
              <input
                id="settings-short-break"
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
                  errors.shortBreak ? "settings-short-break-error" : undefined
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
              <label htmlFor="settings-long-break">
                Long break duration (minutes)
              </label>
              <input
                id="settings-long-break"
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
              <label htmlFor="settings-interval">
                Long break interval (Pomodoros)
              </label>
              <input
                id="settings-interval"
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

          <section
            className="settings-notifications"
            aria-labelledby="settings-notifications-title"
          >
            <h3 id="settings-notifications-title">Notifications</h3>
            <p>Get a browser notification when a timer session finishes.</p>

            {notificationPermission === "default" && (
              <button
                type="button"
                className="settings-enable-button"
                onClick={onEnableNotifications}
              >
                ENABLE NOTIFICATIONS
              </button>
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

          <div className="settings-actions">
            <button type="button" className="reset-button" onClick={onClose}>
              CANCEL
            </button>
            <button type="submit" className="start-button">
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsModal;
