# Wiveliscombe Civic and Historical Society

Static site built with [11ty](https://www.11ty.dev/), deployed on Cloudflare as a Worker with static assets.

## Local development

```sh
npm install
npm run dev      # eleventy --serve
npm run build    # build to dist/
```

The site builds to `dist/`. CSS is bundled and minified by lightningcss during the build.

## Content

Talks and planning applications are Markdown files with YAML frontmatter, one file per record:

- `src/content/talks/*.md` — the Wivey Talks programme
- `src/content/applications/*.md` — planning applications

The filename is the URL slug, so keep it stable when editing:

- `src/content/talks/youth-community-power.md` builds to `/wivey-talks/youth-community-power/`
- `src/content/applications/app-001.md` builds to `/community-matters/app-001/`

Layout, permalink and default metadata live in the sibling `*.11tydata.js` files. Sort order is set in `.eleventy.js`: talks ascend by `date`, applications descend by `submitted`.

### Talks

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Page heading and list link text. Quote it if it contains `:` or `#`. |
| `date` | yes | Quoted ISO date, e.g. `"2026-09-17"`. Unquoted dates are parsed by YAML into `Date` objects. |
| `time` | yes | Display text, e.g. `"7:30pm"`. |
| `byline` | yes | Single line shown on the talks list and in meta descriptions, e.g. `"A talk by Nick Harvey, Charity Manager at In the Mix"`. |
| `image` | yes | Base path under `/images/talks/` for a square image, without the size suffix. |
| `imageAlt` | no | Alt text for the image. Omit it for decorative images. |
| `topics` | no | Subject tags. Use `topics`, not `tags`: Eleventy reserves `tags` for collections. |

The Markdown body is the full description shown on the talk page. The layout adds the venue, admission and back-link sections.

### Applications

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Page heading and card link text. |
| `reference` | yes | Planning reference, quoted. |
| `address` | yes | Site address. |
| `status` | yes | Display text, e.g. `Under consultation`. |
| `submitted` | yes | Quoted ISO date, used for ordering. |
| `summary` | yes | One-line card blurb. |
| `topics` | no | Subject tags. |
| `representation` | no | WCHS representation, shown on the card and as a section on the detail page. |

The Markdown body is the application description.

## Talk images

Talk images are static files in `src/images/talks/`. They are copied to `dist/images/talks/` and served from Cloudflare's CDN alongside the rest of the site.

Images are square. Each talk's `image` field stores a base path, and the templates request `-400.jpg`, `-800.jpg`, and `-1200.jpg` variants of that path. The talks list shows them as thumbnails; talk detail pages show them in a right-hand column. Keep the source square (or near square) and centre-crop before exporting, so the `object-fit: cover` rules do not cut off important content.

The checked-in placeholder images are brand-coloured gradients with the society's "W" mark. Replace them with real photos using the same filenames, or update the base path in the talk file. Original artwork can live in the gitignored `art/` directory; export the variants into `src/images/talks/` and commit those.

## Deployment

The build and deploy configuration lives in `wrangler.jsonc`:

- `name`: `wchs`
- `assets.directory`: `./dist`
- `assets.not_found_handling`: `404-page`, so unknown URLs get the generated `dist/404.html`

Without `assets.directory`, Cloudflare infers a directory from the framework preset and will look for `_site`, which this project does not build.

### First-time setup

1. In the Cloudflare dashboard go to **Workers & Pages → Create application → Connect to Git**. Do not use the "Continue to Pages" link: this project uses the Workers static-assets workflow, not the legacy Pages one.
2. Select the repository, then set:
   - Project name: `wchs`
   - Production branch: `main`
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy` (the default)
   - Root directory: leave blank
3. Add an environment variable `NODE_VERSION` set to `22`. The repo also contains `.nvmrc`, but the environment variable is what Cloudflare reads first.
4. Deploy. The site is served at `https://wchs.<account-subdomain>.workers.dev`.
5. Set `site.url` in `src/_data/site.js` to the production URL (the `workers.dev` address, or the custom domain once it is attached) and redeploy. It builds the canonical, Open Graph and contact form redirect URLs.

Pushing to `main` deploys to production. Pushes to other branches create preview deployments with their own URLs, so work in progress does not change the live site.

### Test checklist

After a deploy, run through these:

- [ ] Submit a genuine test enquiry with a real email address and full sentences. Test submissions such as `test@test.com` are more likely to be filtered as spam.
- [ ] Confirm the notification email arrives at `homeshaw@btopenworld.com`.
- [ ] Reply to the notification and confirm the reply goes to the submitter, not to Web3Forms.
- [ ] Confirm submission redirects to `/contact/thanks/` and shows the branded thank-you page.
- [ ] Check the thank-you page is not indexed: view source and confirm `<meta name="robots" content="noindex">`.
- [ ] Tick the hidden `botcheck` field using browser devtools and submit. The submission should be rejected and no email should arrive.
- [ ] Confirm the privacy notice link in the form and footer opens `/privacy/`.
- [ ] Check a non-existent URL returns the site's 404 page.

## Form handling

The contact form posts directly to [Web3Forms](https://web3forms.com), which emails the submission to the society and redirects the visitor to `/contact/thanks/`. There is no server-side code in this repository.

- Endpoint: `https://api.web3forms.com/submit`
- Success page: `/contact/thanks/`, set by the hidden `redirect` field
- Fields: `name`, `email`, `Enquiry type`, `message`, `consent`
- Hidden fields: `access_key`, `subject`, `from_name`, `redirect`
- Spam protection: Web3Forms' server-side filtering plus the hidden `botcheck` honeypot

The access key lives in `src/_data/forms.js`. It is a public identifier, not a secret, and is visible in the page source. It only allows posting to this one form.

### One-time setup

1. Create an account at [web3forms.com](https://web3forms.com) using `homeshaw@btopenworld.com`. On the free plan this address is the notification recipient.
2. Create a form named `contact` and copy its access key into `src/_data/forms.js`.
3. Confirm the form's **Reply-To** setting resolves to the submitter's address. The form has an `email` field, which Web3Forms uses by default.
4. Set **Data Retention** for the form to **7 days**, so stored submissions match the privacy notice.

### How it works without JavaScript

The form is a plain HTML `POST` and works with JavaScript disabled. Because the submit button is a normal form submit, the browser follows Web3Forms' redirect to the thank-you page.

Submitting the form locally with `npm run dev` also works, but the redirect is an absolute URL, so you will land on the deployed thank-you page rather than the local one. That is expected.

### Spam and abuse

Free-plan spam protection is server-side filtering plus the `botcheck` honeypot. The access key is public, so in principle someone could post junk to it. Watch for Web3Forms' warning email at 90% of the 250 monthly submissions. If abuse becomes a problem, either upgrade to Pro (which adds domain restriction and Cloudflare Turnstile) or put a small Worker in front of the form to hide the key and rate-limit requests.

## Free plan limits

Cloudflare's free plan has no bandwidth or request limit for static assets. The relevant limits are:

- 3,000 build minutes per month, 1 concurrent build
- 100,000 Worker requests per day (not used: there is no Worker script, only assets)
- 20,000 files per deployment

At roughly one deploy a month, this site uses a negligible share of the allowance. Both the Workers and legacy Pages workflows are free at this scale.

Web3Forms' free plan allows 250 submissions per month and keeps 30 days of dashboard history. Stored submissions are deleted after the retention period you configure.

## Privacy and retention

The privacy notice at `/privacy/` commits to deleting stored submissions after **seven days** at Web3Forms and to deleting the email copy after **three months**.

The seven-day limit is a Web3Forms setting under **Data Retention**; set it once when the form is created. The three-month limit is an operational task, not something the build enforces: periodically delete enquiries older than three months from the chair's mailbox.

## Domain

The site runs at `https://wiveliscombecivicsociety.org.uk`. The domain is registered, its DNS zone sits in the same Cloudflare account as the Worker, and both the apex and `www` are attached as custom domains.

- Primary hostname: the apex, `wiveliscombecivicsociety.org.uk`
- `www` should 301 to the apex through a **Rules → Redirect Rules** entry. Until that rule exists both hostnames serve the site; the canonical link in each page points at the apex, so search engines still see one address.
- `site.url` in `src/_data/site.js` must stay in sync with the primary hostname. It builds the canonical link, the Open Graph URLs and the contact form's redirect.
- Enable **Always Use HTTPS** under **SSL/TLS → Edge Certificates**.

Because Web3Forms' free plan only allows same-domain redirects, change `site.url` in the same deploy as any hostname change, or the form's thank-you redirect will be refused.

Cloudflare provisions TLS automatically. The `workers.dev` address stays available afterwards; disable it in the Worker settings once the domain is established if you want a single public address.

Optional: add **Email Routing** if the society wants an `@wiveliscombecivicsociety.org.uk` address. The contact form notification can keep going to the chair's existing mailbox.
