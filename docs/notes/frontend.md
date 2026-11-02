# Front end: what changed and why

These notes explain the redesign. Each section starts with the general idea
and then shows how it applies to this site, so you can make the same calls on
your next project. The brief was an "editorial / research notebook"
direction: an engineer's lab notebook crossed with a Swiss-style magazine,
strictly black and white, with the outlined display type from your Figma.

> **Update: "The Field Journal".** The site has since been re-themed as an
> engineer-explorer's field journal (section 11). The ideas in sections 1–10
> (one type scale, one grid, one header pattern, server-first components,
> accessibility) all still apply, but the concrete fonts, colours and scale
> values in sections 2, 3 and 5 describe the previous black-and-white design.
> Section 11 gives the current values and explains why.

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
| `contact-form.tsx`, `submit-button.tsx` | `useFormState` / `useFormStatus` for the Server Action |
| `ink-draw.tsx` | IntersectionObserver that starts the draw-once ink animation |
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

---

## 11. The Field Journal

The concept: the site is the field journal of an engineer-explorer, which
is also a scientist's lab notebook. The *idea* comes from the journals
characters keep in narrative games (Arthur Morgan's sketchbook, Nathan
Drake's notebook): a curious person recording a journey in ink. Nothing is
borrowed from those games: no fonts, artwork, logos, Western motifs or game
UI. What's borrowed is the attitude: careful handwriting, precise sketches,
dated entries.

### 11.1 Restraint: what separates "adult" from "childish" themed design

A theme turns childish when it becomes a costume: every surface carries a
prop (tape, coffee stains, torn edges, leather), the props mean nothing, and
the theme competes with the content. A real naturalist's or engineer's
notebook looks nothing like that. It's mostly clean writing, ruled lines and
a few exact drawings, each made because something needed to be recorded.

So the rules this design follows:

1. **At most one illustration per section**, and most sections have none.
   The whole site has three figures.
2. **Every sketch is true.** Each one shows something real about the work
   and could survive a question from an expert:
   - *Fig. 1, calibration* (hero). A reliability diagram, the picture behind
     "calibrated forecasting models". It's labelled a schematic so nobody
     mistakes it for results. The Kairos entry points back to it in the
     margin ("calibrated ✓ cf. fig. 1"), the way a notebook cross-references
     itself.
   - *Fig. 2, the route* (experience). CentraleSupélec → Renault (Guyancourt)
     → Libertify → Kairos (Paris), drawn **to scale** from real coordinates:
     an equirectangular projection around 48.78°N at 18 px per km, a
     graticule in degrees, a 5 km scale bar, a north arrow. The "21 km as
     the crow flies" note is computed from those coordinates, not typed in.
   - *Fig. 3, a convolution* (education, beside the Computer Vision & AI
     degree). A 3×3 kernel on a 6×6 input making one cell of a 4×4 feature
     map, which is arithmetically right (6 − 3 + 1 = 4, stride 1, no
     padding). The degree is presented as what it is, an AI engineering
     degree; the coursework list is plain text with no themed decoration.
3. **Handwriting only for marginal notes of a few words**, the way an ML
   engineer annotates their own work ("predicted = observed",
   "calibrated ✓", "stride 1, no padding"). Never for headings or body text.
4. **Texture, not props.** A faint paper grain and ink-quality lines. No
   tape, stains, burnt or torn edges, clips or leather. Photographs are
   "mounted" with a pale mat, a hairline and a soft shadow, not taped in or
   tilted.
5. **The typography stays a book's.** Headings, body and metadata are set
   like a serious publication; only the marginalia carry the hand.

The test used in every review pass was: *would a quant fund or an AI lab
recruiter take this page seriously?* If a detail only makes sense as
decoration, it goes.

### 11.2 Colour as real materials

Each token is named after a material, which keeps the palette honest: you
only add a colour if there's a physical reason for it to be on the page.

| Token | Light (paper) | Dark (lamplight) | Role |
| --- | --- | --- | --- |
| `--paper` | `#E6E7DC` grey-green bone | `#1A1915` warm umber | Page |
| `--paper-deep` | `#DEDFD3` | `#24221D` | Figure plates |
| `--mat` | `#F0F0E9` | `#2C2A24` | Photo mounts |
| `--ink` | `#1B2331` iron-gall blue-black | `#E6DFCE` parchment ink | Text, lines |
| `--graphite` | `#555B5E` pencil | `#A69E8F` | Secondary text, metadata |
| `--accent` | `#8A2D33` oxblood | `#C58A82` faded rose | Correction ink: active nav, underlines, circled figures, notes, errors |
| `--pencil` | `#8E8F88` | `#625E54` | Construction lines only (never text) |

Why these:

- **Paper** isn't the generic "AI cream" (`#F4F1EA`). It leans grey-green,
  like bone or archival notebook stock, so it reads as a material rather
  than as "beige website".
- **Ink** is blue-black, like iron-gall ink, which oxidises to that colour.
  Pure black on warm paper looks printed; blue-black looks written.
- **Graphite** is a neutral pencil grey, used for everything secondary.
- **One accent**, oxblood, used the way an editor uses red ink: to mark,
  correct and point. A single accent with a clear job is what keeps colour
  from becoming decoration. (Terracotta was ruled out on purpose: it's the
  current default "warm" accent and would make the site look generated.)

Contrast ratios (WCAG 2.x formula; AA needs 4.5:1 for body text, 3:1 for
large text and UI):

| Pair | Light | Dark |
| --- | ---: | ---: |
| ink on paper | 12.6:1 | 13.2:1 |
| graphite on paper | 5.5:1 | 6.6:1 |
| accent on paper | 6.7:1 | 6.1:1 |
| ink on plate (`paper-deep`) | 11.7:1 | 12.0:1 |
| graphite on plate | 5.1:1 | 6.0:1 |
| accent on plate | 6.2:1 | 5.6:1 |
| paper on ink (submit button) | 12.6:1 | 13.2:1 |
| paper on accent (button hover) | 6.7:1 | 6.1:1 |
| pencil on paper | 2.6:1 | 2.7:1 → decorative lines only |

Everything that is text passes AA. `pencil` is deliberately below 3:1 and is
only used for construction lines (the dashed diagonal, the map grid), which
are not needed to understand the figure.

### 11.3 The lamplight theme: how the dark mode was derived

Inverting a light palette gives white text on black, which glares, and turns
every colour into its complement. Instead the dark theme asks: *what does
the same journal look like by lamplight?*

- **Paper** becomes a warm umber near-black (`#1A1915`): the page in shadow,
  still slightly warm, never pure black.
- **Ink** becomes a pale parchment (`#E6DFCE`), not white. Light text on a
  dark page needs less contrast than the reverse to feel equally strong, and
  13:1 is plenty.
- **Graphite** is lifted and warmed (`#A69E8F`) to stay above 6:1.
- **Accent** keeps its hue family but is desaturated and lightened
  (`#C58A82`): saturated red on dark backgrounds vibrates; a faded rose reads
  as the same correction ink under warm light.
- **The lamp**: a very faint radial glow at the top of the page
  (`rgb(255 210 140 / 0.06)`), as if the light falls on the open book.
- **Photographs** are dimmed (`brightness(0.86)`) so they don't punch holes
  in the dark page, and the grain switches to sparse light specks.

All of it is the same token names redefined under
`@media (prefers-color-scheme: dark)`, so no component has dark-mode code.
Because the tokens are RGB channels, `border-ink/20` etc. keep working in
both themes.

### 11.4 The type pairing

| Role | Family | Why |
| --- | --- | --- |
| Display (headings, name) | **Libre Caslon Display** | Caslon is the classic English book face. The Display cut has sharp, high-contrast serifs drawn for large sizes: presence without weight. |
| Text (body) | **Libre Caslon Text** | The same family cut for reading: larger x-height and sturdier hairlines, comfortable at 17–18 px on screen. |
| Metadata (dates, figures, labels) | **IBM Plex Mono** | The lab-notebook layer. Neutral, slightly typewriter-like, with figures that line up. |
| Marginalia | **La Belle Aurore** | A fine-nibbed, grown-up hand. |

Pairing a Display and a Text cut **of the same family** is the safest way to
get contrast (sizes, hairlines) without conflict (letter shapes). The mono
is the deliberate counterpoint: everything machine-like (a date, an index,
"FIG. 2") is mono; everything human is serif.

How the hand was chosen: about a dozen handwriting faces were rendered side
by side with the same note in the accent colour. Comic Neue, Caveat, Indie
Flower, Patrick Hand and Gloria Hallelujah were excluded up front (they read
as playful). Of the rest, Nanum Pen Script and Kalam looked like marker
pens, Reenie Beanie and Over the Rainbow too casual, Homemade Apple and
Zeyada hard to read. La Belle Aurore and Cedarville Cursive looked like an
adult writing quickly with a fine pen; La Belle Aurore won on legibility.
It is still only used for a handful of words. Labels inside figures stay in
mono, because careful people write those carefully.

Engraved caps (`.caps`: the text serif, uppercase, 0.22em tracking) give the
title-page voice for "Field notes of", "Entry II" and "Colophon".

**The scale** keeps the fluid `clamp()` method from section 2 but with a
quieter ratio, as books are quieter than magazines: **1.2 at 360 px, 1.25 at
1440 px**, body 17 → 18 px.

| Token | 360 px | 1440 px | `clamp()` |
| --- | ---: | ---: | --- |
| `step--1` | 13 | 13 | `0.8125rem` (labels) |
| `step-0` | 17 | 18 | `clamp(1.0625rem, 1.0417rem + 0.0926vw, 1.125rem)` |
| `step-1` | 20.4 | 22.5 | `clamp(1.275rem, 1.231rem + 0.194vw, 1.406rem)` |
| `step-2` | 24.5 | 28.1 | `clamp(1.53rem, 1.454rem + 0.338vw, 1.758rem)` |
| `step-3` | 29.4 | 35.2 | `clamp(1.836rem, 1.716rem + 0.535vw, 2.197rem)` |
| `step-4` | 35.3 | 44 | `clamp(2.203rem, 2.022rem + 0.806vw, 2.747rem)` |
| `step-5` | 42.3 | 54.9 | `clamp(2.644rem, 2.381rem + 1.169vw, 3.433rem)` |
| `display` | 48 | 120 | `clamp(3rem, 1.5rem + 6.667vw, 7.5rem)` (the name only) |

### 11.5 How rough.js draws by hand, and why the randomness is seeded

[rough.js](https://roughjs.com) takes an exact shape (a line, an ellipse, a
curve through points) and returns the path a hand would draw: endpoints
overshoot slightly, straight lines bow, and by default each stroke is drawn
twice with small differences, like a pen going over a line. The amount is
controlled by `roughness` and `bowing`.

All of that comes from random numbers. If those were truly random, the
drawing would change on every render: the server's HTML wouldn't match the
browser's (a hydration mismatch), the page would "jitter" between visits,
and screenshots and visual tests would never be stable. So every shape gets
a **`seed`**: rough.js then uses a deterministic pseudo-random generator, and
the same seed always produces the same wobble. Change the seed to get a
different but equally stable drawing.

Only rough.js's **generator** is used (`src/lib/rough.ts`). It is pure
maths: shape in, SVG path data (`d` strings) out, no DOM. So every sketch is
computed in a server component at build time and the browser receives plain
`<path>` elements and zero JavaScript for the drawings. (This is also why the
contact section is now a server component with only the form as a client
component: a client component importing the hand-drawn header would have
shipped rough.js to the browser.)

Two tricks make one drawing fit any width:

- `preserveAspectRatio="none"` lets a rule drawn in a 1000×8 box stretch to
  any column width;
- `vector-effect="non-scaling-stroke"` keeps the pen width constant while
  the shape stretches.

The figures that are data (the map, the convolution grid, the calibration
axes) are computed from their real inputs, so they can't drift from the
truth: change a coordinate and the drawing, the distance note and the scale
all follow.

**Ink drawing itself.** Every rough path has `pathLength="1"`, which tells
the browser to treat its length as 1 whatever its real length. A dash
pattern of `1 1` offset by `1` then hides the whole stroke, and animating
`stroke-dashoffset` from 1 to 0 draws it from start to end. `<InkDraw>` (a
tiny client component) flips `data-ink` from `pending` to `drawn` the first
time the figure scrolls into view, so it happens once. The hiding only
applies under `prefers-reduced-motion: no-preference`; with reduced motion
the sketch is simply there, and a `<noscript>` style shows it when
JavaScript is off.

### 11.6 Paper texture from SVG noise

The grain is an SVG used as a CSS background, about 500 bytes, inlined as a
data URL in the `--grain` token:

```xml
<filter id="g">
  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
  <feColorMatrix values="0 0 0 0 0.2   0 0 0 0 0.22   0 0 0 0 0.2   0 0 0 0.2 0"/>
</filter>
<rect width="100%" height="100%" filter="url(#g)"/>
```

- `feTurbulence` generates Perlin-style noise. `fractalNoise` with a high
  `baseFrequency` gives fine fibres rather than clouds; `numOctaves` adds
  detail; `stitchTiles` makes the tile edges match so it repeats seamlessly.
- `feColorMatrix` throws away the noise's colours (the first three rows set
  R, G, B to a fixed grey-green) and keeps its alpha, scaled down (the last
  row, `0.2`). The result is faint specks of one colour whose density
  follows the noise.
- It's tiled at 220 px as `background-image` on `body`, so it scrolls with
  the page like a sheet, sits under the text and costs no image request.
  In the dark theme the same filter makes pale specks at `0.07`.

No photographic paper texture, no big JPEG: texture you notice only when you
look for it is the difference between "paper" and "paper effect".

### 11.7 What lives where

```
src/app/globals.css               tokens (materials, scale), grain, .mounted, .plate, .caps, .hand, motion
src/lib/rough.ts                  seeded rough.js helpers (server only)
src/components/ink.tsx            InkRule, Circled, Underlined, Strokes
src/components/ink-draw.tsx       draw-once animation trigger (client)
src/components/sketches/          calibration.tsx (Fig. 1), route-map.tsx (Fig. 2), convolution.tsx (Fig. 3)
src/components/section-header.tsx "Entry II" header; numerals follow `navigation` order
src/components/contact.tsx        contact section (server) + contact-form.tsx (client)
```

On phones the margin annotations fall inline under the entry text, the map
becomes a vertical route (an ordered list, which also serves screen readers
on desktop, where the drawing is `aria-hidden`), and the spreads stack
image-first.

The hero's line illustration (`personalData.heroImage`) is no longer shown:
its place is taken by Fig. 1, which says something specific about the work.
The asset and the data field are left untouched.
