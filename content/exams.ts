import type { Exam } from "@/lib/types";

/**
 * The exams the homepage journey offers. Route-map fields (fullName, forWhom, eligibility,
 * stages) feed the /exams page and are written qualitatively: no marks, question counts,
 * dates, vacancies or cut-offs. Every pattern must be confirmed against the official notification.
 */
export const exams: Exam[] = [
  {
    code: "ssc-je",
    name: "SSC JE",
    descriptor: "Junior Engineer · Civil · Electrical · Mechanical",
    bearing: 42,
    fullName: "Staff Selection Commission · Junior Engineer",
    forWhom: "Diploma and degree holders in civil, electrical or mechanical engineering aiming for a Junior Engineer post in central government departments.",
    eligibility: "A diploma or degree in the relevant engineering branch, within the age limits the notification sets for each department.",
    stages: ["Notification", "Paper I", "Paper II", "Document verification"],
    routeNote: "Both papers test the technical subjects of your branch alongside general studies in Paper I.",
  },
  {
    code: "rrb-je",
    name: "RRB JE",
    descriptor: "Railways · CBT 1 and CBT 2",
    bearing: 118,
    fullName: "Railway Recruitment Board · Junior Engineer",
    forWhom: "Engineering diploma and degree holders who want a technical career with Indian Railways.",
    eligibility: "A diploma or degree in an engineering branch the notification lists, within its age limits.",
    stages: ["Notification", "CBT 1", "CBT 2", "Document verification", "Medical examination"],
    routeNote: "CBT 1 is a common screening stage; CBT 2 brings in the technical subjects of your branch.",
  },
  {
    code: "state-ae-je",
    name: "State AE / JE",
    descriptor: "State public service commissions and boards",
    bearing: 205,
    fullName: "State Public Service Commissions · Assistant and Junior Engineer",
    forWhom: "Engineers who want to serve in their own state's public works, water resources, rural development or similar departments.",
    eligibility: "A diploma (for JE) or degree (for AE) in the relevant branch, with the age, domicile and language rules of the commission.",
    stages: ["Notification", "Written exam", "Main exam or interview", "Document verification"],
    routeNote: "Each commission sets its own route. Some hold a single written exam; others add a main exam or an interview.",
  },
];

/** AE / JE recruitments outside the state commissions. Shown on /exams only; not part of the homepage journey. */
const aeJe: Exam = {
  code: "ae-je",
  name: "AE / JE",
  descriptor: "Boards, corporations and authorities",
  bearing: 160,
  fullName: "Assistant and Junior Engineer · other recruiting bodies",
  forWhom: "Engineers applying to electricity boards, development authorities, municipal bodies and public corporations that recruit on their own.",
  eligibility: "A diploma or degree in the relevant branch. Age and other conditions vary by recruiting body.",
  stages: ["Notification", "Written test", "Interview, where held", "Document verification"],
  routeNote: "Every recruiting body publishes its own pattern. Read each notification on its own terms.",
};

/** Order of lines on the route map. */
export const examRoutes: Exam[] = [exams[0], exams[1], exams[2], aeJe];

export const examByCode = (code: string) => exams.find((e) => e.code === code);
