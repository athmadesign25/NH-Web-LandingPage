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
  type Orientation,
  type CollapseMode,
  TEXT_COLORS,
} from "./types";

type Props = {
  config: BannerConfig;
  onChange: (next: BannerConfig) => void;
};

const ORIENTATIONS: Orientation[] = ["vertical", "horizontal"];
const COLLAPSE: CollapseMode[] = ["none", "toast", "fab"];

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
      // The banner is always centred, so the panel no longer has an edge
      // to dodge — it sits in the corner furthest from it.
      className={`${styles.panel} ${styles.atBottomRight}`}
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
        {/* The only spatial choice left. Position (four edges) and overlay
            tone (dark/light) were both controls; each one let two banners
            stop looking like the same brand without buying any range. */}
        <section className={styles.row}>
          <label className={styles.label}>Orientation</label>
          <div className={styles.seg}>
            {ORIENTATIONS.map((o) => (
              <button
                key={o}
                onClick={() => set({ orientation: o })}
                className={o === config.orientation ? styles.segOn : styles.segOff}
              >
                {o}
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
                  { id: `h${Date.now()}`, text: "New line", colorId: TEXT_COLORS[0].id },
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
                {TEXT_COLORS.map((c) => (
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
          {/* Label only. Primary, secondary and link were offered and
              removed — two of the three were weaker versions of the one
              thing the banner wants you to do. */}
          {config.cta.enabled && (
            <input
              className={styles.input}
              value={config.cta.label}
              onChange={(e) => set({ cta: { ...config.cta, label: e.target.value } })}
            />
          )}
        </section>
      </div>
    </motion.aside>
  );
}
