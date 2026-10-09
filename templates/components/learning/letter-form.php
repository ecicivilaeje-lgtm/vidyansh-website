<?php
/**
 * The enquiry written as a letter, with the fields set inline on underlines (the original
 * components/contact/LetterForm). Posts to /contact (app/enquiry.php). assets/js/learning-letter.js
 * validates, keeps exam and course in step, and sends it with fetch; without JavaScript the form
 * posts normally and the server redirects to /contact?sent=1 or re-renders it with errors.
 * @var array $opts     learning_letter_options()
 * @var array $initial  ['exam' =>, 'course' =>, 'topic' =>] from the query string
 * @var array|null $old posted values after a failed submit
 * @var array $errors   field => message
 * @var array|null $sent ['name' =>, 'time' =>] after a successful submit without JavaScript
 */
$errors = $errors ?? [];
$old = $old ?? null;
$sent = $sent ?? null;
$validCourse = learning_find($opts['courses'], 'slug', $initial['course'] ?? null);
$validExam = learning_find($opts['exams'], 'code', $initial['exam'] ?? null)['code'] ?? null;
$topic = ($old['topic'] ?? $initial['topic'] ?? null) === 'free-classes' ? 'free-classes' : null;

$name = $old['name'] ?? '';
$phone = $old['phone'] ?? '';
$exam = $old['exam'] ?? ($validExam ?? ($validCourse['exam'] ?? ''));
$course = $old['course'] ?? ($validCourse['slug'] ?? '');
$time = $old['time'] ?? '';
$message = $old['message'] ?? ($topic === 'free-classes' ? 'Please let me know when the free live classes are scheduled.' : '');
$subject = learning_letter_subject($opts, $course, $topic);

$inline = 'mx-1 inline-block max-w-full border-b bg-transparent px-1 pb-0.5 align-baseline font-display italic leading-tight outline-none transition-colors placeholder:text-mute-l placeholder:not-italic';
$okLine = 'border-ink/40 hover:border-ink focus:border-ink';
$badLine = 'border-[#9b4a33]';
$errText = 'text-[0.9375rem] font-sans not-italic text-[#9b4a33]';
$firstError = isset($errors['name']) ? 'name' : (isset($errors['phone']) ? 'phone' : null);
$sentName = $sent ? (explode(' ', trim($sent['name'] ?? ''))[0] ?? '') : '';
$jsData = $opts + ['firstNote' => 'Your letter will reach the Vidyansh team and a counsellor will call you'];
?>
<script type="application/json" data-letter-data><?= json_script($jsData) ?></script>
<div tabindex="-1" role="status" class="grid gap-6 outline-none" data-letter-done<?= $sent ? '' : ' hidden' ?>>
  <?= star('size-6') ?>
  <p class="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1]">Thank you<span data-letter-done-name><?= $sentName !== '' ? ', ' . e($sentName) : '' ?></span>. Your letter is <em class="font-normal">written.</em></p>
  <p class="max-w-[46ch] text-mute-l" data-letter-done-note><?= e(learning_letter_sent_note($opts, $sent['time'] ?? '')) ?></p>
  <?php if ($sent): ?>
    <?= button('Edit the letter', ['href' => '/contact', 'tone' => 'light', 'variant' => 'ghost', 'size' => 'sm', 'class' => 'justify-self-start', 'attrs' => 'data-letter-edit']) ?>
  <?php else: ?>
    <?= button('Edit the letter', ['tone' => 'light', 'variant' => 'ghost', 'size' => 'sm', 'class' => 'justify-self-start', 'attrs' => 'data-letter-edit']) ?>
  <?php endif; ?>
</div>

<form method="post" action="<?= e(url('/contact')) ?>" novalidate aria-labelledby="letter-title" class="grid gap-10 [color-scheme:light]" data-letter<?= $sent ? ' hidden' : '' ?>>
  <?= csrf_field() ?>
  <input type="hidden" name="topic" value="<?= e($topic ?? '') ?>">
  <input type="text" name="website" value="" tabindex="-1" autocomplete="off" aria-hidden="true" class="sr-only"><?php /* honeypot: people never see or fill it */ ?>
  <div class="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink pb-4">
    <p class="font-mono text-[0.6875rem] tracking-[0.16em] uppercase"><span class="text-mute-l">Re:</span> <span data-letter-subject><?= e($subject) ?></span></p>
    <p class="font-mono text-[0.6875rem] tracking-[0.16em] text-mute-l uppercase">To the Vidyansh team</p>
  </div>

  <div class="grid gap-8 font-display text-[clamp(1.5rem,2.3vw,2rem)] leading-[1.75]">
    <h2 id="letter-title" class="text-[clamp(2.25rem,3.6vw,3rem)] leading-none italic">Dear Vidyansh,</h2>

    <div>
      <p>My name is<label for="c-name" class="sr-only">Your name</label><input id="c-name" name="name" autocomplete="name" value="<?= e($name) ?>" placeholder="your name" aria-invalid="<?= isset($errors['name']) ? 'true' : 'false' ?>"<?= isset($errors['name']) ? ' aria-describedby="c-name-err"' : '' ?><?= $firstError === 'name' ? ' autofocus' : '' ?> class="<?= e(cls($inline, 'w-[11ch]', isset($errors['name']) ? $badLine : $okLine)) ?>">, and I am preparing for<label for="c-exam" class="sr-only">Exam you are preparing for</label><select id="c-exam" name="exam" class="<?= e(cls($inline, $okLine, 'cursor-pointer')) ?>">
          <option value=""<?= $exam === '' ? ' selected' : '' ?>>an exam I have not chosen yet</option>
          <?php foreach ($opts['exams'] as $x): ?>
            <option value="<?= e($x['code']) ?>"<?= $exam === $x['code'] ? ' selected' : '' ?>><?= e($x['name']) ?></option>
          <?php endforeach; ?>
        </select>.</p>
      <p id="c-name-err" class="<?= e($errText) ?>"<?= isset($errors['name']) ? '' : ' hidden' ?>><?= e($errors['name'] ?? '') ?></p>
    </div>

    <p>I would like to hear about<label for="c-course" class="sr-only">Course (optional)</label><select id="c-course" name="course" class="<?= e(cls($inline, $okLine, 'max-w-[min(100%,18ch)] cursor-pointer')) ?>">
        <option value=""<?= $course === '' ? ' selected' : '' ?>>any course that suits me</option>
        <?php foreach ($opts['courses'] as $c): if ($exam !== '' && $c['exam'] !== $exam) continue; ?>
          <option value="<?= e($c['slug']) ?>"<?= $course === $c['slug'] ? ' selected' : '' ?>><?= e($c['name']) ?></option>
        <?php endforeach; ?>
      </select>.</p>

    <div>
      <p>You can reach me on<label for="c-phone" class="sr-only">Mobile number, 10 digits</label><input id="c-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" value="<?= e($phone) ?>" placeholder="10-digit mobile" aria-invalid="<?= isset($errors['phone']) ? 'true' : 'false' ?>"<?= isset($errors['phone']) ? ' aria-describedby="c-phone-err"' : '' ?><?= $firstError === 'phone' ? ' autofocus' : '' ?> class="<?= e(cls($inline, 'w-[14ch] tabular-nums', isset($errors['phone']) ? $badLine : $okLine)) ?>">, and the best time to call is<label for="c-time" class="sr-only">Preferred time to call</label><select id="c-time" name="time" class="<?= e(cls($inline, $okLine, 'cursor-pointer')) ?>">
          <?php foreach ($opts['callTimes'] as $t): ?>
            <option value="<?= e($t['value']) ?>"<?= $time === $t['value'] ? ' selected' : '' ?>><?= e($t['label']) ?></option>
          <?php endforeach; ?>
        </select>.</p>
      <p id="c-phone-err" class="<?= e($errText) ?>"<?= isset($errors['phone']) ? '' : ' hidden' ?>><?= e($errors['phone'] ?? '') ?></p>
    </div>

    <div class="grid gap-2">
      <label for="c-message" class="font-mono text-[0.6875rem] leading-none tracking-[0.16em] text-mute-l uppercase">Anything else (optional)</label>
      <textarea id="c-message" name="message" rows="4" placeholder="Your branch, your year, or a question for us." class="w-full resize-y bg-[linear-gradient(to_bottom,transparent_calc(100%-1px),rgb(7_7_6/0.2)_calc(100%-1px))] bg-[size:100%_2.75rem] bg-local font-display text-[clamp(1.375rem,2vw,1.625rem)] leading-[2.75rem] italic outline-none placeholder:text-mute-l placeholder:not-italic focus:bg-[linear-gradient(to_bottom,transparent_calc(100%-1px),rgb(7_7_6/0.45)_calc(100%-1px))]"><?= e($message) ?></textarea>
    </div>

    <div>
      <p class="italic">Yours sincerely,</p>
      <p aria-hidden="true" class="<?= e(cls('font-hand text-[2.25rem] leading-tight', trim($name) !== '' ? 'text-ink' : 'text-mute-l')) ?>" data-letter-signature><?= e(trim($name) !== '' ? trim($name) : 'your name') ?></p>
    </div>
  </div>

  <div class="grid gap-4 border-t border-[var(--line-l)] pt-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8">
    <?= button('Send the letter', ['type' => 'submit', 'tone' => 'light', 'diamond' => true]) ?>
    <p class="text-sm text-mute-l">We only use your number to call you about Vidyansh courses.</p>
  </div>
</form>
