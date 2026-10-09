<?php
/**
 * A series shown as the cover of an examination booklet: every catalogue field in a ruled
 * grid, the price block and the two actions. Null values print as "—".
 * @var array $series  @var string $freeTestHref  @var bool $compact
 */
$compact = $compact ?? false;
$price = $series['price'] ?? null;
$original = $series['originalPrice'] ?? null;
$off = discount_percent($price, $original);
$rows = [
    ['Exam', $series['examLabel']],
    ['Format', testseries_format_label($series)],
    ['Tests', or_dash($series['testCount'] ?? null)],
    ['Questions / test', or_dash($series['questionsPerTest'] ?? null)],
    ['Duration', or_dash($series['durationMin'] ?? null, ' min')],
    ['Validity', or_dash($series['validityDays'] ?? null, ' days')],
    ['Solutions', !empty($series['hasSolutions']) ? 'Detailed, every question' : '—'],
    ['Analysis', !empty($series['hasAnalysis']) ? 'Rank, accuracy, time' : '—'],
];
?>
<article aria-labelledby="cover-<?= e($series['id']) ?>" class="on-light on-parchment relative bg-parchment text-ink shadow-[0_40px_90px_-40px_rgb(60_45_20/0.35)]">
  <div class="flex items-center justify-between gap-4 border border-b-0 border-[var(--hair)] bg-charcoal px-5 py-2.5 text-ivory">
    <span class="font-mono text-[0.625rem] tracking-[0.18em] uppercase">Vidyansh · Test Series</span>
    <span class="font-mono text-[0.625rem] tracking-[0.18em] text-ivory uppercase"><?= e($series['id']) ?></span>
  </div>

  <div class="grid gap-5 p-[clamp(1.25rem,2.6vw,2rem)]">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="eyebrow"><?= e(implode(' · ', $series['subjects'] ?? [])) ?></p>
        <h2 id="cover-<?= e($series['id']) ?>" class="<?= e(cls('mt-3 leading-[0.95] tracking-[-0.02em]', $compact ? 'text-[clamp(2rem,3vw,2.75rem)]' : 'text-[clamp(2.4rem,4.4vw,4rem)]')) ?>"><?= e($series['name']) ?></h2>
      </div>
      <span aria-hidden="true" class="grid size-[5.25rem] shrink-0 rotate-[-12deg] place-items-center rounded-full border-2 border-double border-ink/70 p-2 text-center font-mono text-[0.5rem] leading-tight tracking-[0.14em] text-ink uppercase">Free test included</span>
    </div>

    <dl class="grid grid-cols-2 border-t border-l border-[var(--line-l)]">
      <?php foreach ($rows as [$label, $value]): ?>
        <div class="grid gap-1 border-r border-b border-[var(--line-l)] px-3 py-2.5">
          <dt class="font-mono text-[0.59375rem] tracking-[0.16em] text-mute-l uppercase"><?= e($label) ?></dt>
          <dd class="text-[0.9375rem] leading-snug tabular-nums"><?= e($value) ?></dd>
        </div>
      <?php endforeach; ?>
      <div class="col-span-2 flex items-center justify-between gap-3 border-r border-b border-[var(--line-l)] px-3 py-2.5">
        <dt class="font-mono text-[0.59375rem] tracking-[0.16em] text-mute-l uppercase">Difficulty</dt>
        <dd><?= testseries_difficulty($series['difficulty'], true, 'light') ?></dd>
      </div>
    </dl>

    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="font-mono text-[0.59375rem] tracking-[0.16em] text-mute-l uppercase">Price</p>
        <p class="mt-1 flex items-baseline gap-3">
          <span class="font-display text-4xl leading-none tabular-nums"><?= e(format_inr($price)) ?></span>
          <?php if ($original !== null): ?><s class="text-mute-l tabular-nums"><?= e(format_inr($original)) ?></s><?php endif; ?>
          <?php if ($off !== null): ?><span class="bg-ink px-1.5 py-0.5 font-mono text-[0.625rem] tracking-[0.12em] text-ivory"><?= $off ?>% off</span><?php endif; ?>
        </p>
        <?php if ($price === null): ?><p class="mt-1.5 text-xs text-mute-l">Price is announced when the series is published.</p><?php endif; ?>
      </div>
      <div class="flex flex-wrap gap-2.5">
        <a href="<?= e(url($freeTestHref)) ?>" class="inline-flex items-center gap-2.5 border border-ink bg-ink px-4 py-3 font-mono text-[0.6875rem] font-medium tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-transparent hover:text-ink">Start free test</a>
        <a href="<?= e(url(route_series($series['slug'])) . '#access') ?>" class="inline-flex items-center border border-ink/30 px-4 py-3 font-mono text-[0.6875rem] font-medium tracking-[0.16em] uppercase transition-colors hover:border-ink hover:text-ink"><?= $compact ? 'View series' : 'Buy now' ?></a>
      </div>
    </div>
  </div>
  <p class="border-t border-dashed border-[var(--line-l)] px-5 py-2.5 font-mono text-[0.5625rem] tracking-[0.16em] text-mute-l uppercase">Schedule · <?= e($series['schedule'] ?? '') ?></p>
</article>
