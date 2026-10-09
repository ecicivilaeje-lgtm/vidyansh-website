<?php
/** robots.txt: test attempts and personal results are not for search engines. */
page_meta(['layout' => 'none']);
header('Content-Type: text/plain; charset=utf-8');
?>
User-Agent: *
Allow: <?= base_path() ?>/
Disallow: <?= base_path() ?>/test-series/series/*/tests/

Sitemap: <?= abs_url('/sitemap.xml') ?>

