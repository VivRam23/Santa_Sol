# Santa & Sol

Booking page for Santa & Sol: Christmas portraits at sunset with a barefoot Santa, by Sol Photography.
One page, one job: book a $95 sunset slot.

- **Design (approved v3, Oct 16 2026):** the "Santa & Sol booking page" canvas, artboards *v3 Desktop* and *v3 Mobile*.
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
| All page copy | `src/content/booking.json` |
| Business details, links, booking and waitlist settings, SEO | `src/content/site.json` |
| Design tokens (source) | `design/tokens.json`, copied from Iris's design system |
| Design tokens (generated CSS) | `src/styles/tokens.css`, from `npm run tokens` (runs before every dev and build) |
| Tailwind theme, fonts, base styles | `src/styles/global.css` |
| One component per section | `src/components/` |
| Page assembly | `src/pages/index.astro` |
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
| `public/images/santa-bench.jpg` | Santa on the bench, mirrored to face the text | Added |
| `public/images/family-santa.jpg` | Hero (the arch) and gallery | **To add** from Iris's design system › Photography |
| `public/images/couple-tree.jpg` | Gallery and offer | **To add** |
| `public/images/couple-dog.jpg` | The wide band above the dates | **To add**. Landscape, full resolution, at least 1440 × 720 |
| `public/images/laurel.jpg` | Meet your photographer | **To add** from the October shoot |
| `public/images/og.jpg` | Social share image, 1200 × 630 | **To add** |
| `public/brand/santa-sol-stacked.svg` | Desktop header, footer | **To add** from Iris's design system › Logos |
| `public/brand/santa-sol-horizontal.svg` | Mobile header | **To add** |
| `public/brand/symbol-striped-sun.svg` | FAQ mark | **To add** |
| `public/brand/symbol-sun-reversed.svg` | Closing red band | **To add** |
| `public/favicon.svg` | Browser tab | **To add** (`favicon.svg` in the design system) |

Use the logo files exactly as supplied. Iris's rules: never retype or redraw the mark.

## Booking, waitlist and analytics

- **Booking.** Every "Book your Santa photos" button in the dates, offer and closing sections links to `bookingUrl` in `src/content/site.json`. The header, hero and sticky-bar buttons scroll to the dates first. Peitho's handoff asks for a booking tool where dates can be added at any time and the cancellation policy is a tick box at checkout. Cal.com does both.
- **Waitlist.** The form posts to `waitlistEndpoint` in `src/content/site.json` (Formspree, Basin or similar). It has a honeypot field for spam, inline validation, and UTM fields filled from the page URL. Until the endpoint is set, it shows the success message but sends nothing, and logs a warning.
- **Analytics.** `src/lib/track.ts` sends events to Google Tag Manager or GA4 (`dataLayer`) or to Plausible, whichever snippet is added in `src/layouts/Base.astro`:
  - `cta_click`, with `section`: header, hero, dates, offer, closing or sticky_bar
  - `phone_click`: the WhatsApp link
  - `form_start` and `form_submit`: the waitlist
  - `booking_complete`: fire this from the booking tool's confirmation, since bookings happen there.

## SEO

- Title, description, canonical and Open Graph tags are set in `src/content/site.json`.
- `sitemap.xml` comes from `@astrojs/sitemap`, and `public/robots.txt` points to it.
- Structured data covers the business (`LocalBusiness`), each open session date (`Event`), and the FAQ (`FAQPage`). Answers still marked TBD are left out of the FAQ data.
- Set the real domain with `SITE_URL`, or in `astro.config.mjs`, and in `public/robots.txt`.

## Deploying

Static output, so any static host works: Vercel, Netlify, Cloudflare Pages or GitHub Pages.
On each host, the build command is `npm run build` and the output folder is `dist`.
Nothing is deployed yet.

## Open TODOs

Content (Viv, Laurel, Peitho):
- [ ] Session windows for Nov 13, 14 and 15.
- [ ] Card service: price, which countries it mails to, and the last order date.
- [ ] Extra-photo price.
- [ ] Rain policy when no other date works.
- [ ] Weekends to offer in the waitlist.
- [ ] Laurel's styling tips, or cut the "What should we wear?" question.
- [ ] NEEDS PROOF: Laurel's experience line, and one family review.
- [ ] Peitho to confirm a few lines:
  - the page title and meta description, which are assembled from approved copy
  - the waitlist error messages
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
- [ ] Photos into `public/images/` (see the table above).
- [ ] Booking tool and `bookingUrl`.
- [ ] Waitlist form service and `waitlistEndpoint`.
- [ ] Analytics snippet.
- [ ] Real domain.
- [ ] Image optimisation: serve AVIF or WebP once the full-resolution photos are in. Astro's `<Image>` can do this.
- [ ] Commit `package-lock.json` and switch CI to `npm ci`.
