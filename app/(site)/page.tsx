import { Hero } from "@/components/sections/Hero";
import { BrandStory } from "@/components/sections/BrandStory";
import { ExamJourney } from "@/components/sections/ExamJourney";
import { Courses } from "@/components/sections/Courses";
import { TestSeriesSection } from "@/components/sections/TestSeriesSection";
import { Methodology } from "@/components/sections/Methodology";
import { Mentor } from "@/components/sections/Mentor";
import { Results } from "@/components/sections/Results";
import { FreeLearning } from "@/components/sections/FreeLearning";
import { Community } from "@/components/sections/Community";
import { StartJourney } from "@/components/sections/StartJourney";
import type { Metadata } from "next";
import { getCourses, getFeaturedTestSeries, getResults } from "@/lib/data";
import { brand } from "@/content/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Structured data for search engines: who Vidyansh is. Only facts already on the site. */
const organisation = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: brand.name,
  alternateName: [brand.devanagari, `${brand.name} ${brand.byline}`],
  slogan: brand.tagline,
  description: brand.promise,
  logo: brand.logo.src,
  founder: { "@type": "Person", name: "Shubham Sir" },
};

export default async function HomePage() {
  const [courses, series, results] = await Promise.all([getCourses(), getFeaturedTestSeries(), getResults()]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }} />
      <Hero />
      <BrandStory />
      <ExamJourney />
      <Courses courses={courses} />
      <TestSeriesSection series={series} />
      <Methodology />
      <Mentor />
      <Results data={results} />
      <FreeLearning />
      <Community />
      <StartJourney />
    </>
  );
}
