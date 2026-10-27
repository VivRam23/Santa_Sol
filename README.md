# Santa & Sol

Website for Santa & Sol: Christmas portraits at sunset with a barefoot Santa, by Sol Photography.
Two pages, one job: book a $95 sunset slot.

| Page | URL | Job |
| --- | --- | --- |
| Homepage | `/` | Tell the story, then send families to book |
| Booking page | `/book` | Choose a beach, then a time, and pay |

- **Design (approved v3, Oct 16–20 2026):** the "Santa & Sol booking page" canvas, artboards *v3 Desktop*, *v3 Mobile* and *v3 Booking page /book* (desktop and mobile).
- **Brand:** Iris's *Santa & Sol* design system, v1.1.
- **Copy:** Peitho's *Santa & Sol — Booking Page Copy*, with Viv's edits made on the v3 design.
- **Stack:** Astro 5 + Tailwind CSS 4, static output, dependencies pinned.

## Run it locally

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/
```

Node 20.3 or newer.

## Where things live

| What | Where |
| --- | --- |
| Homepage copy | `src/content/booking.json` |
| Booking page copy | `src/content/book.json` |
| **Beaches, dates, session window and Calendly links** | `src/content/beaches.json` |
| Business details, links, waitlist settings, SEO | `src/content/site.json` |
| Design tokens (source) | `design/tokens.json`, copied from Iris's design system |
| Design tokens (generated CSS) | `src/styles/tokens.css`, from `npm run tokens` (runs before every dev and build) |
| Tailwind theme, fonts, base styles | `src/styles/global.css` |
| One component per section | `src/components/` |
| Page assembly | `src/pages/index.astro` (homepage), `src/pages/book.astro` (booking page) |
| Photos | `public/images/` |
| Logo files | `public/brand/` |
| Fonts (SIL OFL) | `public/fonts/` |

### Editing copy

Change the text in `src/content/booking.json` and rebuild. Two pieces of markup work inside any string:

- `**words**` render bold.
- `[TBD: …]`, `[NEEDS PROOF] …` and `[ASSUMPTION: …]` render as visible pink markers, so nothing unfinished ships unnoticed. The build step on GitHub lists every marker still on the page.

### Tokens

`design/tokens.json` is Iris's file. Don't edit `src/styles/tokens.css` by hand. When Iris updates the design system, replace `design/tokens.json` and run `npm run tokens`. Components only use the semantic tokens (`surface`, `text`, `accent`, `action`…), so dark mode follows automatically.

### Images and logos

Each image is checked at build time. If a file is missing, a labelled placeholder takes its place, and the build doesn't fail. Add these files with exactly these names:

| File | What | Status |
| --- | --- | --- |
| `public/images/family-santa.jpg` | Hero, in the arch (DSCF0567) | Added |
| `public/images/santa-bench.jpg` | Santa on the bench, mirrored to face the text | Added |
| The ten portrait shoot photos | "Why families book" gallery, a row you flick through (order and alt text in `why.gallery` in `src/content/booking.json`) | Added |
| `public/images/couple-dog.jpg` | The wide band above the beaches (DSCF0749, landscape) | Added |
| `public/images/kids-tree.jpg` | Offer section (DSCF0477, kids decorating the tree) | Added |
| `public/images/og.jpg` | Social share image, 1200 × 630, cropped from DSCF0749 | Added |
| `public/images/laurel.jpg` | Meet your photographer (DSCF0038, black and white, from solphotography.net) | Added. A larger original would be sharper |
| `public/brand/santa-sol-stacked.svg` | Desktop header, footer | **To add** from Iris's design system › Logos |
| `public/brand/santa-sol-horizontal.svg` | Mobile header | **To add** |
| `public/brand/symbol-striped-sun.svg` | FAQ mark | **To add** |
| `public/brand/symbol-sun-reversed.svg` | Closing red band | **To add** |
| `public/favicon.svg` | Browser tab | **To add** (`favicon.svg` in the design system) |

Photos come from the October promo shoot by Laurel (Sol Photography), exported at 1600 px on the long side. Camera data (including any GPS location) is stripped before they go in the repo. To swap a photo, replace the file with the same name; to add one to the gallery, add it to `why.gallery` in `src/content/booking.json`.

Use the logo files exactly as supplied. Iris's rules: never retype or redraw the mark.

## Booking, waitlist and analytics

- **Booking.** Every "Book your Santa photos" button on the homepage goes to `/book`. Each beach row's "See times" link goes to that beach, for example `/book#flamingo`, which preselects it.
  - On `/book`, each beach has its own Calendly event. Its link goes in `calendlyUrl` in `src/content/beaches.json`. Until a link is there, the page shows a marked placeholder for that beach.
  - The calendar loads only when it nears the screen or a beach is tapped, so the page stays fast. It uses the brand colours (linen background, ink text, Santa-red buttons) and hides the event details the page already shows. Colour changes need Calendly's Standard plan or above.
  - In each Calendly event, add these booking questions: Santa or no Santa; bringing a dog (Flamingo and Tamarindo only); a required tick box for the cancellation policy. Connect PayPal and require payment to book.
- **Opening a new weekend.** Add the date to each beach's `dates` list in `src/content/beaches.json`, and add the same hours in each beach's Calendly event. The homepage table and the beach cards update from that one file.
- **Waitlist.** The form posts to `waitlistEndpoint` in `src/content/site.json` (Formspree, Basin or similar). It has a honeypot field for spam, inline validation, and UTM fields filled from the page URL. Until the endpoint is set, it shows the success message but sends nothing, and logs a warning.
- **Analytics.** `src/lib/track.ts` sends events to Google Tag Manager or GA4 (`dataLayer`) or to Plausible, whichever snippet is added in `src/layouts/Base.astro`:
  - `cta_click`, with `section`: header, hero, dates, dates_row, offer, closing or sticky_bar
  - `beach_select`: a beach card tapped on `/book`
  - `phone_click`: the WhatsApp link
  - `form_start` and `form_submit`: the waitlist
  - `booking_complete`: sent automatically when a booking is finished inside the Calendly calendar on `/book`.

## SEO

- Title, description, canonical and Open Graph tags are set in `src/content/site.json`.
- `sitemap.xml` comes from `@astrojs/sitemap`, and `public/robots.txt` points to it.
- Structured data covers the business (`LocalBusiness`), each open session date at each beach (`Event`), and the homepage FAQ (`FAQPage`). Answers still marked TBD are left out of the FAQ data.
- `/book` has its own title and description in `src/content/book.json`.
- The domain is **santasol.fun**, set in `astro.config.mjs` and `public/robots.txt`. Use `SITE_URL` to build for a staging address.

## Deploying

Static output, so any static host works: Vercel, Netlify, Cloudflare Pages or GitHub Pages.
On each host, the build command is `npm run build` and the output folder is `dist`.
Nothing is deployed yet.

## Open TODOs

Content (Viv, Laurel, Peitho):
- [x] Session window: 4 – 6 pm (Viv, Oct 19). Laurel to confirm: sunset is around 5:15–5:30 pm in mid-November, so the last slots fall after sunset.
- [ ] Card service: price, which countries it mails to, and the last order date.
- [ ] Extra-photo price.
- [ ] Rain policy when no other date works.
- [ ] Weekends to offer in the waitlist.
- [ ] Laurel's styling tips, or cut the "What should we wear?" question.
- [x] Laurel's proof line: "Over 100 families photographed." (Viv, Oct 26). Peitho to confirm the wording.
- [ ] NEEDS PROOF: one family review.
- [ ] Peitho to confirm a few lines:
  - the page title and meta description, which are assembled from approved copy
  - the waitlist error messages
  - the new interface labels on `/book`, marked in `src/content/book.json`: "1 · Choose your beach", "2 · Choose your time", "Selected", "See times", "Back to Santa & Sol", the calendar loading and error lines, and the page title and description
  - "Will Santa be hot in that suit?" (Santa wears a shirt and shorts, not a suit)
- [ ] Peitho's copy doc to absorb Viv's design edits:
  - hero subhead without "in Guanacaste"
  - the beaches line above the hero
  - "Santa saved / you a seat", with the bold phrase
  - the new closing line break
  - no credit line under the strip
- [ ] Athena: does "Barefoot Santa" stay in the strip now that Santa is optional?

Brand (Iris):
- [ ] Logo, symbol and favicon files into `public/brand/` (see the table above).
- [ ] Guideline updates:
  - the italic half of a headline goes on its own line
  - no endorsed lockup in the footer
- [ ] Ask Laurel for a landscape "empty set" photo for the wide band.

Build:
- [x] Photos from the promo shoot and Laurel's portrait (Oct 20).
- [ ] Booking tool: Calendly + PayPal, or SimplyBook + Tilopay. Then the three Calendly links in `src/content/beaches.json`. (If SimplyBook is chosen, `BeachPicker.astro` swaps the Calendly script for SimplyBook's widget.)
- [ ] Waitlist form service and `waitlistEndpoint`.
- [ ] Analytics snippet.
- [x] Domain: santasol.fun (registered at GoDaddy, Oct 20). Point its DNS at the host when we deploy.
- [ ] Image optimisation: serve AVIF or WebP once the full-resolution photos are in. Astro's `<Image>` can do this.
- [ ] Commit `package-lock.json` and switch CI to `npm ci`.
