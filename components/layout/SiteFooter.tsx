import Link from "next/link";
import { brand, contact, footerColumns } from "@/content/site";
import { Logo } from "@/components/ui/Logo";

/** Minimal open footer: logo and tagline, three link columns, contact. */
export function SiteFooter() {
  return (
    <footer className="bg-ink pt-[var(--space-block)] pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <div className="container-v">
        <div className="grid gap-14 border-t border-ivory/40 pt-12 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.2fr] lg:gap-10">
          <div className="grid content-start gap-5">
            <Logo size={150} className="size-28 sm:size-32" />
            <p className="font-display text-[1.6rem] leading-tight italic">{brand.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-3">
            {footerColumns.map((col) => (
              <nav key={col.title} aria-label={`${col.title} links`} className="grid content-start gap-4">
                <p className="eyebrow">{col.title}</p>
                <ul className="grid gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="link-underline text-body-d transition-colors hover:text-ivory">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="grid content-start gap-4">
            <p className="eyebrow">Visit</p>
            <address className="leading-relaxed not-italic text-body-d">
              {contact.centre}
              <br />
              {contact.addressLines.join(", ")}
            </address>
            <p className="eyebrow mt-3">Contact</p>
            <p className="leading-relaxed text-body-d">
              {contact.phone}
              <br />
              {contact.email}
            </p>
          </div>
        </div>
        <div className="mt-[var(--space-block)] flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-t border-[var(--line-d)] pt-6">
          <p className="eyebrow">
            © {new Date().getFullYear()} {brand.name} · {brand.byline} · Hindi and English
          </p>
          <p className="eyebrow flex flex-wrap gap-x-3">
            <Link href="/privacy" className="hover:text-ivory">Privacy</Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className="hover:text-ivory">Terms</Link>
            <span aria-hidden="true">·</span>
            <Link href="/refunds" className="hover:text-ivory">Refunds</Link>
            <span aria-hidden="true">·</span>
            <a href="#top" className="hover:text-ivory">Back to top ↑</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
