import type { Course, CourseModule } from "@/lib/types";

/**
 * Course names, benefits and batch dates are placeholders until the real catalogue is supplied.
 * Benefits describe how a course is taught; they make no claims about results.
 * Add `image: { src, alt }` to a course to replace its drawn plate with photography.
 *
 * Details-page fields (overview, modules, week, included) are written qualitatively and are
 * placeholders for Shubham Sir to confirm. Syllabus lists are indicative: the official
 * notification for each exam is the authority.
 */

/* ---------- Indicative syllabus modules ---------- */

const civilCore: CourseModule[] = [
  { subject: "Building Materials", topics: ["Stones, bricks and lime", "Cement and its tests", "Timber, metals and paints"] },
  { subject: "Strength of Materials", topics: ["Stress, strain and elastic constants", "Shear force and bending moment", "Bending and shear stresses", "Torsion and columns"] },
  { subject: "Theory of Structures", topics: ["Determinacy and stability", "Deflection of beams", "Moving loads and influence lines", "Arches and cables"] },
  { subject: "Concrete Technology and RCC Design", topics: ["Mix design and workability", "Limit state method", "Beams, slabs and columns", "Footings and shear design"] },
  { subject: "Steel Design", topics: ["Connections: bolted and welded", "Tension and compression members", "Beams and plate girders"] },
  { subject: "Soil Mechanics", topics: ["Index properties and classification", "Permeability and seepage", "Consolidation and compaction", "Shear strength and bearing capacity"] },
  { subject: "Fluid Mechanics and Hydraulics", topics: ["Fluid properties and statics", "Kinematics and Bernoulli's equation", "Flow through pipes", "Open channel flow"] },
  { subject: "Irrigation Engineering", topics: ["Water requirement of crops", "Canals and canal structures", "Hydrology basics"] },
  { subject: "Surveying", topics: ["Chain and compass surveying", "Levelling and contouring", "Theodolite and traversing", "Curves"] },
  { subject: "Transportation Engineering", topics: ["Highway geometric design", "Pavement materials and design", "Railway track basics", "Traffic engineering"] },
  { subject: "Environmental Engineering", topics: ["Water demand and treatment", "Sewage and its treatment", "Solid waste and air pollution"] },
  { subject: "Estimating, Costing and Valuation", topics: ["Methods of estimation", "Rate analysis", "Specifications and valuation"] },
];

const sscModules: CourseModule[] = [
  ...civilCore.map((m) => ({ ...m, stage: "Technical" })),
  { subject: "General Intelligence and Reasoning", stage: "General studies", topics: ["Analogy and classification", "Series and coding", "Non-verbal reasoning"] },
  { subject: "General Awareness", stage: "General studies", topics: ["Current affairs", "Indian polity and history", "Geography and economy", "General science"] },
];

const rrbModules: CourseModule[] = [
  { subject: "Mathematics", stage: "CBT 1", topics: ["Number system and simplification", "Ratio, percentage and averages", "Time, work and distance", "Mensuration and algebra"] },
  { subject: "General Intelligence and Reasoning", stage: "CBT 1", topics: ["Analogies and series", "Coding and decoding", "Syllogism and puzzles"] },
  { subject: "General Awareness", stage: "CBT 1 and 2", topics: ["Current affairs", "Indian culture and polity", "Railways and general knowledge"] },
  { subject: "General Science", stage: "CBT 1", topics: ["Physics", "Chemistry", "Life sciences"] },
  { subject: "Physics and Chemistry", stage: "CBT 2", topics: ["Mechanics and heat", "Electricity and magnetism", "Chemical reactions and matter"] },
  { subject: "Basics of Computers and Applications", stage: "CBT 2", topics: ["Computer architecture", "Operating systems and the internet", "Office applications"] },
  { subject: "Basics of Environment and Pollution Control", stage: "CBT 2", topics: ["Ecosystems", "Air, water and noise pollution", "Waste management"] },
  ...civilCore.slice(1, 11).map((m) => ({ ...m, stage: "CBT 2 · Technical" })),
];

const stateModules: CourseModule[] = [
  ...civilCore.map((m) => ({ ...m, stage: "Technical" })),
  { subject: "State General Studies", stage: "As per commission", topics: ["History and geography of your state", "State polity and economy", "Current affairs"] },
  { subject: "Previous State Papers", stage: "Practice", topics: ["Year-wise papers solved in class", "Pattern and topic analysis"] },
];

/* ---------- How a week runs (qualitative) ---------- */

const liveWeek: Course["week"] = [
  { day: "Mon", focus: "Concept", note: "A new topic, built from first principles" },
  { day: "Tue", focus: "Concept", note: "The same topic, taken to exam depth" },
  { day: "Wed", focus: "Problems", note: "Worked questions in the exam's pattern" },
  { day: "Thu", focus: "Concept", note: "The next topic begins" },
  { day: "Fri", focus: "General studies", note: "Reasoning, awareness or mathematics" },
  { day: "Sat", focus: "Test", note: "A timed test on the week's topics" },
  { day: "Sun", focus: "Review", note: "Test discussion and doubts" },
];

const recordedWeek: Course["week"] = [
  { day: "Mon", focus: "Lectures", note: "Recorded lessons, at your pace" },
  { day: "Tue", focus: "Lectures", note: "Continue the subject in order" },
  { day: "Wed", focus: "Practice", note: "Exercise sets for each lesson" },
  { day: "Thu", focus: "Lectures", note: "The next block of the subject" },
  { day: "Fri", focus: "Live doubts", note: "Bring your questions to a live hour" },
  { day: "Sat", focus: "Test", note: "A topic test, then its solutions" },
  { day: "Sun", focus: "Revise", note: "Short notes and a weekly recap" },
];
export const courses: Course[] = [
  {
    slug: "ssc-je-complete",
    exam: "ssc-je",
    name: "SSC JE Complete",
    title: ["SSC JE", "Complete"],
    category: "Staff Selection Commission · Junior Engineer",
    summary: "Technical + general studies, Paper I and II",
    lead: "Paper I and Paper II, technical and general studies, taught as one connected course.",
    benefits: [
      { title: "Both papers, one plan", body: "Paper I objective and Paper II conventional prepared side by side, so nothing is left for the last month." },
      { title: "Taught from first principles", body: "Every topic starts at the concept, then moves to the exam's question patterns." },
      { title: "Test series included", body: "The matching SSC JE test series opens with the course, at no extra cost." },
    ],
    mode: "Live + recorded",
    duration: "10 months",
    nextBatch: "04 Nov",
    practiceExam: "ssc-je",
    overview: [
      "SSC JE Complete prepares you for both papers of the Staff Selection Commission's Junior Engineer examination in one connected course. Technical subjects and general studies run side by side, so revision is spread across the year instead of crowded into the last month.",
      "Classes are live with Shubham Sir and recorded for revision. Every topic begins at the concept and ends at the exam's question patterns, with a weekly test to show where you stand.",
    ],
    syllabusNote: "Civil engineering stream shown. Electrical and mechanical streams follow their own module list.",
    modules: sscModules,
    week: liveWeek,
    included: [
      { title: "Live classes, recorded", body: "Every live session is recorded so you can return to it." },
      { title: "Subject notes", body: "Notes written for revision, shared as each subject is taught." },
      { title: "SSC JE test series", body: "The matching test series opens with the course." },
      { title: "Doubt support", body: "Doubts taken in class and answered by a teacher." },
      { title: "Paper II practice", body: "Conventional answers practised and reviewed." },
    ],
    testSeries: "Included",
    liveDoubts: "In every live class",
    medium: "Hindi and English",
    plate: "beam",
  },
  {
    slug: "rrb-je-foundation",
    exam: "rrb-je",
    name: "RRB JE Foundation",
    title: ["RRB JE", "Foundation"],
    category: "Railway Recruitment Board · Junior Engineer",
    summary: "CBT 1 and CBT 2 with full mock cycle",
    lead: "CBT 1 and CBT 2 on a single track, with a full mock cycle before each stage.",
    benefits: [
      { title: "Stage by stage", body: "CBT 1 is finished and revised before CBT 2 begins, so each exam gets its own run-up." },
      { title: "Taught live", body: "Live sessions with Shubham Sir, with doubts taken in the same class." },
      { title: "A full mock cycle", body: "Timed full-length mocks in the real CBT format, with a review after every attempt." },
    ],
    mode: "Live",
    duration: "8 months",
    nextBatch: "18 Nov",
    practiceExam: "rrb-je",
    overview: [
      "RRB JE Foundation follows the Railway Recruitment Board's two computer-based stages in order. CBT 1 is taught, revised and tested first; CBT 2 and its technical subjects follow, each with its own run-up.",
      "Classes are live with Shubham Sir, and doubts are taken in the same class. A full mock cycle in the real CBT format closes each stage.",
    ],
    syllabusNote: "Civil engineering technical subjects shown for CBT 2. Other branches follow their own module list.",
    modules: rrbModules,
    week: liveWeek,
    included: [
      { title: "Live classes", body: "Taught live, with doubts taken in the same session." },
      { title: "Stage-wise revision", body: "A dedicated revision block before each CBT." },
      { title: "RRB JE test series", body: "Timed full-length mocks in the CBT format." },
      { title: "Review after every mock", body: "Each attempt discussed, question by question." },
    ],
    testSeries: "Included",
    liveDoubts: "In every live class",
    medium: "Hindi and English",
    plate: "track",
  },
  {
    slug: "state-ae-je",
    exam: "state-ae-je",
    name: "State AE / JE",
    title: ["State", "AE / JE"],
    category: "State Public Service Commissions · AE and JE",
    summary: "State-specific syllabus, previous papers solved",
    lead: "Your state's syllabus, its previous papers and its pattern, not a generic one.",
    benefits: [
      { title: "Built per state", body: "Topics weighted to the commission you are sitting for, not one syllabus for every state." },
      { title: "Previous papers solved", body: "Past state papers worked through in class, so the pattern is familiar before exam day." },
      { title: "Learn at your pace", body: "Live classes with recordings, so a missed day never means a missed topic." },
    ],
    mode: "Live + recorded",
    duration: "9 months",
    nextBatch: "02 Dec",
    practiceExam: "state-ae-je",
    overview: [
      "State AE / JE is built around the commission you are sitting for. Technical subjects are weighted to your state's pattern, and its previous papers are worked through in class.",
      "Live classes come with recordings, so a missed day never means a missed topic. State general studies is added where your commission asks for it.",
    ],
    syllabusNote: "Civil engineering stream shown. Weighting and general studies change by state commission.",
    modules: stateModules,
    week: liveWeek,
    included: [
      { title: "Live classes, recorded", body: "Attend live or catch up on the recording." },
      { title: "State previous papers", body: "Past papers of your commission solved in class." },
      { title: "State AE / JE test series", body: "Chapter and subject tests to match the course." },
      { title: "Doubt support", body: "Doubts answered by a teacher." },
    ],
    testSeries: "Included",
    liveDoubts: "In every live class",
    medium: "Hindi and English",
    plate: "bridge",
  },
];
