<?php
/** sitemap.xml: every public page, every course, test-series route and blog post. */
page_meta(['layout' => 'none']);
header('Content-Type: application/xml; charset=utf-8');
$ts = content('test-series');
$paths = ['', '/courses', '/test-series', '/results', '/exams', '/faculty', '/study-material', '/free-classes', '/blog', '/about', '/contact', '/privacy', '/terms', '/refunds'];
foreach (get_courses() as $c) $paths[] = '/courses/' . $c['slug'];
foreach (get_blog_posts() as $b) $paths[] = '/blog/' . $b['slug'];
foreach ($ts['testSeriesExams'] ?? [] as $x) $paths[] = '/test-series/' . $x['code'];
foreach ($ts['testSeriesFormats'] ?? [] as $f) $paths[] = '/test-series/format/' . $f['id'];
foreach ($ts['testSeriesCatalogue'] ?? [] as $s) $paths[] = route_series($s['slug']);
echo '<?xml version="1.0" encoding="UTF-8"?>', "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<?php foreach (array_unique($paths) as $p): ?>
<url>
<loc><?= e($p === '' ? rtrim(abs_url('/'), '/') : abs_url($p)) ?></loc>
<changefreq>weekly</changefreq>
<priority><?= $p === '' ? '1' : '0.7' ?></priority>
</url>
<?php endforeach; ?>
</urlset>
