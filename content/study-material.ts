import type { StudyMaterial, StudyMaterialPage } from "@/lib/learning-types";

/**
 * SAMPLE CATALOGUE. Titles, subjects and exam tags are illustrative until the real
 * library is supplied. Page counts are null and no file exists yet, so every
 * download stays disabled ("Coming soon").
 */
export const studyMaterialPage: StudyMaterialPage = {
  eyebrow: "Study material · The library",
  intro:
    "Notes, formula sheets, solved previous papers and practice books, written in the order the subjects are taught. Pick a spine to open it.",
  sampleNote: "Sample catalogue. Titles are placeholders until the library is published.",
  formats: {
    notes: "Notes",
    "formula-sheet": "Formula sheet",
    "pyq-solutions": "Previous year solutions",
    "practice-book": "Practice book",
  },
};

export const studyMaterials: StudyMaterial[] = [
  // Strength of Materials
  { id: "som-01", code: "SOM-01", title: "Strength of Materials, notes", subject: "Strength of Materials", exams: ["ssc-je", "rrb-je", "state-ae-je"], format: "notes", pages: null, availability: "course", downloadHref: null, spine: { tone: "ink", height: 17, width: 3.4 } },
  { id: "som-02", code: "SOM-02", title: "Formula sheet", subject: "Strength of Materials", exams: ["ssc-je", "rrb-je", "state-ae-je"], format: "formula-sheet", pages: null, availability: "free", downloadHref: null, spine: { tone: "parchment", height: 12.5, width: 2.2 } },
  { id: "som-03", code: "SOM-03", title: "Previous papers, solved", subject: "Strength of Materials", exams: ["ssc-je"], format: "pyq-solutions", pages: null, availability: "course", downloadHref: null, spine: { tone: "graphite", height: 15.5, width: 2.9 } },
  { id: "som-04", code: "SOM-04", title: "Bending and shear, practice", subject: "Strength of Materials", exams: ["state-ae-je"], format: "practice-book", pages: null, availability: "course", downloadHref: null, spine: { tone: "charcoal", height: 16.25, width: 3.1 } },

  // Fluid Mechanics
  { id: "flm-01", code: "FLM-01", title: "Fluid Mechanics, notes", subject: "Fluid Mechanics", exams: ["ssc-je", "rrb-je"], format: "notes", pages: null, availability: "course", downloadHref: null, spine: { tone: "graphite", height: 16.75, width: 3.2 } },
  { id: "flm-02", code: "FLM-02", title: "Formula sheet", subject: "Fluid Mechanics", exams: ["ssc-je", "rrb-je", "state-ae-je"], format: "formula-sheet", pages: null, availability: "free", downloadHref: null, spine: { tone: "parchment", height: 13, width: 2.3 } },
  { id: "flm-03", code: "FLM-03", title: "Flow through pipes, practice", subject: "Fluid Mechanics", exams: ["state-ae-je"], format: "practice-book", pages: null, availability: "course", downloadHref: null, spine: { tone: "ink", height: 15, width: 2.8 } },

  // Electrical Machines
  { id: "emc-01", code: "EMC-01", title: "Electrical Machines, notes", subject: "Electrical Machines", exams: ["ssc-je", "rrb-je", "state-ae-je"], format: "notes", pages: null, availability: "course", downloadHref: null, spine: { tone: "charcoal", height: 17.5, width: 3.5 } },
  { id: "emc-02", code: "EMC-02", title: "Short notes", subject: "Electrical Machines", exams: ["ssc-je", "rrb-je"], format: "notes", pages: null, availability: "free", downloadHref: null, spine: { tone: "parchment", height: 14, width: 2.4 } },
  { id: "emc-03", code: "EMC-03", title: "Previous papers, solved", subject: "Electrical Machines", exams: ["rrb-je", "ssc-je"], format: "pyq-solutions", pages: null, availability: "course", downloadHref: null, spine: { tone: "ink", height: 15.75, width: 3 } },

  // Surveying
  { id: "sur-01", code: "SUR-01", title: "Surveying, notes", subject: "Surveying", exams: ["ssc-je", "state-ae-je"], format: "notes", pages: null, availability: "course", downloadHref: null, spine: { tone: "ink", height: 16, width: 3.1 } },
  { id: "sur-02", code: "SUR-02", title: "Levelling, practice", subject: "Surveying", exams: ["state-ae-je"], format: "practice-book", pages: null, availability: "course", downloadHref: null, spine: { tone: "graphite", height: 17.25, width: 3.3 } },
  { id: "sur-03", code: "SUR-03", title: "Previous paper, solved", subject: "Surveying", exams: ["ssc-je", "state-ae-je"], format: "pyq-solutions", pages: null, availability: "free", downloadHref: null, spine: { tone: "parchment", height: 13.5, width: 2.5 } },

  // Thermodynamics
  { id: "thd-01", code: "THD-01", title: "Thermodynamics, notes", subject: "Thermodynamics", exams: ["ssc-je"], format: "notes", pages: null, availability: "course", downloadHref: null, spine: { tone: "charcoal", height: 16.5, width: 3.2 } },
  { id: "thd-02", code: "THD-02", title: "Formula sheet", subject: "Thermodynamics", exams: ["ssc-je", "rrb-je"], format: "formula-sheet", pages: null, availability: "free", downloadHref: null, spine: { tone: "parchment", height: 12, width: 2.2 } },

  // General studies
  { id: "gen-01", code: "GEN-01", title: "Reasoning, practice", subject: "General studies", exams: ["ssc-je", "rrb-je"], format: "practice-book", pages: null, availability: "course", downloadHref: null, spine: { tone: "graphite", height: 15.25, width: 2.9 } },
  { id: "gen-02", code: "GEN-02", title: "General awareness, notes", subject: "General studies", exams: ["ssc-je", "rrb-je", "state-ae-je"], format: "notes", pages: null, availability: "course", downloadHref: null, spine: { tone: "ink", height: 16.75, width: 3.3 } },
];
