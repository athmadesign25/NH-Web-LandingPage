"use client";

/**
 * Marketing drawer — a CMS-driven promotional panel that slides in from any
 * edge, dims and blurs the page behind it, and pauses any playing video.
 *
 * Not a conventional drawer: it sits inset from the page edges rather than
 * flush to them, which is what makes it read as a card arriving rather than
 * a panel sliding out of the chrome.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import { duration, ease } from "@/lib/motion";
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

/** Axis the drawer travels on, and which way. */
const TRAVEL: Record<BannerConfig["side"], { x?: string; y?: string }> = {
  left: { x: "-100%" },
  right: { x: "100%" },
  top: { y: "-100%" },
  bottom: { y: "100%" },
};

export default function MarketingDrawer({ open, config, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Remembers which videos WE paused, so closing resumes only those and
  // does not start something the visitor had deliberately paused.
  const pausedRef = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    if (!open) return;

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

    // Lenis owns the scroll, so stopping it is what actually locks the page.
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();

    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
      pausedRef.current.forEach((v) => v.play().catch(() => {}));
      pausedRef.current = [];
    };
  }, [open, onClose]);

  const overlayRgb = resolve(OVERLAY_COLORS[config.overlay.tone], config.overlay.colorId);
  const headlineSize = resolve(HEADLINE_SIZES, config.headline.sizeId);
  const textRamp = TEXT_COLORS[config.overlay.tone];
  const travel = TRAVEL[config.side];

  // Copy sits after the headline; each element waits for the one before it.
  const descDelay = config.headline.parts.length * 0.18 + 0.35;
  const ctaDelay = descDelay + (config.description.enabled ? 0.22 : 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim. Dims and blurs everything behind, including the video
              that was just paused. */}
          <motion.div
            className={styles.scrim}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.emphasis, ease: ease.out }}
          />

          <motion.div
            ref={panelRef}
            className={`${styles.panel} ${styles[config.side]}`}
            role="dialog"
            aria-modal="true"
            aria-label="Promotional message"
            // Grows and un-blurs in from the chosen edge rather than simply
            // sliding, so it reads like the section reveals elsewhere.
            initial={{ ...travel, opacity: 0, scale: 0.92, filter: "blur(14px)" }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ ...travel, opacity: 0, scale: 0.92, filter: "blur(14px)" }}
            transition={{ duration: 0.72, ease: ease.spring }}
          >
            {/* Same rotating conic trace the search experience uses, so the
                two read as the same family. */}
            <div className={styles.traceBorder} aria-hidden />

            <Image
              src={config.image.src}
              alt={config.image.alt}
              fill
              sizes="(max-width: 768px) 92vw, 40vw"
              className={styles.image}
              priority
            />

            {/* Reads as the image fading into the copy rather than a band
                laid on top of it — hence the gradient rather than a fill. */}
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

            <div className={styles.content}>
              <div className={styles.headline} style={{ fontSize: headlineSize }}>
                {config.headline.parts.map((part, i) => (
                  <span
                    key={part.id}
                    className={part.breakAfter ? styles.headlineLine : styles.headlineInline}
                    style={{ color: resolve(textRamp, part.colorId) }}
                  >
                    <SplitText text={part.text} tag="span" delay={i * 0.18} once={false} />
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

          {/* Close sits just outside the drawer, on whichever side has room. */}
          <motion.button
            type="button"
            onClick={onClose}
            className={`${styles.close} ${styles[`close_${config.side}`]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.35, duration: duration.emphasis, ease: ease.out }}
          >
            <span className={styles.closeIcon}>
              <X size={16} strokeWidth={2.5} />
            </span>
            Close Drawer
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
}
