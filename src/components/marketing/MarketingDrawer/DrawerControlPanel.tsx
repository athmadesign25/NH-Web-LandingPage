"use client";

/**
 * Prototyping panel for the marketing drawer.
 *
 * This stands in for the CMS form. Everything it offers is a closed set, so
 * whatever is built here is reproducible by a marketer later — if a control
 * needs a free-text colour or an arbitrary number, that is a signal the
 * design has outgrown what the CMS can safely expose.
 *
 * DEV ONLY. It renders nothing in a production build.
 */

import { motion, useDragControls } from "framer-motion";
import { Plus, Trash2, ArrowUp, ArrowDown, CornerDownLeft } from "lucide-react";
import styles from "./DrawerControlPanel.module.css";
import {
  type BannerConfig,
  type DrawerSide,
  type OverlayTone,
  type ButtonVariant,
  OVERLAY_COLORS,
  TEXT_COLORS,
  HEADLINE_SIZES,
  resolve,
} from "./types";

type Props = {
  config: BannerConfig;
  onChange: (next: BannerConfig) => void;
};

const SIDES: DrawerSide[] = ["left", "right", "top", "bottom"];
const VARIANTS: ButtonVariant[] = ["primary", "secondary", "link"];

/**
 * Park the panel clear of the drawer. A left/right drawer leaves a free
 * column, so the panel keeps its full height; a top/bottom one spans the
 * width and leaves only a strip, so it is capped to fit that.
 */
const CORNER: Record<DrawerSide, string> = {
  left: styles.atBottomRight,
  right: styles.atBottomLeft,
  top: `${styles.atBottomRight} ${styles.strip}`,
  bottom: `${styles.atTopRight} ${styles.stripTop}`,
};

export default function DrawerControlPanel({ config, onChange }: Props) {
  const controls = useDragControls();
  if (process.env.NODE_ENV === "production") return null;

  const set = (patch: Partial<BannerConfig>) => onChange({ ...config, ...patch });
  const textRamp = TEXT_COLORS[config.overlay.tone];

  /** Tone decides the legible text ramp, so switching it must remap every
      colour that is now pointing at an id the new ramp does not have. */
  const setTone = (tone: OverlayTone) => {
    const ramp = TEXT_COLORS[tone];
    const safe = (id: string) => (ramp.some((c) => c.id === id) ? id : ramp[0].id);
    set({
      overlay: { tone, colorId: OVERLAY_COLORS[tone][0].id },
      headline: {
        ...config.headline,
        parts: config.headline.parts.map((p) => ({ ...p, colorId: safe(p.colorId) })),
      },
      description: { ...config.description, colorId: safe(config.description.colorId) },
    });
  };

  const parts = config.headline.parts;
  const setParts = (next: typeof parts) =>
    set({ headline: { ...config.headline, parts: next } });

  const movePart = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= parts.length) return;
    const next = [...parts];
    [next[i], next[j]] = [next[j], next[i]];
    setParts(next);
  };

  return (
    <motion.aside
      className={`${styles.panel} ${CORNER[config.side]}`}
      drag
      // Drag is started from the header ONLY. With drag on the whole panel,
      // framer captures the pointer and the scrollable body never receives
      // it — which is why the controls could not be scrolled at the top and
      // bottom positions, where the panel is capped to a short strip.
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
    >
      <header
        className={styles.head}
        onPointerDown={(e) => controls.start(e)}
        style={{ cursor: "grab", touchAction: "none" }}
      >
        <span className={styles.title}>Drawer controls</span>
        <span className={styles.hint}>drag header</span>
      </header>

      <div className={styles.body}>
        {/* ── position ── */}
        <section className={styles.row}>
          <label className={styles.label}>Position</label>
          <div className={styles.seg}>
            {SIDES.map((s) => (
              <button
                key={s}
                onClick={() => set({ side: s })}
                className={s === config.side ? styles.segOn : styles.segOff}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* ── overlay ── */}
        <section className={styles.row}>
          <label className={styles.label}>Overlay</label>
          <div className={styles.seg}>
            {(["dark", "light"] as OverlayTone[]).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={t === config.overlay.tone ? styles.segOn : styles.segOff}
              >
                {t}
              </button>
            ))}
          </div>
          <div className={styles.swatches}>
            {OVERLAY_COLORS[config.overlay.tone].map((c) => (
              <button
                key={c.id}
                title={c.label}
                onClick={() => set({ overlay: { ...config.overlay, colorId: c.id } })}
                className={c.id === config.overlay.colorId ? styles.swatchOn : styles.swatch}
                style={{ background: `rgb(${c.value})` }}
              />
            ))}
          </div>
        </section>

        {/* ── headline ── */}
        <section className={styles.row}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Headline</label>
            <button
              className={styles.add}
              onClick={() =>
                setParts([
                  ...parts,
                  {
                    id: `h${Date.now()}`,
                    text: "New line",
                    colorId: textRamp[0].id,
                    breakAfter: true,
                  },
                ])
              }
            >
              <Plus size={12} /> add
            </button>
          </div>

          {parts.map((p, i) => (
            <div key={p.id} className={styles.part}>
              <input
                className={styles.input}
                value={p.text}
                onChange={(e) =>
                  setParts(parts.map((x) => (x.id === p.id ? { ...x, text: e.target.value } : x)))
                }
              />
              <div className={styles.partTools}>
                {textRamp.map((c) => (
                  <button
                    key={c.id}
                    title={c.label}
                    onClick={() =>
                      setParts(parts.map((x) => (x.id === p.id ? { ...x, colorId: c.id } : x)))
                    }
                    className={c.id === p.colorId ? styles.dotOn : styles.dot}
                    style={{ background: c.value }}
                  />
                ))}
                <span className={styles.spacer} />
                <button
                  title="line break after"
                  className={p.breakAfter ? styles.iconOn : styles.icon}
                  onClick={() =>
                    setParts(parts.map((x) => (x.id === p.id ? { ...x, breakAfter: !x.breakAfter } : x)))
                  }
                >
                  <CornerDownLeft size={12} />
                </button>
                <button className={styles.icon} onClick={() => movePart(i, -1)} title="move up">
                  <ArrowUp size={12} />
                </button>
                <button className={styles.icon} onClick={() => movePart(i, 1)} title="move down">
                  <ArrowDown size={12} />
                </button>
                <button
                  className={styles.icon}
                  onClick={() => parts.length > 1 && setParts(parts.filter((x) => x.id !== p.id))}
                  title="remove"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          <div className={styles.seg}>
            {HEADLINE_SIZES.map((s) => (
              <button
                key={s.id}
                onClick={() => set({ headline: { ...config.headline, sizeId: s.id } })}
                className={s.id === config.headline.sizeId ? styles.segOn : styles.segOff}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── description ── */}
        <section className={styles.row}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Description</label>
            <button
              className={config.description.enabled ? styles.toggleOn : styles.toggleOff}
              onClick={() =>
                set({ description: { ...config.description, enabled: !config.description.enabled } })
              }
            >
              {config.description.enabled ? "on" : "off"}
            </button>
          </div>
          {config.description.enabled && (
            <>
              <input
                className={styles.input}
                value={config.description.text}
                onChange={(e) =>
                  set({ description: { ...config.description, text: e.target.value } })
                }
              />
              <div className={styles.partTools}>
                {textRamp.map((c) => (
                  <button
                    key={c.id}
                    title={c.label}
                    onClick={() => set({ description: { ...config.description, colorId: c.id } })}
                    className={c.id === config.description.colorId ? styles.dotOn : styles.dot}
                    style={{ background: c.value }}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ── cta ── */}
        <section className={styles.row}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Button</label>
            <button
              className={config.cta.enabled ? styles.toggleOn : styles.toggleOff}
              onClick={() => set({ cta: { ...config.cta, enabled: !config.cta.enabled } })}
            >
              {config.cta.enabled ? "on" : "off"}
            </button>
          </div>
          {config.cta.enabled && (
            <>
              <input
                className={styles.input}
                value={config.cta.label}
                onChange={(e) => set({ cta: { ...config.cta, label: e.target.value } })}
              />
              <div className={styles.seg}>
                {VARIANTS.map((v) => (
                  <button
                    key={v}
                    onClick={() => set({ cta: { ...config.cta, variant: v } })}
                    className={v === config.cta.variant ? styles.segOn : styles.segOff}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </motion.aside>
  );
}
