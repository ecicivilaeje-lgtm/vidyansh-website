<section class="container-v grid min-h-[70vh] content-center gap-8 pt-[calc(var(--header-h)+4rem)] pb-[var(--space-block)]">
  <p class="eyebrow">404 · Off the route</p>
  <h1 class="max-w-[14ch] text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.035em]">This page is not on the <em class="font-normal">map</em></h1>
  <p class="max-w-[48ch] text-body-d">The link may be old, or the page may have moved. Start again from the homepage or browse the courses.</p>
  <div class="flex flex-wrap gap-3">
    <?= button('Back to home', ['href' => '/', 'diamond' => true]) ?>
    <?= button('Explore courses', ['href' => '/courses', 'variant' => 'ghost']) ?>
  </div>
</section>
