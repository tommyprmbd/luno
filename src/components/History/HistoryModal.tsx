import type { KeyboardEvent } from "react";
import {
  formatDuration,
  getTodayFocusSummary,
  getTotalFocusSummary,
} from "../../hooks/useSessions";
import type { SessionRecord } from "../../types/session";

const MODE_LABELS: Record<SessionRecord["mode"], string> = {
  pomodoro: "Focus",
  "short-break": "Short break",
  "long-break": "Long break",
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

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

    // CLOSE is the only interactive element; keep Tab inside the dialog.
    if (event.key === "Tab") {
      event.preventDefault();
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
        <h2 id="history-title">Session history</h2>

        <div className="history-summary">
          <span className="history-summary-label">Today</span>
          <strong>
            {summary.count} focus {summary.count === 1 ? "session" : "sessions"}
          </strong>
          <span>{formatDuration(summary.totalSeconds)} focused</span>
          <span className="history-total">
            All time: {formatDuration(total.totalSeconds)} focused
          </span>
        </div>

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
                <div className="history-row">
                  <span className="history-time">
                    {formatTimestamp(session.completedAt)}
                  </span>
                  <span className="history-mode">
                    {MODE_LABELS[session.mode]}
                  </span>
                  <span className="history-duration">
                    {formatDuration(session.durationSeconds)}
                  </span>
                </div>

                {session.taskTitle && (
                  <p className="history-task">{session.taskTitle}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="history-actions">
          <button
            type="button"
            className="start-button"
            onClick={onClose}
            autoFocus
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;
