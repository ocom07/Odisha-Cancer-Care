# Odisha Cancer Care — Static Website

HTML5 + CSS3 + vanilla JavaScript only. No framework, build step, backend or database.

## File structure
- `*.html` — one independent page each (shared header/footer are repeated in every page).
- `assets/css/styles.css` — whole design system (colour variables at the top).
- `assets/js/site-config.js` — **the file you edit**: WhatsApp number, contact details, sample cases.
- `assets/js/main.js` — navigation, carousel, filters, lightbox, case rendering, contact-form validation.
- `assets/js/donation.js` — the "I WANT TO DONATE" WhatsApp workflow.
- `assets/images/` — `logo.svg` and `placeholder.svg` (both are placeholders).

## Preview
Double-click `index.html`, or run a local server in the folder:
`python3 -m http.server 8000` and open http://localhost:8000
(`404.html` uses absolute paths, so it displays correctly only on a real host.)

## Configure WhatsApp (required before launch)
In `assets/js/site-config.js` set `whatsappNumber` to digits only, with country code, e.g. `919876543210`
(no `+`, spaces or hyphens). Until a valid number is set, the donate button shows a
"not configured" message and nothing opens. Edit `whatsappMessage` if the wording must change.

## Replace the demonstration content
1. Logo: overwrite `assets/images/logo.svg`, or add `logo.png` and change the `<img src>` in every page header/footer.
2. Contact details, registration, social links: fill in `site-config.js`. Footer and contact blocks update automatically.
3. Cases: edit `SITE_CASES` in `site-config.js`. Set `demo:false` and `verified:true` only with documents and written consent.
   Only verified cases add a case reference to the WhatsApp message.
4. Trustees, events, stories, blog, gallery, impact figures: edit the highlighted `[placeholder]` text in `trustees.html`, `events.html`,
   `success-stories.html`, `blog.html`, `media-gallery.html`, `impact.html`, `why-support-us.html` and the matching homepage sections.
   Remove the "Demo/Placeholder" badges only when content is verified.
5. Hero photographs: in `styles.css`, change `.slide--1/2/3` to `background-image: linear-gradient(...), url("../images/photo.jpg"); background-size: cover;`
   (keep the dark overlay so text stays readable).
6. Images: compress and resize before upload; add `width`/`height`; use `loading="lazy"` below the fold.
7. SEO: replace `https://www.your-domain.example/` in all pages, `robots.txt` and `sitemap.xml`. When a verified share image exists,
   add an `og:image` meta tag. Add a favicon only if the organization provides a suitable logo variation.
   Extend the JSON-LD block in `index.html` only with verified details.
8. Privacy policy and donation disclaimer: complete the placeholders and have a legal adviser review them.

## Limits (by design)
- The contact form only validates; it cannot send messages until you connect a real form service.
- Impact numbers and cases are manually maintained static content, not live data.
- There is no admin login. Content changes mean editing files and re-deploying.
- The site never processes payments or confirms donations.

## Deploy
Upload the whole folder to any static host (Netlify, Cloudflare Pages, GitHub Pages, Vercel static, or ordinary web hosting).
Point the host's 404 setting to `404.html` if it supports that.