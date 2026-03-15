"use client";

import { createContext, useContext } from "react";

export interface EmbedOptions {
  showActions: boolean;
  showExamples: boolean;
  showComparison: boolean;
}

const defaultEmbedOptions: EmbedOptions = {
  showActions: true,
  showExamples: true,
  showComparison: true
};

const EmbedOptionsContext = createContext<EmbedOptions>(defaultEmbedOptions);

export function EmbedOptionsProvider({
  value,
  children
}: {
  value: Partial<EmbedOptions>;
  children: React.ReactNode;
}) {
  return <EmbedOptionsContext.Provider value={{ ...defaultEmbedOptions, ...value }}>{children}</EmbedOptionsContext.Provider>;
}

export function useEmbedOptions() {
  return useContext(EmbedOptionsContext);
}
