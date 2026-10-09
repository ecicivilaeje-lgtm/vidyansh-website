import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { testSeriesFormats } from "@/content/test-series";
import { CataloguePage } from "@/components/test-series/CataloguePage";
import { getTestSeries } from "@/lib/data";

export const dynamicParams = false;
export const generateStaticParams = () => testSeriesFormats.map((f) => ({ type: f.id }));

const find = (id: string) => testSeriesFormats.find((f) => f.id === id);

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const format = find((await params).type);
  return { alternates: { canonical: `/test-series/format/${format?.id}` }, title: `${format?.label} · Vidyansh Test Series`, description: `${format?.label} for SSC JE, RRB JE, State AE / JE and AE / JE from Vidyansh. ${format?.note ?? ""}`.trim() };
}

export default async function FormatSeriesPage({ params }: { params: Promise<{ type: string }> }) {
  const format = find((await params).type);
  if (!format) notFound();
  const series = await getTestSeries({ format: format.id });
  if (!series.length) notFound();
  return <CataloguePage series={series} current={`/test-series/format/${format.id}`} heading={format.label} freeSeries={series[0]} />;
}
