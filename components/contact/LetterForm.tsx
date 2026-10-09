"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useExam } from "@/components/providers/ExamProvider";
import { Button } from "@/components/ui/Button";
import { Star } from "@/components/ui/Star";
import type { ExamCode } from "@/lib/types";

export interface LetterOptions {
  exams: { code: string; name: string }[];
  courses: { slug: string; name: string; exam: string }[];
  callTimes: { value: string; label: string }[];
}

interface Initial {
  exam?: string;
  course?: string;
  topic?: string;
}

type Errors = Partial<Record<"name" | "phone", string>>;

const inline =
  "mx-1 inline-block max-w-full border-b bg-transparent px-1 pb-0.5 align-baseline font-display italic leading-tight outline-none transition-colors placeholder:text-mute-l placeholder:not-italic";
const okLine = "border-ink/40 hover:border-ink focus:border-ink";
const badLine = "border-[#9b4a33]";
const errText = "text-[0.9375rem] font-sans not-italic text-[#9b4a33]";

/** Reads ?course, ?exam and ?topic. Must sit inside <Suspense> so the page can be exported statically. */
export function LetterFromParams(props: LetterOptions) {
  const sp = useSearchParams();
  const initial: Initial = {
    exam: sp.get("exam") ?? undefined,
    course: sp.get("course") ?? undefined,
    topic: sp.get("topic") ?? undefined,
  };
  return <LetterForm key={sp.toString()} {...props} initial={initial} />;
}

/** The enquiry written as a letter, with the fields set inline on underlines. */
export function LetterForm({ exams, courses, callTimes, initial = {} }: LetterOptions & { initial?: Initial }) {
  const { exam: chosenExam, setExam: setChosenExam } = useExam();
  const validCourse = courses.find((c) => c.slug === initial.course);
  const validExam = exams.find((e) => e.code === initial.exam)?.code;
  const topic = initial.topic === "free-classes" ? "free-classes" : null;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [exam, setExam] = useState<string>(validExam ?? validCourse?.exam ?? chosenExam ?? "");
  const [course, setCourse] = useState<string>(validCourse?.slug ?? "");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState(topic === "free-classes" ? "Please let me know when the free live classes are scheduled." : "");
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const courseName = courses.find((c) => c.slug === course)?.name;
  const subject = topic === "free-classes" ? "Free class reminders" : courseName ? `Enquiry, ${courseName}` : "An enquiry";

  const pickExam = (code: string) => {
    setExam(code);
    setChosenExam((code || null) as ExamCode | null);
    if (course && courses.find((c) => c.slug === course)?.exam !== code) setCourse("");
  };
  const pickCourse = (slug: string) => {
    setCourse(slug);
    const c = courses.find((x) => x.slug === slug);
    if (c && exams.some((e) => e.code === c.exam)) {
      setExam(c.exam);
      setChosenExam(c.exam as ExamCode);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please write your name.";
    if (!/^[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, "").replace(/^(\+?91)/, ""))) next.phone = "Enter a 10-digit Indian mobile number.";
    setErrors(next);
    if (next.name) nameRef.current?.focus();
    else if (next.phone) phoneRef.current?.focus();
    else {
      setDone(true);
      requestAnimationFrame(() => doneRef.current?.focus());
    }
  };

  if (done) {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="grid gap-6 outline-none">
        <Star className="size-6" />
        <p className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1]">
          Thank you, {name.trim().split(" ")[0]}. Your letter is <em className="font-normal">written.</em>
        </p>
        <p className="max-w-[46ch] text-mute-l">
          This preview does not send anything yet. When enquiries go live, your letter will reach the Vidyansh team and a counsellor will call you
          {time ? ` in ${callTimes.find((t) => t.value === time)?.label}` : ""}.
        </p>
        <Button tone="light" variant="ghost" size="sm" className="justify-self-start" onClick={() => setDone(false)}>
          Edit the letter
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="letter-title" className="grid gap-10 [color-scheme:light]">
      <input type="hidden" name="topic" value={topic ?? ""} />
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink pb-4">
        <p className="font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
          <span className="text-mute-l">Re:</span> {subject}
        </p>
        <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-mute-l uppercase">To the Vidyansh team</p>
      </div>

      <div className="grid gap-8 font-display text-[clamp(1.5rem,2.3vw,2rem)] leading-[1.75]">
        <h2 id="letter-title" className="text-[clamp(2.25rem,3.6vw,3rem)] leading-none italic">
          Dear Vidyansh,
        </h2>

        <div>
          <p>
            My name is
            <label htmlFor="c-name" className="sr-only">
              Your name
            </label>
            <input
              ref={nameRef}
              id="c-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "c-name-err" : undefined}
              className={`${inline} w-[11ch] ${errors.name ? badLine : okLine}`}
            />
            , and I am preparing for
            <label htmlFor="c-exam" className="sr-only">
              Exam you are preparing for
            </label>
            <select id="c-exam" name="exam" value={exam} onChange={(e) => pickExam(e.target.value)} className={`${inline} ${okLine} cursor-pointer`}>
              <option value="">an exam I have not chosen yet</option>
              {exams.map((x) => (
                <option key={x.code} value={x.code}>
                  {x.name}
                </option>
              ))}
            </select>
            .
          </p>
          {errors.name && (
            <p id="c-name-err" className={errText}>
              {errors.name}
            </p>
          )}
        </div>

        <p>
          I would like to hear about
          <label htmlFor="c-course" className="sr-only">
            Course (optional)
          </label>
          <select id="c-course" name="course" value={course} onChange={(e) => pickCourse(e.target.value)} className={`${inline} ${okLine} max-w-[min(100%,18ch)] cursor-pointer`}>
            <option value="">any course that suits me</option>
            {courses
              .filter((c) => !exam || c.exam === exam)
              .map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
          </select>
          .
        </p>

        <div>
          <p>
            You can reach me on
            <label htmlFor="c-phone" className="sr-only">
              Mobile number, 10 digits
            </label>
            <input
              ref={phoneRef}
              id="c-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "c-phone-err" : undefined}
              className={`${inline} w-[14ch] tabular-nums ${errors.phone ? badLine : okLine}`}
            />
            , and the best time to call is
            <label htmlFor="c-time" className="sr-only">
              Preferred time to call
            </label>
            <select id="c-time" name="time" value={time} onChange={(e) => setTime(e.target.value)} className={`${inline} ${okLine} cursor-pointer`}>
              {callTimes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            .
          </p>
          {errors.phone && (
            <p id="c-phone-err" className={errText}>
              {errors.phone}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="c-message" className="font-mono text-[0.6875rem] leading-none tracking-[0.16em] text-mute-l uppercase">
            Anything else (optional)
          </label>
          <textarea
            id="c-message"
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your branch, your year, or a question for us."
            className="w-full resize-y bg-[linear-gradient(to_bottom,transparent_calc(100%-1px),rgb(7_7_6/0.2)_calc(100%-1px))] bg-[size:100%_2.75rem] bg-local font-display text-[clamp(1.375rem,2vw,1.625rem)] leading-[2.75rem] italic outline-none placeholder:text-mute-l placeholder:not-italic focus:bg-[linear-gradient(to_bottom,transparent_calc(100%-1px),rgb(7_7_6/0.45)_calc(100%-1px))]"
          />
        </div>

        <div>
          <p className="italic">Yours sincerely,</p>
          <p aria-hidden="true" className={`font-hand text-[2.25rem] leading-tight ${name.trim() ? "text-ink" : "text-mute-l"}`}>
            {name.trim() || "your name"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 border-t border-[var(--line-l)] pt-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8">
        <Button type="submit" tone="light" diamond>
          Send the letter
        </Button>
        <p className="text-sm text-mute-l">We only use your number to call you about Vidyansh courses. This preview does not send anything yet.</p>
      </div>
    </form>
  );
}
