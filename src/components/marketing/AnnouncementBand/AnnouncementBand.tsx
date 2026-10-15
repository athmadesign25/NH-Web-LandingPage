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
import { NeatGradient } from "@firecms/neat";
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

/**
 * How far down the page the band survives. Past this it is gone, and
 * scrolling back up anywhere below the hero brings back the navbar alone.
 */
const SCROLL_OUT = 24;

/**
 * The animated ground.
 *
 * These are literals rather than var(--…) on purpose: NeatGradient feeds
 * them to a WebGL shader, and a shader cannot resolve a CSS custom
 * property. They are the palette's own values written out — white,
 * slate-50, blue-tint-50, and pale mixes of blue-brand, sky-400 and the
 * accent red over white. If the palette moves, these have to be moved
 * with it by hand.
 *
 * The reference config was built for white text on a dark ground. The
 * band carries navy ink, so every colour here is a tint rather than a
 * shade, and `backgroundColor` is the page surface rather than the
 * placeholder red.
 */
const NEAT_COLORS = [
  { color: "#FFFFFF", enabled: true }, // --white
  { color: "#F8FAFC", enabled: true }, // --slate-50
  { color: "#E0E9F4", enabled: true }, // --blue-brand over white
  { color: "#D7F2FD", enabled: true }, // --sky-400 over white
  { color: "#EEF2F7", enabled: true }, // --blue-tint-50
  { color: "#FBE6E7", enabled: true }, // the accent red, barely there
];

const NEAT_CONFIG = {
  colors: NEAT_COLORS,
  // Slower than the reference 4. On a 62px strip the full-page speed
  // read as flickering rather than drifting.
  speed: 1.6,
  horizontalPressure: 4,
  verticalPressure: 3,
  waveFrequencyX: 0,
  waveFrequencyY: 0,
  waveAmplitude: 0,
  secondaryWaveEnabled: false,
  secondaryWaveFrequencyX: 3,
  secondaryWaveFrequencyY: 3,
  secondaryWaveAmplitude: 5,
  secondaryWaveSpeed: 0.6,
  secondaryWaveAngle: 1,
  shadows: 2,
  highlights: 7,
  colorBrightness: 1,
  // Down from the reference 8: at full saturation the tints stopped
  // being tints and the copy lost its ground.
  colorSaturation: 3,
  wireframe: false,
  antialias: false,
  colorBlending: 5,
  backgroundColor: "#F8FAFC",
  backgroundAlpha: 1,
  grainScale: 0,
  grainSparsity: 0,
  grainIntensity: 0,
  grainSpeed: 0,
  resolution: 0.5,
  yOffset: -7,
  yOffsetWaveMultiplier: 1.5,
  yOffsetColorMultiplier: 1.8,
  yOffsetFlowMultiplier: 2,
  flowDistortionA: 1.8,
  flowDistortionB: 2.2,
  flowScale: 2,
  flowEase: 0.35,
  flowEnabled: false,
  enableProceduralTexture: false,
  transparentTextureVoid: false,
  textureMode: "bitmap",
  bakeEdgeSoftness: 1,
  textureVoidLikelihood: 0.29,
  textureVoidWidthMin: 120,
  textureVoidWidthMax: 420,
  textureBandDensity: 2.9,
  textureColorBlending: 0.06,
  textureSeed: 536,
  textureEase: 0.75,
  proceduralBackgroundColor: "#775454",
  textureShapeTriangles: 20,
  textureShapeCircles: 15,
  textureShapeBars: 15,
  textureShapeSquiggles: 10,
  domainWarpEnabled: false,
  domainWarpIntensity: 0,
  domainWarpScale: 3,
  vignetteIntensity: 0,
  vignetteRadius: 0.8,
  fresnelEnabled: false,
  fresnelPower: 2,
  fresnelIntensity: 0.5,
  fresnelColor: "#FFFFFF",
  iridescenceEnabled: false,
  iridescenceIntensity: 0.5,
  iridescenceSpeed: 1,
  prismEdgeEnabled: false,
  prismEdgeIntensity: 0.5,
  prismEdgeThinness: 3,
  prismEdgeSpread: 1,
  prismEdgeSpeed: 0.5,
  prismEdgeRipple: 1,
  bloomIntensity: 0,
  bloomThreshold: 0.7,
  chromaticAberration: 0,
  shapeType: "plane",
  shapeRotationX: 0,
  shapeRotationY: 0,
  shapeRotationZ: 0,
  shapeAutoRotateSpeedX: 0,
  shapeAutoRotateSpeedY: 0,
  sphereRadius: 15,
  torusRadius: 15,
  torusTube: 5,
  cylinderRadius: 10,
  cylinderHeight: 40,
  planeBend: 0,
  planeTwist: 0,
  silhouetteFade: 0.25,
  cylinderFade: 0.08,
  ribbonFade: 0.05,
  flatShading: true,
  cameraLock: true,
  cameraX: 0,
  cameraY: 0,
  cameraZ: 0,
  cameraRotationX: 0,
  cameraRotationY: 0,
  cameraRotationZ: 0,
  cameraZoom: 1,
};

export default function AnnouncementBand({ config = DEFAULT_BAND }: { config?: BandConfig }) {
  const [open, setOpen] = useState(true);
  const [pulsing, setPulsing] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const bandRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  /**
   * The gradient lives and dies with the visible band.
   *
   * It has to be destroyed, not just hidden: the band unmounts on every
   * scroll away from the top and remounts on the way back, and a WebGL
   * context that is never released accumulates until the browser starts
   * dropping the oldest one.
   */
  useEffect(() => {
    if (!shown || !canvasRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let gradient: NeatGradient | null = null;
    try {
      gradient = new NeatGradient({
        ...(NEAT_CONFIG as unknown as Omit<
          ConstructorParameters<typeof NeatGradient>[0],
          "ref"
        >),
        ref: canvasRef.current,
      });
    } catch {
      // No WebGL, or no context left to give. The CSS gradient under the
      // canvas is already the right colour, so there is nothing to do.
      return;
    }
    return () => gradient?.destroy();
  }, [shown]);

  // Leave nothing behind for the next route.
  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty("--band-height");
    };
  }, []);

  // Once, on mount. Not on close, not on reopen — there is no reopen.
  useEffect(() => {
    const t = window.setTimeout(() => setPulsing(false), PULSE_MS);
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
          {/* The animated ground. The CSS gradient on .band stays underneath
              as the fallback — if WebGL is unavailable or reduced motion is
              on, no canvas is created and the band still looks finished. */}
          <canvas ref={canvasRef} className={styles.neat} aria-hidden />

          {/* Pattern, inner shading and pulse all sit under the copy and
              take no pointer events, so the band stays one flat row to
              click through. */}
          <span className={styles.pattern} aria-hidden />
          <span className={styles.innerEdge} aria-hidden />

          <AnimatePresence>
            {pulsing && (
              <motion.span
                className={styles.pulse}
                aria-hidden
                initial={{ opacity: 0 }}
                // Breathes twice and leaves, rather than fading once — a
                // single ramp over four seconds reads as a slow gradient
                // rather than as something announcing itself.
                //
                // Halved from [0, 1, 0.55, 0.9, 0] when the second edge
                // arrived — running both at full strength turned an accent
                // into a stripe across the top of the page — then taken
                // down another 20%.
                animate={{ opacity: [0, 0.4, 0.22, 0.36, 0] }}
                // Its own exit transition. Without one Framer reuses the
                // `transition` prop below, so the span spent another 4.6s
                // animating from 0 opacity to 0 opacity — invisible, but
                // it kept a will-change layer alive for twice as long as
                // the pulse itself.
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{
                  duration: PULSE_MS / 1000,
                  times: [0, 0.14, 0.42, 0.62, 1],
                  ease: "easeInOut",
                }}
              >
                <span className={styles.pulseTop} />
                <span className={styles.pulseBottom} />
              </motion.span>
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
