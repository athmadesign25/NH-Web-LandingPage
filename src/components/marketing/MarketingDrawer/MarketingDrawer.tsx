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
};

const TRAVEL: Record<BannerConfig["side"], { x?: string; y?: string }> = {
  left: { x: "-100%" },
  right: { x: "100%" },
  top: { y: "-100%" },
  bottom: { y: "100%" },
};

/** The glow leads, the drawer follows. */
const GLOW_LEAD = 0.5;

export default function MarketingDrawer({ open, config, onClose }: Props) {
  const pausedRef = useRef<HTMLVideoElement[]>([]);
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

    // Scroll is frozen while open. Lenis owns the scroll, so stopping it is
    // what actually locks the page — overflow: hidden on body does nothing.
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = window.setTimeout(() => setSweep(true), (GLOW_LEAD + 0.55) * 1000);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      lenis?.start();
      document.body.style.overflow = prevOverflow;
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
            exit={{ opacity: 0 }}
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
            initial={{ ...travel, opacity: 0, scale: 0.92, filter: "blur(14px)" }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ ...travel, opacity: 0, scale: 0.92, filter: "blur(14px)" }}
            transition={{ duration: 0.72, delay: GLOW_LEAD, ease: ease.spring }}
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

            <div className={`${styles.content} ${wide ? styles.contentWide : styles.contentTall}`}>
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
