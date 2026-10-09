<?php
/** The Journal: a contents page. Each guide is one ruled row with its exam set large and its key figures beside it. */
page_meta([
    'title' => 'Journal · Vidyansh',
    'description' => 'Exam guides by Shubham Sir for SSC JE, RRB JE and RSSB JE 2026: vacancies, eligibility, exam pattern and key dates, explained in plain words.',
    'canonical' => '/blog',
]);
$page = get_blog_page();
$posts = get_blog_posts();
?>
<header class="bg-ink pt-[calc(var(--header-h)+clamp(3.5rem,8vw,7rem))] pb-[clamp(3rem,6vw,5rem)]">
  <div class="container-v grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
    <h1 class="text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.86] tracking-[-0.04em]">
      <span class="hero-mask block"><span class="hero-rise block">The Vidyansh <em class="font-normal">journal</em></span></span>
    </h1>
    <div class="hero-fade grid gap-4">
      <p class="text-[1.1875rem] text-body-d"><?= e($page['intro'] ?? '') ?></p>
      <p class="eyebrow">Written by Shubham Sir</p>
    </div>
  </div>
</header>

<section aria-label="Articles" class="scene-sheet on-light bg-ivory pt-[clamp(3rem,6vw,5rem)] pb-[var(--space-section)] text-ink">
  <div class="container-v">
    <p class="eyebrow flex justify-between border-b-2 border-ink pb-4">
      <span>Exam guides</span>
      <span class="tabular-nums"><?= count($posts) ?> articles</span>
    </p>
    <ol>
      <?php foreach ($posts as $p): $short = $p['short'] ?? ['', '']; ?>
        <li class="border-b border-[var(--line-l)]">
          <a class="group grid gap-x-[clamp(2rem,5vw,5rem)] gap-y-6 py-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,15rem)] lg:items-start" href="<?= e(url('/blog/' . $p['slug'])) ?>">
            <p aria-hidden="true" class="font-display text-[clamp(3.75rem,8vw,7.5rem)] leading-[0.84] tracking-[-0.04em] transition-transform duration-700 ease-out-expo group-hover:translate-x-2"><?= e($short[0] ?? '') ?> <em class="font-normal text-mute-l"><?= e($short[1] ?? '') ?></em></p>
            <div class="grid content-start gap-4">
              <p class="eyebrow text-mute-l"><?= e($p['category'] ?? '') ?> · <?= e($p['board'] ?? '') ?></p>
              <h2 class="text-[clamp(1.75rem,2.6vw,2.375rem)] leading-[1.05] tracking-[-0.015em]"><span class="link-underline"><?= e($p['title']) ?></span></h2>
              <p class="max-w-[54ch] text-mute-l"><?= e($p['description'] ?? '') ?></p>
              <p class="mt-2 font-mono text-xs font-medium tracking-[0.16em] uppercase">Read the guide <span aria-hidden="true" class="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">→</span></p>
            </div>
            <dl class="grid grid-cols-3 gap-4 border-t border-ink pt-4 lg:grid-cols-1 lg:gap-0 lg:pt-0">
              <?php foreach ($p['figures'] ?? [] as $f): ?>
                <div class="grid content-start gap-1 lg:border-b lg:border-[var(--line-l)] lg:py-3 lg:first:pt-0">
                  <dt class="order-2 font-mono text-[0.625rem] leading-snug tracking-[0.12em] text-mute-l uppercase"><?= e($f['label'] ?? '') ?></dt>
                  <dd class="order-1 font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-none tabular-nums"><?= e($f['value'] ?? '') ?></dd>
                </div>
              <?php endforeach; ?>
            </dl>
          </a>
        </li>
      <?php endforeach; ?>
    </ol>
    <p class="eyebrow mt-8 max-w-[64ch] leading-relaxed text-mute-l">Figures are taken from each official notice. Always confirm against the notice and any corrigendum.</p>
  </div>
</section>
