# MVP 2 — Productivity & Personalization

**Goal:** make Luno useful for tracking focused work while preserving the
minimalist single-page experience.

**Overall status:** `PARTIAL`. MVP 2.1 (Custom Timer, including the Settings UI),
MVP 2.2 (Task Tracking), and MVP 2.3 (Session History) are `DONE`. MVP 2.4, 2.6,
and 2.7 remain `PARTIAL`; MVP 2.5 is `TODO`.

---

## MVP 2.1 — Custom Timer (`P0`) — `DONE`

**Goal:** let users customize session durations and the long-break interval.

**Defaults** (`src/constants/timer.ts` → `DEFAULT_TIMER_SETTINGS`):

| Setting | Default |
| --- | --- |
| Pomodoro duration | 25 minutes (`1500` s) |
| Short Break duration | 5 minutes (`300` s) |
| Long Break duration | 15 minutes (`900` s) |
| Long Break interval | 4 completed Pomodoros |

### Subphase 2.1.1 — Settings model and defaults — `DONE`

- [x] Configurable timer durations and interval are defined
      (`TimerSettings` type; `useTimerSettings` hook).
- [x] Defaults agreed: `25 / 5 / 15` minutes and interval `4`.
- [x] Settings type/defaults are implemented and persisted; load-after-reload
      verified in `useTimerSettings.test.ts`.
- [x] Settings are validated/normalized on load: each field must be a positive
      integer within range, otherwise the default is used (`useTimerSettings`;
      tested in `useTimerSettings.test.ts`).

### Subphase 2.1.2 — Integrate settings into `useTimer` — `DONE`

- [x] Custom durations/interval are integrated into timer behavior.
- [x] Product decision: after a mode transition the next timer is `idle`; never
      auto-start.
- [x] `useTimer` reads configured durations instead of hard-coded values
      (`getDurationInSeconds` reads `settings`), verified by custom-duration tests.
- [x] Long-break selection uses `settings.longBreakInterval`, not a hard-coded `4`
      (verified by the custom-interval test).
- [x] Completed-Pomodoro counting and reset rules verified.
- [x] Tests for zero/finish, reset, long-break completion, and manual starts exist
      and pass.
- [x] The entire timer test suite passes (`npm test` → 99 tests green).

### Subphase 2.1.3 — Settings UI — `DONE`

- [x] Settings entry point: a small "Settings" button in the header
      (`Header.tsx`) opens the modal without adding controls to the main screen.
- [x] Simple modal for Pomodoro duration, Short Break duration, Long Break
      duration, and Long Break Interval (`components/Settings/SettingsModal.tsx`).
- [x] Inputs validated on save with per-field feedback (whole minutes
      `1–1440`; interval `1–60`), `aria-invalid`, and `aria-describedby`.
- [x] Save applies and persists settings; Cancel/Escape/backdrop close without
      saving. Focus stays inside the dialog.
- [x] Changes are reflected in the timer immediately when idle and on the next
      session (reset/mode change); a running/paused session keeps its duration.
- [x] Component and integration tests added
      (`SettingsModal.test.tsx`, `App.test.tsx`); axe-core audit of the modal and
      main page: 0 violations.

**Evidence:** `npm test` → 99 passed / 12 files; `npm run build` → pass;
`npm run lint` → clean.

**Next action:** MVP **2.7 — Persistence hardening** (session retention/schema),
then MVP **2.5 — Notifications**.

---

## MVP 2.2 — Task Tracking (`P0`) — `DONE`

**Goal:** connect focus sessions to individual tasks.

- [x] Track the number of completed Pomodoro sessions per task: `Task` now has
      `completedPomodoros`, incremented by `useTasks.incrementTaskPomodoro`.
- [x] Display task progress in a compact form: a small "N pomodoro(s)" pill in
      `TaskItem`, shown only when the count is above zero.
- [x] Associate each completed focus session with the active task at the time of
      the session: `App` watches the timer's completed-Pomodoro counter and
      increments the active task. Task selection is already blocked while the
      timer runs.
- [x] Define behavior when no task is selected: the session is not attributed;
      the global cycle count still increments.
- [x] Define behavior when a task is deleted or completed: deleting a task
      removes its count with it; completing a task keeps its count and the row
      stays visible.
- [x] Persist task tracking locally: the count lives on the task in `luno:tasks`;
      older records without a count load with `0`, and invalid counts are
      normalized to `0`.
- [x] Add hook/unit tests and UI/integration tests (`useTasks.test.ts`,
      `TaskItem.test.tsx`, `App.test.tsx`); axe-core audit: 0 violations.

**Evidence:** `npm test` → 109 passed / 12 files; `npm run build` → pass;
`npm run lint` → clean. Browser check: a completed 1-minute Pomodoro incremented
the active task from 2 to 3 and persisted the value.

**Design constraint:** progress enriches the existing task list; no dashboard or
separate task-progress UI was added. Breaks are never counted as task Pomodoros.
The timer's completion event is the single source for both task attribution and
history; do not add a second completion detector.

---

## MVP 2.3 — Session History (`P0`) — `DONE`

**Goal:** let users understand how much focused work they have completed.

- [x] Define a session record model: `SessionRecord` (`src/types/session.ts`)
      stores `mode`, `completedAt`, `durationSeconds`, and a `taskTitle` snapshot.
      Completion status is represented by existence: only completed sessions are
      written.
- [x] Record completed sessions consistently: `useTimer` emits one
      `lastCompletedSession` event on every completion (Pomodoro or break);
      `App` records it and uses the same event for task attribution.
- [x] Decide whether interrupted/abandoned sessions are stored: **no**. Reset,
      pause, and manual mode changes never create a record; a test covers reset.
- [x] Show a simple session history: a header "History" button opens a modal
      listing sessions newest first with local date/time, mode, task, and duration.
- [x] Calculate total focus duration: the modal shows an all-time focus total as
      well as today's; both sum only completed Pomodoro durations. Breaks are
      listed but excluded from focus totals.
- [x] Show a daily summary: "N focus session(s) · Xh Ym focused" for the current
      local calendar day.
- [x] Persist history locally: `luno:sessions`; malformed records are dropped on
      load. The task title is snapshotted so history survives task deletion.
- [x] Test date boundaries, reload behavior, and duration calculations
      (`useSessions.test.ts`, `useTimer.test.ts`, `HistoryModal.test.tsx`,
      `App.test.tsx`). Local-midnight boundaries use local date keys, not UTC.

**Evidence:** `npm test` → 134 passed / 14 files; `npm run build` → pass;
`npm run lint` → clean. Browser check: completing a session appended it to
`luno:sessions`, incremented the task count, and updated the history summary;
axe-core audits of the history modal at desktop/375/320 px: 0 violations.

**Design decisions:** the completed-session event is the single source of truth
for both task counts and history. The session duration is captured when the timer
starts, so changing settings mid-session cannot rewrite an already-running
session's recorded duration. Breaks are stored for context but never counted as
focus. The modal is read-only and intentionally small: no charts, filters, or
dashboard. Session retention is currently unbounded (see KI-16).

---

## MVP 2.4 — Settings & Personalization — `PARTIAL`

- [x] Provide a settings modal consistent with the minimalist UI (2.1.3).
- [x] Timer settings from MVP 2.1 exist in the model/persistence layer.
- [ ] Define any additional preferences only when there is a concrete user need.
- [x] Preferences (timer settings) persist locally.
- [x] Provide sensible defaults and safe handling for missing/invalid values
      (defaults exist; invalid values now normalized in `useTimerSettings`).
- [x] Tests for settings persistence exist (`useTimerSettings.test.ts`).
- [ ] `TODO`: reset/default-behavior tests beyond initial-load defaults.

**Scope note:** Custom Timer is the first settings feature. Avoid expanding this
into a large preferences page prematurely.

---

## MVP 2.5 — Notifications — `TODO`

- [ ] Request browser notification permission at an appropriate moment, with a
      clear explanation.
- [ ] Notify the user when a timer session completes, if permission is granted.
- [ ] Keep the app usable when permission is denied or notifications are unsupported.
- [ ] Avoid duplicate notifications.
- [ ] Test completion, permission-denied, unsupported-browser, and reset scenarios.

---

## MVP 2.6 — Productivity UX — `PARTIAL`

- [ ] Improve completion feedback for Pomodoro and break sessions.
- [ ] Refine task progress and session summaries.
- [x] Progress indicator exists (`TimerProgress`, now interval-driven).
- [ ] Review loading, empty, error, and confirmation states.
- [ ] Keep secondary information in compact components or modals.
- [ ] Test keyboard flow and responsive layouts.
- [ ] Do not add charts/dashboard complexity unless the underlying history data
      makes it useful.

---

## MVP 2.7 — Data & Persistence Improvements — `PARTIAL`

- [x] Document which data is persisted: tasks (including per-task Pomodoro
      counts), active-task id, timer settings, and session history.
      See `constants/storage.ts` and `architecture.md`.
- [ ] Define schema/versioning or migration behavior for persisted local data.
      *(Session records are shape-validated, but there is no version field.)*
- [x] Validate persisted timer settings shape/range (`useTimerSettings`; KI-6).
- [x] Validate persisted task data shape (`useTasks`; KI-12).
- [x] Validate persisted session history shape (`useSessions`).
- [x] Handle malformed or unavailable local storage safely (per-key `try/catch` in
      `useLocalStorage`, with fallback to the initial value; tested).
- [x] Reload behavior verified for tasks, settings, and session history.
- [x] Prevent duplicate session records after rerenders/repeated completions
      (the App effect dedupes the completion event; StrictMode test added).
- [ ] Add tests for persistence and data consistency (broader coverage pending).

**Important:** local persistence is not the same as cloud backup or cross-device
synchronization. Cloud sync is not part of MVP 2.

---

## MVP 2 acceptance criteria

- [x] Users can configure and persist timer durations and long-break interval
      (settings modal; `SettingsModal.test.tsx`, `App.test.tsx`).
- [x] Mode transitions remain manual-start.
- [x] Completed Pomodoros are reliably attributed to tasks when appropriate
      (only when a task is active; breaks and no-task sessions are ignored).
- [x] Session history and daily focus totals are correct (local-day summary;
      breaks excluded; date-boundary tests pass).
- [ ] Browser notifications degrade gracefully.
- [x] All data intended to persist survives reload (tasks, task progress,
      active task, settings, and session history).
- [x] Tests and production build pass.
- [x] The app remains lightweight and easy to use.
