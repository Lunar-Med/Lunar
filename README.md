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

Submissions from the General Inquiries form go to the Google Sheet **Lunar Medical – Website Inquiries** (tab `Inquiries`), with an email notice to `admin@lunar-med.com`.

Setup (one time, by the sheet owner):

1. Open the sheet, then **Extensions → Apps Script**.
2. Replace the editor contents with `tools/google-sheet-inquiries.gs` and save.
3. **Deploy → New deployment → Web app**, with *Execute as: Me* and *Who has access: Anyone*. Authorize when asked.
4. Copy the web app URL (ends in `/exec`) into `FORM_ENDPOINT` at the top of `assets/js/main.js`.

After editing the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.
While `FORM_ENDPOINT` is empty, the form opens the visitor's email app addressed to `INQUIRY_EMAIL` instead.

## Publishing on www.lunar-med.com

The repo is ready for GitHub Pages (`CNAME` is set to `www.lunar-med.com`, and `.nojekyll` serves files as-is):

1. In the repository **Settings → Pages**, set the source to the `main` branch, root folder.
2. At your domain registrar, add a `CNAME` record for `www` pointing to `lunar-med.github.io`.
3. Optionally point the bare domain `lunar-med.com` at GitHub Pages with `A` records (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) so it redirects to `www`.
4. Once the certificate is issued, tick **Enforce HTTPS**.

Note: GitHub Pages on a private repository requires a paid GitHub plan. Any static host (Netlify, Cloudflare Pages, Vercel) also works with no changes.
