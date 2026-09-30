# Nexora asset sources

All displayed assets are local. There are no hotlinked reference-site images, CDN font requests or fabricated image URLs.

| Local file                              | Source and credit                                                                                                                      | Use                                      |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `public/images/nexora/workspace.webp`   | [Jantine Doornbos / Unsplash](https://unsplash.com/photos/black-laptop-computer-turned-on-displaying-source-code-on-table-xt9tb6oa42o) | Home hero: laptop and website code       |
| `public/images/nexora/it-support.webp`  | [Ricardo IV Tamayo / Unsplash](https://unsplash.com/photos/two-men-working-on-a-computer-motherboard-nApaD08bFAE)                      | Home hero: computer maintenance          |
| `public/images/nexora/networking.webp`  | [User_Pascal / Unsplash](https://unsplash.com/photos/a-network-switch-with-ethernet-cables-connected-vE5AKQRUs7c)                      | Home hero: small-business network switch |
| `public/images/nexora/development.webp` | [Dawit / Unsplash](https://unsplash.com/photos/laptop-displaying-code-on-a-desk-dTmj5aXbKp4)                                           | About: development workspace             |
| `public/images/nexora/restaurant.webp`  | [Robert, Visual Diary / Unsplash](https://unsplash.com/photos/restaurant-tables-and-chairs-with-warm-lighting-Pgu0wF6EOOE)             | Restaurant concept preview               |

These source pages identify their photos as available under the [Unsplash License](https://unsplash.com/license). The verified source image URLs were downloaded as WebP: workspace at 1800px, IT support and networking at 1920px, development at 1600px, and restaurant at 1200px. The photos are illustrative stock imagery, not Nexora premises, employees or customers.

Source image identifiers: `photo-1529661197280-63dc545366c8`, `photo-1756946565798-382eb6bfeda2`, `photo-1763142045723-230b56924c6a` on `images.unsplash.com`. Source pages and image contents were inspected before use.

Additional hero image identifiers: `photo-1768633647910-7e6fb53e5b0f` (IT support) and `photo-1750711731797-25c3f2551ff8` (networking). Their source pages and downloaded contents were inspected. Both use `w=1920&q=82&fm=webp&fit=max` for the local copies. Desktop and mobile focal positions are editable in `src/content/hero-slides.ts`. Backgrounds are decorative, with empty alt text and an `aria-hidden` image container; descriptive labels belong to the selection buttons.

Manrope is downloaded from the [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/manrope), stored as `src/app/fonts/Manrope-Variable.ttf`, and loaded with `next/font/local`. The accompanying SIL Open Font License is `src/app/fonts/OFL.txt`. No network font download occurs during development or builds.

The Nexora N mark, favicon, service icons and concept-preview layouts/illustrations are original SVG/HTML/CSS in this project. The concept names are fictional examples, not customer identities. All three previews are explicitly labelled concepts. Preview type treatments are deliberate design-study variations; the main site uses Manrope throughout.

No required asset is missing. Future replacement with approved company photography is optional. Inner-page image paths, honest alt text and desktop/mobile focal points are in `src/content/page-images.ts`; homepage backgrounds are in `src/content/hero-slides.ts`, and project photography is in `src/content/projects.ts`.

The inner-page upgrade reuses these local photographs without additional downloads: development for About/Contact introductions, workspace for the Projects introduction and website service, IT support for the About focus section and support service, and networking for the Services introduction and network service. These are illustrative stock scenes, not a claim about Nexora's team or location. `EditorialImage` preloads each introduction's photograph and lazy-loads below-fold images.

The expanded portfolio previews are original HTML/CSS mockups, with proposed navigation, page sections and content relevant to each fictional concept. The Northline preview uses an editorial service overview in place of its smaller decorative architecture illustration; the repair preview uses a drawn device and issue/process sections. The restaurant stock image is used as proposed website content inside the Olive & Ember mockup. None is represented as a real client screenshot or a live website.

The former institute snapshots and unused images remain in `reference/` only, outside the exported site. They are not sources for the Nexora visitor experience.
