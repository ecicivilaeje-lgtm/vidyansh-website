<?php
/**
 * The access panel and the list of tests for one series (the original SeriesView). Status comes
 * from the progress data and, for the free test, from attempts saved on this device
 * (assets/js/testseries-series.js). The server renders the initial "not purchased" state.
 * @var array $series  @var array $tests  @var array $progress  @var array|null $paper  @var bool $preview
 */
$views = [
    'not_purchased' => 'Not purchased',
    'purchased' => 'Purchased',
    'in_progress' => 'Test in progress',
    'completed' => 'Test completed',
];
$statusOf = fn($t) => $progress['testStatus'][$t['id']] ?? 'locked';
$hrefs = [];
foreach ($tests as $t) {
    $hrefs[$t['id']] = [
        'test' => url(route_test($series['slug'], $t['id'])),
        'attempt' => url(route_attempt($series['slug'], $t['id'])),
        'result' => url(route_result($series['slug'], $t['id'])),
    ];
}
page_script('testseries-attempt');
page_script('testseries-series');
?>
<div data-ts-series>
<script type="application/json" data-ts-series-data><?= json_script([
    'tests' => array_map(fn($t) => [
        'id' => $t['id'], 'number' => $t['number'], 'title' => $t['title'], 'isFree' => !empty($t['isFree']),
        'questions' => $t['questions'] ?? null, 'durationMin' => $t['durationMin'] ?? null,
        'releaseNote' => $t['releaseNote'] ?? '', 'paperId' => $t['paperId'] ?? null,
    ], $tests),
    'progress' => $progress,
    'paper' => $paper,
    'hrefs' => $hrefs,
]) ?></script>
<?php if ($preview): ?>
  <div class="border-b border-[var(--line-d)] bg-charcoal">
    <div class="container-v flex flex-wrap items-center gap-x-5 gap-y-2 py-3">
      <span class="eyebrow text-ivory">Preview state</span>
      <div role="group" aria-label="Preview the series page as" class="flex flex-wrap gap-1.5">
        <?php foreach ($views as $id => $label): $on = $id === 'not_purchased'; ?>
          <button type="button" data-ts-view="<?= e($id) ?>" aria-pressed="<?= $on ? 'true' : 'false' ?>" class="<?= e(cls('border px-2.5 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-colors', $on ? 'border-ivory text-ivory' : 'border-[var(--line-d)] text-mute-d hover:text-ivory')) ?>"><?= e($label) ?></button>
        <?php endforeach; ?>
      </div>
      <span class="text-xs text-mute-d">For review only. On the live site this comes from the student’s account; personal figures stay “—” until real attempts exist.</span>
    </div>
  </div>
<?php endif; ?>

  <div data-ts-resume hidden class="border-b border-ivory/30 bg-ivory/[0.05]">
    <div class="container-v flex flex-wrap items-center justify-between gap-3 py-3">
      <p class="text-sm">
        <span class="mr-2 inline-block size-2 animate-pulse rounded-full bg-ivory align-middle" aria-hidden="true"></span><span data-ts-resume-title></span> is in progress. Your answers are saved.
      </p>
      <a data-ts-resume-link href="#" class="font-mono text-[0.6875rem] font-medium tracking-[0.16em] text-ivory uppercase underline-offset-4 hover:underline">Resume test →</a>
    </div>
  </div>

  <section aria-labelledby="contents-title" class="bg-ink py-[clamp(3.5rem,7vw,6rem)]">
    <div class="container-v grid items-start gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-[clamp(2rem,4vw,4rem)]">
      <div>
        <div class="flex items-end justify-between gap-4 border-b border-ivory/60 pb-3">
          <h2 id="contents-title" class="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-tight">Contents</h2>
          <span class="eyebrow"><?= e(or_dash($series['testCount'] ?? null)) ?> tests in series</span>
        </div>
        <ol data-ts-tests>
          <?php foreach ($tests as $t): ?><?= testseries_test_row($t, $statusOf($t), null, $series['slug']) ?><?php endforeach; ?>
        </ol>
        <p class="eyebrow mt-5 leading-relaxed normal-case tracking-[0.06em]">Further tests appear here as they are released. Each test opens on its release date.</p>
      </div>

      <?php partial('components/testseries/access-panel', ['series' => $series, 'progress' => $progress]) ?>
    </div>
  </section>
</div>
