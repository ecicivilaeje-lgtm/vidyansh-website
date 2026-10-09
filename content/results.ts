import type { ResultsData } from "@/lib/types";
import type { BoardRow, ResultsBoard, StoryFeature } from "@/lib/people-types";

/**
 * PLACEHOLDER CONTENT. isSample keeps a visible "Sample" marker on the page.
 * Replace with verified results (with student consent) and set isSample to false.
 */
export const results: ResultsData = {
  isSample: true,
  year: "2025",
  stats: [
    { value: null, label: "Selections across all exams" },
    { value: null, label: "Ranks inside the top 100" },
    { value: null, label: "States our students serve in" },
  ],
  arrivals: [
    { student: "Student name", from: "Home town", destination: "SSC JE · Civil", rank: "AIR —" },
    { student: "Student name", from: "Home town", destination: "RRB JE · Electrical", rank: "AIR —" },
    { student: "Student name", from: "Home town", destination: "State AE · Civil", rank: "State —" },
    { student: "Student name", from: "Home town", destination: "State JE · Mechanical", rank: "State —" },
  ],
  stories: [
    { id: "s1", firstName: "Story 01", quote: "A selected student's own words about where they started and what changed.", byline: "Name · Exam · Year", rank: "AIR —" },
    { id: "s2", firstName: "Story 02", quote: "A second story, in the student's own words, approved by them before publishing.", byline: "Name · Exam · Year", rank: "AIR —" },
    { id: "s3", firstName: "Story 03", quote: "A third story. One at a time, with a portrait, never in a carousel.", byline: "Name · Exam · Year", rank: "State —" },
  ],
};

/* ---------- /results page (additive; the homepage reads `results` above) ---------- */

const sampleRow = (id: string, exam: BoardRow["exam"], destination: string, year: string): BoardRow => ({
  id,
  student: "Sample",
  from: "—",
  destination,
  exam,
  rank: "—",
  year,
});

/**
 * PLACEHOLDER BOARD. Every row is a sample: no names, towns or ranks are real.
 * Replace rows with verified, consented results and set isSample to false.
 */
export const resultsBoard: ResultsBoard = {
  isSample: true,
  years: ["2025", "2024"],
  exams: [
    { code: "ssc-je", label: "SSC JE" },
    { code: "rrb-je", label: "RRB JE" },
    { code: "state-ae-je", label: "State AE / JE" },
  ],
  rows: [
    sampleRow("25-1", "ssc-je", "SSC JE · Civil", "2025"),
    sampleRow("25-2", "ssc-je", "SSC JE · Electrical", "2025"),
    sampleRow("25-3", "rrb-je", "RRB JE · Mechanical", "2025"),
    sampleRow("25-4", "rrb-je", "RRB JE · Civil", "2025"),
    sampleRow("25-5", "state-ae-je", "State AE · Civil", "2025"),
    sampleRow("25-6", "state-ae-je", "State JE · Electrical", "2025"),
    sampleRow("24-1", "ssc-je", "SSC JE · Mechanical", "2024"),
    sampleRow("24-2", "rrb-je", "RRB JE · Electrical", "2024"),
    sampleRow("24-3", "state-ae-je", "State JE · Electrical", "2024"),
    sampleRow("24-4", "state-ae-je", "State AE · Civil", "2024"),
  ],
};

/** PLACEHOLDER FEATURES. One per story above; the student supplies and approves every word. */
export const storyFeatures: StoryFeature[] = [
  {
    storyId: "s1",
    headline: "The long way round",
    standfirst: "Where this student started, the year that changed it, and the day the result came. In their words, approved by them.",
    journey: [
      { stage: "Dream", note: "Where it began · to come" },
      { stage: "Direction", note: "The exam chosen · to come" },
      { stage: "Preparation", note: "The plan followed · to come" },
      { stage: "Performance", note: "The mocks that mattered · to come" },
      { stage: "Destination", note: "The post · to come" },
    ],
  },
  {
    storyId: "s2",
    headline: "One subject at a time",
    standfirst: "A second feature: what they found hardest, how they kept going, what they would tell the next batch.",
    journey: [
      { stage: "Dream", note: "Where it began · to come" },
      { stage: "Direction", note: "The exam chosen · to come" },
      { stage: "Preparation", note: "The plan followed · to come" },
      { stage: "Performance", note: "The mocks that mattered · to come" },
      { stage: "Destination", note: "The post · to come" },
    ],
  },
  {
    storyId: "s3",
    headline: "Close to home",
    standfirst: "A third feature, told at the student's pace, with their portrait and their permission.",
    journey: [
      { stage: "Dream", note: "Where it began · to come" },
      { stage: "Direction", note: "The exam chosen · to come" },
      { stage: "Preparation", note: "The plan followed · to come" },
      { stage: "Performance", note: "The mocks that mattered · to come" },
      { stage: "Destination", note: "The post · to come" },
    ],
  },
];
