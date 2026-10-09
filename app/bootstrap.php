<?php
declare(strict_types=1);

define('ROOT', dirname(__DIR__));

$configFile = ROOT . '/config.php';
$GLOBALS['config'] = is_file($configFile) ? require $configFile : null;

if (!empty($GLOBALS['config']['debug'])) {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
}

date_default_timezone_set('Asia/Kolkata');
mb_internal_encoding('UTF-8');

require ROOT . '/app/helpers.php';
require ROOT . '/app/db.php';
require ROOT . '/app/content.php';
require ROOT . '/app/components.php';
// Page-group helpers (one file per group of pages).
foreach (glob(ROOT . '/app/ui/*.php') ?: [] as $uiFile) require $uiFile;

if (session_status() === PHP_SESSION_NONE) {
    session_name('vidyansh');
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => (($_SERVER['HTTPS'] ?? '') !== '' && $_SERVER['HTTPS'] !== 'off'),
    ]);
}
