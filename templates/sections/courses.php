<?php
/**
 * LEARN: each course is a full-width editorial spread, image on one side and the
 * story on the other, alternating sides as you read down the chapter.
 * The "Your exam" mark follows the chosen exam (assets/js/home.js).
 */
$courses = $courses ?? get_courses();
$total = count($courses);
$numerals = ['i', 'ii', 'iii', 'iv'];
?>
<section id="courses" aria-labelledby="courses-title" class="scene-sheet on-light bg-ivory pt-[var(--space-section)] text-ink">
  <?= chapter_mark('II', 'Learn', 'Courses', 'container-v mb-[var(--space-block)]') ?>

  <div class="container-v grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-[clamp(3rem,7vw,8rem)]">
    <h2 id="courses-title" class="settle text-[clamp(3.75rem,9.5vw,10.5rem)] leading-[0.84] tracking-[-0.035em]">Choose your <em class="font-normal">direction</em></h2>
    <div class="grid gap-8">
      <p class="max-w-[36ch] text-[1.1875rem] text-mute-l">Three courses, each led by Shubham Sir and built around one exam&rsquo;s real pattern. Every course includes its matching test series.</p>
      <nav aria-label="Courses in this chapter">
        <ol class="border-t border-ink">
          <?php foreach ($courses as $i => $c): ?>
            <li>
              <a href="#course-<?= e($c['slug']) ?>" class="group flex items-baseline gap-4 border-b border-[var(--line-l)] py-3">
                <span class="font-mono text-xs text-mute-l"><?= pad2($i + 1) ?></span>
                <span class="font-display text-[1.375rem] leading-tight transition-[font-style] group-hover:italic"><?= e($c['name']) ?></span>
                <span aria-hidden="true" class="ml-auto text-mute-l transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5">↓</span>
              </a>
            </li>
          <?php endforeach; ?>
        </ol>
      </nav>
      <p class="eyebrow">Hindi and English medium available</p>
    </div>
  </div>

  <ol class="mt-[var(--space-section)]">
    <?php foreach ($courses as $index => $c):
      $flip = $index % 2 === 1;
      $titleId = "course-{$c['slug']}-title";
      $practice = !empty($c['practiceExam']) ? home_exam_by_code($c['practiceExam']) : null;
      $title = $c['title'] ?? [$c['name'], ''];
      $image = $c['image'] ?? null;
      $hasImage = is_array($image) && !empty($image['src']); ?>
      <li>
        <article id="course-<?= e($c['slug']) ?>" aria-labelledby="<?= e($titleId) ?>" class="course-panel grid scroll-mt-16 border-t border-ink lg:grid-cols-2">
          <figure class="<?= e(cls('plate-sheet relative overflow-hidden max-md:aspect-[4/5] md:max-lg:aspect-[4/3] lg:sticky lg:top-0 lg:h-[min(100svh,62.5vw)] lg:self-start', $flip ? 'lg:order-2' : '')) ?>">
            <div class="course-panel__art absolute inset-0">
              <?php if ($hasImage): ?>
                <img src="<?= e(media($image['src'])) ?>" alt="<?= e($image['alt'] ?? '') ?>" loading="lazy" decoding="async" sizes="(min-width: 1024px) 50vw, 100vw" class="object-cover" style="position:absolute;height:100%;width:100%;inset:0;color:transparent">
              <?php else: ?>
                <?= course_plate($c['plate'] ?? 'beam', $index, $title[0] ?? '') ?>
              <?php endif; ?>
            </div>
            <figcaption class="absolute top-5 left-5 grid gap-1 bg-ink/85 py-1.5 pr-3 lg:top-auto lg:bottom-[clamp(1.25rem,3vw,2.5rem)] lg:left-[clamp(1.25rem,3vw,2.5rem)]">
              <span class="eyebrow text-ivory"><?= e($title[0] ?? '') ?></span>
              <?php if (!$hasImage): ?><span class="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase"><?= e(plate_caption($c['plate'] ?? 'beam')) ?></span><?php endif; ?>
            </figcaption>
          </figure>

          <div class="grid content-center gap-[clamp(2.25rem,4vw,3.5rem)] px-[var(--gutter)] py-[clamp(3.5rem,8vw,7rem)] lg:px-[clamp(2.5rem,5.5vw,6.5rem)]">
            <div class="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span class="font-mono text-xs tracking-[0.12em] text-mute-l"><?= pad2($index + 1) ?> / <?= pad2($total) ?></span>
              <span class="eyebrow"><?= e($c['category'] ?? '') ?></span>
              <span hidden data-your-exam="<?= e($c['exam'] ?? '') ?>" class="border-b border-ink pb-0.5 font-mono text-[0.625rem] tracking-[0.14em] text-ink uppercase">Your exam</span>
            </div>

            <div class="grid gap-6">
              <h3 id="<?= e($titleId) ?>" class="settle font-display text-[clamp(3.75rem,7.6vw,8.25rem)] leading-[0.86] font-normal tracking-[-0.035em]"><?= e($title[0] ?? '') ?><br><em><?= e($title[1] ?? '') ?></em></h3>
              <p class="max-w-[30ch] font-display text-[clamp(1.375rem,1.9vw,1.75rem)] leading-snug text-ink/80"><?= e($c['lead'] ?? '') ?></p>
            </div>

            <ol aria-label="Key benefits" class="border-t border-ink">
              <?php foreach ($c['benefits'] ?? [] as $n => $b): ?>
                <li class="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-[var(--line-l)] py-4">
                  <span class="font-display text-lg text-mute-l italic"><?= e($numerals[$n] ?? '') ?></span>
                  <span class="font-display text-[1.375rem] leading-tight"><?= e($b['title']) ?></span>
                  <span class="col-start-2 max-w-[48ch] text-[0.9375rem] text-mute-l"><?= e($b['body']) ?></span>
                </li>
              <?php endforeach; ?>
            </ol>

            <dl class="grid grid-cols-3 gap-4">
              <?php foreach ([['Mode', $c['mode'] ?? ''], ['Duration', $c['duration'] ?? ''], ['Next batch', $c['nextBatch'] ?? '']] as [$k, $v]): ?>
                <div class="grid content-start gap-1.5">
                  <dt class="eyebrow"><?= e($k) ?></dt>
                  <dd class="font-display text-[clamp(1.125rem,1.5vw,1.375rem)] leading-tight"><?= e($v) ?></dd>
                </div>
              <?php endforeach; ?>
            </dl>

            <div class="flex flex-wrap items-center gap-x-8 gap-y-5">
              <?= button('Reserve your seat<span class="sr-only"> in ' . e($c['name']) . '</span>', ['href' => '/#start', 'tone' => 'light', 'diamond' => true, 'attrs' => 'data-set-exam="' . e($c['exam'] ?? '') . '"']) ?>
              <a href="<?= e(url('/courses/' . $c['slug'])) ?>" class="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase">Course details →<span class="sr-only">: <?= e($c['name']) ?></span></a>
              <?php if ($practice): ?>
                <a href="<?= e(url('/test-series/' . $practice['code'])) ?>" class="link-underline font-mono text-xs font-medium tracking-[0.16em] uppercase"><?= e($practice['name']) ?> test series →</a>
              <?php endif; ?>
            </div>
          </div>
        </article>
      </li>
    <?php endforeach; ?>
  </ol>
</section>
