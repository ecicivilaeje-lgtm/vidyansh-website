<?php
/** Minimal open footer: logo and tagline, three link columns, contact. */
$s = site();
$brand = $s['brand'];
$contact = $s['contact'];
?>
<footer class="bg-ink pt-[var(--space-block)] pb-[calc(2rem+env(safe-area-inset-bottom))]">
  <div class="container-v">
    <div class="grid gap-14 border-t border-ivory/40 pt-12 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.2fr] lg:gap-10">
      <div class="grid content-start gap-5">
        <?= logo(150, 'size-28 sm:size-32') ?>
        <p class="font-display text-[1.6rem] leading-tight italic"><?= e($brand['tagline']) ?></p>
      </div>
      <div class="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-3">
        <?php foreach ($s['footerColumns'] as $col): ?>
          <nav aria-label="<?= e($col['title']) ?> links" class="grid content-start gap-4">
            <p class="eyebrow"><?= e($col['title']) ?></p>
            <ul class="grid gap-2.5">
              <?php foreach ($col['links'] as $l): ?>
                <li><a href="<?= e(url($l['href'])) ?>" class="link-underline text-body-d transition-colors hover:text-ivory"><?= e($l['label']) ?></a></li>
              <?php endforeach; ?>
            </ul>
          </nav>
        <?php endforeach; ?>
      </div>
      <div class="grid content-start gap-4">
        <p class="eyebrow">Visit</p>
        <address class="leading-relaxed not-italic text-body-d"><?= e($contact['centre']) ?><br><?= e(implode(', ', $contact['addressLines'])) ?></address>
        <p class="eyebrow mt-3">Contact</p>
        <p class="leading-relaxed text-body-d"><?= e($contact['phone']) ?><br><?= e($contact['email']) ?></p>
      </div>
    </div>
    <div class="mt-[var(--space-block)] flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-t border-[var(--line-d)] pt-6">
      <p class="eyebrow">© <?= date('Y') ?> <?= e($brand['name']) ?> · <?= e($brand['byline']) ?> · Hindi and English</p>
      <p class="eyebrow flex flex-wrap gap-x-3">
        <a href="<?= e(url('/privacy')) ?>" class="hover:text-ivory">Privacy</a><span aria-hidden="true">·</span>
        <a href="<?= e(url('/terms')) ?>" class="hover:text-ivory">Terms</a><span aria-hidden="true">·</span>
        <a href="<?= e(url('/refunds')) ?>" class="hover:text-ivory">Refunds</a><span aria-hidden="true">·</span>
        <a href="#top" class="hover:text-ivory">Back to top ↑</a>
      </p>
    </div>
  </div>
</footer>
