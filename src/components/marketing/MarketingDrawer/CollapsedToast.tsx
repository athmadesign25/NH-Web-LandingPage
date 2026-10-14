"use client";

/**
 * The banner's collapsed form: a small persistent alert at the bottom
 * left. No scrim, no lock — it just sits there until dismissed.
 *
 * It does not simply appear. It grows out of the corner the panel shrank
 * toward, so the two read as one movement rather than a disappearance
 * followed by an arrival.
 *
 * The copy is a generic label plus the headline on ONE line. Stacking the
 * headline's parts here meant a three-line banner headline became a
 * three-line toast, which overran the 274px box the spec fixes.
 */

import { motion } from "framer-motion";
import { ease } from "@/lib/motion";
import BannerBellIcon from "./BannerBellIcon";
import styles from "./CollapsedToast.module.css";
import { type HeadlinePart, COLLAPSED_LABEL } from "./types";

type Props = {
  parts: HeadlinePart[];
  onExpand: () => void;
};

export default function CollapsedToast({ parts, onExpand }: Props) {
  // One line, not one per part. The toast is a light surface regardless of
  // what the panel looked like — the previous version carried the panel's
  // ramp across, so a dark banner left white text on a white toast.
  const summary = parts.map((p) => p.text).join(" ");

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
        {/* Swap point for the announcement Lottie once the asset exists —
            same box, same 32px mark. */}
        <BannerBellIcon size={32} />
      </span>
      <span className={styles.copy}>
        <span className={styles.eyebrow}>{COLLAPSED_LABEL}</span>
        <span className={styles.line}>{summary}</span>
      </span>
    </motion.button>
  );
}
