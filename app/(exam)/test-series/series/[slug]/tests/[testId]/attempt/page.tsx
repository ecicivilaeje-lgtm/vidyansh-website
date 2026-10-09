import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { seriesTests } from "@/content/test-series";
import { TestConsole } from "@/components/test-series/TestConsole";
import { getPaper, getSeriesTest, getTestSeriesBySlug } from "@/lib/data";

export const dynamicParams = false;
export const generateStaticParams = () => seriesTests.filter((t) => t.paperId).map((t) => ({ slug: t.seriesSlug, testId: t.id }));

type Params = Promise<{ slug: string; testId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, testId } = await params;
  const t = await getSeriesTest(slug, testId);
  return { title: `${t?.title} · In progress · Vidyansh`, robots: { index: false } };
}

export default async function AttemptPage({ params }: { params: Params }) {
  const { slug, testId } = await params;
  const [series, test] = await Promise.all([getTestSeriesBySlug(slug), getSeriesTest(slug, testId)]);
  const paper = test?.paperId ? await getPaper(test.paperId) : null;
  if (!series || !test || !paper) notFound();
  return <TestConsole paper={paper} slug={slug} testId={testId} seriesName={series.name} testTitle={test.title} />;
}
