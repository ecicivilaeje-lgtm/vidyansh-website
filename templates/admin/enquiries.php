<?php /** @var array $rows @var string $status */
$tabs = ['' => 'All', 'new' => 'New', 'done' => 'Done'];
?>
<div class="flex flex-wrap items-end justify-between gap-4">
  <div>
    <p class="eyebrow">From the contact form</p>
    <h1 class="mt-3 text-[clamp(2.5rem,5vw,3.75rem)] leading-[0.95]">Enquiries</h1>
  </div>
  <a href="<?= e(url('/admin/enquiries?export=csv')) ?>" class="border border-ivory/30 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] hover:border-ivory">Download Excel (CSV)</a>
</div>
<nav aria-label="Filter" class="mt-6 flex gap-1">
  <?php foreach ($tabs as $k => $l): ?>
    <a href="<?= e(url('/admin/enquiries' . ($k ? "?status=$k" : ''))) ?>"<?= $status === $k ? ' aria-current="page"' : '' ?> class="border border-ivory/20 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] aria-[current=page]:border-ivory aria-[current=page]:bg-ivory aria-[current=page]:text-ink"><?= e($l) ?></a>
  <?php endforeach; ?>
</nav>
<?php if (!$rows): ?>
  <p class="mt-8 border-y border-[var(--line-d)] py-10 text-center text-mute-d">No enquiries here yet.</p>
<?php else: ?>
  <ul class="mt-6 border-t-2 border-ivory">
    <?php foreach ($rows as $r): $data = json_decode($r['data'] ?? '', true) ?: []; ?>
      <li class="border-b border-[var(--line-d)]">
        <a href="<?= e(url('/admin/enquiries/' . $r['id'])) ?>" class="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
          <span class="min-w-0">
            <span class="font-medium"><?= e($r['name'] ?: 'No name') ?></span>
            <?php if ($r['status'] === 'new'): ?><span class="ml-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-champagne">New</span><?php endif; ?>
            <span class="block text-[0.9375rem] text-body-d"><?= e(implode(' · ', array_filter([$r['phone'], $r['email']]))) ?></span>
            <span class="block truncate text-[0.875rem] text-mute-d"><?= e($r['subject'] ?: mb_strimwidth((string) $r['message'], 0, 100, '…')) ?></span>
          </span>
          <span class="font-mono text-[0.75rem] text-mute-d"><?= e(date('j M Y, g:i a', strtotime($r['created_at']))) ?></span>
        </a>
      </li>
    <?php endforeach; ?>
  </ul>
<?php endif; ?>
