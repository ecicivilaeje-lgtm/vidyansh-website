<?php
/** Faculty: the masthead, the founder's lead feature, the four departments and how we teach. */
page_meta([
    'title' => 'Faculty · Vidyansh',
    'description' => 'Shubham Sir and the Vidyansh faculty: Civil, Electrical, Mechanical, and General Studies & Reasoning for SSC JE, RRB JE and State AE / JE.',
    'canonical' => '/faculty',
]);
$facultyPage = content('faculty')['facultyPage'] ?? [];
$founder = catalog_founder();
$departments = get_departments();
$statements = get_teaching_statements();
$members = catalog_members_by_department();
?>
<?php /* An ink band under the fixed header, then the ivory page. */ ?>
<div aria-hidden="true" class="h-[var(--header-h)] bg-ink"></div>

<?php /* I. The masthead */ ?>
<section aria-labelledby="faculty-title" class="on-light bg-ivory pt-[clamp(4rem,9vw,8rem)] pb-[var(--space-block)] text-ink">
  <div class="container-v">
    <p class="eyebrow"><?= e($facultyPage['eyebrow'] ?? '') ?></p>
    <h1 id="faculty-title" class="mt-6 text-[clamp(4.25rem,14vw,12.5rem)] leading-[0.82] tracking-[-0.045em]">Who <em class="font-normal">teaches</em> here</h1>

    <div class="mt-[var(--space-block)] grid gap-12 border-t-2 border-ink pt-8 lg:grid-cols-12">
      <p class="max-w-[40ch] text-[1.1875rem] text-mute-l lg:col-span-4"><?= e($facultyPage['intro'] ?? '') ?></p>
      <?php /* Credits, set like a magazine masthead. */ ?>
      <dl class="grid gap-x-12 sm:grid-cols-2 lg:col-span-8">
        <div class="flex items-baseline gap-3 border-b border-[var(--line-l)] py-3">
          <dt class="eyebrow shrink-0"><?= e($founder['role'] ?? '') ?></dt>
          <span aria-hidden="true" class="min-w-4 flex-1 border-b border-dotted border-ink/30"></span>
          <dd><a href="#founder-name" class="link-underline font-display text-[1.35rem] leading-none"><?= e($founder['name'] ?? '') ?></a></dd>
        </div>
        <?php foreach ($departments as $d): $names = array_map(fn($m) => $m['name'] ?? '', $members[$d['id']] ?? []); ?>
          <div class="flex items-baseline gap-3 border-b border-[var(--line-l)] py-3">
            <dt class="eyebrow shrink-0"><a href="#<?= e($d['id']) ?>" class="link-underline"><?= e($d['name']) ?></a></dt>
            <span aria-hidden="true" class="min-w-4 flex-1 border-b border-dotted border-ink/30"></span>
            <?php if ($names): ?>
              <dd class="text-right font-display text-[1.2rem] leading-none"><?= e(implode(', ', $names)) ?></dd>
            <?php else: ?>
              <dd class="font-display text-[1.2rem] leading-none text-mute-l italic">To come</dd>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      </dl>
    </div>
  </div>
</section>

<?php /* II. Lead feature */ ?>
<section aria-label="Founder" class="on-light bg-ivory pb-[var(--space-section)] text-ink">
  <div class="container-v">
    <?php partial('components/catalog/founder-feature', ['founder' => $founder]) ?>
  </div>
</section>

<?php /* III. Departments */ ?>
<section aria-labelledby="departments-title" class="on-light border-t border-[var(--line-l)] bg-ivory py-[var(--space-section)] text-ink">
  <div class="container-v">
    <div class="grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
      <div>
        <p class="eyebrow">Departments</p>
        <h2 id="departments-title" class="settle mt-5 text-[clamp(3.25rem,8vw,8rem)] leading-[0.88] tracking-[-0.03em]">Four <em class="font-normal">desks</em></h2>
      </div>
      <p class="max-w-[32ch] text-mute-l md:pb-3">Each department owns its subjects end to end: lectures, notes, practice and doubts.</p>
    </div>
    <ol class="mt-[var(--space-block)] border-t-2 border-ink">
      <?php foreach ($departments as $i => $d) partial('components/catalog/department-row', ['dept' => $d, 'index' => $i, 'members' => $members[$d['id']] ?? []]) ?>
    </ol>
    <p class="eyebrow mt-8">Faculty names and profiles are published only once each teacher has supplied them</p>
  </div>
</section>

<?php /* IV. How we teach */ ?>
<section aria-labelledby="teach-title" class="scene-surface bg-ink py-[var(--space-section)]">
  <div class="container-v">
    <h2 id="teach-title"><span class="eyebrow">How we teach</span></h2>
    <ol class="mt-10 border-t border-ivory/40">
      <?php foreach ($statements as $s):
          $accent = (string) ($s['accent'] ?? '');
          $parts = $accent !== '' ? explode($accent, (string) ($s['statement'] ?? '')) : [(string) ($s['statement'] ?? '')]; ?>
        <li class="grid gap-4 border-b border-[var(--line-d)] py-[clamp(2rem,4vw,3.5rem)] md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,18rem)] md:items-baseline md:gap-8">
          <span class="font-mono text-[0.8125rem] tracking-[0.14em] text-mute-d tabular-nums"><?= e($s['n'] ?? '') ?></span>
          <p class="font-display text-[clamp(2.25rem,5vw,5rem)] leading-[0.95] tracking-[-0.02em] text-balance"><?= e($parts[0]) ?><em class="font-normal"><?= e($accent) ?></em><?= e($parts[1] ?? '') ?></p>
          <p class="text-body-d"><?= e($s['body'] ?? '') ?></p>
        </li>
      <?php endforeach; ?>
    </ol>
    <div class="mt-[var(--space-block)] flex flex-wrap gap-x-12 gap-y-6">
      <a href="<?= e(url('/courses')) ?>" class="group inline-flex items-baseline gap-3 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none">
        <span class="link-underline">See the courses</span>
        <span aria-hidden="true" class="transition-transform duration-500 ease-out-expo group-hover:translate-x-2">→</span>
      </a>
      <a href="<?= e(url('/about')) ?>" class="group inline-flex items-baseline gap-3 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none text-body-d">
        <span class="link-underline">Why Vidyansh <em class="font-normal">exists</em></span>
        <span aria-hidden="true" class="transition-transform duration-500 ease-out-expo group-hover:translate-x-2">→</span>
      </a>
    </div>
  </div>
</section>
