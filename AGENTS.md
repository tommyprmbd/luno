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
  - `useTasks` — task CRUD, active-task selection, and its guards.
  - `useLocalStorage` — generic persisted state with a safe fallback on bad JSON.
- `App.tsx` composes hooks/components and holds cross-cutting rules: it blocks
  task/mode interaction while the timer is `running` and sets `document.title`.
- Shared vocabulary: `src/types/{timer,task}.ts`, `src/constants/{timer,storage}.ts`.

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
- Finishing a Pomodoro must **not** auto-complete the active task.

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
- No coverage thresholds are enforced; `npm run test:coverage` exists.

## Persistence

- localStorage keys: `luno:tasks` and `luno:active-task-id` (via `STORAGE_KEY`);
  timer settings still use the literal `"luno-timer-settings"` (not yet a
  constant — see `docs/known-issues.md` KI-5).
- Timer runtime state (remaining time, mode, count) is intentionally **not**
  persisted; the timer resets on reload.

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
