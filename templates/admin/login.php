<?php /** @var ?string $error @var string $email */ ?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Sign in · Vidyansh admin</title>
<link rel="icon" href="<?= e(asset('brand/icon.png')) ?>" type="image/png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;1,500&family=IBM+Plex+Mono:wght@500&family=Instrument+Sans:wght@400;500&display=swap">
<link rel="stylesheet" href="<?= e(asset('css/site.css')) ?>">
</head>
<body class="text-[1rem]">
<main class="grid min-h-dvh place-items-center px-4 py-10">
  <form method="post" action="<?= e(url('/admin/login')) ?>" class="grid w-full max-w-[24rem] gap-6">
    <?= csrf_field() ?>
    <div class="grid justify-items-start gap-4">
      <?= logo(72, 'size-16', false, true) ?>
      <h1 class="text-[2.75rem] leading-none">Admin <em class="font-normal">sign in</em></h1>
    </div>
    <?php if ($f = flash()): ?><p role="status" class="border-l-2 border-ok bg-ok/10 px-4 py-3 text-[0.9375rem]"><?= e($f['message']) ?></p><?php endif; ?>
    <?php if ($error): ?><p role="alert" class="border-l-2 border-bad bg-bad/10 px-4 py-3 text-[0.9375rem]"><?= e($error) ?></p><?php endif; ?>
    <label class="grid gap-1.5"><span class="text-[0.9375rem] font-medium">Email</span>
      <input type="email" name="email" value="<?= e($email) ?>" required autocomplete="username" autofocus class="<?= e(admin_input_class()) ?>"></label>
    <label class="grid gap-1.5"><span class="text-[0.9375rem] font-medium">Password</span>
      <input type="password" name="password" required autocomplete="current-password" class="<?= e(admin_input_class()) ?>"></label>
    <?= button('Sign in', ['type' => 'submit', 'diamond' => true]) ?>
    <a href="<?= e(url('/')) ?>" class="text-[0.9375rem] text-mute-d hover:text-ivory">← Back to the website</a>
  </form>
</main>
</body>
</html>
