<?php
/**
 * The answer sheet of the examination console: palette, legend and submit. Printed twice (the
 * desktop side panel and the mobile dialog); assets/js/testseries-console.js keeps both in step.
 * Initial state: question 1 visited and current, nothing answered.
 * @var array $paper
 */
$n = count($paper['questions'] ?? []);
$base = 'grid aspect-square w-full place-items-center rounded-full border font-mono text-[0.6875rem] tabular-nums transition-shadow';
?>
<div class="grid content-start gap-5">
  <div class="flex items-center justify-between">
    <h2 class="eyebrow text-ivory">Answer sheet</h2>
    <span class="font-mono text-[0.6875rem] text-mute-d tabular-nums"><span data-ts-answered>0</span> / <?= $n ?> answered</span>
  </div>
  <ol class="grid grid-cols-5 gap-2.5">
    <?php foreach ($paper['questions'] ?? [] as $k => $q): $current = $k === 0; ?>
      <li>
        <button type="button" data-ts-cell="<?= $k ?>"<?= $current ? ' aria-current="step"' : '' ?> aria-label="Question <?= $k + 1 ?>, <?= $current ? 'visited, not answered' : 'not seen' ?>"
          class="<?= e(cls($base, $current ? 'border-mute-d bg-ivory/15 text-ivory' : 'border-mute-d/70 text-mute-d', $current ? 'ring-2 ring-ivory ring-offset-2 ring-offset-charcoal' : 'hover:ring-1 hover:ring-ivory/40')) ?>"><?= $k + 1 ?></button>
      </li>
    <?php endforeach; ?>
  </ol>
  <ul class="grid gap-2 border-t border-[var(--line-d)] pt-4 text-[0.75rem] text-body-d">
    <?php foreach ([
        ['answered', 'Answered', 'border-ok bg-ok text-ink', 0],
        ['marked-answered', 'Answered, marked', 'border-mark bg-mark text-ink', 0],
        ['marked', 'Marked for review', 'border-mark text-mark', 0],
        ['visited', 'Not answered', 'border-mute-d bg-ivory/15 text-ivory', $n ? 1 : 0],
        ['unseen', 'Not seen', 'border-mute-d/70 text-mute-d', max(0, $n - 1)],
    ] as [$c, $label, $style, $count]): ?>
      <li class="flex items-center justify-between gap-3">
        <span class="flex items-center gap-2.5"><span aria-hidden="true" class="size-3.5 rounded-full border <?= $style ?>"></span><?= e($label) ?></span>
        <span class="font-mono tabular-nums" data-ts-count="<?= $c ?>"><?= $count ?></span>
      </li>
    <?php endforeach; ?>
  </ul>
  <button type="button" data-ts-confirm-open class="border border-ivory px-4 py-3.5 font-mono text-[0.6875rem] font-medium tracking-[0.17em] uppercase transition-colors hover:bg-ivory hover:text-ink">Submit test</button>
</div>
