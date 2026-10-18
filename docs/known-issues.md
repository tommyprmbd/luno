# Known Issues & Tech Debt

**Last reviewed:** 2026-10-18 (audit at commit `fa9f60c`).

## Resolved

| ID | Issue | Resolution |
| --- | --- | --- |
| KI-1 | `TimerProgress` hard-coded `4` progress dots and `"...of 4 completed"`, ignoring the configurable `longBreakInterval`. | Fixed 2026-10-18: `longBreakInterval` flows `useTimer → App → Timer → TimerProgress`; tests added (`TimerProgress.test.tsx`, `App.test.tsx`). |
| KI-2 | `index.html` had a static `<title>app</title>` (runtime title was set by `App.tsx`, so pre-hydration/SEO title was wrong). | Fixed 2026-10-18: static fallback `<title>Luno — Pomodoro Timer</title>`. |
| KI-3 | ESLint linted generated `coverage/*` files, producing warnings. | Fixed 2026-10-18: `globalIgnores(['dist', 'coverage'])`; `npm run lint` is now clean. |

## Open

| ID | Severity | Issue | Suggested action |
| --- | --- | --- | --- |
| KI-4 | Medium | Duplicate/overlapping CSS: both `src/index.css` and `src/App.css` define `.app`, `.timer`, `.timer-mode`, `.timer-controls`, `.start-button`, `.reset-button`, `.task-item`, etc. Import order determines which wins. | Consolidate into a single stylesheet (or clearly scope each file) to avoid conflicting styles. |
| KI-5 | Low | `useTimerSettings` hard-codes the storage key `"luno-timer-settings"` instead of using `constants/storage.ts`, unlike tasks/active-task. | Add the key to `STORAGE_KEY` and use it consistently. |
| KI-6 | Medium | No validation of persisted timer settings. Invalid values (`0`, negative, missing keys, wrong types) can produce a broken timer. Only JSON parse errors are guarded. | Validate/normalize settings on load (schema + range checks); fall back to defaults. Part of MVP 2.1.1 / 2.7. |
| KI-7 | Info (by design) | Timer runtime state (`remainingSeconds`, `mode`, `status`, `completedPomodoros`) is not persisted; it resets on reload. | Confirm this is intended and document it as a decision (relates to MVP 2.1.1 acceptance). |
| KI-8 | Low | Side effects occur inside a `setRemainingSeconds` updater in `useTimer` (calling `setStatus`, `setMode`, `setCompletedPomodoros` during the state updater). It works and is tested, but it is a code smell and fragile under React StrictMode double-invocation. | Consider moving completion handling into a dedicated effect/interval callback. |
| KI-9 | Low | No automated accessibility audit (e.g. axe). A11y is implemented manually (roles, labels, focus styles) but not machine-checked. | Add an a11y test/lint (e.g. `jest-axe`/`vitest-axe`) when convenient. |
| KI-10 | Low | Test files use the literal string `"luno-timer-settings"` rather than the shared constant. | Follow KI-5 (introduce the constant) and update tests. |
| KI-11 | Low | `App.test.tsx` contains a commented-out `RESET` interaction block (the "reset without resetting progress" test does not actually click RESET). | Either implement the RESET assertion or remove the dead comment. |

## Backlog (not yet implemented features)

- MVP 2.1.3 — Settings UI.
- MVP 2.2 — Task Tracking.
- MVP 2.3 — Session History.
- MVP 2.5 — Notifications.
- MVP 2.6 — Productivity UX refinements.
- MVP 2.7 — Persistence schema/versioning.

See [`roadmap.md`](./roadmap.md) for priorities.
