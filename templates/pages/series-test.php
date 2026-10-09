<?php
/** /test-series/series/{slug}/tests/{testId}: the instructions sheet a candidate reads before beginning. */
$series = get_test_series_by_slug($slug);
$test = get_series_test($slug, $testId);
if (!$series || !$test) not_found();
$paper = !empty($test['paperId']) ? get_paper($test['paperId']) : null;

page_meta([
    'title' => "{$test['title']} · {$series['name']} · Vidyansh",
    'description' => "Instructions for {$test['title']}, part of {$series['name']}.",
    'noindex' => true,
]);

$subjects = $paper ? array_values(array_unique(array_map(fn($q) => $q['subject'], $paper['questions'] ?? []))) : [];
$rules = [
    'The clock starts when you begin and counts down on screen. The test submits itself when time runs out.',
    'Move between questions freely using the answer sheet. Your answers save as you go.',
    'Use Mark for review to come back to a question. A marked question that has an answer is still scored.',
    'Clear response removes your answer. An unanswered question scores zero.',
    'After submitting you see your score, accuracy, time taken and the full solution to every question.',
];
$fmt = fn($n) => rtrim(rtrim(number_format((float) $n, 4, '.', ''), '0'), '.');
?>
<div class="bg-ink pt-[calc(var(--header-h)+clamp(2rem,5vw,4rem))] pb-[clamp(4rem,8vw,7rem)]">
  <div class="container-v">
    <?= testseries_breadcrumb([['Test Series', '/test-series'], [$series['name'], route_series($slug)], [$test['title'], null]]) ?>

    <?php if (!$paper): ?>
      <div class="mt-12 max-w-2xl">
        <h1 class="text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.92]"><?= e($test['title']) ?></h1>
        <p class="mt-6 text-body-d">This test is locked. It opens on its release date for students who have the series.</p>
        <a href="<?= e(url(route_series($slug)) . '#access') ?>" class="link-underline mt-8 inline-block font-mono text-xs tracking-[0.16em] uppercase">Back to the series →</a>
      </div>
    <?php else: ?>
      <div class="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-[clamp(2rem,4vw,4rem)]">
        <div>
          <p class="eyebrow text-ivory"><?= !empty($test['isFree']) ? 'Free test · ' : '' ?>Instructions</p>
          <h1 class="mt-4 text-[clamp(2.75rem,5.6vw,5.25rem)] leading-[0.9] tracking-[-0.025em]"><?= e($test['title']) ?></h1>
          <p class="mt-4 font-mono text-[0.75rem] tracking-[0.12em] text-body-d uppercase"><?= e($series['name']) ?> · <?= e($paper['title']) ?></p>

          <dl class="mt-12 grid grid-cols-2 gap-x-8 sm:grid-cols-4">
            <?php foreach ([
                ['Questions', (string) count($paper['questions'] ?? [])],
                ['Duration', $paper['durationMin'] . ' min'],
                ['Correct', '+' . $fmt($paper['marking']['correct'])],
                ['Wrong', $fmt($paper['marking']['wrong'])],
            ] as [$k, $v]): ?>
              <div class="grid gap-2 border-t border-[var(--line-d)] pt-4 pb-6">
                <dt class="eyebrow"><?= e($k) ?></dt>
                <dd class="font-display text-[2.25rem] leading-none tabular-nums"><?= e($v) ?></dd>
              </div>
            <?php endforeach; ?>
          </dl>

          <h2 class="eyebrow mt-10">Sections</h2>
          <ul class="mt-3 flex flex-wrap gap-x-2 gap-y-1">
            <?php foreach ($subjects as $s): ?>
              <li class="text-body-d after:ml-2 after:text-mute-d after:content-['·'] last:after:content-none"><?= e($s) ?></li>
            <?php endforeach; ?>
          </ul>

          <h2 class="eyebrow mt-10">Read before you begin</h2>
          <ol class="mt-3 border-t border-[var(--line-d)]">
            <?php foreach ($rules as $i => $r): ?>
              <li class="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-[var(--line-d)] py-4 text-body-d">
                <span class="font-mono text-xs text-mute-d"><?= pad2($i + 1) ?></span><?= e($r) ?>
              </li>
            <?php endforeach; ?>
          </ol>

          <h2 class="eyebrow mt-10">Answer sheet key</h2>
          <ul class="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-body-d">
            <li class="flex items-center gap-2"><span aria-hidden="true" class="size-4 rounded-full border border-ok bg-ok"></span>Answered</li>
            <li class="flex items-center gap-2"><span aria-hidden="true" class="size-4 rounded-full border border-mark"></span>Marked for review</li>
            <li class="flex items-center gap-2"><span aria-hidden="true" class="size-4 rounded-full border border-mute-d bg-ivory/15"></span>Visited, not answered</li>
            <li class="flex items-center gap-2"><span aria-hidden="true" class="size-4 rounded-full border border-mute-d"></span>Not seen</li>
          </ul>
        </div>

        <aside aria-label="Begin the test" class="on-light on-parchment bg-parchment p-[clamp(1.25rem,2.6vw,1.75rem)] text-ink lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <p class="eyebrow">Candidate declaration</p>
          <p class="mt-3 mb-6 font-display text-[1.75rem] leading-tight">Take it as you would on the day.</p>
          <?php partial('components/testseries/begin-test', ['slug' => $slug, 'testId' => $testId, 'languages' => $paper['languages'] ?? []]) ?>
        </aside>
      </div>
    <?php endif; ?>
  </div>
</div>
