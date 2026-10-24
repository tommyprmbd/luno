import { useState } from "react";

const NOTICES = {
  sound: "Rainfall soundscape isn't available yet.",
  about: "Luno is a local-first focus timer. Your tasks and history stay in this browser.",
};

type HeaderProps = {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
};

function Header({ onOpenHistory, onOpenSettings }: HeaderProps) {
  const [notice, setNotice] = useState<keyof typeof NOTICES | null>(null);

  function toggleNotice(next: keyof typeof NOTICES) {
    setNotice((current) => (current === next ? null : next));
  }

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.4"
            />
          </svg>
        </div>

        <div className="brand-text">
          <h1 className="brand-name">Luno</h1>
          <span className="brand-badge">
            <span aria-hidden="true">⚡</span> One Focus
          </span>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="sound-button"
          aria-label="Rainfall soundscape"
          title="Soundscapes"
          onClick={() => toggleNotice("sound")}
        >
          <span className="sound-icon" aria-hidden="true">
            🌧️
            <span className="sound-pulse" />
          </span>
          <span className="sound-label">Rainfall</span>
        </button>

        <button
          type="button"
          className="icon-button"
          aria-label="Settings"
          title="Timer settings"
          onClick={onOpenSettings}
        >
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
        </button>

        <button
          type="button"
          className="icon-button"
          aria-label="History"
          title="Session history"
          onClick={onOpenHistory}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>

        <button
          type="button"
          className="icon-button"
          aria-label="About"
          title="About Luno"
          onClick={() => toggleNotice("about")}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>

        {notice && (
          <p className="header-notice" role="status">
            {NOTICES[notice]}
          </p>
        )}
      </div>
    </header>
  );
}

export default Header;
