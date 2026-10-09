import type { BlogPost } from "@/lib/blog-types";

/**
 * Articles written by Shubham Sir. Each body lives in content/blog/<slug>.html,
 * supplied by Vidyansh and kept as written.
 */
export const blogPage = {
  title: "The Vidyansh journal",
  intro: "Exam guides and preparation notes from Shubham Sir. Read the notification in plain words, then plan the route.",
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ssc-je-2026",
    exam: "ssc-je",
    examLabel: "SSC JE",
    board: "Staff Selection Commission",
    category: "Exam guide",
    title: "SSC JE 2026: Vacancies, Eligibility, Exam Pattern and Key Dates",
    short: ["SSC JE", "2026"],
    description:
      "SSC JE 2026 is out with 1,748 tentative vacancies. See department-wise vacancies, post-wise eligibility, age limits, exam pattern and dates in one guide.",
    figures: [
      { value: "1,748", label: "Tentative vacancies" },
      { value: "Level 6", label: "Pay, ₹35,400 to ₹1,12,400" },
      { value: "2 papers", label: "Paper-I qualifies, Paper-II ranks" },
    ],
    disclaimer: "Vacancy figures are tentative and may change. Always confirm eligibility and dates against the official SSC notice.",
    author: "Shubham Sir",
  },
  {
    slug: "rrb-je-2026",
    exam: "rrb-je",
    examLabel: "RRB JE",
    board: "Railway Recruitment Boards",
    category: "Exam guide",
    title: "RRB JE 2026: Vacancies, Eligibility, Exam Pattern and Key Dates",
    short: ["RRB JE", "2026"],
    description:
      "RRB JE 2026 (CEN 04/2026) is out with 3,993 vacancies for Junior Engineer and Depot Material Superintendent. See RRB-wise vacancies, eligibility, age limit, fee, exam pattern and dates.",
    figures: [
      { value: "3,993", label: "Provisional vacancies" },
      { value: "21", label: "Railway Recruitment Boards" },
      { value: "CBT-I + II", label: "Then documents and medical" },
    ],
    disclaimer:
      "Vacancy figures are provisional, based on the original CEN 04/2026, and may have been revised since. Always confirm eligibility, dates and vacancies against the official RRB notice and any corrigendum.",
    author: "Shubham Sir",
  },
  {
    slug: "rssb-je-2026",
    exam: "state-ae-je",
    examLabel: "RSSB JE",
    board: "Rajasthan Staff Selection Board",
    category: "Exam guide",
    title: "RSSB JE 2026: Vacancies, Eligibility, Exam Pattern and Key Dates",
    short: ["RSSB JE", "2026"],
    description:
      "RSSB JE 2026 (Advt. No. 10/2026) is out with 874 vacancies for Junior Engineer (Civil, Mechanical/Electrical) in PWD, Water Resources and PHED Rajasthan. See eligibility, fee, age limit, exam pattern and dates.",
    figures: [
      { value: "874", label: "Vacancies across 3 departments" },
      { value: "120", label: "Marks, one written paper" },
      { value: "Feb 2027", label: "Exam, tentative" },
    ],
    disclaimer:
      "Details are based on RSSB Advertisement No. 10/2026 and may change. For help with the online form, contact the board's helpdesk at recruitmenthelpdesk@rajasthan.gov.in. Always confirm eligibility, dates and vacancies against the official notice.",
    author: "Shubham Sir",
  },
];
