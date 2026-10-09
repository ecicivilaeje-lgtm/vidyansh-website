import type { NavLink, NavPillar } from "@/lib/types";

export const brand = {
  name: "Vidyansh",
  byline: "By Shubham Sir",
  tagline: "From Dream to Destination",
  meaning: "a share of knowledge",
  devanagari: "विद्यांश",
  promise: "Focused preparation. Expert guidance. A clearer path to your destination.",
  logo: { src: "/brand/vidyansh-logo.png", width: 1254, height: 1254 },
} as const;

/** The product ecosystem: Learn, Practice, Achieve. */
export const pillars: NavPillar[] = [
  { verb: "Learn", label: "Courses", href: "/courses" },
  { verb: "Practice", label: "Test Series", href: "/test-series" },
  { verb: "Achieve", label: "Results", href: "/results" },
];

export const secondaryNav: NavLink[] = [
  { label: "Exams", href: "/exams" },
  { label: "Free classes", href: "/free-classes" },
];

export const menuLinks: (NavLink & { hint?: string })[] = [
  { label: "Courses", href: "/courses", hint: "Learn" },
  { label: "Test Series", href: "/test-series", hint: "Practice" },
  { label: "Results", href: "/results", hint: "Achieve" },
  { label: "Exams", href: "/exams" },
  { label: "Faculty", href: "/faculty" },
  { label: "Study material", href: "/study-material" },
  { label: "Free classes", href: "/free-classes" },
  { label: "Journal", href: "/blog", hint: "Exam guides" },
  { label: "About Vidyansh", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const contact = {
  centre: "Vidyansh Centre",
  addressLines: ["Address line", "City, State PIN"],
  phone: "Phone number",
  email: "hello@domain",
};

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Learn",
    links: [
      { label: "Courses", href: "/courses" },
      { label: "Exams", href: "/exams" },
      { label: "Study material", href: "/study-material" },
      { label: "Free classes", href: "/free-classes" },
      { label: "Exam guides", href: "/blog" },
    ],
  },
  {
    title: "Practice",
    links: [
      { label: "Full-length mocks", href: "/test-series/format/full-length" },
      { label: "Subject-wise tests", href: "/test-series/format/subject" },
      { label: "Chapter-wise tests", href: "/test-series/format/chapter" },
      { label: "Previous year papers", href: "/test-series/format/pyq" },
    ],
  },
  {
    title: "Vidyansh",
    links: [
      { label: "Results", href: "/results" },
      { label: "Faculty", href: "/faculty" },
      { label: "About Vidyansh", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
