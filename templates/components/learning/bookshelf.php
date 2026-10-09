<?php
/**
 * The library (the original components/library/Bookshelf): material stands on ruled shelves as
 * book spines, grouped by subject. Spines are buttons with a roving tabindex (arrow keys move,
 * Enter or Space opens). The server prints the initial state; assets/js/learning-bookshelf.js
 * runs the filters, the roving focus and the open book.
 * @var array $materials  @var array $examOptions  @var array $formats
 */
$examName = [];
foreach ($examOptions as $x) $examName[$x['code']] = $x['name'];
$usedExams = array_values(array_filter($examOptions, function ($x) use ($materials) {
    foreach ($materials as $m) if (in_array($x['code'], $m['exams'] ?? [], true)) return true;
    return false;
}));
$groups = [];
foreach ($materials as $m) $groups[$m['subject']][] = $m;
$selected = $materials[0] ?? null;
$letters = 'ABCDEFGHIJ';
$toggleOn = 'italic underline decoration-1 underline-offset-[6px]';
$toggleOff = 'text-mute-l hover:text-ink';
$toggles = [
    ['label' => 'Exam', 'key' => 'exam', 'options' => array_merge([['value' => 'all', 'label' => 'All exams']], array_map(fn($x) => ['value' => $x['code'], 'label' => $x['name']], $usedExams))],
    ['label' => 'Format', 'key' => 'format', 'options' => array_merge([['value' => 'all', 'label' => 'Every format']], array_map(fn($k) => ['value' => $k, 'label' => $formats[$k]], array_keys($formats)))],
];
$detailRows = function (?array $m) use ($examName, $formats) {
    if (!$m) return [['Subject', ''], ['Exam', ''], ['Format', ''], ['Pages', ''], ['Availability', '']];
    return [
        ['Subject', $m['subject']],
        ['Exam', implode(' · ', array_map(fn($c) => $examName[$c] ?? $c, $m['exams'] ?? []))],
        ['Format', $formats[$m['format']] ?? ''],
        ['Pages', or_dash($m['pages'] ?? null)],
        ['Availability', ($m['availability'] ?? '') === 'free' ? 'Free download' : 'Included with course'],
    ];
};
$jsData = [
    'materials' => array_map(fn($m) => [
        'id' => $m['id'], 'code' => $m['code'], 'title' => $m['title'], 'subject' => $m['subject'], 'exams' => $m['exams'] ?? [],
        'format' => $m['format'], 'pages' => $m['pages'] ?? null, 'availability' => $m['availability'] ?? '',
    ], $materials),
    'examName' => (object) $examName,
    'formats' => (object) $formats,
];
?>
<div data-bookshelf>
  <script type="application/json" data-bookshelf-data><?= json_script($jsData) ?></script>
  <div class="grid gap-5 border-t border-ink pt-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-x-10">
    <?php foreach ($toggles as $t): $id = 'filter-' . strtolower($t['label']); ?>
      <p id="<?= e($id) ?>" class="eyebrow pt-1.5"><?= e($t['label']) ?></p>
      <div role="group" aria-labelledby="<?= e($id) ?>" class="flex flex-wrap gap-x-6 gap-y-2" data-shelf-filter="<?= e($t['key']) ?>">
        <?php foreach ($t['options'] as $o): $on = $o['value'] === 'all'; ?>
          <button type="button" aria-pressed="<?= $on ? 'true' : 'false' ?>" data-value="<?= e($o['value']) ?>" class="<?= e(cls('py-1 font-display text-[1.3125rem] leading-tight transition-colors duration-300', $on ? $toggleOn : $toggleOff)) ?>"><?= e($o['label']) ?></button>
        <?php endforeach; ?>
      </div>
    <?php endforeach; ?>
  </div>
  <p aria-live="polite" class="eyebrow mt-6" data-shelf-count><?= count($materials) ?> of <?= count($materials) ?> titles on the shelf</p>

  <div role="group" aria-label="Bookshelf" aria-describedby="shelf-keys" class="mt-[clamp(2.5rem,5vw,4rem)]">
    <p id="shelf-keys" class="sr-only">Use the arrow keys to move between books, and Enter or Space to open one.</p>
    <div class="border-b-[3px] border-ink py-16" data-shelf-empty<?= $groups ? ' hidden' : '' ?>>
      <p class="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">Nothing on this shelf <em class="font-normal">yet.</em></p>
      <p class="mt-3 text-mute-l">Try another exam or format.</p>
    </div>
    <div class="flex flex-wrap" data-shelves<?= $groups ? '' : ' hidden' ?>>
      <?php $gi = 0; foreach ($groups as $subject => $items): ?>
        <section aria-label="<?= e($subject) ?>" class="min-w-0 pt-2" data-shelf="<?= e($subject) ?>">
          <div class="flex items-baseline gap-3 pr-[clamp(1.75rem,4vw,3.5rem)] pb-4">
            <span class="font-mono text-[0.625rem] tracking-[0.16em] text-mute-l uppercase" data-shelf-letter>Shelf <?= e($letters[$gi] ?? (string) ($gi + 1)) ?></span>
            <span class="font-display text-[1.375rem] leading-none italic"><?= e($subject) ?></span>
          </div>
          <div class="flex h-[19.5rem] items-end gap-[3px] pr-[clamp(1.75rem,4vw,3.5rem)]">
            <?php foreach ($items as $m):
              $isSel = $selected && $selected['id'] === $m['id'];
              $tone = LEARNING_SPINE_TONES[$m['spine']['tone'] ?? 'ink'] ?? LEARNING_SPINE_TONES['ink']; ?>
              <button type="button" tabindex="<?= $isSel ? '0' : '-1' ?>" aria-pressed="<?= $isSel ? 'true' : 'false' ?>" aria-controls="book-detail" aria-label="<?= e("{$m['title']}, {$m['subject']}, " . ($formats[$m['format']] ?? '') . ", {$m['code']}") ?>" style="height:<?= learning_num($m['spine']['height'] ?? 15) ?>rem;width:<?= learning_num($m['spine']['width'] ?? 3) ?>rem" data-spine="<?= e($m['id']) ?>" class="<?= e(cls('relative flex shrink-0 cursor-pointer flex-col items-center justify-between border px-1 pt-3 pb-2.5 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out-expo', $tone, $isSel ? '-translate-y-5' : 'hover:-translate-y-2')) ?>">
                <span aria-hidden="true" class="grid w-full gap-[3px] px-0.5"><span class="h-px bg-current opacity-35"></span><span class="h-px bg-current opacity-35"></span></span>
                <span aria-hidden="true" class="min-h-0 flex-1 overflow-hidden py-3 text-ellipsis font-display text-[clamp(0.95rem,1.2vw,1.125rem)] leading-none whitespace-nowrap [writing-mode:vertical-rl] rotate-180"><?= e($m['title']) ?></span>
                <span aria-hidden="true" class="font-mono text-[0.5625rem] tracking-[0.14em] [writing-mode:vertical-rl] rotate-180"><?= e($m['code']) ?></span>
              </button>
            <?php endforeach; ?>
          </div>
          <div aria-hidden="true" class="h-[3px] bg-ink"></div>
          <div aria-hidden="true" class="h-2.5 border-b border-[var(--line-l)]"></div>
        </section>
      <?php $gi++; endforeach; ?>
    </div>
  </div>

  <p aria-live="polite" class="sr-only" data-book-announce><?= $selected ? e("Opened {$selected['title']}, {$selected['code']}") : '' ?></p>
  <div id="book-detail" class="mt-[var(--space-block)] border-t border-ink pt-8">
    <article class="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-[clamp(3rem,6vw,7rem)]" data-book<?= $selected ? '' : ' hidden' ?>>
      <div>
        <p class="eyebrow">Open on the desk · <span class="tabular-nums" data-book-code><?= e($selected['code'] ?? '') ?></span></p>
        <h2 class="mt-5 text-[clamp(2.6rem,5.4vw,5.25rem)] leading-[0.9] tracking-[-0.025em]" data-book-title><?= e($selected['title'] ?? '') ?></h2>
        <p class="mt-6 max-w-[48ch] text-mute-l" data-book-note data-free="Free for every aspirant. The file will be available to download here once it is published." data-course="Part of the course material. Students receive it with their course."><?= ($selected['availability'] ?? '') === 'free' ? 'Free for every aspirant. The file will be available to download here once it is published.' : 'Part of the course material. Students receive it with their course.' ?></p>
        <div class="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button type="button" disabled aria-describedby="download-note" class="inline-flex cursor-not-allowed items-center gap-3 border border-ink/25 px-6 py-[1.1rem] font-mono text-[0.75rem] font-medium tracking-[0.17em] text-ink uppercase">Download · Coming soon</button>
          <?= str_replace('<a ', '<a data-book-courses' . (($selected['availability'] ?? '') === 'course' ? '' : ' hidden') . ' ', learning_arrow_link('/courses', 'See the courses', 'group inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.16em] uppercase')) ?>
        </div>
        <p id="download-note" class="mt-4 text-sm text-mute-l">Downloads open when the library is published.</p>
      </div>
      <dl class="grid content-start border-t border-[var(--line-l)] lg:border-t-0">
        <?php foreach ($detailRows($selected) as [$k, $v]): ?>
          <div class="grid grid-cols-[7.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-[var(--line-l)] py-4">
            <dt class="eyebrow"><?= e($k) ?></dt>
            <dd class="font-display text-[1.375rem] leading-snug" data-book-field="<?= e(strtolower($k)) ?>"><?= e($v) ?></dd>
          </div>
        <?php endforeach; ?>
      </dl>
    </article>
    <p class="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-mute-l" data-book-none<?= $selected ? ' hidden' : '' ?>>Choose a spine to <em class="font-normal">open it.</em></p>
  </div>
</div>
