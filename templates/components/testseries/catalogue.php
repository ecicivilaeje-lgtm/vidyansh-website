<?php
/**
 * The catalogue as a ledger. Every row links to its series; on large screens, hovering or
 * focusing a row also opens its cover beside the list (assets/js/testseries-catalogue.js).
 * @var array $series  @var string $heading
 */
$selected = $series[0] ?? null;
if (!$selected): ?>
<p class="py-16 text-body-d">No series in this category yet. New series are announced on this page first.</p>
<?php return; endif;
$count = count($series);
?>
<div data-ts-catalogue class="grid items-start gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-[clamp(2rem,4vw,4rem)]">
  <script type="application/json" data-ts-catalogue-exams><?= json_script(array_map(fn($s) => ['id' => $s['id'], 'exam' => $s['exam']], $series)) ?></script>
  <div>
    <div class="flex items-end justify-between gap-4 border-b border-ivory/60 pb-3">
      <h2 class="font-display text-[clamp(1.6rem,2.4vw,2.1rem)] leading-tight"><?= e($heading) ?></h2>
      <span class="eyebrow"><?= $count ?> series</span>
    </div>
    <div class="eyebrow hidden grid-cols-[6.5rem_minmax(0,1fr)_4.5rem_5.5rem_1.5rem] gap-4 border-b border-[var(--line-d)] py-2.5 md:grid" aria-hidden="true">
      <span>Code</span><span>Series</span><span>Tests</span><span>Difficulty</span><span></span>
    </div>
    <ol>
      <?php foreach ($series as $s): $active = $s['id'] === $selected['id']; ?>
        <li>
          <a href="<?= e(url(route_series($s['slug']))) ?>" data-ts-row="<?= e($s['id']) ?>"
            class="<?= e(cls('group relative grid grid-cols-[minmax(0,1fr)_1.5rem] items-center gap-x-4 gap-y-2 border-b border-[var(--line-d)] py-5 transition-colors md:grid-cols-[6.5rem_minmax(0,1fr)_4.5rem_5.5rem_1.5rem]', $active ? 'lg:bg-ivory/[0.035]' : 'hover:bg-ivory/[0.02]')) ?>">
            <span aria-hidden="true" data-ts-row-bar class="<?= e(cls('absolute top-0 bottom-0 -left-3 w-0.5 transition-colors', $active ? 'lg:bg-ivory' : '')) ?>"></span>
            <span class="hidden font-mono text-[0.6875rem] tracking-[0.12em] text-mute-d md:block"><?= e($s['id']) ?></span>
            <span class="min-w-0">
              <span class="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span data-ts-row-name class="<?= e(cls('font-display text-[clamp(1.4rem,2vw,1.75rem)] leading-tight transition-colors', $active ? 'lg:text-ivory' : '')) ?>"><?= e($s['name']) ?></span>
                <span data-ts-mine hidden class="border border-ivory/40 px-1.5 py-0.5 font-mono text-[0.5625rem] tracking-[0.14em] text-ivory uppercase">Your exam</span>
              </span>
              <span class="eyebrow mt-1 block"><?= e($s['examLabel']) ?> · <?= e(testseries_format_label($s)) ?></span>
              <span class="mt-2 flex items-center gap-5 md:hidden">
                <span class="font-mono text-[0.6875rem] text-body-d"><?= e(or_dash($s['testCount'] ?? null)) ?> tests</span>
                <?= testseries_difficulty($s['difficulty']) ?>
              </span>
            </span>
            <span class="hidden font-mono text-[0.8125rem] text-body-d tabular-nums md:block"><?= e(or_dash($s['testCount'] ?? null)) ?></span>
            <span class="hidden md:block"><?= testseries_difficulty($s['difficulty']) ?></span>
            <span aria-hidden="true" class="text-mute-d transition-[color,transform] group-hover:translate-x-1 group-hover:text-ivory">→</span>
          </a>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>

  <div class="hidden lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:block">
    <?php foreach ($series as $s): ?>
      <div data-ts-cover="<?= e($s['id']) ?>"<?= $s['id'] === $selected['id'] ? '' : ' hidden' ?>>
        <?php partial('components/testseries/paper-cover', ['series' => $s, 'freeTestHref' => route_free_test($s), 'compact' => true]) ?>
      </div>
    <?php endforeach; ?>
  </div>
</div>
