import { useCallback, useEffect, useRef, useState } from "react";
import {
  AMBIENCE_PRESETS,
  AMBIENCE_RAIN,
  DEFAULT_AMBIENCE_VOLUME,
  FX_VOLUME,
  SOUND_FX,
} from "../constants/audio";
import type { AmbiencePreset, SoundFx } from "../constants/audio";

export function useAudio() {
  const rainRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef(DEFAULT_AMBIENCE_VOLUME);
  const lastAudibleVolumeRef = useRef(DEFAULT_AMBIENCE_VOLUME);
  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const [rainVolume, setRainVolumeState] = useState(DEFAULT_AMBIENCE_VOLUME);

  const playFx = useCallback((name: SoundFx) => {
    try {
      const audio = new Audio(SOUND_FX[name]);
      audio.volume = FX_VOLUME;
      audio.play().catch(() => {});
    } catch {
      // best-effort: a blocked or missing cue must not affect the timer.
    }
  }, []);

  const getRain = useCallback(() => {
    if (rainRef.current) {
      return rainRef.current;
    }

    const audio = new Audio(AMBIENCE_RAIN);
    audio.loop = true;
    audio.volume = volumeRef.current / 100;
    rainRef.current = audio;

    return audio;
  }, []);

  const setRainVolume = useCallback((percent: number) => {
    const next = Math.round(Number.isFinite(percent) ? percent : 0);
    const clamped = Math.min(100, Math.max(0, next));

    volumeRef.current = clamped;
    setRainVolumeState(clamped);

    if (clamped > 0) {
      lastAudibleVolumeRef.current = clamped;
    }

    if (rainRef.current) {
      rainRef.current.volume = clamped / 100;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setRainVolume(
      volumeRef.current > 0 ? 0 : lastAudibleVolumeRef.current,
    );
  }, [setRainVolume]);

  const setRainPreset = useCallback(
    (preset: AmbiencePreset) => {
      setRainVolume(AMBIENCE_PRESETS[preset]);
    },
    [setRainVolume],
  );

  const toggleRain = useCallback(() => {
    if (isRainPlaying) {
      rainRef.current?.pause();
      setIsRainPlaying(false);
      return;
    }

    try {
      const audio = getRain();
      setIsRainPlaying(true);
      audio.play().catch(() => setIsRainPlaying(false));
    } catch {
      setIsRainPlaying(false);
    }
  }, [getRain, isRainPlaying]);

  useEffect(() => {
    return () => {
      rainRef.current?.pause();
      rainRef.current = null;
    };
  }, []);

  return {
    playFx,
    isRainPlaying,
    toggleRain,
    rainVolume,
    setRainVolume,
    toggleMute,
    setRainPreset,
  };
}
