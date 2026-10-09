<?php /** @var array $me @var array $admins @var array $errors */
$in = admin_input_class();
$err = fn($k) => isset($errors[$k]) ? '<p class="text-[0.875rem] font-medium text-bad">' . e($errors[$k]) . '</p>' : '';
?>
<p class="eyebrow">You</p>
<h1 class="mt-3 text-[clamp(2.5rem,5vw,3.75rem)] leading-[0.95]">Password &amp; <em class="font-normal">admins</em></h1>

<section class="mt-10" aria-labelledby="pw-title">
  <h2 id="pw-title" class="border-b-2 border-ivory pb-3 text-[1.75rem]">Change your password</h2>
  <form method="post" class="mt-6 grid max-w-[26rem] gap-4">
    <?= csrf_field() ?><input type="hidden" name="action" value="password">
    <label class="grid gap-1.5"><span class="text-[0.9375rem] font-medium">Current password</span><input type="password" name="current" required autocomplete="current-password" class="<?= e($in) ?>"><?= $err('current') ?></label>
    <label class="grid gap-1.5"><span class="text-[0.9375rem] font-medium">New password (at least 8 characters)</span><input type="password" name="new" required minlength="8" autocomplete="new-password" class="<?= e($in) ?>"><?= $err('new') ?></label>
    <label class="grid gap-1.5"><span class="text-[0.9375rem] font-medium">New password again</span><input type="password" name="confirm" required autocomplete="new-password" class="<?= e($in) ?>"><?= $err('confirm') ?></label>
    <?= button('Change password', ['type' => 'submit', 'size' => 'sm', 'class' => 'justify-self-start']) ?>
  </form>
</section>

<section class="mt-14" aria-labelledby="admins-title">
  <h2 id="admins-title" class="border-b-2 border-ivory pb-3 text-[1.75rem]">People who can sign in</h2>
  <ul>
    <?php foreach ($admins as $a): ?>
      <li class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line-d)] py-4">
        <span><span class="font-medium"><?= e($a['name']) ?></span><?= (int) $a['id'] === (int) $me['id'] ? ' <span class="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mute-d">You</span>' : '' ?>
          <span class="block text-[0.9375rem] text-mute-d"><?= e($a['email']) ?> · last sign-in <?= e($a['last_login_at'] ? date('j M Y', strtotime($a['last_login_at'])) : 'never') ?></span></span>
        <?php if ((int) $a['id'] !== (int) $me['id']): ?>
          <form method="post" data-confirm="Remove <?= e($a['name']) ?>? They will no longer be able to sign in."><?= csrf_field() ?><input type="hidden" name="action" value="remove"><input type="hidden" name="id" value="<?= (int) $a['id'] ?>">
            <button class="border border-bad/50 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-bad">Remove</button></form>
        <?php endif; ?>
      </li>
    <?php endforeach; ?>
  </ul>
  <h3 class="mt-10 text-[1.375rem]">Add someone</h3>
  <form method="post" class="mt-4 grid max-w-[26rem] gap-4">
    <?= csrf_field() ?><input type="hidden" name="action" value="add">
    <label class="grid gap-1.5"><span class="text-[0.9375rem] font-medium">Name</span><input type="text" name="name" value="<?= e($_POST['name'] ?? '') ?>" class="<?= e($in) ?>"><?= $err('name') ?></label>
    <label class="grid gap-1.5"><span class="text-[0.9375rem] font-medium">Email</span><input type="email" name="email" value="<?= e($_POST['email'] ?? '') ?>" class="<?= e($in) ?>"><?= $err('email') ?></label>
    <label class="grid gap-1.5"><span class="text-[0.9375rem] font-medium">Password (at least 8 characters)</span><input type="text" name="password" autocomplete="off" class="<?= e($in) ?>"><?= $err('password') ?></label>
    <?= button('Add admin', ['type' => 'submit', 'size' => 'sm', 'class' => 'justify-self-start']) ?>
  </form>
</section>
