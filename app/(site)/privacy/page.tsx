import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy policy · Vidyansh",
  description: "The Vidyansh privacy policy: what it covers and when it will be published.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <PolicyPage policy="privacy" />;
}
