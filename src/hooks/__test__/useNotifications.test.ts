import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CompletedSession } from "../../types/session";
import { useNotifications } from "../useNotifications";

type SentNotification = {
  title: string;
  options?: NotificationOptions;
};

let sentNotifications: SentNotification[] = [];
const originalServiceWorker = Object.getOwnPropertyDescriptor(
  navigator,
  "serviceWorker",
);

class MockNotification {
  static permission: NotificationPermission = "default";
  static requestPermission = vi.fn(async () => MockNotification.permission);

  constructor(title: string, options?: NotificationOptions) {
    sentNotifications.push({ title, options });
  }
}

const session = (
  mode: CompletedSession["mode"] = "pomodoro",
): CompletedSession => ({
  mode,
  completedAt: 1,
  durationSeconds: 1500,
});

describe("useNotifications", () => {
  beforeEach(() => {
    sentNotifications = [];
    MockNotification.permission = "default";
    MockNotification.requestPermission = vi.fn(
      async () => MockNotification.permission,
    );
    vi.stubGlobal("Notification", MockNotification);
  });

  afterEach(() => {
    if (originalServiceWorker) {
      Object.defineProperty(navigator, "serviceWorker", originalServiceWorker);
    } else {
      delete (navigator as unknown as { serviceWorker?: unknown }).serviceWorker;
    }

    vi.unstubAllGlobals();
  });

  it("should reflect the current browser permission", () => {
    MockNotification.permission = "granted";

    const { result } = renderHook(() => useNotifications());

    expect(result.current.permission).toBe("granted");
  });

  it("should update permission after a granted request", async () => {
    MockNotification.requestPermission.mockImplementation(async () => {
      MockNotification.permission = "granted";
      return "granted";
    });

    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.permission).toBe("granted");
    expect(MockNotification.requestPermission).toHaveBeenCalledOnce();
  });

  it("should update permission after a denied request", async () => {
    MockNotification.requestPermission.mockResolvedValue("denied");

    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.permission).toBe("denied");
  });

  it("should handle unsupported browsers", async () => {
    vi.stubGlobal("Notification", undefined);

    const { result } = renderHook(() => useNotifications());

    expect(result.current.permission).toBe("unsupported");

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.permission).toBe("unsupported");
  });

  it("should not throw when the notification API fails", () => {
    vi.stubGlobal(
      "Notification",
      class {
        static get permission(): NotificationPermission {
          throw new Error("notifications blocked");
        }
      },
    );

    const { result } = renderHook(() => useNotifications());

    expect(() => {
      result.current.notifySessionComplete(session());
    }).not.toThrow();
  });

  it("should prefer service worker notifications when supported", async () => {
    const showNotification = vi.fn().mockResolvedValue(undefined);
    const registration = {
      showNotification,
    } as unknown as ServiceWorkerRegistration;
    const register = vi.fn().mockResolvedValue(registration);

    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: {
        register,
        ready: Promise.resolve(registration),
      },
    });
    MockNotification.permission = "granted";

    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      result.current.notifySessionComplete(session());
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(register).toHaveBeenCalledWith("/sw.js");
    expect(showNotification).toHaveBeenCalledWith("Pomodoro complete", {
      body: "Time for a break.",
      tag: "luno-session-complete",
    });
    expect(sentNotifications).toEqual([]);
  });

  it("should notify for every completed mode when granted", () => {
    MockNotification.permission = "granted";

    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.notifySessionComplete(session("pomodoro"));
      result.current.notifySessionComplete(session("short-break"));
      result.current.notifySessionComplete(session("long-break"));
    });

    expect(sentNotifications).toEqual([
      {
        title: "Pomodoro complete",
        options: {
          body: "Time for a break.",
          tag: "luno-session-complete",
        },
      },
      {
        title: "Short break complete",
        options: {
          body: "Ready for another Pomodoro?",
          tag: "luno-session-complete",
        },
      },
      {
        title: "Long break complete",
        options: {
          body: "Ready for another Pomodoro?",
          tag: "luno-session-complete",
        },
      },
    ]);
  });

  it("should not notify without permission", () => {
    const { result, rerender } = renderHook(() => useNotifications());

    act(() => {
      result.current.notifySessionComplete(session());
    });

    MockNotification.permission = "denied";
    rerender();

    act(() => {
      result.current.notifySessionComplete(session());
    });

    expect(sentNotifications).toEqual([]);
  });
});
