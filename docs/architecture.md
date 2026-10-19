# Architecture & Guidance for AI Agents

## Architecture summary

Luno is a small React + TypeScript single-page app with a clear separation:

- **Presentational components** (`Header`, `Timer*`, `Task*`) render state and
  emit user actions via props. `SettingsModal` additionally holds its own draft
  form state and validates input before calling `onSave`. They contain no
  business rules.
- **Hooks / domain logic** own behavior:
  - `useTimer` — timer mode, status, countdown, completion, cycle counting.
  - `useTimerSettings` — persisted timer settings, layered on `useLocalStorage`.
  - `useTasks` — task CRUD, active-task selection, and its guards.
  - `useLocalStorage` — generic persisted state with a safe fallback.
- **`App`** composes the hooks and components and enforces cross-cutting rules
  (e.g. blocking task/mode interactions while the timer is running, and updating
  `document.title`).
- **Constants** (`constants/timer.ts`, `constants/storage.ts`) and **types**
  (`types/timer.ts`, `types/task.ts`) are the shared vocabulary.

### Data flow

```text
localStorage ──► useLocalStorage ──► useTimerSettings ──► useTimer
                                              │
                                              ▼
                                  App (composition + guards)
                                   │        │            │
                                   ▼        ▼            ▼
                                 Timer   TaskList   SettingsModal
                                          │
                                          ▼
                                      TaskItem
```

## Rules when working on Luno

1. **Read before editing.** Inspect the current implementation, types, hooks, and
   tests. The docs are a roadmap, not proof that every file matches its
   description.
2. **Preserve the existing stack.** Do not introduce a new framework,
   state-management library, database, or backend without a clear requirement.
3. **Keep business logic out of presentational components.** Timer lifecycle
   belongs in the timer hook/domain logic; task state belongs in task logic; UI
   components present state and emit user actions.
4. **Use a single source of truth.** Completed Pomodoro counts, mode selection,
   task attribution, and session history must not be independently calculated in
   conflicting places.
5. **Respect manual lifecycle.** A mode transition sets up the next mode but does
   not start it. The user presses **START** for every new session.
6. **Use configuration, not magic numbers.** Timer durations and the long-break
   interval must come from settings (this now includes `TimerProgress`).
7. **Test behavior, not implementation details.** Prefer observable outcomes and
   stable accessible queries. Avoid ambiguous text selectors when the same task
   title appears in the timer label and the task row.
8. **Add regression tests with behavior changes.** Especially cover timer
   completion, reset, completed-session counts, long-break interval, manual start,
   task deletion, and persistence.
9. **Keep changes scoped.** Finish and verify the current subphase before
   beginning the next one.
10. **Do not claim a phase is complete without evidence.** Run the relevant
    tests/build and update the docs with the actual outcome.
11. **Keep UI minimal.** Prefer a small modal or inline feedback over a new page
    or complex dashboard.
12. **Do not implement MVP 3 scope without explicit approval.**

## Suggested workflow for each task

1. Identify the target phase/subphase and its acceptance criteria.
2. Inspect the relevant source and test files.
3. State the intended behavior and edge cases.
4. Implement the smallest coherent change.
5. Add or update tests.
6. Run targeted tests, then the full suite and build when appropriate
   (`npm test`, `npm run build`, `npm run lint`).
7. Report files changed, tests/build results, unresolved issues, and the next
   action.
8. Update [`roadmap.md`](./roadmap.md), the relevant MVP checklist, and
   [`progress-log.md`](./progress-log.md) only when supported by evidence.
