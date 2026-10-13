"use client";

/**
 * Marketing drawer — a CMS-driven promotional panel that arrives from any
 * edge, dims and blurs the page behind it, and pauses any playing video.
 *
 * Not a conventional drawer: it sits inset from the page edges rather than
 * flush to them, which is what makes it read as a card arriving rather than
 * a panel sliding out of the chrome.
 *
 * Layout flips with the side. Left/right is a tall card — image filling it,
 * copy over a gradient at the base. Top/bottom is a WIDE card, where that
 * same treatment would stretch a portrait image across a letterbox and go
 * soft, so it becomes a horizontal split instead: image on one side, copy
 * on a scrim beside it.
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
  OVERLAY_COLORS,
  TEXT_COLORS,
  HEADLINE_SIZES,
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
  // Drives the headline sweep. Held until the drawer has arrived, so the
  // wipe reads as a separate beat rather than racing the entrance.
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

    // Scroll is deliberately NOT locked: the drawer has to be judged against
    // every section behind it, and freezing the page makes that impossible.
    const t = window.setTimeout(() => setSweep(true), (GLOW_LEAD + 0.55) * 1000);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      pausedRef.current.forEach((v) => v.play().catch(() => {}));
      pausedRef.current = [];
    };
  }, [open, onClose]);

  const overlayRgb = resolve(OVERLAY_COLORS[config.overlay.tone], config.overlay.colorId);
  const headlineSize = resolve(HEADLINE_SIZES, config.headline.sizeId);
  const textRamp = TEXT_COLORS[config.overlay.tone];
  const travel = TRAVEL[config.side];
  const horizontal = config.side === "top" || config.side === "bottom";

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

          {/* Edge glow. Pulses at the edge the drawer is about to arrive
              from, then fades once it has — so the entrance is announced
              rather than just happening. Blue and red, breathing, the way
              the iPhone power-button hold does. */}
          <motion.div
            className={`${styles.glow} ${styles[`glow_${config.side}`]}`}
            aria-hidden
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: [0, 0.9, 0.75, 0.55, 0],
              scale: [0.85, 1.06, 0.98, 1.04, 1.1],
            }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{
              duration: GLOW_LEAD + 1.5,
              times: [0, 0.22, 0.42, 0.62, 1],
              ease: "easeInOut",
            }}
          />

          <motion.div
            className={`${styles.panel} ${styles[config.side]} ${
              horizontal ? styles.horizontal : styles.vertical
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Promotional message"
            initial={{ ...travel, opacity: 0, scale: 0.92, filter: "blur(14px)" }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ ...travel, opacity: 0, scale: 0.92, filter: "blur(14px)" }}
            transition={{ duration: 0.72, delay: GLOW_LEAD, ease: ease.spring }}
          >
            <div className={styles.traceBorder} aria-hidden />

            <div className={styles.media}>
              <Image
                src={config.image.src}
                alt={config.image.alt}
                fill
                sizes={horizontal ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 92vw, 40vw"}
                className={styles.image}
                priority
              />
              {/* Vertical only: the image fades into the copy beneath it.
                  In the horizontal split the copy has its own panel. */}
              {!horizontal && (
                <div
                  className={styles.innerOverlay}
                  style={{
                    background: `linear-gradient(to top,
                      rgba(${overlayRgb}, 0.96) 0%,
                      rgba(${overlayRgb}, 0.88) 32%,
                      rgba(${overlayRgb}, 0.45) 62%,
                      rgba(${overlayRgb}, 0) 100%)`,
                  }}
                  aria-hidden
                />
              )}
            </div>

            <div
              className={styles.content}
              style={
                horizontal
                  ? {
                      background: `linear-gradient(to right,
                        rgba(${overlayRgb}, 0.92) 0%,
                        rgba(${overlayRgb}, 1) 18%,
                        rgba(${overlayRgb}, 1) 100%)`,
                    }
                  : undefined
              }
            >
              <div className={styles.headline} style={{ fontSize: headlineSize }}>
                {config.headline.parts.map((part, i) => (
                  <span
                    key={part.id}
                    className={part.breakAfter ? styles.headlineLine : styles.headlineInline}
                  >
                    {/* The same colour wipe the section titles use, so the
                        drawer's headline reads as part of the same family. */}
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
                  style={{ color: resolve(textRamp, config.description.colorId) }}
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
