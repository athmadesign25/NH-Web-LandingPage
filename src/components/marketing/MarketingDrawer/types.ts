/**
 * Marketing banner configuration.
 *
 * This shape is the contract. The control panel writes it locally today;
 * a headless CMS writes the same shape later, so the component does not
 * change when the source does.
 *
 * The set of choices keeps shrinking on purpose. Position, scrim shade,
 * headline size, line breaks and button style were all controls once.
 * Each was a way for two banners to stop looking like the same brand, and
 * none of them was a decision marketing actually needed to make.
 */

/** The banner's shape. It is always centred; only the proportion varies. */
export type Orientation = "horizontal" | "vertical";

export type CollapseMode = "none" | "toast" | "fab";

export type ColorOption = {
  id: string;
  label: string;
  /** Always a var() so the palette stays the single source. */
  value: string;
};

/**
 * A headline is a LIST of parts, not a string, so one headline can carry
 * more than one colour. Each part is its own line; parts can be added,
 * removed and reordered.
 */
export type HeadlinePart = {
  id: string;
  text: string;
  colorId: string;
};

export type BannerConfig = {
  orientation: Orientation;
  /**
   * One image per shape. A single asset cannot serve both proportions —
   * forcing it to is what made the wide version soft, because a near-square
   * image had to stretch across a letterbox.
   */
  image: {
    vertical: { src: string; alt: string };
    horizontal: { src: string; alt: string };
  };
  headline: { parts: HeadlinePart[] };
  description: { enabled: boolean; text: string };
  cta: { enabled: boolean; label: string; href: string };
  collapse: CollapseMode;
};

/* ─── The closed sets ──────────────────────────────────────────────────── */

/**
 * The scrim is always light — a cool off-white rather than pure #FFF, so
 * it sits in the same family as the rest of the UI. No dark variant, no
 * shade picker.
 */
export const OVERLAY_RGB = "var(--slate-50-rgb)";

/**
 * Headline colours: ink for the copy, red for the accent, nothing else.
 * Blue was offered and removed — against a blue brand, a blue accent on a
 * light panel reads as a link rather than emphasis.
 */
export const TEXT_COLORS: ColorOption[] = [
  { id: "black", label: "Black", value: "var(--navy-ink)" },
  { id: "red", label: "Red", value: "var(--red-emergency)" },
];

/** Body copy takes the readable neutral. Not a choice. */
export const DESCRIPTION_COLOR = "var(--slate-600)";

export const resolve = (id: string) =>
  (TEXT_COLORS.find((c) => c.id === id) ?? TEXT_COLORS[0]).value;

/**
 * What the collapsed forms say. Generic on purpose: a headline written for
 * a full panel is usually too long to survive at toast or tile size, and
 * truncating it mid-phrase reads worse than a label.
 */
export const COLLAPSED_LABEL = "Announcement";

export const DEFAULT_CONFIG: BannerConfig = {
  orientation: "vertical",
  image: {
    vertical: {
      src: "/marketing-tall.jpg",
      alt: "A woman playing hopscotch in her apartment courtyard as neighbours watch",
    },
    horizontal: {
      src: "/marketing-wide.jpg",
      alt: "Narayana Health hospital exterior at sunset",
    },
  },
  headline: {
    parts: [
      { id: "h1", text: "Advanced Healthcare", colorId: "black" },
      { id: "h2", text: "Coming Soon to", colorId: "red" },
      { id: "h3", text: "Banashankari", colorId: "black" },
    ],
  },
  description: {
    enabled: false,
    text: "Multi-speciality care, 24x7 emergency and diagnostics — opening shortly.",
  },
  cta: { enabled: true, label: "Book Appointment", href: "/appointment" },
  collapse: "toast",
};
