<?php
/**
 * First-run installer at /install. Step 1 saves the database details into config.php,
 * step 2 creates the tables, fills them with the website's content and creates the first admin.
 * It stops working once an admin exists.
 */
require_once ROOT . '/app/seed.php';
session_start();

$step = config('db') ? 2 : 1;
$errors = [];
$manualConfig = null;
$old = $_POST;

$scheme = (($_SERVER['HTTPS'] ?? '') !== '' && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$guessUrl = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . base_path();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    csrf_check();
    if ($step === 1) {
        $db = [
            'driver' => 'mysql',
            'host' => trim($_POST['host'] ?? 'localhost') ?: 'localhost',
            'port' => (int) ($_POST['port'] ?? 3306) ?: 3306,
            'name' => trim($_POST['name'] ?? ''),
            'user' => trim($_POST['user'] ?? ''),
            'pass' => (string) ($_POST['pass'] ?? ''),
        ];
        try {
            new PDO(sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $db['host'], $db['port'], $db['name']), $db['user'], $db['pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        } catch (Throwable $ex) {
            $errors['db'] = 'Could not connect to the database. Check the name, user and password (on Hostinger: hPanel > Databases). Details: ' . $ex->getMessage();
        }
        if (!$errors) {
            $siteUrl = rtrim(trim($_POST['site_url'] ?? $guessUrl), '/');
            $config = "<?php\n// Created by the installer on " . date('Y-m-d H:i') . ".\nreturn " . var_export([
                'site_url' => $siteUrl,
                'db' => $db + ['sqlite_path' => ''],
                'debug' => false,
                'notify_email' => trim($_POST['notify_email'] ?? ''),
            ], true) . ";\n";
            if (@file_put_contents(ROOT . '/config.php', $config) !== false) {
                redirect('/install');
            }
            $manualConfig = $config;
        }
    } else {
        $name = trim($_POST['admin_name'] ?? '');
        $email = strtolower(trim($_POST['admin_email'] ?? ''));
        $pass = (string) ($_POST['admin_pass'] ?? '');
        if ($name === '') $errors['admin_name'] = 'Please add your name.';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['admin_email'] = 'Please enter a valid email.';
        if (mb_strlen($pass) < 8) $errors['admin_pass'] = 'Use at least 8 characters.';
        if (!$errors) {
            try {
                db_migrate();
                if ((int) db()->query('SELECT COUNT(*) FROM entries')->fetchColumn() === 0) seed_database();
                db()->prepare('INSERT INTO admins (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
                    ->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT), now_str()]);
                if (!is_dir(ROOT . '/uploads')) @mkdir(ROOT . '/uploads', 0755, true);
                flash('The website is installed. Sign in with the email and password you just chose.');
                redirect('/admin/login');
            } catch (Throwable $ex) {
                $errors['db'] = 'Something went wrong while setting up the database: ' . $ex->getMessage();
            }
        }
    }
}

$in = 'w-full border border-ivory/25 bg-[#fbf8f2] px-3 py-2.5 text-[1rem] text-ivory outline-none focus:border-ivory';
$field = function (string $name, string $label, string $type = 'text', string $value = '', string $help = '') use ($in, &$errors) {
    return '<label class="grid gap-1.5"><span class="text-[0.9375rem] font-medium">' . e($label) . '</span><input type="' . $type . '" name="' . $name . '" value="' . e($value) . '" class="' . $in . '"' . ($type === 'password' ? ' autocomplete="new-password"' : '') . '>'
        . ($help ? '<span class="text-[0.875rem] text-mute-d">' . e($help) . '</span>' : '')
        . (isset($errors[$name]) ? '<span class="text-[0.875rem] font-medium text-bad">' . e($errors[$name]) . '</span>' : '') . '</label>';
};
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Install · Vidyansh</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;1,500&family=IBM+Plex+Mono:wght@500&family=Instrument+Sans:wght@400;500&display=swap">
<link rel="stylesheet" href="<?= e(asset('css/site.css')) ?>">
</head>
<body class="text-[1rem]">
<main class="mx-auto grid max-w-[34rem] gap-6 px-4 py-14">
  <img src="<?= e(asset('brand/vidyansh-logo.png')) ?>" width="72" height="72" alt="Vidyansh" class="logo-edge size-16">
  <p class="eyebrow">Setup · step <?= $step ?> of 2</p>
  <h1 class="text-[2.75rem] leading-none"><?= $step === 1 ? 'Connect the <em class="font-normal">database</em>' : 'Create your <em class="font-normal">admin login</em>' ?></h1>
  <?php if (!empty($errors['db'])): ?><p role="alert" class="border-l-2 border-bad bg-bad/10 px-4 py-3 text-[0.9375rem]"><?= e($errors['db']) ?></p><?php endif; ?>

  <?php if ($manualConfig): ?>
    <p class="border-l-2 border-ivory py-1 pl-4 text-body-d">The database works, but the server would not let the installer save <code>config.php</code>. In File Manager, create a file named <strong>config.php</strong> next to index.php, paste the text below into it, save, then reload this page.</p>
    <textarea readonly rows="16" class="<?= e($in) ?> font-mono text-[0.8125rem]"><?= e($manualConfig) ?></textarea>
  <?php elseif ($step === 1): ?>
    <p class="text-body-d">Create a MySQL database in your hosting panel first (on Hostinger: hPanel › Databases › MySQL Databases), then copy its details here.</p>
    <form method="post" class="grid gap-4">
      <?= csrf_field() ?>
      <?= $field('name', 'Database name', 'text', $old['name'] ?? '', 'Looks like u123456789_vidyansh on Hostinger.') ?>
      <?= $field('user', 'Database user', 'text', $old['user'] ?? '') ?>
      <?= $field('pass', 'Database password', 'password') ?>
      <?= $field('host', 'Database host', 'text', $old['host'] ?? 'localhost', 'Usually "localhost". Leave it unless your hosting says otherwise.') ?>
      <?= $field('site_url', 'Website address', 'url', $old['site_url'] ?? $guessUrl, 'The address people type, e.g. https://www.vidyansh.in') ?>
      <?= $field('notify_email', 'Email for new enquiries (optional)', 'email', $old['notify_email'] ?? '', 'We will email this address whenever someone sends the contact form.') ?>
      <?= button('Continue', ['type' => 'submit', 'diamond' => true, 'class' => 'justify-self-start']) ?>
    </form>
  <?php else: ?>
    <p class="text-body-d">The database is connected. Choose the email and password you will use to sign in to the admin panel. The website's current content will be copied into the database.</p>
    <form method="post" class="grid gap-4">
      <?= csrf_field() ?>
      <?= $field('admin_name', 'Your name', 'text', $old['admin_name'] ?? '') ?>
      <?= $field('admin_email', 'Email', 'email', $old['admin_email'] ?? '') ?>
      <?= $field('admin_pass', 'Password (at least 8 characters)', 'password') ?>
      <?= button('Install the website', ['type' => 'submit', 'diamond' => true, 'class' => 'justify-self-start']) ?>
    </form>
  <?php endif; ?>
</main>
</body>
</html>
