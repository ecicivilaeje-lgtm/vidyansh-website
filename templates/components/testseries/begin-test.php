<?php
/**
 * The readiness declaration and start button (the original BeginTest). Offers to resume if an
 * attempt is already saved on this device (assets/js/testseries-begin.js).
 * @var string $slug  @var string $testId  @var array $languages
 */
page_script('testseries-attempt');
page_script('testseries-begin');
?>
<div class="grid gap-5" data-ts-begin data-test-id="<?= e($testId) ?>" data-attempt-href="<?= e(url(route_attempt($slug, $testId))) ?>">
  <label class="grid gap-2">
    <span class="eyebrow">Language</span>
    <select class="border-b border-ink/30 bg-transparent py-2 font-display text-xl outline-none focus:border-ink">
      <?php foreach ($languages as $i => $l): ?><option<?= $i === 0 ? ' selected' : '' ?>><?= e($l) ?></option><?php endforeach; ?>
    </select>
  </label>

  <p data-ts-saved="in_progress" hidden class="border-l-2 border-ink bg-ink/5 px-3 py-2 text-sm">You have an unfinished attempt saved on this device. Beginning will resume it where you left off.</p>
  <p data-ts-saved="submitted" hidden class="border-l-2 border-ink bg-ink/5 px-3 py-2 text-sm">
    You have already submitted this test. <a href="<?= e(url(route_result($slug, $testId))) ?>" class="underline underline-offset-4">See your result</a> or begin again for a fresh attempt.
  </p>

  <label class="flex cursor-pointer items-start gap-3 text-[0.9375rem]">
    <input type="checkbox" data-ts-ready class="mt-1 size-4 shrink-0 accent-[#070706]">
    <span>I have read the instructions. I will not refresh or close the window during the test, and I understand the timer will not stop once I begin.</span>
  </label>

  <button type="button" data-ts-start disabled class="inline-flex items-center justify-center gap-3 border border-ink bg-ink px-6 py-4 font-mono text-[0.75rem] font-medium tracking-[0.17em] text-ivory uppercase transition-colors enabled:hover:bg-transparent enabled:hover:text-ink disabled:cursor-not-allowed disabled:border-ink/20 disabled:bg-ink/10 disabled:text-mute-l">I am ready, begin</button>
</div>
