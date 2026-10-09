<?php
/**
 * One exam drawn as a transit line (the original ExamLine): a fine ivory rule with a station per stage,
 * ending at the destination star. Horizontal from md up, vertical on phones.
 * @var array $stages  @var string $label
 */
?>
<ol aria-label="<?= e($label) ?> stages, in order" style="--stops:<?= count($stages) + 1 ?>" class="exam-line grid gap-7 md:grid-cols-[repeat(var(--stops),minmax(0,1fr))] md:gap-4">
  <?php foreach (array_values($stages) as $i => $s): ?>
    <li class="relative grid content-start gap-2 pl-9 md:pt-9 md:pl-0">
      <span aria-hidden="true" class="exam-line__seg absolute top-3.5 -bottom-7 left-[0.4375rem] w-px bg-ivory/55 md:top-[0.4375rem] md:right-[-1rem] md:bottom-auto md:left-3.5 md:h-px md:w-auto"></span>
      <span aria-hidden="true" class="absolute top-0 left-0 size-3.5 rounded-full border border-ivory bg-ink"></span>
      <span class="font-mono text-[0.625rem] tracking-[0.16em] text-mute-d tabular-nums">STOP <?= pad2($i + 1) ?></span>
      <span class="max-w-[18ch] font-mono text-[0.8125rem] leading-snug tracking-[0.1em] text-ivory uppercase"><?= e($s) ?></span>
    </li>
  <?php endforeach; ?>
  <li class="relative grid content-start gap-2 pl-9 md:pt-9 md:pl-0">
    <?= star('absolute -top-[0.1875rem] -left-[0.1875rem] size-5') ?>
    <span class="font-mono text-[0.625rem] tracking-[0.16em] text-mute-d">TERMINUS</span>
    <span class="font-display text-[1.375rem] leading-tight text-ivory italic">Destination</span>
  </li>
</ol>
