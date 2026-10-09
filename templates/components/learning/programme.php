<?php
/**
 * The weekly programme as an open timetable (the original components/free-classes/Programme):
 * a ruled table on wide screens, a day-by-day list on narrow ones.
 * @var array $entries  @var array $days  @var array $dayNames  @var string $sampleNote
 */
$slots = [['id' => 'morning', 'label' => 'Morning'], ['id' => 'evening', 'label' => 'Evening']];
$at = function (string $d, string $s) use ($entries) {
    foreach ($entries as $e) if (($e['day'] ?? '') === $d && ($e['slot'] ?? '') === $s) return $e;
    return null;
};
?>
<table class="hidden w-full table-fixed border-collapse lg:table">
  <caption class="eyebrow pb-5 text-left">Weekly programme · <?= e($sampleNote) ?></caption>
  <thead>
    <tr class="border-y border-ivory/40">
      <th scope="col" class="w-[7.5rem]"><span class="sr-only">Time of day</span></th>
      <?php foreach ($days as $d): ?>
        <th scope="col" class="border-l border-[var(--line-d)] px-3 py-4 text-left font-mono text-[0.6875rem] font-medium tracking-[0.17em] text-mute-d uppercase"><abbr title="<?= e($dayNames[$d] ?? $d) ?>" class="no-underline"><?= e($d) ?></abbr></th>
      <?php endforeach; ?>
    </tr>
  </thead>
  <tbody>
    <?php foreach ($slots as $s): ?>
      <tr class="border-b border-[var(--line-d)]">
        <th scope="row" class="py-6 pr-3 text-left align-top font-display text-[1.5rem] leading-none font-normal italic"><?= e($s['label']) ?></th>
        <?php foreach ($days as $d): $e = $at($d, $s['id']); ?>
          <td class="h-[11.5rem] border-l border-[var(--line-d)] px-3 py-6 align-top">
            <?php if ($e): ?>
              <div class="grid gap-2">
                <span class="font-display text-[1.3125rem] leading-[1.05]"><?= e($e['subject']) ?></span>
                <span class="text-[0.875rem] leading-snug text-body-d"><?= e($e['topic']) ?></span>
                <span class="font-mono text-[0.625rem] tracking-[0.14em] text-mute-d uppercase"><?= e($e['exam']) ?></span>
              </div>
            <?php else: ?>
              <span class="text-mute-d"><span aria-hidden="true">—</span><span class="sr-only">No class</span></span>
            <?php endif; ?>
          </td>
        <?php endforeach; ?>
      </tr>
    <?php endforeach; ?>
  </tbody>
</table>

<div class="lg:hidden">
  <p class="eyebrow pb-5">Weekly programme · <?= e($sampleNote) ?></p>
  <ul class="border-t border-ivory/40">
    <?php foreach ($days as $d): ?>
      <li class="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-[var(--line-d)] py-5 sm:grid-cols-[9rem_minmax(0,1fr)]">
        <h3 class="font-display text-[1.6rem] leading-none"><?= e($dayNames[$d] ?? $d) ?></h3>
        <dl class="grid gap-4">
          <?php foreach ($slots as $s): $e = $at($d, $s['id']); ?>
            <div class="grid gap-1">
              <dt class="font-mono text-[0.625rem] tracking-[0.16em] text-mute-d uppercase"><?= e($s['label']) ?></dt>
              <dd>
                <?php if ($e): ?>
                  <span class="font-display text-[1.25rem] leading-tight"><?= e($e['subject']) ?></span>
                  <span class="block text-[0.9375rem] text-body-d"><?= e($e['topic']) ?> · <span class="font-mono text-[0.6875rem] tracking-[0.12em] text-mute-d uppercase"><?= e($e['exam']) ?></span></span>
                <?php else: ?>
                  <span class="text-mute-d">No class</span>
                <?php endif; ?>
              </dd>
            </div>
          <?php endforeach; ?>
        </dl>
      </li>
    <?php endforeach; ?>
  </ul>
</div>
