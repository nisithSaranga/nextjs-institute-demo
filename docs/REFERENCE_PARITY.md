# Current status: saved inner pages implemented

The saved evidence supplied after the original capture now supports all five mapped inner pages. Sections A-F below are historical homepage/access records; their pending-inner-page statements are superseded by G-H. The homepage and existing concept portfolio are retained. No push or deployment was performed.

﻿# Reference parity: implementation and evidence

Status: **Homepage and shared UI implemented; full-site parity remains incomplete because the five reference inner pages cannot be retrieved from this session.** This document supersedes the initial blocked inspection notes. No push or deployment has been performed.

## A. Page mapping

These reference routes were discovered in the live homepage navigation, not guessed.

| Reference route | Nexora equivalent | Local route | State |
| --- | --- | --- | --- |
| /, /index.html | Home | / | Verified section sequence and source behaviours implemented |
| /about.html | About Nexora | /about | Existing page retained; reference inner layout inaccessible |
| /courses.html | Services | /services | Existing page retained; reference inner layout inaccessible |
| /repair-tools.html | IT support and solutions | /support (provisional) | Not created without inner-page evidence |
| /team-partners.html | Approach and capabilities | /approach (provisional) | Not created without inner-page evidence; no invented staff/partners |
| /contact.html | Contact / Enquire | /contact | Existing working draft form retained; reference form layout inaccessible |
| No observed equivalent | Labelled concept projects | /projects | Existing concepts retained and linked from homepage gallery |

Navigation currently has five Nexora items, versus six in the reference. This is an outstanding structural difference, not a completed mapping. Footer links and all existing routes remain functional.

## B. Section inventory and geometry

### Homepage (implemented)

| Order | Reference pattern | Nexora adaptation | Geometry/source |
| --- | --- | --- | --- |
| Shared header | Fixed logo, navigation, two actions | Existing Nexora logo; WhatsApp and enquiry actions | 82px desktop, 72px <=640px; menu breakpoint 980px |
| 1 | Full-width four-image hero; eyebrow, large heading, copy, two CTAs; bottom-right arrows/dots | Local IT photographs and Nexora business copy | 92vh desktop minimum; 145px/90px padding; 62vh content; mobile 88vh, 120px/70px, 64vh content |
| 2 | Four-cell statistics strip | Four honest capability labels, no numerical business claims | Four columns; two <=980px; 28px/22px desktop cell padding |
| 3 | Light introduction: text left, photograph right | Short Nexora introduction, About action, development photo | 1180px container, 50px split gap, cover crop, rounded image; stacks below 980px |
| 4 | Three numbered offer cards | Website, IT support, network service cards | Three/two/one columns at desktop/980px/640px; 18px gap; 24px padding; 22px corners |
| 5 | Light reasons section with three stacked feature rows | Existing honest working principles | Heading followed by full-width bordered rows; 12px gaps |
| 6 | Dark image gallery with previous/next and eight dots | Eight illustrative local photo/crop entries, no partnership claims | Three active cards desktop; 390px tall, 350px <=900px, 340px <=650px, 290px <=480px |
| 7 | Full-width closing CTA band | Existing Nexora enquiry copy | 70px vertical padding; horizontal desktop, stacked narrow |
| Footer | Four columns and bottom bar | Brand, navigation, services, authorized contacts | 1.4fr/1fr/1fr/1fr, 30px gap; two/one columns on narrow screens |
| Floating control | Circular WhatsApp action | Authorized number and encoded draft | 58px, 22px right/bottom; 14px mobile; 2.6s pulse |

Homepage section padding follows the delivered stylesheet's final 100px rule. Typography uses its system-sans fallback stack on the homepage: hero clamp(44px,6vw,78px), .98 line height, -.055em tracking; section H2 clamp(34px,4vw,54px), 1.02 line height. Nexora logo, blue/navy palette and contact workflow are preserved. Brighter replacement photos require a stronger navy overlay for readable copy and navigation; this is an intentional difference.

The reference's narrow gallery stacks three active DOM-ordered cards inside a one-card-high clipped viewport. The implementation preserves that visible pattern, including DOM ordering when selection wraps. It does not invent swipe or image-modal behaviour.

### Inner pages

Exact section order, imagery, typography, subnavigation, forms, tabs, accordions and galleries remain **unverified**. Existing Nexora About, Services, Projects and Contact sections remain intact. Shared header/footer/button styling is updated; top padding prevents the fixed header obscuring the existing page intros. Their original reveal timings are retained until reference evidence is available.

## C. Interaction inventory

| Element | Verified public-source behaviour | Implementation / accessibility |
| --- | --- | --- |
| Hero | Four slides; 6500ms interval; arrow/dot clicks restart timer; wrapping; no dot-hover listener or hero hover pause; text fixed | Same; selected image must decode before display and newest selection wins |
| Hero images | 1200ms opacity ease-in-out; 7s transform ease-out; inactive scale 1.04, active alternating 1.035/1.045 | Same normal-motion timing; local photo focal positions retained |
| Hero text | Reveal rises 22px over 700ms ease, no explicit delay | CSS entrance once on load/refresh/route entry; never on slide change |
| Homepage reveals | IntersectionObserver threshold .1; add visible class once; 22px/700ms ease; no stagger | Route-aware observer, no stagger; visible base markup without JS; focus cancels animation |
| Header | Fixed; scrolled class after scrollY>25; 350ms transition; scroll-progress line | Same trigger and progress; always usable without JS |
| Mobile drawer | Right drawer min(340px,90vw); 350ms; overlay and links dismiss | Same open/close movement; native details fallback; Escape, focus restoration/trapping, scroll lock added |
| Gallery | Eight entries; three active in DOM order; step one; eight click dots; 5000ms interval; hover pauses; mouseleave/manual actions restart | Same visible selection pattern; keyboard focus additionally pauses for accessibility |
| Gallery image click | The script replaces old lightbox images with new cards without click/lightbox bindings | Images are not misleading modal controls; no added lightbox |
| Contact | Reference form remains inaccessible | Preserved frontend validation and encoded WhatsApp draft; user reviews/sends in WhatsApp |
| Reduced motion | Delivered CSS disables transitions/animations | Also stops automatic hero/gallery advance while retaining manual controls |
| Floating contact | 2.6s pulse; external WhatsApp destination | Authorized Nexora number; no automatic messaging |

Timing and triggers above are **source inspection**, supplemented by local browser tests. They are not claimed as completed live-reference interaction trials. The live retry intended to capture those trials timed out.

## D. Difference checklist

Completed:

- [x] Replace homepage concepts/process sequence with facts, image/text introduction, numbered offers, reasons, gallery and CTA.
- [x] Four slides, timed advance/reset, no hover selection, measured transition and entrance settings.
- [x] Fixed header, scroll state/progress, two CTAs, right drawer and floating contact geometry.
- [x] Source-based card/grid/gallery/CTA/footer structure and responsive rules.
- [x] Preserve Nexora branding, licensed local photos, honest copy and labelled concepts.
- [x] Keep authorized phone/WhatsApp URLs and frontend-only draft workflow.
- [x] Keep App Router, TypeScript, npm lockfile, Tailwind and static export; no added dependencies.

Outstanding / intentional differences:

- [ ] Retrieve and reconstruct all five reference inner pages; confirm additional /support and /approach routes and six-item navigation.
- [ ] Match reference inner-page form, galleries, category controls, detail interactions and any additional linked pages.
- [ ] Complete live-reference comparisons at all sizes, including loaded image composition and exact lower-section dimensions. Captured reference images were unavailable, and offline replay can produce distorted intrinsic image dimensions; those are not authoritative target geometry.
- [ ] Validate live interaction state/timing against the source-derived implementation.
- [ ] Replace the gallery's repeated stock-photo crops with eight distinct authorized images if supplied; currently eight entries use five existing licensed photos.
- Intentional: no personal portraits, invented partnerships, numbers, office/email/address, testimonials or unlabelled client work.
- Intentional: stronger hero overlay; keyboard focus pause in gallery; reduced-motion autoplay suppression; native no-JS menu close can be immediate.
- Intentional: system typography on the homepage, retained Manrope/branding elsewhere; text wrapping differs where honest Nexora copy differs.

## E. Evidence and uncertainty

Local evidence (ignored by Git and outside public/):

- reference/live/index.html: live homepage DOM snapshot.
- reference/live/main.css and main.js: publicly delivered source captured during successful homepage load.
- reference/live/home-1440.png: initial live desktop capture. Below-fold reveals were not triggered in this first capture; empty lower sections are NOT evidence of absent content. Reference photos also failed to appear.
- reference/live/source-replay-{1440,768,390,320}.png: **offline** execution of captured source after scrolling every section.
- reference/live/source-replay-*-section-*.png and source-replay-menu-*.png: offline section/menu states.
- reference/live/source-replay-metrics.json: offline measurements; missing-image geometry is not a fidelity claim.
- test-results/parity/nexora-*.png and menu-*.png: local application comparisons after scrolling reveals into view.
- test-results/parity/results.txt: focused automated checks.
- reference/live/replay.mjs and capture-home.mjs: inspection utilities, not production application code.

Access record: Chrome returned HTTP 200 for the homepage on multiple attempts and allowed saving HTML/CSS/JS. All five navigation-discovered inner URLs timed out on repeated Chrome attempts (12-20s each). Public web-reader attempts also failed. A subsequent homepage multi-viewport live-capture attempt timed out before capture. Earlier curl/direct CSS attempts also timed out. These are access failures from this session, not proof the site is globally unavailable.

The default Windows sandbox runner fails before PowerShell startup (`helper_unknown_error: setup refresh had errors`). Authorized commands work through the alternate runner. Two edit commands hit automatic-review deadlines and were retried; a later review usage-limit failure paused verification until the user requested continuation after reset. Failed commands were not treated as successful edits.

## F. Verification and handover

Automated results are finalized below after the last implementation corrections. Build success alone does not establish parity. Live-reference full-site visual parity remains unverified for the reasons above.

Preview: `npm.cmd run dev`, or `npm.cmd run build` followed by `npm.cmd run preview`; open http://localhost:3000. Tests: `npm.cmd run test:browser`, `npm.cmd run test:hero`, `npm.cmd run test:inner`, `npm.cmd run test:parity`.

To complete the specifically blocked work, provide saved webpages (with CSS/JS) and 1440px/390px full-page screenshots for About, Courses, Repair & Tools, Team & Partners, and Contact, plus recordings of their open/active controls. Alternatively restore access to those exact linked URLs from this environment. Homepage work has proceeded from saved evidence rather than being blocked by those missing pages.

### Completed verification for the implemented scope

- PASS: npm run typecheck and production npm run build, including the existing postbuild static-segment fix.
- PASS: npm run test:browser: all five current routes at 320/390/768/1440px, direct load/refresh, metadata, links/anchors, images, overflow, keyboard navigation, FAQ, JavaScript-disabled fallback, WhatsApp draft validation/encoding/focus/popup fallback, no stored form data, no external message transmission, homepage and About wheel-scrolling reveals.
- PASS: npm run test:hero: fresh/refresh/client-return entrance, four slides, wrapping, click/keyboard/touch, no hover selection, crossfade, fixed header at both widths, delayed-image race protection, reduced motion and disabled/blocked JavaScript.
- PASS: npm run test:inner: original inner-page entrances and reveals, observer lifecycle cleanup, four widths, disclosure keyboard/Escape/focus, form guidance and no-JavaScript readability.
- PASS: npm run test:parity: responsive route/overflow/image/contact checks, hero/gallery controls, 6500ms hero timer/reset, 5000ms gallery hover pause/restart, reduced-motion autoplay cancellation.
- PASS: additional focused check of manual gallery timer restart while hovered and 350ms normal-motion drawer exit/focus restoration.
- PASS: git diff --check (line-ending normalization notices only).

Automated tests protect local application behaviour; they do not establish inaccessible reference-page parity. Existing test expectations were updated for four slides, no dot-hover selection, source-based timing/threshold, hidden gallery images and the new card selector. Inner-page observer instrumentation now recognizes both homepage and inner-page observer configurations.

Visual review: inspected live initial desktop capture, offline reference mobile hero/introduction, local desktop/mobile hero comparisons and the complete local lower homepage/footer. Corrected heading wrapping, stock-photo contrast, capability/reason text density, footer selector and button alignment. No full live inner-page comparison is claimed.

Review artifacts:

- test-results/parity/comparison-1440.png and comparison-390.png: labelled side-by-side hero comparisons. Left is offline reference source with unavailable photos; right is the local export.
- test-results/parity/nexora-home-{320,390,768,1440}.png: complete local homepage captures with lower reveals triggered.
- test-results/parity/nexora-{about,services,projects,contact}-*.png and menu-*.png: current route/menu evidence.
- test-results/checks.txt, hero-checks.txt, inner-checks.txt and parity/results.txt: test reports.

The implemented homepage/shared changes are ready for local review. Full-site parity sign-off remains blocked by the five reference inner pages and missing loaded-image/live-state comparisons. Nothing was committed, pushed or deployed.

## G. Saved inner-page evidence and implementation acceptance (2026-09-30)

This section supersedes the earlier inner-page access blocker. Supplied HTML, CSS and JavaScript in reference/saved support About, Courses and Contact. Screenshots plus shared source support Repair & Tools and Team & Partners. Screenshot dimensions are image dimensions, not necessarily CSS viewports; scaled desktop captures are not treated as mobile observations. No recordings were supplied. Source-derived timing is not claimed as live observation.

| Reference | Nexora | Route | Required section order |
| --- | --- | --- | --- |
| About | About | /about | Photo hero; light story and three milestone-shaped scope cards; dark three principles; light five-image gallery; CTA |
| Courses | Services | /services | Photo hero; light two long illustrated scope cards; dark three stages; light comparison table; dark two FAQs |
| Repair & Tools | Support | /support | Photo hero; light three support cards and action; dark eight-image equipment carousel; light text/portrait split |
| Team & Partners | Approach | /approach | Photo hero; light four observed portrait-shaped capability cards; dark seven-image grid (4+3); CTA |
| Contact | Contact | /contact | Photo hero; light contact details and three-tab form; dark map-shaped image/FAQ split |
| Existing concept portfolio | Concept projects | /projects | Retained separately; linked in footer and Approach, not substituted for a reference page |

Geometry from supplied CSS/JS: 1180px content cap; 100px section padding at both measured desktop and narrow sizes (the final saved CSS overrides earlier narrow rules); 70px CTA padding; photo inner heroes nominally 55vh; headings up to 72px; section titles 34-54px. About gallery 3:2 contain, minimum 420/360/300/250px, 48px controls, five dots. Services cards use two columns, 230px cover images, 30px inset, 24px corners, small uppercase subsection titles and dense tick lists; stack at 700px. Contact columns .8fr/1.2fr, 20px gap, collapse at 850px; fields two columns, single at 640px. Team cards four/three/one columns at 980/640px. Seven-image grid four/two/one at 900/560px. Equipment gallery keeps three visible columns even on mobile; image heights 330/250/190/150px at 850/600/420px.

Source-derived interactions: About gallery five slides, 5000ms interval, previous/next wrap, click dots, hover pauses, mouseleave and manual selection restart timer; .8s image opacity and 5s scale to 1.025; no viewer. Support gallery eight positions, three rotated image slots, 5000ms interval and equivalent timer controls; no viewer. Contact tabs show one form, independent fields retained while switching; source requires name/phone and support problem, uses native validity, prepares WhatsApp and resets submitted form. FAQ disclosures are independent, source maximum-height transition .35s. Reveals use threshold .1, 22px, 700ms ease, no stagger, remain shown. Keyboard tab navigation, native disclosure semantics, focus visibility and reduced-motion autoplay cancellation are accessibility adaptations.

Required corrections: replace the old About photo/process sequence, three separate service layouts, and single contact form; add Support and Approach; expand shared navigation consistently. Preserve verified homepage/shared UI. Use existing licensed photos only. About milestone shapes describe scope rather than invented history/statistics; Approach cards describe capabilities rather than invented employees, and seven photos are expressly illustrative rather than partner evidence. Contact map is replaced by an equally sized illustrative image because no business address is authorized.

Unverified: original Team page total staff rows (four visible in supplied screenshot, shared script also appends two staff to an unknown base); exact screenshot browser zoom; missing original hero background assets; live interaction replay and touch behavior. Implement visible supported structure without inventing unseen rows or modal interactions.

## H. Completed saved-evidence scope (2026-10-01)

All five supported inner-page mappings in G are implemented. The pre-existing homepage, shared navigation behavior and concept portfolio were retained. The header now consistently exposes the six reference-equivalent destinations; Projects remains an additional honest concept portfolio, linked from Approach and the footer. This section supersedes the historical pending-page checklists above.

### Extraction and comparison method

All eleven supplied PNGs were visually inspected: About 1897�902 / 527�911; Courses 1872�907 / 1757�960 / 1020�897; Repair & Tools 1870�907 / 575�915; Team & Partners 1735�911 / 1722�907; Contact 1857�901 / 1725�920. Narrow supplied captures still show desktop navigation/columns, so their pixel dimensions cannot establish mobile CSS viewports. No recordings were supplied.

Saved About, Courses and Contact HTML was opened offline at **1440�900 and 390�900**, with external requests blocked. Local Nexora captures use those same known CSS viewports. The offline screenshots deliberately force reveal targets visible for structural inspection, not animation verification. Missing original hero backgrounds and any offline intrinsic-image effects are excluded from fidelity claims. Inventory, computed geometry and captures are under `test-results/saved-evidence/` (ignored). The original supplied screenshots were used to cross-check section order, color bands, image placement and visible controls.

Measured saved-source heroes are 495px high at 1440�900 (55vh); H1 is 72px/700, line-height .98, tracking -.055em. At 390�900 H1 is 46.8px; hero minimum remains 495px but About expands to approximately 511px for its original copy. Sections retain **100px vertical padding even on narrow screens** because the final saved CSS overrides earlier rules; CTA padding is 70px. Content cap is 1180px with 20px narrow gutters. Original Contact desktop columns measure 464px/696px with 20px gap; at 390px they stack at 350px. Nexora adopts these rules, allowing honest copy to determine height and wrapping.

| Page | Directly observed structure retained | Nexora mapping / precise difference |
| --- | --- | --- |
| About | Photograph hero; light story with three milestone-shaped panels; dark three principles; light single-image gallery with arrows/five dots; dark CTA | Scope panels describe Web/IT/Network rather than dates or statistics. Principles use business practices, not institutional claims. Five local stock photographs replace institute memories. |
| Services | Hero; two long image-led cards (light/dark); dark three stages; light plain comparison table; dark two FAQ rows | First card covers websites, second combines IT support and networking while preserving all three existing service anchors. Copy/list lengths differ. Table has no invented prices, qualifications or outcomes. |
| Support | Hero; light three support cards and action; dark three-visible-image equipment gallery/eight dots; light text/portrait split | Computer/network support replaces training/tool sales. Eight positions use five distinct licensed images plus repeats/crops. Three slots remain visible at narrow widths, matching supplied shared CSS. |
| Approach | Hero; light four portrait-shaped cards; dark seven-image grid (4+3 desktop); CTA | Capabilities replace people; illustrative technology scenes replace partnership evidence. Only four observed cards are reproduced: the unknown underlying staff count is not guessed. |
| Contact | Hero; five information entries beside three-tab form; dark map/FAQ split | Uses authorized phone/WhatsApp and service links instead of invented email, address or hours. A labelled workspace photograph occupies the map area. Website/IT/network enquiry forms have 8/6/5 fields. |

### Behavior evidence and accessibility adaptations

The screenshots directly establish visible controls and closed/open visual structures only. Five-second gallery timing, wrapping, hover pause/manual reset, three-slot rotation, tab field persistence, native form validation/reset and 700ms/22px threshold-.1 reveals are **inferred from the saved JavaScript**, not observed on the live reference. No unseen modal, partner interaction, extra staff row or new destination was invented.

Local implementation adds persistent gallery pause, keyboard-focus pause, reduced-motion suppression, decoded-image switching, visible focus, arrow/Home/End tab navigation and real native FAQ disclosures. About uses the source's .8s fade/5s scale; Support rotates three stable image slots. Source FAQ animation uses a .35s max-height effect; local native details open immediately, preserving intrinsic height, keyboard access and no-JavaScript operation. This is an intentional interaction difference.

Heroes preload locally stored photographs and use configurable desktop/mobile focal positions. Their single 700ms CSS entrance starts independently of hydration and finishes without JavaScript; reduced motion removes it. Below-fold content is visible by default; small client-side observers animate once per route visit and disconnect on navigation. Contact fallback instructions remain visible until hydration succeeds, while form controls stay disabled. Submission opens an encoded WhatsApp draft with `noopener,noreferrer`, never reports delivery, resets only the submitted form and exposes a focusable fallback link. No enquiry data is stored or transmitted elsewhere.

Visual review corrected table decoration, capability-card borders/insets, dark-section text contrast and dot contrast over bright images. A final matching-viewport comparison also identified the source container's `margin:auto`: vertical auto margins are now applied to the inner hero container so shorter introductions share the source's placement within its padding. Stock photography, stronger gradients, Nexora colors, copy wrapping, explicit concept/illustration labels and the pause controls remain intentional differences. No original people, partner logos, institute photographs or contact destinations enter the production bundle.

### Remaining uncertainty

- No supplied recordings or live inner-page replay: reference timing/touch/active-state behavior remains source-derived.
- Repair & Tools and Team & Partners lack complete saved page HTML; their visible screenshots and shared CSS/JS support the implemented sections, not unseen content or unknown staff rows.
- Screenshot browser zoom and CSS viewport sizes are unknown. Matching offline/local viewport captures establish comparable geometry, not pixel-perfect equivalence with those PNGs.
- Original hero photographs are unavailable and would be inappropriate Nexora assets. Five licensed local photographs are intentionally reused; eight distinct gallery photographs would require additional approved assets.
- Reference-specific copy lengths, font rendering, image aspect ratios and missing-image offline behavior prevent exact page-height parity. No complete live-site parity is claimed.

### Final local verification

Validation performed (all passed):

- `npm.cmd run typecheck` and `npm.cmd run build`; output contains `/`, `/about/`, `/services/`, `/support/`, `/approach/`, `/contact/` and `/projects/` plus framework assets/404. The existing Windows static-segment normalization still runs.
- `npm.cmd run test:browser`: all seven routes at 320/390/768/1440px; direct load and refresh, metadata, active links, decoded images, no horizontal overflow or console errors, keyboard menu/navigation, all local destinations and fixed-header anchor clearance; no-JavaScript readability, FAQ and disabled-form/contact fallback.
- `npm.cmd run test:inner`: three enquiry tabs at all four widths, arrow/Home/End navigation, retained tab fields, required/whitespace/email/number validation and focus, encoded authorized WhatsApp destinations, reset/fallback status, independent FAQs, gallery selection/wrapping and concept disclosure Escape. About/Support five-second autoplay, hover pause/manual restart, reduced-motion cancellation and actual 22px/700ms reveal calls passed. No message, call, external form request or form storage occurred.
- `npm.cmd run test:hero`: preserved homepage fresh/refresh/return entrance, painted initial pose, stable copy, all controls, touch, four-image loading/cropping, delayed-image races, reduced motion, disabled/blocked JavaScript and shared header behavior on seven routes.
- `npm.cmd run test:parity`: seven-route four-width regression matrix, menu focus/restoration, homepage controls, hero/gallery timing and reduced motion.
- `node scripts/check-saved-pages.mjs`: all five reconstructed pages play entrances on direct load, refresh and client-navigation return; observers disconnect/reconnect; below-fold reveals finish after scrolling. Persistent pause/resume and keyboard-focus pause passed on both inner galleries. Captures and measurements cover 1440�900 and 390�900.
- `git diff --check`: passed; Windows line-ending normalization notices only. No lint command is configured.

Measured Nexora H1 is 72px/700 desktop and 46.8px/700 at 390px, matching saved-source metrics. All five desktop heroes measure 495px; at 390px About measures approximately 495.2px versus the original's 510.6px, while Services/Contact measure 495px in both versions. Main section and CTA padding match the measured 100px/70px rules. Copy length, wrapping and paragraph margins still change exact text baselines and total section heights.

All five local desktop/mobile full-page captures were visually reviewed against the supplied section evidence. Labelled, known-viewport comparisons for About, Services and Contact are `test-results/saved-evidence/compare-{about,services,contact}-{1440,390}.png`; left is offline source, right is Nexora. Full captures, source inventory and local measurements are in that same directory. Repair/Approach comparisons use the supplied screenshots and shared source rules; their original CSS viewport is unknown. Test reports are in `test-results/checks.txt`, `inner-checks.txt`, `hero-checks.txt`, `parity/results.txt`, and `saved-evidence/local-results.json`.

No complete live-reference parity, original mobile screenshot viewport, or unprovided recording behavior is claimed. No changes were pushed or deployed.

Verification sequence: after all four browser suites passed, the final hero-container margin correction changed only scoped CSS. The production build, complete seven-route responsive/browser suite and saved-page animation/lifecycle suite were rerun for that correction; unchanged form/gallery/homepage interaction suites were not repeated unnecessarily.
