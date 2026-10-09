import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { seriesTests } from "@/content/test-series";
import { ResultView } from "@/components/test-series/ResultView";
import { getPaper, getSeriesTest, getTestSeriesBySlug } from "@/lib/data";
import { routes } from "@/lib/routes";

export const dynamicParams = false;
export const generateStaticParams = () => seriesTests.filter((t) => t.paperId).map((t) => ({ slug: t.seriesSlug, testId: t.id }));

type Params = Promise<{ slug: string; testId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, testId } = await params;
  const t = await getSeriesTest(slug, testId);
  return { title: `${t?.title} · Result · Vidyansh`, robots: { index: false } };
}

export default async function ResultPage({ params }: { params: Params }) {
  const { slug, testId } = await params;
  const [series, test] = await Promise.all([getTestSeriesBySlug(slug), getSeriesTest(slug, testId)]);
  const paper = test?.paperId ? await getPaper(test.paperId) : null;
  if (!series || !test || !paper) notFound();

  return (
    <div className="bg-ink pt-[calc(var(--header-h)+clamp(2rem,5vw,4rem))]">
      <nav aria-label="Breadcrumb" className="container-v mb-8">
        <ol className="eyebrow flex flex-wrap gap-2">
          <li>
            <Link href="/test-series" className="hover:text-ivory">
              Test Series
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={routes.series(slug)} className="hover:text-ivory">
              {series.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ivory">
            Result
          </li>
        </ol>
      </nav>
      <ResultView paper={paper} slug={slug} testId={testId} testTitle={test.title} seriesName={series.name} />
    </div>
  );
}
