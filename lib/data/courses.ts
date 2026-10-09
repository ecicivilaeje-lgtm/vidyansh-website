/**
 * Courses and exams data access. Reads typed content today; each function notes
 * the Vidyansh API endpoint it will call later.
 */
import { courses } from "@/content/courses";
import { examRoutes } from "@/content/exams";
import { testSeriesExams } from "@/content/test-series";
import type { Course, Exam, ExamCode } from "@/lib/types";

export { getCourses } from "@/lib/data/index";

/** GET /courses/{slug} */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  return courses.find((c) => c.slug === slug) ?? null;
}

/** GET /courses?exam={code} */
export async function getCoursesForExam(code: ExamCode): Promise<Course[]> {
  return courses.filter((c) => c.exam === code);
}

/** GET /exams (route-map order) */
export async function getExams(): Promise<Exam[]> {
  return examRoutes;
}

/** GET /exams/{code} */
export async function getExamByCode(code: string): Promise<Exam | null> {
  return examRoutes.find((e) => e.code === code) ?? null;
}

/** The test-series route for an exam, when one exists. GET /test-series/exams */
export function testSeriesFor(code: ExamCode | undefined) {
  return testSeriesExams.find((e) => e.code === code) ?? null;
}
