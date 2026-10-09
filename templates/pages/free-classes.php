<?php
/** Free classes: the next live class, the weekly programme, recorded lectures and reminders. */
page_meta([
    'title' => 'Free classes · Vidyansh',
    'description' => 'Free live classes and recorded lectures for SSC JE, RRB JE and State AE / JE aspirants, with Shubham Sir. See the weekly programme and ask for class reminders.',
    'canonical' => '/free-classes',
]);
$fc = content('free-classes');
$page = $fc['freeClassesPage'] ?? [];
$next = get_next_live_class();
$programme = get_programme();
$lectures = get_recorded_lectures();
$countdown = ['Days', 'Hours', 'Minutes', 'Seconds'];
$tickerItems = $next ? ['Next live · ' . $next['title'], $next['subject'] ?? '', $next['exam'] ?? '', 'Schedule to be announced'] : [];
$arrowLink = 'group inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.16em] uppercase';
?>
<header aria-labelledby="free-title" class="relative overflow-hidden bg-ink pt-[calc(var(--header-h)+clamp(2.5rem,6vw,5rem))]">
  <div aria-hidden="true" class="drafting-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_80%_30%,#000,transparent_75%)]"></div>
  <div class="container-v relative">
    <div class="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-ivory/40 pb-5">
      <h1 id="free-title" class="text-[clamp(1.75rem,2.6vw,2.5rem)] leading-tight">Free classes, <em class="font-normal">live and recorded</em></h1>
      <p class="flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.17em] text-mute-d uppercase">
        <span aria-hidden="true" class="inline-block size-2 rounded-full border border-ivory/60"></span>Channel not live yet</p>
    </div>

    <?php if ($next): ?>
      <div class="grid gap-12 pt-[clamp(3rem,7vw,6rem)] pb-[var(--space-block)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-[clamp(3rem,7vw,8rem)]">
        <div>
          <p class="eyebrow text-ivory">Next live class</p>
          <p class="mt-6 font-display text-[clamp(3.25rem,8vw,8.5rem)] leading-[0.86] tracking-[-0.035em] text-balance"><?= e($next['title']) ?></p>
          <p class="mt-8 font-mono text-[0.75rem] tracking-[0.16em] text-mute-d uppercase"><?= e($next['subject'] ?? '') ?> · <?= e($next['exam'] ?? '') ?></p>
          <p class="mt-10 max-w-[44ch] text-[1.1875rem] text-body-d"><?= e($page['intro'] ?? '') ?></p>
        </div>

        <div class="grid content-end gap-8">
          <div class="border-t border-ivory/40 pt-5">
            <p class="eyebrow">Goes live</p>
            <p class="mt-3 font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1] italic"><?= e($next['startsAt'] ?? 'Schedule to be announced') ?></p>
          </div>
          <div>
            <p class="sr-only">The countdown starts when the date is announced.</p>
            <dl aria-hidden="true" class="grid grid-cols-4 border-y border-[var(--line-d)]">
              <?php foreach ($countdown as $i => $u): ?>
                <div class="<?= e(cls('grid gap-1 py-4', $i > 0 ? 'border-l border-[var(--line-d)] pl-4' : '')) ?>">
                  <dt class="font-mono text-[0.5625rem] tracking-[0.16em] text-mute-d uppercase"><?= e($u) ?></dt>
                  <dd class="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-none tabular-nums">—</dd>
                </div>
              <?php endforeach; ?>
            </dl>
          </div>
          <div class="flex flex-wrap gap-3">
            <?= button('Remind me', ['href' => '/contact?topic=free-classes', 'diamond' => true]) ?>
            <?= button('See this week', ['href' => '#programme', 'variant' => 'ghost']) ?>
          </div>
        </div>
      </div>
    <?php endif; ?>
  </div>

  <?php if ($next): ?>
    <div aria-hidden="true" class="ticker relative overflow-hidden border-y border-ivory/40 py-3">
      <ul class="ticker-run flex w-max gap-12 pl-12">
        <?php $all = array_merge($tickerItems, $tickerItems, $tickerItems, $tickerItems);
        foreach ($all as $i => $t): ?>
          <li class="flex items-center gap-12 font-mono text-[0.6875rem] tracking-[0.16em] whitespace-nowrap text-mute-d uppercase">
            <span<?= $i % count($tickerItems) === 0 ? ' class="text-ivory"' : '' ?>><?= e($t) ?></span>
            <span>·</span>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  <?php endif; ?>
</header>

<section id="programme" aria-labelledby="programme-title" class="border-t border-[var(--line-d)] bg-night py-[var(--space-section)]">
  <div class="container-v">
    <div class="flex flex-wrap items-end justify-between gap-6">
      <h2 id="programme-title" class="settle text-[clamp(3.25rem,7vw,7.5rem)] leading-[0.88] tracking-[-0.025em]">The <em class="font-normal">week</em> ahead</h2>
      <p class="eyebrow">Sample schedule</p>
    </div>
    <p class="mt-6 max-w-[52ch] text-body-d"><?= e($page['sampleNote'] ?? '') ?></p>
    <div class="mt-[clamp(3rem,6vw,5rem)]">
      <?php partial('components/learning/programme', [
          'entries' => $programme, 'days' => $fc['weekdays'] ?? [], 'dayNames' => $fc['weekdayNames'] ?? [], 'sampleNote' => 'Sample schedule',
      ]) ?>
    </div>
  </div>
</section>

<section aria-labelledby="recorded-title" class="bg-ink py-[var(--space-section)]">
  <div class="container-v">
    <p class="eyebrow">Recorded lectures</p>
    <h2 id="recorded-title" class="settle mt-5 text-[clamp(3.25rem,7vw,7.5rem)] leading-[0.88] tracking-[-0.025em]">Watch it <em class="font-normal">again</em></h2>
    <p class="mt-6 max-w-[48ch] text-body-d"><?= e($page['channelNote'] ?? '') ?></p>

    <ol class="mt-[clamp(3rem,6vw,5rem)] border-t border-ivory/40">
      <?php foreach ($lectures as $i => $l): $no = pad2($i + 1); ?>
        <li class="grid grid-cols-[minmax(0,1fr)] items-center gap-x-[clamp(1.25rem,3vw,3rem)] gap-y-5 border-b border-[var(--line-d)] py-8 sm:grid-cols-[auto_13rem_minmax(0,1fr)] lg:grid-cols-[6.5rem_15rem_minmax(0,1fr)_auto]">
          <span aria-hidden="true" class="font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-none text-mute-d tabular-nums"><?= $no ?></span>
          <div class="aspect-[8/5] w-full max-w-[18rem] sm:max-w-none">
            <?php partial('components/learning/lecture-poster', ['kind' => $l['poster'] ?? '', 'no' => $no]) ?>
          </div>
          <div class="min-w-0">
            <h3 class="font-display text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.02]"><?= e($l['title']) ?></h3>
            <p class="mt-3 font-mono text-[0.6875rem] tracking-[0.15em] text-mute-d uppercase"><?= e($l['subject'] ?? '') ?> · <?= e($l['exam'] ?? '') ?> · <?= e(or_dash($l['durationMin'] ?? null, ' min')) ?><span class="sr-only"> duration</span></p>
          </div>
          <div class="sm:col-start-3 lg:col-start-auto">
            <?php if (!empty($l['href'])): ?>
              <?= learning_arrow_link($l['href'], 'Watch', $arrowLink) ?>
            <?php else: ?>
              <button type="button" disabled class="inline-flex cursor-not-allowed items-center border border-ivory/30 px-4 py-3 font-mono text-[0.6875rem] font-medium tracking-[0.17em] whitespace-nowrap text-mute-d uppercase">Coming soon<span class="sr-only">: <?= e($l['title']) ?></span></button>
            <?php endif; ?>
          </div>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>

<section aria-labelledby="optin-title" class="border-t border-[var(--line-d)] bg-ink pb-[var(--space-section)]">
  <div class="container-v pt-[var(--space-block)]">
    <div class="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <h2 id="optin-title" class="text-[clamp(3.25rem,8vw,8.5rem)] leading-[0.86] tracking-[-0.03em]">Never miss a <em class="font-normal">class</em></h2>
      <?= button('Get class reminders', ['href' => '/contact?topic=free-classes', 'diamond' => true, 'class' => 'justify-self-start md:mb-3']) ?>
    </div>
    <p class="mt-8 max-w-[52ch] text-body-d">We will tell you when the schedule is announced and the channel opens. No spam, and no fee.</p>
  </div>
</section>
