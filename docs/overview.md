# Overview

## Product direction

Luno is a minimalist, single-page Pomodoro web app. The timer is the main
focus; tasks and supporting information stay lightweight. Use
[Pomofocus](https://pomofocus.io/) as a simplicity reference, not as a
requirement to copy its exact design.

### Product principles

- **Simple by default:** keep the main experience on one page.
- **Modal-first:** settings and secondary workflows should use a modal or popup
  when that keeps the main page uncluttered.
- **Manual session control:** changing to a new timer mode must not
  automatically start the timer. The user explicitly presses **START** for each
  Pomodoro or break.
- **Task-oriented focus:** make it clear which task is being worked on and,
  later, how much focus time it has received.
- **Incremental implementation:** add features in small phases and protect
  existing behavior with tests.
- **No premature backend:** MVP 1 and MVP 2 are local-first. Backend accounts and
  cross-device synchronization are outside the current MVP 2 scope and belong to
  a possible MVP 3.
- **Keep the implementation maintainable:** avoid unnecessary UI components,
  abstractions, and navigation.
- **Configuration over magic numbers:** timer durations and the long-break
  interval must come from settings, not hard-coded literals.

## Current technical baseline (verified 2026-10-20, MVP 2.5)

Verified against the working tree by inspecting the repository and running the
project scripts.

- **Stack:** React 19 + TypeScript ~6.0 + Vite 8.
- **Tests:** Vitest 5 + React Testing Library (`jsdom`), globals enabled, setup at
  `src/test/setup.ts`. **154 tests across 15 files pass.**
- **Build:** `npm run build` (`tsc -b && vite build`) passes.
- **Lint:** `npm run lint` is clean (`coverage/` and `dist/` ignored).
- **Main app composition:** `App` composes `Header`, `Timer`, `TaskList`, and the
  `SettingsModal` (opened from the header).
- **Hooks:** `useTimer`, `useTimerSettings`, `useTasks`, `useSessions`,
  `useNotifications`, `useLocalStorage`.
- **Timer UI:** `TimerDisplay`, `TimerMode`, `TimerControls`, `TimerProgress`.
- **Task UI:** `TaskList`, `TaskItem`.
- **History UI:** `HistoryModal` (daily focus summary + session list).
- **Settings UI:** `SettingsModal` (durations + long-break interval + explicit
  notification permission request).
- **Notifications:** `useNotifications` reads the browser permission and sends
  one best-effort notification per completed focus/break session when granted.
  Denied/unsupported browsers remain fully usable; permission is not persisted by
  the app.
- **Types:** `src/types/timer.ts` (`TimerMode`, `TimerStatus`, `TimerSettings`),
  `src/types/task.ts` (`Task`), `src/types/session.ts` (`SessionRecord`),
  `src/types/notification.ts` (`NotificationPermissionState`).
- **Constants:** `src/constants/timer.ts` (`TIMER_DURATION`,
  `DEFAULT_TIMER_SETTINGS`), `src/constants/storage.ts` (`STORAGE_KEY`).
- **Task tracking:** each task stores its completed-Pomodoro count; `App`
  attributes a finished Pomodoro to the active task.
- **Session history:** each completed session stores mode, completion time,
  duration, and a task-title snapshot. Only completed sessions are recorded; the
  same completion event also sends an optional notification.
- **Local persistence:** tasks (including per-task Pomodoro counts), active-task
  id, timer settings, and session history are persisted in `localStorage`. Timer
  runtime state is intentionally not persisted.

## Repository map

```text
src/
├── components/
│   ├── Header/        Header.tsx
│   ├── History/       HistoryModal.tsx (+ __tests__)
│   ├── Settings/      SettingsModal.tsx (+ __tests__)
│   ├── Tasks/         TaskList.tsx, TaskItem.tsx (+ __tests__)
│   └── Timer/         Timer.tsx, TimerDisplay.tsx, TimerMode.tsx,
│                      TimerControls.tsx, TimerProgress.tsx (+ __tests__)
├── constants/         timer.ts, storage.ts
├── hooks/             useTimer.ts, useTimerSettings.ts, useTasks.ts,
│                      useSessions.ts, useNotifications.ts,
│                      useLocalStorage.ts (+ __test__)
├── types/             timer.ts, task.ts, session.ts, notification.ts
├── test/              setup.ts
├── App.tsx / App.css / App.test.tsx
├── index.css
└── main.tsx
```

## Key product decisions (invariants)

1. **Manual start only.** A mode transition (whether automatic on session
   completion or manual via the mode selector) always leaves the timer in the
   `idle` state. The next session never auto-starts.
2. **Long break after the configured interval.** After `longBreakInterval`
   completed Pomodoros the next mode is the long break; finishing the long break
   resets `completedPomodoros` to `0`.
3. **Task ↔ timer coupling is light.** The active task is shown above the mode
   controls; finishing a Pomodoro increments that task's count but does **not**
   auto-complete the task. Breaks and sessions with no active task are not
   attributed.
4. **History includes only completed sessions.** Reset, pause, or abandoned
   sessions are never recorded. Breaks appear in history for context but are
   excluded from daily focus totals.
5. **Notifications are optional and permission-driven.** Permission is requested
   only from the explicit Settings action, never automatically. Denied or
   unsupported browsers are no-ops, and one completion cannot notify twice.
6. **Local-first.** No backend, accounts, or sync in MVP 1/2.
