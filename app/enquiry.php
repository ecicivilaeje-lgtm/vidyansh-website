<?php
/**
 * POST /contact: stores an enquiry written in the contact letter.
 * index.php requires this file with the bootstrap loaded.
 *  - fetch requests (Accept: application/json or X-Requested-With) get JSON: {ok:true} or {ok:false, errors:{field:msg}} with 422
 *  - a normal form post is redirected to /contact?sent=1, or the page is shown again with the errors
 */

csrf_check();

$wantsJson = str_contains((string) ($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json') || !empty($_SERVER['HTTP_X_REQUESTED_WITH']);

$field = function (string $key, int $max = 2000): string {
    $v = $_POST[$key] ?? '';
    if (!is_string($v)) return '';
    $v = trim(str_replace("\0", '', $v));
    return mb_substr($v, 0, $max);
};

$opts = learning_letter_options();
$name = $field('name', 191);
$phone = $field('phone', 64);
$email = $field('email', 191);
$message = $field('message', 5000);
$topic = $field('topic', 64) === 'free-classes' ? 'free-classes' : '';
$exam = learning_find($opts['exams'], 'code', $field('exam', 64)) ? $field('exam', 64) : '';
$course = learning_find($opts['courses'], 'slug', $field('course', 191)) ? $field('course', 191) : '';
$time = learning_find($opts['callTimes'], 'value', $field('time', 64)) ? $field('time', 64) : '';

$respondSent = function () use ($wantsJson, $name, $time): never {
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => true]);
        exit;
    }
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['enquiry_sent'] = ['name' => $name, 'time' => $time];
    redirect('/contact?sent=1');
};

// A filled honeypot means a bot: answer as if it worked and keep nothing.
if ($field('website') !== '') $respondSent();

$errors = learning_letter_errors($name, $phone);
if ($errors) {
    http_response_code(422);
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => false, 'errors' => $errors], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $old = compact('name', 'phone', 'exam', 'course', 'time', 'message', 'topic');
    $content = render('pages/contact', ['errors' => $errors, 'old' => $old]);
    echo render('layout', ['content' => $content, 'meta' => page_meta()]);
    exit;
}

$subject = learning_letter_subject($opts, $course, $topic ?: null);
$data = ['exam' => $exam, 'course' => $course, 'topic' => $topic, 'time' => $time];

$st = db()->prepare('INSERT INTO enquiries (name, phone, email, subject, message, data, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
$st->execute([$name, $phone, $email, mb_substr($subject, 0, 191), $message, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), 'new', now_str()]);

$to = trim((string) config('notify_email', ''));
if ($to !== '' && function_exists('mail')) {
    $examName = learning_find($opts['exams'], 'code', $exam)['name'] ?? 'Not chosen yet';
    $courseName = learning_find($opts['courses'], 'slug', $course)['name'] ?? 'Any course';
    $timeLabel = learning_find($opts['callTimes'], 'value', $time)['label'] ?? 'any time';
    $body = "A new enquiry was written on the website.\n\n"
        . "Name: $name\nPhone: $phone\n" . ($email !== '' ? "Email: $email\n" : '')
        . "Exam: $examName\nCourse: $courseName\nBest time to call: $timeLabel\n" . ($topic !== '' ? "Topic: $topic\n" : '')
        . "\nMessage:\n" . ($message !== '' ? $message : '(none)') . "\n\nReceived " . now_str() . "\n";
    $mailSubject = '=?UTF-8?B?' . base64_encode('New enquiry: ' . preg_replace('/[\r\n]+/', ' ', $subject)) . '?=';
    $host = preg_replace('/[^a-z0-9.-]/i', '', preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost')));
    $headers = "Content-Type: text/plain; charset=UTF-8\r\nFrom: Vidyansh website <no-reply@$host>";
    try {
        @mail(preg_replace('/[\r\n]+/', '', $to), $mailSubject, $body, $headers);
    } catch (Throwable) {
        // A failed notification must not lose the enquiry, which is already stored.
    }
}

$respondSent();
