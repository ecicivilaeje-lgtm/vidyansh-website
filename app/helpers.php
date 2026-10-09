<?php
/** Small helpers shared by templates and the admin panel. */

function config(string $key, $default = null)
{
    return $GLOBALS['config'][$key] ?? $default;
}

/** Escape text for HTML. Use for every value printed into a template. */
function e($value): string
{
    if ($value === null) return '';
    if (is_bool($value)) return $value ? 'true' : 'false';
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Joins class names, skipping empty ones: cls('a', $on ? 'b' : '', 'c'). */
function cls(...$parts): string
{
    return trim(implode(' ', array_filter(array_map('trim', array_map('strval', $parts)), fn($p) => $p !== '')));
}

/** Base path the site is installed under ('' at the domain root, '/vidyansh' in a sub-folder). */
function base_path(): string
{
    static $base = null;
    if ($base === null) {
        $script = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/'));
        $base = rtrim($script === '/' || $script === '.' ? '' : $script, '/');
    }
    return $base;
}

/** A link to a page of this site. Accepts "/courses", "/#test-series" or a full URL. */
function url(string $path = '/'): string
{
    if (preg_match('~^(https?:|mailto:|tel:|#)~', $path)) return $path;
    return base_path() . '/' . ltrim($path, '/');
}

/** Absolute URL for canonicals and share images. */
function abs_url(string $path = '/'): string
{
    $site = rtrim((string) config('site_url', ''), '/');
    if ($site === '') {
        $scheme = (($_SERVER['HTTPS'] ?? '') !== '' && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $site = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . base_path();
    }
    return $site . '/' . ltrim($path, '/');
}

/** A link to a file in /assets with a cache-busting version. */
function asset(string $path): string
{
    $file = ROOT . '/assets/' . ltrim($path, '/');
    $v = is_file($file) ? '?v=' . filemtime($file) : '';
    return url('assets/' . ltrim($path, '/')) . $v;
}

/** URL for an uploaded file (stored as "uploads/...") or any other src. */
function media(?string $src): string
{
    if (!$src) return '';
    if (preg_match('~^(https?:)?//~', $src)) return $src;
    return url($src);
}

/** The current request path without the base path, e.g. "/courses/ssc-je-complete". */
function current_path(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $base = base_path();
    if ($base !== '' && str_starts_with($path, $base)) $path = substr($path, strlen($base));
    $path = '/' . trim($path, '/');
    return $path;
}

function path_starts(string $prefix): bool
{
    $p = current_path();
    return $prefix === '/' ? $p === '/' : ($p === $prefix || str_starts_with($p, rtrim($prefix, '/') . '/'));
}

function redirect(string $to, int $code = 303): never
{
    header('Location: ' . (preg_match('~^https?://~', $to) ? $to : url($to)), true, $code);
    exit;
}

/* ---------- Rendering ---------- */

/** Renders a template file from /templates with the given variables and returns the HTML. */
function render(string $template, array $vars = []): string
{
    $file = ROOT . '/templates/' . $template . '.php';
    if (!is_file($file)) throw new RuntimeException("Template not found: $template");
    extract($vars, EXTR_SKIP);
    ob_start();
    include $file;
    return ob_get_clean();
}

/** Prints a template (for use inside templates). */
function partial(string $template, array $vars = []): void
{
    echo render($template, $vars);
}

/** Page metadata collected by a page template and printed by the layout. */
function page_meta(?array $set = null): array
{
    static $meta = [];
    if ($set !== null) $meta = array_merge($meta, $set);
    return $meta;
}

/** Adds a page script (assets/js/<name>.js) once; the layout loads them after site.js. */
function page_script(string $name): void
{
    $meta = page_meta();
    $scripts = $meta['scripts'] ?? [];
    if (!in_array($name, $scripts, true)) $scripts[] = $name;
    page_meta(['scripts' => $scripts]);
}

/* ---------- Security ---------- */

function csrf_token(): string
{
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="_token" value="' . e(csrf_token()) . '">';
}

function csrf_check(): void
{
    $sent = $_POST['_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($sent) || !hash_equals(csrf_token(), $sent)) {
        http_response_code(419);
        exit('This form has expired. Please go back, refresh the page and try again.');
    }
}

function flash(?string $message = null, string $type = 'ok'): ?array
{
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    if ($message !== null) {
        $_SESSION['flash'] = ['message' => $message, 'type' => $type];
        return null;
    }
    $f = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return $f;
}

/* ---------- Formatting (same rules as the original lib/format.ts) ---------- */

function format_in(float|int $n): string
{
    // Indian digit grouping: 1,23,456
    $neg = $n < 0;
    $n = abs($n);
    $int = (string) floor($n);
    $frac = $n - floor($n);
    $last3 = substr($int, -3);
    $rest = substr($int, 0, -3);
    if ($rest !== '' && $rest !== false) $rest = preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', $rest) . ',';
    $out = ($rest ?: '') . $last3;
    if ($frac > 0) $out .= substr(rtrim(number_format($frac, 3, '.', ''), '0'), 1);
    return ($neg ? '-' : '') . $out;
}

/** null means "not supplied yet" and prints as an em dash. */
function or_dash($value, string $suffix = ''): string
{
    return ($value === null || $value === '') ? '—' : format_in((float) $value) . $suffix;
}

function format_inr($value): string
{
    return $value === null || $value === '' ? '₹ —' : '₹' . format_in((float) $value);
}

function discount_percent($price, $original): ?int
{
    if ($price === null || $original === null || $original <= $price) return null;
    return (int) round(($original - $price) / $original * 100);
}

function pad2(int $n): string
{
    return str_pad((string) $n, 2, '0', STR_PAD_LEFT);
}

/** JSON for a data-* attribute or inline script. */
function json_attr($value): string
{
    return e(json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
}

function json_script($value): string
{
    return str_replace('</', '<\/', json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG));
}

function slugify(string $text): string
{
    $s = strtolower(trim(preg_replace('/[^A-Za-z0-9]+/', '-', $text), '-'));
    return $s !== '' ? $s : 'item-' . substr(bin2hex(random_bytes(3)), 0, 6);
}

/* ---------- URL builders (mirror lib/routes.ts) ---------- */

function route_series(string $slug): string { return "/test-series/series/$slug"; }
function route_test(string $slug, string $testId): string { return "/test-series/series/$slug/tests/$testId"; }
function route_attempt(string $slug, string $testId): string { return "/test-series/series/$slug/tests/$testId/attempt"; }
function route_result(string $slug, string $testId): string { return "/test-series/series/$slug/tests/$testId/result"; }
/** The first test of every series is the free one. */
function route_free_test(array $series): string { return "/test-series/series/{$series['slug']}/tests/{$series['id']}-T01"; }
