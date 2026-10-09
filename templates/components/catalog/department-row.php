<?php
/**
 * A ruled masthead row (the original DepartmentRow): the department in display type, its subjects in mono,
 * and its faculty. Teachers added in the admin panel fill the profile slots; the rest stay "to come".
 * @var array $dept  @var int $index  @var array $members
 */
$members = $members ?? [];
$empty = max(0, (int) ($dept['slots'] ?? 0) - count($members));
?>
<li id="<?= e($dept['id']) ?>" class="group grid gap-8 border-b border-[var(--line-l)] py-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-12 lg:gap-[clamp(1.5rem,3vw,3rem)]">
  <div class="lg:col-span-5">
    <span class="font-mono text-[0.6875rem] tracking-[0.14em] text-mute-l"><?= pad2($index + 1) ?></span>
    <h3 class="mt-3 text-[clamp(2.6rem,5vw,4.75rem)] leading-[0.9] tracking-[-0.025em] group-hover:italic"><?= e($dept['name'] ?? '') ?></h3>
    <p class="mt-5 max-w-[36ch] text-mute-l"><?= e($dept['summary'] ?? '') ?></p>
  </div>

  <div class="lg:col-span-4">
    <p class="eyebrow">Subjects</p>
    <ul class="mt-4 grid gap-2 font-mono text-[0.8125rem] tracking-[0.04em] text-ink">
      <?php foreach ($dept['subjects'] ?? [] as $s): ?>
        <li class="flex gap-3"><span aria-hidden="true" class="text-mute-l">—</span><?= e($s) ?></li>
      <?php endforeach; ?>
    </ul>
  </div>

  <div class="lg:col-span-3">
    <p class="eyebrow">Faculty</p>
    <ul class="mt-4 grid gap-3">
      <?php foreach ($members as $m): ?>
        <li id="faculty-<?= e($m['slug'] ?? '') ?>" class="grid grid-cols-[3.25rem_minmax(0,1fr)] items-start gap-4 border-t border-[var(--line-l)] pt-3">
          <?php if (!empty($m['photo'])): ?>
            <img src="<?= e(media($m['photo'])) ?>" alt="<?= e('Portrait of ' . ($m['name'] ?? '')) ?>" loading="lazy" decoding="async" class="block aspect-[4/5] w-full border border-ink/20 object-cover">
          <?php else: ?>
            <?php /* Inside .plate-sheet the ink and ivory tokens swap, so "ivory" here is the dark line colour. */ ?>
            <span aria-hidden="true" class="plate-sheet relative block aspect-[4/5] overflow-hidden border border-ivory/20">
              <span class="absolute top-[22%] left-1/2 size-[34%] -translate-x-1/2 rounded-full border border-ivory/25"></span>
              <span class="absolute inset-x-[18%] bottom-0 h-[34%] rounded-t-[50%] border border-b-0 border-ivory/25"></span>
            </span>
          <?php endif; ?>
          <span class="grid gap-0.5">
            <span class="font-display text-[1.25rem] leading-tight"><?= e($m['name'] ?? '') ?></span>
            <span class="font-mono text-[0.625rem] tracking-[0.14em] text-mute-l uppercase"><?= e(!empty($m['role']) ? $m['role'] : ($dept['name'] ?? '')) ?></span>
            <?php if (trim((string) ($m['subjects'] ?? '')) !== ''): ?>
              <span class="mt-1.5 font-mono text-[0.6875rem] leading-snug tracking-[0.04em] text-ink"><?= e($m['subjects']) ?></span>
            <?php endif; ?>
            <?php if (trim((string) ($m['bio'] ?? '')) !== ''): ?>
              <span class="mt-1.5 text-[0.9375rem] leading-snug text-mute-l"><?= nl2br(e(trim($m['bio']))) ?></span>
            <?php endif; ?>
          </span>
        </li>
      <?php endforeach; ?>
      <?php for ($i = 0; $i < $empty; $i++): ?>
        <li class="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-4 border-t border-[var(--line-l)] pt-3">
          <span aria-hidden="true" class="relative block aspect-[4/5] border border-ink/20 bg-[repeating-linear-gradient(135deg,rgb(7_7_6/0.06)_0_1px,transparent_1px_7px)]"></span>
          <span class="grid gap-0.5">
            <span class="font-display text-[1.25rem] leading-tight italic">Faculty profile to come</span>
            <span class="font-mono text-[0.625rem] tracking-[0.14em] text-mute-l uppercase"><?= e($dept['name'] ?? '') ?></span>
          </span>
        </li>
      <?php endfor; ?>
    </ul>
  </div>
</li>
