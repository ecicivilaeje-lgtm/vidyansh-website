<?php
/**
 * .../tests/{testId}/attempt: the full-screen examination console, without the site header and footer.
 * Only tests with a paper have a console; everything else is 404, as in the original.
 * The page first shows "Preparing your paper…" (as the original does before the saved attempt is read);
 * assets/js/testseries-console.js then loads or starts the attempt and runs the console.
 */
$series = get_test_series_by_slug($slug);
$test = get_series_test($slug, $testId);
$paper = !empty($test['paperId']) ? get_paper($test['paperId']) : null;
if (!$series || !$test || !$paper || empty($paper['questions'])) not_found();

page_meta(['title' => "{$test['title']} · In progress · Vidyansh", 'noindex' => true, 'chrome' => 'bare']);
page_script('testseries-attempt');
page_script('testseries-console');

$questions = $paper['questions'];
$n = count($questions);
$q = $questions[0];
$total = (int) $paper['durationMin'] * 60;
$clock = sprintf('%02d:%02d:%02d', intdiv($total, 3600), intdiv($total % 3600, 60), $total % 60);
$btn = 'font-mono text-[0.625rem] tracking-[0.14em] uppercase';
?>
<div data-ts-preparing class="grid min-h-svh place-items-center bg-ink">
  <p class="eyebrow" role="status">Preparing your paper…</p>
</div>

<div data-ts-console hidden data-test-id="<?= e($testId) ?>" data-result-href="<?= e(url(route_result($slug, $testId))) ?>" class="flex min-h-svh flex-col overflow-x-clip bg-ink">
  <script type="application/json" data-ts-paper><?= json_script($paper) ?></script>
  <header class="sticky top-0 z-30 border-b border-[var(--line-d)] bg-ink/95 backdrop-blur pt-[env(safe-area-inset-top)]">
    <div class="flex items-center justify-between gap-4 px-[var(--gutter)] py-2.5">
      <div class="flex min-w-0 items-center gap-3.5">
        <?= logo(40, 'size-9 shrink-0', true) ?>
        <div class="min-w-0">
          <p class="truncate font-display text-lg leading-tight"><?= e($test['title']) ?></p>
          <p class="truncate font-mono text-[0.5625rem] tracking-[0.14em] text-mute-d uppercase"><?= e($series['name']) ?></p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <a href="<?= e(url(route_series($slug))) ?>" class="hidden font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase hover:text-ivory sm:block">Save &amp; exit</a>
        <div role="timer" data-ts-timer aria-label="Time remaining <?= intdiv($total, 60) ?> minutes <?= $total % 60 ?> seconds" class="flex items-center gap-2 border px-3 py-2 font-mono text-lg tabular-nums sm:text-xl border-[var(--hair)] text-ivory">
          <svg viewBox="0 0 24 24" aria-hidden="true" class="size-4"><circle cx="12" cy="13" r="8.5" fill="none" stroke="currentColor"></circle><path d="M12 13V8.5M10 2.5h4" stroke="currentColor" fill="none"></path></svg>
          <span data-ts-clock><?= $clock ?></span>
        </div>
        <button type="button" data-ts-sheet-open class="border border-[var(--hair)] px-3 py-2.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase lg:hidden" aria-haspopup="dialog">Sheet 0/<?= $n ?></button>
      </div>
    </div>
    <div class="h-0.5 bg-ivory/5" aria-hidden="true">
      <div data-ts-progress class="h-full bg-ivory/60 transition-[width] duration-1000 ease-linear" style="width:100%"></div>
    </div>
  </header>

  <div class="flex flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_21rem]">
    <main id="main" class="flex min-w-0 flex-1 flex-col">
      <div class="mx-auto w-full max-w-3xl flex-1 px-[var(--gutter)] py-[clamp(1.75rem,4vw,3rem)]">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="font-mono text-[0.6875rem] tracking-[0.14em] text-mute-d uppercase">Question <span data-ts-qnum class="text-ivory tabular-nums">01</span> of <?= $n ?></p>
          <p data-ts-subject class="font-mono text-[0.625rem] tracking-[0.14em] text-ivory uppercase"><?= e($q['subject']) ?></p>
        </div>
        <div class="mt-3 h-px bg-[var(--line-d)]"></div>
        <fieldset class="mt-7">
          <legend class="contents">
            <h1 data-ts-question tabindex="-1" class="font-display text-[clamp(1.5rem,2.6vw,2.15rem)] leading-snug font-normal outline-none"><?= e($q['text']) ?></h1>
          </legend>
          <div data-ts-options class="mt-8 grid gap-3">
            <?php foreach ($q['options'] as $k => $o): ?>
              <label class="flex cursor-pointer items-center gap-4 border px-4 py-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ivory border-[var(--line-d)] hover:border-ivory/35">
                <input type="radio" name="q-<?= e($q['id']) ?>" class="sr-only">
                <span aria-hidden="true" class="grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[0.6875rem] border-mute-d text-mute-d"><?= chr(65 + $k) ?></span>
                <span class="font-display text-[1.3rem] leading-snug"><?= e($o) ?></span>
              </label>
            <?php endforeach; ?>
          </div>
        </fieldset>
        <p class="mt-5 flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.12em] text-mute-d uppercase" aria-live="polite">
          <span aria-hidden="true" class="size-1.5 rounded-full bg-ok"></span>Saved on this device
        </p>
      </div>

      <div class="sticky bottom-0 border-t border-[var(--line-d)] bg-charcoal/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div class="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2.5 px-[var(--gutter)] py-3">
          <div class="flex flex-wrap gap-2">
            <button type="button" data-ts-mark class="border border-mark/60 px-3.5 py-2.5 <?= $btn ?> text-mark transition-colors hover:bg-mark/10">Mark for review<?= $n > 1 ? ' &amp; next' : '' ?></button>
            <button type="button" data-ts-clear disabled class="border border-[var(--line-d)] px-3.5 py-2.5 <?= $btn ?> transition-colors enabled:hover:border-ivory/40 disabled:text-mute-d/60">Clear</button>
          </div>
          <div class="flex gap-2">
            <button type="button" data-ts-prev disabled class="border border-[var(--line-d)] px-3.5 py-2.5 <?= $btn ?> enabled:hover:border-ivory/40 disabled:text-mute-d/60">← Prev</button>
            <button type="button" data-ts-next<?= $n > 1 ? '' : ' hidden' ?> class="border border-ivory bg-ivory px-4 py-2.5 font-mono text-[0.625rem] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:bg-transparent hover:text-ivory">Save &amp; next →</button>
            <button type="button" data-ts-submit-last<?= $n > 1 ? ' hidden' : '' ?> class="border border-ivory bg-ivory px-4 py-2.5 font-mono text-[0.625rem] font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:bg-transparent hover:text-ivory">Submit</button>
          </div>
        </div>
      </div>
    </main>

    <aside aria-label="Answer sheet" class="hidden border-l border-[var(--line-d)] bg-charcoal p-6 lg:block">
      <div class="sticky top-24"><?php partial('components/testseries/answer-sheet', ['paper' => $paper]) ?></div>
    </aside>
  </div>

  <div data-ts-sheet-dialog hidden role="dialog" aria-modal="true" aria-label="Answer sheet" class="fixed inset-0 z-50 flex justify-end bg-ink/70 lg:hidden">
    <div data-ts-sheet-panel class="h-full w-[min(22rem,88vw)] overflow-y-auto bg-charcoal p-6">
      <button type="button" data-ts-sheet-close class="eyebrow mb-5 hover:text-ivory">Close ✕</button>
      <?php partial('components/testseries/answer-sheet', ['paper' => $paper]) ?>
    </div>
  </div>

  <div data-ts-confirm hidden class="fixed inset-0 z-[60] grid place-items-center bg-ink/80 p-4 backdrop-blur-sm">
    <div data-ts-confirm-dialog role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc" class="w-full max-w-md border border-[var(--hair)] bg-charcoal p-6">
      <h2 id="confirm-title" class="text-[2rem] leading-tight">Submit the test?</h2>
      <p id="confirm-desc" class="mt-2 text-sm text-body-d">You cannot change answers after submitting. <span data-ts-confirm-clock><?= $clock ?></span> remains on the clock.</p>
      <dl class="mt-5 grid grid-cols-3 border-t border-l border-[var(--line-d)] text-center">
        <?php foreach ([['answered', 'Answered', 0], ['marked', 'Marked', 0], ['unanswered', 'Not answered', $n]] as [$id, $k, $v]): ?>
          <div class="border-r border-b border-[var(--line-d)] p-3">
            <dt class="font-mono text-[0.5625rem] tracking-[0.12em] text-mute-d uppercase"><?= e($k) ?></dt>
            <dd data-ts-confirm-count="<?= $id ?>" class="mt-1 font-display text-3xl tabular-nums"><?= $v ?></dd>
          </div>
        <?php endforeach; ?>
      </dl>
      <div class="mt-6 flex flex-wrap justify-end gap-2.5">
        <button type="button" data-ts-confirm-back class="border border-[var(--line-d)] px-4 py-3 font-mono text-[0.6875rem] tracking-[0.14em] uppercase hover:border-ivory/40">Back to test</button>
        <button type="button" data-ts-confirm-submit class="border border-ivory bg-ivory px-4 py-3 font-mono text-[0.6875rem] font-medium tracking-[0.14em] text-ink uppercase hover:bg-transparent hover:text-ivory">Submit now</button>
      </div>
    </div>
  </div>
</div>
