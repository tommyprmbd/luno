import { useCallback, useState } from "react";
import { SESSION_COMPLETE_COPY } from "../constants/timer";
import type { NotificationPermissionState } from "../types/notification";
import type { CompletedSession } from "../types/session";

const NOTIFICATION_TAG = "luno-session-complete";

function getNotificationRegistration() {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  try {
    return navigator.serviceWorker
      .register("/sw.js")
      .then(() => navigator.serviceWorker.ready);
  } catch {
    return null;
  }
}

function showDirectNotification(title: string, body: string) {
  try {
    new Notification(title, { body, tag: NOTIFICATION_TAG });
  } catch {
    // notifications are best-effort; timer completion must still work.
  }
}

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

      const { title, body } = SESSION_COMPLETE_COPY[session.mode];
      const options: NotificationOptions = {
        body,
        tag: NOTIFICATION_TAG,
      };
      const registration = getNotificationRegistration();

      if (!registration) {
        showDirectNotification(title, body);
        return;
      }

      registration
        .then((serviceWorker) => serviceWorker.showNotification(title, options))
        .catch(() => showDirectNotification(title, body));
    } catch {
      // notifications are best-effort; timer completion must still work.
    }
  }, []);

  return { permission, requestPermission, notifySessionComplete };
}
