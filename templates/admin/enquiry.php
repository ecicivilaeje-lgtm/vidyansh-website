<?php /** @var array $enquiry */
$r = $enquiry;
$data = json_decode($r['data'] ?? '', true) ?: [];
$phoneDigits = preg_replace('/\D+/', '', (string) $r['phone']);
$wa = strlen($phoneDigits) === 10 ? '91' . $phoneDigits : $phoneDigits;
?>
<a href="<?= e(url('/admin/enquiries')) ?>" class="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-mute-d hover:text-ivory">← Enquiries</a>
<h1 class="mt-3 text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[0.95]"><?= e($r['name'] ?: 'No name') ?></h1>
<p class="mt-3 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-mute-d"><?= e(date('j F Y, g:i a', strtotime($r['created_at']))) ?> · <?= $r['status'] === 'new' ? 'New' : 'Done' ?></p>

<div class="mt-6 flex flex-wrap gap-2">
  <?php if ($phoneDigits): ?>
    <a href="tel:<?= e($r['phone']) ?>" class="border border-ivory bg-ivory px-4 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink">Call</a>
    <a href="https://wa.me/<?= e($wa) ?>" target="_blank" rel="noopener" class="border border-ivory px-4 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em]">WhatsApp</a>
  <?php endif; ?>
  <?php if ($r['email']): ?><a href="mailto:<?= e($r['email']) ?>" class="border border-ivory px-4 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em]">Email</a><?php endif; ?>
</div>

<dl class="mt-8 border-t-2 border-ivory">
  <?php foreach (['Phone' => $r['phone'], 'Email' => $r['email'], 'Subject' => $r['subject']] as $k => $v): if ($v === '' || $v === null) continue; ?>
    <div class="grid gap-1 border-b border-[var(--line-d)] py-3 sm:grid-cols-[12rem_minmax(0,1fr)]"><dt class="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-mute-d"><?= e($k) ?></dt><dd class="break-words"><?= e($v) ?></dd></div>
  <?php endforeach; ?>
  <?php foreach ($data as $k => $v): if ($v === '' || $v === null || $v === []) continue; ?>
    <div class="grid gap-1 border-b border-[var(--line-d)] py-3 sm:grid-cols-[12rem_minmax(0,1fr)]"><dt class="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-mute-d"><?= e(admin_humanize((string) $k)) ?></dt><dd class="break-words"><?= e(is_array($v) ? implode(', ', $v) : $v) ?></dd></div>
  <?php endforeach; ?>
</dl>
<?php if (trim((string) $r['message']) !== ''): ?>
  <h2 class="mt-10 text-[1.5rem]">Message</h2>
  <p class="mt-3 max-w-[60ch] whitespace-pre-line text-body-d"><?= e($r['message']) ?></p>
<?php endif; ?>

<div class="mt-12 flex flex-wrap items-center gap-3 border-t border-[var(--line-d)] pt-6">
  <form method="post" action="<?= e(url('/admin/enquiries/' . $r['id'] . '/status')) ?>"><?= csrf_field() ?><input type="hidden" name="back" value="/admin/enquiries"><?= button($r['status'] === 'new' ? 'Mark as done' : 'Mark as new', ['type' => 'submit', 'size' => 'sm']) ?></form>
  <form method="post" action="<?= e(url('/admin/enquiries/' . $r['id'] . '/delete')) ?>" data-confirm="Delete this enquiry for good?"><?= csrf_field() ?><button class="border border-bad/50 px-3 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-bad hover:border-bad">Delete</button></form>
</div>
