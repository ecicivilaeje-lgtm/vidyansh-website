<?php
/** /test-series: every series. */
page_meta([
    'title' => 'Test Series · Vidyansh',
    'description' => 'Full-length mocks, subject-wise and chapter-wise tests and previous year papers for SSC JE, RRB JE, AE / JE and State AE / JE. The first test in every series is free.',
    'canonical' => '/test-series',
]);
$featured = get_featured_test_series();
$series = get_test_series();
partial('components/testseries/catalogue-page', [
    'series' => $series,
    'current' => '/test-series',
    'heading' => 'All test series',
    'freeSeries' => $featured[0] ?? ($series[0] ?? null),
]);
