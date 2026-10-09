import type { Metadata } from "next";
import { Suspense } from "react";
import { contact } from "@/content/site";
import { exams } from "@/content/exams";
import { courses } from "@/content/courses";
import { LetterForm, LetterFromParams, type LetterOptions } from "@/components/contact/LetterForm";
import { LocationPlan } from "@/components/contact/LocationPlan";
import { getContactPage } from "@/lib/data/learning";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact · Vidyansh",
  description:
    "Write to Vidyansh. Tell us your exam and the best time to call, and a counsellor will help you plan your preparation, at no cost. Address, office hours and common questions.",
};

function Placeholder() {
  return <span className="ml-3 align-middle font-mono text-[0.5625rem] tracking-[0.16em] text-mute-d uppercase not-italic">Placeholder</span>;
}

export default async function ContactPage() {
  const page = await getContactPage();
  const options: LetterOptions = {
    exams: exams.map((e) => ({ code: e.code, name: e.name })),
    courses: courses.map((c) => ({ slug: c.slug, name: c.name, exam: c.exam })),
    callTimes: page.callTimes,
  };

  return (
    <>
      <div aria-hidden="true" className="h-[calc(var(--header-h)+env(safe-area-inset-top))] bg-ink" />

      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* The envelope: who we are and where to find us */}
        <section aria-labelledby="contact-title" className="relative bg-ink px-[var(--gutter)] pt-[clamp(4rem,9vw,8rem)] pb-[var(--space-block)] lg:pr-[clamp(2.5rem,5vw,5rem)] lg:pl-[max(var(--gutter),calc((100vw_-_85rem)/2_+_var(--gutter)))]">
          <h1 id="contact-title" className="text-[clamp(4.5rem,11vw,10.5rem)] leading-[0.84] tracking-[-0.045em]">
            Write to <em className="font-normal">us</em>
          </h1>
          <p className="mt-8 max-w-[38ch] text-[1.1875rem] text-body-d">
            Tell us where you are headed. A counsellor will call you to plan the route, at no cost.
          </p>

          <address className="mt-[var(--space-block)] not-italic">
            <p className="eyebrow border-t border-ivory/40 pt-5">Visit or call</p>
            <p className="mt-6 font-display text-[clamp(2.25rem,3.6vw,3.25rem)] leading-none">{contact.centre}</p>
            <ul className="mt-5 grid">
              {contact.addressLines.map((l) => (
                <li key={l} className="border-b border-[var(--line-d)] py-2.5 font-display text-[1.5rem] leading-snug italic">
                  {l}
                  <Placeholder />
                </li>
              ))}
            </ul>
            <dl className="mt-8 grid gap-4">
              <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-4">
                <dt className="eyebrow">Phone</dt>
                <dd className="font-display text-[1.375rem]">
                  {contact.phone}
                  <Placeholder />
                </dd>
              </div>
              <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-4">
                <dt className="eyebrow">Email</dt>
                <dd className="font-display text-[1.375rem] break-words">
                  {contact.email}
                  <Placeholder />
                </dd>
              </div>
            </dl>
          </address>

          <div className="mt-12">
            <h2 className="eyebrow">Office hours</h2>
            <dl className="mt-4 border-t border-[var(--line-d)]">
              {page.officeHours.map((h) => (
                <div key={h.days} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--line-d)] py-3">
                  <dt className="font-display text-[1.25rem]">{h.days}</dt>
                  <dd className="font-mono text-[0.6875rem] tracking-[0.14em] text-mute-d uppercase">{h.hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-12">
            <LocationPlan />
          </div>
        </section>

        {/* The letter */}
        <section aria-label="Enquiry letter" className="on-light bg-ivory px-[var(--gutter)] pt-[clamp(4rem,9vw,8rem)] pb-[var(--space-block)] text-ink lg:pr-[max(var(--gutter),calc((100vw_-_85rem)/2_+_var(--gutter)))] lg:pl-[clamp(2.5rem,6vw,6.5rem)]">
          <div className="max-w-[44rem]">
            <Suspense fallback={<LetterForm {...options} />}>
              <LetterFromParams {...options} />
            </Suspense>
          </div>
        </section>
      </div>

      {/* Common questions */}
      <section aria-labelledby="faq-title" className="bg-night py-[var(--space-section)]">
        <div className="container-v grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-[clamp(3rem,7vw,8rem)]">
          <div>
            <p className="eyebrow">Before you write</p>
            <h2 id="faq-title" className="settle mt-5 text-[clamp(3.25rem,7vw,7rem)] leading-[0.88] tracking-[-0.025em]">
              Common <em className="font-normal">questions</em>
            </h2>
          </div>
          <div className="border-t border-ivory/40">
            {page.faq.map((f) => (
              <details key={f.q} className="group border-b border-[var(--line-d)]">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight hover:italic [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="font-mono text-base text-mute-d transition-transform duration-500 ease-out-expo group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-[60ch] pb-7 text-body-d">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
