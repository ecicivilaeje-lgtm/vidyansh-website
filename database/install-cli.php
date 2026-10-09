<?php
/**
 * Command-line installer (for developers): php database/install-cli.php [--fresh] email password [name]
 * Most people should use the web installer at /install instead.
 */
require dirname(__DIR__) . '/app/bootstrap.php';
require ROOT . '/app/seed.php';
$args = array_slice($argv, 1);
$fresh = in_array('--fresh', $args, true);
$args = array_values(array_filter($args, fn($a) => $a !== '--fresh'));
if ($fresh && db_is_sqlite()) { @unlink(config('db')['sqlite_path']); }
db_migrate();
if ((int) db()->query('SELECT COUNT(*) FROM entries')->fetchColumn() === 0) { seed_database(); echo "Content seeded.\n"; }
if (count($args) >= 2) {
    db()->prepare('INSERT INTO admins (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
        ->execute([$args[2] ?? 'Admin', strtolower($args[0]), password_hash($args[1], PASSWORD_DEFAULT), now_str()]);
    echo "Admin created.\n";
}
