<?php
/** Local testing only: php -S localhost:8000 router.php */
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('~^/(app|templates|database|storage|tools|node_modules)(/|$)|^/config~', $path)) {
    http_response_code(403);
    exit('Forbidden');
}
if ($path !== '/' && is_file(__DIR__ . $path) && !str_ends_with($path, '.php')) return false;
$_SERVER['SCRIPT_NAME'] = '/index.php';
require __DIR__ . '/index.php';
