import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { policies, type PolicyKey } from "@/content/policies";

const order: PolicyKey[] = ["privacy", "terms", "refunds"];
const hrefs: Record<PolicyKey, string> = { privacy: "/privacy", terms: "/terms", refunds: "/refunds" };

/** A plain, readable policy page. No legal text is invented: it states what the policy will cover. */
export function PolicyPage({ policy }: { policy: PolicyKey }) {
  const p = policies[policy];
  return (
    <div className="on-light bg-ivory pt-[var(--header-h)] text-ink">
      <div className="container-v grid gap-16 py-[var(--space-block)] lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-[clamp(3rem,8vw,9rem)]">
        <nav aria-label="Policies" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-ink pt-4 lg:grid lg:gap-3">
            {order.map((k) => (
              <li key={k}>
                <Link
                  href={hrefs[k]}
                  aria-current={k === policy ? "page" : undefined}
                  className="font-display text-xl text-mute-l transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:italic"
                >
                  {policies[k].title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="max-w-[44rem]">
          <h1 className="text-[clamp(3.25rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.03em]">{p.title}</h1>
          <p className="mt-8 font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-snug text-ink/80">{p.lede}</p>

          <p className="mt-12 border-l-2 border-ink py-1 pl-5 text-mute-l">
            This policy is being prepared and will be published here before enrolment and payments open. The enquiry forms on this preview of the website do not send or store anything yet.
          </p>

          <h2 className="mt-16 text-[1.75rem]">What it will cover</h2>
          <ol className="mt-6 border-t border-ink">
            {p.covers.map((c, i) => (
              <li key={c} className="grid grid-cols-[2.5rem_minmax(0,1fr)] border-b border-[var(--line-l)] py-4">
                <span className="font-mono text-xs text-mute-l">{String(i + 1).padStart(2, "0")}</span>
                <span>{c}</span>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-wrap items-center gap-6">
            <Button href="/contact" tone="light">
              Ask us a question
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}
