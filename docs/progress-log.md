# Progress Log

Add a short entry whenever a meaningful subphase is completed or verified. Keep
this consistent with [`roadmap.md`](./roadmap.md).

| Date | Phase | Change / verification | Result |
| --- | --- | --- | --- |
| 2026-10-06 | MVP 2.1.2 | Custom durations / long-break-interval integration and timer lifecycle work recorded | Later verified on 2026-10-18 |
| 2026-10-08 | MVP 2.1.2 | Manual-start lifecycle confirmed as a product decision | Invariant; kept |
| 2026-10-18 | MVP 2.1 | Timer settings / hook work recorded | Verified complete; only the Settings UI remains |
| 2026-10-18 | Audit | Repo audited at commit `fa9f60c`; `npm test` 84 pass / 11 files, `npm run build` pass, `npm run lint` clean | Documentation split from `feature-plan.md`; statuses corrected to actual state |
| 2026-10-18 | Fix | `TimerProgress` now uses `longBreakInterval` instead of a hard-coded `4`; `index.html` static title fixed; `coverage/` excluded from lint; added 2 tests | 84 tests pass, build pass, lint clean |
| 2026-10-19 | Fix | Audited follow-up: validated persisted tasks (KI-12) and timer settings (KI-6); `crypto.randomUUID` fallback (KI-13); consolidated CSS and removed dead rules (KI-4); implemented the commented-out RESET test (KI-11); added 6 tests | 90 tests pass, build pass, lint clean |
| 2026-10-19 | MVP 1 | Phase 5 review: responsive screenshots (1280/768/375/320 px), all-completed/no-active-task state, axe-core audit (0 violations), contrast fixes, `main` landmark | 90 tests pass, build pass, lint clean; Phase 5 `DONE` |
| 2026-10-19 | MVP 2.1.3 | Settings UI: header entry point + modal, validation, save/cancel, idle/running integration, component + integration tests | 99 tests pass, build pass, lint clean; MVP 2.1 `DONE` |
| 2026-10-20 | MVP 2.2 | Task Tracking: per-task `completedPomodoros`, compact badge, active-task attribution in `App`, persistence/normalization, hook/UI/integration tests | 109 tests pass, build pass, lint clean; MVP 2.2 `DONE` |
| 2026-10-20 | MVP 2.3 | Session History: completion event from `useTimer`, persisted `SessionRecord[]`, History modal with local-day focus summary, date/duration/reload/StrictMode tests, a11y + 320px review | 134 tests pass, build pass, lint clean; MVP 2.3 `DONE` |
| 2026-10-20 | MVP 2.4 | Settings & Personalization: no additional preferences (no concrete need), saved-settings modal/reload tests, reset/default behavior coverage | 137 tests pass, build pass, lint clean; MVP 2.4 `DONE` |
| 2026-10-20 | MVP 2.5 | Notifications: explicit permission request in Settings, one notification per completed focus/break session, denied/unsupported/reset handling, StrictMode dedupe | 152 tests pass, build pass, lint clean; MVP 2.5 `DONE` |
| 2026-10-20 | Fix | History: a failing Notification API can no longer abort completion handling before the session is recorded; regression test added | 154 tests pass, build pass, lint clean |
| 2026-10-20 | Fix | Notifications: prefer a service worker when available so browsers that reject `new Notification` still show completion notifications; direct constructor fallback; click opens the app | 155 tests pass, build pass, lint clean |
| 2026-10-22 | MVP 2.6 | Productivity UX: in-app completion message after every finished session (shared copy with the notification), empty/error/confirmation and keyboard/responsive review; no charts | 156 tests pass, build pass, lint clean; browser check at 1280/320 px; MVP 2.6 `DONE` |
| 2026-10-24 | MVP 2.7 | Persistence hardening: `useLocalStorage` catches blocked reads and quota-failed writes; session history capped at 5,000 (`MAX_STORED_SESSIONS`); `STORAGE_KEY.timerSettings` added (KI-5, KI-16); tests for read/write failures, malformed data, and retention | 159 tests pass, build pass, lint clean; MVP 2.7 `DONE`; MVP 2 `DONE` |
| 2026-10-30 | MVP 2B | Plan created for Pomodoro/break cues and rainfall ambience; existing `public/sounds/fx` files mapped, `drink*.mp3` excluded; no code written | `TODO`; start at 2B.1 |
| 2026-10-30 | MVP 2B | Implemented audio: `constants/audio.ts`, `useAudio` (cues, rain loop, volume/mute/presets), App wiring from the single completion event, nested rainfall popover in the light palette | 2B.1–2B.3 done; 185 tests pass / 20 files, build pass, lint clean; 2B.4 manual QA pending |

## Current next action

**MVP 2 is complete. MVP 2B (audio) is implemented through 2B.3.** Run the
2B.4 manual browser QA in [`mvp-2b-audio.md`](./mvp-2b-audio.md) before marking
it `DONE`.

MVP 3 (backend/accounts/sync) remains **not in scope** without explicit
approval. Useful non-feature work if requested: manual QA pass, an in-repo a11y
regression check (KI-9), and the optional test-key cleanup (KI-10).

Note: browser notifications are only visible while the OS shows them (GNOME
Do Not Disturb hides them). The in-app completion message (MVP 2.6) covers that
gap.

### Already verified (no action needed)

The former "stabilize `useTimer` and its tests" task is **complete**:

- Timer reaches the end of a session and stops (next mode is `idle`).
- A completed Pomodoro increments the count exactly once.
- The configured `longBreakInterval` is respected.
- Reset does not erase or increment completed Pomodoros.
- Finishing a long break resets the cycle count.
- Every next mode is `idle` and waits for manual **START**.
- The full test suite and production build pass.
