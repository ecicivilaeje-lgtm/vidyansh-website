<?php /** @var string $name @var array $meta @var array $fields @var array $values @var array $errors */ ?>
<p class="eyebrow"><?= e($meta['group']) ?></p>
<h1 class="mt-3 text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[0.95]"><?= e($meta['label']) ?></h1>
<?php if (!empty($meta['help'])): ?><p class="mt-4 max-w-[60ch] text-body-d"><?= e($meta['help']) ?></p><?php endif; ?>

<form method="post" action="<?= e(url("/admin/b/$name")) ?>" data-admin-form class="mt-8 grid gap-6" novalidate>
  <?= csrf_field() ?>
  <?= admin_render_fields($fields, $values, $errors) ?>
  <div class="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-[var(--line-d)] bg-ink/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8">
    <?= button('Save', ['type' => 'submit', 'diamond' => true]) ?>
  </div>
</form>
