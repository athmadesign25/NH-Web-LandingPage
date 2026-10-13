/**
 * Marketing drawer configuration.
 *
 * This shape is the contract. The control panel writes it locally today;
 * a headless CMS writes the same shape later, so the component does not
 * change when the source does.
 *
 * Everything a marketer can choose is a CLOSED SET — a side, a named
 * colour, a named size. Nothing is a free-text colour or a number. That is
 * deliberate: the moment a CMS offers a colour picker, the palette stops
 * being a palette. Constrained choices are also what makes the light/dark
 * pairing below possible to enforce.
 */

export type DrawerSide = "left" | "right" | "top" | "bottom";

/** Which way the in-container overlay leans, which decides legible text. */
export type OverlayTone = "dark" | "light";

export type ButtonVariant = "primary" | "secondary" | "link";

/** A colour offered to marketing: a label they understand, a token we control. */
export type ColorOption = {
  id: string;
  label: string;
  /** CSS value, always a var() so the palette stays the single source. */
  value: string;
};

/**
 * A headline is a LIST of parts, not a string, so a single headline can
 * carry more than one colour — "Advanced Healthcare / Coming Soon to /
 * Banashankari" is three parts in the reference, the middle one red.
 * Parts can be added, removed and reordered.
 */
export type HeadlinePart = {
  id: string;
  text: string;
  /** ColorOption id, resolved against the ramp allowed by the current tone. */
  colorId: string;
  /** Rendered on its own line rather than flowing inline. */
  breakAfter: boolean;
};

export type BannerConfig = {
  side: DrawerSide;
  /** Image filling the drawer. */
  image: { src: string; alt: string };
  /** The scrim inside the drawer, behind the copy and over the image. */
  overlay: { tone: OverlayTone; colorId: string };
  headline: { parts: HeadlinePart[]; sizeId: string };
  description: { enabled: boolean; text: string; colorId: string };
  cta: { enabled: boolean; label: string; variant: ButtonVariant; href: string };
};

/* ─── The closed sets ──────────────────────────────────────────────────── */

/** In-container overlay. One dark and one light, as discussed. */
export const OVERLAY_COLORS: Record<OverlayTone, ColorOption[]> = {
  dark: [
    { id: "navy", label: "Navy", value: "var(--navy-900-rgb)" },
    { id: "slate", label: "Slate", value: "var(--slate-900-rgb)" },
    { id: "brand", label: "Brand blue", value: "var(--blue-brand-rgb)" },
  ],
  light: [
    { id: "white", label: "White", value: "var(--white-rgb)" },
    { id: "mist", label: "Mist", value: "var(--slate-200-rgb)" },
  ],
};

/**
 * Text colours, keyed by the tone they sit ON. A dark overlay offers light
 * text and vice versa — so the control panel cannot produce an illegible
 * pairing, which is the failure mode a free colour picker guarantees.
 */
export const TEXT_COLORS: Record<OverlayTone, ColorOption[]> = {
  dark: [
    { id: "white", label: "White", value: "var(--color-text-inverse)" },
    { id: "mist", label: "Mist", value: "var(--slate-200)" },
    { id: "red", label: "Accent red", value: "var(--red-400)" },
    { id: "amber", label: "Amber", value: "var(--amber-500)" },
    { id: "cyan", label: "Cyan", value: "var(--cyan-bright)" },
  ],
  light: [
    { id: "ink", label: "Ink", value: "var(--color-text)" },
    { id: "slate", label: "Slate", value: "var(--slate-600)" },
    { id: "brand", label: "Brand blue", value: "var(--blue-brand)" },
    { id: "red", label: "Emergency red", value: "var(--red-emergency)" },
  ],
};

/** Headline sizes. Min and max of the range marketing can pick within. */
export const HEADLINE_SIZES: ColorOption[] = [
  { id: "sm", label: "28", value: "var(--font-size-2xl)" },
  { id: "md", label: "30", value: "var(--font-size-3xl)" },
  { id: "lg", label: "36", value: "var(--font-size-4xl)" },
  { id: "xl", label: "40", value: "var(--font-size-40)" },
  { id: "2xl", label: "42", value: "var(--font-size-display)" },
];

export const resolve = (list: ColorOption[], id: string) =>
  (list.find((c) => c.id === id) ?? list[0]).value;

export const DEFAULT_CONFIG: BannerConfig = {
  side: "left",
  image: {
    src: "/marketing-banashankari.png",
    alt: "KS Narayana Health hospital building in Banashankari",
  },
  overlay: { tone: "dark", colorId: "navy" },
  headline: {
    sizeId: "xl",
    parts: [
      { id: "h1", text: "Advanced Healthcare", colorId: "white", breakAfter: true },
      { id: "h2", text: "Coming Soon to", colorId: "red", breakAfter: true },
      { id: "h3", text: "Banashankari", colorId: "white", breakAfter: false },
    ],
  },
  description: {
    enabled: false,
    text: "Multi-speciality care, 24x7 emergency and diagnostics — opening shortly.",
    colorId: "mist",
  },
  cta: { enabled: true, label: "Book Appointment", variant: "primary", href: "/appointment" },
};
