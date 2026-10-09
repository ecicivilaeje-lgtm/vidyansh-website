<?php
/**
 * A recorded lecture's thumbnail until real video posters exist (the original LecturePoster):
 * a small drafting plate in fine ivory line, one diagram per lecture. Decorative.
 * @var string $kind  beam|bernoulli|circuit|truss|phasor|mohr  @var string $no
 */
$L = 'style="font-family:var(--font-display), serif;font-style:italic;font-size:13px;fill:currentColor;stroke:none"';
?>
<svg viewBox="0 0 240 150" aria-hidden="true" class="plate-drawing block size-full text-ivory">
  <rect x="0.5" y="0.5" width="239" height="149" fill="#ece5d7" stroke="currentColor" stroke-opacity="0.22"></rect>
  <path d="M120 0.5v6M120 143.5v6M0.5 75h6M233.5 75h6" stroke="currentColor" stroke-opacity="0.3"></path>
  <g fill="none" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.85">
    <?php if ($kind === 'beam'): ?>
      <path pathLength="1" d="M40 58h160" stroke-width="1.4"></path>
      <path pathLength="1" d="M40 58l-7 11h14zM200 58l-7 11h14zM193 73h14"></path>
      <?php foreach ([52, 68, 84, 100, 116, 132, 148, 164, 180] as $x): ?>
        <path d="M0 0v9m-2.5 -3 2.5 3 2.5 -3" transform="translate(<?= $x ?> 44)"></path>
      <?php endforeach; ?>
      <path d="M40 42h160" stroke-opacity="0.5"></path>
      <path pathLength="1" d="M40 92 Q120 142 200 92"></path>
      <path d="M40 92h160" stroke-opacity="0.35" stroke-dasharray="2 3"></path>
      <text x="120" y="38" text-anchor="middle" <?= $L ?>>w</text>
      <text x="122" y="134" text-anchor="middle" <?= $L ?>>wL²/8</text>
    <?php elseif ($kind === 'bernoulli'): ?>
      <path pathLength="1" d="M30 52h60c20 0 30 14 50 14h70M30 98h60c20 0 30-14 50-14h70" stroke-width="1.2"></path>
      <path d="M60 52v-22M170 66v-24"></path>
      <path d="M57 38h6M167 50h6" stroke-opacity="0.6"></path>
      <path d="M40 75h12m-4-3 4 3-4 3M180 75h12m-4-3 4 3-4 3"></path>
      <text x="120" y="126" text-anchor="middle" <?= $L ?>>p + ½ρv² + ρgz = const</text>
    <?php elseif ($kind === 'circuit'): ?>
      <path pathLength="1" d="M50 40h28l4-7 8 14 8-14 8 14 4-7h20"></path>
      <path pathLength="1" d="M130 40c4 0 4-8 9-8s5 8 9 8c4 0 4-8 9-8s5 8 9 8h24v26M190 74v36H50V80"></path>
      <path d="M182 66h16M182 74h16" stroke-width="1.4"></path>
      <circle cx="50" cy="72" r="8"></circle>
      <path d="M45 72c2-4 4-4 5 0s3 4 5 0"></path>
      <path d="M50 40v24"></path>
      <text x="94" y="28" text-anchor="middle" <?= $L ?>>R</text>
      <text x="148" y="28" text-anchor="middle" <?= $L ?>>L</text>
      <text x="206" y="74" <?= $L ?>>C</text>
    <?php elseif ($kind === 'truss'): ?>
      <path pathLength="1" d="M36 104h168M36 104l42-56h84l42 56M78 48l42 56 42-56M78 48v56M162 48v56"></path>
      <path d="M36 104l-7 11h14zM204 104l-7 11h14z"></path>
      <?php foreach ([[36, 104], [78, 48], [120, 104], [162, 48], [204, 104], [78, 104], [162, 104]] as [$x, $y]): ?>
        <circle cx="<?= $x ?>" cy="<?= $y ?>" r="2.2" fill="#ece5d7"></circle>
      <?php endforeach; ?>
      <path d="M120 22v18m-3-5 3 5 3-5"></path>
      <text x="128" y="32" <?= $L ?>>P</text>
    <?php elseif ($kind === 'phasor'): ?>
      <path d="M50 110h150M70 130V24" stroke-opacity="0.4"></path>
      <path pathLength="1" d="M70 110l120-24" stroke-width="1.3"></path>
      <path pathLength="1" d="M70 110l60-66" stroke-width="1.3"></path>
      <path d="M190 86l-8-1m8 1-6 5M130 44l-7 3m7-3-1 8"></path>
      <path d="M104 103a34 34 0 0 0-6-22" stroke-opacity="0.7"></path>
      <text x="194" y="84" <?= $L ?>>V</text>
      <text x="134" y="42" <?= $L ?>>I</text>
      <text x="108" y="94" <?= $L ?>>φ</text>
    <?php elseif ($kind === 'mohr'): ?>
      <path d="M28 80h190M60 128V24" stroke-opacity="0.4"></path>
      <circle pathLength="1" cx="130" cy="80" r="42"></circle>
      <path pathLength="1" d="M100 50l60 60" stroke-width="1.2"></path>
      <circle cx="100" cy="50" r="2.2" fill="#ece5d7"></circle>
      <circle cx="160" cy="110" r="2.2" fill="#ece5d7"></circle>
      <text x="212" y="94" <?= $L ?>>σ</text>
      <text x="46" y="32" <?= $L ?>>τ</text>
    <?php endif; ?>
  </g>
  <g font-family="var(--font-mono), monospace" font-size="6.5" letter-spacing="1.3" fill="currentColor">
    <text x="12" y="16" opacity="0.6">LECTURE <?= e($no) ?></text>
    <text x="228" y="140" text-anchor="end" opacity="0.6">REC · —:—</text>
  </g>
</svg>
