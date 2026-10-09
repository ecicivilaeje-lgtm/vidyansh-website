<?php
/** The Prospectus: a dark masthead, a ruled ivory index with filters, a dark comparison matrix. */
page_meta([
    'title' => 'Courses · Vidyansh',
    'description' => 'Vidyansh courses for SSC JE, RRB JE and State AE / JE, led by Shubham Sir. Compare mode, duration and what each course includes.',
    'canonical' => '/courses',
]);
page_script('catalog-courses');
$courses = get_courses();
$count = pad2(count($courses));
?>
<header class="drafting-grid relative overflow-hidden bg-ink pt-[calc(var(--header-h)+clamp(4rem,10vw,9rem))] pb-[var(--space-block)] text-ivory">
  <span aria-hidden="true" class="crosshair top-[calc(var(--header-h)+1.5rem)] right-[var(--gutter)]"></span>
  <div class="container-v grid gap-[clamp(3rem,6vw,5rem)]">
    <div class="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_auto]">
      <h1 aria-label="Every direction, one destination" class="text-[clamp(4rem,11.5vw,11.5rem)] leading-[0.84] tracking-[-0.04em]">
        <span class="hero-mask block"><span class="hero-rise block">Every <em class="font-normal">direction,</em></span></span> <span class="hero-mask block"><span class="hero-rise hero-rise-2 block">one destination</span></span>
      </h1>

      <div class="hero-fade grid justify-items-start gap-6 lg:justify-items-end">
        <p class="font-display text-[clamp(7rem,17vw,16rem)] leading-[0.78] font-normal tracking-[-0.05em] tabular-nums" aria-hidden="true"><?= e($count) ?></p>
        <p class="eyebrow"><span class="sr-only"><?= count($courses) ?> </span>Courses, each led by Shubham Sir</p>
      </div>
    </div>

    <div class="hero-fade-late grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <p class="max-w-[40ch] text-[1.1875rem] text-body-d">Each course is built around one exam’s real pattern and taught from first principles. Choose by exam, choose by how you like to learn.</p>
      <div class="dimension self-end" aria-hidden="true">
        <span class="-translate-y-1/2 bg-ink px-3 font-mono text-[0.625rem] tracking-[0.16em] text-mute-d uppercase">Hindi and English medium</span>
      </div>
    </div>
  </div>
</header>

<section aria-label="Course index" class="scene-sheet on-light bg-ivory py-[var(--space-section)] text-ink">
  <div class="container-v">
    <?php partial('components/catalog/course-index', ['courses' => $courses]) ?>
  </div>
</section>

<?php partial('components/catalog/course-matrix', ['courses' => $courses]) ?>

<section aria-label="Enquiry" class="on-light bg-ivory py-[var(--space-block)] text-ink">
  <div class="container-v flex flex-wrap items-baseline justify-between gap-x-10 gap-y-6 border-t border-ink pt-10">
    <p class="max-w-[34ch] font-display text-[clamp(1.75rem,3vw,2.625rem)] leading-tight">Not sure which one is yours? <em class="font-normal">Ask us.</em></p>
    <a href="<?= e(url('/contact')) ?>" class="group link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">Talk to the Vidyansh team <?= catalog_arrow() ?></a>
  </div>
</section>
