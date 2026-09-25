/**
 * Which sections this client's page renders.
 *
 * Four sections are standard and always render. Everything else is optional and
 * appears only if the client selected it in Q1 Field 9 ("which sections would
 * you like on your page"). An unselected section is omitted entirely — never
 * rendered as an empty or placeholder block.
 *
 * To configure a client build, list their selections in SELECTED_SECTIONS at
 * the bottom of this file. Order there does not matter: the page always renders
 * in the canonical reading order below.
 *
 * Mirrors the ACTIVE_STYLE pattern in ./styles.ts — one file per axis of
 * per-client configuration.
 */

/** Always rendered, for every client, on every tier. */
export type StandardSection =
  | 'hero'
  | 'estate-intro'
  | 'lot-stage-detail'
  | 'enquire-footer';

/** Rendered only when selected in Q1 Field 9. */
export type OptionalSection =
  | 'key-stats'
  | 'location-highlights'
  | 'neighbourhood-amenities'
  | 'masterplan'
  | 'interactive-masterplan'
  | 'faqs'
  | 'gallery'
  | 'how-to-buy';

export type SectionId = StandardSection | OptionalSection;

export const STANDARD_SECTIONS: readonly StandardSection[] = [
  'hero',
  'estate-intro',
  'lot-stage-detail',
  'enquire-footer',
];

/**
 * Canonical reading order for the whole page. Selections are filtered against
 * this, so a client's sections always appear in this sequence no matter what
 * order they were ticked in.
 *
 * 'masterplan' and 'interactive-masterplan' occupy the same slot — they are the
 * standard and Bespoke-tier versions of one section, never both at once.
 */
export const SECTION_ORDER: readonly SectionId[] = [
  'hero',
  'estate-intro',
  'key-stats',
  'location-highlights',
  'neighbourhood-amenities',
  'masterplan',
  'interactive-masterplan',
  'lot-stage-detail',
  'faqs',
  'gallery',
  'how-to-buy',
  'enquire-footer',
];

/**
 * How each section is worded on the Q1 form, so a client's answer can be
 * transcribed into SELECTED_SECTIONS without guesswork.
 */
export const SECTION_LABELS: Record<SectionId, string> = {
  'hero': 'Hero',
  'estate-intro': 'Estate Intro',
  'key-stats': 'Key Stats',
  'location-highlights': 'Location Highlights',
  'neighbourhood-amenities': 'Neighbourhood Amenities',
  'masterplan': 'Masterplan (static image)',
  'interactive-masterplan': 'Interactive Masterplan (Bespoke tier)',
  'lot-stage-detail': 'Lot / Stage Detail',
  'faqs': 'FAQs',
  'gallery': 'Photos / Lifestyle Gallery',
  'how-to-buy': 'How to Buy',
  'enquire-footer': 'Enquire / Footer',
};

/** Optional sections only available on the Bespoke tier. */
export const BESPOKE_ONLY: readonly OptionalSection[] = ['interactive-masterplan'];

// ---------------------------------------------------------------------------
// Per-client configuration
// ---------------------------------------------------------------------------

/**
 * The optional sections this client selected. Defaults to none, so a fresh
 * template renders only the four standard sections until a selection is made.
 *
 * Example:
 *   export const SELECTED_SECTIONS: readonly OptionalSection[] = [
 *     'key-stats',
 *     'location-highlights',
 *     'interactive-masterplan',
 *     'gallery',
 *   ];
 */
export const SELECTED_SECTIONS: readonly OptionalSection[] = [
  'key-stats',
  'location-highlights',
  'neighbourhood-amenities',
  'interactive-masterplan',
  'faqs',
  'gallery',
  'how-to-buy',
];

/**
 * The sections to render, in canonical order: the four standard ones plus
 * whatever was selected. Throws on a selection that cannot be built, so the
 * mistake surfaces at build time rather than as a malformed page.
 */
export function resolveSections(
  selected: readonly OptionalSection[] = SELECTED_SECTIONS,
): SectionId[] {
  if (
    selected.includes('masterplan') &&
    selected.includes('interactive-masterplan')
  ) {
    throw new Error(
      'sections: "masterplan" and "interactive-masterplan" are the standard and ' +
        'Bespoke versions of the same section — select one, not both.',
    );
  }

  const unknown = selected.filter((id) => !SECTION_ORDER.includes(id));
  if (unknown.length) {
    throw new Error(
      `sections: unknown section id(s) ${unknown.map((s) => `"${s}"`).join(', ')}. ` +
        `Valid optional sections: ${SECTION_ORDER.filter(
          (id) => !STANDARD_SECTIONS.includes(id as StandardSection),
        ).join(', ')}`,
    );
  }

  const on = new Set<SectionId>([...STANDARD_SECTIONS, ...selected]);
  return SECTION_ORDER.filter((id) => on.has(id));
}
