<?php
/** @var string $content @var string $title */
$user = admin_user();
$path = current_path();
$newCount = (int) db()->query("SELECT COUNT(*) FROM enquiries WHERE status = 'new'")->fetchColumn();
$nav = [];
foreach (admin_blocks() as $k => $b) $nav[$b['group']][] = ['href' => "/admin/b/$k", 'label' => $b['label']];
foreach (admin_collections() as $k => $c) $nav[$c['group']][] = ['href' => "/admin/c/$k", 'label' => $c['label']];
$flash = flash();
$link = function (string $href, string $label, string $extra = '') use ($path) {
    $active = $path === $href || ($href !== '/admin' && str_starts_with($path, $href . '/'));
    return '<a href="' . e(url($href)) . '"' . ($active ? ' aria-current="page"' : '') . ' class="flex items-center justify-between gap-3 border-l-2 px-4 py-2 text-[0.9375rem] leading-snug transition-colors ' . ($active ? 'border-ivory bg-ivory/[0.06] font-medium text-ivory' : 'border-transparent text-body-d hover:bg-ivory/[0.04] hover:text-ivory') . '">' . e($label) . $extra . '</a>';
};
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= e($title) ?> · Vidyansh admin</title>
<link rel="icon" href="<?= e(asset('brand/icon.png')) ?>" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;1,500&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap">
<link rel="stylesheet" href="<?= e(asset('css/site.css')) ?>">
<meta name="csrf-token" content="<?= e(csrf_token()) ?>">
<meta name="upload-url" content="<?= e(url('/admin/upload')) ?>">
<meta name="tinymce-base" content="<?= e(url('assets/vendor/tinymce')) ?>">
<script src="<?= e(asset('js/admin.js')) ?>" defer></script>
</head>
<body class="admin text-[1rem]">
<a href="#admin-main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ivory focus:px-4 focus:py-3 focus:text-ink">Skip to content</a>
<div class="min-h-dvh lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
  <aside class="border-b border-[var(--line-d)] bg-night lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:border-r lg:border-b-0">
    <div class="flex items-center justify-between gap-4 px-4 py-3 lg:py-5">
      <a href="<?= e(url('/admin')) ?>" class="flex items-center gap-3">
        <?= logo(40, 'size-10', true) ?>
        <span class="grid leading-tight"><span class="font-display text-[1.375rem]">Vidyansh</span><span class="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute-d">Admin panel</span></span>
      </a>
      <button type="button" data-admin-nav-toggle aria-expanded="false" aria-controls="admin-nav" class="border border-[var(--line-d)] px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] lg:hidden">Menu</button>
    </div>
    <nav id="admin-nav" aria-label="Admin" class="hidden pb-6 lg:block">
      <div class="grid gap-0.5">
        <?= $link('/admin', 'Dashboard') ?>
        <?= $link('/admin/enquiries', 'Enquiries', $newCount ? '<span class="min-w-6 bg-ivory px-1.5 text-center font-mono text-[0.6875rem] leading-5 text-ink">' . $newCount . '</span>' : '') ?>
      </div>
      <?php foreach (ADMIN_GROUPS as $g): if (empty($nav[$g])) continue; ?>
        <p class="mt-5 px-4 pb-1.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.18em] text-mute-d"><?= e($g) ?></p>
        <div class="grid gap-0.5"><?php foreach ($nav[$g] as $n) echo $link($n['href'], $n['label']); ?></div>
      <?php endforeach; ?>
      <p class="mt-5 px-4 pb-1.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.18em] text-mute-d">You</p>
      <div class="grid gap-0.5">
        <?= $link('/admin/account', 'Password & admins') ?>
        <a href="<?= e(url('/')) ?>" target="_blank" rel="noopener" class="flex items-center gap-2 border-l-2 border-transparent px-4 py-2 text-[0.9375rem] text-body-d hover:text-ivory">View website ↗</a>
        <form method="post" action="<?= e(url('/admin/logout')) ?>"><?= csrf_field() ?><button class="w-full border-l-2 border-transparent px-4 py-2 text-left text-[0.9375rem] text-body-d hover:text-ivory">Sign out</button></form>
      </div>
    </nav>
  </aside>

  <main id="admin-main" tabindex="-1" class="min-w-0 outline-none">
    <div class="mx-auto max-w-[62rem] px-4 pt-6 pb-24 sm:px-8 lg:pt-10">
      <?php if ($flash): ?>
        <div role="status" class="<?= e(cls('mb-6 border-l-2 px-4 py-3 text-[0.9375rem]', $flash['type'] === 'ok' ? 'border-ok bg-ok/10' : 'border-bad bg-bad/10')) ?>"><?= e($flash['message']) ?></div>
      <?php endif; ?>
      <?= $content ?>
    </div>
  </main>
</div>
</body>
</html>
