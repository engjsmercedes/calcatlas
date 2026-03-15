"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useShareableCalculatorState<T extends Record<string, string>>(options: {
  initialState: T;
  keys: Array<keyof T>;
}) {
  const { initialState, keys } = options;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);
  const emptyState = useMemo(
    () =>
      Object.fromEntries(Object.keys(initialState).map((key) => [key, ""])) as T,
    [initialState]
  );
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    const nextState = { ...initialState };
    keys.forEach((key) => {
      const value = searchParams.get(String(key));
      if (value !== null) {
        nextState[key] = value as T[keyof T];
      }
    });
    initialized.current = true;
    setState(nextState);
  }, [initialState, keys, searchParams]);

  useEffect(() => {
    if (!initialized.current) {
      return;
    }

    const params = new URLSearchParams();
    keys.forEach((key) => {
      const value = state[key];
      if (value) {
        params.set(String(key), value);
      }
    });

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [keys, pathname, state]);

  const hasActiveValues = useMemo(
    () => keys.some((key) => Boolean(state[key])),
    [keys, state]
  );

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  return {
    state,
    setState,
    hasActiveValues,
    copyShareLink,
    reset: () => setState(emptyState)
  };
}
