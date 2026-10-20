import { useCallback, useState } from "react";
import type { NotificationPermissionState } from "../types/notification";
import type { CompletedSession } from "../types/session";

const NOTIFICATION_COPY: Record<
  CompletedSession["mode"],
  { title: string; body: string }
> = {
  pomodoro: {
    title: "Pomodoro complete",
    body: "Time for a break.",
  },
  "short-break": {
    title: "Short break complete",
    body: "Ready for another Pomodoro?",
  },
  "long-break": {
    title: "Long break complete",
    body: "Ready for another Pomodoro?",
  },
};

function getPermission(): NotificationPermissionState {
  try {
    return typeof Notification === "undefined"
      ? "unsupported"
      : Notification.permission;
  } catch {
    return "unsupported";
  }
}

export function useNotifications() {
  const [permission, setPermission] =
    useState<NotificationPermissionState>(getPermission);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") {
      return;
    }

    try {
      const nextPermission = await Notification.requestPermission();

      if (nextPermission) {
        setPermission(nextPermission);
      }
    } catch {
      // a rejected permission request must not make the app unusable.
    }
  }, []);

  const notifySessionComplete = useCallback((session: CompletedSession) => {
    try {
      if (
        typeof Notification === "undefined" ||
        Notification.permission !== "granted"
      ) {
        return;
      }

      const { title, body } = NOTIFICATION_COPY[session.mode];

      new Notification(title, { body, tag: "luno-session-complete" });
    } catch {
      // notifications are best-effort; timer completion must still work.
    }
  }, []);

  return { permission, requestPermission, notifySessionComplete };
}
