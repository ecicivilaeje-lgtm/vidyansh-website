<?php
/**
 * The lead feature on the masthead (the original FounderFeature): a tall chalkboard portrait slot
 * beside a long, multi-column profile.
 * @var array $founder
 */
$quote = catalog_quote_parts($founder['quote'] ?? []);
?>
<article aria-labelledby="founder-name" class="grid gap-12 lg:grid-cols-12 lg:gap-[clamp(2rem,4vw,4.5rem)]">
  <figure class="plate-sheet relative min-h-[34rem] overflow-hidden bg-[radial-gradient(ellipse_70%_60%_at_40%_35%,#dcd3c2,#eee8dc)] lg:col-span-5 lg:min-h-[48rem]">
    <div aria-hidden="true" class="absolute inset-0">
      <?php foreach ($founder['chalk'] ?? [] as $c): ?>
        <span class="<?= e(cls('absolute font-hand whitespace-nowrap text-ivory/20', !empty($c['small']) ? 'text-[clamp(1.1rem,1.6vw,1.5rem)]' : 'text-[clamp(1.4rem,2.2vw,2.1rem)]')) ?>" style="left:<?= e($c['x'] ?? '0') ?>;top:<?= e($c['y'] ?? '0') ?>;transform:rotate(<?= e((float) ($c['rotate'] ?? 0)) ?>deg)"><?= e($c['text'] ?? '') ?></span>
      <?php endforeach; ?>
    </div>
    <div aria-hidden="true" class="absolute inset-x-[16%] bottom-0 h-[55%] rounded-t-[50%] bg-gradient-to-b from-[#cdc3b0] to-[#e7e0d2] opacity-90"></div>
    <span aria-hidden="true" class="crosshair top-5 left-5"></span>
    <span aria-hidden="true" class="crosshair top-5 right-5"></span>
    <figcaption class="absolute bottom-6 left-6 grid gap-1">
      <span class="eyebrow text-ivory">Portrait to come</span>
      <span class="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase"><?= e($founder['name'] ?? '') ?>, at the board</span>
    </figcaption>
  </figure>

  <div class="grid content-start gap-10 lg:col-span-7">
    <div class="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-4">
      <span class="eyebrow">Lead feature</span>
      <span class="eyebrow"><?= e($founder['subjects'] ?? '') ?></span>
    </div>
    <div>
      <h2 id="founder-name" class="settle text-[clamp(3.5rem,7.5vw,8.5rem)] leading-[0.82] tracking-[-0.045em]">Shubham <em class="font-normal">Sir</em></h2>
      <p class="mt-5 font-mono text-[0.8125rem] tracking-[0.17em] text-ink uppercase"><?= e($founder['role'] ?? '') ?> · Vidyansh</p>
    </div>

    <?= reveal_open('blockquote', 'border-l border-ink/30 pl-6') ?>
      <p class="font-display text-[clamp(1.75rem,2.8vw,2.6rem)] leading-[1.08] text-balance italic">“<?= e($quote[0] ?? '') ?><span class="not-italic"><?= e($quote[1] ?? '') ?></span><?= e($quote[2] ?? '') ?>”</p>
    </blockquote>

    <div class="gap-10 text-[1.0625rem] leading-[1.7] text-mute-l md:columns-2">
      <?php foreach ((array) ($founder['bio'] ?? []) as $i => $p): ?>
        <p class="<?= e(cls('mb-5 break-inside-avoid', $i === 0 ? 'text-ink' : '')) ?>"><?= e($p) ?></p>
      <?php endforeach; ?>
    </div>
    <p class="eyebrow -mt-4">Placeholder profile · to be written with Shubham Sir</p>

    <div>
      <h3><span class="eyebrow">Teaching principles</span></h3>
      <ol class="mt-4 border-t border-ink">
        <?php foreach ($founder['principles'] ?? [] as $p): ?>
          <li class="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 border-b border-[var(--line-l)] py-5 sm:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)]">
            <span class="font-display text-xl text-mute-l italic"><?= e($p['numeral'] ?? '') ?></span>
            <span class="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-tight"><?= e($p['title'] ?? '') ?></span>
            <span class="col-start-2 text-mute-l sm:col-start-3"><?= e($p['body'] ?? '') ?></span>
          </li>
        <?php endforeach; ?>
      </ol>
    </div>
  </div>
</article>
