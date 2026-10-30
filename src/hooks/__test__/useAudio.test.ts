import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AMBIENCE_PRESETS,
  AMBIENCE_RAIN,
  DEFAULT_AMBIENCE_VOLUME,
  FX_VOLUME,
  SOUND_FX,
} from "../../constants/audio";
import { useAudio } from "../useAudio";

class MockAudio {
  static instances: MockAudio[] = [];
  static playImpl = () => Promise.resolve();

  src: string;
  loop = false;
  volume = 1;
  play = vi.fn(() => MockAudio.playImpl());
  pause = vi.fn();

  constructor(src?: string) {
    this.src = src ?? "";
    MockAudio.instances.push(this);
  }
}

describe("useAudio", () => {
  beforeEach(() => {
    MockAudio.instances = [];
    MockAudio.playImpl = () => Promise.resolve();
    vi.stubGlobal("Audio", MockAudio);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should play a fresh element for each cue", () => {
    const { result } = renderHook(() => useAudio());

    act(() => result.current.playFx("pomodoroStart"));
    act(() => result.current.playFx("pomodoroFinish"));
    act(() => result.current.playFx("breakFinish"));

    expect(MockAudio.instances.map((audio) => audio.src)).toEqual([
      SOUND_FX.pomodoroStart,
      SOUND_FX.pomodoroFinish,
      SOUND_FX.breakFinish,
    ]);
    expect(
      MockAudio.instances.every((audio) => audio.volume === FX_VOLUME),
    ).toBe(true);
    expect(
      MockAudio.instances.every((audio) => audio.play.mock.calls.length === 1),
    ).toBe(true);
  });

  it("should loop the rain and pause/resume it", () => {
    const { result } = renderHook(() => useAudio());

    act(() => result.current.toggleRain());

    const rain = MockAudio.instances[0];

    expect(rain.src).toBe(AMBIENCE_RAIN);
    expect(rain.loop).toBe(true);
    expect(rain.volume).toBe(DEFAULT_AMBIENCE_VOLUME / 100);
    expect(rain.play).toHaveBeenCalledTimes(1);
    expect(result.current.isRainPlaying).toBe(true);

    act(() => result.current.toggleRain());

    expect(rain.pause).toHaveBeenCalledTimes(1);
    expect(result.current.isRainPlaying).toBe(false);

    act(() => result.current.toggleRain());

    expect(MockAudio.instances).toHaveLength(1);
    expect(rain.play).toHaveBeenCalledTimes(2);
  });

  it("should apply and clamp the rain volume", () => {
    const { result } = renderHook(() => useAudio());

    act(() => result.current.toggleRain());

    const rain = MockAudio.instances[0];

    act(() => result.current.setRainVolume(35));
    expect(rain.volume).toBe(0.35);
    expect(result.current.rainVolume).toBe(35);

    act(() => result.current.setRainVolume(250));
    expect(rain.volume).toBe(1);
    expect(result.current.rainVolume).toBe(100);

    act(() => result.current.setRainVolume(Number.NaN));
    expect(rain.volume).toBe(0);
    expect(result.current.rainVolume).toBe(0);
  });

  it("should mute to zero and restore the previous level", () => {
    const { result } = renderHook(() => useAudio());

    act(() => result.current.toggleRain());
    act(() => result.current.setRainVolume(40));
    act(() => result.current.toggleMute());

    expect(result.current.rainVolume).toBe(0);
    expect(MockAudio.instances[0].volume).toBe(0);

    act(() => result.current.toggleMute());

    expect(result.current.rainVolume).toBe(40);
    expect(MockAudio.instances[0].volume).toBe(0.4);
  });

  it("should restore the default when unmuting without a previous level", () => {
    const { result } = renderHook(() => useAudio());

    act(() => result.current.toggleMute());
    expect(result.current.rainVolume).toBe(0);

    act(() => result.current.toggleMute());

    expect(result.current.rainVolume).toBe(DEFAULT_AMBIENCE_VOLUME);
  });

  it("should apply the soft and deep presets", () => {
    const { result } = renderHook(() => useAudio());

    act(() => result.current.toggleRain());
    act(() => result.current.setRainPreset("soft"));

    expect(result.current.rainVolume).toBe(AMBIENCE_PRESETS.soft);
    expect(MockAudio.instances[0].volume).toBe(AMBIENCE_PRESETS.soft / 100);

    act(() => result.current.setRainPreset("deep"));

    expect(result.current.rainVolume).toBe(AMBIENCE_PRESETS.deep);
    expect(MockAudio.instances[0].volume).toBe(AMBIENCE_PRESETS.deep / 100);
  });

  it("should stay off when playback is rejected", async () => {
    MockAudio.playImpl = () => Promise.reject(new Error("blocked"));
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      result.current.toggleRain();
      await Promise.resolve();
    });

    expect(result.current.isRainPlaying).toBe(false);
  });

  it("should pause the rain on unmount", () => {
    const { result, unmount } = renderHook(() => useAudio());

    act(() => result.current.toggleRain());

    const rain = MockAudio.instances[0];

    unmount();

    expect(rain.pause).toHaveBeenCalledTimes(1);
  });
});
