<?php
/**
 * What the admin panel can edit, and how each field is shown.
 *
 * Field types: text, textarea, html (rich text), number, bool, select, checks (multi-select),
 * image, file, lines (a list of short texts, one per line), repeater (a list of groups), group, datetime.
 * Options: help, required, nullable (empty saves as null), options (list or source name), fields (repeater/group),
 * min/max/step, placeholder, length (fixed number of lines for "lines"), item (label for one repeater row).
 */

/** "SSC JE Complete" -> ["SSC JE", "Complete"]: a display title in two parts, the last word set in italics. */
function content_split_title(string $text): array
{
    $text = trim($text);
    $pos = mb_strrpos($text, ' ');
    return $pos === false ? [$text, ''] : [mb_substr($text, 0, $pos), mb_substr($text, $pos + 1)];
}

function f(string $key, string $label, string $type = 'text', array $opts = []): array
{
    return ['key' => $key, 'label' => $label, 'type' => $type] + $opts;
}

/** Choices that come from other content. */
function admin_options(string|array $source): array
{
    if (is_array($source)) return array_is_list($source) ? array_combine($source, $source) : $source;
    switch ($source) {
        case 'exams':
            $o = [];
            foreach (entries('exams', true) as $e) $o[$e['code']] = $e['name'];
            return $o;
        case 'exams+multi':
            return admin_options('exams') + ['multi' => 'Multiple exams'];
        case 'departments':
            $o = [];
            foreach (entries('departments', true) as $d) $o[$d['id']] = $d['name'];
            return $o;
        case 'series':
            $o = [];
            foreach (entries('test_series', true) as $s) $o[$s['slug']] = $s['name'];
            return $o;
        case 'papers':
            $o = ['' => 'No playable paper yet'];
            foreach (entries('papers', true) as $p) $o[$p['id']] = $p['title'] . ' (' . count($p['questions'] ?? []) . ' questions)';
            return $o;
        case 'formats':
            return ['full-length' => 'Full-length mock', 'subject' => 'Subject-wise', 'chapter' => 'Chapter-wise', 'pyq' => 'Previous year paper'];
        case 'weekdays':
            return ['Mon' => 'Monday', 'Tue' => 'Tuesday', 'Wed' => 'Wednesday', 'Thu' => 'Thursday', 'Fri' => 'Friday', 'Sat' => 'Saturday', 'Sun' => 'Sunday'];
    }
    return [];
}

/** Collections: lists of items. 'slug' = the field that names the item in links (unique). */
function admin_collections(): array
{
    static $c = null;
    if ($c) return $c;
    $examHelp = 'Which exam this belongs to.';
    return $c = [
        'courses' => [
            'label' => 'Courses', 'item' => 'course', 'group' => 'Courses & exams', 'title' => 'name', 'subtitle' => 'category', 'slug' => 'slug',
            'view' => fn($r) => '/courses/' . $r['slug'],
            'fields' => [
                f('name', 'Course name', 'text', ['required' => true, 'placeholder' => 'SSC JE Complete']),
                f('slug', 'Web address', 'text', ['required' => true, 'help' => 'Used in the link: /courses/this-text. Small letters and dashes only.', 'slugFrom' => 'name']),
                f('title', 'Title as shown on the page', 'lines', ['length' => 2, 'help' => 'Two lines: the first is set in normal type, the second in italics. Leave empty to use the course name.', 'fallback' => fn($r) => content_split_title((string) $r['name'])]),
                f('exam', 'Exam', 'select', ['options' => 'exams', 'help' => $examHelp]),
                f('category', 'Exam category line', 'text', ['placeholder' => 'Staff Selection Commission · Junior Engineer']),
                f('summary', 'Short summary', 'textarea'),
                f('lead', 'One-line promise', 'textarea'),
                f('mode', 'Mode', 'select', ['options' => ['Live', 'Recorded', 'Live + recorded']]),
                f('duration', 'Duration', 'text', ['placeholder' => '10 months']),
                f('nextBatch', 'Next batch', 'text'),
                f('medium', 'Medium (language)', 'text'),
                f('testSeries', 'Test series included', 'text'),
                f('liveDoubts', 'Live doubt sessions', 'text'),
                f('practiceExam', 'Test series exam to link to', 'select', ['options' => ['' => 'None'] + admin_options('exams'), 'nullable' => true]),
                f('image', 'Course photo', 'group', ['fields' => [
                    f('src', 'Photo', 'image', ['help' => 'Optional. Until a photo is added the course shows its engineering drawing.']),
                    f('alt', 'Describe the photo (for blind visitors)', 'text'),
                ], 'nullable' => true]),
                f('plate', 'Drawing shown when there is no photo', 'select', ['options' => ['beam' => 'Beam', 'track' => 'Railway track', 'bridge' => 'Bridge', 'gear' => 'Gear']]),
                f('benefits', 'Key benefits', 'repeater', ['item' => 'benefit', 'fields' => [f('title', 'Title'), f('body', 'Text', 'textarea')]]),
                f('overview', 'Overview paragraphs', 'repeater-text', ['item' => 'paragraph']),
                f('syllabusNote', 'Note beside the syllabus', 'textarea'),
                f('modules', 'Syllabus', 'repeater', ['item' => 'subject', 'fields' => [
                    f('subject', 'Subject'), f('stage', 'Paper or stage', 'text', ['help' => 'Optional, e.g. "Paper I"']), f('topics', 'Topics (one per line)', 'lines'),
                ]]),
                f('week', 'A typical week', 'repeater', ['item' => 'day', 'fields' => [f('day', 'Day'), f('focus', 'Focus'), f('note', 'Note', 'textarea')]]),
                f('included', 'What the course includes', 'repeater', ['item' => 'item', 'fields' => [f('title', 'Title'), f('body', 'Text', 'textarea')]]),
            ],
        ],
        'exams' => [
            'label' => 'Exams', 'item' => 'exam', 'group' => 'Courses & exams', 'title' => 'name', 'subtitle' => 'fullName', 'slug' => 'code',
            'view' => fn($r) => '/exams',
            'fields' => [
                f('name', 'Short name', 'text', ['required' => true, 'placeholder' => 'SSC JE']),
                f('code', 'Code', 'text', ['required' => true, 'help' => 'Small letters and dashes, e.g. ssc-je. Courses, test series and results refer to the exam by this code, so avoid changing it.', 'slugFrom' => 'name']),
                f('fullName', 'Full name', 'text'),
                f('descriptor', 'Descriptor under the compass', 'text'),
                f('inJourney', 'Show in the homepage exam chooser', 'bool'),
                f('bearing', 'Compass bearing (degrees, only for the drawing)', 'number', ['min' => 0, 'max' => 360]),
                f('forWhom', 'Who it is for', 'textarea'),
                f('eligibility', 'Eligibility', 'textarea'),
                f('stages', 'Stages, in order (one per line)', 'lines'),
                f('routeNote', 'Route note', 'textarea'),
            ],
        ],
        'test_series' => [
            'label' => 'Test series', 'item' => 'test series', 'group' => 'Test series', 'title' => 'name', 'subtitle' => 'examLabel', 'slug' => 'slug',
            'view' => fn($r) => '/test-series/series/' . $r['slug'],
            'fields' => [
                f('name', 'Name', 'text', ['required' => true]),
                f('slug', 'Web address', 'text', ['required' => true, 'help' => 'Used in the link: /test-series/series/this-text.', 'slugFrom' => 'name']),
                f('id', 'Short code', 'text', ['required' => true, 'help' => 'Short code used to number its tests, e.g. SSCJE-FL. Tests are named CODE-T01, CODE-T02...']),
                f('exam', 'Exam', 'select', ['options' => 'exams+multi']),
                f('examLabel', 'Exam label shown', 'text'),
                f('formats', 'Formats', 'checks', ['options' => 'formats']),
                f('subjects', 'Subjects (one per line)', 'lines'),
                f('testCount', 'Number of tests', 'number', ['nullable' => true, 'help' => 'Leave empty to show "—" until confirmed.']),
                f('questionsPerTest', 'Questions per test', 'number', ['nullable' => true]),
                f('durationMin', 'Duration (minutes)', 'number', ['nullable' => true]),
                f('difficulty', 'Difficulty (1 to 5)', 'number', ['min' => 1, 'max' => 5]),
                f('hasSolutions', 'Includes solutions', 'bool'),
                f('hasAnalysis', 'Includes analysis', 'bool'),
                f('validityDays', 'Validity (days)', 'number', ['nullable' => true]),
                f('price', 'Price (₹)', 'number', ['nullable' => true]),
                f('originalPrice', 'Original price before discount (₹)', 'number', ['nullable' => true]),
                f('schedule', 'Schedule note', 'text', ['placeholder' => 'Live this Sunday']),
                f('featured', 'Feature on the homepage', 'bool'),
            ],
        ],
        'series_tests' => [
            'label' => 'Tests', 'item' => 'test', 'group' => 'Test series', 'title' => 'title', 'subtitle' => 'id', 'slug' => 'id',
            'filter' => ['field' => 'seriesSlug', 'label' => 'Series', 'options' => 'series'],
            'view' => fn($r) => '/test-series/series/' . $r['seriesSlug'] . '/tests/' . $r['id'],
            'fields' => [
                f('title', 'Test title', 'text', ['required' => true]),
                f('seriesSlug', 'Belongs to series', 'select', ['options' => 'series']),
                f('id', 'Test code', 'text', ['required' => true, 'help' => 'Series code + number, e.g. SSCJE-FL-T01. The test ending in T01 is the free one.']),
                f('number', 'Test number', 'number'),
                f('format', 'Format', 'select', ['options' => 'formats']),
                f('isFree', 'Free test', 'bool'),
                f('questions', 'Number of questions', 'number', ['nullable' => true]),
                f('durationMin', 'Duration (minutes)', 'number', ['nullable' => true]),
                f('releaseNote', 'Release note', 'text', ['placeholder' => 'Releases with the series']),
                f('paperId', 'Question paper', 'select', ['options' => 'papers', 'nullable' => true, 'help' => 'Which question paper opens when a student starts this test.']),
            ],
        ],
        'papers' => [
            'label' => 'Question papers', 'item' => 'question paper', 'group' => 'Test series', 'title' => 'title', 'subtitle' => 'id', 'slug' => 'id',
            'fields' => [
                f('title', 'Paper title', 'text', ['required' => true]),
                f('id', 'Paper code', 'text', ['required' => true, 'slugFrom' => 'title']),
                f('durationMin', 'Duration (minutes)', 'number'),
                f('marking', 'Marking', 'group', ['fields' => [
                    f('correct', 'Marks for a correct answer', 'number', ['step' => 'any']),
                    f('wrong', 'Marks for a wrong answer (negative, e.g. -0.25)', 'number', ['step' => 'any']),
                ]]),
                f('languages', 'Languages (one per line)', 'lines'),
                f('questions', 'Questions', 'repeater', ['item' => 'question', 'fields' => [
                    f('id', 'Question code', 'text', ['help' => 'Any unique short code, e.g. q1.']),
                    f('subject', 'Subject'),
                    f('text', 'Question', 'textarea'),
                    f('options', 'Options (one per line, in order A, B, C, D)', 'lines'),
                    f('answer', 'Correct option', 'select', ['options' => ['0' => 'A (first line)', '1' => 'B (second line)', '2' => 'C (third line)', '3' => 'D (fourth line)', '4' => 'E (fifth line)'], 'cast' => 'int']),
                    f('explanation', 'Explanation', 'textarea'),
                ]]),
            ],
        ],
        'result_rows' => [
            'label' => 'Results board', 'item' => 'result', 'group' => 'Results', 'title' => 'student', 'subtitle' => 'destination', 'slug' => 'id',
            'view' => fn($r) => '/results',
            'help' => 'Publish a result only when it is verified and the student has agreed.',
            'fields' => [
                f('student', 'Student name', 'text', ['required' => true]),
                f('from', 'From (home town)', 'text'),
                f('destination', 'Destination (post / department)', 'text'),
                f('exam', 'Exam', 'select', ['options' => 'exams']),
                f('rank', 'Rank', 'text'),
                f('year', 'Year', 'text', ['placeholder' => date('Y')]),
                f('id', 'Code', 'text', ['help' => 'Any unique short code.', 'auto' => true]),
            ],
        ],
        'stories' => [
            'label' => 'Success stories', 'item' => 'story', 'group' => 'Results', 'title' => 'firstName', 'subtitle' => 'rank', 'slug' => 'id',
            'view' => fn($r) => '/results',
            'fields' => [
                f('firstName', 'Student first name', 'text', ['required' => true]),
                f('quote', 'Quote', 'textarea'),
                f('byline', 'Byline', 'text'),
                f('rank', 'Rank / result', 'text'),
                f('id', 'Code', 'text', ['auto' => true]),
                f('feature', 'Long story on the Results page', 'group', ['nullable' => true, 'fields' => [
                    f('headline', 'Headline'),
                    f('standfirst', 'Standfirst', 'textarea'),
                    f('journey', 'Journey, Dream to Destination', 'repeater', ['item' => 'stop', 'fields' => [f('stage', 'Stage'), f('note', 'Note', 'textarea')]]),
                ]]),
            ],
        ],
        'faculty_members' => [
            'label' => 'Faculty members', 'item' => 'teacher', 'group' => 'Faculty', 'title' => 'name', 'subtitle' => 'role', 'slug' => 'slug',
            'view' => fn($r) => '/faculty',
            'fields' => [
                f('name', 'Name', 'text', ['required' => true]),
                f('slug', 'Code', 'text', ['slugFrom' => 'name', 'auto' => true]),
                f('department', 'Department', 'select', ['options' => 'departments']),
                f('role', 'Role', 'text', ['placeholder' => 'Faculty, Structural Engineering']),
                f('subjects', 'Subjects taught', 'text'),
                f('bio', 'Short profile', 'textarea'),
                f('photo', 'Photo', 'image'),
            ],
        ],
        'departments' => [
            'label' => 'Departments', 'item' => 'department', 'group' => 'Faculty', 'title' => 'name', 'subtitle' => 'summary', 'slug' => 'id',
            'view' => fn($r) => '/faculty',
            'fields' => [
                f('name', 'Name', 'text', ['required' => true]),
                f('id', 'Code', 'text', ['slugFrom' => 'name', 'help' => 'Faculty members refer to the department by this code.']),
                f('summary', 'Summary', 'textarea'),
                f('subjects', 'Subjects (one per line)', 'lines'),
                f('slots', 'Empty profile places to show until teachers are added', 'number', ['min' => 0]),
            ],
        ],
        'blog_posts' => [
            'label' => 'Blog posts', 'item' => 'blog post', 'group' => 'Learning', 'title' => 'title', 'subtitle' => 'board', 'slug' => 'slug',
            'view' => fn($r) => '/blog/' . $r['slug'],
            'fields' => [
                f('title', 'Title', 'text', ['required' => true]),
                f('slug', 'Web address', 'text', ['required' => true, 'help' => 'Used in the link: /blog/this-text.', 'slugFrom' => 'title']),
                f('html', 'Article', 'html', ['help' => 'Write the article here, or upload an .html file to replace it. Use "Heading 2" for main sections: they become the "In this guide" list. Questions inside a <details> block become the FAQ.']),
                f('author', 'Written by', 'text', ['placeholder' => 'Shubham Sir', 'fallback' => fn($r) => 'Shubham Sir']),
                f('description', 'Short description (for Google and the blog list)', 'textarea'),
                f('exam', 'Exam', 'select', ['options' => 'exams']),
                f('examLabel', 'Exam label shown', 'text', ['placeholder' => 'SSC JE', 'fallback' => fn($r) => admin_options('exams')[$r['exam']] ?? '']),
                f('board', 'Board / commission', 'text'),
                f('category', 'Category', 'text', ['placeholder' => 'Exam guide']),
                f('short', 'Big title in the blog list', 'lines', ['length' => 2, 'help' => 'Two lines, e.g. "SSC JE" and "2026". Leave empty to use the exam label.', 'fallback' => fn($r) => content_split_title((string) ($r['examLabel'] !== '' ? $r['examLabel'] : $r['title']))]),
                f('figures', 'Three key figures (copy them from the article)', 'repeater', ['item' => 'figure', 'fields' => [f('value', 'Value'), f('label', 'Label')]]),
                f('disclaimer', 'Disclaimer', 'textarea'),
            ],
        ],
        'study_materials' => [
            'label' => 'Study material', 'item' => 'book', 'group' => 'Learning', 'title' => 'title', 'subtitle' => 'code', 'slug' => 'id',
            'view' => fn($r) => '/study-material',
            'fields' => [
                f('title', 'Title', 'text', ['required' => true]),
                f('code', 'Shelf code on the spine', 'text', ['placeholder' => 'SOM-01']),
                f('id', 'Code', 'text', ['slugFrom' => 'code', 'auto' => true]),
                f('subject', 'Subject'),
                f('exams', 'Exams', 'checks', ['options' => 'exams']),
                f('format', 'Format', 'select', ['options' => ['notes' => 'Notes', 'formula-sheet' => 'Formula sheet', 'pyq-solutions' => 'Previous papers, solved', 'practice-book' => 'Practice book']]),
                f('pages', 'Pages', 'number', ['nullable' => true]),
                f('availability', 'Who can get it', 'select', ['options' => ['free' => 'Free for everyone', 'course' => 'Course students']]),
                f('downloadHref', 'File (PDF)', 'file', ['nullable' => true, 'help' => 'Upload the PDF. Until then the download shows "Coming soon".']),
                f('spine', 'Spine on the shelf', 'group', ['fields' => [
                    f('tone', 'Colour', 'select', ['options' => ['ink' => 'Ink', 'graphite' => 'Graphite', 'charcoal' => 'Charcoal', 'parchment' => 'Parchment']]),
                    f('height', 'Height (rem, 14 to 19)', 'number', ['step' => 'any']),
                    f('width', 'Thickness (rem, 2.6 to 4.2)', 'number', ['step' => 'any']),
                ]]),
            ],
        ],
        'live_classes' => [
            'label' => 'Live classes', 'item' => 'live class', 'group' => 'Learning', 'title' => 'title', 'subtitle' => 'startsAt', 'slug' => null,
            'view' => fn($r) => '/free-classes',
            'help' => 'The website shows the soonest class still to come. Classes without a date show "Schedule to be announced".',
            'fields' => [
                f('title', 'Class title', 'text', ['required' => true]),
                f('subject', 'Subject'),
                f('exam', 'Exam label', 'text', ['placeholder' => 'SSC JE · RRB JE']),
                f('startsAt', 'Date and time', 'datetime', ['nullable' => true]),
                f('link', 'Link to watch (YouTube etc.)', 'text', ['nullable' => true]),
            ],
        ],
        'programme' => [
            'label' => 'Weekly class programme', 'item' => 'class slot', 'group' => 'Learning', 'title' => 'topic', 'subtitle' => 'day', 'slug' => null,
            'view' => fn($r) => '/free-classes',
            'fields' => [
                f('day', 'Day', 'select', ['options' => 'weekdays']),
                f('slot', 'Time of day', 'select', ['options' => ['morning' => 'Morning', 'evening' => 'Evening']]),
                f('subject', 'Subject'),
                f('topic', 'Topic', 'text', ['required' => true]),
                f('exam', 'Exam label'),
            ],
        ],
        'lectures' => [
            'label' => 'Recorded lectures', 'item' => 'lecture', 'group' => 'Learning', 'title' => 'title', 'subtitle' => 'subject', 'slug' => 'id',
            'view' => fn($r) => '/free-classes',
            'fields' => [
                f('title', 'Title', 'text', ['required' => true]),
                f('id', 'Code', 'text', ['slugFrom' => 'title', 'auto' => true]),
                f('subject', 'Subject'),
                f('exam', 'Exam label'),
                f('durationMin', 'Length (minutes)', 'number', ['nullable' => true]),
                f('href', 'Link to the recording', 'text', ['nullable' => true, 'help' => 'Leave empty to show "Coming soon".']),
                f('poster', 'Poster drawing', 'select', ['options' => ['beam' => 'Beam', 'bernoulli' => 'Bernoulli (pipe)', 'circuit' => 'Circuit', 'truss' => 'Truss', 'phasor' => 'Phasor', 'mohr' => "Mohr's circle"]]),
            ],
        ],
        'free_resources' => [
            'label' => 'Free resources (homepage)', 'item' => 'resource', 'group' => 'Learning', 'title' => 'title', 'subtitle' => 'type', 'slug' => null,
            'view' => fn($r) => '/',
            'fields' => [
                f('title', 'Title', 'text', ['required' => true]),
                f('type', 'Type', 'select', ['options' => ['PDF', 'Video', 'Paper', 'Quiz', 'Notes']]),
                f('meta', 'Small label', 'text'),
                f('href', 'Link', 'text', ['placeholder' => '/study-material']),
            ],
        ],
        'notices' => [
            'label' => 'Notices (homepage)', 'item' => 'notice', 'group' => 'Learning', 'title' => 'text', 'subtitle' => 'tag', 'slug' => null,
            'view' => fn($r) => '/',
            'fields' => [f('tag', 'Tag', 'text', ['placeholder' => 'SSC JE']), f('text', 'Notice', 'text', ['required' => true])],
        ],
    ];
}

/** Blocks: one form each. Fields are worked out from the content itself; these hints refine them. */
function admin_blocks(): array
{
    return [
        'site' => ['label' => 'Contact details & menus', 'group' => 'Website', 'help' => 'Address, phone and email appear in the footer, menu and contact page.',
            'hints' => ['brand.logo' => ['hidden' => true], 'brand.devanagari' => ['label' => 'Name in Hindi']]],
        'journey' => ['label' => 'Homepage: journey & manifesto', 'group' => 'Homepage'],
        'mentor' => ['label' => 'Shubham Sir (homepage & faculty)', 'group' => 'Homepage',
            'hints' => ['mentor.chalk' => ['label' => 'Chalk notes on the board', 'advanced' => true]]],
        'method' => ['label' => 'Homepage: method', 'group' => 'Homepage'],
        'community' => ['label' => 'Homepage: community', 'group' => 'Homepage'],
        'free-learning' => ['label' => 'Homepage: question of the day', 'group' => 'Homepage'],
        'results' => ['label' => 'Results settings', 'group' => 'Results',
            'help' => 'Untick "Is sample" once real, verified results are added. Stats left empty show "—".',
            'hints' => ['results.stats.value' => ['type' => 'number', 'nullable' => true], 'results.isSample' => ['label' => 'Is sample (shows a "Sample" mark)'], 'resultsBoard.isSample' => ['label' => 'Is sample (shows a "Sample" mark)']]],
        'test-series' => ['label' => 'Test series page', 'group' => 'Test series'],
        'faculty' => ['label' => 'Faculty page', 'group' => 'Faculty'],
        'about' => ['label' => 'About page', 'group' => 'Pages'],
        'contact-page' => ['label' => 'Contact page', 'group' => 'Pages'],
        'free-classes' => ['label' => 'Free classes page', 'group' => 'Pages', 'hints' => ['weekdayNames' => ['hidden' => true], 'weekdays' => ['hidden' => true]]],
        'study-material' => ['label' => 'Study material page', 'group' => 'Pages'],
        'blog' => ['label' => 'Blog page', 'group' => 'Pages'],
        'policies' => ['label' => 'Privacy, terms & refunds', 'group' => 'Pages',
            'help' => 'When your lawyer gives you the final policy text, paste it into "Body". Until then the page lists what the policy will cover.',
            'hints' => ['policies.privacy.body' => ['type' => 'html'], 'policies.terms.body' => ['type' => 'html'], 'policies.refunds.body' => ['type' => 'html']],
            'ensure' => ['policies.privacy.body' => '', 'policies.terms.body' => '', 'policies.refunds.body' => '']],
    ];
}

/** Sidebar order. */
const ADMIN_GROUPS = ['Website', 'Homepage', 'Courses & exams', 'Test series', 'Results', 'Faculty', 'Learning', 'Pages'];
