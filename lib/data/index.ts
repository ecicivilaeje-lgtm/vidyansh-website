/**
 * Data access layer. Today it reads typed content files; later each function
 * can call the Vidyansh API without any change to the components using it.
 * Planned endpoints are noted on each function.
 */
import { courses } from "@/content/courses";
import { samplePaper, seriesTests, testSeriesCatalogue } from "@/content/test-series";
import { results } from "@/content/results";
import type { Course, ExamCode, Paper, ResultsData, SeriesFormat, SeriesProgress, SeriesTest, TestSeries } from "@/lib/types";

export async function getCourses(): Promise<Course[]> {
  return courses;
}

/** GET /test-series?exam&format */
export async function getTestSeries(filter: { exam?: ExamCode; format?: SeriesFormat } = {}): Promise<TestSeries[]> {
  return testSeriesCatalogue.filter((s) => (!filter.exam || s.exam === filter.exam) && (!filter.format || s.formats.includes(filter.format)));
}

export async function getFeaturedTestSeries(): Promise<TestSeries[]> {
  return testSeriesCatalogue.filter((s) => s.featured);
}

/** GET /test-series/{slug} */
export async function getTestSeriesBySlug(slug: string): Promise<TestSeries | null> {
  return testSeriesCatalogue.find((s) => s.slug === slug) ?? null;
}

export async function getSeriesTests(slug: string): Promise<SeriesTest[]> {
  return seriesTests.filter((t) => t.seriesSlug === slug);
}

export async function getSeriesTest(slug: string, testId: string): Promise<SeriesTest | null> {
  return seriesTests.find((t) => t.seriesSlug === slug && t.id === testId) ?? null;
}

/**
 * GET /me/series/{id}/progress. There is no signed-in student yet, so every
 * visitor is "not purchased" and every personal value is null. The free test is open.
 */
export async function getSeriesProgress(slug: string): Promise<SeriesProgress> {
  const tests = await getSeriesTests(slug);
  return {
    access: "not_purchased",
    attempted: null,
    remaining: null,
    validityLeftDays: null,
    avgAccuracy: null,
    bestRank: null,
    testStatus: Object.fromEntries(tests.map((t) => [t.id, t.isFree ? "available" : "locked"])),
  };
}

/** GET /tests/{id}/paper. Only the sample paper exists today. */
export async function getPaper(paperId: string): Promise<Paper | null> {
  return paperId === samplePaper.id ? samplePaper : null;
}

export async function getResults(): Promise<ResultsData> {
  return results;
}
