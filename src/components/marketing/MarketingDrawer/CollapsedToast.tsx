"use client";

/**
 * The drawer's collapsed form: a small persistent alert at the bottom
 * left. No scrim, no lock — it just sits there until dismissed.
 *
 * It does not simply appear. It grows out of the corner the drawer
 * shrank toward, so the two read as one movement rather than a
 * disappearance followed by an arrival.
 */

import { motion } from "framer-motion";
import { ease } from "@/lib/motion";
import BannerBellIcon from "./BannerBellIcon";
import styles from "./CollapsedToast.module.css";
import { type HeadlinePart, TEXT_COLORS, type OverlayTone, resolve } from "./types";

type Props = {
  parts: HeadlinePart[];
  tone: OverlayTone;
  onExpand: () => void;
};

export default function CollapsedToast({ parts, tone, onExpand }: Props) {
  const ramp = TEXT_COLORS[tone];
  return (
    <motion.button
      type="button"
      className={styles.toast}
      onClick={onExpand}
      initial={{ opacity: 0, scale: 0.6, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.6, y: 24 }}
      transition={{ duration: 0.5, ease: ease.spring }}
    >
      <span className={styles.iconWrap}>
        <BannerBellIcon size={32} />
      </span>
      <span className={styles.copy}>
        {parts.map((p) => (
          <span key={p.id} className={styles.line} style={{ color: resolve(ramp, p.colorId) }}>
            {p.text}
          </span>
        ))}
      </span>
    </motion.button>
  );
}
