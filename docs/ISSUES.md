# Review findings (issue drafts)

These were meant to be GitHub issues. Creating them failed because the Claude GitHub App doesn't have
the Issues permission on this repository. Once it's granted, each section can be copied into its own issue.
Status shows what the overhaul on `claude/vibrant-einstein-vsn9f3` addressed.

## 1. Contact form says "sent" when sending failed, and puts visitor input into the email HTML unescaped — bug
- `resend.emails.send()` reports failures in the returned `{ data, error }` instead of throwing, so the `catch` block never runs and the visitor sees a success message.
- `name`, `email`, `website` and `message` are interpolated into the email HTML without escaping (HTML injection).
- No length limits, no URL validation for `website`, no honeypot, and raw user input in the subject line.

## 2. ~11 MB of raster photos wrapped in SVG, and fragile file names — performance
- `01.svg` to `04.svg` and `me.svg` each embed a 1–3 MB base64 raster. `next/image` can't resize them.
- `girl banner 1.svg` and `CV_Oumaima_Chater (2).pdf` have spaces and parentheses in their names. The resume path is duplicated in `header.tsx`.

## 3. Project pages: empty "Key Features", rendered on every request, inconsistent LinkedIn URL — bug
- `keyFeatures` is `{ left: [], right: [] }` for every project.
- `/projects/[id]` is a client component with no `generateStaticParams`.
- `contact.tsx` links to `/in/oumaimachater`; everywhere else uses `/in/oumaima-chater`.

## 4. Build hygiene — chore
- `ignoreBuildErrors` hides 3 TypeScript errors.
- Unused leftovers: genkit, firebase, nodemailer, recharts, `src/ai/`, most of `components/ui/`.
- The README is the Firebase Studio template.

## 5. Design refresh and accessibility — enhancement
- The site needs a distinctive editorial identity instead of template defaults.
- Accessibility: two `<main>` landmarks, `target="_blank"` links without `rel`, focus states, alt text.
- The footer shows "@2025". Metadata and Open Graph tags are missing.

## 6. Deployment docs and environment variables — docs
- Add `.env.example`, `docs/DEPLOYMENT.md` (Vercel and Firebase App Hosting) and notes on the Resend sender limitation.
