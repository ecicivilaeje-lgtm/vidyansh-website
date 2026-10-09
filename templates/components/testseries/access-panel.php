<?php
/**
 * The access panel of a series. Both states are rendered; the "purchased" one stays hidden
 * until the review switcher shows it (assets/js/testseries-series.js).
 * @var array $series  @var array $progress
 */
$label = 'font-mono text-[0.5625rem] tracking-[0.14em] text-mute-l uppercase';
?>
<aside id="access" aria-labelledby="access-title" class="on-light on-parchment scroll-mt-28 bg-parchment text-ink lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
  <div class="flex items-center justify-between border border-b-0 border-[var(--hair)] bg-charcoal px-5 py-2.5 text-ivory">
    <span data-ts-access-kicker class="font-mono text-[0.625rem] tracking-[0.18em] uppercase">Access</span>
    <span data-ts-access-state class="font-mono text-[0.625rem] tracking-[0.18em] uppercase text-ivory">Not purchased</span>
  </div>
  <div class="grid gap-5 p-[clamp(1.25rem,2.6vw,1.75rem)]">
    <h2 id="access-title" data-ts-access-title class="font-display text-[1.9rem] leading-tight">Unlock every test</h2>

    <div data-ts-access="purchased" hidden class="contents">
      <dl class="grid grid-cols-3 border-t border-l border-[var(--line-l)]">
        <?php foreach ([['Attempted', or_dash($progress['attempted'] ?? null)], ['Remaining', or_dash($progress['remaining'] ?? null)], ['Validity left', or_dash($progress['validityLeftDays'] ?? null, ' d')]] as [$k, $v]): ?>
          <div class="grid gap-1 border-r border-b border-[var(--line-l)] px-3 py-3">
            <dt class="<?= $label ?>"><?= e($k) ?></dt>
            <dd class="font-display text-3xl leading-none tabular-nums"><?= e($v) ?></dd>
          </div>
        <?php endforeach; ?>
      </dl>
      <div>
        <div class="flex justify-between <?= $label ?>">
          <span>Series progress</span>
          <span><?= ($progress['attempted'] ?? null) === null ? '—' : '' ?></span>
        </div>
        <div class="mt-2 h-1.5 bg-ink/10" role="img" aria-label="Series progress not available yet">
          <div class="h-full w-0 bg-ink"></div>
        </div>
      </div>
      <dl class="grid grid-cols-2 gap-4 border-t border-[var(--line-l)] pt-4">
        <div>
          <dt class="<?= $label ?>">Average accuracy</dt>
          <dd class="mt-1 font-display text-3xl leading-none tabular-nums"><?= ($progress['avgAccuracy'] ?? null) === null ? '—' : e(round($progress['avgAccuracy'] * 100) . '%') ?></dd>
        </div>
        <div>
          <dt class="<?= $label ?>">Best rank</dt>
          <dd class="mt-1 font-display text-3xl leading-none tabular-nums"><?= e(or_dash($progress['bestRank'] ?? null)) ?></dd>
        </div>
      </dl>
      <p class="text-xs text-mute-l">Figures fill in from your attempts. Ranks compare you with every Vidyansh student who took the same test.</p>
    </div>

    <div data-ts-access="not_purchased" class="contents">
      <div>
        <p class="<?= $label ?>">Price</p>
        <p class="mt-1 flex items-baseline gap-3">
          <span class="font-display text-5xl leading-none tabular-nums"><?= e(format_inr($series['price'] ?? null)) ?></span>
          <?php if (($series['originalPrice'] ?? null) !== null): ?><s class="text-mute-l"><?= e(format_inr($series['originalPrice'])) ?></s><?php endif; ?>
        </p>
        <p class="mt-2 text-sm text-mute-l">Validity <?= e(or_dash($series['validityDays'] ?? null, ' days')) ?> · Tests <?= e(or_dash($series['testCount'] ?? null)) ?></p>
      </div>
      <ul class="grid gap-2 border-t border-[var(--line-l)] pt-4 text-[0.9375rem]">
        <?php foreach (['Every test in the series, as it releases', 'Detailed solution for every question', 'Rank, percentile and topic analysis', 'Hindi and English, where the exam allows'] as $x): ?>
          <li class="flex gap-2.5"><span aria-hidden="true" class="mt-2 size-1.5 shrink-0 rotate-45 bg-ink"></span><?= e($x) ?></li>
        <?php endforeach; ?>
      </ul>
      <div class="grid gap-2.5">
        <a href="<?= e(url(route_free_test($series))) ?>" class="inline-flex justify-center border border-ink bg-ink px-5 py-3.5 font-mono text-[0.6875rem] font-medium tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-transparent hover:text-ink">Start free test</a>
        <button type="button" aria-disabled="true" aria-describedby="buy-note" class="inline-flex cursor-not-allowed justify-center border border-ink/25 px-5 py-3.5 font-mono text-[0.6875rem] font-medium tracking-[0.16em] text-mute-l uppercase">Buy now</button>
        <p id="buy-note" class="text-xs text-mute-l">Checkout opens when this series is published. The free test is open now.</p>
      </div>
    </div>
  </div>
</aside>
