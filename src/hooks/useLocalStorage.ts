import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: unknown) => T | null,
) {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);

    if (storedValue === null) {
      return initialValue;
    }

    try {
      const parsed: unknown = JSON.parse(storedValue);

      // validate guards the shape of persisted data, not just its JSON syntax
      return validate ? (validate(parsed) ?? initialValue) : (parsed as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
