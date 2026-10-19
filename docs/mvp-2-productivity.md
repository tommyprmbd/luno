# MVP 2 — Productivity & Personalization

**Goal:** make Luno useful for tracking focused work while preserving the
minimalist single-page experience.

**Overall status:** `PARTIAL`. MVP 2.1 (Custom Timer, including the Settings UI)
and MVP 2.2 (Task Tracking) are `DONE`; milestones 2.3–2.7 are not implemented.

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

**Next action:** MVP **2.3 — Session History** (build on the timer's completion
source used by 2.2).

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
separate history UI was added. Breaks are never counted as task Pomodoros. The
attribution uses the timer's completed-Pomodoro counter as the single completion
source; MVP 2.3 should record session history from that same source instead of
adding a second completion detector.

---

## MVP 2.3 — Session History (`P0`) — `TODO`

**Goal:** let users understand how much focused work they have completed.

- [ ] Define a session record model (mode/type, start/end or completion time,
      duration, completion status, associated task where applicable).
- [ ] Record completed sessions consistently.
- [ ] Decide whether interrupted/abandoned sessions are stored; do not count them
      as completed without an explicit rule.
- [ ] Show a simple session history.
- [ ] Calculate total focus duration.
- [ ] Show a daily summary.
- [ ] Persist history locally.
- [ ] Test date boundaries, reload behavior, and duration calculations.

**Dependency:** agree on the session data model before implementing history UI.
Task Tracking (2.2) uses the timer's completed-Pomodoro counter as the single
completion source; history must build on that source, not add another.

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

- [ ] Document which data is persisted: tasks, timer settings, task progress,
      session history, and any other user preferences.
      *(Currently: tasks including per-task Pomodoro counts, active-task id, and
      timer settings. See `constants/storage.ts`.)*
- [ ] Define schema/versioning or migration behavior for persisted local data.
- [x] Validate persisted timer settings shape/range (`useTimerSettings`; KI-6).
- [x] Validate persisted task data shape (`useTasks`; KI-12).
- [x] Handle malformed or unavailable local storage safely (per-key `try/catch` in
      `useLocalStorage`, with fallback to the initial value; tested).
- [x] Reload behavior verified for tasks and settings.
- [ ] Prevent duplicate session records after rerenders/repeated completions
      (not applicable until session history exists).
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
- [ ] Session history and daily focus totals are correct.
- [ ] Browser notifications degrade gracefully.
- [ ] All data intended to persist survives reload (`PARTIAL`: tasks, task
      progress, and settings persist; session history is not implemented).
- [x] Tests and production build pass.
- [x] The app remains lightweight and easy to use.
