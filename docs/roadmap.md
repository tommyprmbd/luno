# Roadmap & Status Dashboard

**Last reviewed:** 2026-10-19 · **Audited commit:** working tree (`feat/install-ponytail`)
**Evidence:** `npm test` 90 passed / 11 files · `npm run build` pass · `npm run lint` clean.

This dashboard reflects the **actual** repository state after the 2026-10-18
audit. See the per-MVP files for the detailed checklist and the exact evidence.

## Milestone dashboard

| Area | Status | Notes / next action |
| --- | --- | --- |
| **MVP 1 — Core Pomodoro Experience** | `DONE` | All phases 1–5 implemented and covered by tests. Build/lint clean. Only manual visual/responsive/a11y review remains (see Phase 5). |
| Phase 1 — App foundation and main UI | `DONE` | React+TS+Vite; `App` composes `Header`, `Timer`, `TaskList`. |
| Phase 2 — Timer modes and countdown | `DONE` | Pomodoro/Short/Long modes with configurable durations and countdown display. |
| Phase 3 — Timer controls and lifecycle | `DONE` | Start/pause/resume/reset; manual-start lifecycle enforced and tested. |
| Phase 4 — Timer/task integration and cycle | `DONE` | Active task display, transitions, long-break interval, task completion not auto-triggered — all tested. |
| Phase 5 — UX, responsive, quality | `PARTIAL` | Behavior implemented and tested; responsive/a11y items need manual review (`VERIFY`). |
| **MVP 2.1 — Custom Timer** | `PARTIAL` | Settings model + `useTimer` integration `DONE` and tested. **Settings UI (`2.1.3`) not started** — next action. |
| MVP 2.2 — Task Tracking | `TODO` | Pomodoro count/progress per task. |
| MVP 2.3 — Session History | `TODO` | Session records + daily focus summary. |
| MVP 2.4 — Settings & Personalization | `PARTIAL` | Settings model/persistence exist via 2.1; no settings UI, no extra preferences. |
| MVP 2.5 — Notifications | `TODO` | Browser notifications on session completion. |
| MVP 2.6 — Productivity UX | `PARTIAL` | Progress dots exist; completion feedback/polish refinements pending. |
| MVP 2.7 — Persistence improvements | `PARTIAL` | Per-key malformed-JSON handling + tasks/settings persistence exist; no schema/versioning or migration. |
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
| Automated tests and production build pass | `DONE` | 90 tests pass; build passes. |
| Main page remains minimal and responsive | `VERIFY` | Single page; CSS media queries exist; manual visual review recommended. |

## MVP 2 acceptance criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| Configure and persist timer durations/interval | `PARTIAL` | Model + persistence + `useTimer` integration done; **no settings UI yet**. |
| Mode transitions remain manual-start | `DONE` | Invariant enforced in `useTimer`. |
| Completed Pomodoros attributed to tasks | `TODO` | Belongs to MVP 2.2. |
| Session history and daily totals correct | `TODO` | Belongs to MVP 2.3. |
| Browser notifications degrade gracefully | `TODO` | Belongs to MVP 2.5. |
| All intended data survives reload | `PARTIAL` | Tasks + settings persist; history/progress not implemented. |
| Tests and production build pass | `DONE` | 90 tests pass; build passes. |
| App remains lightweight and easy to use | `DONE` | No router/dashboard; single page. |

## Priority order (suggested)

1. **MVP 2.1.3 — Settings UI** (finishes the in-flight Custom Timer milestone).
2. **MVP 2.2 — Task Tracking**, then **MVP 2.3 — Session History** (share one
   completed-session source of truth).
3. **MVP 2.7 — Persistence hardening** alongside 2.2/2.3 (schema/migration).
4. **MVP 2.5 — Notifications**, then **MVP 2.6 — Productivity UX polish**.
