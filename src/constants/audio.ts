const SOUNDS_BASE = `${import.meta.env.BASE_URL}sounds/`;

export const SOUND_FX = {
  // reused for both breaks; starting any session sounds the same.
  pomodoroStart: `${SOUNDS_BASE}fx/pomodoro-start.mp3`,
  pomodoroFinish: `${SOUNDS_BASE}fx/pomodoro-finish.mp3`,
  breakFinish: `${SOUNDS_BASE}fx/break-finish.mp3`,
} as const;

export type SoundFx = keyof typeof SOUND_FX;

export const AMBIENCE_RAIN = `${SOUNDS_BASE}ambience/gentle-rain.mp3`;

// audio.volume is 0-1; the UI works in whole percent.
export const FX_VOLUME = 0.5;

export const DEFAULT_AMBIENCE_VOLUME = 65;

export const AMBIENCE_PRESETS = {
  soft: 35,
  deep: 80,
} as const;

export type AmbiencePreset = keyof typeof AMBIENCE_PRESETS;
