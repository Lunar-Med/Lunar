# Lunar Medical website

Source for **www.lunar-med.com**, the website of Lunar Medical (Lunar LLC).

It is a static site: plain HTML, CSS and JavaScript with no build step.

| Page | File |
| --- | --- |
| Home | `index.html` |
| Solutions (sourcing, quality, product portfolio) | `solutions.html` |
| Partner With Us | `partners.html` |
| Impact & Philanthropy | `impact.html` |
| About & Leadership | `about.html` |
| Contact / General Inquiries | `contact.html` |

Shared styles live in `assets/css/styles.css`, behavior in `assets/js/main.js`, and images in `assets/img/` (logo and photos from the company Google Drive).

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Contact form

By default the General Inquiries form opens the visitor's email app with the message addressed to `admin@lunar-med.com`.
To receive submissions directly instead, create a form endpoint (for example with [Formspree](https://formspree.io)) and set `FORM_ENDPOINT` at the top of `assets/js/main.js`. The inbox address is `INQUIRY_EMAIL` in the same file.

## Publishing on www.lunar-med.com

The repo is ready for GitHub Pages (`CNAME` is set to `www.lunar-med.com`, and `.nojekyll` serves files as-is):

1. In the repository **Settings → Pages**, set the source to the `main` branch, root folder.
2. At your domain registrar, add a `CNAME` record for `www` pointing to `lunarmed.github.io`.
3. Optionally point the bare domain `lunar-med.com` at GitHub Pages with `A` records (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) so it redirects to `www`.
4. Once the certificate is issued, tick **Enforce HTTPS**.

Note: GitHub Pages on a private repository requires a paid GitHub plan. Any static host (Netlify, Cloudflare Pages, Vercel) also works with no changes.
