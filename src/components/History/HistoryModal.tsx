import type { KeyboardEvent } from "react";
import {
  formatDuration,
  getTodayFocusSummary,
  getTotalFocusSummary,
} from "../../hooks/useSessions";
import type { SessionRecord } from "../../types/session";
import Button from "../ui/Button";

const MODE_LABELS: Record<SessionRecord["mode"], string> = {
  pomodoro: "Focus",
  "short-break": "Short break",
  "long-break": "Long break",
};

// "M d, Y h:m" — e.g. Oct 24, 2026, 9:30 AM
const formatTimestamp = (timestamp: number) =>
  new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

type HistoryModalProps = {
  sessions: SessionRecord[];
  onClose: () => void;
};

function HistoryModal({ sessions, onClose }: HistoryModalProps) {
  const summary = getTodayFocusSummary(sessions);
  const total = getTotalFocusSummary(sessions);
  const recentSessions = [...sessions].sort(
    (a, b) => b.completedAt - a.completedAt,
  );

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
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) {
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal history-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-icon" aria-hidden="true">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <h2 id="history-title">Session history</h2>
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

        <div className="history-summary">
          <div className="history-stat">
            <span className="history-summary-label">Today's Focus</span>
            <strong>{formatDuration(summary.totalSeconds)}</strong>
          </div>
          <div className="history-stat">
            <span className="history-summary-label">Completed Orbits</span>
            <strong>
              {summary.count} {" "}
              {summary.count === 1 ? "Pomo" : "Pomos"}
            </strong>
          </div>
        </div>

        <p className="history-total">
          All time: {formatDuration(total.totalSeconds)} focused
        </p>

        {recentSessions.length === 0 ? (
          <p className="history-empty">
            No sessions yet. Finish a Pomodoro to start your history.
          </p>
        ) : (
          <ul className="history-list">
            {recentSessions.map((session, index) => (
              <li
                key={`${session.completedAt}-${session.mode}-${index}`}
                className="history-item"
              >
                <time
                  className="history-time"
                  dateTime={new Date(session.completedAt).toISOString()}
                >
                  {formatTimestamp(session.completedAt)}
                </time>
                <span className="history-mode">
                  {MODE_LABELS[session.mode]}
                </span>
                {session.taskTitle && (
                  <span className="history-title">{session.taskTitle}</span>
                )}
                <span className="history-duration">
                  {formatDuration(session.durationSeconds)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="modal-footer">
          <Button variant="ghost" onClick={onClose} autoFocus>
            CLOSE
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;
