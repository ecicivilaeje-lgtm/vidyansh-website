<?php
/**
 * .../tests/{testId}/result: the report card, computed in the browser from the attempt saved on
 * this device (assets/js/testseries-result.js). Only tests with a paper have one; others are 404.
 */
$series = get_test_series_by_slug($slug);
$test = get_series_test($slug, $testId);
$paper = !empty($test['paperId']) ? get_paper($test['paperId']) : null;
if (!$series || !$test || !$paper) not_found();

page_meta(['title' => "{$test['title']} · Result · Vidyansh", 'noindex' => true]);
page_script('testseries-attempt');
page_script('testseries-result');
?>
<div class="bg-ink pt-[calc(var(--header-h)+clamp(2rem,5vw,4rem))]">
  <?= testseries_breadcrumb([['Test Series', '/test-series'], [$series['name'], route_series($slug)], ['Result', null]], 'container-v mb-8') ?>
  <div data-ts-result data-test-id="<?= e($testId) ?>"
    data-test-title="<?= e($test['title']) ?>" data-series-name="<?= e($series['name']) ?>"
    data-test-href="<?= e(url(route_test($slug, $testId))) ?>"
    data-access-href="<?= e(url(route_series($slug)) . '#access') ?>"
    data-courses-href="<?= e(url('/#courses')) ?>">
    <script type="application/json" data-ts-paper><?= json_script($paper) ?></script>
    <p data-ts-result-loading class="eyebrow py-24 text-center" role="status">Loading your result…</p>
  </div>
</div>
