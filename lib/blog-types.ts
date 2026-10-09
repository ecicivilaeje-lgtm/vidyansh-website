export interface BlogPost {
  slug: string;
  /** Exam code from content/exams, used to link the guide to its route and course. */
  exam: string;
  examLabel: string;
  board: string;
  category: string;
  title: string;
  /** The title as two display lines for the index, e.g. ["SSC JE", "2026"]. */
  short: [string, string];
  description: string;
  /** Three headline facts, copied from the article itself. */
  figures: { value: string; label: string }[];
  disclaimer: string;
  author: string;
}

export interface BlogArticle extends BlogPost {
  html: string;
  sections: { id: string; title: string }[];
  faq: { q: string; a: string }[];
  readMinutes: number;
}
