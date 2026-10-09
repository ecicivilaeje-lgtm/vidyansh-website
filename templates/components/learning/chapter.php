<?php
/**
 * A chapter of the About book (the original components/about/Chapter).
 * @var array $chapter  @var string|null $children  extra matter set inside the measure (HTML)
 * Optional: $dropCap (default true).
 */
$dropCap = $dropCap ?? true;
$children = $children ?? '';
$headingId = 'chapter-' . ($chapter['id'] ?? '');
$pull = $chapter['pullQuote'] ?? null;
?>
<section aria-labelledby="<?= e($headingId) ?>">
  <header class="<?= e(LEARNING_BOOK_GRID) ?>">
    <div class="lg:col-start-2">
      <p class="eyebrow">Chapter <?= e($chapter['numeral'] ?? '') ?></p>
      <h2 id="<?= e($headingId) ?>" class="settle mt-5 text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.92] tracking-[-0.025em]"><?= e($chapter['title'] ?? '') ?></h2>
      <span aria-hidden="true" class="mt-8 block h-px w-16 bg-ink"></span>
    </div>
  </header>

  <div class="mt-10 grid gap-7">
    <?php foreach ($chapter['paragraphs'] ?? [] as $i => $p): ?>
      <div class="contents">
        <div class="<?= e(LEARNING_BOOK_GRID . ' items-start') ?>">
          <?php if (!empty($p['margin'])): ?>
            <aside class="mb-3 font-mono text-[0.6875rem] leading-relaxed tracking-[0.1em] text-mute-l uppercase lg:col-start-1 lg:row-start-1 lg:mb-0 lg:max-w-[20ch] lg:justify-self-end lg:border-r lg:border-[var(--line-l)] lg:pt-1.5 lg:pr-5 lg:text-right"><span class="sr-only">Margin note: </span><?= e($p['margin']) ?></aside>
          <?php endif; ?>
          <p class="<?= e(cls('text-[1.1875rem] leading-[1.75] text-ink lg:col-start-2 lg:row-start-1', $dropCap && $i === 0 ? 'first-letter:float-left first-letter:mt-[0.06em] first-letter:mr-3 first-letter:font-display first-letter:text-[5.4em] first-letter:leading-[0.78] first-letter:font-medium' : '')) ?>"><?= e($p['text'] ?? '') ?></p>
        </div>
        <?php if ($pull && isset($pull['after']) && (int) $pull['after'] === $i): ?>
          <blockquote class="<?= e(LEARNING_BOOK_GRID . ' my-[clamp(2rem,5vw,4rem)]') ?>">
            <p class="border-y border-ink py-8 font-display text-[clamp(2.25rem,4.8vw,4.75rem)] leading-[1] tracking-[-0.02em] text-balance italic lg:col-span-2 lg:col-start-2 lg:pr-[10%]"><?= e($pull['text'] ?? '') ?></p>
          </blockquote>
        <?php endif; ?>
      </div>
    <?php endforeach; ?>
  </div>

  <?php if ($children !== ''): ?>
    <div class="<?= e(LEARNING_BOOK_GRID . ' mt-10') ?>">
      <div class="lg:col-start-2"><?= $children ?></div>
    </div>
  <?php endif; ?>
</section>
