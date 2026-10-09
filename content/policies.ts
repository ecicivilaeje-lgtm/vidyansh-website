/**
 * Policy pages. The legal text itself must come from Vidyansh (and its advisers);
 * until then each page says what the policy will cover and that it is not yet published.
 */
export type PolicyKey = "privacy" | "terms" | "refunds";

export const policies: Record<PolicyKey, { title: string; lede: string; covers: string[] }> = {
  privacy: {
    title: "Privacy policy",
    lede: "How Vidyansh collects, uses and protects the details students share with us.",
    covers: [
      "What we collect when you enquire, enrol or take a test",
      "How your number and email are used, and how they are not",
      "How test attempts and results are stored",
      "Who can see your data, and how to ask for it to be deleted",
    ],
  },
  terms: {
    title: "Terms of use",
    lede: "The terms for using the Vidyansh website, courses and test series.",
    covers: [
      "Your account and access to course material",
      "Fair use of lectures, notes and test papers",
      "Live classes, recordings and schedules",
      "How changes to these terms are announced",
    ],
  },
  refunds: {
    title: "Refund policy",
    lede: "When and how fees for courses and test series can be refunded.",
    covers: [
      "Which purchases can be refunded, and within what period",
      "How to ask for a refund",
      "How long a refund takes to reach you",
      "Batch changes and transfers between courses",
    ],
  },
};
