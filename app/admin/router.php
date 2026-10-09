<?php
/** Admin panel: /admin/... Every page needs a signed-in admin except the login page. */

require ROOT . '/app/admin/schema.php';
require ROOT . '/app/admin/forms.php';

session_start();
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

$path = substr(current_path(), strlen('/admin')) ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'POST') csrf_check();

function admin_user(): ?array
{
    static $user = false;
    if ($user !== false) return $user;
    $id = $_SESSION['admin_id'] ?? null;
    if (!$id) return $user = null;
    $st = db()->prepare('SELECT id, name, email FROM admins WHERE id = ?');
    $st->execute([$id]);
    return $user = ($st->fetch() ?: null);
}

function admin_page(string $template, array $vars = [], string $title = ''): never
{
    $vars['title'] = $title;
    echo render('admin/layout', ['content' => render("admin/$template", $vars), 'title' => $title]);
    exit;
}

/** Where to go after a small action: the page it came from, if that is an admin page. */
function admin_back(string $fallback): string
{
    $b = (string) ($_POST['back'] ?? '');
    return preg_match('~^/admin(/|$|\?)~', $b) && !str_contains($b, '//') ? $b : $fallback;
}

/* ---------- Sign in / out ---------- */

if ($path === '/login') {
    $error = null;
    if ($method === 'POST') {
        $attempts = $_SESSION['login_attempts'] ?? [];
        $attempts = array_filter($attempts, fn($t) => $t > time() - 900);
        if (count($attempts) >= 8) {
            $error = 'Too many attempts. Please wait 15 minutes and try again.';
        } else {
            $st = db()->prepare('SELECT * FROM admins WHERE email = ?');
            $st->execute([strtolower(trim($_POST['email'] ?? ''))]);
            $a = $st->fetch();
            if ($a && password_verify((string) ($_POST['password'] ?? ''), $a['password_hash'])) {
                session_regenerate_id(true);
                $_SESSION['admin_id'] = (int) $a['id'];
                unset($_SESSION['login_attempts']);
                db()->prepare('UPDATE admins SET last_login_at = ? WHERE id = ?')->execute([now_str(), $a['id']]);
                if (password_needs_rehash($a['password_hash'], PASSWORD_DEFAULT)) {
                    db()->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')->execute([password_hash($_POST['password'], PASSWORD_DEFAULT), $a['id']]);
                }
                $next = $_SESSION['after_login'] ?? '/admin';
                unset($_SESSION['after_login']);
                redirect(str_starts_with($next, '/admin') ? $next : '/admin');
            }
            $attempts[] = time();
            $error = 'That email and password do not match.';
        }
        $_SESSION['login_attempts'] = $attempts;
    }
    if (admin_user()) redirect('/admin');
    echo render('admin/login', ['error' => $error, 'email' => $_POST['email'] ?? '']);
    exit;
}

if (!admin_user()) {
    if ($method === 'GET') $_SESSION['after_login'] = current_path() . (empty($_SERVER['QUERY_STRING']) ? '' : '?' . $_SERVER['QUERY_STRING']);
    redirect('/admin/login');
}

if ($path === '/logout' && $method === 'POST') {
    $_SESSION = [];
    session_destroy();
    redirect('/admin/login');
}

/* ---------- Dashboard ---------- */

if ($path === '/') {
    $counts = [];
    foreach (admin_collections() as $name => $c) {
        $st = db()->prepare('SELECT COUNT(*) FROM entries WHERE collection = ?');
        $st->execute([$name]);
        $counts[$name] = (int) $st->fetchColumn();
    }
    $newEnquiries = (int) db()->query("SELECT COUNT(*) FROM enquiries WHERE status = 'new'")->fetchColumn();
    $recent = db()->query('SELECT * FROM enquiries ORDER BY id DESC LIMIT 5')->fetchAll();
    admin_page('dashboard', compact('counts', 'newEnquiries', 'recent'), 'Dashboard');
}

/* ---------- File uploads (photos and PDFs), called by assets/js/admin.js ---------- */

if ($path === '/upload' && $method === 'POST') {
    header('Content-Type: application/json');
    $kind = ($_POST['kind'] ?? 'image') === 'file' ? 'file' : 'image';
    $file = $_FILES['file'] ?? null;
    $fail = function (string $msg) { http_response_code(422); echo json_encode(['ok' => false, 'error' => $msg]); exit; };
    if (!$file || $file['error'] !== UPLOAD_ERR_OK) $fail($file && in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) ? 'This file is too big for your hosting. Try a smaller one.' : 'The upload did not arrive. Please try again.');
    if ($file['size'] > 20 * 1024 * 1024) $fail('Please use a file smaller than 20 MB.');
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if ($kind === 'image') {
        $info = @getimagesize($file['tmp_name']);
        $types = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
        if (!$info || !isset($types[$info[2]])) $fail('Please choose a JPG, PNG or WebP photo.');
        $ext = $types[$info[2]];
    } else {
        $head = file_get_contents($file['tmp_name'], false, null, 0, 5);
        if ($ext !== 'pdf' || $head !== '%PDF-') $fail('Please choose a PDF file.');
    }
    $dir = 'uploads/' . date('Y/m');
    if (!is_dir(ROOT . "/$dir") && !mkdir(ROOT . "/$dir", 0755, true)) $fail('The uploads folder is not writable on the server.');
    $base = slugify(pathinfo($file['name'], PATHINFO_FILENAME));
    $name = substr($base, 0, 60) . '-' . bin2hex(random_bytes(3)) . '.' . $ext;
    if (!move_uploaded_file($file['tmp_name'], ROOT . "/$dir/$name")) $fail('Could not save the file on the server.');
    echo json_encode(['ok' => true, 'path' => "$dir/$name", 'url' => media("$dir/$name")]);
    exit;
}

/* ---------- Collections ---------- */

if (preg_match('~^/c/([a-z_]+)(?:/(new|\d+))?(?:/(delete|move|toggle))?$~', $path, $m)) {
    $name = $m[1];
    $schema = admin_collections()[$name] ?? null;
    if (!$schema) { http_response_code(404); admin_page('missing', [], 'Not found'); }
    $target = $m[2] ?? null;
    $action = $m[3] ?? null;
    $listUrl = "/admin/c/$name" . (!empty($_GET['filter']) ? '?filter=' . urlencode($_GET['filter']) : '');

    if ($action && $method === 'POST' && ctype_digit((string) $target)) {
        $row = entry_by_id((int) $target);
        if (!$row || $row['_collection'] !== $name) redirect($listUrl);
        if ($action === 'delete') {
            entry_delete((int) $target);
            flash(ucfirst($schema['item']) . ' deleted.');
        } elseif ($action === 'toggle') {
            db()->prepare('UPDATE entries SET published = ?, updated_at = ? WHERE id = ?')->execute([$row['_published'] ? 0 : 1, now_str(), $row['_id']]);
            flash($row['_published'] ? 'Hidden from the website.' : 'Shown on the website.');
        } elseif ($action === 'move') {
            $rows = entries($name, true);
            $ids = array_column($rows, '_id');
            $i = array_search($row['_id'], $ids, true);
            $j = ($_POST['dir'] ?? '') === 'up' ? $i - 1 : $i + 1;
            if ($i !== false && $j >= 0 && $j < count($ids)) {
                [$ids[$i], $ids[$j]] = [$ids[$j], $ids[$i]];
                $st = db()->prepare('UPDATE entries SET position = ? WHERE id = ?');
                foreach ($ids as $pos => $id) $st->execute([$pos + 1, $id]);
            }
        }
        redirect(admin_back($listUrl));
    }

    if ($target === null) {
        $rows = entries($name, true);
        $filter = $schema['filter'] ?? null;
        $active = $filter ? ($_GET['filter'] ?? '') : '';
        if ($filter && $active !== '') $rows = array_values(array_filter($rows, fn($r) => ($r[$filter['field']] ?? '') === $active));
        admin_page('list', compact('name', 'schema', 'rows', 'filter', 'active'), $schema['label']);
    }

    $row = $target === 'new' ? null : entry_by_id((int) $target);
    if ($target !== 'new' && (!$row || $row['_collection'] !== $name)) redirect($listUrl);
    $original = $row ? entry_strip($row) : [];
    $errors = [];
    $values = $original;
    if ($target === 'new' && !empty($_GET['copy']) && ($src = entry_by_id((int) $_GET['copy'])) && $src['_collection'] === $name) {
        $values = entry_strip($src);
        foreach ($schema['fields'] as $fd) if (!empty($fd['slugFrom']) || $fd['key'] === $schema['slug']) $values[$fd['key']] = '';
    }
    if ($target === 'new' && !empty($schema['filter']) && !empty($_GET['filter'])) $values[$schema['filter']['field']] = $_GET['filter'];

    if ($method === 'POST') {
        $values = admin_parse_fields($schema['fields'], $_POST['f'] ?? [], $original);
        // Fill automatic codes from another field.
        foreach ($schema['fields'] as $fd) {
            if (($values[$fd['key']] ?? '') === '' && (!empty($fd['slugFrom']) || !empty($fd['auto']))) {
                $src = !empty($fd['slugFrom']) ? (string) ($values[$fd['slugFrom']] ?? '') : '';
                $values[$fd['key']] = slugify($src !== '' ? $src : $name . '-' . substr(bin2hex(random_bytes(3)), 0, 6));
            }
        }
        $errors = admin_validate($schema['fields'], $values);
        $slugKey = $schema['slug'];
        $slug = $slugKey ? (string) ($values[$slugKey] ?? '') : ($original ? $row['_slug'] : $name . '-' . bin2hex(random_bytes(4)));
        if ($slugKey) {
            if (!preg_match('~^[A-Za-z0-9][A-Za-z0-9_-]*$~', $slug)) $errors[$slugKey] = 'Use letters, numbers and dashes only (no spaces).';
            $st = db()->prepare('SELECT id FROM entries WHERE collection = ? AND slug = ? AND id <> ?');
            $st->execute([$name, $slug, $row['_id'] ?? 0]);
            if ($st->fetch()) $errors[$slugKey] = 'Another ' . $schema['item'] . ' already uses this. Please choose a different one.';
        }
        if (!$errors) {
            $published = isset($_POST['published']) ? $_POST['published'] === '1' : true;
            $id = entry_save($name, $slug, $values, $row['_id'] ?? null, $published);
            flash(ucfirst($schema['item']) . ' saved.');
            redirect(isset($_POST['save_close']) ? $listUrl : "/admin/c/$name/$id");
        }
    }
    admin_page('edit', compact('name', 'schema', 'row', 'values', 'errors'), ($row ? 'Edit ' : 'New ') . $schema['item']);
}

/* ---------- Blocks ---------- */

if (preg_match('~^/b/([a-z-]+)$~', $path, $m)) {
    $name = $m[1];
    $meta = admin_blocks()[$name] ?? null;
    if (!$meta) { http_response_code(404); admin_page('missing', [], 'Not found'); }
    $original = block($name);
    foreach ($meta['ensure'] ?? [] as $p => $default) if (array_get_path($original, $p) === null) array_set_path($original, $p, $default);
    $fields = admin_infer_fields($original, $meta['hints'] ?? []);
    $values = $original;
    $errors = [];
    if ($method === 'POST') {
        $values = admin_parse_fields($fields, $_POST['f'] ?? [], $original);
        block_save($name, $values);
        flash('Saved.');
        redirect("/admin/b/$name");
    }
    admin_page('block', compact('name', 'meta', 'fields', 'values', 'errors'), $meta['label']);
}

/* ---------- Enquiries ---------- */

if ($path === '/enquiries') {
    if (($_GET['export'] ?? '') === 'csv') {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="vidyansh-enquiries-' . date('Y-m-d') . '.csv"');
        $out = fopen('php://output', 'w');
        fwrite($out, "\xEF\xBB\xBF");
        fputcsv($out, ['Date', 'Name', 'Phone', 'Email', 'Subject', 'Message', 'Details', 'Status']);
        foreach (db()->query('SELECT * FROM enquiries ORDER BY id DESC') as $r) {
            $details = [];
            foreach (json_decode($r['data'] ?? '', true) ?: [] as $k => $v) $details[] = admin_humanize((string) $k) . ': ' . (is_array($v) ? implode(', ', $v) : $v);
            fputcsv($out, [$r['created_at'], $r['name'], $r['phone'], $r['email'], $r['subject'], $r['message'], implode('; ', $details), $r['status']]);
        }
        exit;
    }
    $status = in_array($_GET['status'] ?? '', ['new', 'done'], true) ? $_GET['status'] : '';
    $st = db()->prepare('SELECT * FROM enquiries' . ($status ? ' WHERE status = ?' : '') . ' ORDER BY id DESC LIMIT 500');
    $st->execute($status ? [$status] : []);
    $rows = $st->fetchAll();
    admin_page('enquiries', compact('rows', 'status'), 'Enquiries');
}

if (preg_match('~^/enquiries/(\d+)(?:/(status|delete))?$~', $path, $m)) {
    $st = db()->prepare('SELECT * FROM enquiries WHERE id = ?');
    $st->execute([$m[1]]);
    $enquiry = $st->fetch();
    if (!$enquiry) redirect('/admin/enquiries');
    if ($method === 'POST' && ($m[2] ?? '') === 'status') {
        db()->prepare('UPDATE enquiries SET status = ? WHERE id = ?')->execute([$enquiry['status'] === 'new' ? 'done' : 'new', $enquiry['id']]);
        flash($enquiry['status'] === 'new' ? 'Marked as done.' : 'Marked as new.');
        redirect(admin_back('/admin/enquiries'));
    }
    if ($method === 'POST' && ($m[2] ?? '') === 'delete') {
        db()->prepare('DELETE FROM enquiries WHERE id = ?')->execute([$enquiry['id']]);
        flash('Enquiry deleted.');
        redirect('/admin/enquiries');
    }
    admin_page('enquiry', compact('enquiry'), 'Enquiry from ' . ($enquiry['name'] ?: 'visitor'));
}

/* ---------- Account and other admins ---------- */

if ($path === '/account') {
    $me = admin_user();
    $errors = [];
    if ($method === 'POST') {
        $act = $_POST['action'] ?? '';
        if ($act === 'password') {
            $st = db()->prepare('SELECT password_hash FROM admins WHERE id = ?');
            $st->execute([$me['id']]);
            if (!password_verify((string) ($_POST['current'] ?? ''), (string) $st->fetchColumn())) $errors['current'] = 'Your current password is not right.';
            if (mb_strlen((string) ($_POST['new'] ?? '')) < 8) $errors['new'] = 'Use at least 8 characters.';
            elseif (($_POST['new'] ?? '') !== ($_POST['confirm'] ?? '')) $errors['confirm'] = 'The two new passwords do not match.';
            if (!$errors) {
                db()->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')->execute([password_hash($_POST['new'], PASSWORD_DEFAULT), $me['id']]);
                flash('Password changed.');
                redirect('/admin/account');
            }
        } elseif ($act === 'add') {
            $email = strtolower(trim((string) ($_POST['email'] ?? '')));
            if (trim((string) ($_POST['name'] ?? '')) === '') $errors['name'] = 'Please add a name.';
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Please enter a valid email.';
            if (mb_strlen((string) ($_POST['password'] ?? '')) < 8) $errors['password'] = 'Use at least 8 characters.';
            $st = db()->prepare('SELECT COUNT(*) FROM admins WHERE email = ?');
            $st->execute([$email]);
            if ($st->fetchColumn()) $errors['email'] = 'This email already has an account.';
            if (!$errors) {
                db()->prepare('INSERT INTO admins (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
                    ->execute([trim($_POST['name']), $email, password_hash($_POST['password'], PASSWORD_DEFAULT), now_str()]);
                flash('Admin added. Share the email and password with them privately.');
                redirect('/admin/account');
            }
        } elseif ($act === 'remove') {
            $id = (int) ($_POST['id'] ?? 0);
            if ($id !== (int) $me['id']) {
                db()->prepare('DELETE FROM admins WHERE id = ?')->execute([$id]);
                flash('Admin removed.');
            }
            redirect('/admin/account');
        }
    }
    $admins = db()->query('SELECT id, name, email, created_at, last_login_at FROM admins ORDER BY id')->fetchAll();
    admin_page('account', compact('me', 'admins', 'errors'), 'Account');
}

http_response_code(404);
admin_page('missing', [], 'Not found');
