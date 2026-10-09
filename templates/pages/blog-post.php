<?php
/** A guide, set for reading: a ruled title page, a contents rail beside the text, then where to go next. */
$post = get_blog_article($slug);
if (!$post) not_found();
$others = array_values(array_filter(get_blog_posts(), fn($p) => $p['slug'] !== $post['slug']));
$course = null;
foreach (get_courses() as $c) if ($c['exam'] === $post['exam']) { $course = $c; break; }
$series = test_series_for($post['exam']);
$author = $post['author'] ?? '';

page_meta([
    'title' => $post['title'] . ' · Vidyansh',
    'description' => $post['description'] ?? '',
    'canonical' => '/blog/' . $post['slug'],
    'ogType' => 'article',
    'ogTitle' => $post['title'],
    'ogDescription' => $post['description'] ?? '',
    'author' => $author,
    'jsonLd' => [[
        [
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $post['title'],
            'description' => $post['description'] ?? '',
            'author' => ['@type' => 'Person', 'name' => $author],
            'publisher' => ['@type' => 'EducationalOrganization', 'name' => 'Vidyansh'],
            'mainEntityOfPage' => '/blog/' . $post['slug'],
        ],
        [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => array_map(fn($f) => ['@type' => 'Question', 'name' => $f['q'], 'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f['a']]], $post['faq']),
        ],
    ]],
]);
?>
<article class="on-light bg-ivory text-ink">
  <div aria-hidden="true" class="h-[var(--header-h)] bg-ink"></div>

  <header class="on-light container-v pt-[clamp(3.5rem,8vw,7rem)]">
    <nav aria-label="Breadcrumb" class="eyebrow text-mute-l">
      <a class="link-underline" href="<?= e(url('/blog')) ?>">Journal</a><span aria-hidden="true"> / </span><span><?= e($post['examLabel'] ?? '') ?></span>
    </nav>
    <p class="eyebrow mt-10"><?= e($post['category'] ?? '') ?> · <?= e($post['board'] ?? '') ?></p>
    <h1 class="mt-6 max-w-[16ch] text-[clamp(3rem,7.5vw,7.25rem)] leading-[0.88] tracking-[-0.035em]"><?= e($post['title']) ?></h1>
    <p class="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2">
      <span class="font-display text-[1.5rem] italic">By <?= e($author) ?></span>
      <span class="font-mono text-xs tracking-[0.14em] text-mute-l uppercase"><?= (int) $post['readMinutes'] ?> min read</span>
    </p>

    <dl class="mt-[clamp(3rem,6vw,5rem)] grid border-t-2 border-ink sm:grid-cols-3">
      <?php foreach ($post['figures'] ?? [] as $f): ?>
        <div class="grid gap-2 border-b border-[var(--line-l)] py-6 sm:border-b-0 sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0">
          <dt class="order-2 font-mono text-[0.6875rem] tracking-[0.12em] text-mute-l uppercase"><?= e($f['label'] ?? '') ?></dt>
          <dd class="order-1 font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-none tracking-[-0.02em] tabular-nums"><?= e($f['value'] ?? '') ?></dd>
        </div>
      <?php endforeach; ?>
    </dl>
  </header>

  <div class="on-light container-v grid grid-cols-[minmax(0,1fr)] gap-12 pt-[clamp(3rem,6vw,5rem)] pb-[var(--space-block)] lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-[clamp(3rem,7vw,8rem)]">
    <nav aria-label="In this guide" class="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
      <details class="group border-y border-ink lg:hidden">
        <summary class="flex cursor-pointer list-none items-center justify-between py-4 font-mono text-xs font-medium tracking-[0.16em] uppercase [&::-webkit-details-marker]:hidden">In this guide<span aria-hidden="true" class="text-base transition-transform duration-500 ease-out-expo group-open:rotate-45">+</span></summary>
        <ol class="grid gap-1 pb-5">
          <?php foreach ($post['sections'] as $s): ?>
            <li><a href="#<?= e($s['id']) ?>" class="font-display text-[1.25rem] leading-snug"><?= e($s['title']) ?></a></li>
          <?php endforeach; ?>
        </ol>
      </details>
      <div class="hidden lg:block">
        <p class="eyebrow border-t border-ink pt-4">In this guide</p>
        <ol class="mt-5 grid gap-2.5">
          <?php foreach ($post['sections'] as $s): ?>
            <li><a href="#<?= e($s['id']) ?>" class="block font-display text-[1.125rem] leading-snug text-mute-l transition-colors hover:text-ink hover:italic"><?= e($s['title']) ?></a></li>
          <?php endforeach; ?>
        </ol>
      </div>
    </nav>

    <div class="max-w-[44rem]">
      <?php /* Admin-authored article body: printed as HTML. */ ?>
      <div class="article-prose [&>p:first-child]:font-display [&>p:first-child]:text-[clamp(1.375rem,2vw,1.75rem)] [&>p:first-child]:leading-snug"><?= $post['html'] ?></div>
      <aside aria-label="Disclaimer" class="mt-16 border-l-2 border-ink py-1 pl-5 text-[0.9375rem] text-mute-l">
        <p class="eyebrow mb-2 text-ink">Before you rely on it</p>
        <?= e($post['disclaimer'] ?? '') ?>
      </aside>
    </div>
  </div>
</article>

<section aria-labelledby="next-title" class="scene-surface border-t border-[var(--line-d)] bg-night py-[var(--space-block)] text-ivory">
  <div class="container-v grid gap-[clamp(3rem,6vw,5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
    <div>
      <h2 id="next-title" class="max-w-[14ch] text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.9] tracking-[-0.025em]">Preparing for <?= e($post['examLabel'] ?? '') ?>? <em class="font-normal">Start here</em></h2>
      <div class="mt-10 flex flex-wrap gap-3">
        <?php if ($course): ?>
          <?= button('See the ' . e($course['name']) . ' course', ['href' => '/courses/' . $course['slug'], 'diamond' => true]) ?>
        <?php else: ?>
          <?= button('Explore courses', ['href' => '/courses', 'diamond' => true]) ?>
        <?php endif; ?>
        <?= button('Try a free mock test', ['href' => $series ? '/test-series/' . $series['code'] : '/test-series', 'variant' => 'ghost']) ?>
      </div>
    </div>
    <?php if ($others): ?>
      <div>
        <p class="eyebrow border-b border-ivory/40 pb-4">More guides</p>
        <ul>
          <?php foreach ($others as $o): $short = $o['short'] ?? ['', '']; ?>
            <li class="border-b border-[var(--line-d)]">
              <a class="group flex items-baseline justify-between gap-6 py-6" href="<?= e(url('/blog/' . $o['slug'])) ?>">
                <span class="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">
                  <span class="link-underline"><?= e($short[0] ?? '') ?> <em class="font-normal"><?= e($short[1] ?? '') ?></em></span>
                  <span class="mt-1 block font-mono text-[0.6875rem] tracking-[0.12em] text-mute-d uppercase"><?= e($o['board'] ?? '') ?></span>
                </span>
                <span aria-hidden="true" class="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">→</span>
              </a>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
    <?php endif; ?>
  </div>
</section>
