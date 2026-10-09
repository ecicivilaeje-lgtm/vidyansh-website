<?php
/** Helpers for the learning pages (study material, free classes, about, contact, blog). */

/** A mono text link with a sliding arrow: <Link className="group inline-flex items-center gap-2">. */
function learning_arrow_link(string $href, string $label, string $class = 'group inline-flex items-center gap-2'): string
{
    return '<a class="' . e($class) . '" href="' . e(url($href)) . '"><span class="link-underline">' . e($label) . '</span>'
        . '<span aria-hidden="true" class="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">→</span></a>';
}

/** Spine colours of the bookshelf. */
const LEARNING_SPINE_TONES = [
    'ink' => 'bg-ink text-ivory border-ink',
    'graphite' => 'bg-graphite text-ivory border-graphite',
    'charcoal' => 'bg-charcoal text-ivory border-charcoal',
    'parchment' => 'bg-parchment text-ink border-ink/30',
];

/** The "Placeholder" tag set after contact details that are not supplied yet. */
function learning_placeholder(): string
{
    return '<span class="ml-3 align-middle font-mono text-[0.5625rem] tracking-[0.16em] text-mute-d uppercase not-italic">Placeholder</span>';
}

/** CSS number like React prints it (17 → "17", 3.40 → "3.4"). */
function learning_num($n): string
{
    $s = rtrim(rtrim(number_format((float) $n, 4, '.', ''), '0'), '.');
    return $s === '' ? '0' : $s;
}

/** The About book's three-column grid: marginalia, the measure, and air. */
const LEARNING_BOOK_GRID = 'grid gap-x-[clamp(2rem,4vw,4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)_minmax(0,1fr)]';

/* ---------------- Contact letter (shared by templates/pages/contact.php and app/enquiry.php) ---------------- */

/** The options the letter offers: exams, courses and call times, as the original contact page built them. */
function learning_letter_options(): array
{
    return [
        'exams' => array_map(fn($x) => ['code' => $x['code'], 'name' => $x['name']], content('exams')['exams'] ?? []),
        'courses' => array_map(fn($c) => ['slug' => $c['slug'], 'name' => $c['name'], 'exam' => $c['exam']], get_courses()),
        'callTimes' => get_contact_page()['callTimes'] ?? [],
    ];
}

function learning_find(array $list, string $key, $value): ?array
{
    foreach ($list as $x) if (($x[$key] ?? null) === $value) return $x;
    return null;
}

/** The "Re:" line of the letter. */
function learning_letter_subject(array $opts, string $course, ?string $topic): string
{
    if ($topic === 'free-classes') return 'Free class reminders';
    $c = learning_find($opts['courses'], 'slug', $course);
    return $c ? 'Enquiry, ' . $c['name'] : 'An enquiry';
}

/** Same rules as the letter's own check. Returns field => message. */
function learning_letter_errors(string $name, string $phone): array
{
    $errors = [];
    if (mb_strlen(trim($name)) < 2) $errors['name'] = 'Please write your name.';
    $digits = preg_replace('/^(\+?91)/', '', preg_replace('/[\s-]/', '', $phone));
    if (!preg_match('/^[6-9]\d{9}$/', $digits)) $errors['phone'] = 'Enter a 10-digit Indian mobile number.';
    return $errors;
}

/** The sentence under "Your letter is written." */
function learning_letter_sent_note(array $opts, string $time): string
{
    $t = $time !== '' ? learning_find($opts['callTimes'], 'value', $time) : null;
    return 'Your letter will reach the Vidyansh team and a counsellor will call you' . ($time !== '' ? ' in ' . ($t['label'] ?? '') : '') . '.';
}
