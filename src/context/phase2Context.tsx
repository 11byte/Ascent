// src/context/phase2Context.tsx
"use client";
import { createContext, useContext } from "react";

const Phase2Context = createContext<{ username: string } | null>(null);

export function Phase2Provider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: { username: string };
}) {
  return (
    <Phase2Context.Provider value={value}>{children}</Phase2Context.Provider>
  );
}

export function usePhase2() {
  const ctx = useContext(Phase2Context);
  if (!ctx) throw new Error("usePhase2 must be used inside Phase2Provider");
  return ctx;
}
