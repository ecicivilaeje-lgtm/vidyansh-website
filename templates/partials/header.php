<?php
/** Site header and full-screen menu. Behaviour (hide on scroll, menu dialog) lives in assets/js/site.js. */
$s = site();
$home = current_path() === '/';
?>
<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ivory focus:px-4 focus:py-3 focus:text-ink">Skip to content</a>
<header data-site-header data-home="<?= $home ? 'true' : 'false' ?>"
  class="<?= e(cls('fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[transform,background-color,border-color] duration-500 ease-out-expo', $home ? 'border-b border-transparent' : 'border-b border-[var(--line-d)] bg-ink/85 backdrop-blur-xl')) ?>"
  data-scrolled-class="border-[var(--line-d)] bg-ink/85 backdrop-blur-xl" data-top-class="border-transparent">
  <div class="container-v flex h-[var(--header-h)] items-center justify-between gap-6">
    <a href="<?= e(url('/')) ?>" aria-label="Vidyansh, home" class="shrink-0"><?= logo(48, 'size-11 sm:size-12', true, true) ?></a>

    <nav aria-label="Main" class="hidden items-stretch lg:flex">
      <?php foreach ($s['pillars'] as $p):
        $current = !str_starts_with($p['href'], '/#') && path_starts($p['href']); ?>
        <a href="<?= e(url($p['href'])) ?>"<?= $current ? ' aria-current="page"' : '' ?> class="group relative grid gap-0.5 border-l border-[var(--line-d)] px-5 py-1.5 first:border-l-0">
          <?php if ($current): ?><span aria-hidden="true" class="absolute inset-x-5 -bottom-[0.95rem] h-px bg-ivory"></span><?php endif; ?>
          <span class="<?= e(cls('font-mono text-[0.5625rem] font-medium tracking-[0.22em] uppercase transition-colors group-hover:text-ivory', $current ? 'text-ivory' : 'text-mute-d')) ?>"><?= e($p['verb']) ?></span>
          <span class="font-mono text-[0.71875rem] font-medium tracking-[0.15em] text-ivory uppercase"><?= e($p['label']) ?></span>
        </a>
      <?php endforeach; ?>
      <span aria-hidden="true" class="mx-4 my-2 w-px bg-[var(--line-d)]"></span>
      <?php foreach ($s['secondaryNav'] as $l): ?>
        <a href="<?= e(url($l['href'])) ?>"<?= path_starts($l['href']) ? ' aria-current="page"' : '' ?> class="self-center px-3 font-mono text-[0.6875rem] font-medium tracking-[0.15em] text-mute-d uppercase transition-colors hover:text-ivory aria-[current=page]:text-ivory"><?= e($l['label']) ?></a>
      <?php endforeach; ?>
    </nav>

    <div class="flex items-center gap-5">
      <?= button('Book a call', [
        'href' => '/contact', 'size' => 'sm',
        'class' => cls('hidden transition-opacity sm:inline-flex', $home ? 'pointer-events-none opacity-0' : 'opacity-100'),
        'attrs' => 'data-header-cta',
      ]) ?>
      <button type="button" data-menu-open aria-expanded="false" aria-controls="site-menu" class="flex items-center gap-3 py-3 font-mono text-[0.71875rem] font-medium tracking-[0.16em] uppercase">
        Menu
        <span aria-hidden="true" class="grid gap-[5px]"><span class="block h-px w-6 bg-current"></span><span class="block h-px w-6 bg-current"></span></span>
      </button>
    </div>
  </div>
</header>

<div id="site-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden
  class="fixed inset-0 z-[60] grid grid-cols-1 gap-10 overflow-y-auto bg-ink px-[var(--gutter)] pt-[calc(6rem+env(safe-area-inset-top))] pb-10 md:grid-cols-[1.3fr_1fr]">
  <button type="button" data-menu-close class="absolute top-[calc(1.25rem+env(safe-area-inset-top))] right-[var(--gutter)] border border-[var(--line-d)] px-4 py-2.5 font-mono text-[0.6875rem] tracking-[0.16em] uppercase hover:border-ivory">Close ✕</button>
  <nav aria-label="Menu links">
    <ol class="border-t border-[var(--line-d)]">
      <?php foreach ($s['menuLinks'] as $i => $l): ?>
        <li>
          <a href="<?= e(url($l['href'])) ?>" class="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-[var(--line-d)] py-3.5">
            <span class="font-mono text-xs text-mute-d"><?= pad2($i + 1) ?></span>
            <span class="font-display text-[clamp(2.1rem,5vw,4rem)] leading-none transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-2.5 group-hover:italic"><?= e($l['label']) ?></span>
            <span class="font-mono text-xs text-mute-d"><?= e($l['hint'] ?? '') ?></span>
          </a>
        </li>
      <?php endforeach; ?>
    </ol>
  </nav>
  <aside class="grid content-end gap-6">
    <p class="eyebrow">Counselling desk</p>
    <p class="max-w-sm text-[0.9375rem] text-mute-d">Speak to the Vidyansh team about the right course or test series for you. <?= e($s['contact']['phone']) ?>.</p>
    <?= button('Book a counselling call', ['href' => '/contact', 'class' => 'justify-self-start']) ?>
    <p class="eyebrow">Hindi · English</p>
  </aside>
</div>
