# Front end: what changed and why

These notes explain the redesign. Each section starts with the general idea
and then shows how it applies to this site, so you can make the same calls on
your next project. The brief was an "editorial / research notebook"
direction: an engineer's lab notebook crossed with a Swiss-style magazine,
strictly black and white, with the outlined display type from your Figma.

---

## 1. Why the old site looked "templated"

A site feels generated when nothing in it was decided on purpose. Every
choice is the default that a starter, a component library or an AI tool
reaches for first. The tell-tale signs, most of which the old site had:

| Templated pattern | Why it reads as generic | What the site does now |
| --- | --- | --- |
| Everything centred, `max-w-7xl mx-auto`, symmetric two-column halves | Centring is the absence of a layout decision | Asymmetric 12-column grid: labels in columns 1–3, content from column 4 |
| Sizes picked per component (`text-3xl` here, `text-4xl` there) | No relationship between sizes, so no hierarchy | One modular type scale used everywhere (section 2) |
| Rounded cards with shadows for every piece of content | A "card" says nothing about the content inside it | Hairline rules, ledgers, tables and lists: structure comes from type and lines |
| Icon grids for skills | Logos of tools look the same on every portfolio | Skills set as type: a run of large words, then a two-column inventory |
| Each section styled differently | Feels assembled, not designed | One `SectionHeader` for every section, the same rhythm everywhere |
| Accent colours (the old blue `--primary`, purple `--accent`) | Brand colour without a reason | Ink, paper and one grey. Nothing else |
| "Hello I'm…" hero, text left / picture right | The most common hero on the web | A poster-style type composition with a live status line |
| Default font pairs (Inter / Poppins / Sora) | Seen on thousands of sites | A chosen trio with a job each (section 3) |

The fix is not decoration. It's *constraints*: a small number of rules
(one scale, one grid, one header pattern, three colours) applied
consistently. Consistency is what makes a design read as intentional.

---

## 2. The type scale

### The idea

A **modular scale** is a sequence of sizes where each step is the previous
one multiplied by a fixed ratio, borrowed from musical intervals:
1.2 (minor third), 1.25 (major third), 1.333 (perfect fourth),
1.5 (perfect fifth). Because every size is related to every other, headings,
body and captions look like members of one family. Random sizes (18, 22, 30,
36…) don't, even when each one looks fine on its own.

A small ratio gives gentle contrast, which suits phones where space is tight.
A larger ratio gives drama, which suits big screens. So the scale here is
**fluid**: it uses ratio **1.2 at a 360 px viewport** and **1.333 at
1440 px**, and slides smoothly between them.

### `clamp()`

`clamp(MIN, PREFERRED, MAX)` returns the preferred value, but never less than
MIN or more than MAX. With a preferred value of `a rem + b vw`, the size
grows linearly with the viewport width:

```
size(viewport) = intercept + slope × viewport
slope     = (maxSize − minSize) / (1440 − 360)
intercept = minSize − slope × 360
```

For example, the body size goes from 16 px to 18 px:
slope = 2 / 1080 = 0.185 vw, intercept = 16 − 0.00185 × 360 = 15.33 px
= 0.958 rem, so `clamp(1rem, 0.958rem + 0.185vw, 1.125rem)`.
The intercept is in `rem` so the text still grows when someone raises their
browser's font size (a pure `vw` size would ignore that, which is an
accessibility failure).

### The values (from `src/app/globals.css`)

| Token | 360 px | 1440 px | `clamp()` | Used for |
| --- | ---: | ---: | --- | --- |
| `step--1` | 13 | 13 | `0.8125rem` (fixed) | Mono labels |
| `step-0` | 16 | 18 | `clamp(1rem, 0.958rem + 0.185vw, 1.125rem)` | Body text |
| `step-1` | 19 | 24 | `clamp(1.2rem, 1.1rem + 0.444vw, 1.5rem)` | Lead text, list items |
| `step-2` | 23 | 32 | `clamp(1.44rem, 1.254rem + 0.828vw, 1.999rem)` | Taglines, intro paragraphs |
| `step-3` | 28 | 43 | `clamp(1.728rem, 1.416rem + 1.388vw, 2.665rem)` | Role and school titles |
| `step-4` | 33 | 57 | `clamp(2.074rem, 1.581rem + 2.19vw, 3.552rem)` | Project titles, figures |
| `step-5` | 40 | 76 | `clamp(2.488rem, 1.739rem + 3.328vw, 4.735rem)` | Section titles |
| `display` | 54 | 184 | `clamp(3.375rem, 0.667rem + 12.037vw, 11.5rem)` | Hero name, "Let's talk", footer |

`display` sits outside the ratio on purpose: one poster-sized size, used
three times, makes the extremes of the page feel bold. Line height falls as
size rises (1.6 for body, 0.86 for display): big type set loosely looks like
separate words floating apart.

In Tailwind they're used as `text-step-2`, `text-display`, etc. (mapped in
`tailwind.config.ts`), so there are no ad-hoc sizes in the components. The one
deliberate exception is the case-study `<h1>`, which uses a slightly smaller
custom clamp because long words like "Maintenance" overflowed at `display`
size.

---

## 3. The fonts

Each family has one job:

- **Archivo** (display): a grotesk with a *width* axis. Set at weight 800
  and `font-stretch: 112%` it gets the wide, heavy, poster look of Swiss
  magazines, and it holds up when outlined. Thin or high-contrast serifs fall
  apart with a text stroke.
- **Newsreader** (text): a serif drawn for reading on screens, with an
  *optical size* axis: small text gets sturdier shapes, large text gets
  finer detail, automatically (`font-optical-sizing: auto`). Its italic gives
  the "voice" moments ("Based in France.", "at Libertify").
- **JetBrains Mono** (labels): every index, date, figure, caption and
  metadata line. Monospace with tabular numbers makes columns of dates and
  metrics line up, and it is the "lab notebook" layer: `Fig. 1`, `A — Context`,
  `01 — Projects`.

They load through `next/font/google` in `layout.tsx`. next/font downloads the
fonts at build time and serves them from your own domain (no request to
Google from the visitor's browser, which is better for privacy and speed), adds
`font-display: swap`, and generates a size-adjusted fallback so the layout
doesn't jump when the real font arrives. The old `@import` of Sora in
`globals.css` blocked rendering and loaded a font nothing else used. It's gone.

---

## 4. The grid

A grid makes alignment automatic: if every element starts and ends on a
column line, things line up across the whole page without anyone measuring.

- **12 columns** because 12 divides into 2, 3, 4 and 6, so it supports many
  asymmetric splits (3 + 9, 3 + 6 + 3, 1 + 6 + 3 + 2).
- **Fluid margins and gutters**: `--margin: clamp(1.25rem, 0.5rem + 3.4vw, 4rem)`
  (20 → 64 px) and `--gutter: clamp(1rem, 0.75rem + 1vw, 1.5rem)` (16 → 24 px).
  Content is capped at 90rem (1440 px).
- **One column on phones.** Below `md` the grid collapses; order and spacing
  carry the structure.
- `.frame` (width + margins) and `.grid-12` (the columns) are the only two
  layout classes every section uses.

The recurring pattern is **label left, content right**: the mono label lives
in columns 1–3, titles and text start at column 4, metadata takes the last
three columns. Repetition of that one asymmetric move is what makes the page
feel like a single publication.

Vertical rhythm comes from one token, `--space-section`
(`clamp(5rem, 3rem + 8vw, 10rem)`), between sections, and hairline rules:
solid ink for structure (section starts, table edges), `ink/20` for
subdivisions within a list.

---

## 5. Colour and imagery

The palette is three tokens in `:root`: `--ink` (near-black), `--paper`
(white) and `--mute` (a grey with 6.9:1 contrast on white, above the 4.5:1
WCAG AA minimum for body text). They're stored as RGB channels
(`10 10 10`) so Tailwind can add opacity (`border-ink/20`).

Black sections (contact, footer) use the `.inverted` class, which simply
swaps the tokens: inside it, "ink" is white and "paper" is black. Components
keep using `text-ink` and `border-ink` and work on both surfaces, focus rings
and the outlined type included, with no duplicated "dark" styles.

The project images and portrait are colour photos. They're shown in
greyscale with a CSS filter (`.mono-img`) rather than edited, so the original
files are untouched and the decision can be reversed in one line. The
portrait regains its colour on hover, a small personal touch.

The outlined treatment (`.text-outline`) is `-webkit-text-stroke` with a
transparent fill. The stroke width is `clamp(1px, 0.022em, 4px)`, so it
scales with the font size instead of being a fixed 4px that looks heavy on
small text and thin on huge text. Browsers without text-stroke get solid text.

---

## 6. Server and client components

In the App Router every component is a **server component** unless its file
starts with `'use client'`. Server components run at build time (this site is
fully static) and send only HTML. Client components also ship JavaScript to
the browser so they can use state, effects and event handlers.

The rule followed here: **render on the server, and make only the
interactive leaves client components.**

| Client component | Why it needs the browser |
| --- | --- |
| `site-header.tsx` | IntersectionObserver, menu open state, keyboard handling |
| `contact.tsx`, `submit-button.tsx` | `useFormState` / `useFormStatus` for the Server Action |
| `paris-time.tsx` | The current time is only known when you visit |
| `current-year.tsx` | Same: a static page would freeze the year at build time |

Everything else (all sections, the case-study page, the footer shell) is a
server component. Notice that `ParisTime` and `CurrentYear` are tiny islands
inside server-rendered markup: the hero and footer stay server components and
only the few characters that change are client code. The home page's own
JavaScript is about 2.5 kB.

Both "live" components render a placeholder first (`--:--`, the build year)
and fill in the real value in `useEffect`. Rendering `new Date()` directly
would produce different HTML on the server and in the browser, a
**hydration mismatch**.

---

## 7. Active navigation with IntersectionObserver

The naive way to highlight the current section is to listen to `scroll` and
measure every section's position on each event. That runs dozens of times per
second on the main thread.

`IntersectionObserver` inverts this: you tell the browser which elements to
watch and what region counts as "visible", and it calls you back only when an
element crosses into or out of that region. The browser computes it
efficiently, off the scroll path.

```ts
new IntersectionObserver(callback, { rootMargin: '-40% 0px -55% 0px' });
```

`rootMargin` shrinks the viewport used for the test. Negative 40% at the top
and 55% at the bottom leaves a thin band between 40% and 45% of the screen
height. Because sections are stacked edge to edge, exactly one section
overlaps that band at any time (or none while the hero is showing), so there's
no ambiguity about which link to highlight. The active link gets
`aria-current="location"`, which screen readers announce, as well as the
underline.

The observer only runs on `/`. On project pages the nav links point to
`/#projects`, `/#education`… so they navigate home and scroll to the section.
On the home page those same links are just in-page jumps.

---

## 8. Accessibility

### `prefers-reduced-motion`

Some people get dizzy or nauseous from motion (vestibular disorders), and
operating systems have a "reduce motion" setting. CSS can read it:

```css
@media (prefers-reduced-motion: no-preference) { /* motion goes here */ }
```

All motion in this site is opt-in: smooth scrolling, the scroll reveals and
the pulsing status dot are inside `no-preference` blocks, and a final
`reduce` block shortens any remaining transition to nothing.

The **reveal on scroll** uses CSS scroll-driven animations
(`animation-timeline: view()`): the animation's progress is tied to the
element's position in the viewport instead of to time. No JavaScript, no
library. It is wrapped in `@supports`, so browsers that don't support it
(currently Firefox and older Safari) just show the content. Motion is an
enhancement, never a requirement for seeing the page.

### Focus management

Keyboard and screen-reader users move through the page by focus, so focus
must always be visible and always somewhere sensible:

- **Visible focus**: one `:focus-visible` style everywhere, a 2px outline
  offset by 3px. `:focus-visible` (unlike `:focus`) shows the ring for keyboard
  users but not after a mouse click.
- **Skip link**: the first focusable element jumps to `<main id="main">`, so
  keyboard users don't tab through the nav on every page.
- **Mobile menu**: the button has `aria-expanded` and `aria-controls`. Opening
  it moves focus to the first link; Tab and Shift+Tab are kept inside the menu
  (a *focus trap*, since the page behind is covered); Escape closes it and
  returns focus to the button that opened it, so the user is never lost.
- **Form**: every input has a visible `<label>`, errors are tied to their field
  with `aria-describedby` and `aria-invalid`, and a summary is announced with
  `role="alert"`. Errors don't rely on colour (there isn't any): they are
  marked with a "!" badge and a thicker underline.

Other details: headings go h1 → h2 → h3 without skipping; every external link
goes through `ExternalLink`, which adds `target="_blank"`,
`rel="noopener noreferrer"` and an "(opens in a new tab)" hint for screen
readers; small text links get a 44 px minimum hit area (`.hit`); decorative
images have `alt=""` and meaningful ones use the alt text from `data.ts`.

---

## 9. Metadata, `metadataBase` and Open Graph images

When a link is shared on LinkedIn, Slack or X, their crawler reads `<meta>`
tags from your page: `og:title`, `og:description`, `og:image`… (the
**Open Graph** protocol; X adds its own `twitter:*` tags and falls back to
Open Graph).

`og:image` must be an **absolute** URL: the crawler has no idea which domain
`/opengraph-image` belongs to. Next.js lets you write relative URLs in
metadata and resolves them against `metadataBase`. That's why the build used
to warn when it was missing. It's now set from `NEXT_PUBLIC_SITE_URL`
(falling back to Vercel's production domain, then localhost) in
`src/lib/site.ts`. Set the variable to your real domain in the host's build
settings; it's in `.env.example`. The same URL feeds `sitemap.xml` (the list
of pages for search engines) and `robots.txt` (crawler rules plus the sitemap
location).

The social images are generated, not designed by hand: `opengraph-image.tsx`
files export a component and Next.js renders it to a 1200×630 PNG with
`next/og` (which uses Satori to turn JSX + a subset of CSS into an image).
There's one for the site and one per project
(`projects/[slug]/opengraph-image.tsx`), both rendered by the shared
`src/lib/og.tsx`: mono header line, huge title, tagline, hairlines. Satori
can't use next/font, so it fetches just the glyphs it needs from Google Fonts
at build time, with a fallback to the built-in font if the network fails.
Because the files sit next to the pages, Next.js wires up the
`og:image` tags automatically, including width, height and alt.

Each project page also sets its own canonical URL (`alternates.canonical`),
so search engines don't think it's a duplicate of the home page.

---

## 10. File structure

```
src/app/layout.tsx              fonts, metadata, skip link, the one <main>
src/app/page.tsx                sections in navigation order
src/app/projects/[slug]/        case study + its OG image
src/app/opengraph-image.tsx     site OG image
src/app/sitemap.ts, robots.ts
src/components/sections/        hero, projects, experience, education, skills, about
src/components/contact.tsx      contact section + form (client)
src/components/site-header.tsx  nav, active section, mobile menu (client)
src/components/site-footer.tsx
src/components/section-header.tsx  "01 — Label" header used by every section
src/components/external-link.tsx   rel/target for every outbound link
src/components/paris-time.tsx, current-year.tsx   small client islands
src/lib/site.ts                 site URL, sorted experience, section numbering
src/lib/og.tsx                  OG renderer
```

Section numbers ("01 — Projects") come from each section's position in
`navigation` in `data.ts`. Reorder the nav and the page renumbers itself.
Experience is sorted newest first with ongoing roles on top, so adding a new
job only means adding an entry to `data.ts`.

Removed: the shadcn `ui/` components, the toast system (nothing used it),
`lucide-react` (arrows are typographic: ↗ → ↓), two Tailwind plugins (the
outline is plain CSS now) and the unused colour tokens (blue primary, purple
accent, chart and sidebar colours).
