<?php
/**
 * The opening title card. The phrase is the whole composition: "From Dream" in roman
 * capitals, a quiet "to", and "Destination" in a large italic that catches the light.
 */
$brand = site()['brand'];
$stages = content('journey')['journeyStages'] ?? [];
?>
<section aria-labelledby="hero-title" class="hero relative grid min-h-[max(40rem,100svh)] grid-rows-[auto_1fr_auto] overflow-hidden bg-ink">
  <div aria-hidden="true" class="hero-glow pointer-events-none absolute inset-0"></div>

  <div class="container-v relative flex items-center justify-between gap-6 pt-[calc(var(--header-h)+clamp(1.5rem,4vh,3rem)+env(safe-area-inset-top))]">
    <p class="hero-fade eyebrow text-ivory"><?= e($brand['name']) ?> <span class="text-mute-d">· <?= e($brand['byline']) ?></span></p>
    <p class="hero-fade eyebrow hidden sm:block">SSC JE · RRB JE · State AE / JE</p>
  </div>

  <div class="container-v relative grid content-center py-[clamp(2.5rem,6vh,4.5rem)]">
    <h1 id="hero-title" aria-label="From Dream to Destination" class="hero-title @container font-display font-normal"><span class="hero-mask block"><span class="hero-rise block text-[28cqi] leading-[0.8] tracking-[-0.03em] whitespace-nowrap uppercase lg:text-[15.6cqi]">From <br class="lg:hidden">Dream</span></span> <span class="flex items-center gap-[clamp(0.75rem,2vw,2rem)] py-[clamp(0.75rem,2.2cqi,2rem)]"><span aria-hidden="true" class="hero-rule h-px flex-1 bg-ivory/30"></span><span class="hero-mask block"><span class="hero-rise hero-rise-2 block font-display text-[clamp(1.75rem,4.2cqi,4.25rem)] leading-none text-mute-d italic">to</span></span> <span aria-hidden="true" class="hero-rule h-px w-[18%] bg-ivory/30"></span></span><span class="hero-mask block text-right"><span class="hero-rise hero-rise-3 hero-sheen inline-block text-[25cqi] leading-[0.9] tracking-[-0.035em] whitespace-nowrap italic lg:text-[17.6cqi]">Destination</span></span></h1>
  </div>

  <div class="container-v hero-fade-late relative grid gap-10 pb-[calc(1.75rem+env(safe-area-inset-bottom))]">
    <div class="grid items-end gap-7 md:grid-cols-[minmax(0,1fr)_auto]">
      <p class="max-w-[34ch] text-[clamp(1.125rem,1.45vw,1.375rem)] leading-relaxed text-body-d"><?= e($brand['promise']) ?></p>
      <div class="flex flex-wrap gap-3">
        <?= button('Explore courses', ['href' => '/courses', 'diamond' => true]) ?>
        <?= button('Try a free mock test', ['href' => '/test-series', 'variant' => 'ghost']) ?>
      </div>
    </div>
    <div>
      <div class="flex justify-between gap-3">
        <span class="eyebrow">The journey</span>
        <span class="eyebrow">Scroll to begin</span>
      </div>
      <div class="dimension mt-3.5">
        <span data-journey-gem aria-hidden="true" class="absolute top-[-5px] left-0 size-2.5 -translate-x-1/2 rotate-45 bg-gold shadow-[0_0_16px_var(--color-gold)]"></span>
      </div>
      <nav aria-label="Journey chapters" class="grid grid-cols-5">
        <?php foreach ($stages as $i => $s): ?>
          <a href="#chapter-<?= e($s['id']) ?>" data-chapter="<?= $i ?>" class="relative pt-4 font-mono text-[0.65625rem] font-medium tracking-[0.16em] text-mute-d uppercase transition-colors before:absolute before:top-[-5px] before:left-0 before:h-2.5 before:w-px before:bg-[var(--hair)] hover:text-ivory"><?= e($s['number']) ?><span class="hidden sm:inline"> <?= e($s['title']) ?></span></a>
        <?php endforeach; ?>
      </nav>
    </div>
  </div>
</section>
