<?php
/** The Route Map: every exam drawn as a transit line, stage by stage, on one dark sheet. */
page_meta([
    'title' => 'Exams · Vidyansh',
    'description' => 'The route through SSC JE, RRB JE, State AE / JE and AE / JE: who each exam is for, eligibility in general terms, and the stages from notification to destination.',
    'canonical' => '/exams',
]);
$exams = get_exams();
$courses = get_courses();
$guides = get_blog_posts();
$linkClass = 'group font-mono text-xs font-medium tracking-[0.16em] uppercase';
?>
<div class="bg-ink text-ivory">
  <?php /* The route drawing is the opening image; the title sits above it at a quieter size. */ ?>
  <header class="drafting-grid relative pt-[calc(var(--header-h)+clamp(2.5rem,6vw,5rem))] pb-[var(--space-block)]">
    <div class="container-v grid gap-[clamp(2rem,4vw,3.5rem)]">
      <h1 class="text-[clamp(3rem,6.5vw,6.75rem)] leading-[0.88] tracking-[-0.035em]">
        <span class="hero-mask block"><span class="hero-rise block">Know the <em class="font-normal">route</em> before you travel</span></span>
      </h1>
      <div class="hero-fade-late">
        <?php partial('components/catalog/route-network', ['exams' => $exams]) ?>
      </div>
      <div class="hero-fade grid gap-8 border-t border-[var(--line-d)] pt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
        <p class="max-w-[46ch] text-[1.1875rem] text-body-d">Each exam is drawn as a line, with a stop for every stage between the notification and the destination. Find yours, see who it is for, and where Vidyansh travels with you.</p>
        <p class="border-l border-ivory/40 pl-5 font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-snug italic">Patterns change. Always confirm against the official notification.</p>
      </div>
    </div>
  </header>

  <nav aria-label="Exams on this page" class="sticky top-0 z-30 border-y border-[var(--line-d)] bg-ink/90 backdrop-blur-xl">
    <ol class="container-v flex gap-x-8 overflow-x-auto py-4 [scrollbar-width:none]">
      <?php foreach ($exams as $i => $e): ?>
        <li class="shrink-0">
          <a href="#<?= e($e['code']) ?>" class="group flex items-baseline gap-2.5 whitespace-nowrap">
            <span class="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d">L<?= $i + 1 ?></span>
            <span class="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase"><?= e($e['name']) ?></span>
          </a>
        </li>
      <?php endforeach; ?>
    </ol>
  </nav>

  <div class="container-v pb-[var(--space-section)]">
    <?php foreach ($exams as $i => $e):
        $course = null;
        foreach ($courses as $c) if (($c['exam'] ?? null) === $e['code']) { $course = $c; break; }
        $series = test_series_for($e['code']);
        $examGuides = array_filter($guides, fn($g) => ($g['exam'] ?? null) === $e['code']); ?>
      <section id="<?= e($e['code']) ?>" aria-labelledby="<?= e($e['code']) ?>-title" class="scene-surface grid scroll-mt-20 gap-[clamp(2.5rem,5vw,4.5rem)] border-t border-ivory/40 pt-[clamp(2.5rem,5vw,4rem)] mt-[var(--space-block)] first:mt-[clamp(4rem,8vw,7rem)]">
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
          <div class="grid gap-4">
            <p class="flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <span class="font-mono text-xs tracking-[0.14em] text-mute-d">LINE <?= pad2($i + 1) ?></span>
              <span class="eyebrow"><?= e($e['fullName'] ?? '') ?></span>
            </p>
            <h2 id="<?= e($e['code']) ?>-title" class="settle text-[clamp(3.75rem,10vw,9.5rem)] leading-[0.84] tracking-[-0.04em]"><?= e($e['name']) ?></h2>
          </div>
          <?php if (!empty($e['routeNote'])): ?><p class="font-display text-[clamp(1.25rem,1.8vw,1.5rem)] leading-snug text-body-d italic"><?= e($e['routeNote']) ?></p><?php endif; ?>
        </div>

        <?php if (!empty($e['stages'])) partial('components/catalog/exam-line', ['stages' => $e['stages'], 'label' => $e['name']]) ?>

        <div class="grid gap-x-12 gap-y-8 border-t border-[var(--line-d)] pt-8 md:grid-cols-3">
          <div class="grid content-start gap-2">
            <h3 class="eyebrow">Who it is for</h3>
            <p class="text-[1.0625rem] text-body-d"><?= e($e['forWhom'] ?? '') ?></p>
          </div>
          <div class="grid content-start gap-2">
            <h3 class="eyebrow">Eligibility, in general terms</h3>
            <p class="text-[1.0625rem] text-body-d"><?= e($e['eligibility'] ?? '') ?></p>
          </div>
          <div class="grid content-start gap-3">
            <h3 class="eyebrow">Travel with Vidyansh</h3>
            <ul class="grid gap-3">
              <?php if ($course): ?>
                <li><a href="<?= e(url('/courses/' . $course['slug'])) ?>" class="group font-display text-[1.5rem] leading-tight"><span class="link-underline"><?= e($course['name']) ?></span> <?= catalog_arrow() ?></a></li>
              <?php else: ?>
                <li class="text-[1rem] text-mute-d">Course to be announced</li>
              <?php endif; ?>
              <?php if ($series): ?>
                <li><a href="<?= e(url('/test-series/' . $series['code'])) ?>" class="<?= $linkClass ?>"><span class="link-underline"><?= e($series['label']) ?> test series</span> <?= catalog_arrow() ?></a></li>
              <?php else: ?>
                <li class="font-mono text-xs tracking-[0.16em] text-mute-d uppercase">Test series to be announced</li>
              <?php endif; ?>
              <?php foreach ($examGuides as $g): ?>
                <li><a href="<?= e(url('/blog/' . $g['slug'])) ?>" class="<?= $linkClass ?>"><span class="link-underline">Read the <?= e(implode(' ', $g['short'] ?? [])) ?> guide</span> <?= catalog_arrow() ?></a></li>
              <?php endforeach; ?>
            </ul>
          </div>
        </div>
        <p class="eyebrow">Stages shown in outline · confirm against the official notification</p>
      </section>
    <?php endforeach; ?>

    <div class="mt-[var(--space-section)] grid gap-8 border-t border-ivory/40 pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline">
      <p class="max-w-[30ch] font-display text-[clamp(1.75rem,3vw,2.625rem)] leading-tight">Not sure which line is <em class="font-normal">yours?</em></p>
      <div class="flex flex-wrap gap-x-8 gap-y-4">
        <a href="<?= e(url('/courses')) ?>" class="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">Compare courses →</a>
        <a href="<?= e(url('/contact')) ?>" class="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">Ask the Vidyansh team →</a>
      </div>
    </div>
    <p class="mt-10 eyebrow">Patterns change. Always confirm against the official notification.</p>
  </div>
</div>
