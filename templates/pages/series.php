<?php
/** /test-series/series/{slug}: one series, its contents and the access panel. */
$series = get_test_series_by_slug($slug);
if (!$series) not_found();
$tests = get_series_tests($slug);
$progress = get_series_progress($slug);
$related = get_test_series(['exam' => $series['exam'] === 'multi' ? null : $series['exam']]);
$paperId = null;
foreach ($tests as $t) if (!empty($t['paperId'])) { $paperId = $t['paperId']; break; }
$paper = $paperId ? get_paper($paperId) : null;
$others = array_slice(array_values(array_filter($related, fn($s) => $s['id'] !== $series['id'])), 0, 3);

page_meta([
    'title' => "{$series['name']} · Vidyansh Test Series",
    'description' => "{$series['name']}: exam-pattern tests with detailed solutions, rank and analysis. The first test is free.",
    'canonical' => "/test-series/series/{$series['slug']}",
]);

$facts = [
    ['Tests', or_dash($series['testCount'] ?? null)],
    ['Questions / test', or_dash($series['questionsPerTest'] ?? null)],
    ['Duration', or_dash($series['durationMin'] ?? null, ' min')],
    ['Validity', or_dash($series['validityDays'] ?? null, ' days')],
];
?>
<header class="relative overflow-hidden bg-ink pt-[calc(var(--header-h)+clamp(2.5rem,6vw,5rem))] pb-[clamp(3rem,6vw,5rem)]">
  <?= testseries_omr(9, 'pointer-events-none absolute top-[calc(var(--header-h)+2rem)] right-[var(--gutter)] hidden w-36 text-ivory/15 md:block') ?>
  <div class="container-v relative">
    <?= testseries_breadcrumb([['Test Series', '/test-series'], [$series['examLabel'], '/test-series/' . $series['exam']], [$series['id'], null]]) ?>
    <h1 class="mt-7 max-w-[16ch] text-[clamp(3.4rem,8vw,8.5rem)] leading-[0.86] tracking-[-0.03em]"><?= e($series['name']) ?></h1>
    <p class="mt-5 font-mono text-[0.75rem] tracking-[0.14em] text-body-d uppercase"><?= e($series['examLabel']) ?> · <?= e(testseries_format_label($series)) ?> · <?= e(implode(' · ', $series['subjects'] ?? [])) ?></p>
    <dl class="mt-10 grid max-w-4xl grid-cols-2 border-t border-[var(--line-d)] sm:grid-cols-5">
      <?php foreach ($facts as [$label, $value]): ?>
        <div class="grid gap-1.5 border-b border-[var(--line-d)] py-4 pr-4 sm:border-b-0">
          <dt class="eyebrow"><?= e($label) ?></dt>
          <dd class="font-display text-[2rem] leading-none tabular-nums"><?= e($value) ?></dd>
        </div>
      <?php endforeach; ?>
      <div class="grid gap-2.5 border-b border-[var(--line-d)] py-4 sm:border-b-0">
        <dt class="eyebrow">Difficulty</dt>
        <dd><?= testseries_difficulty($series['difficulty'], true) ?></dd>
      </div>
    </dl>
  </div>
</header>

<?php partial('components/testseries/series-view', ['series' => $series, 'tests' => $tests, 'progress' => $progress, 'paper' => $paper, 'preview' => true]) ?>

<section aria-labelledby="analysis-title" class="border-t border-[var(--line-d)] bg-night py-[var(--space-section)]">
  <div class="container-v grid gap-10 lg:grid-cols-[1fr_1.4fr]">
    <div>
      <p class="eyebrow">After every attempt</p>
      <h2 id="analysis-title" class="mt-5 settle text-[clamp(3rem,6vw,6.25rem)] leading-[0.88] tracking-[-0.025em]">Know exactly <em class="font-normal">where marks went</em></h2>
      <p class="mt-6 max-w-[42ch] text-body-d">Your report card is ready the moment you submit. These are the figures it holds; they fill in from your own attempt.</p>
    </div>
    <dl class="grid grid-cols-2 gap-x-10 md:grid-cols-3">
      <?php foreach (['Score', 'Accuracy', 'Time taken', 'Rank', 'Percentile', 'By subject'] as $k): ?>
        <div class="grid content-start gap-3 border-t border-[var(--line-d)] pt-4 pb-10">
          <dt class="eyebrow"><?= e($k) ?></dt>
          <dd class="font-display text-[3.25rem] leading-none text-ivory/35">—</dd>
        </div>
      <?php endforeach; ?>
    </dl>
  </div>
</section>

<?php if ($others): ?>
<section aria-labelledby="more-title" class="border-t border-[var(--line-d)] bg-ink py-[var(--space-block)]">
  <div class="container-v">
    <h2 id="more-title" class="eyebrow text-ivory">More for <?= e($series['examLabel']) ?></h2>
    <ul class="mt-4 border-t border-[var(--line-d)]">
      <?php foreach ($others as $o): ?>
        <li>
          <a href="<?= e(url(route_series($o['slug']))) ?>" class="group flex items-baseline justify-between gap-4 border-b border-[var(--line-d)] py-5">
            <span class="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight transition-colors group-hover:text-ivory"><?= e($o['name']) ?></span>
            <span aria-hidden="true" class="text-mute-d group-hover:text-ivory">→</span>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
<?php endif; ?>
