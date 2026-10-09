import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Refund policy · Vidyansh",
  description: "The Vidyansh refund policy: what it covers and when it will be published.",
  alternates: { canonical: "/refunds" },
};

export default function Page() {
  return <PolicyPage policy="refunds" />;
}
