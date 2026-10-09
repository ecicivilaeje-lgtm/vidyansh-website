<?php
/**
 * Numbered module list (the original SyllabusList). Each subject is a native disclosure that opens onto its topics.
 * @var array $modules
 */
?>
<ol class="border-t border-ink">
  <?php foreach ($modules as $i => $m): ?>
    <li class="border-b border-[var(--line-l)]">
      <details class="group">
        <summary class="grid cursor-pointer list-none grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 py-5 md:grid-cols-[3rem_minmax(0,1fr)_12rem_auto] [&::-webkit-details-marker]:hidden">
          <span class="font-mono text-xs tracking-[0.12em] text-mute-l tabular-nums">M<?= pad2($i + 1) ?></span>
          <span class="font-display text-[clamp(1.375rem,2.2vw,1.875rem)] leading-tight transition-[font-style] group-hover:italic group-open:italic"><?= e($m['subject'] ?? '') ?></span>
          <?php if (!empty($m['stage'])): ?>
            <span class="font-mono text-[0.6875rem] tracking-[0.14em] text-mute-l uppercase max-md:col-start-2 max-md:row-start-2"><?= e($m['stage']) ?></span>
          <?php else: ?>
            <span class="max-md:hidden"></span>
          <?php endif; ?>
          <span aria-hidden="true" class="relative size-3 self-center max-md:col-start-3 max-md:row-start-1">
            <span class="absolute inset-x-0 top-1/2 h-px bg-ink"></span>
            <span class="absolute inset-y-0 left-1/2 w-px bg-ink transition-transform duration-300 group-open:scale-y-0"></span>
          </span>
        </summary>
        <ul class="grid gap-x-8 gap-y-2 pb-6 pl-[calc(2.5rem+1rem)] sm:grid-cols-2 md:pl-[calc(3rem+1rem)]">
          <?php foreach ($m['topics'] ?? [] as $t): ?>
            <li class="flex items-baseline gap-3 text-[1rem] text-mute-l"><span aria-hidden="true" class="inline-block h-px w-3 shrink-0 -translate-y-[0.3em] bg-mute-l"></span><?= e($t) ?></li>
          <?php endforeach; ?>
        </ul>
      </details>
    </li>
  <?php endforeach; ?>
</ol>
