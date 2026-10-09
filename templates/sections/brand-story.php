<?php
/** Chapter I: the manifesto and the five-word stair from Dream to Destination. */
$brand = site()['brand'];
$j = content('journey');
$manifesto = $j['manifesto'] ?? [];
$stair = $j['storyStair'] ?? [];
/* Each step of the stair brightens and steps further right: Dream to Destination as a rising line. */
$stairStyles = [
    'text-[#5b554d]',
    'text-[#8a8277] md:pl-[4vw]',
    'text-[#b9b0a2] md:pl-[8vw]',
    'text-[#e3dacb] md:pl-[12vw]',
    'text-champagne italic font-normal md:pl-[16vw]',
];
$text = $manifesto['text'] ?? ['', '', ''];
?>
<section aria-labelledby="story-title" class="relative overflow-hidden bg-gradient-to-b from-ink to-night py-[var(--space-section)]">
  <div class="container-v">
    <?= chapter_mark('I', $manifesto['eyebrow'] ?? '', null, 'mb-[var(--space-block)] text-ivory') ?>
    <div class="grid items-start gap-8 md:grid-cols-[1fr_2.4fr] md:gap-[clamp(1.5rem,5vw,5rem)]">
      <div class="grid justify-items-start gap-4">
        <span lang="hi" class="font-deva text-[clamp(3.25rem,8vw,7.5rem)] leading-none text-ivory/[0.16] md:[writing-mode:vertical-rl]"><?= e($brand['devanagari']) ?></span>
        <span class="eyebrow"><?= e($brand['name']) ?> · <?= e($brand['meaning']) ?></span>
      </div>
      <div>
        <?= reveal_open('p', '', 80) ?>
          <span id="story-title" class="block font-display text-[clamp(2.25rem,5.2vw,5.5rem)] leading-[1.04] tracking-[-0.015em] text-balance"><?= home_em($text) ?></span>
        </p>
        <?= reveal_open('div', 'mt-9 flex items-center gap-4', 160) ?>
          <span class="font-hand text-[2.4rem] leading-none text-ivory/80"><?= e($manifesto['signature'] ?? '') ?></span>
          <span class="eyebrow"><?= e($manifesto['role'] ?? '') ?></span>
        </div>
      </div>
    </div>

    <ol aria-label="The five stages of the Vidyansh journey" class="mt-[var(--space-section)] border-b border-[var(--line-d)]">
      <?php foreach ($stair as $i => $s): ?>
        <?= reveal_open('li', 'grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 border-t border-[var(--line-d)] py-[clamp(0.6rem,1.4vw,1.1rem)] md:grid-cols-[4.5rem_auto_minmax(0,1fr)] md:gap-x-7', $i * 70) ?>
          <span class="font-mono text-[0.6875rem] tracking-[0.16em] text-mute-d"><?= pad2($i + 1) ?></span>
          <span class="<?= e(cls('font-display text-[clamp(2.9rem,8vw,8rem)] leading-[0.9] font-medium tracking-[-0.03em] whitespace-nowrap', $stairStyles[$i] ?? $stairStyles[4])) ?>"><?= e($s['word']) ?></span>
          <span class="col-start-2 font-display text-[clamp(1.0625rem,1.6vw,1.5rem)] leading-snug text-mute-d italic md:col-start-3 md:justify-self-end md:text-right"><?= e($s['note']) ?></span>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>
