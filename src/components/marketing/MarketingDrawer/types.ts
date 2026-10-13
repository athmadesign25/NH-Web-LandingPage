/**
 * Marketing drawer configuration.
 *
 * This shape is the contract. The control panel writes it locally today;
 * a headless CMS writes the same shape later, so the component does not
 * change when the source does.
 *
 * Everything a marketer can choose is a CLOSED SET — a side, a tone, a
 * named colour. Nothing is a free-text colour or an arbitrary number. The
 * sets are deliberately small: every extra option is a way for two banners
 * to stop looking like the same brand.
 */

export type DrawerSide = "left" | "right" | "top" | "bottom";

/** Which way the in-container scrim leans, which decides legible text. */
export type OverlayTone = "dark" | "light";

export type ButtonVariant = "primary" | "secondary" | "link";

export type ColorOption = {
  id: string;
  label: string;
  /** Always a var() so the palette stays the single source. */
  value: string;
};

/**
 * A headline is a LIST of parts, not a string, so one headline can carry
 * more than one colour — "Advanced Healthcare / Coming Soon to /
 * Banashankari" is three parts, the middle one red. Each part is its own
 * line; parts can be added, removed and reordered.
 */
export type HeadlinePart = {
  id: string;
  text: string;
  colorId: string;
};

export type BannerConfig = {
  side: DrawerSide;
  /**
   * One image per orientation. A single asset cannot serve both a tall
   * drawer and a wide one — forcing it to is what made the wide version
   * soft, because a near-square image had to stretch across a letterbox.
   */
  image: {
    tall: { src: string; alt: string };
    wide: { src: string; alt: string };
  };
  overlay: { tone: OverlayTone };
  headline: { parts: HeadlinePart[] };
  description: { enabled: boolean; text: string };
  cta: { enabled: boolean; label: string; variant: ButtonVariant; href: string };
};

/* ─── The closed sets ──────────────────────────────────────────────────── */

/**
 * The scrim itself is just the tone — there is no colour choice. Two
 * banners differing only in which dark they used is drift, not range.
 * Light is a cool off-white rather than pure #FFF, which keeps it sitting
 * in the same family as the rest of the UI.
 */
export const OVERLAY_RGB: Record<OverlayTone, string> = {
  dark: "var(--navy-900-rgb)",
  light: "var(--slate-50-rgb)",
};

/**
 * Headline colours, keyed by the tone they sit ON — so the panel cannot
 * produce an illegible pairing, which a free colour picker guarantees.
 * Three each: the neutral, the brand red, the brand blue.
 */
export const TEXT_COLORS: Record<OverlayTone, ColorOption[]> = {
  dark: [
    { id: "white", label: "White", value: "var(--color-text-inverse)" },
    { id: "red", label: "Red", value: "var(--red-400)" },
    // Brand blue is too dark to read on a dark scrim, so the light step
    // of the same family stands in for it here.
    { id: "blue", label: "Blue", value: "var(--sky-400)" },
  ],
  light: [
    { id: "black", label: "Black", value: "var(--navy-ink)" },
    { id: "red", label: "Red", value: "var(--red-emergency)" },
    { id: "blue", label: "Blue", value: "var(--blue-brand)" },
  ],
};

/**
 * Body copy takes the obvious colour for its tone. There is no choice:
 * a description in anything other than the readable neutral is a mistake,
 * so the system does not offer the mistake.
 */
export const DESCRIPTION_COLOR: Record<OverlayTone, string> = {
  dark: "rgba(var(--white-rgb), 0.8)",
  light: "var(--slate-600)",
};

export const resolve = (list: ColorOption[], id: string) =>
  (list.find((c) => c.id === id) ?? list[0]).value;

export const DEFAULT_CONFIG: BannerConfig = {
  side: "left",
  image: {
    tall: {
      src: "/marketing-tall.jpg",
      alt: "A woman playing hopscotch in her apartment courtyard as neighbours watch",
    },
    wide: {
      src: "/marketing-wide.jpg",
      alt: "Narayana Health hospital exterior at sunset",
    },
  },
  overlay: { tone: "dark" },
  headline: {
    parts: [
      { id: "h1", text: "Advanced Healthcare", colorId: "white" },
      { id: "h2", text: "Coming Soon to", colorId: "red" },
      { id: "h3", text: "Banashankari", colorId: "white" },
    ],
  },
  description: {
    enabled: false,
    text: "Multi-speciality care, 24x7 emergency and diagnostics — opening shortly.",
  },
  cta: { enabled: true, label: "Book Appointment", variant: "primary", href: "/appointment" },
};
