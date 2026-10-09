# Vidyansh website

Next.js (App Router) + React + TypeScript + Tailwind CSS v4.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck && npm run lint
```

- `content/` holds every piece of copy and data (courses, test series, results, mentor, free learning).
- `lib/data/` is the data access layer. Swap these functions for API calls later; components don't change.
- `components/sections/` holds one component per homepage section; `components/ui/` holds shared pieces.
- Results, counts, prices and ranks are placeholders (`null` renders as "—", `isSample` shows a visible marker). Replace with verified data only.
- Set `NEXT_PUBLIC_SITE_URL` in production for correct social-share URLs.

## Test Series

- `/test-series` catalogue, `/test-series/[exam]`, `/test-series/format/[type]`
- `/test-series/series/[slug]` series page with access panel and test list
- `.../tests/[testId]` instructions, `.../attempt` full-screen console, `.../result` report card
- The first test in every series plays the sample paper in `content/test-series.ts`. Attempts save in the browser (`lib/attempt.ts`) until the attempts API exists; score, accuracy and time come from the student's own answers. Rank and percentile stay "—".
- The series page shows a "Preview state" switcher for reviewing the five states. Hide it in production with `NEXT_PUBLIC_STATE_PREVIEW=off`.
