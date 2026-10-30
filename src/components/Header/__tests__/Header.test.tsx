import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Header from "../Header";
import type { AmbiencePreset } from "../../../constants/audio";

type HeaderProps = Parameters<typeof Header>[0];

function renderHeader(overrides: Partial<HeaderProps> = {}) {
  const props: HeaderProps = {
    onOpenHistory: vi.fn(),
    onOpenSettings: vi.fn(),
    onOpenAbout: vi.fn(),
    isRainPlaying: false,
    rainVolume: 65,
    onToggleRain: vi.fn(),
    onChangeRainVolume: vi.fn(),
    onToggleMute: vi.fn(),
    onPresetRainVolume: vi.fn(),
    ...overrides,
  };

  render(<Header {...props} />);

  return props;
}

describe("Header", () => {
  it("should open history and settings", async () => {
    const user = userEvent.setup();
    const onOpenHistory = vi.fn();
    const onOpenSettings = vi.fn();

    renderHeader({ onOpenHistory, onOpenSettings });

    await user.click(screen.getByRole("button", { name: "History" }));
    await user.click(screen.getByRole("button", { name: "Settings" }));

    expect(onOpenHistory).toHaveBeenCalledTimes(1);
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("should open about", async () => {
    const user = userEvent.setup();
    const onOpenAbout = vi.fn();

    renderHeader({ onOpenAbout });

    await user.click(screen.getByRole("button", { name: "About" }));

    expect(onOpenAbout).toHaveBeenCalledTimes(1);
  });

  it("should toggle the rainfall soundscape", async () => {
    const user = userEvent.setup();
    const onToggleRain = vi.fn();

    renderHeader({ onToggleRain });

    const sound = screen.getByRole("button", {
      name: "Rainfall soundscape",
    });

    expect(sound).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByText("Rainfall Soundscape")).not.toBeInTheDocument();

    await user.click(sound);

    expect(onToggleRain).toHaveBeenCalledTimes(1);
  });

  it("should show the volume popover while the rainfall is playing", () => {
    renderHeader({ isRainPlaying: true, rainVolume: 65 });

    expect(
      screen.getByRole("button", { name: "Rainfall soundscape" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Rainfall Soundscape")).toBeInTheDocument();
    expect(screen.getByText("65%")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Rainfall volume" })).toHaveValue(
      "65",
    );
    expect(screen.getByRole("button", { name: "Mute rainfall" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Soft" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Deep" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Turn Off" })).toBeVisible();
  });

  it("should report volume changes", () => {
    const onChangeRainVolume = vi.fn();

    renderHeader({ isRainPlaying: true, onChangeRainVolume });

    fireEvent.change(
      screen.getByRole("slider", { name: "Rainfall volume" }),
      { target: { value: "35" } },
    );

    expect(onChangeRainVolume).toHaveBeenCalledWith(35);
  });

  it("should flip the mute label at zero volume", () => {
    renderHeader({ isRainPlaying: true, rainVolume: 0 });

    expect(
      screen.getByRole("button", { name: "Unmute rainfall" }),
    ).toBeVisible();
  });

  it("should apply the presets", async () => {
    const user = userEvent.setup();
    const onPresetRainVolume = vi.fn();

    renderHeader({ isRainPlaying: true, onPresetRainVolume });

    await user.click(screen.getByRole("button", { name: "Soft" }));
    await user.click(screen.getByRole("button", { name: "Deep" }));

    const calls = onPresetRainVolume.mock.calls as [AmbiencePreset][];

    expect(calls[0][0]).toBe("soft");
    expect(calls[1][0]).toBe("deep");
  });

  it("should turn rainfall off from the popover", async () => {
    const user = userEvent.setup();
    const onToggleRain = vi.fn();

    renderHeader({ isRainPlaying: true, onToggleRain });

    await user.click(screen.getByRole("button", { name: "Turn Off" }));

    expect(onToggleRain).toHaveBeenCalledTimes(1);
  });
});
