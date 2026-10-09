<?php
/** About: a title page, the book (four chapters with ornaments between) and a colophon. */
page_meta([
    'title' => 'About · Vidyansh',
    'description' => 'Why Vidyansh exists, what the name means, how we teach from Dream to Destination, and what we will never do. Exam preparation for engineering aspirants, by Shubham Sir.',
    'canonical' => '/about',
]);
$about = content('about');
$titlePage = $about['aboutTitlePage'] ?? [];
$chapters = $about['chapters'] ?? [];
$stageNotes = $about['stageNotes'] ?? [];
$nevers = $about['nevers'] ?? [];
$colophon = $about['colophon'] ?? [];
$stages = content('journey')['journeyStages'] ?? [];
$brand = site()['brand'];
[$why, $name, $how, $never] = array_pad(array_values($chapters), 4, null);

ob_start(); ?>
<ol aria-label="The five stages" class="relative border-l border-ink/30">
  <?php foreach ($stages as $i => $s): $last = $i === count($stages) - 1; ?>
    <li class="relative grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 pb-10 pl-6 last:pb-0 sm:grid-cols-[6rem_minmax(0,1fr)]">
      <?php if ($last): ?>
        <?= star('absolute top-[0.9rem] -left-[9px] size-[17px]') ?>
      <?php else: ?>
        <span aria-hidden="true" class="absolute top-[1.15rem] -left-[5px] size-[9px] rotate-45 border border-ink bg-ivory"></span>
      <?php endif; ?>
      <span class="font-display text-[clamp(2.5rem,4vw,3.5rem)] leading-none text-mute-l tabular-nums"><?= e($s['number'] ?? '') ?></span>
      <div>
        <h3 class="<?= e(cls('text-[clamp(1.75rem,2.6vw,2.25rem)] leading-tight', $last ? 'italic' : '')) ?>"><?= e($s['title'] ?? '') ?></h3>
        <p class="mt-2 text-mute-l"><?= e($stageNotes[$s['id']] ?? '') ?></p>
      </div>
    </li>
  <?php endforeach; ?>
</ol>
<?php $stagesHtml = ob_get_clean();

ob_start(); ?>
<ol class="border-t border-ink">
  <?php foreach ($nevers as $i => $n): ?>
    <li class="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-[var(--line-l)] py-6">
      <span class="pt-1 font-mono text-[0.6875rem] tracking-[0.14em] text-mute-l"><?= pad2($i + 1) ?></span>
      <div>
        <h3 class="text-[clamp(1.6rem,2.4vw,2rem)] leading-tight"><?= e($n['title'] ?? '') ?></h3>
        <p class="mt-2 text-mute-l"><?= e($n['body'] ?? '') ?></p>
      </div>
    </li>
  <?php endforeach; ?>
</ol>
<?php $neversHtml = ob_get_clean();

$book = [[$why, ''], [$name, ''], [$how, $stagesHtml], [$never, $neversHtml]];
?>
<section aria-labelledby="about-title" class="relative grid min-h-[100svh] place-items-center overflow-hidden bg-ink px-[var(--gutter)] pt-[calc(var(--header-h)+3rem)] pb-16 text-center">
  <div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_45%,rgb(120_98_64/0.06),transparent_70%)]"></div>
  <div aria-hidden="true" class="absolute inset-[clamp(1rem,3vw,2.5rem)] top-[calc(var(--header-h)+1rem)] border border-[var(--line-d)]"></div>
  <div class="relative grid justify-items-center">
    <p class="eyebrow"><?= e($titlePage['eyebrow'] ?? '') ?></p>
    <h1 id="about-title" class="mt-10 text-[clamp(4.5rem,15vw,12rem)] leading-[0.82] tracking-[-0.045em]"><?= e($brand['name']) ?></h1>
    <p lang="hi" class="mt-6 font-deva text-[clamp(2.5rem,6vw,5rem)] leading-none text-ivory/80"><?= e($brand['devanagari'] ?? '') ?></p>
    <p class="mt-6 font-display text-[clamp(1.5rem,2.4vw,2.1rem)] italic text-body-d"><?= e($brand['meaning'] ?? '') ?></p>
    <?= star('my-10 size-5') ?>
    <p class="font-mono text-[0.8125rem] tracking-[0.2em] text-ivory uppercase"><?= e($brand['tagline'] ?? '') ?></p>
    <p class="eyebrow mt-3"><?= e($brand['byline'] ?? '') ?></p>
  </div>
  <p class="eyebrow absolute bottom-[clamp(1.75rem,4vw,3.5rem)] left-1/2 -translate-x-1/2 whitespace-nowrap"><?= e($titlePage['edition'] ?? '') ?></p>
</section>

<article aria-label="About Vidyansh" class="scene-sheet on-light bg-ivory py-[var(--space-section)] text-ink">
  <div class="container-v">
    <?php $first = true; foreach ($book as [$chapter, $children]):
      if (!$chapter) continue;
      if (!$first) partial('components/learning/ornament');
      $first = false;
      partial('components/learning/chapter', ['chapter' => $chapter, 'children' => $children]);
    endforeach; ?>

    <div class="<?= e(LEARNING_BOOK_GRID . ' mt-[var(--space-block)]') ?>">
      <p class="font-display text-[1.5rem] italic lg:col-start-2">The rest of this book is written by our students.</p>
    </div>
  </div>
</article>

<section aria-labelledby="colophon-title" class="scene-surface bg-ink py-[var(--space-section)]">
  <div class="container-v grid justify-items-center text-center">
    <?= star('size-4') ?>
    <h2 id="colophon-title" class="mt-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em]">Vidyansh, <em class="font-normal">in short</em></h2>
    <div class="mt-8 max-w-[34rem] font-display text-[clamp(1.35rem,2vw,1.7rem)] leading-[1.45] text-body-d">
      <p><?= e($colophon['note'] ?? '') ?></p>
    </div>
    <dl class="mt-12 grid w-full max-w-[34rem] grid-cols-3 border-y border-[var(--line-d)] font-mono text-[0.75rem] tracking-[0.14em] uppercase">
      <?php foreach ([['Founded', $colophon['founded'] ?? '—'], ['Place', $colophon['place'] ?? '—'], ['Mentor', 'Shubham Sir']] as $i => [$k, $v]): ?>
        <div class="<?= e(cls('grid gap-2 py-5', $i > 0 ? 'border-l border-[var(--line-d)]' : '')) ?>">
          <dt class="text-mute-d"><?= e($k) ?></dt>
          <dd class="text-ivory"><?= e($v) ?></dd>
        </div>
      <?php endforeach; ?>
    </dl>
    <div class="mt-[var(--space-block)] flex flex-wrap justify-center gap-3">
      <?= button('Explore courses', ['href' => '/courses', 'diamond' => true]) ?>
      <?= button('Talk to us', ['href' => '/contact', 'variant' => 'ghost']) ?>
    </div>
  </div>
</section>
