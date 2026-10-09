"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ExamCode } from "@/lib/types";

interface ExamContextValue {
  exam: ExamCode | null;
  setExam: (exam: ExamCode | null) => void;
}

const ExamContext = createContext<ExamContextValue | null>(null);

/** Holds the exam a visitor picks in the Dream chapter so every section can personalise to it. */
export function ExamProvider({ children }: { children: ReactNode }) {
  const [exam, setExam] = useState<ExamCode | null>(null);
  const value = useMemo(() => ({ exam, setExam }), [exam]);
  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

export function useExam() {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error("useExam must be used inside <ExamProvider>");
  return ctx;
}
