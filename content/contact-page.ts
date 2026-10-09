import type { ContactPage } from "@/lib/learning-types";

/** Office hours are placeholders until the centre confirms them. FAQ answers make no claims about results. */
export const contactPage: ContactPage = {
  officeHours: [
    { days: "Monday to Saturday", hours: "Hours to be announced" },
    { days: "Sunday", hours: "Hours to be announced" },
  ],
  callTimes: [
    { value: "", label: "any time" },
    { value: "morning", label: "the morning" },
    { value: "afternoon", label: "the afternoon" },
    { value: "evening", label: "the evening" },
  ],
  faq: [
    {
      q: "Who will reply to my enquiry?",
      a: "A counsellor from the Vidyansh team. They will call on the number you give, at the time you prefer, to understand where you are and which course fits.",
    },
    {
      q: "Is the counselling call free?",
      a: "Yes. The call is to plan your preparation. There is no fee and no obligation to join.",
    },
    {
      q: "I have not chosen an exam yet. Should I still write?",
      a: "Yes. Choose “not decided yet” and tell us your branch. We will talk you through the exams that suit it.",
    },
    {
      q: "Can I visit the centre?",
      a: "The centre's address and visiting hours will be published on this page. Until then, please write to us first so we can arrange a time.",
    },
    {
      q: "How do I get free class reminders?",
      a: "Write to us with “free classes” as your topic, or open this page from the Free classes page. We will tell you when the schedule is announced.",
    },
  ],
};
