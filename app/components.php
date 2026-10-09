<?php
/** Shared UI pieces, ported from components/ui. Each returns HTML. */

const BUTTON_BASE = 'inline-flex items-center justify-center gap-3 whitespace-nowrap border font-mono text-[0.75rem] font-medium uppercase leading-none tracking-[0.17em] transition-colors duration-300 ease-out-expo';
const BUTTON_STYLES = [
    'dark' => [
        'solid' => 'border-ivory bg-ivory text-ink hover:bg-transparent hover:text-ivory',
        'ghost' => 'border-ivory/30 bg-transparent text-ivory hover:border-ivory',
    ],
    'light' => [
        'solid' => 'border-ink bg-ink text-ivory hover:bg-transparent hover:text-ink',
        'ghost' => 'border-ink/25 bg-transparent text-ink hover:border-ink',
    ],
];
const BUTTON_SIZES = ['md' => 'px-6 py-[1.1rem]', 'sm' => 'px-4 py-3 text-[0.6875rem]'];

function diamond(string $class = ''): string
{
    return '<span aria-hidden="true" class="' . e(cls('inline-block size-[7px] shrink-0 rotate-45 bg-gold', $class)) . '"></span>';
}

/**
 * A button or link styled as a button.
 * $opts: href, variant (solid|ghost), tone (dark|light), size (md|sm), diamond (bool), class, attrs (raw string), type
 * $label is HTML (escape text yourself with e()).
 */
function button(string $label, array $opts = []): string
{
    $variant = $opts['variant'] ?? 'solid';
    $tone = $opts['tone'] ?? 'dark';
    $size = $opts['size'] ?? 'md';
    $class = cls(BUTTON_BASE, BUTTON_STYLES[$tone][$variant], BUTTON_SIZES[$size], $opts['class'] ?? '');
    $content = $label . (!empty($opts['diamond']) ? diamond() : '');
    $attrs = $opts['attrs'] ?? '';
    if (isset($opts['href'])) {
        return '<a href="' . e(url($opts['href'])) . '" class="' . e($class) . '"' . ($attrs ? " $attrs" : '') . '>' . $content . '</a>';
    }
    return '<button type="' . e($opts['type'] ?? 'button') . '" class="' . e($class) . '"' . ($attrs ? " $attrs" : '') . '>' . $content . '</button>';
}

/** The official Vidyansh logo, used exactly as supplied. */
function logo(int $size, string $class = '', bool $decorative = false, bool $priority = false): string
{
    $brand = site()['brand'];
    $alt = $decorative ? '' : "{$brand['name']}, {$brand['byline']}. {$brand['tagline']}.";
    $src = !empty($brand['logo']['src']) ? $brand['logo']['src'] : '/assets/brand/vidyansh-logo.png';
    if ($src === '/brand/vidyansh-logo.png') $src = '/assets/brand/vidyansh-logo.png';
    return '<img src="' . e(media($src)) . '" width="' . $size . '" height="' . $size . '" alt="' . e($alt) . '"'
        . ($priority ? ' fetchpriority="high"' : ' loading="lazy"') . ' decoding="async" class="' . e(cls('logo-edge', $class)) . '">';
}

/** The four-point star from the logo, used for "destination" moments only. */
function star(string $class = '', string $color = '#c8902f'): string
{
    return '<svg viewBox="0 0 20 20" aria-hidden="true" class="' . e($class) . '"><path d="M10 0 L11.6 8.4 L20 10 L11.6 11.6 L10 20 L8.4 11.6 L0 10 L8.4 8.4Z" fill="' . e($color) . '"/></svg>';
}

/** Opens each scene of the homepage story: a roman numeral, a rule that draws in, the chapter name. */
function chapter_mark(string $numeral, string $name, ?string $note = null, string $class = ''): string
{
    return '<div class="' . e(cls('chapter-mark', $class)) . '">'
        . '<span class="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-none italic">' . e($numeral) . '<span class="sr-only">.</span></span>'
        . '<span aria-hidden="true" class="chapter-mark__rule"></span>'
        . '<span class="eyebrow text-right">' . e($name) . ($note ? '<span class="max-sm:hidden"> · ' . e($note) . '</span>' : '') . '</span>'
        . '</div>';
}

/**
 * Opening tag for content that settles into place as it enters the viewport
 * (the original <Reveal>). Close it with </$tag>. assets/js/site.js does the animation;
 * without JavaScript nothing is hidden.
 */
function reveal_open(string $tag = 'div', string $class = '', int $delay = 0, ?string $id = null, string $attrs = ''): string
{
    return '<' . $tag . ($id ? ' id="' . e($id) . '"' : '') . ' data-reveal data-shown="true" class="' . e(cls('reveal', $class)) . '"'
        . ($delay ? ' style="transition-delay:' . $delay . 'ms"' : '') . ($attrs ? " $attrs" : '') . '>';
}

const PLATE_CAPTIONS = [
    'beam' => 'Simply supported beam · bending moment',
    'track' => 'Permanent way · perspective',
    'bridge' => 'Arch bridge · elevation',
    'gear' => 'Spur gear · 24 teeth',
];

function plate_caption(string $plate): string
{
    return PLATE_CAPTIONS[$plate] ?? '';
}

/**
 * A course's image until photography is supplied: one engineering drawing per course
 * (the original CoursePlate). $index is zero-based; $label is printed in the title block.
 */
function course_plate(string $plate, int $index, string $label): string
{
    if (!isset(PLATE_CAPTIONS[$plate])) $plate = 'beam';
    return render("components/plates/$plate", ['index' => $index, 'label' => $label]);
}
