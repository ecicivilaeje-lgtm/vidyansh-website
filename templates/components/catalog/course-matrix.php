<?php
/**
 * "Which course fits you?" A real comparison table, courses as columns, scrollable on phones (the original CourseMatrix).
 * @var array $courses
 */
$rows = [
    ['Exam', fn($c) => catalog_exam_label($c)],
    ['Mode', fn($c) => $c['mode'] ?? ''],
    ['Duration', fn($c) => $c['duration'] ?? ''],
    ['Next batch', fn($c) => $c['nextBatch'] ?? ''],
    ['Test series', fn($c) => ($c['testSeries'] ?? null) ?? '—'],
    ['Live doubt hours', fn($c) => ($c['liveDoubts'] ?? null) ?? '—'],
    ['Medium', fn($c) => ($c['medium'] ?? null) ?? '—'],
    ['Fee', fn($c) => 'To be announced'],
];
?>
<section aria-labelledby="matrix-title" class="scene-surface bg-ink py-[var(--space-section)] text-ivory">
  <div class="container-v grid gap-[var(--space-block)]">
    <div class="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
      <h2 id="matrix-title" class="settle text-[clamp(3.25rem,8vw,8.5rem)] leading-[0.86] tracking-[-0.035em]">Which course <em class="font-normal">fits</em> you?</h2>
      <p class="max-w-[38ch] text-[1.125rem] text-body-d">The same facts, side by side. Read across a row to compare, or down a column to see one course whole.</p>
    </div>

    <div role="region" aria-label="Course comparison table, scrolls sideways" tabindex="0" class="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] pb-4 lg:mx-0 lg:px-0">
      <table class="w-full min-w-[46rem] border-collapse text-left">
        <caption class="sr-only">Comparison of Vidyansh courses by exam, mode, duration, next batch, test series, live doubt hours, medium and fee</caption>
        <thead>
          <tr class="border-y border-ivory/40">
            <td class="w-[11rem] py-6"></td>
            <?php foreach ($courses as $i => $c): ?>
              <th scope="col" class="py-6 pr-6 align-bottom font-normal">
                <span class="block font-mono text-[0.6875rem] tracking-[0.14em] text-mute-d"><?= pad2($i + 1) ?></span>
                <a href="<?= e(url('/courses/' . $c['slug'])) ?>" class="group mt-2 inline-block font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.05]">
                  <span class="transition-[font-style] group-hover:italic"><?= e($c['title'][0] ?? '') ?></span><br><em><?= e($c['title'][1] ?? '') ?></em><span aria-hidden="true" class="ml-2 inline-block text-mute-d transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">→</span>
                </a>
              </th>
            <?php endforeach; ?>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($rows as [$label, $value]): ?>
            <tr class="border-b border-[var(--line-d)]">
              <th scope="row" class="eyebrow py-5 pr-6 align-top font-medium"><?= e($label) ?></th>
              <?php foreach ($courses as $c): $v = (string) $value($c); ?>
                <td class="<?= e(cls('py-5 pr-6 align-top text-[1rem] leading-snug', $v === '—' || $v === 'To be announced' ? 'text-mute-d' : 'text-body-d')) ?>"><?= e($v) ?></td>
              <?php endforeach; ?>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
    <p class="eyebrow">Batch dates and fees are placeholders until the schedule is published.</p>
  </div>
</section>
