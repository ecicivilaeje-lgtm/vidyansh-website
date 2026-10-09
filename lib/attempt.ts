import type { AttemptState, Paper } from "@/lib/types";

/**
 * Attempts are kept on this device until the attempts API exists
 * (POST /tests/{id}/attempts, PATCH /attempts/{id}, POST /attempts/{id}/submit).
 * Every figure derived here comes from the student's own answers; nothing is invented.
 */
const key = (testId: string) => `vidyansh:attempt:${testId}`;

export function loadAttempt(testId: string): AttemptState | null {
  try {
    const raw = window.localStorage.getItem(key(testId));
    return raw ? (JSON.parse(raw) as AttemptState) : null;
  } catch {
    return null;
  }
}

export function saveAttempt(testId: string, state: AttemptState) {
  try {
    window.localStorage.setItem(key(testId), JSON.stringify(state));
  } catch {
    /* storage unavailable: the attempt still works for this page view */
  }
}

export function clearAttempt(testId: string) {
  try {
    window.localStorage.removeItem(key(testId));
  } catch {
    /* ignore */
  }
}

export function newAttempt(paper: Paper): AttemptState {
  const n = paper.questions.length;
  return {
    paperId: paper.id,
    startedAt: Date.now(),
    answers: Array(n).fill(null),
    marked: Array(n).fill(false),
    visited: Array.from({ length: n }, (_, i) => i === 0),
    current: 0,
    submittedAt: null,
  };
}

export interface Scorecard {
  score: number;
  maxScore: number;
  correct: number;
  wrong: number;
  skipped: number;
  /** Correct as a share of attempted questions, 0 to 1; null when nothing was attempted. */
  accuracy: number | null;
  timeTakenSec: number;
  bySubject: { subject: string; correct: number; attempted: number; total: number }[];
}

export function scoreAttempt(paper: Paper, a: AttemptState): Scorecard {
  let correct = 0;
  let wrong = 0;
  const subjects = new Map<string, { correct: number; attempted: number; total: number }>();
  paper.questions.forEach((q, i) => {
    const s = subjects.get(q.subject) ?? { correct: 0, attempted: 0, total: 0 };
    s.total += 1;
    const ans = a.answers[i];
    if (ans !== null) {
      s.attempted += 1;
      if (ans === q.answer) {
        correct += 1;
        s.correct += 1;
      } else wrong += 1;
    }
    subjects.set(q.subject, s);
  });
  const attempted = correct + wrong;
  const end = a.submittedAt ?? Date.now();
  return {
    score: correct * paper.marking.correct + wrong * paper.marking.wrong,
    maxScore: paper.questions.length * paper.marking.correct,
    correct,
    wrong,
    skipped: paper.questions.length - attempted,
    accuracy: attempted ? correct / attempted : null,
    timeTakenSec: Math.min(Math.round((end - a.startedAt) / 1000), paper.durationMin * 60),
    bySubject: [...subjects].map(([subject, v]) => ({ subject, ...v })),
  };
}

export const formatDuration = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
};

export const formatClock = (sec: number) =>
  [Math.floor(sec / 3600), Math.floor((sec % 3600) / 60), sec % 60].map((n) => String(n).padStart(2, "0")).join(":");
