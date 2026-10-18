# MVP 1 — Core Pomodoro Experience

**Goal:** deliver a usable local-first Pomodoro timer with basic task management
before adding productivity analytics or personalization.

**Status:** `DONE` (behavior implemented and tested). A few items in Phase 5
(responsive/a11y/polish) remain `VERIFY` because they need manual review.

**Evidence:** `npm test` → 90 passed / 11 files; `npm run build` → pass;
`npm run lint` → clean. Audited against the working tree (`feat/install-ponytail`).

---

## Phase 1 — App foundation and main UI

- [x] React + TypeScript + Vite app foundation established.
- [x] Main app composition established (`Header`, `Timer`, `TaskList`) in `App.tsx`.
- [x] Component-based structure established.
- [x] Build and lint/type-check status **verified**: `npm run build` passes (`tsc -b && vite build`); `npm run lint` is clean.
- [x] Layout remains intentionally minimal and single-page (no router, no extra pages).

## Phase 2 — Timer core

- [x] Pomodoro, Short Break, and Long Break modes exist (`TimerMode`, `TimerMode` type).
- [x] Countdown display exists (`TimerDisplay`, `role="timer"`).
- [x] Timer mode selection UI exists (`TimerMode` with `aria-pressed`).
- [x] Default durations **verified**: Pomodoro 25 min, Short Break 5 min, Long Break 15 min
      (`src/constants/timer.ts`: `1500 / 300 / 900` seconds).
- [x] Display and countdown remain correct across mode changes and resets (covered by
      `useTimer` and `App` tests).

## Phase 3 — Timer controls and lifecycle

- [x] Start/pause/reset controls exist (`TimerControls`: START/PAUSE/RESUME/RESET).
- [x] Timer state is managed in a hook (`useTimer`).
- [x] Automated tests exist for timer behavior (`src/hooks/__test__/useTimer.test.ts`).
- [x] Product decision: **mode transitions do not auto-start the next timer.**
      On session completion `useTimer` sets `status` to `idle` and selects the next
      mode; `start()` must be called explicitly.
- [x] Timer reaches the end of a session and stops cleanly (does not run past zero);
      verified for Pomodoro, short break, and long break.
- [x] Reset behavior is consistent for each mode (`reset()` restores the current
      mode's configured duration and sets `idle`).
- [x] Completed-Pomodoro count and long-break reset behavior are correct
      (count increments once per Pomodoro; reset on long-break completion).
- [x] Full `useTimer` suite run: **passing** (no outstanding regressions around
      zero, reset, or long-break counting).

## Phase 4 — Task and timer integration

- [x] Add, select, toggle completion, and delete task interactions exist (`useTasks`, `TaskList`, `TaskItem`).
- [x] Active task is displayed above timer mode controls (`Timer.tsx` renders `.timer-task` before `TimerMode`).
- [x] Selecting completed/nonexistent tasks is guarded in `useTasks.selectTask`.
- [x] Completing the active task clears its active selection.
- [x] Task interaction while the timer is running follows the intended rules:
      FOCUS and the completion checkbox are disabled; delete remains allowed.
- [x] Session completion and mode cycling work together.
- [x] Long break is selected after the configured number of completed Pomodoros
      (`settings.longBreakInterval`, default `4`).
- [x] Task completion is **not** automatically triggered merely because a Pomodoro
      finishes (explicitly tested in `App.test.tsx`).

## Phase 5 — UX and quality

### Phase 5.1 — Task UX — `DONE`

- [x] Basic task list and task form exist.
- [x] Empty state: "Add a task to get started."
- [x] Task input placeholder: "What are you working on?" (`aria-label="New Task"`).
- [x] Add button and task interactions exist.
- [x] Task item/list tests exist (`TaskItem.test.tsx`, `TaskList.test.tsx`).
- [x] Interaction rules during a running timer are covered by tests.
- [x] Selection/active-task display does not cause ambiguous queries: the active
      task title may appear in both the timer label and the task row, and tests use
      `getAllByText(...)` accordingly.

### Phase 5.2 — Timer UX — `DONE`

- [x] Timer display, mode selector, progress, and controls are separate components.
- [x] Disabled states and mode/control transitions are tested (`TimerControls.test.tsx`,
      `TimerMode.test.tsx`, `App.test.tsx`).
- [x] Display updates correctly when settings/mode/reset changes.
- [x] Completion feedback is consistent: `TimerProgress` reflects completed
      Pomodoros and now uses the configured `longBreakInterval` (see
      [`known-issues.md`](./known-issues.md)).

### Phase 5.3 — Responsive UI — `VERIFY`

- [x] Responsive styles implemented: `src/App.css` and `src/index.css` include
      mobile media queries (`max-width: 480px`); the timer uses `clamp()` sizing.
- [ ] `VERIFY`: manual inspection of desktop, tablet, and mobile layouts.
- [ ] `VERIFY`: confirm timer and task list remain usable without unnecessary page
      complexity.
- Note: styles are duplicated across `index.css` and `App.css` — see tech debt in
  [`known-issues.md`](./known-issues.md).

### Phase 5.4 — Empty and edge states — `PARTIAL`

- [x] Empty task-list message exists.
- [x] Deletion of the active task clears the active selection (tested).
- [x] Timer completion, reset, and reload behavior covered by tests.
- [x] Malformed persisted JSON fails safely to the initial value
      (`useLocalStorage` try/catch, tested).
- [ ] `VERIFY`: explicit review of the "all tasks completed" and "no active task"
      presentation (behavior is handled; no dedicated test).

### Phase 5.5 — Accessibility — `PARTIAL`

- [x] Semantic buttons/inputs and accessible labels:
      `aria-label="New Task"`, delete button `aria-label="Delete <title>"`,
      `aria-pressed` on mode buttons, `role="timer"`, `role="status"`.
- [x] Keyboard operation works through native controls; visible focus indicators
      via `:focus-visible` outlines.
- [x] Disabled controls communicate state via the native `disabled` attribute and
      reduced opacity.
- [ ] `VERIFY`: contrast/readability review and an automated a11y audit (e.g. axe)
      are not present.

### Phase 5.6 — Final visual polish and release checks — `PARTIAL`

- [x] Consistent spacing, typography, colors, and component states (see `App.css`).
- [x] Browser tab title reflects the app: `App.tsx` sets
      `"<time> - <mode> | Luno"` dynamically, and `index.html` now has a proper
      static fallback `<title>` (previously `app`).
- [x] All tests and production build pass.
- [x] No accidental debug output: no `console.*`/`debugger` in `src`.
- [ ] `VERIFY`: final manual visual pass at release time.

---

## MVP 1 acceptance criteria

- [x] A user can create and manage tasks.
- [x] A user can run, pause, resume, and reset a timer.
- [x] Pomodoro/short-break/long-break transitions work predictably.
- [x] Every new mode waits for the user to press **START**.
- [x] Session counters and long-break scheduling are correct.
- [x] Reload behavior is consistent with the intended local persistence
      (tasks/active-task/settings persist; timer runtime state intentionally resets).
- [x] Automated tests and production build pass.
- [ ] `VERIFY`: main page remains minimal and responsive (manual review pending).
