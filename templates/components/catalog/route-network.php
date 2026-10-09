<?php
/**
 * The masthead drawing (the original RouteNetwork): one line per exam, each with its own stations,
 * all converging on a single terminus. Decorative; the real content is the list below.
 * @var array $exams
 */
$W = 1200;
$H = 440;
$ty = $H / 2;
$gap = 340 / max(count($exams) - 1, 1);
$n = 'catalog_num';
?>
<svg viewBox="0 0 <?= $W ?> <?= $H ?>" aria-hidden="true" class="route-network h-auto w-full overflow-visible text-ivory">
  <g fill="none" stroke="currentColor" stroke-linecap="round">
    <path d="M0 <?= $n($ty) ?>H<?= $W ?>" stroke-width="0.75" stroke-dasharray="14 4 2 4" opacity="0.18"></path>
    <path d="M640 20V420M980 20V420" stroke-width="0.75" stroke-dasharray="2 6" opacity="0.18"></path>
    <?php foreach ($exams as $i => $e):
        $y = $n(50 + $i * $gap);
        $stations = count($e['stages'] ?? [0, 0, 0]) - 1;
        $step = 520 / max($stations, 1); ?>
      <g>
        <path pathLength="1" class="route-network__line" d="M60 <?= $y ?>H600C760 <?= $y ?> 820 <?= $n($ty) ?> 980 <?= $n($ty) ?>" stroke-width="1.2" opacity="0.75"></path>
        <?php for ($k = 0; $k <= $stations; $k++): ?>
          <circle cx="<?= $n(80 + $k * $step) ?>" cy="<?= $y ?>" r="5" fill="var(--color-ink)" stroke-width="1.2" opacity="0.9"></circle>
        <?php endfor; ?>
      </g>
    <?php endforeach; ?>
    <path d="M980 <?= $n($ty) ?>H1140" stroke-width="1.6"></path>
    <circle cx="1140" cy="<?= $n($ty) ?>" r="22" stroke-width="0.75" opacity="0.35"></circle>
    <circle cx="1140" cy="<?= $n($ty) ?>" r="40" stroke-width="0.75" stroke-dasharray="2 5" opacity="0.25"></circle>
  </g>
  <path d="M1140 <?= $n($ty - 14) ?> L1142.2 <?= $n($ty - 2.2) ?> L1154 <?= $n($ty) ?> L1142.2 <?= $n($ty + 2.2) ?> L1140 <?= $n($ty + 14) ?> L1137.8 <?= $n($ty + 2.2) ?> L1126 <?= $n($ty) ?> L1137.8 <?= $n($ty - 2.2) ?>Z" fill="var(--color-gold)"></path>
  <g class="max-md:hidden" fill="currentColor" font-family="var(--font-mono), monospace" font-size="12" letter-spacing="2.2">
    <?php foreach ($exams as $i => $e): ?>
      <text x="60" y="<?= $n(50 + $i * $gap - 16) ?>" opacity="0.7"><?= e('L' . ($i + 1) . ' · ' . mb_strtoupper($e['name'] ?? '')) ?></text>
    <?php endforeach; ?>
    <text x="1140" y="<?= $n($ty + 66) ?>" text-anchor="middle" opacity="0.7">DESTINATION</text>
  </g>
</svg>
