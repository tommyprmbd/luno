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

## Current next action

**MVP 2.7 — Persistence hardening.**

Session history is shape-validated but unbounded (KI-16) and has no schema
version. Decide on retention/migration behavior, then add tests for quota and
version handling. After that, MVP 2.5 (Notifications).

### Already verified (no action needed)

The former "stabilize `useTimer` and its tests" task is **complete**:

- Timer reaches the end of a session and stops (next mode is `idle`).
- A completed Pomodoro increments the count exactly once.
- The configured `longBreakInterval` is respected.
- Reset does not erase or increment completed Pomodoros.
- Finishing a long break resets the cycle count.
- Every next mode is `idle` and waits for manual **START**.
- The full test suite and production build pass.
