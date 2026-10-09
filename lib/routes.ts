import type { TestSeries } from "@/lib/types";

/** Central URL builders so links stay consistent when routes change. */
export const routes = {
  series: (slug: string) => `/test-series/series/${slug}`,
  test: (slug: string, testId: string) => `/test-series/series/${slug}/tests/${testId}`,
  attempt: (slug: string, testId: string) => `/test-series/series/${slug}/tests/${testId}/attempt`,
  result: (slug: string, testId: string) => `/test-series/series/${slug}/tests/${testId}/result`,
  /** The first test of every series is the free one. */
  freeTest: (s: Pick<TestSeries, "slug" | "id">) => `/test-series/series/${s.slug}/tests/${s.id}-T01`,
};
