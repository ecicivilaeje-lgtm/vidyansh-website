<?php /** @var string $name @var array $schema @var ?array $row @var array $values @var array $errors */
$base = "/admin/c/$name";
$action = $row ? "$base/{$row['_id']}" : "$base/new";
$view = ($row && isset($schema['view']) && $row['_published']) ? $schema['view']($values + $row) : null;
$published = $row ? $row['_published'] : true;
?>
<a href="<?= e(url($base)) ?>" class="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-mute-d hover:text-ivory">← <?= e($schema['label']) ?></a>
<div class="mt-3 flex flex-wrap items-end justify-between gap-4">
  <h1 class="text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[0.95]"><?= $row ? 'Edit' : 'New' ?> <em class="font-normal"><?= e($schema['item']) ?></em></h1>
  <?php if ($view): ?><a href="<?= e(url($view)) ?>" target="_blank" rel="noopener" class="border border-ivory/25 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] hover:border-ivory">View on website ↗</a><?php endif; ?>
</div>
<?php if ($errors): ?><p role="alert" class="mt-6 border-l-2 border-bad bg-bad/10 px-4 py-3 text-[0.9375rem]">Some fields need attention. They are marked below.</p><?php endif; ?>

<form method="post" action="<?= e(url($action)) ?>" data-admin-form class="mt-8 grid gap-6" novalidate>
  <?= csrf_field() ?>
  <?= admin_render_fields($schema['fields'], $values, $errors) ?>

  <div class="admin-field">
    <input type="hidden" name="published" value="0">
    <label class="inline-flex cursor-pointer items-center gap-3 text-[0.9375rem] font-medium"><input type="checkbox" name="published" value="1" class="size-5 accent-[#070706]"<?= $published ? ' checked' : '' ?>> Show on the website</label>
  </div>

  <div class="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-[var(--line-d)] bg-ink/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8">
    <?= button('Save', ['type' => 'submit', 'diamond' => true]) ?>
    <?= button('Save and close', ['type' => 'submit', 'variant' => 'ghost', 'attrs' => 'name="save_close" value="1"']) ?>
    <a href="<?= e(url($base)) ?>" class="px-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-mute-d hover:text-ivory">Cancel</a>
  </div>
</form>

<?php if ($row): ?>
  <div class="mt-14 flex flex-wrap items-center gap-4 border-t border-[var(--line-d)] pt-6">
    <a href="<?= e(url("$base/new?copy={$row['_id']}")) ?>" class="border border-ivory/25 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] hover:border-ivory">Duplicate</a>
    <form method="post" action="<?= e(url("$base/{$row['_id']}/delete")) ?>" data-confirm="Delete this <?= e($schema['item']) ?> for good? This cannot be undone. (To take it off the website for now, untick “Show on the website” instead.)">
      <?= csrf_field() ?>
      <button class="border border-bad/50 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-bad hover:border-bad">Delete</button>
    </form>
  </div>
<?php endif; ?>
