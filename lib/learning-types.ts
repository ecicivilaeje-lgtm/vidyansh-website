/**
 * Types for the learning pages: study material, free classes and the contact page.
 * Content files and the future API both conform to these shapes.
 */
import type { ExamCode } from "@/lib/types";

/* ---------- Study material ---------- */

export type MaterialFormat = "notes" | "formula-sheet" | "pyq-solutions" | "practice-book";
export type MaterialAvailability = "free" | "course";
/** Spine colour on the shelf. Purely visual. */
export type SpineTone = "ink" | "graphite" | "charcoal" | "parchment";

export interface StudyMaterial {
  id: string;
  /** Shelf code printed on the spine, e.g. "SOM-01". */
  code: string;
  title: string;
  subject: string;
  exams: ExamCode[];
  format: MaterialFormat;
  /** Null until the real file is supplied. */
  pages: number | null;
  availability: MaterialAvailability;
  /** Null until the file exists; the download stays disabled ("Coming soon"). */
  downloadHref: string | null;
  spine: { tone: SpineTone; /** rem */ height: number; /** rem */ width: number };
}

export interface StudyMaterialPage {
  eyebrow: string;
  intro: string;
  sampleNote: string;
  formats: Record<MaterialFormat, string>;
}

/* ---------- Free classes ---------- */

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type DaySlot = "morning" | "evening";

export interface LiveClass {
  title: string;
  subject: string;
  exam: string;
  /** Null until a real date is announced; shown as "Schedule to be announced". */
  startsAt: string | null;
}

export interface ProgrammeEntry {
  day: Weekday;
  slot: DaySlot;
  subject: string;
  topic: string;
  exam: string;
}

export type PosterKind = "beam" | "bernoulli" | "circuit" | "truss" | "phasor" | "mohr";

export interface RecordedLecture {
  id: string;
  title: string;
  subject: string;
  exam: string;
  /** Minutes; null until the recording exists. */
  durationMin: number | null;
  /** Null until the recording is published; the row stays "Coming soon". */
  href: string | null;
  poster: PosterKind;
}

/* ---------- Contact ---------- */

export interface FaqItem {
  q: string;
  a: string;
}

export interface ContactPage {
  officeHours: { days: string; hours: string }[];
  callTimes: { value: string; label: string }[];
  faq: FaqItem[];
}
