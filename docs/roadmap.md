# Roadmap & Status Dashboard

**Last reviewed:** 2026-10-30 (MVP 2B plan added) · **Audited commit:** working tree
**Evidence:** `npm test` 159 passed / 15 files · `npm run build` pass · `npm run lint` clean.

This dashboard reflects the **actual** repository state after the 2026-10-24
audit. See the per-MVP files for the detailed checklist and the exact evidence.

## Milestone dashboard

| Area | Status | Notes / next action |
| --- | --- | --- |
| **MVP 1 — Core Pomodoro Experience** | `DONE` | All phases 1–5 implemented, tested, and manually reviewed. Build/lint clean. |
| Phase 1 — App foundation and main UI | `DONE` | React+TS+Vite; `App` composes `Header`, `Timer`, `TaskList`. |
| Phase 2 — Timer modes and countdown | `DONE` | Pomodoro/Short/Long modes with configurable durations and countdown display. |
| Phase 3 — Timer controls and lifecycle | `DONE` | Start/pause/resume/reset; manual-start lifecycle enforced and tested. |
| Phase 4 — Timer/task integration and cycle | `DONE` | Active task display, transitions, long-break interval, task completion not auto-triggered — all tested. |
| Phase 5 — UX, responsive, quality | `DONE` | Responsive, edge-state, a11y (axe-core), and visual review completed 2026-10-19. |
| **MVP 2 — Productivity & Personalization** | `DONE` | 2.1–2.7 complete: custom timer, tasks, history, settings, notifications, UX, and persistence hardening. |
| **MVP 2.1 — Custom Timer** | `DONE` | Settings model, `useTimer` integration, and Settings UI (modal + validation + tests) complete. |
| MVP 2.2 — Task Tracking | `DONE` | Per-task Pomodoro count persisted with the task, shown inline; attributed only to the active task. |
| MVP 2.3 — Session History | `DONE` | Persisted completed-session records, history modal, and local-day focus summary; interruptions and breaks excluded from focus totals. |
| MVP 2.4 — Settings & Personalization | `DONE` | Settings modal + persistence; no additional preferences added without a concrete need; reset/default/reload behavior tested. |
| MVP 2.5 — Notifications | `DONE` | Optional browser notifications on session completion; explicit permission request; denied/unsupported browsers degrade gracefully. |
| MVP 2.6 — Productivity UX | `DONE` | In-app completion message after each finished session; empty/error/confirmation states and keyboard/responsive flow reviewed; no charts added. |
| MVP 2.7 — Persistence improvements | `DONE` | Read/write failures (blocked storage, quota) are handled; session history capped at 5,000; no schema version (validators are the migration policy). |
| **MVP 2B — Audio & Ambience** | `TODO` | Plan in [`mvp-2b-audio.md`](./mvp-2b-audio.md): Pomodoro start/finish cues, break-finish cue, rainfall loop with volume popover. No code yet. |
| **MVP 3 — Backend / accounts / sync** | `NOT IN SCOPE` | Candidate future milestone only. Do not implement unless explicitly reprioritized. |

Legend: `DONE` · `PARTIAL` · `IN PROGRESS` · `TODO` · `VERIFY` · `NOT IN SCOPE`
(see [`README.md`](./README.md#status-convention)).

## MVP 1 acceptance criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| Create and manage tasks | `DONE` | `useTasks` + `TaskList`/`TaskItem` tests. |
| Run, pause, resume, reset a timer | `DONE` | `useTimer` + `TimerControls` + `App` tests. |
| Pomodoro/short/long transitions are predictable | `DONE` | `useTimer` cycle tests. |
| Every new mode waits for **START** | `DONE` | `useTimer` sets `idle` on completion; `App` blocks mode change while running. |
| Session counters and long-break scheduling correct | `DONE` | Count + interval tests (default 4 and custom interval). |
| Reload behavior consistent with intended persistence | `DONE` | Tasks/active-task/settings persist; timer runtime state intentionally does not. |
| Automated tests and production build pass | `DONE` | 159 tests pass; build passes. |
| Main page remains minimal and responsive | `DONE` | Single page; reviewed at 1280/768/375/320 px with no horizontal overflow. |

## MVP 2 acceptance criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| Configure and persist timer durations/interval | `DONE` | Settings modal saves/validates; persistence and timer integration tested. |
| Mode transitions remain manual-start | `DONE` | Invariant enforced in `useTimer`. |
| Completed Pomodoros attributed to tasks | `DONE` | Active-task attribution tested in `App.test.tsx`; breaks/no-task ignored. |
| Session history and daily totals correct | `DONE` | History modal + local-day focus summary; date-boundary and duration tests pass. |
| Browser notifications degrade gracefully | `DONE` | Explicit permission request; denied/unsupported browsers are no-ops; completion still works. |
| All intended data survives reload | `DONE` | Tasks, per-task counts, active task, settings, and session history persist; reload tested. |
| Tests and production build pass | `DONE` | 159 tests pass; build passes. |
| App remains lightweight and easy to use | `DONE` | No router/dashboard; single page. |

## Priority order (suggested)

MVP 2 is complete. MVP 2B (audio) is planned but not started; see
[`mvp-2b-audio.md`](./mvp-2b-audio.md). Start with 2B.1 (audio foundation).
MVP 3 (backend/accounts/sync) remains **not in scope** without explicit
approval. Useful non-feature work if requested: a manual QA pass, an in-repo
a11y check (KI-9), and the test-key cleanup (KI-10).
