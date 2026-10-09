<?php
/** ACHIEVE: results as an open arrivals ledger, then one story told large. Sample content is labelled as such. */
$data = $results ?? get_results();
$stories = $data['stories'] ?? [];
$lead = $stories[0] ?? null;
$rest = array_slice($stories, 1);
$isSample = !empty($data['isSample']);
?>
<section id="results" aria-labelledby="results-title" class="scene-surface relative overflow-hidden bg-ink py-[var(--space-section)]">
  <div class="container-v">
    <?= chapter_mark('VI', 'Achieve', 'Results', 'mb-[var(--space-block)]') ?>
    <h2 id="results-title" class="settle text-[clamp(4rem,11vw,12rem)] leading-[0.82] tracking-[-0.04em]">They <em class="font-normal">arrived</em></h2>

    <dl class="mt-[var(--space-block)] grid gap-10 sm:grid-cols-3">
      <?php foreach ($data['stats'] ?? [] as $s): ?>
        <div class="grid content-start gap-3 border-t border-ivory/40 pt-5">
          <dt class="order-2 max-w-[22ch] text-mute-d"><?= e($s['label']) ?></dt>
          <dd class="order-1 font-display text-[clamp(3.5rem,6vw,6rem)] leading-none tabular-nums"><?= e(or_dash($s['value'] ?? null)) ?></dd>
        </div>
      <?php endforeach; ?>
    </dl>

    <?php if ($isSample): ?><p class="eyebrow mt-10">Sample layout · verified results will be published with each student&rsquo;s consent</p><?php endif; ?>

    <div class="mt-[var(--space-block)]">
      <div class="flex flex-wrap items-baseline justify-between gap-3 border-b border-ivory/40 pb-4">
        <span class="font-display text-[clamp(1.75rem,2.6vw,2.4rem)] leading-none">Arrivals, <?= e($data['year'] ?? '') ?></span>
        <span class="eyebrow">Dream → Destination</span>
      </div>
      <table class="stack-table w-full border-collapse font-mono text-[0.8125rem]">
        <caption class="sr-only">Results board<?= $isSample ? ', sample rows' : '' ?></caption>
        <thead>
          <tr class="eyebrow text-left">
            <?php foreach (['Student', 'From', 'Destination', 'Rank'] as $h): ?>
              <th scope="col" class="border-b border-[var(--line-d)] py-3 pr-4 font-medium"><?= e($h) ?></th>
            <?php endforeach; ?>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($data['arrivals'] ?? [] as $a): ?>
            <tr class="<?= $isSample ? 'text-mute-d' : 'text-ivory' ?>">
              <td class="border-b border-[var(--line-d)] py-5 pr-4 tracking-[0.06em] uppercase"><?= e($a['student'] ?? '') ?></td>
              <td data-label="From" class="border-b border-[var(--line-d)] py-5 pr-4 tracking-[0.06em] uppercase"><?= e($a['from'] ?? '') ?></td>
              <td data-label="Destination" class="border-b border-[var(--line-d)] py-5 pr-4 tracking-[0.06em] text-body-d uppercase"><?= e($a['destination'] ?? '') ?></td>
              <td data-label="Rank" class="border-b border-[var(--line-d)] py-5 tracking-[0.06em] text-ivory uppercase"><?= e($a['rank'] ?? '') ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

    <?php if ($lead): ?>
      <figure class="mt-[var(--space-section)] grid gap-10 lg:grid-cols-[1fr_2.6fr]">
        <figcaption class="grid content-start gap-2 border-t border-ivory/40 pt-5">
          <span class="eyebrow"><?= e($lead['firstName'] ?? '') ?></span>
          <span class="text-mute-d"><?= e($lead['byline'] ?? '') ?></span>
          <span class="font-mono text-xs tracking-[0.12em] text-ivory"><?= e($lead['rank'] ?? '') ?></span>
        </figcaption>
        <?= reveal_open('blockquote') ?>
          <p class="font-display text-[clamp(2.25rem,4.6vw,4.75rem)] leading-[1.04] tracking-[-0.015em] text-balance italic">&ldquo;<?= e($lead['quote'] ?? '') ?>&rdquo;</p>
        </blockquote>
      </figure>
    <?php endif; ?>

    <?php if ($rest): ?>
      <ul class="mt-[var(--space-block)] grid gap-8 lg:ml-[calc((100%-2.5rem)/3.6+2.5rem)] lg:grid-cols-2" aria-label="More stories">
        <?php foreach ($rest as $s): ?>
          <li class="border-t border-[var(--line-d)] pt-5">
            <p class="font-display text-[1.5rem] leading-snug text-body-d italic">&ldquo;<?= e($s['quote'] ?? '') ?>&rdquo;</p>
            <p class="eyebrow mt-4"><?= e($s['byline'] ?? '') ?> · <?= e($s['rank'] ?? '') ?></p>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>

    <div class="mt-[var(--space-block)] flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--line-d)] pt-8">
      <?= button('See every arrival', ['href' => '/results', 'variant' => 'ghost']) ?>
      <a href="<?= e(url('/contact')) ?>" class="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">Selected? Tell us →</a>
    </div>
  </div>
</section>
