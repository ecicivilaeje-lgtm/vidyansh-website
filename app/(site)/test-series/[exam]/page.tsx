import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { testSeriesExams } from "@/content/test-series";
import { CataloguePage } from "@/components/test-series/CataloguePage";
import { getTestSeries } from "@/lib/data";

export const dynamicParams = false;
export const generateStaticParams = () => testSeriesExams.map((e) => ({ exam: e.code }));

const find = (code: string) => testSeriesExams.find((e) => e.code === code);

export async function generateMetadata({ params }: { params: Promise<{ exam: string }> }): Promise<Metadata> {
  const exam = find((await params).exam);
  return { alternates: { canonical: `/test-series/${exam?.code}` }, title: `${exam?.label} Test Series · Vidyansh`, description: `${exam?.label} mocks, sectional tests and previous year papers with solutions and analysis.` };
}

export default async function ExamSeriesPage({ params }: { params: Promise<{ exam: string }> }) {
  const exam = find((await params).exam);
  if (!exam) notFound();
  const series = await getTestSeries({ exam: exam.code });
  if (!series.length) notFound();
  return <CataloguePage series={series} current={`/test-series/${exam.code}`} heading={`${exam.label} test series`} freeSeries={series[0]} />;
}
