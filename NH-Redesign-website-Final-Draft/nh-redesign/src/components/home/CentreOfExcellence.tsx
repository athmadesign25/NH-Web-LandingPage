"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { NeatGradient } from "@firecms/neat";
import { ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import styles from "./CentreOfExcellence.module.css";

const SPECIALTIES_DATA = [
  {
    id: "cardiac",
    name: "Cardiac Sciences",
    stats: [
      { number: "5,50,000+", label: "Consultations annually" }
    ],
    desc: "High-precision heart care—advanced procedures, surgery and critical care under one team.",
    image: "/nurse-holding-tablet-with-heart-figure-cardiology-diagnosis.png",
    slug: "/specialities/cardiology"
  },
  {
    id: "cancer",
    name: "Cancer Care",
    stats: [
      { number: "2,30,000+", label: "Consultations annually" }
    ],
    desc: "Comprehensive cancer care—multidisciplinary experts with advanced treatment and follow-up.",
    image: "/Oncology Institute.png",
    slug: "/specialities/oncology"
  },
  {
    id: "neuro",
    name: "Neuro Sciences",
    stats: [
      { number: "2,20,000", label: "Consultations Annually" }
    ],
    desc: "Expert neuro care—stroke, spine and complex neurosurgery backed by neuro-ICU and rehab.",
    image: "/Brain and Spine.png",
    slug: "/specialities/neurology"
  },
  {
    id: "renal",
    name: "Renal Sciences",
    stats: [
      { number: "2,20,000+", label: "Consultations annually" }
    ],
    desc: "Specialist kidney and urology care—transplants, dialysis and long-term follow-up under one team.",
    image: "/specialities-bg.png",
    slug: "/specialities/nephrology"
  },
  {
    id: "gastro",
    name: "Gastro Sciences",
    stats: [
      { number: "1,70,000+", label: "Consultations Annually" }
    ],
    desc: "Advanced gastro care—endoscopy, GI surgery, liver care and transplant support in one centre.",
    image: "/Digestive Health.png",
    slug: "/specialities/gastroenterology"
  },
  {
    id: "orthopaedics",
    name: "Orthopaedics",
    stats: [
      { number: "1,60,000+", label: "Consultations annually" }
    ],
    desc: "Specialist orthopaedics—joint replacement, sports injury and complex trauma care with rehab.",
    image: "/Bone & Joint.png",
    slug: "/specialities/orthopaedics"
  },
  {
    id: "image-guided",
    name: "Image Guided Therapy",
    stats: [
      { number: "33,000+", label: "Image Guided Procedures Till Date" }
    ],
    desc: "Minimally invasive treatment—precision procedures guided by advanced imaging for faster recovery",
    image: "/Hero image.png",
    slug: "/specialities/image-guided-therapy"
  },
  {
    id: "transplant",
    name: "Solid-Organ &\nBone Marrow Transplant",
    stats: [
      { number: "8,000+", label: "Solid Organ Transplants" },
      { number: "3,000+", label: "BMTs Till Date" }
    ],
    desc: "Comprehensive transplant care—end-to-end evaluation, transplant, critical care and structured follow-up.",
    image: "/doctor_patient.png",
    slug: "/specialities/transplant"
  },
  {
    id: "robotic",
    name: "Robotic Surgery",
    stats: [
      { number: "5,000+", label: "Robotic Surgeries Performed Till Date" }
    ],
    desc: "Robot-assisted surgery—high precision across key specialties with faster recovery support.",
    image: "/Advance Heart Care.png",
    slug: "/specialities/robotic-surgery"
  }
];

const DIAL_ITEM_GAP = 28;
const DIAL_ITEM_HEIGHT = 40.32;

const dialItemVariants = {
  initial: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? 14 : -14,
    filter: "blur(4px)",
  }),
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? -14 : 14,
    filter: "blur(4px)",
  }),
};

export default function CentreOfExcellence() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleTrackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<NeatGradient | null>(null);

  const [activeIndex, setActiveIndex] = useState(0); // Initial focus: Cardiac Sciences (index 0)
  const [scrollDirection, setScrollDirection] = useState<number>(1); // 1 = next/down, -1 = prev/up
  const [lastUserInteraction, setLastUserInteraction] = useState<number>(0);

  // Autoplay with click jitter prevention (resumes 8s after user interaction)
  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - lastUserInteraction < 8000) return;
      setScrollDirection(1);
      setActiveIndex((prev) => (prev + 1) % SPECIALTIES_DATA.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [lastUserInteraction]);

  // Scroll progress ONLY for the top title section
  const { scrollYProgress: titleScrollProgress } = useScroll({
    target: titleTrackRef,
    offset: ["start start", "end end"]
  });

  // Top Section Scroll Animations (Sequential Staggered Reveal)
  const eyebrowOpacity = useTransform(titleScrollProgress, [0.02, 0.16], [0, 1]);
  const eyebrowY = useTransform(titleScrollProgress, [0.02, 0.16], [22, 0]);
  const eyebrowBlurVal = useTransform(titleScrollProgress, [0.02, 0.16], [16, 0]);
  const eyebrowFilter = useTransform(eyebrowBlurVal, (v) => `blur(${v}px)`);

  const titleOpacity = useTransform(titleScrollProgress, [0.16, 0.36], [0, 1]);
  const titleY = useTransform(titleScrollProgress, [0.16, 0.36], [22, 0]);
  const titleBlurVal = useTransform(titleScrollProgress, [0.16, 0.36], [16, 0]);
  const titleFilter = useTransform(titleBlurVal, (v) => `blur(${v}px)`);

  const subtitleOpacity = useTransform(titleScrollProgress, [0.36, 0.58], [0, 1]);
  const subtitleY = useTransform(titleScrollProgress, [0.36, 0.58], [22, 0]);
  const subtitleBlurVal = useTransform(titleScrollProgress, [0.36, 0.58], [16, 0]);
  const subtitleFilter = useTransform(subtitleBlurVal, (v) => `blur(${v}px)`);

  // Progress stroke fills from 0% to 100% as user scrolls through text sequence
  const strokeDashoffset = useTransform(titleScrollProgress, [0.02, 0.72], [84.823, 0]);

  // Indicator appears at start and fully disappears cleanly at end (0.75 to 0.88)
  const indicatorOpacity = useTransform(titleScrollProgress, [0.02, 0.16, 0.78, 0.88], [0, 1, 1, 0]);
  const indicatorY = useTransform(titleScrollProgress, [0.02, 0.16, 0.78, 0.88], [22, 0, 0, -14]);
  const indicatorBlurVal = useTransform(titleScrollProgress, [0.02, 0.16, 0.78, 0.88], [16, 0, 0, 0]);
  const indicatorFilter = useTransform(indicatorBlurVal, (v) => `blur(${v}px)`);

  useEffect(() => {
    if (!canvasRef.current) return;

    const config = {
      colors: [
        { color: '#07284E', enabled: true },
        { color: '#3D0F0F', enabled: true },
        { color: '#0D1628', enabled: true },
        { color: '#002E64', enabled: true },
        { color: '#1A275A', enabled: true },
      ],
      speed: 2,
      horizontalPressure: 4,
      verticalPressure: 4,
      waveFrequencyX: 3,
      waveFrequencyY: 2,
      waveAmplitude: 1,
      shadows: 2,
      highlights: 2,
      colorBrightness: 1,
      colorSaturation: -1,
      wireframe: false,
      colorBlending: 7,
      backgroundColor: '#010101',
      backgroundAlpha: 1,
      grainScale: 2,
      grainSparsity: 0,
      grainIntensity: 0,
      grainSpeed: 1,
      resolution: 0.75,
      yOffset: 109,
      yOffsetWaveMultiplier: 2.2,
      yOffsetColorMultiplier: 2.5,
      yOffsetFlowMultiplier: 2.8,
      flowDistortionA: 0.4,
      flowDistortionB: 3,
      flowScale: 3.3,
      flowEase: 0.53,
      flowEnabled: false,
      enableProceduralTexture: false,
      transparentTextureVoid: false,
      textureVoidLikelihood: 0.06,
      textureVoidWidthMin: 10,
      textureVoidWidthMax: 500,
      textureBandDensity: 0.8,
      textureColorBlending: 0.06,
      textureSeed: 333,
      textureEase: 0.68,
      proceduralBackgroundColor: '#003FFF',
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
      fresnelColor: '#FFFFFF',
      iridescenceEnabled: false,
      iridescenceIntensity: 0.5,
      iridescenceSpeed: 1,
      bloomIntensity: 0,
      bloomThreshold: 0.7,
      chromaticAberration: 0,
      shapeType: 'plane',
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

    gradientRef.current = new NeatGradient({
      ref: canvasRef.current,
      ...(config as any),
    });

    const handleScroll = () => {
      if (gradientRef.current) {
        gradientRef.current.yOffset = window.scrollY;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      gradientRef.current?.destroy();
    };
  }, []);

  const handlePrev = () => {
    setLastUserInteraction(Date.now());
    setScrollDirection(-1);
    setActiveIndex((prev) => (prev - 1 + SPECIALTIES_DATA.length) % SPECIALTIES_DATA.length);
  };

  const handleNext = () => {
    setLastUserInteraction(Date.now());
    setScrollDirection(1);
    setActiveIndex((prev) => (prev + 1) % SPECIALTIES_DATA.length);
  };

  const handleSelect = (targetIndex: number) => {
    setLastUserInteraction(Date.now());
    let diff = targetIndex - activeIndex;
    const half = Math.floor(SPECIALTIES_DATA.length / 2);
    if (diff > half) diff -= SPECIALTIES_DATA.length;
    if (diff < -half) diff += SPECIALTIES_DATA.length;
    setScrollDirection(diff >= 0 ? 1 : -1);
    setActiveIndex(targetIndex);
  };

  const activeItem = SPECIALTIES_DATA[activeIndex];

  // 5 fixed vertical slots centered around offset 0 (middle slot)
  const slots = [-2, -1, 0, 1, 2].map((offset) => {
    const specIndex = (activeIndex + offset + SPECIALTIES_DATA.length * 10) % SPECIALTIES_DATA.length;
    return {
      offset,
      specIndex,
      item: SPECIALTIES_DATA[specIndex],
    };
  });

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {/* Seamless NeatGradient animated mesh background */}
      <canvas ref={canvasRef} className={styles.neatCanvas} />

      {/* 1. Dedicated Pinned Title Intro Section (Isolated Scroll Track) */}
      <div ref={titleTrackRef} className={styles.scrollTrack}>
        <section ref={sectionRef} className={styles.section} id="centre-of-excellence">
          <div className={styles.centerContent}>
            <div className={styles.header}>
              <motion.div 
                style={{ 
                  opacity: eyebrowOpacity, 
                  y: eyebrowY, 
                  filter: eyebrowFilter, 
                  color: "rgba(255, 255, 255, 0.95)", 
                  marginBottom: "24px" 
                }} 
                className="section-eyebrow"
              >
                CENTRES OF EXCELLENCE
              </motion.div>
              <motion.h2 
                style={{ 
                  opacity: titleOpacity, 
                  y: titleY, 
                  filter: titleFilter 
                }} 
                className={styles.sectionTitle}
              >
                40+ Specialities. World-Class Care.
              </motion.h2>
              <motion.p 
                style={{ 
                  opacity: subtitleOpacity, 
                  y: subtitleY, 
                  filter: subtitleFilter 
                }} 
                className={`section-subtitle ${styles.sectionSubtitle}`}
              >
                Integrated expertise across tertiary and quaternary care,
                <br />
                delivered through one trusted network.
              </motion.p>
            </div>
          </div>

          {/* Scroll Progress Indicator Unit */}
          <motion.div
            className={styles.scrollIndicatorUnit}
            style={{
              opacity: indicatorOpacity,
              y: indicatorY,
              filter: indicatorFilter,
            }}
          >
            <div className={styles.arrowCircleWrap}>
              <svg
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.arrowSvg}
              >
                <rect x="0.5" y="0.5" width="28" height="28" rx="14" fill="url(#paint0_linear_419_1267)" fillOpacity="0.08"/>
                <rect x="0.5" y="0.5" width="28" height="28" rx="14" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
                <motion.circle
                  cx="14.5"
                  cy="14.5"
                  r="13.5"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="84.823"
                  style={{ strokeDashoffset }}
                  transform="rotate(-90 14.5 14.5)"
                />
                <path
                  d="M14.8863 19.9376V10.5801L18.4703 14.178C18.5538 14.2406 18.6571 14.271 18.7612 14.2636C18.8653 14.2562 18.9633 14.2115 19.0371 14.1377C19.1109 14.0639 19.1556 13.9659 19.163 13.8618C19.1704 13.7577 19.14 13.6544 19.0773 13.571L14.8031 9.28801C14.722 9.20856 14.6131 9.16406 14.4996 9.16406C14.3861 9.16406 14.2771 9.20856 14.1961 9.28801L9.91744 13.5666C9.85482 13.6501 9.82442 13.7534 9.83182 13.8575C9.83922 13.9616 9.88392 14.0596 9.95772 14.1334C10.0315 14.2072 10.1295 14.2519 10.2336 14.2593C10.3377 14.2667 10.441 14.2363 10.5245 14.1736L14.0218 10.5801V19.9376C14.0218 20.0526 14.0674 20.1629 14.1487 20.2442C14.2301 20.3255 14.3403 20.3712 14.4553 20.3712C14.5703 20.3712 14.6806 20.3255 14.7619 20.2442C14.8432 20.1629 14.8889 20.0526 14.8889 19.9376H14.8863Z"
                  fill="#C1C1C1"
                  stroke="#C1C1C1"
                  strokeWidth="0.4"
                />
                <defs>
                  <linearGradient id="paint0_linear_419_1267" x1="14.5" y1="0.5" x2="14.5" y2="28.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#999999"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className={styles.scrollUpText}>Scroll Up</span>
          </motion.div>
        </section>
      </div>

      {/* 2. Carousel Section */}
      <section className={styles.carouselSection}>
        <div className={styles.carouselContainer}>
          {/* Left Interaction Unit: Fixed 5-Slot Directional Dial */}
          <div className={styles.interactionUnit}>
            <button
              type="button"
              onClick={handlePrev}
              className={styles.arrowBtn}
              aria-label="Previous Specialty"
            >
              <ChevronUp size={16} />
            </button>

            <div className={styles.specialtiesDialList}>
              {slots.map(({ offset, specIndex, item }) => {
                const isFocused = offset === 0;
                const isAdjacent = Math.abs(offset) === 1;

                return (
                  <div key={`slot-${offset}`} className={styles.dialSlot}>
                    <AnimatePresence mode="popLayout" custom={scrollDirection}>
                      <motion.button
                        key={`${item.id}-${specIndex}`}
                        type="button"
                        custom={scrollDirection}
                        onClick={() => handleSelect(specIndex)}
                        className={`${styles.dialItem} ${
                          isFocused
                            ? styles.focusedDialItem
                            : isAdjacent
                            ? styles.adjacentDialItem
                            : styles.outerDialItem
                        }`}
                        variants={dialItemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {item.name}
                      </motion.button>
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className={styles.arrowBtn}
              aria-label="Next Specialty"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Right Image Container */}
          <div className={styles.imageContainer}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                className={styles.imageWrap}
                initial={{ opacity: 0, filter: "blur(16px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(16px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={activeItem.image}
                  alt={activeItem.name}
                  className={styles.carouselImage}
                />
                <div className={styles.imageVignetteOverlay} />
              </motion.div>
            </AnimatePresence>

            {/* Content Unit inside Image Container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                className={styles.contentUnit}
                initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.glassStatRow}>
                  {activeItem.stats.map((st, i) => (
                    <div key={i} className={styles.glassStatCard}>
                      <span className={styles.glassStatNumber}>{st.number}</span>
                      <span className={styles.glassStatSub}>{st.label}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.contentDesc}>{activeItem.desc}</p>
                <a href={activeItem.slug} className={styles.knowMoreLink}>
                  Know More
                  <ChevronRight size={16} className={styles.knowMoreArrow} />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Centrally Aligned View All Specialties Button */}
        <div className={styles.bottomCtaWrap}>
          <a href="/specialities" className={styles.viewAllBtn}>
            View All Specialties
            <ChevronRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
