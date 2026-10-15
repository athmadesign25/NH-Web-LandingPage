"use client";

/**
 * Marketing banner — a CMS-driven promotional panel that opens centred
 * over the page, dims and blurs what is behind it, and pauses any playing
 * video.
 *
 * It was a drawer arriving from an edge; it is a centred modal now, with
 * the shape as the only spatial choice. The image is full-bleed in both
 * proportions, with the copy on a scrim that fades INTO it rather than
 * meeting it at an edge — bottom-up when tall, left-to-right when wide.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import TextSweepEffect from "@/components/ui/TextSweepEffect";
import { ease } from "@/lib/motion";
import styles from "./MarketingDrawer.module.css";
import {
  type BannerConfig,
  OVERLAY_RGB,
  DESCRIPTION_COLOR,
  resolve,
} from "./types";

type Props = {
  open: boolean;
  config: BannerConfig;
  onClose: () => void;
  /**
   * Where the panel should shrink to on close, in viewport coordinates.
   * null means a plain exit. Set, the SAME element travels and shrinks
   * into the collapsed form, so the two read as one object changing shape
   * rather than one leaving and another appearing.
   */
  morphTo?: { x: number; y: number; width: number } | null;
};

/** Supplied mark for the return action. */
function ReturnIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <path d="M232,144a64.07,64.07,0,0,1-64,64H80a8,8,0,0,1,0-16h88a48,48,0,0,0,0-96H88v40a8,8,0,0,1-13.66,5.66l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,88,40V80h80A64.07,64.07,0,0,1,232,144Z" />
    </svg>
  );
}

/** The glow leads, the panel follows. */
const GLOW_LEAD = 0.5;

export default function MarketingDrawer({ open, config, onClose, morphTo }: Props) {
  const pausedRef = useRef<HTMLVideoElement[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const [sweep, setSweep] = useState(false);
  const [panelBox, setPanelBox] = useState<
    { left: number; top: number; width: number; height: number } | null
  >(null);

  useEffect(() => {
    if (!open) {
      setSweep(false);
      return;
    }

    const paused: HTMLVideoElement[] = [];
    document.querySelectorAll("video").forEach((v) => {
      if (!v.paused) {
        v.pause();
        paused.push(v);
      }
    });
    pausedRef.current = paused;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);

    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();

    // The scroll position is never touched. Fixing <body> froze the page
    // but forced scrollY to 0, which made the search composer undock and
    // then re-dock on close — a second object flying to the FAB.
    //
    // data-lenis-prevent on the scrim makes Lenis step aside rather than
    // drive the scroll itself, and once it has, an ordinary preventDefault
    // stops the native scroll underneath. Neither half works alone.
    const blockScroll = (e: Event) => {
      const path = e.composedPath?.() ?? [];
      for (const node of path) {
        if (node instanceof HTMLElement && node.hasAttribute("data-drawer-scrollable")) return;
      }
      e.preventDefault();
    };
    document.addEventListener("wheel", blockScroll, { passive: false, capture: true });
    document.addEventListener("touchmove", blockScroll, { passive: false, capture: true });

    const blockKeys = (e: KeyboardEvent) => {
      const keys = ["PageDown", "PageUp", "Home", "End", "ArrowDown", "ArrowUp", " "];
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (keys.includes(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", blockKeys, { passive: false });

    const t = window.setTimeout(() => setSweep(true), (GLOW_LEAD + 0.45) * 1000);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      document.removeEventListener("wheel", blockScroll, { capture: true });
      document.removeEventListener("touchmove", blockScroll, { capture: true });
      window.removeEventListener("keydown", blockKeys);
      lenis?.start();
      pausedRef.current.forEach((v) => v.play().catch(() => {}));
      pausedRef.current = [];
    };
  }, [open, onClose]);

  const wide = config.orientation === "horizontal";
  const art = wide ? config.image.horizontal : config.image.vertical;

  const scrimFade = wide
    ? `linear-gradient(to right,
        rgba(${OVERLAY_RGB}, 0.97) 0%,
        rgba(${OVERLAY_RGB}, 0.93) 26%,
        rgba(${OVERLAY_RGB}, 0.72) 44%,
        rgba(${OVERLAY_RGB}, 0.34) 62%,
        rgba(${OVERLAY_RGB}, 0) 82%)`
    : `linear-gradient(to top,
        rgba(${OVERLAY_RGB}, 0.97) 0%,
        rgba(${OVERLAY_RGB}, 0.9) 26%,
        rgba(${OVERLAY_RGB}, 0.6) 48%,
        rgba(${OVERLAY_RGB}, 0.22) 68%,
        rgba(${OVERLAY_RGB}, 0) 86%)`;

  /**
   * Exit. Normally the panel settles back. When collapsing, it travels to
   * the target and shrinks to its width — measured at close time from the
   * real element, so it lands on it rather than near it.
   */
  // Measured in an effect, not during render. `morphTo` is set one frame
  // BEFORE `open` flips, so this runs while the panel is still mounted —
  // which is the only moment its real box exists to be read.
  useEffect(() => {
    if (!morphTo || !panelRef.current) return;
    const r = panelRef.current.getBoundingClientRect();
    setPanelBox({ left: r.left, top: r.top, width: r.width, height: r.height });
  }, [morphTo]);

  const morphExit =
    morphTo && panelBox
      ? {
          x: morphTo.x + morphTo.width / 2 - (panelBox.left + panelBox.width / 2),
          y: morphTo.y - (panelBox.top + panelBox.height / 2),
          scale: Math.max(morphTo.width / panelBox.width, 0.04),
          opacity: 0,
          filter: "blur(3px)",
          // Longer and gentler than before: the morph is the moment this
          // interaction gets judged on, and 0.62s read as a snap.
          transition: { duration: 0.78, ease: [0.32, 0.72, 0.3, 1] as const },
        }
      : null;

  const descDelay = GLOW_LEAD + 0.45 + config.headline.parts.length * 0.14 + 0.45;
  const ctaDelay = descDelay + (config.description.enabled ? 0.16 : 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.scrim}
            onClick={onClose}
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: morphTo ? 0.6 : 0.4 } }}
            transition={{ duration: 0.4, ease: ease.out }}
          />

          <motion.div
            className={styles.glowFrame}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0.95, 0] }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{
              duration: GLOW_LEAD + 1.7,
              times: [0, 0.2, 0.45, 0.62, 1],
              ease: "easeInOut",
            }}
          >
            <span className={styles.glowAll} />
          </motion.div>

          <motion.div
            ref={panelRef}
            className={`${styles.panel} ${wide ? styles.wide : styles.tall}`}
            role="dialog"
            aria-modal="true"
            aria-label="Promotional message"
            style={{ transformOrigin: "center center" }}
            // Centred, so it grows from its own middle rather than an edge.
            initial={{ opacity: 0, scale: 0.84, y: 18, filter: "blur(16px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={
              morphExit ?? {
                opacity: 0,
                scale: 0.84,
                y: 18,
                filter: "blur(16px)",
                transition: { duration: 0.46, ease: ease.out },
              }
            }
            transition={{ duration: 0.92, delay: GLOW_LEAD, ease: [0.22, 1, 0.3, 1] as const }}
          >
            <div className={styles.traceBorder} aria-hidden />

            <Image
              key={art.src}
              src={art.src}
              alt={art.alt}
              fill
              sizes={wide ? "(max-width: 768px) 96vw, 70vw" : "(max-width: 768px) 92vw, 34vw"}
              className={wide ? styles.imageWide : styles.imageTall}
              priority
            />

            <div className={styles.innerOverlay} style={{ background: scrimFade }} aria-hidden />

            <div
              className={`${styles.content} ${wide ? styles.contentWide : styles.contentTall}`}
              data-drawer-scrollable
              data-lenis-prevent
            >
              <div className={styles.headline}>
                {config.headline.parts.map((part, i) => (
                  <span key={part.id} className={styles.headlineLine}>
                    <TextSweepEffect
                      words={[part.text]}
                      finalColor={resolve(part.colorId)}
                      sweepMs={1100}
                      delayMs={i * 140}
                      active={sweep}
                    />
                  </span>
                ))}
              </div>

              {config.description.enabled && (
                <motion.p
                  className={styles.description}
                  style={{ color: DESCRIPTION_COLOR }}
                  initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: descDelay, duration: 0.6, ease: ease.out }}
                >
                  {config.description.text}
                </motion.p>
              )}

              {config.cta.enabled && (
                <motion.a
                  href={config.cta.href}
                  className={styles.cta}
                  initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: ctaDelay, duration: 0.6, ease: ease.out }}
                >
                  {config.cta.label}
                </motion.a>
              )}
            </div>
          </motion.div>

          <motion.button
            type="button"
            onClick={onClose}
            className={`${styles.close} ${wide ? styles.closeWide : styles.closeTall}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ delay: GLOW_LEAD + 0.4, duration: 0.35, ease: ease.out }}
          >
            <ReturnIcon size={18} />
            <span className={styles.closeLabel}>Back to homepage</span>
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
}
