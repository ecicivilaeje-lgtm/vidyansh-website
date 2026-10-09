<?php
/**
 * Content layer. content('courses') returns the same object the original
 * content/courses.ts exported, e.g. content('site')['menuLinks'].
 *
 * Lists that people add to and edit (courses, test series, blog posts...) are
 * stored as collections; everything else in a file is one editable block.
 * CONTENT_COLLECTIONS says which export (or nested path) each collection fills.
 */

const CONTENT_FILES = [
    'about', 'blog', 'community', 'contact-page', 'courses', 'exams', 'faculty', 'free-classes',
    'free-learning', 'journey', 'mentor', 'method', 'policies', 'results', 'site', 'study-material', 'test-series',
];

/** collection => [content file, path inside that file's export, key used as the row's slug] */
const CONTENT_COLLECTIONS = [
    'courses' => ['courses', 'courses', 'slug'],
    'exams' => ['exams', 'examRoutes', 'code'],
    'test_series' => ['test-series', 'testSeriesCatalogue', 'slug'],
    'series_tests' => ['test-series', 'seriesTests', 'id'],
    'papers' => ['test-series', 'papers', 'id'],
    'result_rows' => ['results', 'resultsBoard.rows', 'id'],
    'stories' => ['results', 'results.stories', 'id'],
    'departments' => ['faculty', 'departments', 'id'],
    'faculty_members' => ['faculty', 'facultyMembers', 'slug'],
    'blog_posts' => ['blog', 'blogPosts', 'slug'],
    'study_materials' => ['study-material', 'studyMaterials', 'id'],
    'programme' => ['free-classes', 'programme', null],
    'lectures' => ['free-classes', 'recordedLectures', 'id'],
    'live_classes' => ['free-classes', 'liveClasses', null],
    'free_resources' => ['free-learning', 'freeResources', null],
    'notices' => ['free-learning', 'notices', null],
];

function array_get_path(array $a, string $path)
{
    foreach (explode('.', $path) as $k) {
        if (!is_array($a) || !array_key_exists($k, $a)) return null;
        $a = $a[$k];
    }
    return $a;
}

function array_set_path(array &$a, string $path, $value): void
{
    $ref = &$a;
    foreach (explode('.', $path) as $k) {
        if (!isset($ref[$k]) || !is_array($ref[$k])) $ref[$k] = [];
        $ref = &$ref[$k];
    }
    $ref = $value;
}

function array_unset_path(array &$a, string $path): void
{
    $keys = explode('.', $path);
    $last = array_pop($keys);
    $ref = &$a;
    foreach ($keys as $k) {
        if (!isset($ref[$k]) || !is_array($ref[$k])) return;
        $ref = &$ref[$k];
    }
    unset($ref[$last]);
}

/** Rows of a collection without the internal _id/_slug fields, as the templates expect them. */
function collection_rows(string $collection): array
{
    return array_map(fn($r) => content_defaults($collection, entry_strip($r)), entries($collection));
}

/**
 * Fills fields an admin left empty with safe defaults, so templates always find every key
 * (an empty list, an empty text, null for "not supplied yet").
 */
function content_defaults(string $collection, array $row): array
{
    if (!function_exists('admin_collections')) require_once ROOT . '/app/admin/schema.php';
    $schema = admin_collections()[$collection] ?? null;
    if (!$schema) return $row;
    $row = content_fill_fields($schema['fields'], $row);
    foreach ($schema['fields'] as $f) {
        if (isset($f['fallback']) && admin_field_blank($row[$f['key']] ?? null)) $row[$f['key']] = ($f['fallback'])($row);
    }
    return $row;
}

function admin_field_blank($v): bool
{
    if (is_array($v)) { foreach ($v as $x) if (!admin_field_blank($x)) return false; return true; }
    return $v === null || $v === '';
}

function content_fill_fields(array $fields, array $row): array
{
    foreach ($fields as $f) {
        $k = $f['key'];
        $has = array_key_exists($k, $row);
        switch ($f['type']) {
            case 'repeater':
                $rows = $has && is_array($row[$k]) ? $row[$k] : [];
                $row[$k] = array_map(fn($r) => is_array($r) ? content_fill_fields($f['fields'], $r) : $r, $rows);
                break;
            case 'group':
                if ($has && is_array($row[$k])) $row[$k] = content_fill_fields($f['fields'], $row[$k]);
                elseif (!$has) $row[$k] = !empty($f['nullable']) ? null : content_fill_fields($f['fields'], []);
                break;
            case 'lines': case 'repeater-text': case 'checks':
                if (!$has || !is_array($row[$k])) $row[$k] = isset($f['length']) ? array_fill(0, (int) $f['length'], '') : [];
                break;
            case 'bool':
                if (!$has) $row[$k] = false;
                break;
            case 'number':
                if (!$has) $row[$k] = !empty($f['nullable']) ? null : 0;
                break;
            default:
                if (!$has) $row[$k] = !empty($f['nullable']) ? null : '';
        }
    }
    return $row;
}

/** The export object of an original content file, rebuilt from blocks and collections. */
function content(string $file): array
{
    static $cache = [];
    if (isset($cache[$file])) return $cache[$file];
    $data = block($file);
    foreach (CONTENT_COLLECTIONS as $collection => [$f, $path]) {
        if ($f === $file) array_set_path($data, $path, collection_rows($collection));
    }
    // Derived values the original files computed.
    switch ($file) {
        case 'exams':
            $data['exams'] = array_values(array_filter($data['examRoutes'], fn($e) => !empty($e['inJourney'])));
            break;
        case 'test-series':
            $data['samplePaper'] = $data['papers'][0] ?? null;
            break;
        case 'results':
            $data['storyFeatures'] = [];
            foreach ($data['results']['stories'] ?? [] as $s) {
                if (!empty($s['feature'])) $data['storyFeatures'][] = ['storyId' => $s['id']] + $s['feature'];
            }
            break;
        case 'free-classes':
            $data['nextLiveClass'] = next_live_class($data['liveClasses'] ?? []);
            break;
    }
    return $cache[$file] = $data;
}

/** The soonest class still to come; otherwise the first one listed. */
function next_live_class(array $classes): ?array
{
    if (!$classes) return null;
    $now = date('Y-m-d\TH:i');
    $upcoming = array_values(array_filter($classes, fn($c) => !empty($c['startsAt']) && $c['startsAt'] >= $now));
    usort($upcoming, fn($a, $b) => strcmp($a['startsAt'], $b['startsAt']));
    if ($upcoming) return $upcoming[0];
    $undated = array_values(array_filter($classes, fn($c) => empty($c['startsAt'])));
    return $undated[0] ?? null;
}

/* ---------------- Data access (mirrors lib/data/*.ts) ---------------- */

function site(): array { return content('site'); }

function get_courses(): array { return content('courses')['courses']; }

function get_course_by_slug(string $slug): ?array
{
    foreach (get_courses() as $c) if ($c['slug'] === $slug) return $c;
    return null;
}

function get_courses_for_exam(string $code): array
{
    return array_values(array_filter(get_courses(), fn($c) => $c['exam'] === $code));
}

/** Exams in route-map order (all of them). */
function get_exams(): array { return content('exams')['examRoutes']; }

function get_exam_by_code(string $code): ?array
{
    foreach (get_exams() as $e) if ($e['code'] === $code) return $e;
    return null;
}

/** The test-series route for an exam, when one exists. */
function test_series_for(?string $code): ?array
{
    foreach (content('test-series')['testSeriesExams'] ?? [] as $e) if ($e['code'] === $code) return $e;
    return null;
}

function get_test_series(array $filter = []): array
{
    return array_values(array_filter(content('test-series')['testSeriesCatalogue'], function ($s) use ($filter) {
        return (empty($filter['exam']) || $s['exam'] === $filter['exam'])
            && (empty($filter['format']) || in_array($filter['format'], $s['formats'] ?? [], true));
    }));
}

function get_featured_test_series(): array
{
    return array_values(array_filter(content('test-series')['testSeriesCatalogue'], fn($s) => !empty($s['featured'])));
}

function get_test_series_by_slug(string $slug): ?array
{
    foreach (content('test-series')['testSeriesCatalogue'] as $s) if ($s['slug'] === $slug) return $s;
    return null;
}

function get_series_tests(string $slug): array
{
    return array_values(array_filter(content('test-series')['seriesTests'], fn($t) => $t['seriesSlug'] === $slug));
}

function get_series_test(string $slug, string $testId): ?array
{
    foreach (get_series_tests($slug) as $t) if ($t['id'] === $testId) return $t;
    return null;
}

/** There is no signed-in student yet, so every visitor is "not purchased"; the free test is open. */
function get_series_progress(string $slug): array
{
    $status = [];
    foreach (get_series_tests($slug) as $t) $status[$t['id']] = !empty($t['isFree']) ? 'available' : 'locked';
    return [
        'access' => 'not_purchased', 'attempted' => null, 'remaining' => null, 'validityLeftDays' => null,
        'avgAccuracy' => null, 'bestRank' => null, 'testStatus' => $status,
    ];
}

function get_paper(?string $paperId): ?array
{
    if (!$paperId) return null;
    foreach (content('test-series')['papers'] as $p) if ($p['id'] === $paperId) return $p;
    return null;
}

function get_results(): array { return content('results')['results']; }

function get_results_board(): array { return content('results')['resultsBoard']; }

function get_result_stories(): array
{
    return array_map(fn($s) => ['story' => $s, 'feature' => !empty($s['feature']) ? ['storyId' => $s['id']] + $s['feature'] : null], get_results()['stories']);
}

function get_founder(): array { return array_merge(content('mentor')['mentor'], content('faculty')['founderFeature']); }

function get_departments(): array { return content('faculty')['departments']; }

function get_faculty_members(): array { return content('faculty')['facultyMembers'] ?? []; }

function get_teaching_statements(): array { return content('faculty')['teachingStatements']; }

function get_study_materials(): array { return content('study-material')['studyMaterials']; }

function get_free_study_materials(): array
{
    return array_values(array_filter(get_study_materials(), fn($m) => $m['availability'] === 'free'));
}

function get_next_live_class(): ?array { return content('free-classes')['nextLiveClass']; }

function get_programme(): array { return content('free-classes')['programme']; }

function get_recorded_lectures(): array { return content('free-classes')['recordedLectures']; }

function get_contact_page(): array { return content('contact-page')['contactPage']; }

/* ---------------- Blog ---------------- */

function get_blog_page(): array { return content('blog')['blogPage']; }

/** Posts without their article body. */
function get_blog_posts(): array
{
    return array_map(function ($p) { unset($p['html']); return $p; }, content('blog')['blogPosts']);
}

function get_blog_posts_for_exam(string $exam): array
{
    return array_values(array_filter(get_blog_posts(), fn($p) => $p['exam'] === $exam));
}

/** A post with its body HTML, contents (from h2 ids), FAQ (from <details>) and read time. */
function get_blog_article(string $slug): ?array
{
    foreach (content('blog')['blogPosts'] as $p) {
        if ($p['slug'] !== $slug) continue;
        $html = blog_prepare_html($p['html'] ?? '');
        $sections = [];
        if (preg_match_all('~<h2[^>]*\bid="([^"]+)"[^>]*>(.*?)</h2>~is', $html, $m, PREG_SET_ORDER)) {
            foreach ($m as $h) $sections[] = ['id' => $h[1], 'title' => trim(html_entity_decode(strip_tags($h[2]), ENT_QUOTES | ENT_HTML5, 'UTF-8'))];
        }
        $faq = [];
        if (preg_match_all('~<details[^>]*>\s*<summary[^>]*>(.*?)</summary>(.*?)</details>~is', $html, $m, PREG_SET_ORDER)) {
            foreach ($m as $d) $faq[] = [
                'q' => trim(html_entity_decode(strip_tags($d[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8')),
                'a' => trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags($d[2]), ENT_QUOTES | ENT_HTML5, 'UTF-8'))),
            ];
        }
        $words = count(preg_split('/\s+/', trim(html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8'))));
        return $p + ['html' => $html, 'sections' => $sections, 'faq' => $faq, 'readMinutes' => max(1, (int) round($words / 220))];
    }
    return null;
}

/**
 * Articles written in the admin editor arrive without heading ids or table wrappers.
 * Give every h2 an id (for the contents rail) and wrap tables so they scroll on phones.
 */
function blog_prepare_html(string $html): string
{
    $used = [];
    $html = preg_replace_callback('~<h2(\s[^>]*)?>(.*?)</h2>~is', function ($m) use (&$used) {
        $attrs = $m[1] ?? '';
        if (preg_match('~\bid="([^"]+)"~', $attrs, $id)) { $used[] = $id[1]; return $m[0]; }
        $base = slugify(html_entity_decode(strip_tags($m[2]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        $slug = $base; $i = 2;
        while (in_array($slug, $used, true)) $slug = $base . '-' . $i++;
        $used[] = $slug;
        return '<h2' . $attrs . ' id="' . e($slug) . '">' . $m[2] . '</h2>';
    }, $html);
    if (!str_contains($html, 'article-table')) {
        $html = preg_replace('~<table\b.*?</table>~is', '<div class="article-table" tabindex="0">$0</div>', $html);
    }
    return $html;
}
