/**
 * The ten ReleasePage style systems.
 *
 * Single source of truth for a client build's typography and palette. The
 * rendered reference for each lives in `0-Style Guides/`; the values here are
 * lifted from `0-releasepage-prompt-design-styles.md` and must stay in step
 * with it.
 *
 * To style a build, change ACTIVE_STYLE at the bottom of this file. Nothing
 * else needs touching — BaseLayout emits that style's @font-face rules and
 * design tokens, and Tailwind reads the same tokens through
 * tailwind.config.mjs.
 */

/** A self-hosted Fontshare family in public/fonts/. */
export interface FontFace {
  /** Family name used in CSS. */
  family: string;
  /** Folder under public/fonts/, minus the `_Complete` suffix. */
  dir: string;
  /**
   * File stem(s) to load. A single entry is a variable font covering the whole
   * range; multiple entries are static weights, keyed by weight.
   */
  files: { file: string; weight: string }[];
  /** `font-weight` descriptor for the variable face, e.g. "300 700". */
  range: string;
  /** Generic fallback appended to the stack. */
  fallback: 'serif' | 'sans-serif';
}

export interface StylePreset {
  id: number;
  name: string;
  market: string;
  tone: string;
  display: FontFace;
  body: FontFace;
  colors: {
    /** Headings, nav wordmark, footer ground. */
    primary: string;
    /** CTAs and highlights. */
    accent: string;
    /** Page ground. */
    bg: string;
    /** Alternating band / form ground. */
    bg2: string;
    /** Body copy. */
    text: string;
  };
  /** Border radius the style's buttons use, as a CSS length. */
  radius: string;
  /**
   * Extra derived CSS custom properties a style's components rely on beyond
   * the five standard tokens (tint/shade variants, dark-background text,
   * hairlines). Emitted verbatim as `--NAME:value;` pairs alongside the
   * standard tokens. Only Pacific Fairways' approved brand needs this — the
   * ten generic presets get by on the five standard tokens alone.
   */
  extraTokens?: Record<string, string>;
  /**
   * Google Fonts stylesheet URL to load instead of self-hosting `display`/
   * `body`. Only set for a client whose brand was already approved with
   * specific Google Fonts (e.g. delivered first as an HTML mockup) rather
   * than picked from the ten self-hosted systems below. When set,
   * fontFaceCss/BaseLayout skip the self-hosted @font-face + preload path
   * entirely for this style.
   */
  googleFontsHref?: string;
}

// ---------------------------------------------------------------------------
// Font definitions. Nineteen of the twenty families ship a variable build, so
// one file covers every weight; Array is the exception and loads statics.
// ---------------------------------------------------------------------------

const v = (
  family: string,
  range: string,
  fallback: FontFace['fallback'],
): FontFace => ({
  family,
  dir: `${family}_Complete`,
  files: [{ file: `${family}-Variable`, weight: range }],
  range,
  fallback,
});

const FONTS = {
  Alpino: v('Alpino', '100 900', 'sans-serif'),
  Amulya: v('Amulya', '300 700', 'sans-serif'),
  Author: v('Author', '200 700', 'serif'),
  Bonny: v('Bonny', '100 700', 'sans-serif'),
  Chillax: v('Chillax', '200 700', 'sans-serif'),
  Erode: v('Erode', '300 700', 'serif'),
  FamiljenGrotesk: v('FamiljenGrotesk', '400 700', 'sans-serif'),
  Gambetta: v('Gambetta', '300 700', 'serif'),
  GeneralSans: v('GeneralSans', '200 700', 'sans-serif'),
  Melodrama: v('Melodrama', '300 700', 'serif'),
  Pally: v('Pally', '400 700', 'sans-serif'),
  Panchang: v('Panchang', '200 800', 'sans-serif'),
  Quilon: v('Quilon', '400 700', 'serif'),
  Roundo: v('Roundo', '200 700', 'sans-serif'),
  Supreme: v('Supreme', '100 800', 'sans-serif'),
  Switzer: v('Switzer', '100 900', 'sans-serif'),
  Synonym: v('Synonym', '200 700', 'sans-serif'),
  Technor: v('Technor', '200 900', 'sans-serif'),
  Zodiak: v('Zodiak', '100 900', 'serif'),

  // No variable build published for Array.
  Array: {
    family: 'Array',
    dir: 'Array_Complete',
    files: [
      { file: 'Array-Regular', weight: '400' },
      { file: 'Array-Semibold', weight: '600' },
      { file: 'Array-Bold', weight: '700' },
    ],
    range: '400 700',
    fallback: 'sans-serif',
  } satisfies FontFace,
} as const;

// ---------------------------------------------------------------------------
// The ten presets. Every one of the twenty families is used exactly once, so
// no two styles share a face.
// ---------------------------------------------------------------------------

export const STYLES: Record<number, StylePreset> = {
  1: {
    id: 1,
    name: 'Bold & Confident',
    market: 'Volume / first home buyer',
    tone: 'Bold, direct, high-energy — built to convert fast',
    display: FONTS.Array,
    body: FONTS.Supreme,
    colors: { primary: '#1A1A2E', accent: '#E63946', bg: '#FFFFFF', bg2: '#F2F2F2', text: '#1A1A2E' },
    radius: '0px',
  },
  2: {
    id: 2,
    name: 'Warm & Approachable',
    market: 'Mid-market owner-occupier',
    tone: 'Friendly, optimistic, community-oriented — feels like home already',
    display: FONTS.Quilon,
    body: FONTS.Chillax,
    colors: { primary: '#3D6B4F', accent: '#E8A838', bg: '#FAF7F2', bg2: '#EDE8DF', text: '#2C2C2C' },
    radius: '8px',
  },
  3: {
    id: 3,
    name: 'Minimal & Editorial',
    market: 'Prestige / luxury',
    tone: 'Restrained, considered, architect-designed — lets the product speak',
    display: FONTS.Melodrama,
    body: FONTS.Switzer,
    colors: { primary: '#1C1C1C', accent: '#C9A96E', bg: '#FAFAFA', bg2: '#F0EDE8', text: '#3A3A3A' },
    radius: '0px',
  },
  4: {
    id: 4,
    name: 'Natural & Organic',
    market: 'Lifestyle / acreage',
    tone: 'Grounded, earthy, unhurried — space to breathe',
    display: FONTS.Erode,
    body: FONTS.GeneralSans,
    colors: { primary: '#4A3728', accent: '#8B9E6E', bg: '#F5F0E8', bg2: '#E8DFD0', text: '#2E2018' },
    radius: '4px',
  },
  5: {
    id: 5,
    name: 'Sleek & Modern',
    market: 'Coastal / resort-style',
    tone: 'Crisp, contemporary, resort-like — clean lines and open air',
    display: FONTS.Technor,
    body: FONTS.Alpino,
    colors: { primary: '#0D1B2A', accent: '#4FC3C3', bg: '#FFFFFF', bg2: '#F0F4F5', text: '#1A1A2A' },
    radius: '2px',
  },
  6: {
    id: 6,
    name: 'Panoramic & Elevated',
    market: 'Prestige hillside / view lots',
    tone: 'Elevated, expansive, composed — the view is the product',
    display: FONTS.Gambetta,
    body: FONTS.FamiljenGrotesk,
    colors: { primary: '#2C3E50', accent: '#D4956A', bg: '#FDFCFA', bg2: '#F2EDE6', text: '#2C2C2C' },
    radius: '2px',
  },
  7: {
    id: 7,
    name: 'Community & Belonging',
    market: 'Established or near-established masterplanned community',
    tone: 'Warm, proud, resident-led — the people already there are the proof',
    display: FONTS.Bonny,
    body: FONTS.Roundo,
    colors: { primary: '#1D4E35', accent: '#F5A623', bg: '#FFFFFF', bg2: '#F4F7F2', text: '#222222' },
    radius: '999px',
  },
  8: {
    id: 8,
    name: 'Manifesto & Belief',
    market: 'Mid-market lifestyle / values-led buyer',
    tone: 'Conviction-led, declarative — states what it stands for',
    display: FONTS.Zodiak,
    body: FONTS.Amulya,
    colors: { primary: '#1A1A1A', accent: '#5B8C5A', bg: '#F9F6F0', bg2: '#EDEAE3', text: '#1A1A1A' },
    radius: '0px',
  },
  9: {
    id: 9,
    name: 'Nature & Parks First',
    market: 'Family-oriented community with significant green space or parkland',
    tone: 'Green-led, generous, family-facing — parkland is the headline',
    display: FONTS.Author,
    body: FONTS.Synonym,
    colors: { primary: '#2B5F3E', accent: '#E8B84B', bg: '#FFFFFF', bg2: '#EFF5EF', text: '#1C2B1C' },
    radius: '6px',
  },
  10: {
    id: 10,
    name: 'Big Backyard & Coastal Lifestyle',
    market: 'Regional coastal / sea-change buyer',
    tone: 'Relaxed, roomy, coastal — room to spread out',
    display: FONTS.Panchang,
    body: FONTS.Pally,
    colors: { primary: '#1B4B6B', accent: '#62B6CB', bg: '#FFFFFF', bg2: '#F0F7FA', text: '#1A2A35' },
    radius: '6px',
  },

  // Client's own pre-approved brand — not one of the ten style systems.
  // Fonts are Google-hosted (see googleFontsHref) rather than self-hosted
  // Fontshare families, so `files` below is unused for display/body.
  11: {
    id: 11,
    name: 'Pacific Fairways (client brand)',
    market: 'Acreage lot release — Springwood, QLD',
    tone: 'Grounded, unhurried, quietly expensive — the land is the product',
    display: {
      family: 'Cinzel',
      dir: '',
      files: [],
      range: '400 700',
      fallback: 'serif',
    },
    body: {
      family: 'Josefin Sans',
      dir: '',
      files: [],
      range: '300 700',
      fallback: 'sans-serif',
    },
    colors: {
      primary: '#454539', // Volcanic Stone Green
      accent: '#D79669', // Folksy Gold
      bg: '#F6CEAC', // Allspice
      bg2: '#fbf1e2', // cream — alternating band ground
      text: '#454539', // body copy reads in the same ink as headings
    },
    radius: '2px',
    googleFontsHref:
      'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
    extraTokens: {
      'color-ink': '#302f28', // deeper shade of primary — dark bands (stats/footer), hover-darken
      'color-accent-light': '#e3b98c', // lighter gold — accents/icons on dark backgrounds
      'color-paper': '#fffcf6', // lightest surface, hover ground
      'color-on-ink': '#fffbf3', // warm-white text on dark backgrounds
      'color-hairline': '#e2c39c', // hairline on light backgrounds
      'color-hairline-dark': '#54523f', // hairline on dark backgrounds
      'font-mono': "'JetBrains Mono','SF Mono',Menlo,Consolas,monospace", // numerals: stat band, masterplan readout
      'shadow-plate': '0 18px 40px -20px rgba(48,47,40,.35)',
      ease: 'cubic-bezier(.16,1,.3,1)',
    },
  },
};

/**
 * The style this build ships. Change this one value to restyle the whole page.
 * In dev you can override it per request with `?style=N` (see BaseLayout) to
 * compare directions without editing the file.
 */
export const ACTIVE_STYLE = 11;

export const getStyle = (id: number = ACTIVE_STYLE): StylePreset =>
  STYLES[id] ?? STYLES[ACTIVE_STYLE];

/** `@font-face` rules for one style's two families. */
export function fontFaceCss(style: StylePreset): string {
  if (style.googleFontsHref) return ''; // loaded via <link> instead — see BaseLayout
  return [style.display, style.body]
    .flatMap((f) =>
      f.files.map(
        ({ file, weight }) =>
          `@font-face{font-family:'${f.family}';` +
          `src:url('/fonts/${f.dir}/Fonts/WEB/fonts/${file}.woff2') format('woff2');` +
          `font-weight:${weight};font-style:normal;font-display:swap}`,
      ),
    )
    .join('\n');
}

/** Design tokens for one style, as a `:root` block. */
export function tokenCss(style: StylePreset): string {
  const { colors: c } = style;
  const extra = style.extraTokens
    ? Object.entries(style.extraTokens)
        .map(([k, v]) => `--${k}:${v};`)
        .join('')
    : '';
  return (
    `:root{` +
    `--font-display:'${style.display.family}',${style.display.fallback};` +
    `--font-body:'${style.body.family}',${style.body.fallback};` +
    `--color-primary:${c.primary};` +
    `--color-accent:${c.accent};` +
    `--color-bg:${c.bg};` +
    `--color-bg-alt:${c.bg2};` +
    `--color-text:${c.text};` +
    `--radius-btn:${style.radius};` +
    extra +
    `}`
  );
}
