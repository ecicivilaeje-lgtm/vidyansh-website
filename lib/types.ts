/**
 * Shared domain types. Content files in /content and the future API both
 * conform to these shapes, so swapping sample data for live data only
 * changes the data layer in /lib/data.
 */

export type ExamCode = "ssc-je" | "rrb-je" | "ae-je" | "state-ae-je" | "foundation";

export interface Exam {
  code: ExamCode;
  name: string;
  /** Short descriptor shown under the compass in the journey. */
  descriptor: string;
  /** Compass bearing used purely as a visual device (degrees). */
  bearing: number;
  /** Route-map details for the /exams page. Qualitative only: no marks, counts, dates or cut-offs. */
  fullName?: string;
  /** Who the exam is for, in one or two sentences. */
  forWhom?: string;
  /** Eligibility in general terms; the official notification is the authority. */
  eligibility?: string;
  /** The stages a candidate passes through, in order. */
  stages?: string[];
  /** A short note on how the route varies, e.g. by commission. */
  routeNote?: string;
}

export interface NavPillar {
  verb: "Learn" | "Practice" | "Achieve";
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface JourneyStage {
  id: "dream" | "direction" | "preparation" | "performance" | "destination";
  number: string;
  title: string;
  question: string;
  light: string;
}

export interface Course {
  slug: string;
  exam: ExamCode;
  name: string;
  /** The name set as a display title: a roman part and an italic part. */
  title: [string, string];
  /** Exam category line, e.g. "Staff Selection Commission · Junior Engineer". */
  category: string;
  summary: string;
  /** One-sentence promise set large under the title. */
  lead: string;
  benefits: { title: string; body: string }[];
  mode: "Live" | "Recorded" | "Live + recorded";
  duration: string;
  nextBatch: string;
  /** Test-series exam route this course pairs with, when one exists. */
  practiceExam?: ExamCode;
  /** Course photograph. Until one is supplied, the panel shows its drawn plate. */
  image?: { src: string; alt: string };
  /** Engineering-drawing plate used as the course image in the meantime. */
  plate: "beam" | "track" | "bridge" | "gear";
  /* ---- Course details page (all optional so older views keep working) ---- */
  /** Overview paragraphs. */
  overview?: string[];
  /** Note shown beside the syllabus, e.g. which engineering stream is listed. */
  syllabusNote?: string;
  /** Indicative syllabus: one module per subject, with its topics. */
  modules?: CourseModule[];
  /** How a typical week runs, Monday to Sunday. */
  week?: { day: string; focus: string; note: string }[];
  /** What the course includes, as a ruled list. */
  included?: { title: string; body: string }[];
  /** Comparison matrix values. */
  testSeries?: string;
  liveDoubts?: string;
  medium?: string;
}

export interface CourseModule {
  subject: string;
  /** Which paper or stage the module serves, when the exam has more than one. */
  stage?: string;
  topics: string[];
}

/* ---------- Test Series (first-class product) ---------- */

export type SeriesFormat = "full-length" | "subject" | "chapter" | "pyq";
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type SeriesAccess = "not_purchased" | "purchased" | "expired";
export type TestStatus = "locked" | "available" | "in_progress" | "completed";

export interface TestSeries {
  id: string;
  slug: string;
  name: string;
  exam: ExamCode | "multi";
  examLabel: string;
  formats: SeriesFormat[];
  subjects: string[];
  /** Null until the catalogue API supplies real values. */
  testCount: number | null;
  questionsPerTest: number | null;
  durationMin: number | null;
  difficulty: Difficulty;
  hasSolutions: boolean;
  hasAnalysis: boolean;
  validityDays: number | null;
  price: number | null;
  originalPrice: number | null;
  /** Human schedule note, e.g. "Live this Sunday". */
  schedule: string;
  featured?: boolean;
}

export interface AttemptResult {
  score: number;
  maxScore: number;
  accuracy: number;
  timeTakenSec: number;
  rank: number;
  percentile: number;
  bySubject: { subject: string; accuracy: number }[];
}

/** One paper inside a series. Release dates and counts come from the API; null means "not published yet". */
export interface SeriesTest {
  id: string;
  seriesSlug: string;
  number: number;
  title: string;
  format: SeriesFormat;
  isFree: boolean;
  questions: number | null;
  durationMin: number | null;
  releaseNote: string;
  /** Present only for tests that have a playable paper. */
  paperId?: string;
}

/** A learner's standing in one series. Every personal value is null until the API (and a signed-in student) supplies it. */
export interface SeriesProgress {
  access: SeriesAccess;
  attempted: number | null;
  remaining: number | null;
  validityLeftDays: number | null;
  avgAccuracy: number | null;
  bestRank: number | null;
  testStatus: Record<string, TestStatus>;
}

export interface PaperQuestion {
  id: string;
  subject: string;
  text: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Paper {
  id: string;
  title: string;
  durationMin: number;
  marking: { correct: number; wrong: number };
  languages: string[];
  questions: PaperQuestion[];
}

/** What the console stores while a test is in progress (and what POST /attempts would receive). */
export interface AttemptState {
  paperId: string;
  startedAt: number;
  answers: (number | null)[];
  marked: boolean[];
  visited: boolean[];
  current: number;
  submittedAt: number | null;
}

/* ---------- Results ---------- */

export interface ResultEntry {
  student: string;
  from: string;
  destination: string;
  rank: string;
}

export interface SuccessStory {
  id: string;
  firstName: string;
  quote: string;
  byline: string;
  rank: string;
}

export interface ResultsData {
  /** True while the page shows placeholder content awaiting verified results. */
  isSample: boolean;
  year: string;
  /** null renders as an em dash until verified figures exist. */
  stats: { value: number | null; label: string }[];
  arrivals: ResultEntry[];
  stories: SuccessStory[];
}

export interface FreeResource {
  type: "PDF" | "Video" | "Paper" | "Quiz" | "Notes";
  title: string;
  meta: string;
  href: string;
}

export interface DailyQuestion {
  prompt: string;
  options: { key: string; text: string; correct: boolean }[];
  explanation: string;
}
