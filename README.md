# Wiveliscombe Civic and Historical Society

Static site built with [11ty](https://www.11ty.dev/), deployed on Netlify.

## Local development

```sh
npm install
npm run dev      # eleventy --serve
npm run build    # build to dist/
```

The site builds to `dist/`. CSS is bundled and minified by lightningcss during the build.

## Talk images

Talk images are static files in `src/images/talks/`. They are copied to `dist/images/talks/` and served from Netlify's CDN alongside the rest of the site.

Each talk in `src/_data/events.js` stores a base image path. The templates request `-400.jpg`, `-800.jpg`, and `-1200.jpg` variants of that path. The checked-in images are brand-coloured placeholders; replace them with real photos using the same filenames, or update the base path in the event data.

## Netlify deployment

The build settings live in `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 22

Pushing to `main` triggers a production deploy. Pushes to other branches create deploy previews, which do not consume production-deploy credits.

### First-time setup

1. In Netlify, create a new site from Git and select the `davidnorth/WCHS` repository.
2. Set the production branch to `main`. The build command and publish directory are read from `netlify.toml`.
3. **Before the first deploy**, go to **Forms → Enable form detection**. Form detection only takes effect on the next deploy.
4. Deploy the site.
5. Confirm the `contact` form appears under **Forms**.
6. Add a notification: **Forms → Submission notifications → Add notification → Email**, using the chair's address.

The contact form is a normal HTML form. Netlify detects it at deploy time, stores submissions, filters spam with Akismet, and applies the `netlify-honeypot` field before the form is served.

### Test checklist

After the first deploy, run through these:

- [ ] Submit a genuine test enquiry using a real email address and full sentences. Test submissions such as `test@test.com` are more likely to be flagged as spam.
- [ ] Confirm the submission appears under **Forms → contact → Verified submissions**.
- [ ] If it does not appear, check the **Spam submissions** list before assuming the form is broken.
- [ ] Confirm the notification email arrives at the chair's address.
- [ ] Reply to the notification and confirm it goes to the submitter, not `formresponses@netlify.com`.
- [ ] Confirm submission redirects to `/contact/thanks/` and shows the branded thank-you page.
- [ ] Check the thank-you page is not indexed: view source and confirm `<meta name="robots" content="noindex">`.
- [ ] Fill the hidden `bot-field` using browser devtools and submit. The submission should be silently rejected.
- [ ] Confirm the privacy notice link in the form and footer opens `/privacy/`.
- [ ] Check a non-existent URL returns the site's 404 page.

## Form handling

- Form name: `contact`
- Success page: `/contact/thanks/`
- Fields: name, email, subject, message, consent
- Spam protection: Akismet plus the `bot-field` honeypot
- Notifications: configured in the Netlify UI, not in the repository

The form works without JavaScript. The notification email comes from `formresponses@netlify.com`; because the form includes an `email` field, replies go to the submitter. Ask the chair to mark that sender as not spam.

Netlify Forms are free and unlimited on credit-based plans.

## Free-plan usage

New Netlify accounts are credit-based:

- 300 credits per month, hard limit
- Production deploy: 15 credits
- Bandwidth: 20 credits per GB
- Form submissions: free

At roughly one production deploy a month, the site uses very little of the allowance. Use branches for work in progress so previews stay free, and only merge to `main` when ready to publish.

If the credit balance reaches zero, Netlify pauses all sites on the account until the next monthly reset.

## Privacy and retention

The privacy notice at `/privacy/` states that enquiry details are kept for **three months**.

This is an operational task, not something the build enforces: periodically open **Forms → contact** in Netlify, export anything that needs keeping, and delete submissions older than three months.

## Domain

The domain is still to be confirmed. `https://wiveliscombecivic.org.uk` is currently used as a placeholder in `src/_data/site.js` but does not resolve.

When the domain is ready:

1. Add it in Netlify under **Domain management**.
2. Choose the primary domain (apex or `www`) and redirect the other.
3. Netlify provisions TLS automatically.
4. Update `site.url` in `src/_data/site.js` so canonical and Open Graph URLs are correct.
5. Redeploy.

Until then, the `*.netlify.app` URL is the live site.
