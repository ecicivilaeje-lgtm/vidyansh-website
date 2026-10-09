<?php
/**
 * The Test Series catalogue: an examination hall, not a shop. Shared by the all, by-exam and by-format pages.
 * @var array $series  @var string $current  @var string $heading  @var array|null $freeSeries
 */
$ts = content('test-series');
$page = $ts['testSeriesPage'] ?? [];
$t = $page['title'] ?? ['', '', ''];
$isAll = $current === '/test-series';
page_script('testseries-catalogue');
?>
<header class="relative overflow-hidden bg-ink pt-[calc(var(--header-h)+clamp(3.5rem,8vw,7rem))] pb-[var(--space-block)]">
  <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_88%_40%,rgb(200_144_47/0.08),transparent_70%)]"></div>
  <div class="container-v relative grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
    <div>
      <p class="eyebrow text-ivory"><?= e($isAll ? ($page['eyebrow'] ?? '') : $heading) ?></p>
      <h1 class="mt-6 max-w-[14ch] text-[clamp(3.6rem,9vw,10rem)] leading-[0.84] tracking-[-0.035em]"><?php if (!$isAll): ?><span class="sr-only"><?= e($heading) ?>: </span><?php endif; ?><?= e($t[0] ?? '') ?><em class="font-normal text-ivory"><?= e($t[1] ?? '') ?></em><?= e($t[2] ?? '') ?></h1>
      <p class="mt-8 max-w-[52ch] text-body-d"><?= e($page['intro'] ?? '') ?></p>
      <div class="mt-9 flex flex-wrap gap-3">
        <?php if ($freeSeries): ?><?= button('Take a free test', ['href' => route_free_test($freeSeries)]) ?><?php endif; ?>
        <?= button('How it works', ['href' => '#how-it-works', 'variant' => 'ghost']) ?>
      </div>
    </div>
    <?= testseries_omr(10, 'hidden w-[11rem] text-ivory/40 lg:block') ?>
  </div>
</header>

<?php partial('components/testseries/category-rail', ['current' => $current]) ?>

<section aria-label="Series" class="bg-ink py-[var(--space-block)]">
  <div class="container-v">
    <?php partial('components/testseries/catalogue', ['series' => $series, 'heading' => $heading]) ?>
    <p class="eyebrow mt-8 max-w-[60ch] leading-relaxed normal-case tracking-[0.06em]"><?= e($page['catalogueNote'] ?? '') ?></p>
  </div>
</section>

<section id="how-it-works" aria-labelledby="how-title" class="border-t border-[var(--line-d)] bg-night py-[var(--space-section)]">
  <div class="container-v">
    <p class="eyebrow">How it works</p>
    <h2 id="how-title" class="mt-5 settle text-[clamp(3.25rem,7vw,7.5rem)] leading-[0.88] tracking-[-0.025em]">See the analysis <em class="font-normal text-ivory">before</em> you pay.</h2>
    <ol class="mt-12 grid border-t border-[var(--line-d)] sm:grid-cols-2 lg:grid-cols-4">
      <?php foreach ($page['steps'] ?? [] as $i => $s): ?>
        <li class="<?= e(cls('grid content-start gap-3 border-b border-[var(--line-d)] py-6 sm:pr-6 lg:border-b-0', $i > 0 ? 'lg:border-l lg:pl-6' : '', $i % 2 === 1 ? 'sm:border-l sm:pl-6 lg:pl-6' : '')) ?>">
          <span class="font-mono text-xs tracking-[0.14em] text-mute-d"><?= e($s['n'] ?? '') ?></span>
          <span class="font-display text-[1.65rem] leading-tight"><?= e($s['title'] ?? '') ?></span>
          <span class="text-[0.9375rem] text-body-d"><?= e($s['body'] ?? '') ?></span>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>

<section aria-labelledby="formats-title" class="scene-sheet on-light bg-ivory py-[var(--space-section)] text-ink">
  <div class="container-v grid gap-10 lg:grid-cols-[1fr_1.6fr]">
    <div>
      <p class="eyebrow">Four ways to practise</p>
      <h2 id="formats-title" class="mt-5 settle text-[clamp(3.25rem,7vw,7.5rem)] leading-[0.88] tracking-[-0.025em]">Choose the <em class="font-normal text-ink">format</em></h2>
    </div>
    <ul class="border-t border-ink">
      <?php foreach ($ts['testSeriesFormats'] ?? [] as $f): ?>
        <li>
          <a href="<?= e(url('/test-series/format/' . $f['id'])) ?>" class="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 border-b border-[var(--line-l)] py-6 transition-[padding] duration-500 ease-out-expo hover:pl-3 md:grid-cols-[16rem_minmax(0,1fr)_auto]">
            <span class="font-display text-[clamp(1.75rem,2.6vw,2.4rem)] leading-tight transition-colors group-hover:text-ink group-hover:italic"><?= e($f['label']) ?></span>
            <span class="col-start-1 text-mute-l md:col-start-2"><?= e($f['note'] ?? '') ?></span>
            <span aria-hidden="true" class="col-start-2 row-start-1 md:col-start-3">→</span>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
