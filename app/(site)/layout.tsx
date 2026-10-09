import { ExamProvider } from "@/components/providers/ExamProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

/** Every marketing and catalogue page shares the header, footer and chosen-exam context. The test console lives outside this group. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ExamProvider>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
    </ExamProvider>
  );
}
