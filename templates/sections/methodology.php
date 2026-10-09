<?php
/** Five layers of the method, drawn as stacked axonometric plates that separate as the section scrolls in. */
$layers = content('method')['methodLayers'] ?? [];
$icons = [
    'play' => 'M-8 -6 L8 0 L-8 6 Z',
    'notes' => 'M-9 -6 H9 M-9 -2 H9 M-9 2 H5 M-9 6 H2',
    'graph' => 'M-10 6 L-4 0 L1 3 L10 -6',
    'clock' => 'M0 -7 A7 7 0 1 1 -0.01 -7 M0 -4 V0 L3 2',
    'chat' => 'M-9 -6 H9 V3 H-2 L-6 7 V3 H-9 Z',
];
$active = 0;
?>
<section id="method" aria-labelledby="method-title" class="scene-surface relative overflow-hidden bg-night py-[var(--space-section)]" data-method>
  <div aria-hidden="true" class="drafting-grid absolute inset-0 opacity-40"></div>
  <div class="container-v relative">
    <?= chapter_mark('IV', 'The method', null, 'mb-[var(--space-block)]') ?>
    <div class="grid items-end gap-8 md:grid-cols-[1.3fr_1fr]">
      <div>
        <h2 id="method-title" class="settle text-[clamp(3.75rem,8.4vw,9rem)] leading-[0.86] tracking-[-0.03em]">Built in <em class="font-normal">layers</em></h2>
      </div>
      <p class="max-w-[36ch] text-[1.1875rem] text-body-d md:justify-self-end">A week at Vidyansh is five layers working together. Each one carries the next; take one away and the structure leans.</p>
    </div>

    <div data-method-stage class="mt-[var(--space-block)] grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-[clamp(2rem,5vw,5rem)]">
      <ol class="border-t border-[var(--line-d)]">
        <?php foreach ($layers as $i => $l): $on = $active === $i; ?>
          <li class="border-b border-[var(--line-d)]">
            <button type="button" aria-pressed="<?= $on ? 'true' : 'false' ?>" data-method-layer="<?= $i ?>" class="group grid w-full grid-cols-[3rem_minmax(0,1fr)] gap-x-4 py-6 text-left">
              <span data-layer-code class="<?= e(cls('font-mono text-xs tracking-[0.12em] transition-colors', $on ? 'text-ivory' : 'text-mute-d')) ?>"><?= e($l['code']) ?></span>
              <span data-layer-title class="<?= e(cls('font-display text-[clamp(1.9rem,3vw,2.75rem)] leading-tight transition-colors', $on ? 'text-ivory italic' : 'text-ivory/70 group-hover:text-ivory')) ?>"><?= e($l['title']) ?></span>
              <span data-layer-body class="<?= e(cls('col-start-2 grid text-[0.9375rem] text-body-d transition-[grid-template-rows,opacity] duration-500 ease-out-expo', $on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')) ?>">
                <span class="overflow-hidden"><span class="block max-w-[44ch] pt-2"><?= e($l['body']) ?></span></span>
              </span>
            </button>
          </li>
        <?php endforeach; ?>
      </ol>

      <figure aria-label="Axonometric drawing of the five method layers" class="relative">
        <svg viewBox="0 0 520 520" class="mx-auto w-full max-w-[34rem]" role="img" aria-labelledby="plates-desc">
          <desc id="plates-desc">Five stacked plates, from L1 Concept class at the bottom to L5 Doubt desk at the top.</desc>
          <?php foreach ($layers as $i => $l): $y = 365 - $i * 26; ?>
            <g class="plate" data-active="<?= $active === $i ? 'true' : 'false' ?>" data-plate="<?= $i ?>" style="transform:translateY(<?= $y ?>px)">
              <path class="plate-side" d="M70 40 L260 135 L260 150 L70 55 Z"></path>
              <path class="plate-side" d="M260 135 L450 40 L450 55 L260 150 Z"></path>
              <path class="plate-top" d="M260 -55 L450 40 L260 135 L70 40 Z"></path>
              <g transform="translate(260 40) scale(1.6 0.92)"><path class="plate-icon" d="<?= e($icons[$l['icon'] ?? ''] ?? $icons['play']) ?>" stroke-width="1.2"></path></g>
              <text x="470" y="46" font-family="var(--font-mono)" font-size="11" letter-spacing="1.5"><?= e($l['code']) ?></text>
            </g>
          <?php endforeach; ?>
          <g stroke="rgb(7 7 6 / 0.22)" fill="none">
            <path d="M30 470 L30 90" stroke-dasharray="2 4"></path>
            <path d="M24 470 h12 M24 90 h12"></path>
          </g>
          <text x="18" y="290" fill="var(--color-mute-d)" font-family="var(--font-mono)" font-size="9" letter-spacing="2" transform="rotate(-90 18 290)">ONE WEEK</text>
        </svg>
        <figcaption class="eyebrow mt-4 text-center">Fig. 05 · Method, exploded view</figcaption>
      </figure>
    </div>
  </div>
</section>
