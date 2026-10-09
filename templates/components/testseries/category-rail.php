<?php
/** Two labelled rails, By exam and By format, linking to their own catalogue pages. @var string $current */
$ts = content('test-series');
$item = function (string $href, string $label) use ($current): string {
    $active = $current === $href;
    return '<li><a href="' . e(url($href)) . '"' . ($active ? ' aria-current="page"' : '') . ' class="'
        . e(cls('block border-b-2 px-0.5 py-3 font-mono text-[0.71875rem] font-medium tracking-[0.14em] whitespace-nowrap uppercase transition-colors', $active ? 'border-ivory text-ivory' : 'border-transparent text-mute-d hover:text-ivory'))
        . '">' . e($label) . '</a></li>';
};
?>
<nav aria-label="Test series categories" class="border-y border-[var(--line-d)]">
  <div class="container-v flex gap-x-10 max-lg:flex-col">
    <div class="flex min-w-0 items-center gap-6 overflow-x-auto">
      <span class="eyebrow shrink-0 text-ivory">By exam</span>
      <ul class="flex gap-6">
        <?= $item('/test-series', 'All') ?>
        <?php foreach ($ts['testSeriesExams'] ?? [] as $x): ?><?= $item('/test-series/' . $x['code'], $x['label']) ?><?php endforeach; ?>
      </ul>
    </div>
    <span aria-hidden="true" class="my-3 w-px bg-[var(--line-d)] max-lg:hidden"></span>
    <div class="flex min-w-0 items-center gap-6 overflow-x-auto max-lg:border-t max-lg:border-[var(--line-d)]">
      <span class="eyebrow shrink-0 text-ivory">By format</span>
      <ul class="flex gap-6"><?php foreach ($ts['testSeriesFormats'] ?? [] as $f): ?><?= $item('/test-series/format/' . $f['id'], $f['short']) ?><?php endforeach; ?></ul>
    </div>
  </div>
</nav>
