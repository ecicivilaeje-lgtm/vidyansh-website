<?php
/** /test-series/format/{type}: the series of one format. Unknown formats, or formats without a series, are 404. */
$format = null;
foreach (content('test-series')['testSeriesFormats'] ?? [] as $f) if ($f['id'] === $type) $format = $f;
if (!$format) not_found();
$series = get_test_series(['format' => $format['id']]);
if (!$series) not_found();
page_meta([
    'title' => "{$format['label']} · Vidyansh Test Series",
    'description' => trim("{$format['label']} for SSC JE, RRB JE, State AE / JE and AE / JE from Vidyansh. " . ($format['note'] ?? '')),
    'canonical' => "/test-series/format/{$format['id']}",
]);
partial('components/testseries/catalogue-page', [
    'series' => $series,
    'current' => "/test-series/format/{$format['id']}",
    'heading' => $format['label'],
    'freeSeries' => $series[0],
]);
