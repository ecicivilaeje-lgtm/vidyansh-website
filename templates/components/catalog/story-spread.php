<?php
/**
 * One student per spread, like a magazine feature (the original StorySpread): portrait, headline,
 * a quote set large, and their own Dream to Destination.
 * @var array $story  @var ?array $feature  @var int $index  @var bool $isSample
 */
$flip = $index % 2 === 1;
$headingId = 'story-' . ($story['id'] ?? $index);
$journey = $feature['journey'] ?? [];
$lastStage = count($journey) - 1;
?>
<article aria-labelledby="<?= e($headingId) ?>" class="border-t border-ink pt-8">
  <div class="flex flex-wrap items-baseline justify-between gap-3">
    <span class="eyebrow">Feature <?= pad2($index + 1) ?><?= $isSample ? ' · Sample' : '' ?></span>
    <span class="eyebrow"><?= e($story['firstName'] ?? '') ?></span>
  </div>

  <div class="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-[clamp(2rem,4vw,4.5rem)]">
    <?php /* Portrait placeholder: art-directed, labelled, no stock photography. */ ?>
    <figure class="<?= e(cls('relative aspect-[4/5] overflow-hidden bg-parchment lg:col-span-5', $flip ? 'lg:order-2' : '')) ?>">
      <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_38%,rgb(7_7_6/0.08),transparent_70%)]"></div>
      <div aria-hidden="true" class="absolute inset-x-[22%] bottom-0 h-[52%] rounded-t-[50%] border border-b-0 border-ink/15"></div>
      <div aria-hidden="true" class="absolute top-[18%] left-1/2 size-[26%] -translate-x-1/2 rounded-full border border-ink/15"></div>
      <span aria-hidden="true" class="absolute top-4 left-4 h-6 w-px bg-ink/25"></span>
      <span aria-hidden="true" class="absolute top-4 left-4 h-px w-6 bg-ink/25"></span>
      <span aria-hidden="true" class="absolute right-4 bottom-4 h-6 w-px bg-ink/25"></span>
      <span aria-hidden="true" class="absolute right-4 bottom-4 h-px w-6 bg-ink/25"></span>
      <figcaption class="absolute bottom-5 left-5 grid gap-1">
        <span class="eyebrow text-ink">Portrait to come</span>
        <span class="font-mono text-[0.625rem] tracking-[0.14em] text-mute-l uppercase">Published with consent</span>
      </figcaption>
    </figure>

    <div class="<?= e(cls('grid content-start gap-8 lg:col-span-7', $flip ? 'lg:order-1' : '')) ?>">
      <h3 id="<?= e($headingId) ?>" class="text-[clamp(2.4rem,4.4vw,4.25rem)] leading-[0.92] tracking-[-0.02em]"><?= e($feature['headline'] ?? ($story['firstName'] ?? '')) ?></h3>
      <?php if ($feature): ?><p class="max-w-[46ch] text-[1.1875rem] text-mute-l"><?= e($feature['standfirst'] ?? '') ?></p><?php endif; ?>
      <?= reveal_open('blockquote', 'border-l border-ink/30 pl-6 sm:pl-8') ?>
        <p class="font-display text-[clamp(2.1rem,4.2vw,4.4rem)] leading-[1.02] tracking-[-0.015em] text-balance italic">“<?= e($story['quote'] ?? '') ?>”</p>
        <footer class="mt-6 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.75rem] tracking-[0.14em] uppercase">
          <span class="text-mute-l"><?= e($story['byline'] ?? '') ?></span>
          <span class="text-ink tabular-nums"><?= e($story['rank'] ?? '') ?></span>
        </footer>
      </blockquote>
    </div>
  </div>

  <?php if ($feature): ?>
    <ol aria-label="<?= e(($feature['headline'] ?? '') . ': Dream to Destination') ?>" class="relative mt-[clamp(3rem,6vw,5rem)] grid gap-6 md:grid-cols-5 md:gap-4">
      <span aria-hidden="true" class="absolute top-0 bottom-0 left-[4px] w-px bg-[var(--line-l)] md:top-[4px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto"></span>
      <?php foreach (array_values($journey) as $i => $s): $last = $i === $lastStage; ?>
        <li class="relative grid gap-2 pl-8 md:pl-0 md:pt-8 md:pr-3">
          <?php if ($last): ?>
            <?= star('absolute top-[-4px] left-[-3px] size-4 md:top-[-4px] md:left-[-3px]') ?>
          <?php else: ?>
            <span aria-hidden="true" class="absolute top-0 left-0 size-[9px] rotate-45 border border-ink bg-ivory"></span>
          <?php endif; ?>
          <span class="font-mono text-[0.6875rem] tracking-[0.14em] text-mute-l"><?= pad2($i + 1) ?></span>
          <span class="<?= e(cls('font-display text-[clamp(1.5rem,2vw,1.9rem)] leading-tight', $last ? 'italic' : '')) ?>"><?= e($s['stage'] ?? '') ?></span>
          <span class="text-[0.9375rem] text-mute-l"><?= e($s['note'] ?? '') ?></span>
        </li>
      <?php endforeach; ?>
    </ol>
  <?php endif; ?>
</article>
