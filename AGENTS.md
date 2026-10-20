# AGENTS.md

Luno is a local-first, single-page Pomodoro app: React + TypeScript + Vite,
with **no backend, no router, and no state-management library**. Keep it that
way unless explicitly asked.

Product scope, roadmap, and status live in `docs/` (start at `docs/README.md`).
Treat those docs as the plan, not proof — verify against source before trusting
a status.

## Commands

- `npm run dev` — Vite dev server on http://localhost:5173.
- `npm test` — Vitest single run. `npm run test:watch` to watch.
  - One file: `npm test -- src/hooks/__test__/useTimer.test.ts`
  - One test by name: `npm test -- -t "should reset the timer"`
- `npm run build` — **this is also the typecheck**: it runs `tsc -b && vite build`.
  Use `npx tsc -b` for a typecheck with no bundling.
- `npm run lint` — ESLint (`dist/` and `coverage/` are ignored).

## TypeScript constraints (build fails otherwise)

- `verbatimModuleSyntax` → type-only imports must use `import type { X }`.
- `erasableSyntaxOnly` → no `enum`, `namespace`, or constructor parameter
  properties.
- `noUnusedLocals` + `noUnusedParameters` → remove unused locals/params.
- Project references in `tsconfig.json`: `tsconfig.app.json` (src, DOM libs)
  and `tsconfig.node.json` (vite config only).

## Architecture — where logic lives

- Presentational components only render state and emit actions via props; all
  behavior lives in hooks.
- State ownership:
  - `useTimer` — mode, status, countdown, session completion, cycle count.
  - `useTimerSettings` — persisted durations + interval, layered on `useLocalStorage`.
  - `useTasks` — task CRUD, active-task selection, its guards, and per-task
    completed-Pomodoro counts.
  - `useSessions` — persisted completed-session history and local-day focus
    summary helpers.
  - `useNotifications` — browser notification permission and best-effort
    completion notifications; no-op when denied or unsupported.
  - `useLocalStorage` — generic persisted state with a safe fallback on bad JSON.
- `App.tsx` composes hooks/components and holds cross-cutting rules: it blocks
  task/mode interaction while the timer is `running`, uses the timer's completed-
  session event for task attribution, history, and notifications, and sets
  `document.title`.
- Shared vocabulary: `src/types/{timer,task,session,notification}.ts`,
  `src/constants/{timer,storage}.ts`.

## Invariants — do not break these

- **Manual start only.** A mode transition (automatic on completion, or manual
  via the mode selector) always leaves `status === "idle"`. Never auto-start the
  next session.
- **Configuration over magic numbers.** Durations and `longBreakInterval` must
  come from `settings`/`useTimer`, never literals. (A hard-coded `4` in
  `TimerProgress` was a real bug; the interval now flows
  `useTimer → App → Timer → TimerProgress`.)
- **Long-break cycle:** when `completedPomodoros % longBreakInterval === 0`, the
  next mode is `long-break`; finishing the long break resets the count to `0`.
- Finishing a Pomodoro increments the active task's `completedPomodoros` but
  must **not** auto-complete the task. Breaks and sessions with no active task
  are not attributed.
- **Only completed sessions are recorded.** Reset, pause, or an abandoned
  session must not create a history record. History uses one completion event
  from `useTimer`; do not add a second completion detector.
- **Focus totals exclude breaks.** Break sessions are listed for context but
  only completed Pomodoros count toward the daily focus total.
- **Notifications are optional and permission-driven.** Request permission only
  from the explicit Settings action, never automatically. Notify only when the
  browser permission is `granted`; denied/unsupported browsers and rejected
  requests are no-ops. One completion event may notify at most once.
- **Session duration is captured at start**, so changing settings mid-session
  cannot rewrite the running session's recorded duration.

## Testing quirks

- Colocation is inconsistent — match the folder: hooks use
  `src/hooks/__test__/` (**singular**), components use
  `src/components/**/__tests__/` (**plural**), app test is `src/App.test.tsx`.
- Config in `vite.config.ts`: `globals: true`, `environment: "jsdom"`, setup at
  `src/test/setup.ts`.
- Tests clear `localStorage` in `beforeEach`. Timer tests use
  `vi.useFakeTimers()` + `vi.advanceTimersByTime(...)`, and restore with
  `vi.useRealTimers()` in a `finally` block.
- An active task's title renders **twice** (timer label + task row) → use
  `getAllByText`, not `getByText`/`getByRole` text queries.
- jsdom has no `Notification` API. Tests that exercise it stub a mock on
  `globalThis` and unstub after each test; unsupported-browser tests pass
  `undefined`.
- No coverage thresholds are enforced; `npm run test:coverage` exists.

## Persistence

- localStorage keys: `luno:tasks` (including per-task `completedPomodoros`),
  `luno:active-task-id`, and `luno:sessions` (via `STORAGE_KEY`); timer settings
  still use the literal `"luno-timer-settings"` (not yet a constant — see
  `docs/known-issues.md` KI-5). Session history is currently unbounded (KI-16).
- Timer runtime state (remaining time, mode, count) is intentionally **not**
  persisted; the timer resets on reload. Notification permission is owned by the
  browser, not `localStorage`.

## Workflow & docs

- Keep `docs/roadmap.md`, the per-MVP checklists, and `docs/progress-log.md`
  consistent. Mark something `DONE` only with evidence (passing test, build, or
  direct inspection).
- Read `docs/known-issues.md` before "fixing" something that is already tracked.
- Do **not** implement MVP 3 (backend/accounts/sync) without explicit approval.

## Commit messages

Use Conventional Commits: `type: short description`, lowercase, imperative mood,
no trailing period. One logical change per commit; add the "why" in an optional
body after a blank line. Only these prefixes:

- `feat: <description>` — new user-visible feature or behavior change.
- `refactor: <description>` — internal change with no behavior change.
- `doc: <description>` — documentation only (`README`, `docs/`, comments).
- `chore: <description>` — tooling, dependencies, config, scripts.

A change to timer/task behavior must include its tests in the same commit. Work
on a `feat/*` branch and land on `main` through a PR.
