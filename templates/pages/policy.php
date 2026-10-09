<?php
/** A plain, readable policy page. Until the real text is added in the admin panel it states what the policy will cover. */
$policies = content('policies')['policies'];
$p = $policies[$policy] ?? null;
if (!$p) not_found();
$descriptions = [
    'privacy' => 'The Vidyansh privacy policy: what it covers and when it will be published.',
    'terms' => 'The Vidyansh terms of use: what they cover and when they will be published.',
    'refunds' => 'The Vidyansh refund policy: what it covers and when it will be published.',
];
page_meta([
    'title' => $p['title'] . ' · Vidyansh',
    'description' => $p['description'] ?? $descriptions[$policy],
    'canonical' => "/$policy",
]);
$hasBody = trim(strip_tags($p['body'] ?? '')) !== '';
?>
<div class="on-light bg-ivory pt-[var(--header-h)] text-ink">
  <div class="container-v grid gap-16 py-[var(--space-block)] lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-[clamp(3rem,8vw,9rem)]">
    <nav aria-label="Policies" class="lg:sticky lg:top-28 lg:self-start">
      <ul class="flex flex-wrap gap-x-6 gap-y-2 border-t border-ink pt-4 lg:grid lg:gap-3">
        <?php foreach (['privacy', 'terms', 'refunds'] as $k): ?>
          <li><a href="<?= e(url("/$k")) ?>"<?= $k === $policy ? ' aria-current="page"' : '' ?> class="font-display text-xl text-mute-l transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:italic"><?= e($policies[$k]['title']) ?></a></li>
        <?php endforeach; ?>
      </ul>
    </nav>

    <article class="max-w-[44rem]">
      <h1 class="text-[clamp(3.25rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.03em]"><?= e($p['title']) ?></h1>
      <p class="mt-8 font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-snug text-ink/80"><?= e($p['lede']) ?></p>

      <?php if ($hasBody): ?>
        <div class="article-prose mt-12"><?= $p['body'] ?></div>
      <?php else: ?>
        <p class="mt-12 border-l-2 border-ink py-1 pl-5 text-mute-l">This policy is being prepared and will be published here before enrolment and payments open.</p>

        <h2 class="mt-16 text-[1.75rem]">What it will cover</h2>
        <ol class="mt-6 border-t border-ink">
          <?php foreach ($p['covers'] as $i => $c): ?>
            <li class="grid grid-cols-[2.5rem_minmax(0,1fr)] border-b border-[var(--line-l)] py-4">
              <span class="font-mono text-xs text-mute-l"><?= pad2($i + 1) ?></span>
              <span><?= e($c) ?></span>
            </li>
          <?php endforeach; ?>
        </ol>
      <?php endif; ?>

      <div class="mt-14 flex flex-wrap items-center gap-6">
        <?= button('Ask us a question', ['href' => '/contact', 'tone' => 'light']) ?>
      </div>
    </article>
  </div>
</div>
