<?php
/**
 * The five-chapter examination journey. On large screens with motion allowed it pins and
 * steps through the chapters as you scroll (assets/js/home.js); otherwise the chapters stack.
 * Rendered here in the unpinned state, exactly as the original server render.
 */
$stages = content('journey')['journeyStages'] ?? [];
$week = content('journey')['week'] ?? ['days' => [], 'slots' => []];
$exams = content('exams')['exams'] ?? [];
$first = $exams[0] ?? ['code' => '', 'name' => '', 'descriptor' => '', 'bearing' => 0];
$chapterBg = ['bg-ink', 'bg-charcoal', 'bg-graphite', 'bg-stone text-ink on-light on-stone', 'bg-ivory text-ink on-light'];
$chapterTitle = 'mt-5 leading-[0.82] tracking-[-0.04em]';

$ticks = [];
for ($k = 0; $k < 36; $k++) {
    $a = $k * 10;
    $r1 = $a % 90 === 0 ? 160 : 170;
    $rad = (($a - 90) * M_PI) / 180;
    $ticks[] = [200 + $r1 * cos($rad), 200 + $r1 * sin($rad), 200 + 180 * cos($rad), 200 + 180 * sin($rad)];
}

$blockStyle = [
    'live' => 'bg-ivory/90 text-ink',
    'practice' => 'bg-ivory/[0.12] text-ivory border border-ivory/20',
    'notes' => 'bg-ivory/[0.12] text-ivory border border-ivory/20',
    'doubts' => 'bg-ivory/[0.12] text-ivory border border-ivory/20',
    'analysis' => 'bg-ivory/[0.12] text-ivory border border-ivory/20',
    'test' => 'bg-ivory text-ink',
    'revise' => 'text-ivory bg-[repeating-linear-gradient(135deg,rgb(7_7_6/0.14)_0_4px,transparent_4px_8px)]',
];
$blockLabel = ['live' => 'Live', 'practice' => 'Practice', 'notes' => 'Notes', 'doubts' => 'Doubts', 'analysis' => 'Analysis', 'test' => 'Weekly test', 'revise' => 'Revise'];
$points = 'M40 180 L100 172 L160 176 L220 150 L280 146 L340 120 L400 112 L460 90 L520 74 L580 56 L630 44';
$journeyData = [
    'stages' => array_map(fn($s) => ['id' => $s['id'], 'number' => $s['number']], $stages),
    'exams' => array_map(fn($e) => ['code' => $e['code'], 'name' => $e['name'], 'descriptor' => $e['descriptor'] ?? '', 'bearing' => (float) ($e['bearing'] ?? 0)], $exams),
];
?>
<section id="journey" aria-label="The examination journey" data-pinned="false" class="journey relative bg-ink" data-journey>
  <script type="application/json" data-journey-data><?= json_script($journeyData) ?></script>
  <div class="journey-stage">
    <div class="journey-sticky" data-journey-sticky>
      <nav aria-label="Journey chapters" hidden data-journey-rail class="absolute top-1/2 right-[calc(var(--gutter)*0.6)] z-10 grid -translate-y-1/2 justify-items-end">
        <?php foreach ($stages as $i => $s): ?>
          <a href="#chapter-<?= e($s['id']) ?>" data-rail-link="<?= $i ?>" class="group flex items-center gap-3 py-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase transition-colors duration-500 text-mute-d">
            <span class="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><?= e($s['title']) ?></span>
            <span aria-hidden="true" data-rail-mark class="size-[9px] rotate-45 border border-current transition-all duration-500"></span>
          </a>
        <?php endforeach; ?>
      </nav>
      <p aria-live="polite" hidden data-journey-count class="absolute bottom-7 left-[var(--gutter)] z-10 font-mono text-[0.65625rem] tracking-[0.16em] text-mute-d">Chapter <?= e($stages[0]['number'] ?? '01') ?> / 05</p>

      <?php foreach ($stages as $i => $stage): ?>
        <article id="chapter-<?= e($stage['id']) ?>" aria-labelledby="chapter-<?= e($stage['id']) ?>-title" data-active="true" class="<?= e(cls('chapter relative grid min-h-[100svh] items-center overflow-hidden px-[var(--gutter)] py-[clamp(5.5rem,10vw,8.75rem)]', $chapterBg[$i] ?? 'bg-ink')) ?>">
<?php if ($i === 0): /* ---------- 01 Dream ---------- */ ?>
          <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_78%_26%,rgb(200_144_47/0.16),transparent_70%),radial-gradient(ellipse_80%_60%_at_20%_110%,rgb(143_97_22/0.06),transparent_70%)]"></div>
          <?= star('absolute top-[18%] right-[16%] size-9 md:size-12') ?>
          <div class="chapter-inner relative mx-auto grid w-full max-w-[85rem] items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <?= home_chapter_head($stages, 0) ?>
              <h2 id="chapter-dream-title" class="<?= e("$chapterTitle text-[clamp(4.5rem,13vw,13.75rem)]") ?>">Dream</h2>
              <div class="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-3 font-display text-[clamp(1.5rem,2.4vw,2.125rem)] italic">
                <label for="exam-pick">I am preparing for</label>
                <span class="relative inline-block">
                  <select id="exam-pick" data-exam-select class="cursor-pointer appearance-none rounded-none border-0 border-b border-ivory bg-transparent py-1 pr-9 pl-0.5 font-display text-[length:inherit] font-medium text-ivory not-italic">
                    <option value="" class="bg-charcoal text-ivory" selected>choose an exam</option>
                    <?php foreach ($exams as $x): ?>
                      <option value="<?= e($x['code']) ?>" class="bg-charcoal text-ivory"><?= e($x['name']) ?></option>
                    <?php endforeach; ?>
                  </select>
                  <span aria-hidden="true" class="pointer-events-none absolute top-[45%] right-2 size-2 -translate-y-1/2 rotate-45 border-r border-b border-ivory"></span>
                </span>
              </div>
            </div>
            <div class="grid gap-4 self-end border-l border-[var(--line-d)] pl-7">
              <p class="eyebrow">Every journey starts here</p>
              <p class="max-w-[34ch] text-[0.96875rem] text-mute-d">Tell us where you are going. The courses and test series further down this page follow that one choice.</p>
            </div>
          </div>
<?php elseif ($i === 1): /* ---------- 02 Direction ---------- */ ?>
          <div class="chapter-inner relative mx-auto grid w-full max-w-[85rem] items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <?= home_chapter_head($stages, 1) ?>
              <h2 id="chapter-direction-title" class="<?= e("$chapterTitle text-[clamp(3.75rem,9vw,9.5rem)]") ?>">Direction</h2>
              <p class="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.375rem)] leading-tight text-body-d italic">Choose your examination.</p>
              <ul class="mt-8 border-t border-[var(--line-d)]" data-direction-list>
                <?php foreach ($exams as $x):
                  $selected = $first['code'] === $x['code']; ?>
                  <li>
                    <button type="button" aria-pressed="false" data-direction="<?= e($x['code']) ?>" class="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-b border-[var(--line-d)] py-4 text-left">
                      <span data-direction-name class="<?= e(cls('font-display text-[clamp(1.9rem,3.6vw,3.25rem)] leading-none transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-ivory', $selected ? 'translate-x-3 text-ivory' : 'text-mute-d')) ?>"><?= e($x['name']) ?></span>
                      <span data-direction-brg class="<?= e(cls('font-mono text-[0.6875rem] tracking-[0.14em]', $selected ? 'text-ivory' : 'text-mute-d')) ?>">BRG <?= e(str_pad((string) ($x['bearing'] ?? 0), 3, '0', STR_PAD_LEFT)) ?>°</span>
                    </button>
                  </li>
                <?php endforeach; ?>
              </ul>
            </div>
            <div class="relative mx-auto mb-16 aspect-square w-full max-w-[20rem] lg:mb-0 lg:max-w-[30rem]">
              <svg viewBox="0 0 400 400" aria-hidden="true" class="size-full overflow-visible">
                <circle cx="200" cy="200" r="180" fill="none" stroke="rgb(143 97 22 / 0.35)"></circle>
                <circle cx="200" cy="200" r="140" fill="none" stroke="rgb(143 97 22 / 0.15)" stroke-dasharray="2 6"></circle>
                <g stroke="rgb(143 97 22 / 0.4)">
                  <?php foreach ($ticks as $t): ?><line x1="<?= home_fixed1($t[0]) ?>" y1="<?= home_fixed1($t[1]) ?>" x2="<?= home_fixed1($t[2]) ?>" y2="<?= home_fixed1($t[3]) ?>"></line><?php endforeach; ?>
                </g>
                <g font-family="var(--font-mono)" font-size="11" fill="#5a5248" text-anchor="middle" letter-spacing="2">
                  <text x="200" y="10">N</text>
                  <text x="398" y="204">E</text>
                  <text x="200" y="402">S</text>
                  <text x="2" y="204">W</text>
                </g>
                <g data-compass-needle style="transform:rotate(<?= e((string) ($first['bearing'] ?? 0)) ?>deg);transform-origin:200px 200px;transition:transform 1.1s cubic-bezier(.16,1,.3,1)">
                  <path d="M200 46 L208 200 L200 214 L192 200Z" fill="#c8902f"></path>
                  <path d="M200 354 L206 200 L194 200Z" fill="rgb(7 7 6 / 0.25)"></path>
                </g>
                <circle cx="200" cy="200" r="5" fill="#f4eee2" stroke="#8f6116"></circle>
              </svg>
              <div class="absolute inset-x-0 -bottom-2 translate-y-full text-center" aria-live="polite">
                <p class="font-display text-[1.75rem] leading-none" data-compass-name><?= e($first['name']) ?></p>
                <p class="eyebrow mt-2" data-compass-descriptor><?= e($first['descriptor'] ?? '') ?></p>
              </div>
            </div>
          </div>
<?php elseif ($i === 2): /* ---------- 03 Preparation ---------- */ ?>
          <div aria-hidden="true" class="drafting-grid absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_60%_50%,#000,transparent)]"></div>
          <div class="chapter-inner relative mx-auto grid w-full max-w-[85rem] items-center gap-12 lg:grid-cols-[0.9fr_1.3fr]">
            <div>
              <?= home_chapter_head($stages, 2) ?>
              <h2 id="chapter-preparation-title" class="<?= e("$chapterTitle text-[clamp(3.25rem,8vw,8.5rem)]") ?>">Preparation</h2>
              <p class="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.375rem)] leading-tight text-body-d italic">Learn with structured guidance.</p>
              <p class="mt-4 max-w-[44ch] text-body-d">Every week has a shape: live classes with Shubham Sir, practice that follows the lesson, a test on Saturday and revision before the week closes.</p>
            </div>
            <div class="min-w-0">
              <div class="overflow-x-auto" tabindex="0" role="region" aria-label="A typical Vidyansh week, scrollable">
                <table class="w-full min-w-[32rem] border-collapse border-t border-l border-[var(--hair)] font-mono text-[0.625rem] tracking-[0.08em] uppercase">
                  <caption class="sr-only">A typical Vidyansh week</caption>
                  <thead>
                    <tr>
                      <th scope="col" class="w-16 border-r border-b border-[var(--line-d)]"><span class="sr-only">Time</span></th>
                      <?php foreach ($week['days'] ?? [] as $d): ?>
                        <th scope="col" class="border-r border-b border-[var(--line-d)] px-1 py-2.5 font-medium text-ivory"><?= e($d) ?></th>
                      <?php endforeach; ?>
                    </tr>
                  </thead>
                  <tbody>
                    <?php foreach ($week['slots'] ?? [] as $slot): ?>
                      <tr>
                        <th scope="row" class="border-r border-b border-[var(--line-d)] p-1.5 text-left font-medium text-mute-d"><?= e($slot['time']) ?></th>
                        <?php foreach (array_pad(array_values($slot['blocks'] ?? []), count($week['days'] ?? []), null) as $b): ?>
                          <td class="h-12 border-r border-b border-[var(--line-d)] p-[3px]"><?php if ($b && isset($blockStyle[$b])): ?><span class="<?= e('block h-full p-1.5 font-medium ' . $blockStyle[$b]) ?>"><?= e($blockLabel[$b]) ?></span><?php else: ?><span class="sr-only">Free</span><?php endif; ?></td>
                        <?php endforeach; ?>
                      </tr>
                    <?php endforeach; ?>
                  </tbody>
                </table>
              </div>
              <ul class="mt-4 flex flex-wrap gap-4 font-mono text-[0.65625rem] tracking-[0.12em] text-mute-d uppercase" aria-label="Legend">
                <li class="flex items-center gap-2"><span aria-hidden="true" class="h-2.5 w-3.5 bg-ivory/90"></span>Live class</li>
                <li class="flex items-center gap-2"><span aria-hidden="true" class="h-2.5 w-3.5 border border-ivory/30 bg-ivory/[0.12]"></span>Practice</li>
                <li class="flex items-center gap-2"><span aria-hidden="true" class="h-2.5 w-3.5 bg-ivory"></span>Test</li>
                <li class="flex items-center gap-2"><span aria-hidden="true" class="h-2.5 w-3.5 bg-[repeating-linear-gradient(135deg,rgb(143_97_22/0.3)_0_3px,transparent_3px_6px)]"></span>Revision</li>
              </ul>
            </div>
          </div>
<?php elseif ($i === 3): /* ---------- 04 Performance ---------- */ ?>
          <div class="chapter-inner relative mx-auto grid w-full max-w-[85rem] items-center gap-12 lg:grid-cols-[1.5fr_0.8fr]">
            <div>
              <?= home_chapter_head($stages, 3) ?>
              <h2 id="chapter-performance-title" class="<?= e("$chapterTitle text-[clamp(3.25rem,8vw,8.5rem)]") ?>">Performance</h2>
              <p class="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.375rem)] leading-tight text-mute-l italic">Practice and analyse.</p>
              <figure class="mt-6">
                <svg viewBox="0 0 640 230" class="h-auto w-full overflow-visible" role="img" aria-label="Illustration of a score line rising across a series of mock tests">
                  <g stroke="rgb(7 7 6 / 0.1)">
                    <line x1="40" y1="30" x2="630" y2="30"></line>
                    <line x1="40" y1="90" x2="630" y2="90"></line>
                    <line x1="40" y1="150" x2="630" y2="150"></line>
                  </g>
                  <line x1="40" y1="10" x2="40" y2="200" stroke="rgb(7 7 6 / 0.45)"></line>
                  <line x1="40" y1="200" x2="630" y2="200" stroke="rgb(7 7 6 / 0.45)"></line>
                  <path d="<?= $points ?> L630 200 L40 200Z" fill="rgb(7 7 6 / 0.06)"></path>
                  <path class="score-line" d="<?= $points ?>" pathLength="1" fill="none" stroke="#070706" stroke-width="1.6"></path>
                  <rect x="625" y="39" width="10" height="10" fill="#c8902f" transform="rotate(45 630 44)"></rect>
                  <g font-family="var(--font-mono)" font-size="10" letter-spacing="1" fill="#5a5248">
                    <text x="40" y="222">FIRST MOCK</text>
                    <text x="630" y="222" text-anchor="end">LATEST MOCK</text>
                  </g>
                </svg>
                <figcaption class="eyebrow mt-2">Illustration · how analysis tracks your progress</figcaption>
              </figure>
            </div>
            <div class="grid gap-5">
              <p class="eyebrow">Every mock, analysed</p>
              <p class="font-display text-[clamp(2rem,3vw,2.75rem)] leading-[1.05]">Where time went. Which topics leak marks. What to practise next.</p>
              <p class="text-mute-l">Test series with question-level analysis, rank and percentile after every attempt.</p>
              <?= button('Explore test series', ['href' => '/test-series', 'tone' => 'light', 'class' => 'justify-self-start']) ?>
            </div>
          </div>
<?php else: /* ---------- 05 Destination ---------- */ ?>
          <div class="chapter-inner relative mx-auto grid w-full max-w-[85rem] justify-items-center gap-6 text-center">
            <?= star('size-12', '#8f6116') ?>
            <?= home_chapter_head($stages, 4) ?>
            <p class="font-display text-[clamp(1.5rem,2.6vw,2.375rem)] leading-tight text-mute-l italic">Turn preparation into achievement.</p>
            <h2 id="chapter-destination-title" class="text-[clamp(3.6rem,15.4vw,16.25rem)] leading-[0.82] tracking-[-0.04em]">Destination</h2>
            <?= button('Find your course', ['href' => '/courses', 'tone' => 'light', 'diamond' => true]) ?>
          </div>
<?php endif; ?>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
