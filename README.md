# Nexora Technologies

A complete five-page static website built with **Next.js App Router, TypeScript, Tailwind CSS and npm**. Nexora is a fictional IT services company created for a frontend recruitment assessment. The three projects are explicitly labelled concepts, not client engagements. The reference site informed the quality target; its business, branding and imagery are not used in Nexora.

## Run, build and preview

Requires Node.js 20.9+; developed with Node 24. The existing dependency versions and lockfile are preserved; no new dependencies were added.

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. In Windows PowerShell, use `npm.cmd` if the execution policy blocks `npm.ps1`.

```sh
npm run typecheck
npm run build
npm run preview
```

The build uses `output: "export"` and writes all five pages, fonts, images, CSS and browser JavaScript to `out/`. The small `scripts/preview.mjs` server serves only those files at **http://localhost:3000**. This is a local preview utility, not an application backend. Stop a running dev/preview server before starting another on the same port. `next start` is not used for a static export.

`npm run build` also runs `postbuild`, which corrects a verified [Next.js Windows segment-filename issue](https://github.com/vercel/next.js/issues/92339). `scripts/fix-static-segments.mjs` copies affected generated payloads to the flat filenames requested by Next.js Link. It does not change dependencies or require server rewrites. Use the npm build command so this step runs; it safely does nothing when the exporter already generates correct names.

## Routes and components

| Route       | Page file                   | Contents                                                      |
| ----------- | --------------------------- | ------------------------------------------------------------- |
| `/`         | `src/app/page.tsx`          | Hero, introduction, services, selected concepts, process, CTA |
| `/about`    | `src/app/about/page.tsx`    | Business focus, working principles, engagement process        |
| `/services` | `src/app/services/page.tsx` | Three service descriptions, scope, WhatsApp actions, FAQ      |
| `/projects` | `src/app/projects/page.tsx` | Three original concept previews, goals and proposed features  |
| `/contact`  | `src/app/contact/page.tsx`  | Telephone, WhatsApp and draft-preparation form                |

All page components are Server Components rendered at build time. `layout.tsx` provides the locally hosted Manrope font, metadata, shared header/footer and reveal enhancement. Each page has its own title, description and H1. Next.js `Link` handles internal navigation. The framework also exports its standard 404 page and favicon asset; there are no extra business or pretend legal pages.

Reusable components in `src/components/` include `Button`, `WhatsAppLink`, `PageIntro`, `SectionHeading`, `ServiceCard`, `ProjectPreview`, `ProjectCard`, `ProcessSection` and `EnquiryCta`. Project previews are original HTML/CSS design studies with no fake interactive controls.

Six small components require browser JavaScript:

- `NavigationLinks`: reads the current pathname for `aria-current="page"`.
- `MobileMenu`: enhances native `<details>` with Escape/outside-click closing and focus handling. Following a link closes the menu and focuses the destination heading. The native menu still works without JavaScript.
- `EnquiryForm`: validates fields and prepares a WhatsApp draft.
- `ScrollReveal`: observes section entry and animates once per route visit.
- `HeroCarousel`: switches the three decorative homepage backgrounds after decoding each image. The heading, copy and links are Server Component children; carousel state does not rebuild or reanimate them.
- `ConceptDetails`: enhances native `<details>` with Escape-to-close and focus return to its summary. Its content comes from the Server Component page and remains expandable without JavaScript.

The FAQ uses native `<details>` and needs no Client Component. Project features expand inline rather than opening a modal or another route. The hero carousel is manual, with no autoplay.

## Customize

- **Branding, navigation, services, process, most copy and page descriptions:** `src/content/site.ts`.
- **Concept projects:** `src/content/projects.ts`. Keep the concept labels unless replacing them with authorized, real work.
- **Contact number and URL/message helpers:** `src/content/contact.ts`. All telephone/WhatsApp destinations derive from the authorized `phoneNumber`. Update `displayNumber` to match when changing it.
- **Page-specific supporting text:** the corresponding page component above.
- **Colors, spacing, responsive rules and typography:** `src/app/globals.css`. Layout utilities are also used in the components.
- **Inner-page layouts and entrance effects:** `src/app/inner-pages.css`, scoped to the inner pages so homepage composition is preserved.
- **Photography:** `public/images/nexora/`; edit paths and alt descriptions in the content files. [Asset sources](docs/ASSETS.md) include source pages and reuse notes.
- **Hero backgrounds:** `src/content/hero-slides.ts` contains each local image path, control label, desktop `position` and narrow-screen `mobilePosition` (CSS `object-position`). Backgrounds are decorative and intentionally have empty alt text; the service information is already in the adjacent copy.
- **Inner-page photographs and focal positions:** `src/content/page-images.ts`. `EditorialImage` applies the configured desktop/mobile crop and lazy-loads below-fold images; `PageIntro` preloads the introduction photograph.
- **Contact service-selection guidance:** the `serviceHints` map in `src/components/enquiry-form.tsx`. The selected service still uses the existing service ID and title when preparing a draft.
- **Logo and favicon:** `src/components/brand.tsx` and `src/app/icon.svg`.
- **Font:** `src/app/fonts/Manrope-Variable.ttf`, loaded with `next/font/local`. Its OFL license is included. Builds do not download fonts; Arial/Helvetica are fallback fonts.

Old reference snapshots and unused images are retained under `reference/` for historical inspection only. Nothing there is imported, served from `public/` or included in the export. No institute imagery remains in the active app.

## Scroll reveal: diagnosis and behavior

Before editing, browser instrumentation confirmed reduced motion was **false** and the old observer was running. During slow wheel scrolling, it started animations with only **18–47 pixels** of the target visible in a 900px viewport. It immediately unobserved each item, so much of the short effect happened at the bottom edge and was easy to miss. The old test only checked whether an animation existed. There was no evidence of a hydration failure or a CSS rule disabling normal-motion reveals.

The replacement waits until the element enters an inset viewport (14% of viewport height, capped at 120px). It applies a **24px rise over 720ms**, with **70–90ms card staggers** capped at 180ms. A pathname-dependent effect reconnects the observer after Next.js navigation. Initial-viewport content is excluded from this observer. The hero uses the separate entrance below. Each target animates once per visit.

The root HTML also declares `data-scroll-behavior="smooth"` so Next.js can restore the route's scroll position immediately before the new observer measures it. Without this, CSS smooth scrolling left the new page temporarily at the old scroll position and some targets were incorrectly counted as already visible.

There is **no permanent hidden CSS state**. Animations return to the readable default style even if cancelled; disabled/failed JavaScript leaves content visible. Reduced motion skips the effect, and changing the preference cancels running animations. Focusing a target or its controls cancels its fade immediately. Details and measured before/after evidence are described in [verification notes](docs/VERIFICATION.md).

## Homepage hero

The hero is a full-width photo with a navy gradient, a left-aligned content group and a minimum height of `85svh`. It grows with its content on small screens. The existing sticky navy header remains shared across all routes. The first photo is preloaded; the other two load eagerly at low priority. A selected photo must decode before replacing the previous one, and a request counter prevents a slow, earlier selection from overriding a newer choice. Missing images leave the previous photo in place.

Previous/next buttons wrap around. Dots support click, touch and Enter/Space; mouse hover also selects persistently on devices matching `(hover: hover) and (pointer: fine)`. Focus is visible. All buttons have descriptive names and the active dot has `aria-pressed`. The photo crossfade is 600ms. With JavaScript unavailable, the first image and links work and the inactive carousel controls stay hidden.

The copy uses the `hero-enter` CSS keyframes in `globals.css`: **22px rise and opacity 0 to 1 over 700ms**. A 100ms backwards-filled delay gives the browser time to paint the initial pose. The animation is attached to server-rendered markup, so hydration does not race a JavaScript-added class. It plays once on homepage entry; background changes leave the content node intact. Its base style is visible, it has no forwards-filled hidden state, and CSS completes the animation even with JavaScript disabled or blocked. Reduced motion skips both entrance and crossfade. Keyboard focus inside the copy cancels the entrance for the current visit.

To see the entrance, set your system/browser motion preference to normal, return to the top and refresh `/`. Hover a dot, then move away: the selection stays. Tab to a dot and press Enter/Space, or tap on mobile. Enable reduced motion and refresh to check immediate visibility.

## Inner-page presentation

`PageIntro` is a Server Component with four shorter photographic compositions: a split About introduction, a wider Services image, a compact Projects introduction and a shorter Contact banner. The coordinated `page-enter` animation uses the same 22px/700ms approach as the homepage, including a 100ms starting-pose delay. Its base style is visible and the animation only applies under normal motion preferences. No application-wide remount or JavaScript-added hidden class is required.

About combines practical support photography, three visually distinct principles and a numbered process. Services alternates text and image/scope layouts and adds a service jump navigation; its service-specific WhatsApp links and native FAQ remain intact. Projects uses the existing HTML/CSS preview component's `expanded` variant, showing proposed navigation and page sections, plus each concept's audience and expandable features. The restaurant image is illustrative content inside its mockup, not a screenshot of a real engagement. Contact adds a shorter photo introduction, a clearer next-steps panel, field/error styling and an announced service-specific message prompt. Enquiry validation and WhatsApp draft handling are unchanged.

Below-fold elements reuse `ScrollReveal` with 24px/720ms motion and short capped staggers. The route-specific effect disconnects old observers and cancels outstanding animations. Tests instrumented this lifecycle on all four routes and confirmed one current observer with no disconnected-page targets. Direct loads, refreshes, header navigation and leaving/returning all replay the introduction once and observe the new page correctly.

## Enquiries and privacy

The authorized destination is **+94 78 662 0728**, using `tel:+94786620728` and `https://wa.me/94786620728`.

The form requires a name, service and message. Email is optional and validated when entered. It creates an encoded WhatsApp URL, opens a new tab with `noopener,noreferrer`, and provides a fallback link if the popup is blocked. **The visitor reviews and sends the message in WhatsApp. Opening a draft does not send it or confirm receipt.**

There is no API, database, authentication, email delivery, local/session storage or analytics. Form values are held only in the current page; no site backend receives them. On opening WhatsApp, the draft is passed to WhatsApp in the URL. Without JavaScript the form is disabled to prevent an accidental native submission, and the direct telephone/WhatsApp links remain available. No email address, office, map, business hours, testimonials, credentials or experience statistics have been invented. Metadata remains `noindex` for this fictional assessment.

## Browser verification

```sh
npm run test:browser
npm run test:hero
npm run test:inner
```

Run after building. The script starts/stops its own static preview on port 4173 and uses installed Chrome through the existing Playwright development dependency. Set `BROWSER_CHANNEL=msedge` to use installed Edge instead. It does not download browser binaries.

It checks all five routes at 320, 390, 768 and 1440px; direct loading and refresh; links and active states; keyboard navigation/focus; images and fonts; overflow; the FAQ; actual scrolling on two routes after client navigation; reduced motion; JavaScript-disabled readability; and form validation/encoding. WhatsApp `window.open` is intercepted and recorded in memory during tests; no message or telephone call is made. Screenshots and results are saved to ignored `test-results/`.

See [verification notes](docs/VERIFICATION.md) for the checks actually run and limitations. No lint command is configured. Nothing has been deployed or sent to a recruiter.

The additional hero suite uses port 4174. It records animation frames on fresh load, refresh and client navigation, tests crossfade/controls/loading races, saves all three slides at the four requested widths, and checks reduced motion and disabled/blocked JavaScript. Its screenshots, frame samples and report are also in `test-results/`.

The inner-page suite uses port 4175. It checks all four routes' entrance/observer lifecycle and actual wheel-scrolling reveals, layouts at 320/390/768/1440px, concept disclosure keyboard/Escape behavior, service feedback, reduced motion and JavaScript-disabled readability. Screenshots are `test-results/inner-*.png`; its report is `test-results/inner-checks.txt`.

## Repository and hosting preparation

Git tracks application source, active public images, the local font/license, configuration, documentation, verification scripts and package-lock.json. Dependencies, .next/, out/, .vercel/, generated Next.js type references, local environment/credential files, logs, test reports and archived reference/ materials are ignored. Keep real credentials out of source files even when a filename is not covered by an ignore rule.

After cloning, use npm ci to install the locked dependencies, then npm run build to generate the complete static site. The configuration retains output: "export"; out/ is generated during builds rather than committed. No environment variables or backend are required. No Vercel project has been created or deployed by this preparation step.
