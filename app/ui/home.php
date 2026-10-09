<?php
/** Helpers for the homepage sections (templates/sections/*). */

/** The small "Chapter 01 / 05 · Night" head of each journey chapter. */
function home_chapter_head(array $stages, int $index): string
{
    $s = $stages[$index] ?? ['number' => pad2($index + 1), 'light' => ''];
    return '<div class="flex flex-wrap items-center gap-4"><span class="title-block"><span>Chapter</span><span>'
        . e($s['number']) . ' / 05</span></span><span class="eyebrow">' . e($s['light']) . '</span></div>';
}

/** Find a journey exam by code (examByCode searches the journey exams only). */
function home_exam_by_code(?string $code): ?array
{
    if ($code === null || $code === '') return null;
    foreach (content('exams')['exams'] ?? [] as $e) {
        if (($e['code'] ?? '') === $code) return $e;
    }
    return null;
}

/** JS-style number formatting with one decimal (Number.prototype.toFixed(1)). */
function home_fixed1(float $n): string
{
    $s = number_format($n, 1, '.', '');
    return $s === '-0.0' ? '-0.0' : $s;
}

/**
 * Prints a [before, emphasised, after] heading triple. The originals carry the spaces inside
 * the strings ("…to prepare ", "alone", ", with…"); if an edit trims them, put the space back.
 */
function home_em(array $parts, string $emClass = ''): string
{
    $before = (string) ($parts[0] ?? '');
    $mid = (string) ($parts[1] ?? '');
    $after = (string) ($parts[2] ?? '');
    if ($before !== '' && $mid !== '' && !preg_match('/\s$/u', $before)) $before .= ' ';
    if ($after !== '' && $mid !== '' && preg_match('/^[\p{L}\p{N}(“"‘]/u', $after)) $after = ' ' . $after;
    return e($before) . '<em' . ($emClass ? ' class="' . e($emClass) . '"' : '') . '>' . e($mid) . '</em>' . e($after);
}
