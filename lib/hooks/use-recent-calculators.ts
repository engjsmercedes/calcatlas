"use client";

import { useEffect, useState } from "react";

import type { CalculatorSlug } from "@/data/calculators";

const STORAGE_KEY = "calc-atlas-recent";

export function useRecentCalculators(currentSlug?: CalculatorSlug) {
  const [recent, setRecent] = useState<CalculatorSlug[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      setRecent(JSON.parse(stored) as CalculatorSlug[]);
    } catch {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    if (!currentSlug) {
      return;
    }

    setRecent((previous) => {
      const next = [currentSlug, ...previous.filter((item) => item !== currentSlug)].slice(0, 4);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [currentSlug]);

  return recent;
}
