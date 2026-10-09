<?php /** @var string $name @var array $schema @var array $rows @var ?array $filter @var string $active */
$base = "/admin/c/$name";
$q = $active !== '' ? '?filter=' . urlencode($active) : '';
$back = $base . $q;
$total = count($rows);
?>
<div class="flex flex-wrap items-end justify-between gap-4">
  <div>
    <p class="eyebrow"><?= e($schema['group']) ?></p>
    <h1 class="mt-3 text-[clamp(2.5rem,5vw,3.75rem)] leading-[0.95]"><?= e($schema['label']) ?></h1>
  </div>
  <?= button('+ Add ' . e($schema['item']), ['href' => $base . '/new' . $q, 'size' => 'sm']) ?>
</div>
<?php if (!empty($schema['help'])): ?><p class="mt-4 max-w-[60ch] text-body-d"><?= e($schema['help']) ?></p><?php endif; ?>

<?php if ($filter): $opts = admin_options($filter['options']); ?>
  <form method="get" class="mt-6 flex flex-wrap items-center gap-3">
    <label for="list-filter" class="text-[0.9375rem] font-medium"><?= e($filter['label']) ?></label>
    <select id="list-filter" name="filter" class="<?= e(admin_input_class()) ?> max-w-[22rem]" onchange="this.form.submit()">
      <option value="">All</option>
      <?php foreach ($opts as $v => $l): ?><option value="<?= e($v) ?>"<?= (string) $v === $active ? ' selected' : '' ?>><?= e($l) ?></option><?php endforeach; ?>
    </select>
    <noscript><button class="border border-ivory px-3 py-2 font-mono text-[0.6875rem] uppercase">Show</button></noscript>
  </form>
<?php endif; ?>

<?php if (!$rows): ?>
  <p class="mt-10 border-y border-[var(--line-d)] py-10 text-center text-mute-d">Nothing here yet. Press "Add <?= e($schema['item']) ?>" to create the first one.</p>
<?php else: ?>
  <ol class="mt-8 border-t-2 border-ivory">
    <?php foreach ($rows as $i => $r):
      $title = $r[$schema['title']] ?? '';
      if (is_array($title)) $title = implode(' ', $title);
      $sub = $r[$schema['subtitle']] ?? '';
      if (is_array($sub)) $sub = implode(' ', $sub);
      $edit = url("$base/{$r['_id']}");
      $view = isset($schema['view']) ? $schema['view']($r) : null;
    ?>
      <li class="<?= e(cls('grid gap-3 border-b border-[var(--line-d)] py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center', $r['_published'] ? '' : 'opacity-60')) ?>">
        <span class="hidden font-mono text-[0.75rem] text-mute-d sm:block"><?= pad2($i + 1) ?></span>
        <a href="<?= e($edit) ?>" class="group min-w-0">
          <span class="block truncate font-display text-[1.5rem] leading-tight group-hover:italic"><?= e($title !== '' ? $title : '(untitled)') ?></span>
          <span class="block truncate text-[0.875rem] text-mute-d"><?= $r['_published'] ? '' : '<span class="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-bad">Hidden · </span>' ?><?= e(is_scalar($sub) ? (string) $sub : '') ?></span>
        </a>
        <div class="flex flex-wrap items-center gap-1.5">
          <a href="<?= e($edit) ?>" class="border border-ivory px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] hover:bg-ivory hover:text-ink">Edit</a>
          <?php if ($view && $r['_published']): ?><a href="<?= e(url($view)) ?>" target="_blank" rel="noopener" class="border border-ivory/25 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] hover:border-ivory">View ↗</a><?php endif; ?>
          <?php if (!$active): ?>
            <form method="post" action="<?= e(url("$base/{$r['_id']}/move")) ?>" class="contents"><?= csrf_field() ?><input type="hidden" name="back" value="<?= e($back) ?>">
              <button name="dir" value="up" class="grid size-9 place-items-center border border-ivory/25 hover:border-ivory disabled:opacity-30" aria-label="Move <?= e($title) ?> up"<?= $i === 0 ? ' disabled' : '' ?>>↑</button>
              <button name="dir" value="down" class="grid size-9 place-items-center border border-ivory/25 hover:border-ivory disabled:opacity-30" aria-label="Move <?= e($title) ?> down"<?= $i === $total - 1 ? ' disabled' : '' ?>>↓</button>
            </form>
          <?php endif; ?>
          <form method="post" action="<?= e(url("$base/{$r['_id']}/toggle")) ?>" class="contents"><?= csrf_field() ?><input type="hidden" name="back" value="<?= e($back) ?>">
            <button class="border border-ivory/25 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] hover:border-ivory"><?= $r['_published'] ? 'Hide' : 'Show' ?></button>
          </form>
        </div>
      </li>
    <?php endforeach; ?>
  </ol>
  <p class="mt-4 text-[0.875rem] text-mute-d">The order here is the order on the website. "Hide" removes an item from the website without deleting it.</p>
<?php endif; ?>
