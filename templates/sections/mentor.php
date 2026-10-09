<?php
/** Split composition: a chalkboard half (where the portrait will sit) against ivory copy. */
$mentor = content('mentor')['mentor'] ?? [];
$quote = $mentor['quote'] ?? ['', '', ''];
?>
<section id="mentor" aria-labelledby="mentor-title" class="scene-sheet on-light grid bg-ivory text-ink lg:grid-cols-[1fr_1.15fr]">
  <div class="plate-sheet relative min-h-[28rem] overflow-hidden bg-[radial-gradient(ellipse_70%_60%_at_40%_40%,#dcd3c2,#eee8dc)] lg:min-h-[56rem]">
    <div aria-hidden="true" class="absolute inset-0">
      <?php foreach ($mentor['chalk'] ?? [] as $c): ?>
        <span class="<?= e(cls('absolute font-hand whitespace-nowrap text-ivory/25', !empty($c['small']) ? 'text-[clamp(1.25rem,2vw,1.75rem)]' : 'text-[clamp(1.6rem,2.8vw,2.5rem)]')) ?>" style="<?= e('left:' . ($c['x'] ?? '0') . ';top:' . ($c['y'] ?? '0') . ';transform:rotate(' . (float) ($c['rotate'] ?? 0) . 'deg)') ?>"><?= e($c['text']) ?></span>
      <?php endforeach; ?>
    </div>
    <div aria-hidden="true" class="absolute inset-x-[12%] bottom-0 h-[58%] rounded-t-[50%] bg-gradient-to-b from-[#cdc3b0] to-[#e7e0d2] opacity-90"></div>
    <div class="absolute bottom-6 left-6 grid gap-1">
      <span class="eyebrow text-ivory">Portrait</span>
      <span class="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase">Shubham Sir, at the board · photograph to come</span>
    </div>
    <span aria-hidden="true" class="crosshair top-5 left-5"></span>
    <span aria-hidden="true" class="crosshair top-5 right-5"></span>
  </div>

  <div class="grid content-center gap-14 px-[var(--gutter)] py-[var(--space-section)] lg:pr-[max(var(--gutter),calc((100vw-88rem)/2))] lg:pl-[clamp(2.5rem,5vw,6rem)]">
    <?= chapter_mark('V', 'The mentor', $mentor['name'] ?? null) ?>
    <?= reveal_open('blockquote') ?>
      <p id="mentor-title" class="settle font-display text-[clamp(2.4rem,4.4vw,4.6rem)] leading-[1.02] tracking-[-0.015em] text-balance">&ldquo;<?= home_em($quote) ?>&rdquo;</p>
      <footer class="mt-6 flex items-center gap-4">
        <span class="font-hand text-[2.25rem] leading-none text-ink/80">Shubham</span>
        <span class="eyebrow">Founder, Vidyansh</span>
      </footer>
    </blockquote>
    <p class="max-w-[52ch] text-[1.1875rem] text-mute-l"><?= e($mentor['bio'] ?? '') ?></p>
    <div class="flex flex-wrap items-center gap-x-8 gap-y-4">
      <?= button('Meet the faculty', ['href' => '/faculty', 'tone' => 'light']) ?>
      <a href="<?= e(url('/about')) ?>" class="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">Why Vidyansh exists →</a>
    </div>

    <ol class="border-t border-ink/70">
      <?php foreach ($mentor['principles'] ?? [] as $p): ?>
        <li class="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 border-b border-[var(--line-l)] py-5 sm:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)]">
          <span class="font-display text-xl italic text-mute-l"><?= e($p['numeral']) ?></span>
          <span class="font-display text-[clamp(1.6rem,2.4vw,2.1rem)] leading-tight"><?= e($p['title']) ?></span>
          <span class="col-start-2 text-mute-l sm:col-start-3"><?= e($p['body']) ?></span>
        </li>
      <?php endforeach; ?>
    </ol>

    <ol aria-label="Timeline" class="relative grid grid-cols-2 gap-y-6 sm:grid-cols-4">
      <span aria-hidden="true" class="absolute top-[0.3rem] right-0 left-0 hidden h-px bg-[var(--line-l)] sm:block"></span>
      <?php foreach ($mentor['timeline'] ?? [] as $t): ?>
        <li class="relative grid gap-1 pr-3">
          <span aria-hidden="true" class="relative size-2.5 rotate-45 border border-ink bg-ivory"></span>
          <span class="mt-2 font-mono text-xs tracking-[0.12em] text-ink uppercase"><?= e($t['year']) ?></span>
          <span class="text-sm text-mute-l"><?= e($t['label']) ?></span>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>
