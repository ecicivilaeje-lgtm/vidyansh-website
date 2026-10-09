<?php
/**
 * The arrivals board (the original ArrivalsBoard): year tabs, an exam filter and a split-flap table.
 * Server-rendered for the first year and all exams; assets/js/catalog-results.js turns the board over.
 * @var array $board
 */
$years = array_values($board['years'] ?? []);
$year = $years[0] ?? '';
$exams = $board['exams'] ?? [];
$isSample = !empty($board['isSample']);
$rows = array_values(array_filter($board['rows'] ?? [], fn($r) => ($r['year'] ?? '') === $year));
$id = 'arrivals';
$columns = ['Student', 'From', 'Destination', 'Rank', 'Year'];
$examLabel = 'all exams';
?>
<div data-arrivals-board>
  <script type="application/json" data-board><?= json_script(['years' => $years, 'exams' => $exams, 'isSample' => $isSample, 'rows' => $board['rows'] ?? []]) ?></script>
  <div class="grid gap-8 border-b border-ivory/40 pb-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end lg:gap-16">
    <div>
      <p class="eyebrow" id="<?= $id ?>-years">Year</p>
      <div role="tablist" aria-labelledby="<?= $id ?>-years" class="mt-3 flex gap-8">
        <?php foreach ($years as $y): $on = $y === $year; ?>
          <button type="button" role="tab" id="<?= $id ?>-tab-<?= e($y) ?>" aria-selected="<?= $on ? 'true' : 'false' ?>" aria-controls="<?= $id ?>-panel" tabindex="<?= $on ? '0' : '-1' ?>" data-year="<?= e($y) ?>"
            class="<?= e(cls('border-b pb-1 font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-none tabular-nums transition-colors duration-500 ease-out-expo', $on ? 'border-ivory text-ivory italic' : 'border-transparent text-mute-d hover:text-ivory')) ?>"><?= e($y) ?></button>
        <?php endforeach; ?>
      </div>
    </div>

    <div role="group" aria-label="Filter by exam" class="flex flex-wrap gap-x-6 gap-y-3 lg:justify-self-end">
      <?php foreach ([['code' => 'all', 'label' => 'All exams'], ...$exams] as $e): $on = $e['code'] === 'all'; ?>
        <button type="button" aria-pressed="<?= $on ? 'true' : 'false' ?>" data-exam="<?= e($e['code']) ?>"
          class="<?= e(cls('border-b py-1 font-mono text-[0.75rem] font-medium tracking-[0.17em] uppercase transition-colors duration-300', $on ? 'border-ivory text-ivory' : 'border-transparent text-mute-d hover:text-ivory')) ?>"><?= e($e['label']) ?></button>
      <?php endforeach; ?>
    </div>
  </div>

  <p aria-live="polite" data-summary class="eyebrow mt-5"><?= count($rows) ?> <?= $isSample ? 'sample ' : '' ?><?= count($rows) === 1 ? 'arrival' : 'arrivals' ?> · <?= e($year) ?> · <?= e($examLabel) ?></p>

  <div role="tabpanel" id="<?= $id ?>-panel" aria-labelledby="<?= $id ?>-tab-<?= e($year) ?>" tabindex="0" class="mt-6 outline-offset-8">
    <table class="arrivals stack-table w-full border-collapse font-mono">
      <caption class="sr-only" data-caption>Arrivals board for <?= e($year) ?>, <?= e($examLabel) ?><?= $isSample ? '. Sample rows; verified results will replace them' : '' ?></caption>
      <thead>
        <tr class="eyebrow text-left">
          <?php foreach ($columns as $h): ?>
            <th scope="col" class="<?= e(cls('border-b border-[var(--line-d)] py-3 pr-4 font-medium', $h === 'Year' ? 'text-right' : '')) ?>"><?= e($h) ?></th>
          <?php endforeach; ?>
        </tr>
      </thead>
      <tbody data-rows>
        <?php if (!$rows): ?>
          <tr><td colspan="5" class="border-b border-[var(--line-d)] py-10 text-body-d">No arrivals on this board yet.</td></tr>
        <?php else: foreach ($rows as $ri => $r): ?>
          <tr>
            <td class="border-b border-[var(--line-d)] py-4 pr-4 align-middle"><?= catalog_flap_text((string) ($r['student'] ?? ''), $ri * 3) ?></td>
            <td data-label="From" class="border-b border-[var(--line-d)] py-4 pr-4 align-middle"><?= catalog_flap_text((string) ($r['from'] ?? ''), $ri * 3 + 6) ?></td>
            <td data-label="Destination" class="border-b border-[var(--line-d)] py-4 pr-4 align-middle"><?= catalog_flap_text((string) ($r['destination'] ?? ''), $ri * 3 + 8) ?></td>
            <td data-label="Rank" class="border-b border-[var(--line-d)] py-4 pr-4 align-middle"><?= catalog_flap_text((string) ($r['rank'] ?? ''), $ri * 3 + 20) ?></td>
            <td data-label="Year" class="border-b border-[var(--line-d)] py-4 text-right align-middle"><?= catalog_flap_text((string) ($r['year'] ?? ''), $ri * 3 + 22) ?></td>
          </tr>
        <?php endforeach; endif; ?>
      </tbody>
    </table>
  </div>
</div>
