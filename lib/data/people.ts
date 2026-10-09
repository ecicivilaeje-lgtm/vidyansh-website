/**
 * Data access for the people pages (Results, Faculty, About). Today these read
 * typed content files; the planned API endpoint is noted on each function.
 */
import { results, resultsBoard, storyFeatures } from "@/content/results";
import { departments, founderFeature, teachingStatements } from "@/content/faculty";
import { mentor } from "@/content/mentor";
import { chapters, colophon, nevers, stageNotes } from "@/content/about";
import type { ResultsData } from "@/lib/types";
import type { BookChapter, Department, ResultsBoard, StoryFeature, TeachingStatement } from "@/lib/people-types";

/** GET /results/board — every verified, consented result, newest year first. */
export async function getResultsBoard(): Promise<ResultsBoard> {
  return resultsBoard;
}

/** GET /results/stories — homepage stories joined with their long-form features. */
export async function getResultStories(): Promise<{ story: ResultsData["stories"][number]; feature: StoryFeature | null }[]> {
  return results.stories.map((story) => ({ story, feature: storyFeatures.find((f) => f.storyId === story.id) ?? null }));
}

/** GET /faculty/founder */
export async function getFounder() {
  return { ...mentor, ...founderFeature };
}

/** GET /faculty/departments */
export async function getDepartments(): Promise<Department[]> {
  return departments;
}

export async function getTeachingStatements(): Promise<TeachingStatement[]> {
  return teachingStatements;
}

/** Static editorial copy; would come from the CMS. */
export async function getAboutBook(): Promise<{ chapters: BookChapter[]; stageNotes: Record<string, string>; nevers: typeof nevers; colophon: typeof colophon }> {
  return { chapters, stageNotes, nevers, colophon };
}
