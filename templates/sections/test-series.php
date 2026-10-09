<?php
/** PRACTICE: Test Series as a first-class product. Headline, a live-looking test console, then a schedule board. */
$series = $series ?? get_featured_test_series();
$promise = content('test-series')['testSeriesPromise'] ?? [];
$palette = ['answered', 'answered', 'visited', 'answered', 'marked', 'answered', 'current', 'unseen', 'unseen', 'unseen', 'unseen', 'unseen', 'unseen', 'unseen', 'unseen'];
$bubble = [
    'answered' => 'border-ok bg-ok text-ink',
    'marked' => 'border-mark text-mark',
    'visited' => 'border-mute-d bg-ivory/10 text-mute-d',
    'current' => 'border-ivory text-ivory ring-2 ring-ivory/25',
    'unseen' => 'border-mute-d/70 text-mute-d',
];
$options = ['wL² / 2', 'wL² / 4', 'wL² / 8', 'wL² / 12'];
$choice = 2;
?>
<section id="test-series" aria-labelledby="ts-title" class="scene-surface relative overflow-hidden bg-ink py-[var(--space-section)]">
  <div class="container-v relative">
    <?= chapter_mark('III', 'Practice', 'Test Series', 'mb-[var(--space-block)]') ?>
    <div class="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-[clamp(2rem,4vw,4rem)]">
      <div>
        <h2 id="ts-title" class="settle text-[clamp(4.25rem,10vw,10.5rem)] leading-[0.84] tracking-[-0.04em]">Practice<br>with <em class="font-normal">purpose</em></h2>
        <p class="mt-10 max-w-[24ch] font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight text-body-d italic">&ldquo;Test yourself before the exam tests you.&rdquo;</p>
        <dl class="mt-12 flex flex-wrap gap-x-10 gap-y-5">
          <?php foreach ($promise as $p): ?>
            <div class="grid gap-1">
              <dt class="eyebrow"><?= e($p['label']) ?></dt>
              <dd class="font-mono text-[0.8125rem] tracking-[0.06em]"><?= e($p['value']) ?></dd>
            </div>
          <?php endforeach; ?>
        </dl>
      </div>

      <figure data-test-console class="border border-[var(--hair)] bg-charcoal font-mono shadow-[0_40px_80px_-40px_rgb(60_45_20/0.25)]" aria-label="Preview of the Vidyansh test console">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line-d)] px-4 py-3">
          <span class="text-[0.6875rem] tracking-[0.12em] text-mute-d uppercase">Sample paper · Question 07</span>
          <span class="flex items-center gap-2.5 text-lg tracking-[0.06em] tabular-nums" aria-label="Time remaining in this preview">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="size-5"><circle cx="12" cy="13" r="9" fill="none" stroke="currentColor"></circle><path d="M12 13 V8 M10 2h4" stroke="currentColor" fill="none"></path></svg>
            <span data-console-clock>02:00:00</span>
          </span>
        </div>
        <div class="grid sm:grid-cols-[1.5fr_1fr]">
          <fieldset class="grid content-start gap-3 border-b border-[var(--line-d)] p-5 sm:border-r sm:border-b-0">
            <legend class="contents">
              <span class="block text-[0.65625rem] tracking-[0.14em] text-mute-d uppercase">Strength of materials</span>
              <span class="mt-3 block font-display text-[1.2rem] leading-snug text-ivory">Maximum bending moment in a simply supported beam with a uniformly distributed load w over span L:</span>
            </legend>
            <?php foreach ($options as $i => $o): $on = $choice === $i; ?>
              <label data-console-option class="<?= e(cls('flex cursor-pointer items-center gap-3 border px-3 py-2 font-display text-base transition-colors', $on ? 'border-ivory' : 'border-[var(--line-d)] hover:border-ivory/30')) ?>">
                <input type="radio" name="console-q7" value="<?= $i ?>"<?= $on ? ' checked' : '' ?> class="peer sr-only">
                <span aria-hidden="true" class="<?= e(cls('size-4 shrink-0 rounded-full border', $on ? 'border-ivory bg-ivory shadow-[inset_0_0_0_3px_var(--color-charcoal)]' : 'border-mute-d', 'peer-focus-visible:ring-2 peer-focus-visible:ring-ivory')) ?>"></span>
                <?= e($o) ?>
              </label>
            <?php endforeach; ?>
          </fieldset>
          <div class="grid content-start gap-4 p-5">
            <span class="eyebrow">Answer sheet</span>
            <ol class="grid max-w-[15rem] grid-cols-5 gap-2" aria-label="Question palette">
              <?php foreach ($palette as $i => $state):
                $s = $i === 6 && $choice !== null ? 'answered' : $state; ?>
                <li<?= $i === 6 ? ' data-console-current' : '' ?> class="<?= e('grid aspect-square place-items-center rounded-full border text-[0.5625rem] ' . $bubble[$s]) ?>"><span class="sr-only">Question </span><?= $i + 1 ?><span class="sr-only">, <?= e($s) ?></span></li>
              <?php endforeach; ?>
            </ol>
            <ul class="grid grid-cols-2 gap-1.5 text-[0.59375rem] tracking-[0.08em] text-mute-d uppercase" aria-label="Legend">
              <li class="flex items-center gap-1.5"><span aria-hidden="true" class="size-2.5 rounded-full bg-ok"></span>Answered</li>
              <li class="flex items-center gap-1.5"><span aria-hidden="true" class="size-2.5 rounded-full border border-mark"></span>Marked</li>
              <li class="flex items-center gap-1.5"><span aria-hidden="true" class="size-2.5 rounded-full bg-ivory/15"></span>Visited</li>
              <li class="flex items-center gap-1.5"><span aria-hidden="true" class="size-2.5 rounded-full border border-mute-d"></span>Not seen</li>
            </ul>
          </div>
        </div>
      </figure>
    </div>

    <div class="mt-[var(--space-block)] border-t border-ivory/40">
      <div class="flex flex-wrap items-center justify-between gap-3 py-4">
        <p class="eyebrow text-ivory">Now running</p>
        <p class="eyebrow">Counts and dates appear as the catalogue is published</p>
      </div>
      <div class="overflow-x-auto">
        <table class="stack-table w-full border-collapse md:min-w-[46rem]">
          <caption class="sr-only">Current Vidyansh test series</caption>
          <thead>
            <tr class="eyebrow text-left">
              <?php foreach (['Test series', 'Exam', 'Tests', 'Duration', 'Schedule', 'Action'] as $i => $h): ?>
                <th scope="col" class="border-b border-[var(--line-d)] py-2.5 pr-4 font-medium"><?= $i === 5 ? '<span class="sr-only">' . e($h) . '</span>' : e($h) ?></th>
              <?php endforeach; ?>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($series as $s): ?>
              <tr data-series-exam="<?= e($s['exam'] ?? '') ?>" class="transition-colors hover:bg-ivory/[0.025]">
                <td data-series-first class="border-b border-[var(--line-d)] py-7 pr-4">
                  <span class="block font-display text-[clamp(1.75rem,2.4vw,2.25rem)] leading-tight"><?= e($s['name']) ?></span>
                  <span class="eyebrow mt-1.5 block"><?= e(implode(' · ', $s['subjects'] ?? [])) ?></span>
                </td>
                <td data-label="Exam" class="border-b border-[var(--line-d)] py-7 pr-4 font-mono text-[0.8125rem] text-body-d"><?= e($s['examLabel'] ?? '') ?></td>
                <td data-label="Tests" class="border-b border-[var(--line-d)] py-7 pr-4 font-mono text-[0.8125rem] text-body-d tabular-nums"><?= e(or_dash($s['testCount'] ?? null)) ?></td>
                <td data-label="Duration" class="border-b border-[var(--line-d)] py-7 pr-4 font-mono text-[0.8125rem] text-body-d tabular-nums"><?= e(or_dash($s['durationMin'] ?? null, ' min')) ?></td>
                <td data-label="Schedule" class="border-b border-[var(--line-d)] py-7 pr-4"><span class="font-mono text-[0.6875rem] tracking-[0.12em] whitespace-nowrap text-body-d uppercase"><?= e($s['schedule'] ?? '') ?></span></td>
                <td class="stack-action border-b border-[var(--line-d)] py-7 text-right">
                  <a href="<?= e(url(route_series($s['slug']))) ?>" aria-label="View <?= e($s['name']) ?>" class="link-underline font-mono text-[0.6875rem] tracking-[0.16em] whitespace-nowrap uppercase">View →</a>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-5 pt-7">
        <p class="eyebrow">Full-length · Subject-wise · Chapter-wise · Previous year papers</p>
        <?= button('Explore test series', ['href' => '/test-series']) ?>
      </div>
    </div>
  </div>
</section>
