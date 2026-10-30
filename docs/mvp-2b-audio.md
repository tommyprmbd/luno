# MVP 2B — Audio & Ambience

**Goal:** make Luno audible without changing its single-page flow: short sound
cues for the Pomodoro lifecycle and an optional looping rainfall ambience.

**Overall status:** `TODO` — plan only; no code written yet.

**Scope owner note:** this is a small product increment after MVP 2. It does not
change timer, task, history, or notification rules.

---

## Fixed decisions

- Use the browser's native `Audio` / `HTMLAudioElement`; **no new dependency**.
- Assets already live in `public/` and must be referenced through
  `import.meta.env.BASE_URL`, so sub-path deployments keep working.
- Only these files are in scope:

| Purpose | File |
| --- | --- |
| Pomodoro start cue | `public/sounds/fx/pomodoro-start.mp3` |
| Pomodoro finish cue | `public/sounds/fx/pomodoro-finish.mp3` |
| Break finish cue | `public/sounds/fx/break-finish.mp3` |
| Rain ambience (loop) | `public/sounds/ambience/gentle-rain.mp3` |

- **Excluded:** `drinking.mp3`, `drink-notify.mp3` (hydration is not implemented),
  and `cafe-ambience.mp3` / `forest-ambience.mp3` (not requested).
- Audio is best-effort. A blocked or failed `play()` must never delay or break
  timer completion, history recording, notifications, or the in-app alert.
- Ambience state is **not persisted**. On reload the app starts silent, because
  browsers cannot autoplay audio without a user gesture.
- The rainfall control matches `docs/design/code.html`: a toggle button that
  also owns a volume popover (readout, mute, slider, `Soft`/`Deep` presets,
  `Turn Off`). Default ambience volume is `65%`; `Soft` = `35%`, `Deep` = `80%`.
- Volume and mute are **ephemeral per session** too. Persisting them would mean
  a second storage key for a control that already resets to "off" on reload;
  keep the whole ambience state in the hook until users ask otherwise.

## Sound behavior matrix

| Event | Sound | Notes |
| --- | --- | --- |
| START pressed in Pomodoro mode from `idle` | `pomodoro-start` | Only the idle → running transition. |
| RESUME after pause | none | Avoid replaying the start cue. |
| RESET, mode switch, or starting a break | none | Not requested. |
| A Pomodoro finishes | `pomodoro-finish` | Same single completion event used by history/notifications. |
| A short or long break finishes | `break-finish` | One cue for both break lengths. |
| Rainfall button clicked while off | `gentle-rain` loop at the current volume | Starts playback, highlights the button, reveals the popover. |
| Rainfall button clicked while on | stop | Matches the popover's `Turn Off`; button and popover return to idle. |
| Volume slider moved | none | Sets `audio.volume` live, `0–100` → `0–1`; zero leaves the loop playing but silent. |
| Mute clicked at volume > 0 | none | Remembers the level, sets volume `0`, flips the icon to muted. |
| Mute clicked at volume `0` | none | Restores the remembered level (default `65` if none). |
| `Soft` / `Deep` preset | none | Sets `35%` / `80%` and updates slider + readout. |
| Popover `Turn Off` | stop | Same path as the button; the popover closes. |

## Design

### 1. Constants — `src/constants/audio.ts`

```text
SOUND_FX = { pomodoroStart, pomodoroFinish, breakFinish }  // relative paths
AMBIENCE_RAIN = "ambience/gentle-rain.mp3"
FX_VOLUME, DEFAULT_AMBIENCE_VOLUME (65), AMBIENCE_PRESETS = { soft: 35, deep: 80 }
```

Resolve file URLs once as `${import.meta.env.BASE_URL}sounds/...`. Volumes are
stored as integers `0–100` (what the UI shows) and divided by `100` only when
assigned to `audio.volume`.

### 2. Hook — `src/hooks/useAudio.ts`

Owns all audio behavior so `App` and `Header` stay presentational.

- `playFx(name)` creates a fresh `Audio` per call, sets the fixed volume, and
  calls `play().catch(() => {})`. A new element per cue keeps two cues from
  cutting each other off and is cheap because the browser caches the file.
- `isRainPlaying` + `toggleRain()` own one lazily created, `loop = true` ambience
  element. Turning off pauses it; turning on resumes it from the current
  position. If `play()` rejects, keep the button state off.
- `rainVolume` + `setRainVolume(percent)` clamp to `0–100` and write
  `element.volume` immediately, so dragging the slider is audible live.
- `toggleMute()` stores the current level in a ref when it is `> 0` and sets `0`;
  when it is `0`, it restores the stored level (or `DEFAULT_AMBIENCE_VOLUME`).
  Mute is volume `0`, not `pause()`, so the loop keeps running silently.
- `setRainPreset("soft" | "deep")` is just `setRainVolume(AMBIENCE_PRESETS[...])`
  — no separate state.
- Cleanup on unmount pauses the rain element.
- `shortcut:` no preloading or Web Audio graph; the first cue can be slightly
  late. Preload or move to Web Audio only if measured latency becomes a problem.
- `shortcut:` volume/mute are in-memory only, so they reset on reload with the
  off state. Add a `useLocalStorage` key if users ask to keep their level.

### 3. Wiring — `App.tsx`

- Create one `useAudio()` instance and pass only what the UI needs to `Header`.
- In `handleStart`, play `pomodoro-start` only when `status === "idle"` and
  `mode === "pomodoro"`.
- In the existing `lastCompletedSession` effect (after history/notification
  handling), play `pomodoro-finish` for `pomodoro` and `break-finish` for both
  break modes. Reuse the existing dedupe/`handledSession` guard — do not add a
  second completion detector.
- Pass `isRainPlaying`, `onToggleRain`, `rainVolume`, `onChangeRainVolume`,
  `onToggleMute`, and `onPresetRainVolume` to `Header`.

### 4. Header — `src/components/Header/Header.tsx`

- Replace the internal `showSoundNotice` state and the “isn't available yet”
  message with the real toggle props.
- Keep the accessible name `Rainfall soundscape`; add `aria-pressed` and an
  active style on `.sound-button` while rain is playing. The existing
  `.sound-pulse` dot becomes the playing indicator instead of being decorative.
- Add the reference popover anchored to the button, rendered only while rain is
  playing:
  - header row: `Rainfall Soundscape` + live `NN%` readout;
  - `Ambient White Noise` label with an `ACTIVE` pill bound to playback state;
  - mute icon button, `input[type="range"]` `0–100`, `100` end label;
  - `🍃 Soft` and `🌧️ Deep` preset buttons, plus `Turn Off` (calls the same
    `onToggleRain`).
- Visibility uses CSS, not React state:
  `.sound-wrapper:hover .sound-popover, .sound-wrapper:focus-within .sound-popover`.
  The pointer is already on the button after a click, and `focus-within` keeps
  the slider keyboard-reachable.
  - `shortcut:` no click-outside handler and no 350 ms hide delay like the
    reference; hover/focus alone hides it. Add dismissal state only if the
    popover blocks something.
- Slider `aria-label="Rainfall volume"`, value `{rainVolume}`, `onChange` parses
  the number and calls `onChangeRainVolume`. The mute button's label flips
  between `Mute rainfall` and `Unmute rainfall`; its icon is `🔊` at volume `> 0`
  and `🔇` at `0`.
- Update the Header test: drop the old unavailable-notice assertion and assert
  the toggle handler, `aria-pressed`, the readout, the slider, mute, presets,
  and `Turn Off`.

## Edge cases to handle

- **Autoplay policy:** the start cue runs inside the click gesture and should
  play; completion cues may be blocked in some browsers (notably Safari). They
  are best-effort, and the in-app completion alert still covers feedback.
- **Rapid clicks / double START:** at most one start cue per idle → running
  transition.
- **Volume extremes:** `0%` is a muted loop that is still playing; `100%` is
  allowed. Values are clamped so the slider cannot send `NaN` or out-of-range.
- **Mute with no prior level:** pressing unmute at `0` falls back to the default
  `65%`, so it never restores to silence.
- **Turning rain off while muted:** state returns to off; the remembered level
  is kept for the next start, matching the reference.
- **Presets while off:** changing volume does not start playback; only the
  toggle (or `Turn Off`) does.
- **StrictMode:** the existing completion-event dedupe remains the only trigger
  for the finish cue; no double sounds on rerender.
- **Base path:** URLs must work under `vite preview` and a non-root base.
- **Unmount:** pause rain so navigation/reloads do not leave a hidden loop
  running.
- **Missing/corrupt files:** rejected `play()` is swallowed; no UI error state,
  matching the notifications policy.

## Testing plan

- New `src/hooks/__test__/useAudio.test.ts` with a stubbed `Audio` class:
  - correct URL, volume, and play call per cue;
  - rain starts looping, pauses on toggle off, resumes on toggle on;
  - volume changes write `audio.volume`; `0` and `100` clamp correctly;
  - mute stores the level, zeroes it, and unmute restores it (default when none);
  - presets set `0.35` and `0.8`;
  - rejected `play()` is a no-op and leaves rain state off;
  - unmount pauses rain.
- `Header.test.tsx`: rain button invokes the handler and reports `aria-pressed`;
  the popover only renders while playing; slider calls `onChangeRainVolume` with
  a number; mute button calls `onToggleMute` and flips its label at `0%`;
  `Soft`/`Deep` call the preset handler; `Turn Off` calls `onToggleRain`.
- `App.test.tsx`:
  - START in Pomodoro mode plays the start cue; RESUME and break START do not;
  - Pomodoro completion plays the finish cue; short/long break completion plays
    the break cue;
  - a failing `play()` does not stop history, notification, or the completion
    alert;
  - rain toggle and volume changes are wired through from `Header` to the
    hook (the button starts the loop, the slider changes `audio.volume`).
- jsdom has no media implementation; stub `HTMLMediaElement.prototype.play` /
  `pause` or `globalThis.Audio` in the affected tests and restore afterward.
- Full gate: `npm test`, `npm run build`, `npm run lint`.

## Subphases

### 2B.1 — Audio foundation — `TODO`

- [ ] Add `src/constants/audio.ts` with the three cues, rain file, default
      volume, and the `Soft`/`Deep` preset levels.
- [ ] Add `useAudio` with `playFx`, `toggleRain`, `rainVolume`,
      `setRainVolume`, `toggleMute`, preset setter, and cleanup.
- [ ] Add hook tests (URLs, play/pause, volume/clamp, mute restore, presets,
      failure path, cleanup).

### 2B.2 — Timer cues — `TODO`

- [ ] Play the start cue only on idle → running in Pomodoro mode.
- [ ] Play finish cues from the existing completion event.
- [ ] Add App regression tests (start/resume/no break-start, finish mapping,
      audio failure isolation).
- [ ] Verify no second completion detector or duplicate cues under StrictMode.

### 2B.3 — Rainfall ambience — `TODO`

- [ ] Wire `Header` props; remove the “unavailable” notice.
- [ ] Add `aria-pressed`, active styling, and the playing indicator.
- [ ] Add the volume popover: readout, mute toggle, `0–100` slider, `Soft`/`Deep`
      presets, and `Turn Off`, shown on hover/focus while playing.
- [ ] Test toggle wiring, popover visibility, slider/mute/preset handlers, and
      Header state; update the old unavailability test.

### 2B.4 — Verification & docs — `TODO`

- [ ] Manual browser check: cue volume is not jarring, rain loops seamlessly,
      the slider/mute/presets audibly change level, `Turn Off` matches the
      button, the popover reveals on hover and after a click, no console errors
      under `npm run dev` and `npm run preview` (root base).
- [ ] Confirm deployment under a non-root base still resolves sound files.
- [ ] Update `roadmap.md` status/evidence, this checklist, and
      `progress-log.md` with the actual test/build/lint results.
- [ ] Add a `known-issues` entry if autoplay limitations are observed in
      practice rather than predicted.

## Acceptance criteria

- [ ] Pomodoro start, Pomodoro finish, and break finish play the mapped cues.
- [ ] No start cue on resume, reset, mode change, or break start.
- [ ] Finish cues are driven by the same single completion event as history and
      notifications, with no duplicates.
- [ ] The rainfall button starts/stops a looped `gentle-rain.mp3`, reflects state
      via `aria-pressed` and visual styling, and degrades silently if blocked.
- [ ] The popover shows the live volume percentage, applies slider changes
      immediately, mutes/unmutes to the previous level, applies `Soft` (35%) and
      `Deep` (80%), and its `Turn Off` stops playback.
- [ ] Ambient playback and its volume never auto-start on load and are not
      persisted.
- [ ] Audio failures cannot break any existing behavior.
- [ ] No new runtime dependencies; app remains a single page.
- [ ] `npm test`, `npm run build`, and `npm run lint` pass.

## Risks & deliberate non-goals

- **Autoplay:** completion cues may be silent in browsers with strict media
  policies. Accepted; the completion alert is the guaranteed channel.
- **Volume is session-only:** the slider and mute work but reset on reload along
  with playback. Persisting the level is a later `useLocalStorage` key if users
  ask, not part of 2B.
- **No click-outside/Escape dismissal for the popover:** CSS hover/focus
  visibility covers normal use; add explicit dismissal only if it obstructs
  something.
- **No additional ambience tracks:** cafe/forest files stay unused.
- **No hydration/drink sounds:** `drink*.mp3` is explicitly out of scope.
- **No offline/service-worker audio caching** beyond normal HTTP cache.

**Next action:** implement 2B.1, then re-run the full gate before 2B.2.
