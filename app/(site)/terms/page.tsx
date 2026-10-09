import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of use · Vidyansh",
  description: "The Vidyansh terms of use: what it covers and when it will be published.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <PolicyPage policy="terms" />;
}
