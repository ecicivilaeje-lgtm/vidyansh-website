# Porting the Next.js site to PHP: rules for every worker

Original site (read-only reference): `/home/claude/vidyansh-web` (Next.js 16, React 19, Tailwind v4).
It runs at http://localhost:3100 (production build). Do NOT edit anything in it.
PHP port: `/home/claude/vidyansh-php`. It runs at http://localhost:8100 (`php -S 127.0.0.1:8100 router.php`, already running; if it is not, start it in the background from /home/claude/vidyansh-php).

Goal: every page of the PHP site must look and behave exactly like the Next.js page: same HTML structure,
same Tailwind classes, same text, same interactions, same accessibility (aria attributes, focus handling,
keyboard support), same responsive behaviour. The PHP site reads its content from the database
(so an admin panel can edit it) instead of the TS content files.

## Stack
- Plain PHP 8.1+ (no framework, no Composer packages). Must run on cheap shared hosting (Hostinger/cPanel, Apache or LiteSpeed).
- Templates are plain `.php` files with `<?= e($x) ?>`. ESCAPE EVERY VALUE with `e()`. Only trusted HTML (blog body, policy body) is printed raw.
- JavaScript: vanilla JS, no build step, no frameworks, no CDN libraries. One IIFE per file in `assets/js/<feature>.js`.
- CSS: Tailwind v4 compiled by CLI into `assets/css/site.css`. Source `assets/src/site.css` is a copy of the original `app/globals.css`
  (all custom classes like `.on-light`, `.reveal`, `.plate-sheet`, `.flap`, `.article-prose`, `.chapter-mark` already exist there).
  Rebuild after editing templates: `cd /home/claude/vidyansh-php && npm run css`.
  Tailwind only sees class names that appear literally in files under templates/, app/ and assets/js/. Never build a class by
  string concatenation (`"bg-" . $tone`); write the full class names (a PHP array map of full class strings is fine).

## Files you may create/edit
Only the files of your own group (listed in your task). Do NOT edit shared files: `index.php`, `app/bootstrap.php`, `app/helpers.php`,
`app/db.php`, `app/content.php`, `app/components.php`, `templates/layout.php`, `templates/partials/*`, `assets/js/site.js`,
`assets/src/site.css`. If you truly need a change in one of them, describe it in your final report instead (exact diff), and
work around it locally meanwhile. Helper functions for your group go in `app/ui/<group>.php` (auto-loaded); prefix function names
with your group name to avoid collisions. Do NOT run git commands (no commit). Do not delete other groups' files.

## Routes (already wired in index.php; you create the template)
`/`→`templates/pages/home.php`, `/courses`→`courses.php`, `/courses/{slug}`→`course.php` ($slug),
`/test-series`→`test-series.php`, `/test-series/{exam}`→`test-series-exam.php` ($exam), `/test-series/format/{type}`→`test-series-format.php` ($type),
`/test-series/series/{slug}`→`series.php`, `.../tests/{testId}`→`series-test.php` ($slug, $testId), `.../attempt`→`attempt.php`, `.../result`→`series-result.php`,
`/exams`→`exams.php`, `/results`→`results.php`, `/faculty`→`faculty.php`, `/study-material`→`study-material.php`, `/free-classes`→`free-classes.php`,
`/about`→`about.php`, `/contact`→`contact.php` (POST /contact runs `app/enquiry.php`), `/blog`→`blog.php`, `/blog/{slug}`→`blog-post.php`,
`/privacy|terms|refunds`→`policy.php` (done; use as an example), `/robots.txt`→`robots.php`, `/sitemap.xml`→`sitemap.php`.
Unknown slug → call `not_found();` (renders the 404 page).
Section partials for the homepage: `templates/sections/*.php`. Reusable bits: `templates/components/<group>/*.php`.

## Page template contract
```php
<?php
page_meta(['title' => '… · Vidyansh', 'description' => '…', 'canonical' => '/courses']);   // copy from the Next page's metadata
page_meta(['jsonLd' => [ ...arrays... ]]);      // when the Next page prints JSON-LD
page_meta(['chrome' => 'bare']);                // pages without header/footer (the exam console)
page_meta(['layout' => 'none']);                // raw output (robots.txt, sitemap.xml) — also send the right header()
page_script('results-board');                  // loads assets/js/results-board.js after site.js
?>
<section class="…">…</section>
```
The layout adds `<main id="main">`, header and footer. `partial('components/x/y', ['var' => $v])` prints another template;
`render()` returns it as a string.

## Data
`content('<file>')` returns exactly what the original `content/<file>.ts` exported, e.g. `content('site')['menuLinks']`,
`content('test-series')['testSeriesPage']`. Arrays mirror the TS objects key for key (camelCase keys kept).
`lib/data/*.ts` functions exist as snake_case PHP functions in `app/content.php`: `get_courses()`, `get_course_by_slug()`,
`get_exams()` (= examRoutes), `content('exams')['exams']` (journey exams), `test_series_for()`, `get_test_series(['exam'=>..,'format'=>..])`,
`get_featured_test_series()`, `get_test_series_by_slug()`, `get_series_tests()`, `get_series_test()`, `get_series_progress()`, `get_paper()`,
`get_results()`, `get_results_board()`, `get_result_stories()`, `get_founder()`, `get_departments()`, `get_teaching_statements()`,
`get_study_materials()`, `get_next_live_class()`, `get_programme()`, `get_recorded_lectures()`, `get_contact_page()`,
`get_blog_page()`, `get_blog_posts()`, `get_blog_article()`, `site()`.
Hardcoded copy that sits inside a TSX component stays hardcoded in the PHP template (same words).
Text that comes from a content file must come from `content()`/`get_*()` (never paste it into the template) so the admin can edit it.
Values that are null mean "not supplied yet" and print as "—" (see `or_dash()`, `format_inr()`, `discount_percent()`).
Lists may be empty when an admin deletes everything: never crash on an empty list or a missing optional key (use `?? ''`/`?? []`).
Never invent scores, ranks, student names or results. Never mention GATE or Classplus.

## Components already ported (app/components.php)
`button($labelHtml, ['href'=>, 'variant'=>'solid|ghost', 'tone'=>'dark|light', 'size'=>'md|sm', 'diamond'=>bool, 'class'=>, 'attrs'=>'raw attrs', 'type'=>])`
(label is HTML: pass `e($text)` for dynamic text), `diamond($class)`, `logo($size, $class, $decorative, $priority)`, `star($class, $color)`,
`chapter_mark($numeral, $name, $note, $class)`, `reveal_open($tag, $class, $delay, $id, $attrs)` + matching `</tag>` (the <Reveal> component),
`course_plate($plate, $index, $label)` + `plate_caption($plate)` (CoursePlate SVGs).
Helpers (app/helpers.php): `e()`, `cls()`, `url('/path')` (ALWAYS wrap internal hrefs with url(): the site may live in a sub-folder),
`asset()`, `media($src)` for uploaded images, `current_path()`, `path_starts()`, `pad2()`, `format_in()` (Indian digit grouping like toLocaleString('en-IN')),
`or_dash()`, `format_inr()`, `discount_percent()`, `json_attr()` (for data-* JSON), `json_script()` (for <script type="application/json">),
`route_series()`, `route_test()`, `route_attempt()`, `route_result()`, `route_free_test()`, `csrf_field()`, `csrf_check()`, `flash()`, `slugify()`.

## Client-side behaviour (React "use client" components)
- Render the INITIAL state on the server exactly like React's server render (so no-JS users see the same page), then
  enhance with JS. Use data attributes (`data-…`) as hooks, not ids, unless the original uses ids.
- `assets/js/site.js` defines `window.Vidyansh` with `ready(fn)`, `reducedMotion()`, `toggleClasses(el, "a b", on)`,
  `initReveal(root)`, and the chosen-exam store replacing ExamProvider: `getExam()`, `setExam(code)`, `onExam(fn)`.
- Pass data that JS needs as `<script type="application/json" data-…>` (use `json_script()`), not by re-fetching.
- Keep keyboard behaviour, aria-* updates, focus management and reduced-motion handling identical to the React code.
- Conditional rendering in React (`{open && <div>}`): render the element with `hidden` and toggle it, or build it in JS if it depends on runtime data.
- localStorage logic (e.g. lib/attempt.ts for test attempts) is ported 1:1 with the same keys.

## Exact markup tip
To see the exact HTML React produces for a component with given props, use the SSR tool:
`node /tmp/claude-0/ssr.cjs components/courses/CourseMatrix.tsx CourseMatrix '{"courses": [...]}'` (paths relative to /home/claude/vidyansh-web).
Or just fetch the page: `curl -s localhost:3100/courses`. For big static SVG drawings you can paste the rendered SVG into a partial
(as done for templates/components/plates/*.php) and replace only the dynamic bits with `<?= … ?>`.

## Verifying (required before you report done)
1. `php -l` every PHP file you wrote. `npm run css`.
2. For every route of your group, at widths 1440 and 390:
   `NODE_PATH=/opt/node22/lib/node_modules node /home/claude/vidyansh-php/tools/compare.js /courses 1440 /tmp/claude-0/compare-<group>`
   It prints HTTP status, page height on both sites, horizontal overflow, console errors and a text diff of the whole page.
   Target: text identical (header/footer are shared and already identical), heights within a few px, 0 overflow, no console errors.
   Look at the screenshots it writes (Read the png; make a side-by-side with PIL if helpful) and fix visual differences.
3. Exercise every interaction with a small Playwright script (NODE_PATH=/opt/node22/lib/node_modules, `require("playwright")`,
   chromium is preinstalled; do not run `playwright install`) on both sites and compare results (filters, tabs, toggles, forms, keyboard).
4. Report: files created, routes verified with the compare results, anything that still differs and why, and any change you need in shared files.
