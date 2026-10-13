"use client";

/**
 * Prototyping panel for the marketing drawer.
 *
 * Stands in for the CMS form. Everything here is a closed set, so whatever
 * is built with it is reproducible by a marketer later. The set is
 * deliberately small — size, break points and scrim shades were all
 * controls once and are not any more, because each one was a way for two
 * banners to stop looking like the same brand.
 *
 * DEV ONLY. Renders nothing in a production build.
 */

import { motion, useDragControls } from "framer-motion";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import styles from "./DrawerControlPanel.module.css";
import {
  type BannerConfig,
  type DrawerSide,
  type OverlayTone,
  type ButtonVariant,
  type CollapseMode,
  TEXT_COLORS,
  resolve,
} from "./types";

type Props = {
  config: BannerConfig;
  onChange: (next: BannerConfig) => void;
};

const SIDES: DrawerSide[] = ["left", "right", "top", "bottom"];
const VARIANTS: ButtonVariant[] = ["primary", "secondary", "link"];
const COLLAPSE: CollapseMode[] = ["none", "toast", "fab"];

const CORNER: Record<DrawerSide, string> = {
  left: styles.atBottomRight,
  right: styles.atBottomLeft,
  top: `${styles.atBottomRight} ${styles.strip}`,
  bottom: `${styles.atTopRight} ${styles.stripTop}`,
};

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={on ? styles.switchOn : styles.switchOff}
    >
      <span className={styles.knob} />
    </button>
  );
}

export default function DrawerControlPanel({ config, onChange }: Props) {
  const controls = useDragControls();
  if (process.env.NODE_ENV === "production") return null;

  const set = (patch: Partial<BannerConfig>) => onChange({ ...config, ...patch });
  const textRamp = TEXT_COLORS[config.overlay.tone];

  /** Tone decides the legible ramp, so switching remaps any colour whose
      id the new ramp does not carry. */
  const setTone = (tone: OverlayTone) => {
    const ramp = TEXT_COLORS[tone];
    const safe = (id: string) => (ramp.some((c) => c.id === id) ? id : ramp[0].id);
    set({
      overlay: { tone },
      headline: { parts: config.headline.parts.map((p) => ({ ...p, colorId: safe(p.colorId) })) },
    });
  };

  const parts = config.headline.parts;
  const setParts = (next: typeof parts) => set({ headline: { parts: next } });

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
      // Drag starts from the header ONLY. On the whole panel, framer captures
      // the pointer and the scrollable body never receives it.
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

      {/* data-lenis-prevent: Lenis swallows wheel events globally, so an
          overflow container has to opt out explicitly or it will not scroll.
          This is the convention the rest of the codebase uses.
          data-drawer-scrollable is ours, for the drawer's own blocker. */}
      <div className={styles.body} data-drawer-scrollable data-lenis-prevent>
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

        {/* Tone only. There is no shade picker — two banners differing only
            in which dark they used is drift, not range. */}
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
        </section>

        <section className={styles.row}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Headline</label>
            <button
              className={styles.add}
              onClick={() =>
                setParts([
                  ...parts,
                  { id: `h${Date.now()}`, text: "New line", colorId: textRamp[0].id },
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
        </section>

        {/* No colour control: body copy takes the readable neutral for its
            tone, and anything else is a mistake the system should not offer. */}
        <section className={styles.row}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Description</label>
            <Switch
              on={config.description.enabled}
              onToggle={() =>
                set({ description: { ...config.description, enabled: !config.description.enabled } })
              }
            />
          </div>
          {config.description.enabled && (
            <input
              className={styles.input}
              value={config.description.text}
              onChange={(e) => set({ description: { ...config.description, text: e.target.value } })}
            />
          )}
        </section>

        {/* What survives the close. */}
        <section className={styles.row}>
          <label className={styles.label}>On close</label>
          <div className={styles.seg}>
            {COLLAPSE.map((c) => (
              <button
                key={c}
                onClick={() => set({ collapse: c })}
                className={c === config.collapse ? styles.segOn : styles.segOff}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.row}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Button</label>
            <Switch
              on={config.cta.enabled}
              onToggle={() => set({ cta: { ...config.cta, enabled: !config.cta.enabled } })}
            />
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
