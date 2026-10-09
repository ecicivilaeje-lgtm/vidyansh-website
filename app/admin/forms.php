<?php
/**
 * Admin forms: turns a field list into HTML inputs and turns the submitted form back into data.
 * Blocks have no hand-written field list; admin_infer_fields() works one out from the content itself.
 */

function admin_humanize(string $key): string
{
    $s = preg_replace('/(?<=[a-z0-9])([A-Z])/', ' $1', $key);
    $s = str_replace(['-', '_'], ' ', $s);
    $s = ucfirst(strtolower($s));
    $s = preg_replace('/\b(pyq)\b/i', 'PYQ', $s);
    return $s;
}

/** Merges list items into one representative shape (so an empty repeater still knows its fields). */
function admin_merge_shape(array $items)
{
    $out = null;
    foreach ($items as $it) {
        if (!is_array($it) || array_is_list($it)) { $out ??= $it; if ($out === null) $out = $it; continue; }
        if (!is_array($out)) $out = [];
        foreach ($it as $k => $v) {
            if (!array_key_exists($k, $out) || $out[$k] === null) { $out[$k] = $v; continue; }
            if (is_array($v) && is_array($out[$k])) {
                if (array_is_list($v) && array_is_list($out[$k])) $out[$k] = array_merge($out[$k], $v);
                elseif (!array_is_list($v) && !array_is_list($out[$k])) $out[$k] = admin_merge_shape([$out[$k], $v]);
            }
        }
    }
    return $out;
}

/** Works out form fields from existing content. $hints is keyed by dotted path without list indexes. */
function admin_infer_fields(array $value, array $hints = [], string $prefix = ''): array
{
    $fields = [];
    foreach ($value as $key => $v) {
        $path = $prefix === '' ? (string) $key : "$prefix.$key";
        $hint = $hints[$path] ?? [];
        $f = ['key' => (string) $key, 'label' => $hint['label'] ?? admin_humanize((string) $key)];
        if (!empty($hint['hidden'])) { $fields[] = $f + ['type' => 'keep']; continue; }
        if (isset($hint['type']) && !in_array($hint['type'], ['repeater', 'group'], true)) { $fields[] = $hint + $f; continue; }
        if (is_bool($v)) $f['type'] = 'bool';
        elseif (is_int($v) || is_float($v)) $f += ['type' => 'number', 'step' => is_float($v) ? 'any' : null];
        elseif ($v === null) $f += ['type' => 'text', 'nullable' => true];
        elseif (is_string($v)) $f['type'] = mb_strlen($v) > 70 || str_contains($v, "\n") ? 'textarea' : 'text';
        elseif (is_array($v) && (array_is_list($v) || $v === [])) {
            $sample = admin_merge_shape($v);
            if (is_array($sample) && !array_is_list($sample)) {
                $f += ['type' => 'repeater', 'item' => $hint['item'] ?? 'item', 'fields' => admin_infer_fields($sample, $hints, $path)];
            } elseif (is_array($sample)) {
                $f['type'] = 'keep'; // lists of lists are not edited here
            } else {
                $long = false;
                foreach ($v as $s) if (is_string($s) && mb_strlen($s) > 70) $long = true;
                $f['type'] = $long ? 'repeater-text' : 'lines';
                if (in_array(null, $v, true)) {
                    $f['type'] = 'lines';
                    $f['blankAsNull'] = true;
                    $f['help'] = 'One line each, in order. Leave a line empty for a blank.';
                }
            }
        } elseif (is_array($v)) {
            $f += ['type' => 'group', 'fields' => admin_infer_fields($v, $hints, $path)];
        } else {
            $f['type'] = 'keep';
        }
        $fields[] = array_merge($f, array_diff_key($hint, ['type' => 1]));
    }
    return $fields;
}

/* ---------------- Rendering ---------------- */

function admin_input_class(): string
{
    return 'w-full border border-ivory/25 bg-[#fbf8f2] px-3 py-2.5 text-[1rem] text-ivory outline-none transition-colors focus:border-ivory';
}

/** Renders a list of fields. $values is the current data, $errors maps dotted paths to messages. */
function admin_render_fields(array $fields, array $values, array $errors = [], string $path = ''): string
{
    $html = '';
    foreach ($fields as $f) {
        $html .= admin_render_field($f, $values[$f['key']] ?? null, $errors, $path === '' ? $f['key'] : "$path.{$f['key']}", array_key_exists($f['key'], $values));
    }
    return $html;
}

function admin_render_field(array $f, $value, array $errors, string $path, bool $present = true): string
{
    $type = $f['type'];
    $k = e($f['key']);
    $label = e($f['label']) . (!empty($f['required']) ? ' <span class="text-bad" aria-hidden="true">*</span>' : '');
    $id = 'f-' . preg_replace('/[^a-z0-9]+/i', '-', $path) . '-' . substr(md5(uniqid('', true)), 0, 5);
    $help = !empty($f['help']) ? '<p class="mt-1.5 text-[0.875rem] leading-snug text-mute-d">' . e($f['help']) . '</p>' : '';
    $err = isset($errors[$path]) ? '<p class="mt-1.5 text-[0.875rem] font-medium text-bad">' . e($errors[$path]) . '</p>' : '';
    $wrap = fn(string $control, string $extra = '') => '<div class="admin-field grid gap-1.5' . ($extra ? " $extra" : '') . '"><label for="' . $id . '" class="text-[0.9375rem] font-medium">' . $label . '</label>' . $control . $help . $err . '</div>';
    $in = admin_input_class();

    switch ($type) {
        case 'keep':
            return '<input type="hidden" data-k="' . $k . '" data-json value="' . json_attr($value) . '">';

        case 'text':
            $slugFrom = !empty($f['slugFrom']) ? ' data-slug-from="' . e($f['slugFrom']) . '"' : '';
            return $wrap('<input id="' . $id . '" type="text" data-k="' . $k . '" value="' . e($value) . '" class="' . $in . '"'
                . (!empty($f['placeholder']) ? ' placeholder="' . e($f['placeholder']) . '"' : '') . (!empty($f['required']) ? ' required' : '') . $slugFrom . '>');

        case 'textarea':
            $rows = max(3, min(12, (int) ceil(mb_strlen((string) $value) / 80) + 1));
            return $wrap('<textarea id="' . $id . '" data-k="' . $k . '" rows="' . $rows . '" class="' . $in . ' leading-relaxed"' . (!empty($f['required']) ? ' required' : '') . '>' . "\n" . e($value) . '</textarea>');

        case 'html':
            return $wrap('<div class="grid gap-2"><textarea id="' . $id . '" data-k="' . $k . '" data-editor="html" rows="18" class="' . $in . ' font-mono text-[0.875rem]">' . "\n" . e($value) . '</textarea>'
                . '<label class="inline-flex items-center gap-3 text-[0.875rem] text-mute-d"><span class="border border-ivory/30 px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em]">Upload .html file</span><input type="file" accept=".html,.htm,text/html" data-html-import class="sr-only"></label></div>', 'admin-field--wide');

        case 'number':
            $attrs = '';
            foreach (['min', 'max'] as $a) if (isset($f[$a])) $attrs .= " $a=\"" . e($f[$a]) . '"';
            $attrs .= ' step="' . e($f['step'] ?? 'any') . '"';
            return $wrap('<input id="' . $id . '" type="number" inputmode="decimal" data-k="' . $k . '" value="' . e($value) . '" class="' . $in . ' max-w-[14rem]"' . $attrs . '>');

        case 'datetime':
            return $wrap('<input id="' . $id . '" type="datetime-local" data-k="' . $k . '" value="' . e($value ? substr((string) $value, 0, 16) : '') . '" class="' . $in . ' max-w-[18rem]">');

        case 'bool':
            return '<div class="admin-field"><label class="inline-flex cursor-pointer items-center gap-3 text-[0.9375rem] font-medium"><input type="hidden" data-k="' . $k . '" value="0"><input type="checkbox" data-k="' . $k . '" value="1" class="size-5 accent-[#070706]"' . ($value ? ' checked' : '') . '>' . e($f['label']) . '</label>' . $help . $err . '</div>';

        case 'select':
            $opts = admin_options($f['options'] ?? []);
            $cur = $value === null ? '' : (string) $value;
            $o = '';
            if ($cur !== '' && !array_key_exists($cur, $opts)) $opts = [$cur => $cur] + $opts;
            foreach ($opts as $v => $l) $o .= '<option value="' . e($v) . '"' . ((string) $v === $cur ? ' selected' : '') . '>' . e($l) . '</option>';
            return $wrap('<select id="' . $id . '" data-k="' . $k . '" class="' . $in . ' max-w-[28rem]">' . $o . '</select>');

        case 'checks':
            $opts = admin_options($f['options'] ?? []);
            $cur = is_array($value) ? array_map('strval', $value) : [];
            $o = '<input type="hidden" data-k="' . $k . '" data-checks-empty value="">';
            foreach ($opts as $v => $l) $o .= '<label class="inline-flex items-center gap-2.5 text-[0.9375rem]"><input type="checkbox" data-k="' . $k . '" data-multi value="' . e($v) . '" class="size-5 accent-[#070706]"' . (in_array((string) $v, $cur, true) ? ' checked' : '') . '>' . e($l) . '</label>';
            return '<fieldset class="admin-field grid gap-2"><legend class="mb-1.5 text-[0.9375rem] font-medium">' . $label . '</legend><div class="flex flex-wrap gap-x-6 gap-y-2">' . $o . '</div>' . $help . $err . '</fieldset>';

        case 'lines':
            $lines = is_array($value) ? implode("\n", array_map('strval', $value)) : (string) $value;
            $rows = max(isset($f['length']) ? (int) $f['length'] : 3, min(14, substr_count($lines, "\n") + 2));
            return $wrap('<textarea id="' . $id . '" data-k="' . $k . '" data-lines rows="' . $rows . '" class="' . $in . ' leading-relaxed">' . "\n" . e($lines) . '</textarea>');

        case 'image':
        case 'file':
            $isImage = $type === 'image';
            $preview = $value ? ($isImage ? '<img src="' . e(media($value)) . '" alt="" class="max-h-40 w-auto border border-ivory/15 bg-white object-contain">' : '<a href="' . e(media($value)) . '" target="_blank" rel="noopener" class="link-underline break-all text-[0.9375rem]">' . e(basename((string) $value)) . '</a>') : '<span class="text-[0.9375rem] text-mute-d">Nothing uploaded yet</span>';
            return '<div class="admin-field grid gap-2" data-upload="' . ($isImage ? 'image' : 'file') . '"><span class="text-[0.9375rem] font-medium">' . $label . '</span>'
                . '<input type="hidden" data-k="' . $k . '" data-upload-value value="' . e($value) . '">'
                . '<div data-upload-preview class="flex min-h-12 items-center">' . $preview . '</div>'
                . '<div class="flex flex-wrap items-center gap-3"><label class="cursor-pointer border border-ivory px-4 py-2.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] hover:bg-ivory hover:text-ink">' . ($isImage ? 'Choose photo' : 'Choose file')
                . '<input type="file" class="sr-only" data-upload-input accept="' . ($isImage ? 'image/jpeg,image/png,image/webp' : 'application/pdf,.pdf') . '"></label>'
                . '<button type="button" data-upload-remove class="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-mute-d underline hover:text-ivory"' . ($value ? '' : ' hidden') . '>Remove</button>'
                . '<span data-upload-status class="text-[0.875rem] text-mute-d" role="status"></span></div>' . $help . $err . '</div>';

        case 'group':
            $vals = is_array($value) ? $value : [];
            return '<fieldset class="admin-field admin-field--wide grid gap-5 border border-ivory/15 p-4 sm:p-5" data-k="' . $k . '" data-kind="group"><legend class="px-2 font-display text-[1.375rem] leading-none">' . e($f['label']) . '</legend>' . $help
                . admin_render_fields($f['fields'], $vals, $errors, $path) . '</fieldset>';

        case 'repeater':
        case 'repeater-text':
            $items = is_array($value) ? array_values($value) : [];
            $item = e($f['item'] ?? 'item');
            $rows = '';
            foreach ($items as $i => $row) $rows .= admin_render_row($f, $row, $errors, "$path.$i");
            $tpl = admin_render_row($f, $type === 'repeater' ? [] : '', [], "$path.new");
            return '<fieldset class="admin-field admin-field--wide grid gap-3" data-k="' . $k . '" data-kind="repeater">'
                . '<legend class="mb-2 font-display text-[1.375rem] leading-none">' . e($f['label']) . ' <span class="font-mono text-[0.75rem] text-mute-d" data-count>' . count($items) . '</span></legend>' . $help . $err
                . '<ol class="grid gap-3" data-rows>' . $rows . '</ol>'
                . '<template data-row-template>' . $tpl . '</template>'
                . '<button type="button" data-row-add class="justify-self-start border border-dashed border-ivory/40 px-4 py-2.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] hover:border-ivory">+ Add ' . $item . '</button></fieldset>';
    }
    return '';
}

function admin_render_row(array $f, $row, array $errors, string $path): string
{
    $controls = '<div class="flex shrink-0 gap-1" role="group" aria-label="Move or remove">'
        . '<button type="button" data-row-up class="grid size-9 place-items-center border border-ivory/20 hover:border-ivory" aria-label="Move up">↑</button>'
        . '<button type="button" data-row-down class="grid size-9 place-items-center border border-ivory/20 hover:border-ivory" aria-label="Move down">↓</button>'
        . '<button type="button" data-row-remove class="grid size-9 place-items-center border border-ivory/20 text-bad hover:border-bad" aria-label="Remove">✕</button></div>';
    if ($f['type'] === 'repeater-text') {
        $rows = max(3, min(12, (int) ceil(mb_strlen((string) $row) / 80) + 1));
        return '<li data-row class="flex items-start gap-3"><textarea data-k="" data-row-text rows="' . $rows . '" aria-label="' . e($f['item'] ?? 'Item') . '" class="' . admin_input_class() . ' leading-relaxed">' . e(is_string($row) ? $row : '') . '</textarea>' . $controls . '</li>';
    }
    $summary = '';
    if (is_array($row)) foreach ($row as $v) if (is_string($v) && trim($v) !== '') { $summary = mb_strimwidth(strip_tags($v), 0, 70, '…'); break; }
    $open = $summary === '' || str_ends_with($path, '.new') || array_filter(array_keys($errors), fn($p) => str_starts_with($p, $path . '.'));
    return '<li data-row class="border border-ivory/15 bg-[#fbf8f2]/60"><details' . ($open ? ' open' : '') . '>'
        . '<summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden"><span class="flex min-w-0 items-baseline gap-3"><span class="font-mono text-[0.75rem] text-mute-d" data-row-no></span><span class="truncate font-medium" data-row-summary>' . e($summary !== '' ? $summary : 'New ' . ($f['item'] ?? 'item')) . '</span></span>' . $controls . '</summary>'
        . '<div class="grid gap-5 border-t border-ivory/10 p-4 sm:p-5">' . admin_render_fields($f['fields'], is_array($row) ? $row : [], $errors, $path) . '</div></details></li>';
}

/* ---------------- Reading the submitted form ---------------- */

/** Converts submitted values back into typed data, keeping keys the form did not show. */
function admin_parse_fields(array $fields, array $input, array $original = []): array
{
    $out = $original;
    foreach ($fields as $f) {
        $k = $f['key'];
        if ($f['type'] === 'keep') {
            if (array_key_exists($k, $input)) {
                $decoded = json_decode((string) $input[$k], true);
                $out[$k] = $decoded;
            }
            continue;
        }
        $parsed = admin_parse_value($f, $input[$k] ?? null, $original[$k] ?? null);
        if (!array_key_exists($k, $original) && admin_is_blank($parsed)) {
            continue; // optional field left empty: leave it out, like the original content does
        }
        $out[$k] = $parsed;
    }
    return $out;
}

function admin_parse_value(array $f, $raw, $original)
{
    $nullable = !empty($f['nullable']);
    switch ($f['type']) {
        case 'text': case 'textarea': case 'html': case 'datetime': case 'image': case 'file':
            $s = is_string($raw) ? str_replace("\r\n", "\n", $raw) : '';
            if (in_array($f['type'], ['datetime', 'image', 'file'], true)) $s = trim($s);
            if ($f['type'] === 'html') $s = admin_clean_html($s);
            if (is_string($original) && $s !== '' && trim($s) === trim($original)) $s = $original; // keep original spacing when unchanged
            return trim($s) === '' ? ($nullable ? null : '') : $s;
        case 'select':
            $s = is_string($raw) ? trim($raw) : '';
            if ($s === '') return $nullable ? null : '';
            return ($f['cast'] ?? '') === 'int' ? (int) $s : $s;
        case 'number':
            $s = is_string($raw) ? trim($raw) : '';
            if ($s === '' || !is_numeric($s)) return $nullable ? null : 0;
            return str_contains($s, '.') ? (float) $s : (int) $s;
        case 'bool':
            return is_array($raw) ? in_array('1', $raw, true) : $raw === '1';
        case 'checks':
            $picked = array_values(array_filter(is_array($raw) ? array_map('strval', $raw) : [], fn($v) => $v !== ''));
            $kept = array_values(array_filter(is_array($original) ? array_map('strval', $original) : [], fn($v) => in_array($v, $picked, true)));
            return array_values(array_unique(array_merge($kept, $picked)));
        case 'lines':
            $all = explode("\n", str_replace("\r\n", "\n", is_string($raw) ? $raw : ''));
            if (!empty($f['blankAsNull'])) {
                $n = is_array($original) && $original ? count($original) : count($all);
                $all = array_slice(array_pad($all, $n, ''), 0, $n);
                return array_map(fn($l) => trim($l) === '' ? null : trim($l), $all);
            }
            $lines = array_values(array_filter($all, fn($l) => trim($l) !== ''));
            $orig = is_array($original) ? $original : [];
            foreach ($lines as $i => $l) if (!isset($orig[$i]) || !is_string($orig[$i]) || trim($orig[$i]) !== trim($l)) $lines[$i] = trim($l); else $lines[$i] = $orig[$i];
            if (isset($f['length'])) $lines = array_slice(array_pad($lines, (int) $f['length'], ''), 0, (int) $f['length']);
            return $lines;
        case 'repeater-text':
            $orig = is_array($original) ? array_values($original) : [];
            $out = [];
            foreach (is_array($raw) ? array_values($raw) : [] as $s) {
                $s = str_replace("\r\n", "\n", (string) $s);
                if (trim($s) === '') continue;
                $match = null;
                foreach ($orig as $o) if (is_string($o) && trim($o) === trim($s)) { $match = $o; break; }
                $out[] = $match ?? trim($s);
            }
            return $out;
        case 'repeater':
            $rows = [];
            $orig = is_array($original) ? array_values($original) : [];
            foreach (is_array($raw) ? array_values($raw) : [] as $row) {
                if (!is_array($row)) continue;
                $parsed = admin_parse_fields($f['fields'], $row, []);
                foreach ($orig as $o) if (is_array($o) && admin_rows_match($f['fields'], $o, $parsed)) { $parsed = admin_parse_fields($f['fields'], $row, $o); break; }
                if (admin_is_empty($parsed)) continue;
                $rows[] = $parsed;
            }
            return $rows;
        case 'group':
            $parsed = admin_parse_fields($f['fields'], is_array($raw) ? $raw : [], is_array($original) ? $original : []);
            return ($nullable && admin_is_empty($parsed)) ? null : $parsed;
    }
    return $raw;
}

/** True when a submitted row is the same as an original row apart from spacing. */
function admin_rows_match(array $fields, array $orig, array $parsed): bool
{
    $norm = function ($v) use (&$norm) { return is_array($v) ? array_map($norm, $v) : (is_string($v) ? trim($v) : $v); };
    foreach ($fields as $f) {
        if ($f['type'] === 'keep') continue;
        if ($norm($orig[$f['key']] ?? null) != $norm($parsed[$f['key']] ?? null) && !(admin_is_blank($orig[$f['key']] ?? null) && admin_is_blank($parsed[$f['key']] ?? null))) return false;
    }
    return true;
}

function admin_is_empty($v): bool
{
    if ($v === null || $v === '' || $v === false || $v === []) return true;
    if (is_array($v)) { foreach ($v as $x) if (!admin_is_empty($x)) return false; return true; }
    return false;
}

/** Like admin_is_empty, but zero counts as blank too (used for fields an item did not have before). */
function admin_is_blank($v): bool
{
    if ($v === 0 || $v === 0.0) return true;
    if (is_array($v)) { foreach ($v as $x) if (!admin_is_blank($x)) return false; return true; }
    return admin_is_empty($v);
}

/** Checks required fields; returns [dotted path => message]. */
function admin_validate(array $fields, array $data, string $path = ''): array
{
    $errors = [];
    foreach ($fields as $f) {
        $p = $path === '' ? $f['key'] : "$path.{$f['key']}";
        $v = $data[$f['key']] ?? null;
        if (!empty($f['required']) && admin_is_empty($v)) $errors[$p] = 'Please fill this in.';
        if ($f['type'] === 'group' && is_array($v)) $errors += admin_validate($f['fields'], $v, $p);
        if ($f['type'] === 'repeater' && is_array($v)) foreach ($v as $i => $row) $errors += admin_validate($f['fields'], $row, "$p.$i");
    }
    return $errors;
}

/** Removes scripts and inline event handlers from rich text. Admins are trusted; this guards against pasted junk. */
function admin_clean_html(string $html): string
{
    if ($html === '') return '';
    $html = preg_replace('~<(script|style|iframe|object|embed|form)\b.*?</\1>~is', '', $html);
    $html = preg_replace('~<(script|style|iframe|object|embed|link|meta|base)\b[^>]*>~i', '', $html);
    $html = preg_replace('~\son\w+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)~i', '', $html);
    $html = preg_replace('~(href|src)\s*=\s*(["\'])\s*javascript:[^"\']*\2~i', '$1="#"', $html);
    return trim($html);
}
