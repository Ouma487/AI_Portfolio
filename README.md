# Oumaima Chater · AI Engineer Portfolio

The personal portfolio site of Oumaima Chater, an AI engineer. It presents
skills, experience, education and projects (each with its own detail page),
and has a contact form that emails messages straight to her inbox.

## Stack

- **[Next.js 15](https://nextjs.org)** (App Router) with **React 18** and **TypeScript**
- **[Tailwind CSS](https://tailwindcss.com)** with a small token system (see `docs/notes/frontend.md`)
- **next/font** with Libre Caslon (Display + Text), IBM Plex Mono and La Belle Aurore
- **[rough.js](https://roughjs.com)** to generate the hand-drawn ink sketches at build time
- **Server Actions** + **[zod](https://zod.dev)** validation for the contact form
- **[Resend](https://resend.com)** to deliver contact form email

## Getting started

```bash
npm ci
cp .env.example .env.local   # then fill in RESEND_API_KEY and CONTACT_EMAIL
npm run dev                  # http://localhost:9002
```

The site works without the env vars; only the contact form needs them (it
shows a friendly error and logs the missing variable on the server otherwise).

## Scripts

| Command             | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Dev server with Turbopack on port 9002                   |
| `npm run build`     | Production build (fails on type or lint errors)          |
| `npm start`         | Serve the production build                               |
| `npm run lint`      | ESLint (`next/core-web-vitals`)                          |
| `npm run typecheck` | TypeScript check without emitting files                  |

## Project structure

```
src/
  app/
    layout.tsx            Root layout: fonts, metadata, skip link, header, footer
    page.tsx              Home page (sections in `navigation` order)
    projects/[slug]/      Project case-study pages + their OG images
    opengraph-image.tsx   Generated social preview image (next/og)
    sitemap.ts, robots.ts sitemap.xml and robots.txt
    actions.ts            Contact form Server Action (validation + Resend)
    globals.css           Design tokens (type scale, grid, paper/ink palette, grain) and motion
  components/
    sections/             Home page sections (hero, projects, experience, ...)
    contact.tsx           Contact section and form (client component)
    site-header.tsx       Sticky nav, active section, mobile menu
    site-footer.tsx       Footer
    section-header.tsx    The shared "Entry II" journal-entry header
    ink.tsx, ink-draw.tsx Hand-drawn rules, circles and underlines; the draw-once animation
    sketches/             Fig. 1 calibration, Fig. 2 route map, Fig. 3 convolution
  lib/
    data.ts               All site content: bio, projects, experience, skills
    site.ts               Derived values: site URL, sorted experience, section numbers
    og.tsx                Shared renderer for Open Graph images
    rough.ts              Seeded rough.js helpers (pure maths, runs on the server)
    utils.ts              cn() class-name helper
public/                   Images, icons, logos and the CV PDF
docs/
  DEPLOYMENT.md           How to deploy (Vercel, Firebase App Hosting, Resend, domain)
  notes/                  Explanations of technical decisions
apphosting.yaml           Firebase App Hosting config (env vars and secrets)
.env.example              Template for the required environment variables
```

To change the text of the site (projects, experience, skills...), edit
`src/lib/data.ts`.

## Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for a step-by-step guide:
running locally, deploying on Vercel (recommended) or Firebase App Hosting,
configuring Resend, adding a custom domain, and a post-deploy checklist.
