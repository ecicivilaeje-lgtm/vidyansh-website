<?php
/**
 * Front controller: every request comes here (see .htaccess) and is matched to a page.
 */
require __DIR__ . '/app/bootstrap.php';

final class NotFound extends Exception {}

function not_found(): never
{
    throw new NotFound();
}

$path = current_path();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// First run: no config or no tables yet.
if (!config('db') || !installed()) {
    if ($path !== '/install') redirect('/install');
    require ROOT . '/app/install.php';
    exit;
}

if ($path === '/admin' || str_starts_with($path, '/admin/')) {
    require ROOT . '/app/admin/router.php';
    exit;
}

/** Public routes: pattern => [template, layout]. Named groups become template variables. */
$routes = [
    '~^/$~' => 'home',
    '~^/courses$~' => 'courses',
    '~^/courses/(?<slug>[\w-]+)$~' => 'course',
    '~^/test-series$~' => 'test-series',
    '~^/test-series/format/(?<type>[\w-]+)$~' => 'test-series-format',
    '~^/test-series/series/(?<slug>[\w-]+)$~' => 'series',
    '~^/test-series/series/(?<slug>[\w-]+)/tests/(?<testId>[\w-]+)$~' => 'series-test',
    '~^/test-series/series/(?<slug>[\w-]+)/tests/(?<testId>[\w-]+)/attempt$~' => 'attempt',
    '~^/test-series/series/(?<slug>[\w-]+)/tests/(?<testId>[\w-]+)/result$~' => 'series-result',
    '~^/test-series/(?<exam>[\w-]+)$~' => 'test-series-exam',
    '~^/exams$~' => 'exams',
    '~^/results$~' => 'results',
    '~^/faculty$~' => 'faculty',
    '~^/study-material$~' => 'study-material',
    '~^/free-classes$~' => 'free-classes',
    '~^/about$~' => 'about',
    '~^/contact$~' => 'contact',
    '~^/blog$~' => 'blog',
    '~^/blog/(?<slug>[\w-]+)$~' => 'blog-post',
    '~^/(?<policy>privacy|terms|refunds)$~' => 'policy',
    '~^/robots\.txt$~' => 'robots',
    '~^/sitemap\.xml$~' => 'sitemap',
];

$template = null;
$params = [];
foreach ($routes as $pattern => $name) {
    if (preg_match($pattern, $path, $m)) {
        $template = $name;
        $params = array_filter($m, 'is_string', ARRAY_FILTER_USE_KEY);
        break;
    }
}

try {
    if (!$template) not_found();
    if ($method === 'POST' && $template === 'contact') {
        require ROOT . '/app/enquiry.php';
        exit;
    }
    $content = render("pages/$template", $params);
    $meta = page_meta();
    if (($meta['layout'] ?? 'site') === 'none') {
        echo $content;
    } else {
        echo render($meta['layout'] ?? 'layout', ['content' => $content, 'meta' => $meta]);
    }
} catch (NotFound) {
    http_response_code(404);
    page_meta(['title' => 'Page not found · Vidyansh', 'noindex' => true]);
    echo render('layout', ['content' => render('pages/not-found'), 'meta' => page_meta()]);
}

function installed(): bool
{
    try {
        db()->query('SELECT 1 FROM admins LIMIT 1');
        return (int) db()->query('SELECT COUNT(*) FROM admins')->fetchColumn() > 0;
    } catch (Throwable) {
        return false;
    }
}
