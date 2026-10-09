<?php
/** @var string $content  @var array $meta */
$brand = site()['brand'];
$title = $meta['title'] ?? "{$brand['name']} · {$brand['byline']} · {$brand['tagline']}";
$description = $meta['description'] ?? "{$brand['name']}, {$brand['byline']}. Courses, test series and guidance for engineering competitive exams. {$brand['promise']}";
$canonical = $meta['canonical'] ?? current_path();
$ogType = $meta['ogType'] ?? 'website';
$ogTitle = $meta['ogTitle'] ?? ($meta['title'] ?? "{$brand['name']} · {$brand['tagline']}");
$ogDescription = $meta['ogDescription'] ?? ($meta['description'] ?? $brand['promise']);
$ogImage = $meta['ogImage'] ?? 'assets/brand/opengraph-image.jpg';
$bare = ($meta['chrome'] ?? 'site') === 'bare';
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($title) ?></title>
<meta name="description" content="<?= e($description) ?>">
<?php if (!empty($meta['noindex'])): ?><meta name="robots" content="noindex"><?php endif; ?>
<link rel="canonical" href="<?= e(abs_url($canonical)) ?>">
<meta name="application-name" content="<?= e($brand['name']) ?>">
<meta name="theme-color" content="#f4eee2">
<meta property="og:type" content="<?= e($ogType) ?>">
<meta property="og:locale" content="en_IN">
<meta property="og:site_name" content="<?= e("{$brand['name']} · {$brand['byline']}") ?>">
<meta property="og:title" content="<?= e($ogTitle) ?>">
<meta property="og:description" content="<?= e($ogDescription) ?>">
<meta property="og:url" content="<?= e(abs_url($canonical)) ?>">
<meta property="og:image" content="<?= e(abs_url($ogImage)) ?>">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<?php if (!empty($meta['author'])): ?><meta name="author" content="<?= e($meta['author']) ?>">
<meta property="article:author" content="<?= e($meta['author']) ?>">
<?php endif; ?>
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= e($ogTitle) ?>">
<meta name="twitter:description" content="<?= e($ogDescription) ?>">
<meta name="twitter:image" content="<?= e(abs_url($ogImage)) ?>">
<link rel="icon" href="<?= e(asset('brand/icon.png')) ?>" type="image/png">
<link rel="apple-touch-icon" href="<?= e(asset('brand/apple-icon.png')) ?>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Cormorant:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&family=Tiro+Devanagari+Hindi&display=swap">
<link rel="stylesheet" href="<?= e(asset('css/site.css')) ?>">
<?php foreach ($meta['jsonLd'] ?? [] as $ld): ?>
<script type="application/ld+json"><?= json_script($ld) ?></script>
<?php endforeach; ?>
<script src="<?= e(asset('js/site.js')) ?>" defer></script>
<?php foreach ($meta['scripts'] ?? [] as $script): ?>
<script src="<?= e(asset("js/$script.js")) ?>" defer></script>
<?php endforeach; ?>
</head>
<body id="top"<?= !empty($meta['bodyClass']) ? ' class="' . e($meta['bodyClass']) . '"' : '' ?>>
<?php if ($bare): ?>
<?= $content ?>
<?php else: ?>
<?php partial('partials/header') ?>
<main id="main" tabindex="-1" class="outline-none">
<?= $content ?>
</main>
<?php partial('partials/footer') ?>
<?php endif; ?>
</body>
</html>
