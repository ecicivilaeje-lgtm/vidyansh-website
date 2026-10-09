<?php
/** Helpers for the catalog pages: courses, exams, results, faculty. */

/** The journey exam with this code (the original examByCode from content/exams). */
function catalog_exam_by_code(?string $code): ?array
{
    foreach (content('exams')['exams'] ?? [] as $e) if (($e['code'] ?? null) === $code) return $e;
    return null;
}

/** Exam label used by the course index filters and the comparison matrix. */
function catalog_exam_label(array $course): string
{
    return catalog_exam_by_code($course['exam'] ?? null)['name'] ?? ($course['title'][0] ?? '');
}

/** "SSC JE <em>Complete</em>" style title, escaped. */
function catalog_title(array $course): string
{
    return e($course['title'][0] ?? '') . ' <em class="font-normal">' . e($course['title'][1] ?? '') . '</em>';
}

/** The small "→" that slides on hover, used after link text. */
function catalog_arrow(string $move = 'group-hover:translate-x-1.5'): string
{
    $classes = [
        'group-hover:translate-x-1.5' => 'inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5',
        'group-hover:translate-x-2' => 'inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-2',
    ];
    return '<span aria-hidden="true" class="' . $classes[$move] . '">→</span>';
}

/**
 * The founder as the original getFounder() returns it: { ...mentor, ...founderFeature },
 * so founderFeature wins where both define a key (bio).
 */
function catalog_founder(): array
{
    return array_merge(content('mentor')['mentor'] ?? [], content('faculty')['founderFeature'] ?? []);
}

/**
 * A word set as split-flap characters (the original FlapText). The readable text is given once
 * to assistive technology; the character blocks are decorative. $start staggers the flip.
 */
function catalog_flap_text(string $text, int $start = 0): string
{
    $words = explode(' ', mb_strtoupper($text));
    $i = $start;
    $out = '<span class="sr-only">' . e($text) . '</span><span aria-hidden="true" class="flap-row">';
    foreach ($words as $wi => $w) {
        $out .= '<span class="inline-flex gap-[2px] whitespace-nowrap">';
        if ($wi > 0) $out .= '<span class="flap flap--blank" style="--i:' . ($i++) . '"> </span>';
        foreach (mb_str_split($w) as $c) $out .= '<span class="flap" style="--i:' . ($i++) . '">' . e($c) . '</span>';
        $out .= '</span>';
    }
    return $out . '</span>';
}

/** Faculty members (from the admin panel) grouped by department id. */
function catalog_members_by_department(): array
{
    $by = [];
    foreach (get_faculty_members() as $m) {
        $dept = $m['department'] ?? '';
        if ($dept !== '') $by[$dept][] = $m;
    }
    return $by;
}

/** A number printed the way JavaScript prints it in SVG attributes (shortest round-trip form). */
function catalog_num(float|int $n): string
{
    if (is_int($n) || floor($n) == $n && abs($n) < 1e15) return (string) (int) $n;
    $old = ini_get('serialize_precision');
    ini_set('serialize_precision', '-1');
    $s = json_encode($n);
    ini_set('serialize_precision', $old);
    return $s;
}

/**
 * The founder quote is stored in three parts (before, accent, after). The admin forms trim each part,
 * which drops the space before the accent; put a space back wherever two words would otherwise touch.
 */
function catalog_quote_parts(array $quote): array
{
    [$a, $b, $c] = array_map('strval', array_pad(array_values($quote), 3, ''));
    $word = fn($s, $end) => $s !== '' && preg_match($end ? '/[\p{L}\p{N}]$/u' : '/^[\p{L}\p{N}]/u', $s);
    if ($word($a, true) && $word($b, false)) $a .= ' ';
    if ($word($b, true) && $word($c, false)) $c = ' ' . $c;
    return [$a, $b, $c];
}
