# Verification and reveal diagnosis

The initial homepage was inspected before editing. A Chrome run with `prefers-reduced-motion: no-preference` instrumented `Element.animate` during slow wheel scrolling. Reduced-motion detection returned false and the initial observer was active.

| Old target         | Top in a 900px viewport | Pixels visible at start |
| ------------------ | ----------------------- | ----------------------- |
| Introduction image | 853px                   | 47px                    |
| Introduction text  | 865px                   | 35px                    |
| Services heading   | 882px                   | 18px                    |
| Service cards      | 862px                   | 38px                    |

The one-shot animation was starting at the lower edge, with no reserved visibility margin. This explains why it could be hard to perceive despite the media query being false. The original test detected an animation object, not whether a person could see the transition. No hydration/CSS failure was reproduced; other conditions in the user's browser cannot be ruled out from this local run.

The fix uses a viewport-height-derived negative bottom margin, a 24px/720ms Web Animations effect, short card staggers, focus cancellation and a pathname-dependent effect. All content has visible default styles. The observer never changes layout dimensions. A fresh observer/seen set is created after each route navigation and cleaned up on leaving.

Route-transition testing uncovered another timing interaction: global CSS smooth scrolling meant the About observer initialized at the old scroll position (944px) before the browser scrolled to the top. It mistakenly treated below-the-fold cards as initially visible. The root HTML now declares `data-scroll-behavior="smooth"`, allowing Next.js to temporarily disable smooth scrolling during route restoration. This keeps ordinary anchor scrolling smooth while the observer receives the correct initial viewport after navigation. The installed Next.js `disable-smooth-scroll.js` documents this behavior.

The repeatable verification script is `scripts/check-browser.mjs`. Its output is written to `test-results/checks.txt` only after the whole suite passes; before/after motion measurements and screenshots are also in `test-results/`.

Not covered: Safari, Firefox, physical devices, screen-reader software, a formal accessibility audit or actual WhatsApp delivery. WhatsApp draft preparation is intercepted and tested without contacting the destination. No lint script is configured, so no lint check is available.

Browser checks also reproduced a Windows static-export issue: Next.js emitted `out/contact/__next.contact/__PAGE__.txt`, while the client requested `/contact/__next.contact.__PAGE__.txt`. This matches [the upstream issue](https://github.com/vercel/next.js/issues/92339). The dependency-free postbuild script copies affected generated payloads to the expected names. The preview server remains a plain file server, so the exported folder does not depend on custom server rewriting.

## Final results — 2026-09-30

- `npm.cmd run typecheck`: passed.
- `npm.cmd run build`: passed; static Home, About, Services, Projects and Contact pages generated. The automatic postbuild correction normalized five generated segment payload filenames.
- `npm.cmd run test:browser`: passed the full suite in installed headless Chrome.
- All five routes directly loaded and refreshed at **320, 390, 768 and 1440px** with no horizontal overflow, failed images/font requests or browser console errors. Each page has one H1 and its own title/description.
- Internal page links, cross-page anchors, logo and footer navigation resolve. Active indicators and `aria-current` match the route. Keyboard menu operation, Escape, menu closure and destination-heading focus passed at mobile width; desktop keyboard navigation and native FAQ operation passed too.
- Every WhatsApp link points to the authorized number with an encoded message; the three service actions include the appropriate subject. Every telephone link matches `tel:+94786620728`.
- Contact tests covered required fields, whitespace-only names, invalid and optional email, first-error focus, draft-status focus, popup fallback and exact decoding of punctuation/newlines. `window.open` was intercepted, external requests were blocked and none occurred. Browser storage stayed empty; no real WhatsApp message or telephone call was made.
- Normal-motion tests used actual wheel scrolling on Home and then About through client navigation. In both measured cases, the target started at **724px in a 900px viewport**, leaving **176px visible**. Tests observed partial opacity mid-animation, 24px/720ms keyframes, card staggers, one animation per visit, immediate visibility on focus and cancellation when reduced motion was enabled.
- Reduced-motion layout runs produced no animations. With JavaScript disabled, all five pages remained readable; the native menu still navigated, and the form stayed disabled with a direct-contact fallback.
- Desktop screenshots for all five pages and selected narrow layouts were visually reviewed for typography, composition and image cropping. All matrix screenshots remain in `test-results/`.
- The existing preview at **http://localhost:3000** returned HTTP 200 and the Nexora homepage title after the final build.

No required asset is missing. The old reference materials were preserved outside the published tree under `reference/`; the active source, public assets and generated page HTML were checked for old branding/content. This is a local, fictional-business assessment with labelled concept projects. No deployment or recruiter submission was performed.

## Full-width hero update — 2026-09-30

The existing Nexora homepage had a split layout and a single rounded photo. It did not have its own entrance animation; the general scroll observer deliberately skips initial-viewport content. The homepage now has a separate CSS entrance, independent of the unchanged below-the-fold observer. The archived reference CSS was inspected for the full-bleed photo treatment; the live reference URL could not be fetched by the web inspection tool during this update.

`HeroCarousel` is a small Client Component that accepts the existing Server Component copy/buttons as children. The shared header, other page components and content below the hero were retained. The service-link strip now follows the photographic hero. Local photographs and independently editable desktop/mobile focal positions are configured in `src/content/hero-slides.ts`.

Checks actually performed against the production static export in installed headless Chrome:

- TypeScript and production build passed; the export contains Home, About, Services, Projects and Contact.
- `npm.cmd run test:hero` passed. The browser recorded opacity 0 and a 22px translation across multiple animation frames before observing intermediate opacity/translation and the final visible pose. This passed on a fresh load, refresh and return from About through Next.js navigation. Timing is 700ms with a 100ms initial delay. The frame evidence is in `test-results/hero-*-frames.json`.
- Previous/next wrapping, all three dot selections, persistent mouse hover, Enter/Space operation and visible focus passed. Both outgoing and incoming images had partial opacity during the 600ms crossfade. Heading bounds and hero bounds stayed unchanged. Background changes did not start another content entrance.
- All three images loaded and covered the full hero at **320, 390, 768 and 1440px**, with no horizontal overflow. Screenshots were saved for all 12 combinations; selected mobile/tablet screenshots and all three desktop slides were visually reviewed for text readability and subject cropping.
- Reduced motion produced immediately visible copy and no entrance/crossfade. Touch emulation at 390px confirmed dot/arrow taps and rejection of hover behavior when the device cannot hover.
- A deliberately delayed image request left the previous photograph visible. Selecting a different image before that request completed correctly kept the newer selection. Selecting the delayed image again worked once it had decoded.
- With JavaScript disabled, and separately with browser script requests blocked, the first photo and copy remained visible, carousel controls remained hidden and the Services CTA navigated correctly.
- At 390 and 1440px, the sticky header remained at the top on all five routes after scrolling, retaining its opaque navy surface. Mobile menus opened and closed with Escape while scrolled; desktop active navigation remained visible.
- `npm.cmd run test:browser` passed again: all five routes loaded/refreshed at all four widths, active navigation/keyboard behavior worked, images/fonts loaded, and no console errors or overflow were detected. Existing scroll reveals and contact-form validation/WhatsApp URL preparation also passed. No real message or phone call was made.
- The existing local preview at `http://localhost:3000` returned HTTP 200 with the new carousel markup.

The reports are `test-results/hero-checks.txt` and `test-results/checks.txt`. Touch tests are browser emulation, not physical-device testing. Safari, Firefox and screen-reader software were not tested. No lint script is configured. No dependencies were added, no required image is missing, and nothing was deployed.

## Inner-page upgrade — 2026-09-30

The current four pages, shared preview/form components and reveal implementation were inspected before editing. The observer already handled route changes; the inner introductions simply had no entrance animation and the page compositions lacked imagery. `PageIntro` now renders photographic compositions with a CSS-only 22px/700ms coordinated entrance. The existing homepage and general `ScrollReveal` implementation were preserved. Inner-page layout rules are isolated in `inner-pages.css`.

Checks actually performed:

- TypeScript and the production static-export build passed. The build caught a service-image key mismatch during implementation; it was corrected to the actual `networks` service ID, and the service IDs now retain literal TypeScript types so an invalid image lookup cannot be hidden by a type assertion.
- `npm.cmd run test:inner` passed in installed headless Chrome. All four routes were directly loaded, refreshed, entered via the header and left/re-entered via navigation. Each visit produced the initial opacity-0/22px pose, intermediate opacity and the final visible pose, with exactly one introduction animation.
- On every inner route, actual wheel scrolling triggered a below-fold 24px/720ms reveal after navigation, with visible intermediate opacity and one reveal per target per visit. Instrumentation confirmed that old observers disconnected, one current reveal observer remained, and its targets belonged to the connected current page. Reduced motion removed active animations.
- All four routes were checked at 320, 390, 768 and 1440px. Images decoded successfully, the introduction remained visible under reduced motion and no horizontal overflow was detected. Full-page screenshots were captured; desktop and 390px screenshots of every updated page were visually reviewed.
- Every concept disclosure was tested at each width using Enter, Space and Escape. Features became visible, focus indicators were present, Escape closed the disclosure and retained focus on its summary. These are inline disclosures, not modals, so they do not trap focus or block the background.
- All three Contact service selections produced the matching message guidance with an accessible description. Field focus styling was checked. The existing full browser suite separately passed required/whitespace/email validation, error focus, optional email, exact WhatsApp message/URL encoding and blocked-popup fallback. No enquiry was sent and no phone call was made.
- With JavaScript disabled, all four introductions finished in a visible state; native project disclosures and Services FAQs remained operable. The existing suite also checked disabled-form and direct-contact fallbacks.
- `npm.cmd run test:browser` passed again across all five routes and four widths, including metadata, direct loading/refresh, navigation, keyboard/focus behavior, image/font loading, no console errors, FAQ controls, enquiries and existing Home/About scroll reveals.
- `npm.cmd run test:hero` passed again: homepage entrance on fresh load/refresh/return, all background controls, crossfades, delayed-image handling, touch emulation, reduced motion, disabled/blocked JavaScript and shared-header behavior across every route.

Reports are stored in ignored `test-results/inner-checks.txt`, `checks.txt` and `hero-checks.txt`. No new photo downloads, dependencies or routes were needed. The photos remain illustrative stock scenes; all portfolio examples remain labelled concepts. The redundant second contact CTA on Projects was removed during visual review, leaving its specific website-idea enquiry action.

Limitations: testing used installed headless Chrome and emulated viewport/touch settings, not physical devices, Firefox, Safari or screen-reader software. No lint script is configured. No deployment or recruiter submission was performed.
