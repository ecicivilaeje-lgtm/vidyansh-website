/**
 * Types for the people pages: Results, Faculty and About.
 * Kept apart from lib/types.ts so the homepage shapes stay untouched.
 */
import type { ExamCode } from "@/lib/types";

/* ---------- Results ---------- */

/** One row of the arrivals board. Strings are shown as supplied; "—" until verified. */
export interface BoardRow {
  id: string;
  student: string;
  from: string;
  destination: string;
  exam: ExamCode;
  rank: string;
  year: string;
}

export interface ResultsBoard {
  /** True while the board shows placeholder rows. Keeps a visible "Sample" marker. */
  isSample: boolean;
  /** Years offered as tabs, newest first. */
  years: string[];
  /** Exams offered in the filter. */
  exams: { code: ExamCode; label: string }[];
  rows: BoardRow[];
}

/** Extra detail for a homepage SuccessStory, told as a magazine feature on /results. */
export interface StoryFeature {
  /** Matches SuccessStory.id in content/results.ts. */
  storyId: string;
  headline: string;
  /** Short standfirst under the headline. */
  standfirst: string;
  /** Five stops, Dream to Destination, in the student's own terms. */
  journey: { stage: string; note: string }[];
}

/* ---------- Faculty ---------- */

export interface Department {
  id: string;
  name: string;
  /** One line on what the department prepares students for. */
  summary: string;
  subjects: string[];
  /** Number of faculty profile slots to show until profiles are supplied. */
  slots: number;
}

export interface TeachingStatement {
  n: string;
  statement: string;
  /** The italic word inside the statement. */
  accent: string;
  body: string;
}

/* ---------- About ---------- */

export interface BookParagraph {
  text: string;
  /** Mono note set in the left margin beside this paragraph on desktop. */
  margin?: string;
}

export interface BookChapter {
  id: string;
  numeral: string;
  title: string;
  paragraphs: BookParagraph[];
  /** Pull quote set after the paragraph at this index, breaking the measure. */
  pullQuote?: { after: number; text: string };
}
