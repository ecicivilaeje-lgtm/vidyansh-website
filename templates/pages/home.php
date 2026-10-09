<?php
/** The homepage: the journey from Dream to Destination, told in chapters. */
$brand = site()['brand'];
$logoSrc = ($brand['logo']['src'] ?? '') === '/brand/vidyansh-logo.png' || empty($brand['logo']['src'])
    ? '/assets/brand/vidyansh-logo.png' : $brand['logo']['src'];
page_meta([
    'canonical' => '/',
    /* Structured data for search engines: who Vidyansh is. Only facts already on the site. */
    'jsonLd' => [[
        '@context' => 'https://schema.org',
        '@type' => 'EducationalOrganization',
        'name' => $brand['name'],
        'alternateName' => [$brand['devanagari'], "{$brand['name']} {$brand['byline']}"],
        'slogan' => $brand['tagline'],
        'description' => $brand['promise'],
        'logo' => media($logoSrc),
        'founder' => ['@type' => 'Person', 'name' => 'Shubham Sir'],
    ]],
]);
page_script('home');

partial('sections/hero');
partial('sections/brand-story');
partial('sections/exam-journey');
partial('sections/courses', ['courses' => get_courses()]);
partial('sections/test-series', ['series' => get_featured_test_series()]);
partial('sections/methodology');
partial('sections/mentor');
partial('sections/results', ['results' => get_results()]);
partial('sections/free-learning');
partial('sections/community');
partial('sections/start-journey');
