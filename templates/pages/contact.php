<?php
/**
 * Contact: the envelope (address, office hours, location plan), the enquiry letter and common questions.
 * POST /contact is handled by app/enquiry.php, which re-renders this page with $errors and $old when needed.
 */
page_meta([
    'title' => 'Contact · Vidyansh',
    'description' => 'Write to Vidyansh. Tell us your exam and the best time to call, and a counsellor will help you plan your preparation, at no cost. Address, office hours and common questions.',
    'canonical' => '/contact',
]);
page_script('learning-letter');
$contact = site()['contact'] ?? [];
$page = get_contact_page();
$opts = learning_letter_options();
$q = fn($k) => isset($_GET[$k]) && is_string($_GET[$k]) ? $_GET[$k] : null;
$initial = ['exam' => $q('exam'), 'course' => $q('course'), 'topic' => $q('topic')];
$sent = null;
if (empty($errors) && $q('sent') === '1') {
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $sent = $_SESSION['enquiry_sent'] ?? ['name' => '', 'time' => ''];
    unset($_SESSION['enquiry_sent']);
}
?>
<div aria-hidden="true" class="h-[calc(var(--header-h)+env(safe-area-inset-top))] bg-ink"></div>

<div class="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
  <section aria-labelledby="contact-title" class="relative bg-ink px-[var(--gutter)] pt-[clamp(4rem,9vw,8rem)] pb-[var(--space-block)] lg:pr-[clamp(2.5rem,5vw,5rem)] lg:pl-[max(var(--gutter),calc((100vw_-_85rem)/2_+_var(--gutter)))]">
    <h1 id="contact-title" class="text-[clamp(4.5rem,11vw,10.5rem)] leading-[0.84] tracking-[-0.045em]">Write to <em class="font-normal">us</em></h1>
    <p class="mt-8 max-w-[38ch] text-[1.1875rem] text-body-d">Tell us where you are headed. A counsellor will call you to plan the route, at no cost.</p>

    <address class="mt-[var(--space-block)] not-italic">
      <p class="eyebrow border-t border-ivory/40 pt-5">Visit or call</p>
      <p class="mt-6 font-display text-[clamp(2.25rem,3.6vw,3.25rem)] leading-none"><?= e($contact['centre'] ?? '') ?></p>
      <ul class="mt-5 grid">
        <?php foreach ($contact['addressLines'] ?? [] as $l): ?>
          <li class="border-b border-[var(--line-d)] py-2.5 font-display text-[1.5rem] leading-snug italic"><?= e($l) ?><?= learning_placeholder() ?></li>
        <?php endforeach; ?>
      </ul>
      <dl class="mt-8 grid gap-4">
        <div class="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-4">
          <dt class="eyebrow">Phone</dt>
          <dd class="font-display text-[1.375rem]"><?= e($contact['phone'] ?? '') ?><?= learning_placeholder() ?></dd>
        </div>
        <div class="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-4">
          <dt class="eyebrow">Email</dt>
          <dd class="font-display text-[1.375rem] break-words"><?= e($contact['email'] ?? '') ?><?= learning_placeholder() ?></dd>
        </div>
      </dl>
    </address>

    <div class="mt-12">
      <h2 class="eyebrow">Office hours</h2>
      <dl class="mt-4 border-t border-[var(--line-d)]">
        <?php foreach ($page['officeHours'] ?? [] as $h): ?>
          <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--line-d)] py-3">
            <dt class="font-display text-[1.25rem]"><?= e($h['days'] ?? '') ?></dt>
            <dd class="font-mono text-[0.6875rem] tracking-[0.14em] text-mute-d uppercase"><?= e($h['hours'] ?? '') ?></dd>
          </div>
        <?php endforeach; ?>
      </dl>
    </div>

    <div class="mt-12">
      <?php partial('components/learning/location-plan') ?>
    </div>
  </section>

  <section aria-label="Enquiry letter" class="on-light bg-ivory px-[var(--gutter)] pt-[clamp(4rem,9vw,8rem)] pb-[var(--space-block)] text-ink lg:pr-[max(var(--gutter),calc((100vw_-_85rem)/2_+_var(--gutter)))] lg:pl-[clamp(2.5rem,6vw,6.5rem)]">
    <div class="max-w-[44rem]">
      <?php partial('components/learning/letter-form', [
          'opts' => $opts, 'initial' => $initial, 'old' => $old ?? null, 'errors' => $errors ?? [], 'sent' => $sent,
      ]) ?>
    </div>
  </section>
</div>

<section aria-labelledby="faq-title" class="bg-night py-[var(--space-section)]">
  <div class="container-v grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-[clamp(3rem,7vw,8rem)]">
    <div>
      <p class="eyebrow">Before you write</p>
      <h2 id="faq-title" class="settle mt-5 text-[clamp(3.25rem,7vw,7rem)] leading-[0.88] tracking-[-0.025em]">Common <em class="font-normal">questions</em></h2>
    </div>
    <div class="border-t border-ivory/40">
      <?php foreach ($page['faq'] ?? [] as $f): ?>
        <details class="group border-b border-[var(--line-d)]">
          <summary class="flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight hover:italic [&::-webkit-details-marker]:hidden"><?= e($f['q'] ?? '') ?><span aria-hidden="true" class="font-mono text-base text-mute-d transition-transform duration-500 ease-out-expo group-open:rotate-45">+</span></summary>
          <p class="max-w-[60ch] pb-7 text-body-d"><?= e($f['a'] ?? '') ?></p>
        </details>
      <?php endforeach; ?>
    </div>
  </div>
</section>
