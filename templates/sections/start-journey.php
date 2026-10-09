<?php
/**
 * Final call: a dawn that rises as you scroll in, and a short enquiry form.
 * The form posts to /contact (app/enquiry.php); assets/js/home.js validates it first,
 * sends it in the background and shows the thank-you note, exactly like the original.
 */
$exams = content('exams')['exams'] ?? [];
$fieldClass = 'border-b bg-transparent py-3 font-display text-2xl outline-none placeholder:text-mute-d border-ivory/30 focus:border-ivory';
?>
<section id="start" aria-labelledby="start-title" class="relative overflow-hidden bg-ink py-[var(--space-section)]" data-start>
  <div aria-hidden="true" data-dawn class="absolute inset-x-0 bottom-0 h-[130%] bg-[radial-gradient(ellipse_70%_45%_at_50%_100%,rgb(232_170_80/0.26),rgb(200_144_47/0.07)_45%,transparent_72%)]" style="transform:translateY(0%);opacity:1"></div>
  <div aria-hidden="true" class="absolute inset-x-0 bottom-[18%] h-px bg-gradient-to-r from-transparent via-ivory/30 to-transparent"></div>

  <div class="container-v relative">
    <?= chapter_mark('IX', 'Begin', null, 'mb-[var(--space-block)]') ?>
    <div class="grid items-end gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-[clamp(3rem,7vw,8rem)]">
      <div>
        <?= star('size-6') ?>
        <h2 id="start-title" class="settle mt-8 text-[clamp(4rem,10vw,11rem)] leading-[0.84] tracking-[-0.04em]">Start your<br><em class="font-normal">journey.</em></h2>
        <p class="mt-10 max-w-[36ch] text-[1.1875rem] text-body-d">Tell us where you are headed. A counsellor from the Vidyansh team will call you to plan the route, at no cost.</p>
      </div>

      <div>
        <div role="status" hidden data-start-done class="grid gap-4 py-6">
          <?= star('size-5') ?>
          <p class="font-display text-3xl leading-tight">Thank you. Your route starts here.</p>
          <p class="text-sm text-mute-d">Your details have reached the Vidyansh team. A counsellor will call you soon.</p>
          <?= button('Edit details', ['variant' => 'ghost', 'size' => 'sm', 'class' => 'justify-self-start', 'attrs' => 'data-start-edit']) ?>
        </div>
        <form method="post" action="<?= e(url('/contact')) ?>" novalidate data-start-form class="grid gap-8">
          <?= csrf_field() ?>
          <div class="grid gap-2">
            <label for="f-name" class="eyebrow">Your name</label>
            <input id="f-name" name="name" aria-invalid="false" autocomplete="name" class="<?= e($fieldClass) ?>">
          </div>
          <div class="grid gap-2">
            <label for="f-phone" class="eyebrow">Mobile number</label>
            <input id="f-phone" name="phone" aria-invalid="false" type="tel" inputmode="tel" autocomplete="tel" class="<?= e($fieldClass) ?>">
          </div>
          <label class="grid gap-2">
            <span class="eyebrow">Destination exam</span>
            <select name="exam" data-exam-select class="border-b border-ivory/30 bg-transparent py-3 font-display text-2xl outline-none focus:border-ivory">
              <option value="" class="bg-ink" selected>Not decided yet</option>
              <?php foreach ($exams as $x): ?>
                <option value="<?= e($x['code']) ?>" class="bg-ink"><?= e($x['name']) ?></option>
              <?php endforeach; ?>
            </select>
          </label>
          <?= button('Begin your journey', ['type' => 'submit', 'diamond' => true, 'class' => 'mt-2 w-full']) ?>
          <p class="text-xs text-mute-d">We only use your number to call you about Vidyansh courses.</p>
        </form>
      </div>
    </div>
  </div>
</section>
