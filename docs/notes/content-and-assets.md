# Content and assets: what changed and why

These notes explain the clean-up of images, the resume and the content model,
and the ideas behind each change. They're written to teach the concepts, not
just list the diff.

---

## 1. Raster vs vector, and why "an SVG with a PNG inside" is the worst of both

There are two ways to describe an image.

**Raster** images (PNG, JPEG, WebP, AVIF) are a grid of pixels. A 1920×1080
photo stores about 2 million colour values. They're the right format for
photos and anything with soft gradients, noise or texture. They have a fixed
resolution: blow one up and it goes blurry; shrink it and you're sending pixels
nobody sees.

**Vector** images (SVG) are drawing instructions: "move here, draw a curve to
there, fill it black". Size depends on how complicated the drawing is, not on
how large it's displayed. They stay sharp at any size and are tiny for flat
shapes, icons, logos and line illustrations.

`public/images/hero-illustration.svg` is a real vector: 39 `<path>` elements
and nothing else, 13.8 KB, sharp on any screen. It stays an SVG.

The project images and the portrait were different. Figma exported them as
SVG files, but inside each one was this:

```xml
<rect width="588" height="331" rx="40" fill="url(#pattern0)"/>
<pattern id="pattern0" ...><use xlink:href="#image0" .../></pattern>
<image id="image0" width="1920" height="1080"
       xlink:href="data:image/png;base64,iVBORw0KGgo..."/>
```

So the "vector" was a rounded rectangle filled with a full-size PNG photo,
written out as base64 text. That combines the downsides of both formats:

- **Still a raster.** It's the same pixel grid. It doesn't get sharper when
  scaled, so you gain nothing from SVG.
- **Bigger than the raster itself.** Base64 encodes every 3 bytes of binary as
  4 text characters, so the file is about 33% larger than the PNG it contains
  (01.png was 1.75 MB; wrapped, 2.34 MB).
- **PNG is the wrong codec for photos.** PNG is lossless, which is ideal for
  screenshots and flat art but very heavy for photographic content.
- **No optimisation possible.** Next.js's image optimizer doesn't resize SVGs
  (it can't know there's a photo inside), so every visitor, on any screen,
  downloaded the full 1920px image.
- **Can't be cached or decoded separately.** The browser has to parse the
  whole XML document before it can even start decoding the picture.

### What the wrapper was actually doing

Before throwing the wrapper away I checked what it did to the picture, so the
new files look the same as the old ones did:

| File | Wrapper effect | What I did |
| --- | --- | --- |
| 01 | Rounded corners (`rx="40"`), image fills the rect | Nothing; rounding is CSS's job |
| 02 | Rect starts at `x="-12"`, so the left 12/606 of the image is off-canvas | Cropped 38 px off the left |
| 03 | `transform="matrix(-1 0 0 1 586 0)"` mirrors the rect *and its fill* | Flipped horizontally |
| 04 | Mirrored like 03, and 2 units wider than the canvas | Trimmed 6 px, then flipped |
| me | `rx="12"`, a 4 px black stroke, a 0.18° rotation | Nothing; border and rounding are CSS |

Rounded corners and borders are presentation, not content. Baking them into
the image would make every future redesign fight the asset. In CSS it's one
line (`rounded-[40px]` or `border-4 border-black` in Tailwind).

---

## 2. How WebP and `srcset` cut the bytes

### Step 1: a better codec at a sensible size

I extracted each embedded image, applied the crop/flip above, scaled it to a
maximum width (1600 px for projects, 1000 px for the portrait) and encoded it
as WebP at quality 80 with [`sharp`](https://sharp.pixelplumbing.com/).

WebP's lossy mode works like JPEG but better: it predicts each block of pixels
from its neighbours and stores only the difference, then throws away detail
the eye is least sensitive to (fine colour variation, high-frequency noise).
Quality 80 is the usual sweet spot where artefacts are hard to spot.

| Asset | Before | After | Change |
| --- | ---: | ---: | ---: |
| `images/01.svg` → `images/projects/predictive-maintenance.webp` | 2,337,726 B | 36,708 B | −98.4% |
| `images/02.svg` → `images/projects/news-moodmap.webp` | 3,234,462 B | 129,938 B | −96.0% |
| `images/03.svg` → `images/projects/rl-urban-driving.webp` | 2,506,225 B | 76,416 B | −97.0% |
| `images/04.svg` → `images/projects/robot-waste-mission.webp` | 2,027,853 B | 66,412 B | −96.7% |
| `images/me.svg` → `images/portrait.webp` | 1,086,699 B | 63,872 B | −94.1% |
| `logos/logo_t.png` (1024×1024) → `logos/oc-monogram.webp` (256×256) | 1,319,974 B | 7,058 B | −99.5% |
| `logos/renault.svg` (PNG in SVG) → `logos/renault.webp` | 76,624 B | 7,302 B | −90.5% |
| `logos/libertify.svg` (PNG in SVG) → `logos/libertify.webp` (lossless) | 10,505 B | 4,314 B | −58.9% |
| `images/girl banner 1.svg` → `images/hero-illustration.svg` | 13,797 B | 13,797 B | renamed only |
| **Total** | **12.61 MB** | **0.41 MB** | **−96.8%** |

The logos are shown at 32–40 px, so 3× that (≈128 px) is plenty even for
high-density screens. The OC monogram was a 1024 px PNG for a 40 px slot.

### Step 2: let `next/image` serve the right size to each screen

The files above are the *masters*. Visitors usually get something smaller.
When you write:

```tsx
<Image src={project.image.src} width={1600} height={900}
       sizes="(min-width: 768px) 50vw, 100vw" alt={project.imageAlt} />
```

Next.js renders an `<img>` with a `srcset`, a list of candidate URLs at
different widths:

```html
srcset="/_next/image?url=%2Fimages%2Fportrait.webp&w=640&q=75 640w,
        /_next/image?url=%2Fimages%2Fportrait.webp&w=828&q=75 828w,
        /_next/image?url=%2Fimages%2Fportrait.webp&w=1080&q=75 1080w, ..."
```

The browser combines `sizes` ("this image will be half the viewport wide on
desktop, full width on mobile") with the screen's width and pixel density, and
downloads only the one candidate it needs. The optimizer resizes on the first
request, caches the result and picks WebP or AVIF based on what the browser
supports.

Measured from the production build (`Accept: image/webp`):

| Requested width | `portrait.webp` | `news-moodmap.webp` |
| ---: | ---: | ---: |
| 384 | 13.2 KB | 15.1 KB |
| 640 | 26.0 KB | 31.1 KB |
| 828 | 35.4 KB | 44.2 KB |
| 1080 | 51.9 KB | 61.4 KB |

A phone loading the old site downloaded 2–3 MB per project image. It now gets
roughly 15–45 KB. Passing real `width`/`height` (stored in `data.ts`) also lets
the browser reserve the right space before the image arrives, so the page
doesn't jump around as it loads (that's what Cumulative Layout Shift measures).

---

## 3. Why a single source of truth for content

Before this change the LinkedIn URL was typed out in three places, and they
disagreed: `data.ts` and the hero used `linkedin.com/in/oumaima-chater`, but
`contact.tsx` used `linkedin.com/in/oumaimachater`. The contact button pointed
at the wrong profile and nobody would notice until a recruiter clicked it. The
email address was hard-coded in four places, and the resume path in two (one
of them a file name with a space and brackets in it).

Now `src/lib/data.ts` holds everything:

```ts
personalData.socials       // GitHub, LinkedIn, email: defined once
getSocial('linkedin')?.url // how components read them
personalData.resumeUrl     // '/resume/oumaima-chater-cv.pdf'
```

The benefits:

- **One edit, everywhere.** Change a URL once and every button updates.
- **Types catch mistakes.** `Project`, `Experience` etc. are TypeScript types.
  Forget a project's `imageAlt` and the build tells you.
- **Design and content evolve separately.** A redesign can replace every
  component without touching a word of copy, and a copy edit can't break
  layout.
- **The CV and the site stay in sync.** I checked every fact in `data.ts`
  against the CV PDF and the original site text; nothing new was invented.
  Where they disagreed on dates or the degree title, the CV (the newer
  document) wins. One exception: the Renault role keeps the more specific
  "AI & Data Mining Intern" from the site, where the CV says "AI Intern".

`data.ts` deliberately contains no React components (the old version imported
icons from `lucide-react`). Each social link has a `kind` (`'github'`,
`'linkedin'`, `'email'`) and the UI decides which icon to draw. That keeps the
data file plain, importable from server components, and easy to reuse (e.g. for
page metadata or a JSON-LD profile later).

---

## 4. Why URL-safe file names matter

URLs can only contain a limited set of characters. Anything else, including a
space, must be **percent-encoded**: replaced by `%` plus its byte value in hex.
A space is `0x20`, so:

```
/images/girl banner 1.svg        → /images/girl%20banner%201.svg
/pdfs/CV_Oumaima_Chater (2).pdf  → /pdfs/CV_Oumaima_Chater%20(2).pdf
```

It gets worse when a URL is put *inside* another URL, which is exactly what
`next/image` does:

```
/_next/image?url=%2Fimages%2Fgirl%2520banner%25201.svg
```

Here `/` became `%2F` and the already-encoded `%20` was encoded again to
`%2520`. Each layer that forgets (or repeats) the encoding is a chance for a
404. Other problems with names like that:

- Pasted into an email or chat, a URL with a space often gets cut at the space.
- `(2)` in `CV_Oumaima_Chater (2).pdf` is what your OS adds to a duplicate
  download. It's what visitors see as the file name when they save your CV.
- Case-sensitive servers (Linux, most hosting) treat `Me.svg` and `me.svg` as
  different files, while macOS doesn't, so a site can work locally and break
  when deployed.

The convention used now: **lowercase, ASCII, words separated by hyphens, named
by meaning**: `images/projects/predictive-maintenance.webp`,
`resume/oumaima-chater-cv.pdf`. The project images also match the project
`slug`, so the URL `/projects/predictive-maintenance` and its image are
obviously related. Names like `01.svg` say nothing and break as soon as the
order changes.

---

## 5. How the case-study structure makes a project page persuasive

The old projects had one long paragraph each and an empty `keyFeatures`
object, so the project pages showed a title, a paragraph, and two empty boxes.

A reviewer (recruiter, hiring manager, engineer) skims. They want to know,
fast: *what was the problem, what did you do, did it work, and could you do it
for us?* So each `Project` now follows the shape of a case study:

| Field | Answers | Example (predictive maintenance) |
| --- | --- | --- |
| `tagline` | What is it, in one line? | "Predicting electrolyzer failures from early voltage signals, without waiting for endurance tests." |
| `highlights` | Did it work? (numbers only) | `90.8%` accuracy across sites |
| `summary` | The 20-second version | 2–3 sentences for cards |
| `context` | Why did it matter? | Failures were only found through costly endurance tests; data came from several sites |
| `approach[]` | What did you actually do? | Detrend → GAF/MTF images → hybrid CNN–VAE with domain adaptation → counterfactual visuals |
| `results[]` | What came out of it? | 90.8% accuracy; endurance tests no longer needed; Prix de l'innovation Dzung Tran |
| `stack[]` | Which tools? | Python, PyTorch, VAE, CNN… |
| `partner`, `award`, `period` | Credibility | Genvia (CEA, SLB, Vinci, Vicat, Occitanie) |

Why this works:

- **Problem before solution.** "Hybrid CNN–VAE with domain adaptation" means
  little until you know there was a costly test to replace and data from
  several sites that didn't look alike. Context makes the technique look like
  a decision rather than a buzzword.
- **Lists are scannable.** `approach` and `results` are arrays so the design
  can show them as steps or bullets, not a wall of text.
- **Numbers are separated and real.** `highlights` holds only measured values
  (90.8%, 3.5×, 0 deadlocks). The design can make them large and prominent,
  which is only honest if every number is real, so projects without
  measurements (News MoodMap) have an empty list instead of a made-up one.
- **Stable URLs.** Pages live at `/projects/<slug>` (e.g.
  `/projects/robot-waste-mission`) instead of `/projects/04`. The URL tells
  people what they're opening and doesn't change if projects are reordered.
  The pages are pre-rendered at build time with `generateStaticParams`, and
  each gets its own `<title>` and social preview from `generateMetadata`.

### Keeping it honest

Every statement in `data.ts` comes from the CV PDF or the original site copy.
If you add something, add the source first (update the CV), then the data
file. Things I deliberately left out because no source supports them:
an "availability" line, a year for News MoodMap and the RL project, and any
metric for News MoodMap.
