<?php
/** A night sky of aspirants: each point of light is someone studying. Static under reduced motion. */
$community = content('community')['community'] ?? [];
$heading = $community['heading'] ?? ['', '', ''];
?>
<section id="community" aria-labelledby="community-title" class="scene-surface relative overflow-hidden bg-ink py-[var(--space-section)]">
  <canvas aria-hidden="true" data-constellation class="absolute inset-0 size-full"></canvas>
  <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_30%_50%,rgb(244_238_226/0.85),transparent_75%)]"></div>
  <div class="container-v relative">
    <?= chapter_mark('VIII', 'Together', 'Student community', 'mb-[var(--space-block)]') ?>
    <div class="grid gap-16 lg:grid-cols-[1.25fr_1fr] lg:items-end">
      <div>
        <h2 id="community-title" class="settle text-[clamp(3.75rem,9vw,10rem)] leading-[0.84] tracking-[-0.035em]"><?= home_em($heading, 'font-normal') ?></h2>
        <p class="mt-10 max-w-[44ch] text-[1.1875rem] text-body-d"><?= e($community['body'] ?? '') ?></p>
        <ul class="mt-14 grid gap-x-10 gap-y-7 sm:grid-cols-2">
          <?php foreach ($community['channels'] ?? [] as $c): ?>
            <li class="border-t border-[var(--line-d)] pt-3">
              <span class="font-display text-[1.75rem]"><?= e($c['title']) ?></span>
              <span class="mt-1 block text-sm text-mute-d"><?= e($c['body']) ?></span>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
      <ul class="grid gap-12" aria-label="Example conversations">
        <?php foreach ($community['threads'] ?? [] as $i => $t): ?>
          <li class="<?= e(cls('border-l border-ivory/40 pl-6', $i === 1 ? 'lg:ml-16' : '')) ?>">
            <span class="eyebrow"><?= e($t['meta'] ?? '') ?></span>
            <p class="mt-3 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-snug italic">&ldquo;<?= e($t['text'] ?? '') ?>&rdquo;</p>
            <?php if (!empty($t['note'])): ?><p class="mt-3 font-mono text-[0.6875rem] tracking-[0.12em] text-ok uppercase">✓ <?= e($t['note']) ?></p><?php endif; ?>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
</section>
