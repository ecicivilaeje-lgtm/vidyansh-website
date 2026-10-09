<?php
/**
 * The prospectus index (the original CourseIndex): a sticky filter column beside one tall ruled row per course.
 * Rendered in its initial state (no filter); assets/js/catalog-courses.js filters the rows and shows the
 * plate that follows the pointer on hover-capable devices.
 * @var array $courses
 */
$pairs = function (array $list) {
    $seen = [];
    foreach ($list as [$k, $v]) $seen[$k] = $v;
    return $seen;
};
$examOptions = $pairs(array_map(fn($c) => [$c['exam'], catalog_exam_label($c)], $courses));
$modeOptions = $pairs(array_map(fn($c) => [$c['mode'], $c['mode']], $courses));
$groups = [['exam', 'By exam', $examOptions], ['mode', 'By mode', $modeOptions]];
$countId = 'course-index-count';
?>
<div data-course-index class="grid gap-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-[clamp(3rem,6vw,7rem)]">
  <aside aria-label="Filter courses" class="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
    <div class="grid gap-10 max-lg:grid-cols-1 sm:max-lg:grid-cols-2">
      <?php foreach ($groups as [$key, $label, $options]): ?>
        <fieldset class="grid gap-3">
          <legend class="eyebrow mb-3"><?= e($label) ?></legend>
          <div class="grid justify-items-start gap-1 border-t border-ink pt-3">
            <?php foreach (['' => 'All'] + $options as $value => $text): $on = $value === ''; ?>
              <button type="button" aria-pressed="<?= $on ? 'true' : 'false' ?>" data-filter="<?= e($key) ?>" data-value="<?= e((string) $value) ?>"
                class="<?= e(cls('group flex items-baseline gap-3 py-1 text-left font-display text-[1.375rem] leading-tight transition-colors duration-300', $on ? 'text-ink italic' : 'text-mute-l hover:text-ink')) ?>"><span aria-hidden="true" class="<?= e(cls('inline-block size-[6px] shrink-0 -translate-y-[0.2em] rotate-45 border border-ink', $on ? 'bg-ink' : 'bg-transparent')) ?>"></span><?= e($text) ?></button>
            <?php endforeach; ?>
          </div>
        </fieldset>
      <?php endforeach; ?>
    </div>
    <p id="<?= $countId ?>" aria-live="polite" data-count data-total="<?= count($courses) ?>" class="mt-10 font-mono text-xs tracking-[0.14em] text-mute-l uppercase tabular-nums">Showing <?= pad2(count($courses)) ?> of <?= pad2(count($courses)) ?></p>
  </aside>

  <div>
    <ol aria-describedby="<?= $countId ?>" data-course-list class="border-t border-ink">
      <?php foreach ($courses as $n => $c): ?>
        <li data-slug="<?= e($c['slug']) ?>" data-exam="<?= e($c['exam']) ?>" data-mode="<?= e($c['mode']) ?>" class="group relative grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-5 border-b border-[var(--line-l)] py-[clamp(2.25rem,4.5vw,4rem)] md:grid-cols-[3.5rem_minmax(0,1fr)_auto]">
          <span class="font-mono text-xs tracking-[0.12em] text-mute-l tabular-nums"><?= pad2($n + 1) ?></span>
          <div class="grid min-w-0 gap-5">
            <span class="eyebrow"><?= e($c['category'] ?? '') ?></span>
            <h2 class="font-display text-[clamp(2.75rem,7.2vw,7.25rem)] leading-[0.86] font-normal tracking-[-0.035em] transition-[font-style] duration-300">
              <a href="<?= e(url('/courses/' . $c['slug'])) ?>" class="after:absolute after:inset-0 after:content-[''] group-hover:italic"><?= catalog_title($c) ?></a>
            </h2>
            <p class="max-w-[46ch] text-[1.0625rem] text-mute-l"><?= e($c['lead'] ?? '') ?></p>
            <dl class="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.75rem] tracking-[0.12em] uppercase">
              <?php foreach ([['Mode', $c['mode'] ?? ''], ['Duration', $c['duration'] ?? ''], ['Next batch', $c['nextBatch'] ?? '']] as [$k, $v]): ?>
                <div class="flex gap-2"><dt class="text-mute-l"><?= e($k) ?></dt><dd class="text-ink"><?= e($v) ?></dd></div>
              <?php endforeach; ?>
            </dl>
          </div>
          <span aria-hidden="true" class="self-center font-display text-[clamp(2rem,3.5vw,3.25rem)] leading-none transition-transform duration-500 ease-out-expo group-hover:translate-x-3">→</span>
        </li>
      <?php endforeach; ?>
    </ol>
    <div data-course-empty hidden class="grid gap-5 border-b border-[var(--line-l)] py-14">
      <p class="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">No course matches <em class="font-normal">both</em> filters yet.</p>
      <button type="button" data-clear-filters class="link-underline justify-self-start font-mono text-xs font-medium tracking-[0.16em] uppercase">Clear filters →</button>
    </div>
  </div>

  <?php /* The preview that follows the pointer; added by JS only where hover previews make sense. */ ?>
  <template data-course-preview>
    <div aria-hidden="true" class="pointer-events-none fixed top-0 left-0 z-40 aspect-[4/5] w-[clamp(15rem,20vw,19.5rem)] plate-sheet shadow-[0_2rem_4rem_-1.5rem_rgb(7_7_6/0.45)] transition-opacity duration-300 ease-out-expo opacity-0">
      <?php foreach ($courses as $i => $c): ?>
        <div data-preview="<?= e($c['slug']) ?>" class="absolute inset-0 transition-opacity duration-300 opacity-0">
          <?php if (!empty($c['image']['src'])): ?>
            <img src="<?= e(media($c['image']['src'])) ?>" alt="" loading="lazy" decoding="async" class="absolute inset-0 size-full object-cover">
          <?php else: ?>
            <?= course_plate($c['plate'] ?? 'beam', $i, $c['title'][0] ?? '') ?>
            <span class="absolute top-3 left-3 font-mono text-[0.5625rem] tracking-[0.14em] text-mute-d uppercase"><?= e(plate_caption($c['plate'] ?? 'beam')) ?></span>
          <?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
  </template>
</div>
