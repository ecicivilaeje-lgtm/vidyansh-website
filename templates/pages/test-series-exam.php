<?php
/** /test-series/{exam}: the series for one exam. Unknown exams, or exams without a series, are 404. */
$found = test_series_for($exam);
if (!$found) not_found();
$series = get_test_series(['exam' => $found['code']]);
if (!$series) not_found();
page_meta([
    'title' => "{$found['label']} Test Series · Vidyansh",
    'description' => "{$found['label']} mocks, sectional tests and previous year papers with solutions and analysis.",
    'canonical' => "/test-series/{$found['code']}",
]);
partial('components/testseries/catalogue-page', [
    'series' => $series,
    'current' => "/test-series/{$found['code']}",
    'heading' => "{$found['label']} test series",
    'freeSeries' => $series[0],
]);
