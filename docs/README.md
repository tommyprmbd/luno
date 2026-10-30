# Luno Documentation

> Working documentation for **Luno**, a minimalist, local-first Pomodoro and
> task-focused web app. Written for both developers and AI coding agents.

**Last reviewed:** 2026-10-30 (MVP 2B plan added)
**Audited commit:** working tree
**Verification snapshot (2026-10-20):**

| Check | Command | Result |
| --- | --- | --- |
| Tests | `npm test` | 159 passed / 15 files |
| Build | `npm run build` | pass (`tsc -b && vite build`) |
| Lint | `npm run lint` | clean (0 errors, 0 warnings) |

This documentation set replaces the earlier single `feature-plan.md`, which
mixed the forward-looking plan with progress notes. Each concern now lives in
one file so the roadmap stays stable while progress is tracked separately.

## Document map

| File | Purpose | When to read |
| --- | --- | --- |
| [`overview.md`](./overview.md) | Product direction, principles, technical baseline | Start here |
| [`roadmap.md`](./roadmap.md) | Milestone status dashboard and acceptance criteria | To see what is done/next |
| [`mvp-1-core-pomodoro.md`](./mvp-1-core-pomodoro.md) | MVP 1 phases 1–5 detail | Core app work |
| [`mvp-2-productivity.md`](./mvp-2-productivity.md) | MVP 2 (2.1–2.7) detail | Settings, tracking, history |
| [`mvp-2b-audio.md`](./mvp-2b-audio.md) | MVP 2B plan: timer cues + rainfall ambience | Sound/audio work |
| [`mvp-3-future.md`](./mvp-3-future.md) | Not-committed future scope | Before proposing scope |
| [`architecture.md`](./architecture.md) | Architecture + rules/workflow for AI agents | Before editing code |
| [`progress-log.md`](./progress-log.md) | Dated progress entries + current next action | After finishing a subphase |
| [`known-issues.md`](./known-issues.md) | Resolved/open issues and tech debt | During planning/triage |

## Status convention

| Status | Meaning |
| --- | --- |
| `DONE` | Implemented and verified against the current repository (tests/build or direct inspection). |
| `PARTIAL` | Partly implemented; remaining work is listed. |
| `IN PROGRESS` | Work started but not yet verified complete. |
| `TODO` | Planned, not started. |
| `VERIFY` | Cannot be confirmed by automated checks alone (e.g. visual/responsive/a11y) and needs manual review. |

## Ground rules for this documentation

1. This is a **roadmap, not proof** that a file matches its description. Always
   inspect the current source before editing.
2. Change a checkbox to `[x]` **only** with evidence (a passing test, a build, or
   direct code inspection). Never mark something done on memory alone.
3. Keep [`roadmap.md`](./roadmap.md), the per-MVP checklists, and
   [`progress-log.md`](./progress-log.md) consistent with each other.
4. When a product decision changes, update the relevant file so future agents do
   not reintroduce superseded behavior.
