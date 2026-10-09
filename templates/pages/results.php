<?php
/** Results: the arrivals hall, stories set like magazine features, and the consent note. */
page_meta([
    'title' => 'Results · Vidyansh',
    'description' => "Vidyansh students who reached their destination in SSC JE, RRB JE and State AE / JE. Every result is verified and published only with the student's consent.",
    'canonical' => '/results',
]);
page_script('catalog-results');
$board = get_results_board();
$stories = get_result_stories();
$isSample = !empty($board['isSample']);
?>
<?php /* I. The arrivals hall */ ?>
<section aria-labelledby="results-title" class="relative overflow-hidden bg-ink pt-[calc(var(--header-h)+clamp(2.5rem,6vw,5rem))] pb-[var(--space-section)]">
  <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_15%_0%,rgb(120_98_64/0.06),transparent_70%)]"></div>
  <div class="container-v relative">
    <?php /* The page opens on the board itself: a station sign, then the arrivals. */ ?>
    <div class="grid gap-8 border-b border-ivory/40 pb-8">
      <h1 id="results-title" class="results-sign leading-none"><span class="sr-only">Results: </span><?= catalog_flap_text('Arrivals') ?></h1>
      <p class="max-w-[44ch] text-[1.1875rem] text-body-d">Students who reached the destination they prepared for. Choose a year and an exam, and the board turns over.</p>
    </div>

    <div class="mt-12">
      <?php partial('components/catalog/arrivals-board', ['board' => $board]) ?>
      <?php if ($isSample): ?>
        <p class="eyebrow mt-8 max-w-[64ch] leading-relaxed">Sample board · names, towns and ranks appear here only once each result is verified and the student agrees</p>
      <?php endif; ?>
    </div>
  </div>
</section>

<?php /* II. Stories, set like magazine features */ ?>
<section aria-labelledby="stories-title" class="scene-sheet on-light bg-ivory py-[var(--space-section)] text-ink">
  <div class="container-v">
    <div class="grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
      <div>
        <p class="eyebrow">Stories</p>
        <h2 id="stories-title" class="settle mt-5 text-[clamp(3.5rem,9vw,9.5rem)] leading-[0.86] tracking-[-0.035em]">In their own <em class="font-normal">words</em></h2>
      </div>
      <p class="max-w-[30ch] text-mute-l md:pb-3">One student at a time, with a portrait and the road they took.</p>
    </div>

    <div class="mt-[var(--space-block)] grid gap-[var(--space-section)]">
      <?php foreach ($stories as $i => $s) partial('components/catalog/story-spread', ['story' => $s['story'], 'feature' => $s['feature'], 'index' => $i, 'isSample' => $isSample]) ?>
    </div>
  </div>
</section>

<?php /* III. Consent and verification */ ?>
<section aria-labelledby="consent-title" class="scene-surface bg-ink py-[var(--space-section)]">
  <div class="container-v grid gap-12 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-[clamp(2rem,6vw,7rem)]">
    <?= star('size-10 lg:mt-6') ?>
    <div>
      <h2 id="consent-title" class="settle max-w-[18ch] text-[clamp(2.75rem,6vw,6.25rem)] leading-[0.92] tracking-[-0.025em]">Every result here is verified and published with the student’s <em class="font-normal">consent.</em></h2>
      <div class="mt-12 grid gap-10 border-t border-[var(--line-d)] pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <p class="max-w-[52ch] text-body-d">We check each selection against the official result before it appears on the board. Students choose what is shown: their name, their town, their words. Until then, the board stays a sample.</p>
        <a href="<?= e(url('/contact')) ?>" class="group inline-flex items-baseline gap-3 font-display text-[clamp(1.75rem,2.6vw,2.4rem)] leading-none">
          <span class="link-underline">Selected? <em class="font-normal">Tell us.</em></span>
          <?= catalog_arrow('group-hover:translate-x-2') ?>
        </a>
      </div>
    </div>
  </div>
</section>
