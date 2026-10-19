# Known Issues & Tech Debt

**Last reviewed:** 2026-10-19 (MVP 1 Phase 5 review, working tree).
**Evidence:** `npm test` 90 passed / 11 files · `npm run build` pass · `npm run lint` clean.

## Resolved

| ID | Issue | Resolution |
| --- | --- | --- |
| KI-1 | `TimerProgress` hard-coded `4` progress dots and `"...of 4 completed"`, ignoring the configurable `longBreakInterval`. | Fixed 2026-10-18: `longBreakInterval` flows `useTimer → App → Timer → TimerProgress`; tests added (`TimerProgress.test.tsx`, `App.test.tsx`). |
| KI-2 | `index.html` had a static `<title>app</title>` (runtime title was set by `App.tsx`, so pre-hydration/SEO title was wrong). | Fixed 2026-10-18: static fallback `<title>Luno — Pomodoro Timer</title>`. |
| KI-3 | ESLint linted generated `coverage/*` files, producing warnings. | Fixed 2026-10-18: `globalIgnores(['dist', 'coverage'])`; `npm run lint` is now clean. |
| KI-4 | Duplicate/overlapping CSS: both `src/index.css` and `src/App.css` defined `.app`, `.timer`, `.timer-mode`, `.timer-controls`, `.start-button`, `.reset-button`, `.task-item`, etc. Import order decided which won, and `.timer-mode-active` ended up with both a background and an underline. | Fixed 2026-10-19: `index.css` is now global base only (`*`, `html`, `body`, `button`, `input`); all component styles live in `App.css`. Unique `index.css` properties (`.header` margin, `.timer` card background/padding) were merged into `App.css`; dead rules (`.tasks h2`, `.task-list`, `.add-task-button`) deleted. |
| KI-6 | No validation of persisted timer settings. Invalid values (`0`, negative, missing keys, wrong types, huge interval) could produce a broken or hanging timer. Only JSON parse errors were guarded. | Fixed 2026-10-19: `useTimerSettings` normalizes on load — each field must be a positive integer within range, otherwise the default is used; `longBreakInterval` is capped so the progress dots cannot hang the UI. Tests added in `useTimerSettings.test.ts`. |
| KI-11 | `App.test.tsx` contained a commented-out `RESET` interaction block (the "reset without resetting progress" test did not actually click RESET). | Fixed 2026-10-19: the test now starts the short break, pauses it, clicks RESET, and asserts progress is unchanged. |
| KI-12 | Persisted `luno:tasks` was cast blindly (`JSON.parse(...) as Task[]`); a valid-JSON-wrong-shape value (e.g. `{}` or `null`) crashed the app on load (`tasks.find is not a function`). | Fixed 2026-10-19: `useTasks` validates the stored array and drops malformed entries via a `validate` hook passed to `useLocalStorage`. Tests added in `useTasks.test.ts`. |
| KI-13 | `useTasks.addTask` called `crypto.randomUUID()` directly, which is `undefined` outside a secure context, so ADD threw when the app was served over plain `http://` on a LAN IP. | Fixed 2026-10-19: task ids fall back to a timestamp + random string when `crypto.randomUUID` is unavailable. Test added in `useTasks.test.ts`. |
| KI-15 | axe-core found contrast failures in the empty-state text and completed task titles, plus a missing `main` landmark. | Fixed 2026-10-19: darkened empty-state/placeholder text, raised completed-task opacity, increased inactive progress-dot opacity, and wrapped the app in `<main>`. axe re-run at empty/all-completed/running states: 0 violations. |

## Open

| ID | Severity | Issue | Suggested action |
| --- | --- | --- | --- |
| KI-5 | Low | `useTimerSettings` hard-codes the storage key `"luno-timer-settings"` instead of using `constants/storage.ts`, unlike tasks/active-task. | Add the key to `STORAGE_KEY` and use it consistently. |
| KI-7 | Info (by design) | Timer runtime state (`remainingSeconds`, `mode`, `status`, `completedPomodoros`) is not persisted; it resets on reload. | Confirm this is intended and document it as a decision (relates to MVP 2.1.1 acceptance). |
| KI-8 | Low | Side effects occur inside a `setRemainingSeconds` updater in `useTimer` (calling `setStatus`, `setMode`, `setCompletedPomodoros` during the state updater). It works and is tested, but it is a code smell and fragile under React StrictMode double-invocation. | Consider moving completion handling into a dedicated effect/interval callback. |
| KI-9 | Low | No in-repo accessibility regression test. A one-off axe-core audit was run on 2026-10-19 (0 violations), but nothing runs in CI. | Add an a11y test/lint (e.g. `jest-axe`/`vitest-axe`) when convenient. |
| KI-10 | Low | Test files use the literal string `"luno-timer-settings"` rather than the shared constant. | Follow KI-5 (introduce the constant) and update tests. |
| KI-14 | Info (by design) | The countdown never renders `00:00`: at `00:01` the next tick selects the next mode and shows its full duration. | Kept as intended (showing `00:00` would add a one-second delay and rewrite the timer completion timing asserted across the suite). Revisit only if users ask for it. |

## Backlog (not yet implemented features)

- MVP 2.1.3 — Settings UI.
- MVP 2.2 — Task Tracking.
- MVP 2.3 — Session History.
- MVP 2.5 — Notifications.
- MVP 2.6 — Productivity UX refinements.
- MVP 2.7 — Persistence schema/versioning.

See [`roadmap.md`](./roadmap.md) for priorities.
