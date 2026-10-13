"use client";

/**
 * Marketing drawer — a CMS-driven promotional panel that arrives from any
 * edge, dims and blurs the page behind it, and pauses any playing video.
 *
 * Not a conventional drawer: it sits inset from the page edges rather than
 * flush to them, which is what makes it read as a card arriving rather than
 * a panel sliding out of the chrome.
 *
 * The image is full-bleed in both orientations, with the copy sitting on a
 * scrim that fades INTO it rather than meeting it at an edge. Which axis
 * that scrim runs along changes with the shape: a tall drawer fades from
 * the bottom, a wide one from the left.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import TextSweepEffect from "@/components/ui/TextSweepEffect";
import { ease } from "@/lib/motion";
import styles from "./MarketingDrawer.module.css";
import {
  type BannerConfig,
  OVERLAY_RGB,
  TEXT_COLORS,
  DESCRIPTION_COLOR,
  resolve,
} from "./types";

type Props = {
  open: boolean;
  config: BannerConfig;
  onClose: () => void;
  /**
   * Where the panel should shrink to on close, in viewport coordinates.
   * null means a plain exit — the drawer retreats the way it arrived.
   * Set, the SAME element travels and shrinks into the collapsed form, so
   * the two read as one object changing shape rather than one leaving and
   * another appearing.
   */
  morphTo?: { x: number; y: number; width: number } | null;
};

/**
 * Entry travel, deliberately SHORT. At -100% the panel crossed its own
 * width before arriving and the scale change was invisible underneath it,
 * so the whole thing read as a plain slide. A quarter of the distance lets
 * the growth carry the movement instead.
 */
const TRAVEL: Record<BannerConfig["side"], { x?: string; y?: string }> = {
  left: { x: "-26%" },
  right: { x: "26%" },
  top: { y: "-26%" },
  bottom: { y: "26%" },
};

/** Grow OUT of the edge it arrives from, rather than from its own middle. */
const ORIGIN: Record<BannerConfig["side"], string> = {
  left: "left center",
  right: "right center",
  top: "center top",
  bottom: "center bottom",
};

/** The glow leads, the drawer follows. */
const GLOW_LEAD = 0.5;

export default function MarketingDrawer({ open, config, onClose, morphTo }: Props) {
  const pausedRef = useRef<HTMLVideoElement[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const [sweep, setSweep] = useState(false);

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

    // ── Scroll lock ──────────────────────────────────────────────────
    // Lenis owns the wheel. It cancels the native event and drives the
    // scroll itself, so the usual overflow locks have nothing to clamp —
    // measured: isStopped true with overflow hidden on both <html> and
    // <body>, and the page still moved 3,199px.
    //
    // Fixing <body> did hold it, but fought Lenis on the way out: the page
    // jumped to the top on close because Lenis restarted from a position it
    // had never been told about.
    //
    // So the wheel is cancelled in the CAPTURE phase, before Lenis's own
    // listener sees it, and Lenis is stopped so nothing is left driving the
    // position. Nothing is mutated on <body>, so there is nothing to
    // restore and no jump.
    const lenis = (window as unknown as {
      lenis?: { stop: () => void; start: () => void };
    }).lenis;
    lenis?.stop();

    // Lenis drives the scroll position itself, so cancelling the wheel does
    // not hold it — measured, the page still moved 1800 -> 4192 with the
    // capture-phase blocker in place. Taking <body> out of the scroll flow
    // is what actually freezes it; the offset keeps the page looking
    // exactly where it was.
    const body = document.body;
    const lockedY = window.scrollY;
    const prevStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${lockedY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    const blockScroll = (e: Event) => {
      const path = e.composedPath?.() ?? [];
      for (const node of path) {
        if (node instanceof HTMLElement && node.hasAttribute("data-drawer-scrollable")) return;
      }
      e.preventDefault();
    };
    document.addEventListener("wheel", blockScroll, { passive: false, capture: true });
    document.addEventListener("touchmove", blockScroll, { passive: false, capture: true });
    // Keys scroll too, and they never go near the wheel handler.
    const blockKeys = (e: KeyboardEvent) => {
      const keys = ["PageDown", "PageUp", "Home", "End", "ArrowDown", "ArrowUp", " "];
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (keys.includes(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", blockKeys, { passive: false });

    const t = window.setTimeout(() => setSweep(true), (GLOW_LEAD + 0.55) * 1000);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      document.removeEventListener("wheel", blockScroll, { capture: true });
      document.removeEventListener("touchmove", blockScroll, { capture: true });
      window.removeEventListener("keydown", blockKeys);

      // Order matters on the way out. Un-fixing <body> drops the page to
      // scroll 0, so the position is handed back natively FIRST, and Lenis
      // is only restarted on the next frame — restarting it any earlier
      // made it resync to 0 and the page jumped to the top.
      Object.assign(body.style, prevStyle);
      window.scrollTo(0, lockedY);
      requestAnimationFrame(() => {
        const l = (window as unknown as {
          lenis?: {
            start: () => void;
            resize: () => void;
            scrollTo: (n: number, o?: object) => void;
          };
        }).lenis;
        // resize() BEFORE scrollTo. While <body> was fixed the document
        // collapsed to viewport height, and Lenis caches its scroll ceiling
        // — it only refreshes that on a debounced resize. Without this it
        // clamps the restore to a stale limit and the page lands at 0.
        l?.resize();
        l?.start();
        l?.scrollTo(lockedY, { immediate: true, force: true });
      });
      pausedRef.current.forEach((v) => v.play().catch(() => {}));
      pausedRef.current = [];
    };
  }, [open, onClose]);

  const wide = config.side === "top" || config.side === "bottom";
  const rgb = OVERLAY_RGB[config.overlay.tone];
  const textRamp = TEXT_COLORS[config.overlay.tone];
  const travel = TRAVEL[config.side];
  const art = wide ? config.image.wide : config.image.tall;

  // The scrim runs along the long axis and fades out well before the far
  // edge, so it reads as the image dissolving into colour rather than a
  // panel butted against it.
  const scrimFade = wide
    ? `linear-gradient(to right,
        rgba(${rgb}, 0.97) 0%,
        rgba(${rgb}, 0.93) 26%,
        rgba(${rgb}, 0.72) 44%,
        rgba(${rgb}, 0.34) 62%,
        rgba(${rgb}, 0) 82%)`
    : `linear-gradient(to top,
        rgba(${rgb}, 0.97) 0%,
        rgba(${rgb}, 0.9) 26%,
        rgba(${rgb}, 0.6) 48%,
        rgba(${rgb}, 0.22) 68%,
        rgba(${rgb}, 0) 86%)`;

  /**
   * Exit. Normally the drawer retreats the way it came. When it is
   * collapsing, it instead travels to the target and shrinks to its
   * width — measured at close time from the real element, so the panel
   * lands on it rather than near it.
   */
  const panelBox = panelRef.current?.getBoundingClientRect();
  const morphExit =
    morphTo && panelBox
      ? {
          x: morphTo.x + morphTo.width / 2 - (panelBox.left + panelBox.width / 2),
          y: morphTo.y - (panelBox.top + panelBox.height / 2),
          scale: Math.max(morphTo.width / panelBox.width, 0.04),
          opacity: 0,
          filter: "blur(4px)",
        }
      : null;

  const descDelay = GLOW_LEAD + 0.55 + config.headline.parts.length * 0.16 + 0.5;
  const ctaDelay = descDelay + (config.description.enabled ? 0.18 : 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.scrim}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: morphTo ? 0.45 : 0.35 } }}
            transition={{ duration: 0.35, ease: ease.out }}
          />

          {/* Edge glow. Breathes around the whole viewport so the page
              itself feels lit from outside, then concentrates on the edge
              the drawer is about to arrive from. Fades once it has. */}
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
            <span className={`${styles.glowLead} ${styles[`glow_${config.side}`]}`} />
          </motion.div>

          <motion.div
            className={`${styles.panel} ${styles[config.side]}`}
            role="dialog"
            aria-modal="true"
            aria-label="Promotional message"
            ref={panelRef}
            // Scaling toward a point outside the panel has to pivot on its
            // own centre, or the travel and the shrink fight each other.
            style={{ transformOrigin: morphExit ? "center center" : ORIGIN[config.side] }}
            // Scale carries the entrance; travel only nudges it off the edge.
            initial={{ ...travel, opacity: 0, scale: 0.72, filter: "blur(16px)" }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={
              morphExit ?? {
                ...travel,
                opacity: 0,
                scale: 0.72,
                filter: "blur(16px)",
                // Its own transition: the one below carries delay: GLOW_LEAD
                // for the entrance, and framer applies that prop to the exit
                // too — so closing sat still for half a second first.
                transition: { duration: 0.5, ease: ease.out },
              }
            }
            transition={
              morphExit
                ? { duration: 0.62, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0.88, delay: GLOW_LEAD, ease: ease.spring }
            }
          >
            <div className={styles.traceBorder} aria-hidden />

            <Image
              key={art.src}
              src={art.src}
              alt={art.alt}
              fill
              sizes={wide ? "(max-width: 768px) 100vw, 96vw" : "(max-width: 768px) 96vw, 44vw"}
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
                      finalColor={resolve(textRamp, part.colorId)}
                      sweepMs={1200}
                      delayMs={i * 160}
                      active={sweep}
                    />
                  </span>
                ))}
              </div>

              {config.description.enabled && (
                <motion.p
                  className={styles.description}
                  style={{ color: DESCRIPTION_COLOR[config.overlay.tone] }}
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: descDelay, duration: 0.6, ease: ease.out }}
                >
                  {config.description.text}
                </motion.p>
              )}

              {config.cta.enabled && (
                <motion.a
                  href={config.cta.href}
                  className={`${styles.cta} ${styles[config.cta.variant]} ${
                    config.overlay.tone === "light" ? styles.onLight : styles.onDark
                  }`}
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
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
            className={`${styles.close} ${styles[`close_${config.side}`]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: GLOW_LEAD + 0.4, duration: 0.35, ease: ease.out }}
          >
            <span className={styles.closeIcon}>
              <X size={16} strokeWidth={2.5} />
            </span>
            <span className={styles.closeLabel}>Close Drawer</span>
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
}
