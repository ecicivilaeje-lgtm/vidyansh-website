<?php
/** Helpers for the Test Series pages (ported from components/test-series). */

const TESTSERIES_DIFFICULTY_WORDS = ['', 'Gentle', 'Moderate', 'Exam level', 'Demanding', 'Toughest'];

/** Five rising bars instead of a badge (the original <Difficulty>). */
function testseries_difficulty($level, bool $showLabel = false, string $tone = 'dark'): string
{
    $level = (int) $level;
    $off = $tone === 'dark' ? 'bg-ivory/15' : 'bg-ink/15';
    $on = $tone === 'dark' ? 'bg-ivory' : 'bg-ink';
    $word = TESTSERIES_DIFFICULTY_WORDS[$level] ?? '';
    $bars = '';
    for ($n = 1; $n <= 5; $n++) {
        $bars .= '<span class="' . e('w-[5px] ' . ($n <= $level ? $on : $off)) . '" style="height:' . (5 + $n * 2.5) . 'px"></span>';
    }
    return '<span class="inline-flex items-center gap-2.5"><span aria-hidden="true" class="flex items-end gap-[3px]">' . $bars . '</span>'
        . '<span class="' . ($showLabel ? 'font-mono text-[0.6875rem] tracking-[0.12em] uppercase' : 'sr-only') . '">'
        . e($showLabel ? $word : "Difficulty $level of 5, " . strtolower($word)) . '</span></span>';
}

/** A column of OMR answer bubbles, a few filled: the Test Series motif. Decorative only. */
function testseries_omr(int $rows = 12, string $class = ''): string
{
    $out = '<svg viewBox="0 0 170 ' . ($rows * 26 + 10) . '" aria-hidden="true" class="' . e($class) . '">';
    for ($r = 0; $r < $rows; $r++) {
        $pick = ($r * 7 + 3) % 4;
        $out .= '<g transform="translate(0 ' . ($r * 26 + 14) . ')"><text x="0" y="4" font-family="var(--font-mono)" font-size="8" letter-spacing="1" fill="currentColor" opacity="0.5">' . pad2($r + 1) . '</text>';
        for ($o = 0; $o < 4; $o++) {
            $on = $o === $pick && $r < $rows - 4;
            $out .= '<circle cx="' . (40 + $o * 34) . '" cy="0" r="8.5" fill="' . ($on ? 'currentColor' : 'none') . '" stroke="currentColor" stroke-opacity="' . ($on ? '1' : '0.35') . '"></circle>';
        }
        $out .= '</g>';
    }
    return $out . '</svg>';
}

/** "Full-length · Previous year": the short labels of a series' formats. */
function testseries_format_label(array $series): string
{
    $formats = content('test-series')['testSeriesFormats'] ?? [];
    return implode(' · ', array_map(function ($f) use ($formats) {
        foreach ($formats as $x) if ($x['id'] === $f) return $x['short'];
        return '';
    }, $series['formats'] ?? []));
}

/** A breadcrumb trail; the last item is the current page. $items: [[label, href|null], ...] */
function testseries_breadcrumb(array $items, string $navClass = ''): string
{
    $out = '<nav aria-label="Breadcrumb"' . ($navClass ? ' class="' . e($navClass) . '"' : '') . '><ol class="eyebrow flex flex-wrap gap-2">';
    $last = count($items) - 1;
    foreach ($items as $i => [$label, $href]) {
        if ($i === $last) {
            $out .= '<li aria-current="page" class="text-ivory">' . e($label) . '</li>';
        } else {
            $out .= '<li><a href="' . e(url($href)) . '" class="hover:text-ivory">' . e($label) . '</a></li><li aria-hidden="true">/</li>';
        }
    }
    return $out . '</ol></nav>';
}

const TESTSERIES_STATUS = [
    'locked' => ['Locked', 'text-mute-d border-[var(--line-d)]'],
    'available' => ['Available', 'text-ivory border-ivory/40'],
    'in_progress' => ['In progress', 'text-mark border-mark/50'],
    'completed' => ['Completed', 'text-ok border-ok/50'],
];

/** One row of a series' contents (the original TestRow). assets/js/testseries-series.js rebuilds it the same way. */
function testseries_test_row(array $test, string $status, ?string $score, string $slug): string
{
    [$label, $statusCls] = TESTSERIES_STATUS[$status] ?? TESTSERIES_STATUS['locked'];
    $action = match ($status) {
        'available' => [route_test($slug, $test['id']), !empty($test['isFree']) ? 'Start free' : 'Start'],
        'in_progress' => [route_attempt($slug, $test['id']), 'Resume'],
        'completed' => [route_result($slug, $test['id']), 'Result'],
        default => null,
    };
    $meta = (($test['questions'] ?? null) !== null ? $test['questions'] . ' questions · ' . or_dash($test['durationMin'] ?? null, ' min') . ' · ' : '') . ($test['releaseNote'] ?? '');
    $out = '<li data-ts-test="' . e($test['id']) . '" class="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b border-[var(--line-d)] py-5 md:grid-cols-[3rem_minmax(0,1fr)_7.5rem_7.5rem]">'
        . '<span class="font-mono text-xs text-mute-d tabular-nums">' . pad2((int) $test['number']) . '</span>'
        . '<span class="min-w-0"><span class="' . e(cls('block font-display text-[1.45rem] leading-tight', $status === 'locked' ? 'text-ivory/60' : '')) . '">' . e($test['title']) . '</span>'
        . '<span class="eyebrow mt-1 block">' . e($meta) . '</span>'
        . ($status === 'completed' ? '<span class="mt-1 block font-mono text-[0.6875rem] tracking-[0.1em] text-body-d">Score ' . e($score ?? '—') . ' · Rank — · Percentile —</span>' : '')
        . '</span>'
        . '<span class="col-start-2 row-start-2 md:col-start-auto md:row-start-auto"><span class="' . e('inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[0.5625rem] tracking-[0.14em] uppercase ' . $statusCls) . '">'
        . ($status === 'locked' ? '<svg viewBox="0 0 12 12" aria-hidden="true" class="size-2.5"><rect x="2" y="5.5" width="8" height="5.5" fill="none" stroke="currentColor"></rect><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor"></path></svg>' : '')
        . e($label) . '</span></span>'
        . '<span class="col-start-3 row-span-2 row-start-1 justify-self-end md:col-start-auto md:row-span-1 md:row-start-auto">';
    if ($action) {
        $out .= '<a href="' . e(url($action[0])) . '" aria-label="' . e($action[1] . ': ' . $test['title']) . '" class="'
            . e(cls('inline-flex border px-3.5 py-2.5 whitespace-nowrap font-mono text-[0.625rem] font-medium tracking-[0.16em] uppercase transition-colors', $status === 'available' ? 'border-ivory bg-ivory text-ink hover:bg-transparent hover:text-ivory' : 'border-ivory/30 hover:border-ivory hover:text-ivory'))
            . '">' . e($action[1]) . '</a>';
    } else {
        $out .= '<span class="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase">—</span>';
    }
    return $out . '</span></li>';
}
