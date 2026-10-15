"use client";

/**
 * L2 marketing banner — a persistent band across the top of the page.
 *
 * Where the L1 drawer interrupts, this one annexes. It is always present,
 * has no trigger, and the only thing it asks of the reader is whether to
 * dismiss it. The navbar sits below it rather than behind it: the band
 * publishes its own height as `--band-height` on <html>, which is the one
 * value the navbar reads to move down.
 *
 * Entrance is a single pulse at the two ends, then nothing. It runs once
 * per page load and is not repeatable from the UI — the band is an object
 * that was already there, not one that keeps arriving.
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ease } from "@/lib/motion";
import styles from "./AnnouncementBand.module.css";

export type BandConfig = {
  message: string;
  link: { label: string; href: string };
};

export const DEFAULT_BAND: BandConfig = {
  message: "Robotic knee replacement is now available at NH Multispecialty Hospital, HSR.",
  link: { label: "Talk to our team", href: "/appointment" },
};

/** How long the arrival pulse lives, start to gone. */
const PULSE_MS = 4600;

export default function AnnouncementBand({ config = DEFAULT_BAND }: { config?: BandConfig }) {
  const [open, setOpen] = useState(true);
  const [pulsing, setPulsing] = useState(true);
  const bandRef = useRef<HTMLElement>(null);

  // The navbar is fixed at `top: var(--band-height, 0px)`. Publishing the
  // height from here rather than hard-coding it there keeps every route
  // without a band at 0 with no second rule.
  //
  // Measured, not assumed: the band is 82px on desktop but grows when the
  // message wraps on a narrow screen, and a fixed 82px would have left the
  // navbar overlapping the second line.
  useEffect(() => {
    const root = document.documentElement;
    const el = bandRef.current;
    if (!open || !el) {
      root.style.removeProperty("--band-height");
      return;
    }
    const publish = () => root.style.setProperty("--band-height", `${el.offsetHeight}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--band-height");
    };
  }, [open]);

  // Once, on mount. Not on close, not on reopen — there is no reopen.
  useEffect(() => {
    const t = window.setTimeout(() => setPulsing(false), PULSE_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          ref={bandRef}
          className={styles.band}
          role="region"
          aria-label="Announcement"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.4, ease: ease.out } }}
          transition={{ duration: 0.6, ease: ease.out }}
        >
          {/* Pattern and pulse both sit under the copy and take no pointer
              events, so the band stays one flat row to click through. */}
          <span className={styles.pattern} aria-hidden />

          <AnimatePresence>
            {pulsing && (
              <motion.span
                className={styles.pulse}
                aria-hidden
                initial={{ opacity: 0 }}
                // Breathes twice and leaves, rather than fading once — a
                // single ramp over four seconds reads as a slow gradient
                // rather than as something announcing itself.
                animate={{ opacity: [0, 1, 0.55, 0.9, 0] }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: PULSE_MS / 1000,
                  times: [0, 0.14, 0.42, 0.62, 1],
                  ease: "easeInOut",
                }}
              >
                <span className={styles.pulseLeft} />
                <span className={styles.pulseRight} />
              </motion.span>
            )}
          </AnimatePresence>

          <p className={styles.message}>{config.message}</p>

          <div className={styles.actions}>
            {/* Accent red, not --red-emergency: that one is reserved for
                genuine emergency affordances, and spending it on a
                marketing link is how it stops meaning anything. */}
            <a className={styles.link} href={config.link.href}>
              {config.link.label}
            </a>
            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Dismiss announcement"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
