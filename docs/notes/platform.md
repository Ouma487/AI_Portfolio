# Platform notes: what changed and why

These notes explain the platform, security and build changes made to the
portfolio. Each section starts with the general idea, then shows how it
applies to this code. The goal is that you could make the same decisions on
your next project without needing these notes.

---

## 1. The contact form

The form lives in `src/components/contact.tsx` (what the visitor sees) and
`src/app/actions.ts` (what runs on the server when they press the button).

### 1.1 Errors as values vs. thrown errors

There are two common ways for a function to say "this failed".

**Throwing.** The function stops and an exception travels up the call
stack until some `try/catch` handles it. If you forget the `catch`, the
program crashes loudly, which at least makes the failure visible.

```ts
try {
  await sendEmail();      // throws if something goes wrong
} catch (err) {
  showError();
}
```

**Returning the error as a value.** The function always returns normally,
and the result contains either the data or an error description. Nothing
crashes; it is up to you to look at the result.

```ts
const { data, error } = await resend.emails.send({ ... });
if (error) {
  showError();
}
```

Both styles are valid, but they don't mix well. The Resend SDK uses the
second style: an invalid API key, a recipient Resend refuses, or a rate
limit all come back as `{ data: null, error: {...} }`. The old code only had
a `try/catch`, so in all of those cases the `catch` never ran and the visitor
was told "Your message has been sent successfully!" while no email was sent.
That is the worst kind of bug: silent, and it loses messages from people who
wanted to reach you.

The fix checks `error` explicitly and returns a failure state. The
`try/catch` stays too, because network failures (DNS problems, timeouts)
still throw. Rule of thumb: **read the docs for how a library reports
failure, and handle that exact mechanism.**

### 1.2 HTML injection

The notification email is HTML that the code builds by pasting the
visitor's input into a template:

```ts
`<p><strong>Name:</strong> ${name}</p>`
```

Whatever the visitor types becomes part of the HTML, and the email client
renders it. That is **HTML injection**: the attacker controls markup in a
document you trust. For example, someone could type this as their message:

```html
Hi! Your account has an issue.
<a href="https://evil.example/login" style="font-size:24px;color:red">
  Click here to verify your Resend account
</a>
<div style="display:none">
```

In your inbox, that shows a big official-looking link inside an email that
genuinely came from your own portfolio, which makes phishing much more
convincing. The trailing `<div style="display:none">` hides everything after
it, including the footer. Most email clients block `<script>`, but links,
images (which can track when you open the mail), fake forms and layout
tricks all work.

The fix is **escaping**: before inserting text into HTML, replace the
characters HTML treats as syntax with their "entity" equivalents.

| Character | Becomes  |
| --------- | -------- |
| `&`       | `&amp;`  |
| `<`       | `&lt;`   |
| `>`       | `&gt;`   |
| `"`       | `&quot;` |
| `'`       | `&#39;`  |

After escaping, `<a href=...>` arrives as the text `&lt;a href=...&gt;`, which
the email client displays literally as `<a href=...>` instead of creating a
link. The `escapeHtml` helper in `actions.ts` does this, and every
user-supplied value goes through it. (`&` must be replaced first, otherwise
you would turn the `&` of `&lt;` into `&amp;lt;`.)

This is the same idea behind SQL injection and cross-site scripting: **data
must never be interpreted as code**. React does this escaping for you
automatically when you write `{value}` in JSX, which is why it rarely comes
up in components. It comes up here because the email is built from a raw
string.

The email also gets a plain-text version (`text`). Plain text has no markup,
so no escaping is needed there, and many spam filters score emails with only
HTML as more suspicious.

### 1.3 The subject line and header injection

Email headers (`Subject:`, `To:`, `Reply-To:`...) are lines of text separated
by line breaks. If a visitor could put a line break into the subject, older
or careless mail software could treat what follows as a new header, e.g.
`Bcc: thousands@of.victims`. That is **header injection**. Resend's API is
not a raw SMTP connection, so the real risk is low, but stripping `\r` and
`\n` costs nothing and protects against it. The subject is also capped at
120 characters, because a 5,000-character subject is never legitimate.

### 1.4 Reply-To

The email is sent *from* `onboarding@resend.dev` (a Resend address), not from
the visitor, because you can only send from addresses you have proved you
own. Without extra configuration, pressing Reply would answer Resend.
Setting `replyTo` to the visitor's address tells mail clients "send replies
here instead", so Reply just works.

### 1.5 Validation limits with zod

zod describes the expected shape of the form data and checks it on the
server. The browser's `required` attributes are only a convenience: anyone
can bypass them by sending a request directly, so **the server must validate
everything again.**

New limits:

- `name`: 1 to 100 characters
- `email`: a valid address, at most 254 characters (the maximum length of an
  email address)
- `message`: 10 to 5,000 characters. The minimum filters out "hi" and empty
  spam; the maximum stops someone from posting a novel or a huge payload.
- `website`: optional. An empty string is accepted (the field is empty when
  untouched), otherwise it must be a valid `http://` or `https://` URL. The
  protocol check rejects things like `javascript:alert(1)`, which is
  technically a valid URL.

Limits are a security habit: every input without a maximum size is an
invitation to send something huge.

Each failing field returns its own message, so `contact.tsx` now also shows
the `website` error, plus the general message (e.g. "temporarily
unavailable") when the failure is not tied to a field.

### 1.6 The honeypot

Spam bots that crawl the web fill in every field of every form they find,
then submit. A **honeypot** exploits this: add a field that people never see,
so a human leaves it empty and a bot usually fills it.

In `contact.tsx` there is a `company` input, moved off-screen, with:

- `tabIndex={-1}` so keyboard users don't tab into it
- `autoComplete="off"` so the browser's autofill doesn't fill it for real users
- `aria-hidden` on its wrapper so screen readers skip it

On the server, if `company` has a value, the action returns a **fake
success** without sending anything. Faking success matters: if the bot got
an error, its operator could notice and adapt. A honeypot doesn't stop a
targeted attacker, but it removes most automated spam with no CAPTCHA and no
friction for real visitors.

### 1.7 Creating the client lazily and handling missing config

The old code ran `new Resend(process.env.RESEND_API_KEY)` at the top of the
file, which happens as soon as the module is loaded, even during the build.
If the variable was missing, the failure showed up somewhere confusing (or
emails silently went nowhere since `to` was `undefined`).

Now the action reads both env vars when a message is actually submitted. If
either is missing it:

1. logs a clear message on the server, naming the missing variable, so you
   see it in your host's logs, and
2. tells the visitor the form is temporarily unavailable and suggests
   emailing directly.

The client is created on first use and then reused. General principle:
**fail at the place where you can explain the problem**, and never show
internal details (like "RESEND_API_KEY missing") to visitors.

### 1.8 Why the key is safe on the server

`actions.ts` starts with `'use server'`. Next.js keeps that code on the
server; the browser only gets a reference it can call. So
`process.env.RESEND_API_KEY` is read on the server and never ends up in the
JavaScript visitors download. Only variables whose name starts with
`NEXT_PUBLIC_` are copied into browser code, which is why the key must never
get that prefix.

---

## 2. Build hygiene

### 2.1 Why type checking at build time matters

TypeScript catches mistakes like calling a function with the wrong
arguments, misspelling a property, or forgetting that a value might be
`undefined`, before the code runs. But it only helps if something forces you
to look at the errors.

`next.config.ts` had `typescript.ignoreBuildErrors: true` and
`eslint.ignoreDuringBuilds: true`. Those settings tell Next.js "build and
deploy even if the type checker or linter found problems". It is like having
a smoke detector with the battery removed: things look calm until there's a
fire. Errors pile up, and one day a real bug ships because it was hidden
among known ones.

Both options are removed, so `npm run build` now fails on a type or lint
error and a broken version can't be deployed.

The existing errors were small:

- In `header.tsx`, `handleLinkClick = (e, href) => ...` had no types, so
  TypeScript treated both as `any` (which disables checking). They are now
  `React.MouseEvent<HTMLAnchorElement>` and `string`.
- In `tailwind.config.ts`, `textStrokeColor: theme => theme('colors')` was
  actually a bug hidden by `any`: Tailwind passes an *object* containing a
  `theme` function, not the function itself. Typing it forced the correct
  form, `({ theme }) => theme('colors')`.

This is the typical payoff: adding types often uncovers real bugs, not
just "type noise".

### 2.2 Linting

A linter reads code looking for patterns that are likely mistakes (React
hooks used conditionally, `<img>` instead of the optimized `<Image>`,
unescaped characters in JSX...). The project had no ESLint config, so
`next lint` would stop and ask interactive questions, which breaks automated
builds. A minimal `.eslintrc.json` extending `next/core-web-vitals` (the
rules Next.js recommends) plus the `eslint` and `eslint-config-next`
packages make it run unattended.

### 2.3 Remote image patterns

`next/image` refuses to optimize images from other websites unless they're
listed in `images.remotePatterns`. The config allowed `placehold.co`,
`images.unsplash.com` and `picsum.photos`, left over from the starter
template. Every image now lives in `public/`, so the allowlist was removed.
An allowlist that is larger than needed is a small risk (your server would
fetch and resize images from those hosts on request), and it is misleading
to readers of the config.

---

## 3. Dead code and dependencies

### 3.1 What unused dependencies cost

The project started from a template that included an AI toolkit (Genkit),
Firebase, charting (recharts), email via SMTP (nodemailer) and about 30
UI components. None of it was used. "Unused" doesn't mean "free":

- **Install time and disk.** Removing them took about 700 packages out of
  `node_modules`. Every deploy installs dependencies, so this speeds up every
  build.
- **Security surface.** Every package, and every package *it* depends on, is
  code you trust. Security advisories (`npm audit`) for packages you don't
  even use still need triage. Fewer packages, fewer alerts, fewer
  supply-chain risks.
- **Bundle size, and tree-shaking.** When building, the bundler starts from
  your pages and follows the `import` statements. Code that is never reached
  is left out; that's **tree-shaking** (shaking the dependency tree so dead
  leaves fall off). It's why unused packages usually *don't* bloat what
  visitors download. But tree-shaking is imperfect: a module with side
  effects at import time (like `new Resend(...)` at the top of a file, or
  `config()` from dotenv) must be kept, and a single stray import can pull in
  a big library. Removing the package entirely is the only guarantee.
- **Cognitive cost.** A new reader sees `firebase` and `genkit` in
  `package.json` and assumes the site uses them. Accurate dependencies are
  documentation.

What was removed: `genkit`, `@genkit-ai/*`, `genkit-cli` (and the `src/ai/`
folder and `genkit:*` scripts), `dotenv` (only Genkit used it; Next.js loads
`.env.local` itself), `firebase`, `nodemailer`, `recharts`, `patch-package`
(there were no patches), `@fontsource/sora` (Sora is loaded from Google
Fonts in `globals.css`), and `tailwindcss-text-stroke` (the config uses the
`tailwindcss-text-fill-stroke` plugin instead).

### 3.2 Pruning the UI components

shadcn/ui copies component source files into `src/components/ui/` rather
than installing them as a package. That is nice for customizing, but it
means unused ones just sit there. To find what to delete, the method was:

1. List every `import` of a `ui/` file from the rest of the app (`button`,
   `card`, `input`, `textarea`, `toaster`).
2. Follow their own imports transitively: `toaster` uses `toast` and the
   `use-toast` hook, so those stay. (Conversely, `sidebar` used `sheet`,
   `tooltip` and the `use-mobile` hook, so once `sidebar` went, they could go
   too.)
3. Delete the rest, then remove the npm packages only those files used: most
   `@radix-ui/*` packages, `react-day-picker` and `date-fns` (calendar),
   `embla-carousel-react` (carousel), `react-hook-form` and
   `@hookform/resolvers` (form).
4. Run `tsc` and the build. A missed import (one file used `./ui/card`, a
   relative path the first search didn't catch) shows up immediately as a
   type error, which is another reason build-time checking matters.

If a future design needs one of these components, re-add it with the
shadcn CLI (`npx shadcn@latest add dialog`), which brings back its
dependencies too.

### 3.3 Other leftovers

- `.modified` was an empty file created by the Firebase Studio scaffold.
- `src/lib/placeholder-images.*` listed Unsplash images and was imported by
  nothing.
- `docs/blueprint.md` described an LLM-generated bio feature that was
  decided against; keeping it would mislead future readers.

---

## 4. Deployment configuration

- **`.env.example`** lists the variables the app needs, with placeholder
  values and comments. You copy it to `.env.local` and fill in real values.
  It is committed; `.env.local` is not.
- **`.gitignore`** had `.env*`, which also matched `.env.example`, so the
  template could never be committed. Adding `!.env.example` after it creates
  an exception (in `.gitignore`, a later `!pattern` re-includes files that an
  earlier pattern excluded).
- **`apphosting.yaml`** tells Firebase App Hosting to provide
  `RESEND_API_KEY` from Cloud Secret Manager (the file contains only the
  secret's *name*, never its value) and `CONTACT_EMAIL` as a plain value.
  `availability: RUNTIME` means the values are only needed when the server
  runs, not during the build.

`docs/DEPLOYMENT.md` has the step-by-step guide.
