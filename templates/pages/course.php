<?php
/** The Specification Sheet: a split hero, a long main column with a sticky enrolment rail, then a dark band. */
$course = get_course_by_slug($slug);
if (!$course) not_found();
$courses = get_courses();
$index = 0;
foreach ($courses as $i => $c) if ($c['slug'] === $course['slug']) $index = $i;
$exam = catalog_exam_by_code($course['exam'] ?? null);
$series = test_series_for($course['practiceExam'] ?? null);
$others = array_values(array_filter($courses, fn($c) => $c['slug'] !== $course['slug']));
$reserve = '/contact?course=' . $course['slug'];
$mentor = content('mentor')['mentor'] ?? [];
$mentorWords = explode(' ', $mentor['name'] ?? '');
$hasImage = !empty($course['image']['src']);

page_meta([
    'title' => $course['name'] . ' · Vidyansh',
    'description' => "{$course['lead']} {$course['mode']}, {$course['duration']}. Syllabus, weekly rhythm and what the course includes.",
    'canonical' => '/courses/' . $course['slug'],
    'jsonLd' => [[
        '@context' => 'https://schema.org',
        '@type' => 'Course',
        'name' => $course['name'],
        'description' => $course['lead'],
        'provider' => ['@type' => 'EducationalOrganization', 'name' => 'Vidyansh'],
        'inLanguage' => ['en', 'hi'],
    ]],
]);

$facts = [['Mode', $course['mode'] ?? ''], ['Duration', $course['duration'] ?? ''], ['Next batch', $course['nextBatch'] ?? '']];
$sections = [['overview', 'Overview'], ['syllabus', 'Syllabus'], ['week', 'How a week runs'], ['included', "What's included"]];

/** A numbered section heading; the second part of the title is set in italic. */
$sectionHead = function (int $n, string $id, array $title) {
    $parts = '';
    foreach ($title as $i => $t) $parts .= $i === 1 ? '<em class="font-normal">' . e($t) . '</em>' : '<span>' . e($t) . '</span>';
    return '<div class="grid gap-4"><span class="font-mono text-xs tracking-[0.14em] text-mute-l">' . pad2($n) . '</span>'
        . '<h2 id="' . e($id) . '" class="settle text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[0.9] tracking-[-0.03em]">' . $parts . '</h2></div>';
};
?>
<?php /* Split hero */ ?>
<header class="grid lg:min-h-svh lg:grid-cols-2">
  <figure class="plate-sheet relative overflow-hidden max-lg:order-2 max-md:aspect-[4/5] md:max-lg:aspect-[4/3]">
    <div class="absolute inset-0 lg:inset-y-[var(--header-h)]">
      <?php if ($hasImage): ?>
        <img src="<?= e(media($course['image']['src'])) ?>" alt="<?= e($course['image']['alt'] ?? '') ?>" fetchpriority="high" decoding="async" class="absolute inset-0 size-full object-cover">
      <?php else: ?>
        <?= course_plate($course['plate'] ?? 'beam', $index, $course['title'][0] ?? '') ?>
      <?php endif; ?>
    </div>
    <span aria-hidden="true" class="crosshair top-5 left-5 lg:top-[calc(var(--header-h)+1.25rem)]"></span>
    <figcaption class="absolute bottom-[clamp(1.25rem,3vw,2.5rem)] left-[clamp(1.25rem,3vw,2.5rem)] max-lg:hidden">
      <dl class="grid grid-cols-[auto_auto] border border-[var(--hair)] bg-ink/85 font-mono text-[0.625rem] font-medium tracking-[0.16em] uppercase">
        <?php foreach ([
            ['Drawing', $course['name']],
            ['Plate', pad2($index + 1)],
            ['Subject', $hasImage ? 'Photograph' : plate_caption($course['plate'] ?? 'beam')],
            ['Scale', 'NTS'],
        ] as $i => [$k, $v]): ?>
          <div class="<?= e(cls('contents', $i ? '[&>*]:border-t [&>*]:border-[var(--hair)]' : '')) ?>">
            <dt class="border-r border-[var(--hair)] px-3 py-2 text-mute-d"><?= e($k) ?></dt>
            <dd class="px-3 py-2 text-ivory"><?= e($v) ?></dd>
          </div>
        <?php endforeach; ?>
      </dl>
    </figcaption>
  </figure>

  <div class="on-light grid content-center gap-[clamp(2.25rem,4vw,3.5rem)] bg-ivory px-[var(--gutter)] pt-[calc(var(--header-h)+clamp(3rem,7vw,6rem))] pb-[clamp(3.5rem,7vw,6rem)] text-ink lg:px-[clamp(2.5rem,5.5vw,6.5rem)]">
    <nav aria-label="Breadcrumb" class="eyebrow">
      <a href="<?= e(url('/courses')) ?>" class="link-underline">Courses</a><span aria-hidden="true"> / </span><span aria-current="page"><?= e($course['name']) ?></span>
    </nav>
    <div class="grid gap-6">
      <p class="eyebrow"><?= e($course['category'] ?? '') ?></p>
      <h1 aria-label="<?= e($course['name']) ?>" class="text-[clamp(4rem,9vw,9.5rem)] leading-[0.84] font-normal tracking-[-0.04em]">
        <span class="hero-mask block"><span class="hero-rise block"><?= e($course['title'][0] ?? '') ?></span></span> <span class="hero-mask block"><em class="hero-rise hero-rise-2 block font-normal"><?= e($course['title'][1] ?? '') ?></em></span>
      </h1>
      <p class="hero-fade max-w-[30ch] font-display text-[clamp(1.375rem,2vw,1.875rem)] leading-snug text-ink/80"><?= e($course['lead'] ?? '') ?></p>
    </div>
    <dl class="hero-fade-late grid grid-cols-3 gap-4 border-t border-ink pt-5">
      <?php foreach ($facts as [$k, $v]): ?>
        <div class="grid content-start gap-1.5">
          <dt class="eyebrow"><?= e($k) ?></dt>
          <dd class="font-display text-[clamp(1.125rem,1.6vw,1.5rem)] leading-tight"><?= e($v) ?></dd>
        </div>
      <?php endforeach; ?>
    </dl>
    <div class="lg:hidden">
      <?= button('Reserve your seat', ['href' => $reserve, 'tone' => 'light', 'diamond' => true]) ?>
    </div>
  </div>
</header>

<?php /* Specification body */ ?>
<div class="on-light bg-ivory text-ink">
  <div class="container-v grid gap-[var(--space-block)] border-t border-ink py-[var(--space-section)] lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-[clamp(3rem,6vw,7rem)]">
    <div class="grid min-w-0 gap-[var(--space-block)]">
      <nav aria-label="On this page" class="flex flex-wrap gap-x-7 gap-y-2">
        <?php foreach ($sections as $i => [$id, $label]): ?>
          <a href="#<?= e($id) ?>" class="link-underline font-mono text-[0.6875rem] font-medium tracking-[0.16em] uppercase"><span class="text-mute-l"><?= pad2($i + 1) ?></span> <?= e($label) ?></a>
        <?php endforeach; ?>
      </nav>

      <section id="overview" aria-labelledby="overview-title" class="grid scroll-mt-24 gap-8">
        <?= $sectionHead(1, 'overview-title', ['The course ', 'in brief']) ?>
        <div class="grid max-w-[60ch] gap-6 text-[1.1875rem] text-mute-l">
          <?php foreach (!empty($course['overview']) ? $course['overview'] : [$course['lead'] ?? ''] as $p): ?>
            <p><?= e($p) ?></p>
          <?php endforeach; ?>
        </div>
      </section>

      <?php if (!empty($course['modules'])): ?>
        <section id="syllabus" aria-labelledby="syllabus-title" class="grid scroll-mt-24 gap-8">
          <?= $sectionHead(2, 'syllabus-title', ['The ', 'syllabus']) ?>
          <div class="grid gap-2">
            <p class="eyebrow">Indicative syllabus · confirm against the official notification</p>
            <?php if (!empty($course['syllabusNote'])): ?><p class="text-[0.9375rem] text-mute-l"><?= e($course['syllabusNote']) ?></p><?php endif; ?>
          </div>
          <?php partial('components/catalog/syllabus-list', ['modules' => $course['modules']]) ?>
        </section>
      <?php endif; ?>

      <?php if (!empty($course['week'])): ?>
        <section id="week" aria-labelledby="week-title" class="grid scroll-mt-24 gap-8">
          <?= $sectionHead(3, 'week-title', ['How a ', 'week', ' runs']) ?>
          <p class="max-w-[52ch] text-[1.0625rem] text-mute-l">A typical week. The order shifts with the syllabus, but the rhythm holds.</p>
          <?php partial('components/catalog/week-strip', ['week' => $course['week']]) ?>
        </section>
      <?php endif; ?>

      <?php if (!empty($course['included'])): ?>
        <section id="included" aria-labelledby="included-title" class="grid scroll-mt-24 gap-8">
          <?= $sectionHead(4, 'included-title', ['What’s ', 'included']) ?>
          <ul class="border-t border-ink">
            <?php foreach ($course['included'] as $item): ?>
              <li class="grid gap-x-8 gap-y-1 border-b border-[var(--line-l)] py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-baseline">
                <span class="flex items-baseline gap-4 font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-tight"><span aria-hidden="true" class="inline-block size-[6px] shrink-0 -translate-y-[0.25em] rotate-45 bg-ink"></span><?= e($item['title'] ?? '') ?></span>
                <span class="text-mute-l max-sm:pl-[calc(6px+1rem)]"><?= e($item['body'] ?? '') ?></span>
              </li>
            <?php endforeach; ?>
          </ul>
        </section>
      <?php endif; ?>
    </div>

    <?php /* Enrolment rail */ ?>
    <aside aria-labelledby="rail-title" class="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
      <div class="grid gap-7 border-t border-ink pt-6">
        <h2 id="rail-title" class="eyebrow">Enrolment</h2>
        <p class="font-display text-[1.75rem] leading-tight"><?= catalog_title($course) ?></p>
        <dl>
          <?php foreach ([...$facts, ['Fee', 'Fee to be announced']] as [$k, $v]): ?>
            <div class="flex items-baseline justify-between gap-4 border-b border-[var(--line-l)] py-3">
              <dt class="eyebrow"><?= e($k) ?></dt>
              <dd class="<?= e(cls('text-right font-mono text-[0.8125rem] tracking-[0.06em]', $k === 'Fee' ? 'text-mute-l' : '')) ?>"><?= e($v) ?></dd>
            </div>
          <?php endforeach; ?>
        </dl>
        <?= button('Reserve your seat<span class="sr-only"> in ' . e($course['name']) . '</span>', ['href' => $reserve, 'tone' => 'light', 'diamond' => true, 'class' => 'w-full']) ?>
        <?php if ($series): ?>
          <a href="<?= e(url('/test-series/' . $series['code'])) ?>" class="group link-underline justify-self-start font-mono text-xs font-medium tracking-[0.16em] uppercase"><?= e($series['label']) ?> test series <?= catalog_arrow() ?></a>
        <?php else: ?>
          <p class="eyebrow"><?= e($exam['name'] ?? ($course['title'][0] ?? '')) ?> test series to be announced</p>
        <?php endif; ?>
        <p class="text-[0.9375rem] text-mute-l">Batch dates and fees are confirmed when you enquire. Classes in Hindi and English.</p>
      </div>
    </aside>
  </div>
</div>

<?php /* Dark band: mentor and other directions */ ?>
<section aria-labelledby="mentor-title" class="scene-surface bg-ink py-[var(--space-section)] text-ivory">
  <div class="container-v grid gap-[var(--space-section)]">
    <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end">
      <div class="grid gap-5">
        <p class="eyebrow">Taught by</p>
        <h2 id="mentor-title" class="settle text-[clamp(3.5rem,8vw,8rem)] leading-[0.86] tracking-[-0.035em]"><?= e($mentorWords[0]) ?> <em class="font-normal"><?= e(implode(' ', array_slice($mentorWords, 1))) ?></em></h2>
      </div>
      <div class="grid gap-6">
        <p class="max-w-[48ch] text-[1.125rem] text-body-d"><?= e($mentor['bio'] ?? '') ?></p>
        <a href="<?= e(url('/faculty')) ?>" class="group link-underline justify-self-start font-mono text-xs font-medium tracking-[0.16em] uppercase">Meet the faculty <?= catalog_arrow() ?></a>
      </div>
    </div>

    <div class="grid gap-10">
      <div class="flex flex-wrap items-baseline justify-between gap-4">
        <h2 class="font-display text-[clamp(2rem,3.5vw,3rem)] leading-none">Other <em class="font-normal">directions</em></h2>
        <a href="<?= e(url('/courses')) ?>" class="link-underline eyebrow">All courses →</a>
      </div>
      <ul class="border-t border-ivory/40">
        <?php foreach ($others as $c): ?>
          <li>
            <a href="<?= e(url('/courses/' . $c['slug'])) ?>" class="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-2 border-b border-[var(--line-d)] py-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)_auto]">
              <span class="font-display text-[clamp(2.5rem,6vw,5.75rem)] leading-[0.9] tracking-[-0.03em] transition-[font-style] group-hover:italic"><?= catalog_title($c) ?></span>
              <span class="eyebrow max-md:col-start-1 max-md:row-start-2"><?= e($c['mode'] ?? '') ?> · <?= e($c['duration'] ?? '') ?></span>
              <span aria-hidden="true" class="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-none transition-transform duration-500 ease-out-expo group-hover:translate-x-3 max-md:row-span-2 max-md:self-center">→</span>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
</section>
