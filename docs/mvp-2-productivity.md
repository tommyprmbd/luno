# MVP 2 — Productivity & Personalization

**Goal:** make Luno useful for tracking focused work while preserving the
minimalist single-page experience.

**Overall status:** `PARTIAL`. MVP 2.1 backend-side work (settings model +
`useTimer` integration) is `DONE`; the Settings UI and milestones 2.2–2.7 are
not implemented.

---

## MVP 2.1 — Custom Timer (`P0`) — `PARTIAL`

**Goal:** let users customize session durations and the long-break interval.

**Defaults** (`src/constants/timer.ts` → `DEFAULT_TIMER_SETTINGS`):

| Setting | Default |
| --- | --- |
| Pomodoro duration | 25 minutes (`1500` s) |
| Short Break duration | 5 minutes (`300` s) |
| Long Break duration | 15 minutes (`900` s) |
| Long Break interval | 4 completed Pomodoros |

### Subphase 2.1.1 — Settings model and defaults — `PARTIAL`

- [x] Configurable timer durations and interval are defined
      (`TimerSettings` type; `useTimerSettings` hook).
- [x] Defaults agreed: `25 / 5 / 15` minutes and interval `4`.
- [x] Settings type/defaults are implemented and persisted; load-after-reload
      verified in `useTimerSettings.test.ts`.
- [ ] `TODO`: validate settings shape/range. Currently only JSON parse errors are
      handled (`useLocalStorage`), not invalid values (e.g. `0`, negative, missing
      keys). See [`known-issues.md`](./known-issues.md).

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
- [x] The entire timer test suite passes (`npm test` → 84 tests green).

### Subphase 2.1.3 — Settings UI — `TODO`

- [ ] `TODO`: add a settings entry point that does not clutter the main screen.
- [ ] `TODO`: create a simple modal for Pomodoro duration, Short Break duration,
      Long Break duration, and Long Break Interval.
- [ ] `TODO`: validate inputs and provide clear feedback.
- [ ] `TODO`: save/cancel behavior is predictable.
- [ ] `TODO`: changes are reflected in subsequent timer sessions.
- [ ] `TODO`: add component and integration tests.

**Next action:** implement Subphase **2.1.3 — Settings UI**, wiring it to the
existing `useTimerSettings` hook.

---

## MVP 2.2 — Task Tracking (`P0`) — `TODO`

**Goal:** connect focus sessions to individual tasks.

- [ ] Track the number of completed Pomodoro sessions per task.
- [ ] Display task progress in a compact form.
- [ ] Associate each completed focus session with the active task at the time of
      the session.
- [ ] Define behavior when no task is selected.
- [ ] Define behavior when a task is deleted or completed.
- [ ] Persist task tracking locally.
- [ ] Add hook/unit tests and UI/integration tests.

**Design constraint:** progress should enrich the existing task list, not
introduce a large dashboard.

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
Task Tracking (2.2) should use the same completed-session event/source of truth.

---

## MVP 2.4 — Settings & Personalization — `PARTIAL`

- [ ] Provide a settings modal consistent with the minimalist UI. *(depends on 2.1.3)*
- [x] Timer settings from MVP 2.1 exist in the model/persistence layer.
- [ ] Define any additional preferences only when there is a concrete user need.
- [x] Preferences (timer settings) persist locally.
- [ ] Provide sensible defaults and safe handling for missing/invalid values
      (defaults exist; invalid-value handling pending).
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
      *(Currently: tasks, active-task id, timer settings. See `constants/storage.ts`.)*
- [ ] Define schema/versioning or migration behavior for persisted local data.
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

- [ ] Users can configure and persist timer durations and long-break interval
      (`PARTIAL`: persist works, UI missing).
- [x] Mode transitions remain manual-start.
- [ ] Completed Pomodoros are reliably attributed to tasks when appropriate.
- [ ] Session history and daily focus totals are correct.
- [ ] Browser notifications degrade gracefully.
- [ ] All data intended to persist survives reload (`PARTIAL`).
- [x] Tests and production build pass.
- [x] The app remains lightweight and easy to use.
