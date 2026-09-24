# ReleasePage — Astro Template

Per-client starting point for ReleasePage builds using Astro + Tailwind,
replacing the plain HTML/CSS pipeline for projects that want optimised
images (via Astro's `<Image />`) and light interactivity (React islands).

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and set the client's Formspree endpoint.
3. Pick one of the ten style systems in `0-Style Guides/` (see below) and set
   `ACTIVE_STYLE` in `src/lib/styles.ts` to its number. That is the only
   change needed — fonts, palette and button radius all follow.
4. Set `SELECTED_SECTIONS` in `src/lib/sections.ts` to the sections the client
   ticked in Q1 Field 9 (see below). Defaults to none.
5. Drop client images into `src/assets/images/` (they're optimised
   automatically through Astro's `<Image />` component — the one real
   upgrade over the plain-HTML pipeline).
6. Build out `src/components/sections/*` per the numbered PAGE STRUCTURE
   in `0-Style Guides/0-releasepage-prompt-design-styles.md`.
7. `npm run dev` to preview, `npm run build` to output to `dist/`.

## Sections

Four sections are standard and render for every client:
**Hero**, **Estate Intro**, **Lot / Stage Detail**, **Enquire / Footer**.

Everything else is optional and renders only if the client selected it in
Q1 Field 9. An unselected section is omitted entirely — there is no empty or
placeholder version of it in the output.

| Selection id | Section | Notes |
|---|---|---|
| `key-stats` | Key Stats | |
| `location-highlights` | Location Highlights | |
| `neighbourhood-amenities` | Neighbourhood Amenities | |
| `masterplan` | Masterplan (static image) | same slot as below |
| `interactive-masterplan` | Interactive Masterplan | Bespoke tier — clickable lot map with pop-up detail |
| `faqs` | FAQs | |
| `gallery` | Photos / Lifestyle Gallery | renders `LifestyleRenders.astro` |
| `how-to-buy` | How to Buy | |

Configure a build by listing the client's selections:

    // src/lib/sections.ts
    export const SELECTED_SECTIONS: readonly OptionalSection[] = [
      'key-stats',
      'interactive-masterplan',
      'gallery',
    ];

The order you list them in does not matter. The page always renders in one
canonical reading order:

> Hero · Estate Intro · Key Stats · Location Highlights · Neighbourhood
> Amenities · Masterplan · Lot / Stage Detail · FAQs · Photos / Lifestyle
> Gallery · How to Buy · Enquire / Footer

`masterplan` and `interactive-masterplan` are the standard and Bespoke versions
of the same slot. Selecting both, or naming a section that does not exist,
fails the build with a message rather than emitting a malformed page.

`SECTION_LABELS` in the same file maps each id to its Q1 wording, so a client's
answer can be transcribed without guesswork.


## Style systems

`0-Style Guides/` holds the ten approved directions: a prompt template
(`0-releasepage-prompt-design-styles.md`, pasted into Claude Design at the
start of a project) plus a rendered design system per style. Each covers a
distinct market segment, and each has its own display/body pairing drawn
from the self-hosted Fontshare families in `public/fonts/`.

| # | Style | Market | Display | Body |
|---|-------|--------|---------|------|
| 1 | Bold & Confident | Volume / first home buyer | Array | Supreme |
| 2 | Warm & Approachable | Mid-market owner-occupier | Quilon | Chillax |
| 3 | Minimal & Editorial | Prestige / luxury | Melodrama | Switzer |
| 4 | Natural & Organic | Lifestyle / acreage | Erode | GeneralSans |
| 5 | Sleek & Modern | Coastal / resort-style | Technor | Alpino |
| 6 | Panoramic & Elevated | Prestige hillside / view lots | Gambetta | FamiljenGrotesk |
| 7 | Community & Belonging | Established masterplanned community | Bonny | Roundo |
| 8 | Manifesto & Belief | Mid-market lifestyle / values-led buyer | Zodiak | Amulya |
| 9 | Nature & Parks First | Family community with significant parkland | Author | Synonym |
| 10 | Big Backyard & Coastal | Regional coastal / sea-change buyer | Panchang | Pally |

All twenty families are used exactly once, so no two styles share a face.
Nineteen ship as variable fonts (one file, full weight range); Array is the
exception and loads three static weights.

Fonts are self-hosted — nothing is fetched from Google Fonts. The only
exception is JetBrains Mono inside the design-system documents themselves,
which sets the spec labels and swatch tables; it is documentation chrome and
never appears in a client build.

### Switching style

`src/lib/styles.ts` holds all ten presets and the `ACTIVE_STYLE` constant.
`BaseLayout.astro` emits that style's `@font-face` rules and `:root` tokens
into the head, and preloads its two faces.

    export const ACTIVE_STYLE = 3;   // Minimal & Editorial

To compare directions, run `npm run dev` and open `/preview/1` … `/preview/10`.
Each renders the real page in that style, with a switcher across the top —
handy for putting options in front of a client. Those routes exist in dev
only: `getStaticPaths` returns nothing in a production build, so they are
never emitted and never pull the other eighteen families into `dist/`.

(There is deliberately no `?style=` query override. With `output: 'static'`
Astro strips search params from `Astro.url` even in dev, so it would silently
do nothing.)

Author components against the tokens rather than hard-coded values, so a
style change carries through:

| Token | Tailwind | Use |
|-------|----------|-----|
| `--font-display` | `font-display` | Headings |
| `--font-body` | `font-body` | Body and UI |
| `--color-primary` | `text-primary` | Headings, wordmark, footer ground |
| `--color-accent` | `bg-accent` | CTAs and highlights |
| `--color-bg` | `bg-bg` | Page ground |
| `--color-bg-alt` | `bg-bg-alt` | Alternating bands, form ground |
| `--color-text` | `text-text` | Body copy |
| `--radius-btn` | `rounded-btn` | Button corners |

### Font pruning at build

`public/` is copied into `dist/` wholesale, so an unpruned build ships all
twenty families — about 59MB across 1,046 files, in `.eot`/`.ttf`/`.otf`
formats no current browser requests. A small integration in
`astro.config.mjs` prunes `dist/fonts/` to the files the built HTML actually
references, which takes a typical build from 59MB to roughly 284KB. It works
off real usage rather than a second copy of the style config, so it cannot
drift out of step with `styles.ts`.

## Structure notes

- All CSS lives in `src/styles/global.css` (Tailwind directives + base
  element styles) — no per-component style blocks. `@font-face` and the
  design tokens are not declared there; they come from the active preset in
  `src/lib/styles.ts` via `BaseLayout.astro`.
- `src/lib/lenis.ts` initialises smooth scroll once, imported from
  `BaseLayout.astro`.
- `src/components/react/` is reserved for interactive islands only
  (form handling, anything needing client-side state) — everything else
  stays a static `.astro` component.
- `src/components/ui/` is where 21st.dev "Copy prompt" output lands
  before being wired into a section.

## Deployment

Same Cloudflare Pages flow as the HTML pipeline, but build output is
`dist/` instead of the raw folder — set the Cloudflare Pages build
command to `npm run build` and output directory to `dist`.
