# Oumaima Chater · AI Engineer Portfolio

The personal portfolio site of Oumaima Chater, an AI engineer. It presents
skills, experience, education and projects (each with its own detail page),
and has a contact form that emails messages straight to her inbox.

## Stack

- **[Next.js 15](https://nextjs.org)** (App Router) with **React 18** and **TypeScript**
- **[Tailwind CSS](https://tailwindcss.com)** with a few **[shadcn/ui](https://ui.shadcn.com)** components (Radix UI primitives)
- **[lucide-react](https://lucide.dev)** icons
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
    layout.tsx            Root layout: fonts, header, footer
    page.tsx              Home page (all sections)
    projects/[id]/        Project detail pages
    actions.ts            Contact form Server Action (validation + Resend)
    globals.css           Tailwind layers and theme variables
  components/             Page sections (header, skills, experience, contact, ...)
    ui/                   shadcn/ui primitives (button, card, input, ...)
  hooks/                  React hooks (toast)
  lib/
    data.ts               All site content: bio, projects, experience, skills
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
