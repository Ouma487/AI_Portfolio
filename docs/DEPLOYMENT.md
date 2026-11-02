# Deployment guide

This guide takes the portfolio from your laptop to a public URL. It covers:

1. [Running it locally](#1-run-it-locally) with a `.env.local` file
2. [Deploying on Vercel](#2-deploy-on-vercel-recommended) (recommended)
3. [Deploying on Firebase App Hosting](#3-alternative-firebase-app-hosting) (alternative)
4. [Setting up Resend](#4-set-up-resend-the-email-service) so the contact form sends email
5. [Adding a custom domain](#5-add-a-custom-domain)
6. [A checklist to run after every deployment](#6-post-deployment-checklist)

Dashboards change their wording often, so this guide describes what to look
for rather than the exact button labels. If a step looks slightly different
on screen, look for the closest equivalent.

---

## Two concepts first

### Environment variables

An **environment variable** is a named value that the running program reads
from its surroundings instead of from its source code. This app reads two:

| Name             | What it is                                     | Sensitive? |
| ---------------- | ---------------------------------------------- | ---------- |
| `RESEND_API_KEY` | The password-like key that lets the app send email through Resend | Yes, a secret |
| `CONTACT_EMAIL`  | The inbox that receives contact form messages  | Not really |

Keeping these out of the code means the same code can run on your laptop,
in a preview deployment and in production with different settings, and it
means the API key is never committed to GitHub.

A **secret** is simply an environment variable whose value must stay private.
Hosting platforms store secrets encrypted and only hand them to your app when
it runs. If a secret leaks (for example, it gets pushed to a public repo),
**revoke it in the provider's dashboard and create a new one**: deleting the
commit is not enough, because the old value may already have been copied.

### Why the key never reaches the browser

The contact form submits to a **Server Action** (`submitContactForm` in
`src/app/actions.ts`, marked with `'use server'`). That function runs only on
the server. The browser sends the form fields, the server reads
`process.env.RESEND_API_KEY`, talks to Resend and sends back only "success"
or an error message. The key is never part of the JavaScript sent to visitors.

Next.js only exposes environment variables to the browser when their name
starts with `NEXT_PUBLIC_`. **Never rename these variables with that prefix**,
or the key would be baked into the public JavaScript bundle.

---

## 1. Run it locally

Requirements: [Node.js](https://nodejs.org) 20 or newer, and Git.

```bash
git clone https://github.com/Ouma487/AI_Portfolio.git   # or your repo URL
cd AI_Portfolio
npm ci                          # installs exact versions from package-lock.json
cp .env.example .env.local      # create your local env file
```

Open `.env.local` and fill in the real values (see
[section 4](#4-set-up-resend-the-email-service) to get a Resend key):

```dotenv
RESEND_API_KEY=re_your_real_key
CONTACT_EMAIL=the-email-of-your-resend-account@example.com
```

`.env.local` is listed in `.gitignore`, so Git will not commit it. Next.js
loads it automatically.

Then start the dev server:

```bash
npm run dev
```

and open <http://localhost:9002>. Restart the dev server after you edit
`.env.local`, because env files are read at startup.

To check that a production build works before deploying:

```bash
npm run typecheck   # TypeScript errors
npm run lint        # ESLint errors
npm run build       # full production build (also fails on type/lint errors)
npm start           # serves the build on http://localhost:3000
```

If the form says it is "temporarily unavailable", look at the terminal running
the server: it logs which variable is missing.

---

## 2. Deploy on Vercel (recommended)

[Vercel](https://vercel.com) is made by the team behind Next.js. It detects the
framework automatically, has a free hobby tier, and creates a preview URL for
every branch.

### First deployment

1. Push the project to GitHub.
2. Sign in to Vercel with your GitHub account.
3. Create a new project and choose to **import a Git repository**. Select this
   repo (you may need to grant Vercel access to it in the GitHub permission
   dialog).
4. Vercel detects **Next.js**. Keep the default build command (`npm run build`),
   install command and output settings.
5. Before deploying, open the **environment variables** section of the import
   screen and add:
   - `RESEND_API_KEY` = your Resend key
   - `CONTACT_EMAIL` = your inbox
   Make sure they are enabled for the **Production** environment (and for
   **Preview** too if you want the form to work on preview URLs).
6. Deploy. After a minute or two you get a URL like
   `https://your-project.vercel.app`.

If you add or change an environment variable later, it only applies to **new**
deployments. Redeploy (from the deployments list, or by pushing a commit) to
pick it up.

### Production branch and preview deployments

- In the project's Git settings, the **production branch** is usually `main`.
  Every push or merge to it updates the live site.
- Every push to any **other** branch, and every pull request, gets its own
  **preview deployment** at a unique URL. Vercel posts that URL on the pull
  request on GitHub. This is a safe way to see a redesign before it goes live.
- Preview deployments use the env vars marked for the Preview environment.
  If you don't set them there, the form on previews will show the friendly
  "temporarily unavailable" message, which is expected.

---

## 3. Alternative: Firebase App Hosting

[Firebase App Hosting](https://firebase.google.com/docs/app-hosting) builds and
runs Next.js apps on Google Cloud. It requires the **Blaze (pay-as-you-go)
plan**, which needs a billing account. Small sites usually stay within the
free usage included in the plan, but set a budget alert in Google Cloud to be
safe.

The repo already contains `apphosting.yaml`, which tells App Hosting which
environment variables to provide:

- `RESEND_API_KEY` comes from **Cloud Secret Manager** (the value is not in
  the file, only the secret's name).
- `CONTACT_EMAIL` is a plain value written in the file. Edit it if you use a
  different inbox.

### Steps

1. Install the Firebase CLI and sign in:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
2. In the [Firebase console](https://console.firebase.google.com), create a
   project (or pick an existing one) and upgrade it to the Blaze plan.
3. From the repo folder, store the API key as a secret:
   ```bash
   firebase apphosting:secrets:set RESEND_API_KEY --project your-project-id
   ```
   The CLI prompts for the value (paste your Resend key; it is not echoed).
   When asked, let it grant your App Hosting backend access to the secret. If
   you create the backend after the secret, you can grant access later with
   `firebase apphosting:secrets:grantaccess RESEND_API_KEY --backend your-backend-id`.
4. Create a backend linked to GitHub, either in the console's App Hosting
   section or with:
   ```bash
   firebase apphosting:backends:create --project your-project-id
   ```
   Follow the prompts: connect your GitHub account, choose this repository,
   the root directory (`/`) and the live branch (`main`), and pick a region.
5. App Hosting builds and deploys the app. Each push to the live branch
   triggers a new rollout. Your site gets a URL ending in `hosted.app`.

---

## 4. Set up Resend (the email service)

[Resend](https://resend.com) is the service that actually delivers the
contact form email.

### Create an API key

1. Sign up at resend.com.
2. In the dashboard, open the API keys section and create a new key.
   "Sending access" permission is enough; this app does nothing else.
3. Copy the key right away (it starts with `re_`); Resend shows it only once.
   Put it in `.env.local` locally and in your hosting provider's env settings.

### The test sender and its limitation

The code sends from `onboarding@resend.dev` (see `FROM_ADDRESS` in
`src/app/actions.ts`). That address works without any setup, **but Resend
only delivers mail from it to the email address of your own Resend
account.** So while you use it, `CONTACT_EMAIL` must be the address you
signed up to Resend with. Any other recipient is rejected. Because the
action checks Resend's `error` value, the visitor then sees an error
message and the server log shows Resend's explanation.

### Using your own domain (optional, recommended later)

To send from something like `contact@yourdomain.com`, or to deliver to any
inbox:

1. Buy a domain (see [section 5](#5-add-a-custom-domain); you can use the same
   one as the website).
2. In Resend's domains section, add the domain. Resend shows a few **DNS
   records** (typically TXT and MX records used for SPF and DKIM, which prove
   to inboxes that Resend is allowed to send for your domain).
3. Add those records at your domain registrar's DNS settings, exactly as
   shown. Propagation can take from minutes to a few hours.
4. When Resend marks the domain as verified, change `FROM_ADDRESS` in
   `src/app/actions.ts`, for example:
   ```ts
   const FROM_ADDRESS = 'Portfolio Contact <contact@yourdomain.com>';
   ```
   Commit and redeploy.

Replies are easy either way: the email's **Reply-To** is set to the visitor's
address, so pressing "Reply" in your inbox answers them directly.

---

## 5. Add a custom domain

1. Buy a domain from any registrar (Namecheap, Cloudflare, Google/Squarespace
   Domains, OVH, Gandi...).
2. In your host:
   - **Vercel**: open the project's domain settings and add your domain.
   - **Firebase App Hosting**: open the backend in the console and add a
     custom domain.
3. The host tells you which DNS records to create (usually an `A` record for
   the bare domain `example.com` and/or a `CNAME` for `www.example.com`).
   Add them in the registrar's DNS panel.
4. Wait for verification. The host issues an HTTPS certificate automatically.
5. Pick one canonical address (with or without `www`) and let the host
   redirect the other to it.

DNS for the website and DNS for Resend can live side by side on the same
domain; they use different records.

---

## 6. Post-deployment checklist

Run through this after the first deployment and after any big change:

- [ ] The home page loads over **https** on the production URL (and the custom
      domain, if you have one).
- [ ] All images, logos and the CV download link work (no broken images).
- [ ] Navigation links scroll to the right sections, on desktop and on a phone.
- [ ] Each project detail page (`/projects/...`) opens.
- [ ] **Contact form, happy path**: send a real message. You see "Message
      Sent!" and the email arrives at `CONTACT_EMAIL` (check spam the first
      time). Pressing Reply addresses the visitor.
- [ ] **Contact form, validation**: a message under 10 characters or an
      invalid website URL shows an error under the field.
- [ ] **Contact form, HTML injection**: send a message containing
      `<b>bold</b>`. The email must show the literal text `<b>bold</b>`,
      not bold text.
- [ ] **Contact form, misconfiguration**: if the form says "temporarily
      unavailable", the env vars are missing in that environment. Check the
      host's runtime/function logs for the message naming the missing variable.
- [ ] The secret is not exposed: in the browser, view the page source or
      search the loaded JS files for `re_`. You should find nothing.
- [ ] `RESEND_API_KEY` is not in the Git history (`git log -p | grep re_`
      shows nothing besides the `.env.example` placeholder).
