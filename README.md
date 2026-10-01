# Nexora Technologies

A static Next.js App Router website using TypeScript, Tailwind CSS and npm. Nexora is a fictional IT-services business for a frontend assessment. Concept projects remain explicitly labelled; no client, staff, partner or performance claims have been invented.

The homepage/shared UI is preserved. Five inner pages now map the supplied saved reference evidence to honest Nexora content. See [the evidence record](docs/REFERENCE_PARITY.md) for observed structure, source-derived behavior, measured comparisons and precise remaining differences. Offline replay is not a claim of complete live-site parity.

## Local preview

Requires Node.js 20.9+ and npm. The existing dependencies and lockfile are preserved.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. On PowerShell use `npm.cmd` if execution policy blocks `npm.ps1`.

```sh
npm run typecheck
npm run build
npm run preview
```

`output: "export"` writes to `out/`. The existing postbuild script normalizes Windows segment payload filenames required for Next.js client navigation. `preview` serves this static export locally; it is not an application backend. Stop another server on port 3000 first. Do not use `next start` for this export. No environment variables, database or external form service are required.

## Pages and editing

| Route | Purpose |
| --- | --- |
| / | Four-image hero, capability strip, split introduction, numbered services, reasons, rotating gallery and CTA |
| /about | Story/scope cards, three principles, five-image gallery and CTA |
| /services | Two detailed illustrated scope cards covering web, IT and networking; stages, comparison and FAQ |
| /support | Support cards, eight-position equipment gallery and maintenance introduction |
| /approach | Four capabilities, seven illustrative images and CTA; no invented staff or partnerships |
| /projects | Three labelled website concepts; no real client engagements |
| /contact | Authorized contacts, three enquiry tabs and contextual image/FAQ |

The six header destinations are Home, About, Services, Support, Approach and Contact. The existing Projects route remains linked from Approach and the footer. All seven routes support direct loading and refresh.

- `src/content/site.ts`: branding, navigation, services, principles and shared business copy.
- `src/content/contact.ts`: authorized number, phone URL and encoded WhatsApp draft helpers.
- `src/content/hero-slides.ts`: four local hero images and focal positions.
- `src/content/projects.ts`, `page-images.ts`: labelled concepts and existing inner-page photos.
- `src/app/page.tsx`: reference-shaped homepage composition and its supporting copy.
- `src/app/reference-parity.css`: verified homepage/shared geometry and responsive overrides; loaded after existing styles.
- `src/app/inner-pages.css`: retained concept-portfolio and earlier shared styles.
- `src/app/saved-reference.css`: scoped inner-page reconstruction styles; homepage selectors are untouched.
- `src/content/reference-pages.ts`: detailed service copy, capabilities, local image paths, focal positions and gallery sequence.
- `src/components/evidence-page.tsx`: Server Components for photo heroes, section headings, stages, CTAs and native details FAQs.
- `src/components/evidence-carousel.tsx`: five-image About and eight-position/three-visible Support galleries, decoded loading, five-second timer, arrows/dots, persistent pause and focus/reduced-motion handling.
- `src/components/tabbed-enquiry.tsx`: three keyboard-accessible tabs, native validation and encoded WhatsApp drafts. Fields follow the saved form structure; name/phone are required, email is optional, and IT support requires a problem description.
- `src/components/hero-carousel.tsx`: 6.5-second autoplay, click/arrow selection, wraparound, decoded-image loading and race protection. Dot hover does not select. The 1.2-second crossfade leaves copy fixed.
- `src/components/reference-gallery.tsx`: eight illustrative photo/crop entries, three active desktop cards, narrow clipped presentation, five-second autoplay and hover/focus pause.
- `src/components/mobile-menu.tsx`, `header-scroll.tsx`: right-side drawer, keyboard handling, fixed header scroll state and progress line.
- `src/components/scroll-reveal.tsx`: 22px/700ms ease reveals at a .1 visibility threshold for the homepage and reconstructed pages; the retained Projects page uses its existing settings. Observers disconnect and reconnect after client navigation. Base content remains visible without JavaScript.

The homepage and reconstructed pages use the reference's system-sans metrics; brand and retained concept-portfolio typography keep locally hosted Manrope. Inner-page introductions use a single 700ms CSS entrance that runs on page entry without waiting for hydration and is removed for reduced motion. Nexora's logo and blue/navy palette remain. Production photographs stay local; see [asset provenance](docs/ASSETS.md). Gallery stock scenes are labelled illustrations, not company premises or partnerships.

## Contact and accessibility

All actions use **+94 78 662 0728**, `tel:+94786620728`, and `https://wa.me/94786620728` with encoded drafts.

The enquiry form validates inputs and opens a WhatsApp draft. The visitor reviews and sends it in WhatsApp; the website never sends it or claims receipt. There is no backend, email delivery, storage or analytics. Without JavaScript the form is disabled and direct contact links remain usable.

Native navigation/details fallbacks, visible focus, Escape dismissal, focus restoration and reduced motion are retained. Reduced motion disables autoplay and visual transitions. Without JavaScript the first hero/gallery images and content remain visible, and inactive slider controls stay hidden. The drawer can still open and navigate using native details.

## Verification

```sh
npm run test:browser
npm run test:hero
npm run test:inner
npm run test:parity
node scripts/check-saved-pages.mjs
```

Build first. Suites launch the existing static preview on ports 4173-4177 and use installed Chrome via the existing Playwright development dependency. Set `BROWSER_CHANNEL=msedge` to use Edge. No browser download is performed. Screenshots and reports go to ignored `test-results/`. WhatsApp calls are intercepted during form tests; no messages or calls are made.

The focused parity suite covers all seven current routes at 320/390/768/1440px, refresh, overflow, images, contacts, hero/gallery controls and timing, drawer focus and reduced motion. See [REFERENCE_PARITY.md](docs/REFERENCE_PARITY.md) for current results and the distinction between automated tests, local visual review, offline source replay and live reference evidence.

Captured public HTML/CSS/JavaScript and inspection screenshots are under ignored `reference/live/` and `reference/saved/`, outside `public/` and the production bundle. Some reference photos were unavailable; offline replay is not proof of exact loaded-image geometry. No Git remote, repository or Vercel project was changed, and nothing was pushed or deployed.
