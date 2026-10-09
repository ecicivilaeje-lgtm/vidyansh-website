import type { Metadata } from "next";
import { CataloguePage } from "@/components/test-series/CataloguePage";
import { getFeaturedTestSeries, getTestSeries } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "/test-series" },
  title: "Test Series · Vidyansh",
  description: "Full-length mocks, subject-wise and chapter-wise tests and previous year papers for SSC JE, RRB JE, AE / JE and State AE / JE. The first test in every series is free.",
};

export default async function TestSeriesPage() {
  const [series, featured] = await Promise.all([getTestSeries(), getFeaturedTestSeries()]);
  return <CataloguePage series={series} current="/test-series" heading="All test series" freeSeries={featured[0]} />;
}
