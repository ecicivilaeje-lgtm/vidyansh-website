interface Props {
  numeral: string;
  name: string;
  /** Right-hand note, e.g. "Learn · Courses". */
  note?: string;
  className?: string;
}

/** Opens each scene of the homepage story: a roman numeral, a rule that draws in, the chapter name. */
export function ChapterMark({ numeral, name, note, className = "" }: Props) {
  return (
    <div className={`chapter-mark ${className}`}>
      <span className="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-none italic">
        {numeral}
        <span className="sr-only">.</span>
      </span>
      <span aria-hidden="true" className="chapter-mark__rule" />
      <span className="eyebrow text-right">
        {name}
        {note && <span className="max-sm:hidden"> · {note}</span>}
      </span>
    </div>
  );
}
