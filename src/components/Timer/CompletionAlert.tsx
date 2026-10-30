import { useEffect, useState } from "react";

const AUTO_CLOSE_SECONDS = 5;

type CompletionAlertProps = {
  message: string;
  onClose: () => void;
};

function CompletionAlert({ message, onClose }: CompletionAlertProps) {
  const [secondsLeft, setSecondsLeft] = useState(AUTO_CLOSE_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((seconds) => seconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onClose();
    }
  }, [secondsLeft, onClose]);

  return (
    <div className="modal-backdrop">
      <div
        className="modal completion-alert"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="completion-message"
      >
        <button
          type="button"
          className="completion-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <span className="completion-icon" aria-hidden="true">
          ✓
        </span>

        <p id="completion-message">{message}</p>

        <div className="completion-countdown" aria-hidden="true">
          <span>Closing in {secondsLeft}s</span>
          <span className="completion-bar">
            <span
              style={{ width: `${(secondsLeft / AUTO_CLOSE_SECONDS) * 100}%` }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

export default CompletionAlert;
