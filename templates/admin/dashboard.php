<?php /** @var array $counts @var int $newEnquiries @var array $recent */
$cols = admin_collections();
$quick = ['courses', 'test_series', 'blog_posts', 'result_rows', 'faculty_members', 'live_classes', 'study_materials', 'papers'];
?>
<p class="eyebrow">Dashboard</p>
<h1 class="mt-3 text-[clamp(2.5rem,5vw,3.75rem)] leading-[0.95]">Namaste, <em class="font-normal"><?= e(admin_user()['name']) ?></em></h1>
<p class="mt-4 max-w-[52ch] text-body-d">Everything on the website can be changed from here. Pick what you want to edit from the menu. Changes appear on the website as soon as you press Save.</p>

<section class="mt-10" aria-labelledby="enq-title">
  <div class="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ivory pb-3">
    <h2 id="enq-title" class="text-[1.75rem]">Enquiries <?php if ($newEnquiries): ?><span class="ml-2 bg-ivory px-2 align-middle font-mono text-[0.75rem] text-ink"><?= $newEnquiries ?> new</span><?php endif; ?></h2>
    <a href="<?= e(url('/admin/enquiries')) ?>" class="link-underline font-mono text-[0.75rem] uppercase tracking-[0.14em]">See all</a>
  </div>
  <?php if (!$recent): ?>
    <p class="py-6 text-mute-d">No enquiries yet. When someone sends the contact form, it shows up here.</p>
  <?php else: ?>
    <ul>
      <?php foreach ($recent as $r): ?>
        <li class="border-b border-[var(--line-d)]">
          <a href="<?= e(url('/admin/enquiries/' . $r['id'])) ?>" class="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-6">
            <span class="min-w-0"><span class="font-medium"><?= e($r['name'] ?: 'No name') ?></span><?php if ($r['status'] === 'new'): ?> <span class="ml-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-champagne">New</span><?php endif; ?>
              <span class="block truncate text-[0.9375rem] text-mute-d"><?= e($r['subject'] ?: mb_strimwidth((string) $r['message'], 0, 90, '…')) ?></span></span>
            <span class="font-mono text-[0.75rem] text-mute-d"><?= e(date('j M, g:i a', strtotime($r['created_at']))) ?></span>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>
  <?php endif; ?>
</section>

<section class="mt-14" aria-labelledby="quick-title">
  <h2 id="quick-title" class="border-b-2 border-ivory pb-3 text-[1.75rem]">Most used</h2>
  <ul class="grid sm:grid-cols-2">
    <?php foreach ($quick as $q): $c = $cols[$q]; ?>
      <li class="border-b border-[var(--line-d)] sm:odd:border-r sm:odd:pr-6 sm:even:pl-6">
        <div class="flex items-center justify-between gap-4 py-4">
          <a href="<?= e(url("/admin/c/$q")) ?>" class="group grid">
            <span class="font-display text-[1.5rem] leading-tight group-hover:italic"><?= e($c['label']) ?></span>
            <span class="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-mute-d"><?= $counts[$q] ?> <?= e($counts[$q] === 1 || str_ends_with($c['item'], 's') ? $c['item'] : $c['item'] . 's') ?></span>
          </a>
          <a href="<?= e(url("/admin/c/$q/new")) ?>" class="shrink-0 border border-ivory/30 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] hover:border-ivory">+ Add</a>
        </div>
      </li>
    <?php endforeach; ?>
  </ul>
</section>

<section class="mt-14 grid gap-3 border-l-2 border-ivory py-1 pl-5 text-[0.9375rem] text-body-d">
  <h2 class="text-[1.5rem] text-ivory">Before going live</h2>
  <p>Replace the sample text: <a class="link-underline" href="<?= e(url('/admin/b/site')) ?>">contact details</a>, <a class="link-underline" href="<?= e(url('/admin/c/faculty_members')) ?>">faculty</a>, <a class="link-underline" href="<?= e(url('/admin/c/result_rows')) ?>">results</a> (only verified, with each student's consent), <a class="link-underline" href="<?= e(url('/admin/c/live_classes')) ?>">class dates</a> and <a class="link-underline" href="<?= e(url('/admin/b/policies')) ?>">policies</a>. Untick "Is sample" in <a class="link-underline" href="<?= e(url('/admin/b/results')) ?>">Results settings</a> once results are real.</p>
</section>
