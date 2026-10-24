import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: unknown) => T | null,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);

      if (storedValue === null) {
        return initialValue;
      }

      const parsed: unknown = JSON.parse(storedValue);

      // validate guards the shape of persisted data, not just its JSON syntax
      return validate ? (validate(parsed) ?? initialValue) : (parsed as T);
    } catch {
      // unavailable storage (blocked/private mode) falls back to memory.
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // shortcut: failed writes are dropped and state stays in memory; add
      // retry/trim logic if quota errors become common.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
