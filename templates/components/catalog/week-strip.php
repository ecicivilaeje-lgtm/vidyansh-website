<?php
/**
 * Seven days on one line (the original WeekStrip): a horizontal timeline on wide screens (xl), a vertical one on phones.
 * @var array $week
 */
$last = count($week) - 1;
?>
<ol class="grid xl:grid-cols-7">
  <?php foreach (array_values($week) as $i => $d): ?>
    <li class="relative grid content-start gap-2 border-l border-ink pb-7 pl-6 xl:border-t xl:border-l-0 xl:pt-7 xl:pr-4 xl:pb-0 xl:pl-0">
      <span aria-hidden="true" class="<?= e(cls('absolute top-1.5 -left-[4.5px] size-2 rotate-45 border border-ink xl:-top-[4.5px] xl:left-0', $i === $last ? 'bg-ivory' : 'bg-ink')) ?>"></span>
      <span class="font-mono text-xs tracking-[0.14em] text-mute-l uppercase"><?= e($d['day'] ?? '') ?></span>
      <span class="font-display text-[1.5rem] leading-tight xl:text-[1.375rem]"><?= e($d['focus'] ?? '') ?></span>
      <span class="text-[0.9375rem] leading-snug text-mute-l"><?= e($d['note'] ?? '') ?></span>
    </li>
  <?php endforeach; ?>
</ol>
