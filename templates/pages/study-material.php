<?php
/** Study material: the library shelf (components/learning/bookshelf) and the free downloads list. */
page_meta([
    'title' => 'Study material · Vidyansh',
    'description' => 'Notes, formula sheets, solved previous year papers and practice books for SSC JE, RRB JE and State AE / JE, arranged by subject. Free titles open to every aspirant.',
    'canonical' => '/study-material',
]);
page_script('learning-bookshelf');
$materials = get_study_materials();
$free = get_free_study_materials();
$page = content('study-material')['studyMaterialPage'] ?? [];
$formats = $page['formats'] ?? [];
$examOptions = array_map(fn($x) => ['code' => $x['code'], 'name' => $x['name']], content('exams')['exams'] ?? []);
?>
<div aria-hidden="true" class="h-[calc(var(--header-h)+env(safe-area-inset-top))] bg-ink"></div>

<section aria-labelledby="library-title" class="on-light bg-ivory pb-[var(--space-section)] text-ink">
  <div class="container-v pt-[clamp(2.5rem,5vw,4.5rem)]">
    <div class="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
      <h1 id="library-title" class="text-[clamp(3.25rem,7.5vw,7.5rem)] leading-[0.86] tracking-[-0.035em]">Study <em class="font-normal">material</em></h1>
      <div class="grid gap-4 lg:pb-2">
        <p class="text-[1.0625rem] text-mute-l"><?= e($page['intro'] ?? '') ?></p>
        <p class="font-mono text-[0.6875rem] tracking-[0.12em] text-ink uppercase"><?= e($page['sampleNote'] ?? '') ?></p>
      </div>
    </div>

    <div class="mt-12">
      <?php partial('components/learning/bookshelf', ['materials' => $materials, 'examOptions' => $examOptions, 'formats' => $formats]) ?>
    </div>
  </div>
</section>

<section aria-labelledby="free-title" class="scene-surface bg-ink py-[var(--space-section)]">
  <div class="container-v grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-[clamp(3rem,7vw,8rem)]">
    <div>
      <p class="eyebrow">Open to every aspirant</p>
      <h2 id="free-title" class="settle mt-5 text-[clamp(3.25rem,7vw,7.5rem)] leading-[0.88] tracking-[-0.025em]">Free to <em class="font-normal">download</em></h2>
      <p class="mt-8 max-w-[38ch] text-body-d">Formula sheets, short notes and a solved paper, free for every aspirant. They will be ready to download here once published.</p>
      <p class="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[0.75rem] tracking-[0.16em] uppercase">
        <?= learning_arrow_link('/free-classes', 'Free classes') ?>
        <?= learning_arrow_link('/test-series', 'Free tests') ?>
      </p>
    </div>

    <ol class="border-t border-ivory/40">
      <?php foreach ($free as $i => $m): ?>
        <li class="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 border-b border-[var(--line-d)] py-6 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]">
          <span class="font-mono text-xs tabular-nums text-mute-d"><?= pad2($i + 1) ?></span>
          <div class="min-w-0">
            <p class="font-display text-[clamp(1.6rem,2.6vw,2.25rem)] leading-tight"><?= e($m['subject']) ?> <em class="font-normal">· <?= e(mb_strtolower($m['title'])) ?></em></p>
            <p class="mt-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-mute-d uppercase"><?= e($m['code']) ?> · <?= e($formats[$m['format']] ?? '') ?> · Pages —</p>
          </div>
          <span class="col-start-2 font-mono text-[0.6875rem] tracking-[0.16em] text-mute-d uppercase sm:col-start-3">Coming soon</span>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>
  <p class="container-v eyebrow mt-12 normal-case tracking-[0.06em]"><?= e($page['sampleNote'] ?? '') ?></p>
</section>
