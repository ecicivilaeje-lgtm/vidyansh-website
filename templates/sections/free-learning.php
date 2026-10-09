<?php
/** Free learning laid out like the front page of a study journal: ticker, lead story, index, question of the day. */
$fl = content('free-learning');
$notices = $fl['notices'] ?? [];
$resources = $fl['freeResources'] ?? [];
$q = $fl['dailyQuestion'] ?? ['prompt' => '', 'options' => [], 'explanation' => ''];
$answer = null;
foreach ($q['options'] ?? [] as $o) if (!empty($o['correct'])) { $answer = $o; break; }
$posts = get_blog_posts();
$lead = $posts[0] ?? null;
?>
<section id="free-learning" aria-labelledby="free-title" class="scene-sheet on-light bg-ivory text-ink">
  <div class="ticker overflow-hidden border-y border-[var(--line-l)] bg-ink py-3 text-ivory" aria-label="Latest notices">
    <ul class="ticker-run flex w-max gap-12 pl-12">
      <?php foreach (array_merge($notices, $notices) as $i => $n): ?>
        <li aria-hidden="<?= $i >= count($notices) ? 'true' : 'false' ?>" class="flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.14em] whitespace-nowrap uppercase">
          <span class="text-ivory"><?= e($n['tag'] ?? '') ?></span>
          <span class="text-mute-d"><?= e($n['text'] ?? '') ?></span>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>

  <div class="container-v py-[var(--space-section)]">
    <?= chapter_mark('VII', 'Free learning', null, 'mb-[var(--space-block)]') ?>
    <div class="flex flex-wrap items-end justify-between gap-6 pb-8">
      <h2 id="free-title" class="settle text-[clamp(3.75rem,8.4vw,9rem)] leading-[0.86] tracking-[-0.03em]">Free <em class="font-normal">learning</em></h2>
      <p class="eyebrow">Open to every aspirant · no sign-up needed</p>
    </div>

    <div class="grid gap-16 border-t border-ink pt-12 lg:grid-cols-[1.35fr_1fr] lg:gap-[clamp(3rem,6vw,7rem)]">
      <article class="grid content-start gap-6">
        <svg viewBox="0 0 390 182" class="w-full max-w-[38rem]" role="img" aria-label="A 90-day plan drawn as a calendar, ending at the exam day">
          <?php for ($i = 0; $i < 90; $i++):
            $col = $i % 15; $row = intdiv($i, 15);
            $mock = $i % 7 === 6; $last = $i === 89; $revise = $i >= 70 && !$mock && !$last;
            $fill = $last ? '#c8902f' : ($mock ? '#070706' : ($revise ? 'rgb(7 7 6 / 0.18)' : 'none')); ?>
            <rect x="<?= 20 + $col * 23.5 ?>" y="<?= 18 + $row * 23.5 ?>" width="17" height="17" fill="<?= $fill ?>" stroke="<?= $last ? '#8f6116' : 'rgb(7 7 6 / 0.25)' ?>"></rect>
          <?php endfor; ?>
          <text x="20" y="13" font-family="var(--font-mono)" font-size="7" letter-spacing="1.4" fill="#5a5248">DAY 1</text>
          <text x="370" y="13" text-anchor="end" font-family="var(--font-mono)" font-size="7" letter-spacing="1.4" fill="#070706">PAPER</text>
        </svg>
        <?php if ($lead): ?>
          <p class="eyebrow">From the journal · <?= e($lead['category'] ?? '') ?></p>
          <h3 class="font-display text-[clamp(2.4rem,4.4vw,4.25rem)] leading-[1] text-balance"><a href="<?= e(url('/blog/' . $lead['slug'])) ?>" class="link-underline"><?= e($lead['title'] ?? '') ?></a></h3>
          <p class="max-w-[56ch] text-mute-l"><?= e($lead['description'] ?? '') ?></p>
          <p class="font-hand text-[1.75rem] text-ink/75">By <?= e($lead['author'] ?? '') ?></p>
          <div class="mt-4 flex flex-wrap gap-3">
            <?= button('Read the guide', ['href' => '/blog/' . $lead['slug'], 'tone' => 'light', 'diamond' => true]) ?>
            <?= button('All exam guides', ['href' => '/blog', 'tone' => 'light', 'variant' => 'ghost']) ?>
          </div>
        <?php endif; ?>
      </article>

      <div class="grid content-start gap-12">
        <div>
          <p class="eyebrow border-b border-[var(--line-l)] pb-3">Index</p>
          <ul>
            <?php foreach ($resources as $r): ?>
              <li>
                <a href="<?= e(url($r['href'] ?? '/')) ?>" class="group grid grid-cols-[4rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-[var(--line-l)] py-5 transition-colors hover:text-mute-l">
                  <span class="font-mono text-[0.625rem] tracking-[0.14em] text-mute-l uppercase"><?= e($r['type'] ?? '') ?></span>
                  <span class="font-display text-[1.5rem] leading-tight"><?= e($r['title'] ?? '') ?></span>
                  <span class="font-mono text-[0.6875rem] whitespace-nowrap text-mute-l"><?= e($r['meta'] ?? '') ?></span>
                </a>
              </li>
            <?php endforeach; ?>
          </ul>
        </div>

        <fieldset class="border-t border-ink pt-5" data-daily-question>
          <legend class="eyebrow float-left mb-4 w-full">Question of the day</legend>
          <p class="clear-both font-display text-[1.5rem] leading-snug"><?= e($q['prompt'] ?? '') ?></p>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <?php foreach ($q['options'] ?? [] as $o): ?>
              <button type="button" aria-pressed="false" data-option="<?= e($o['key']) ?>" data-correct="<?= !empty($o['correct']) ? 'true' : 'false' ?>" class="flex items-center gap-2.5 border px-3 py-2.5 text-left font-display text-base transition-colors disabled:cursor-default border-[var(--line-l)] enabled:hover:border-ink">
                <span class="font-mono text-[0.6875rem] text-mute-l"><?= e($o['key']) ?></span><?= e($o['text']) ?>
              </button>
            <?php endforeach; ?>
          </div>
          <div aria-live="polite" class="mt-4 text-sm text-mute-l" data-daily-feedback data-answer="<?= e($answer['key'] ?? '') ?>" data-explanation="<?= e($q['explanation'] ?? '') ?>"></div>
        </fieldset>
      </div>
    </div>
  </div>
</section>
