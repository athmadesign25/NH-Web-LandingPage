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
 * Entrance is a single light wipe across the band, then nothing. It runs
 * once per page load and is not repeatable from the UI — the band is an
 * object that was already there, not one that keeps arriving.
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

/**
 * The entry wipe: how long the light takes to cross the band, and how
 * long to wait first so the band has finished dropping in.
 */
const WIPE_MS = 1300;
const WIPE_DELAY_MS = 420;

/**
 * How far down the page the band survives. Past this it is gone, and
 * scrolling back up anywhere below the hero brings back the navbar alone.
 */
const SCROLL_OUT = 24;

export default function AnnouncementBand({ config = DEFAULT_BAND }: { config?: BandConfig }) {
  const [open, setOpen] = useState(true);
  const [wiping, setWiping] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const bandRef = useRef<HTMLElement>(null);

  // The band belongs to the hero, not to the page. Once you are reading a
  // section it has had its turn, and the navbar is the only thing that
  // should come back on the way up.
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= SCROLL_OUT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shown = open && atTop;

  // The navbar is fixed at `top: var(--band-height, 0px)`. Publishing the
  // height from here rather than hard-coding it there keeps every route
  // without a band at 0 with no second rule.
  //
  // Measured, not assumed: the band is 62px on desktop but grows when the
  // message wraps on a narrow screen, and a fixed 62px would have left the
  // navbar overlapping the second line.
  useEffect(() => {
    const root = document.documentElement;
    const el = bandRef.current;
    if (!shown || !el) {
      // Not removed — set to 0, so the navbar glides up with the band
      // instead of jumping the moment it unmounts.
      root.style.setProperty("--band-height", "0px");
      return;
    }
    const publish = () => root.style.setProperty("--band-height", `${el.offsetHeight}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, [shown]);

  // Leave nothing behind for the next route.
  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty("--band-height");
    };
  }, []);

  // Once, on mount. Not on close, not on reopen — there is no reopen.
  useEffect(() => {
    const t = window.setTimeout(() => setWiping(false), WIPE_DELAY_MS + WIPE_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {shown && (
        <motion.aside
          ref={bandRef}
          className={styles.band}
          role="region"
          aria-label="Announcement"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.35, ease: ease.out } }}
          transition={{ duration: 0.6, ease: ease.out }}
        >
          {/* Pattern, inner shading and wipe all sit under the copy and
              take no pointer events, so the band stays one flat row to
              click through. */}
          <span className={styles.pattern} aria-hidden />
          <span className={styles.innerEdge} aria-hidden />

          {/* Entry wipe. A light crosses the band once as it arrives — the
              same gesture as the hover wipe on the copy, at the scale of
              the whole surface. It replaces an edge pulse, which announced
              the band by outlining it rather than by moving across it.

              Transform, not background-position: this one spans the full
              width, and a composited translate is cheaper than repainting
              a gradient every frame. */}
          <AnimatePresence>
            {wiping && (
              <motion.span
                className={styles.entryWipe}
                aria-hidden
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{
                  duration: WIPE_MS / 1000,
                  delay: WIPE_DELAY_MS / 1000,
                  // Linear, for the same reason the copy's wipe is: an
                  // eased curve front-loads the travel and the light is
                  // past before the eye has found it.
                  ease: "linear",
                }}
              />
            )}
          </AnimatePresence>

          {/* data-text duplicates the copy into a ::after that carries the
              hover wipe. The sweep is a gradient clipped to glyphs, and a
              gradient needs its own box to travel across — it cannot be
              applied to the live text without replacing its colour. */}
          <p className={styles.message} data-text={config.message}>
            {config.message}
          </p>

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
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
