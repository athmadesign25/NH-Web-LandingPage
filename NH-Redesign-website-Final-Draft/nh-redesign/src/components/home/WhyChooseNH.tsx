"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ShieldCheck, Stethoscope, Microscope, Award } from "lucide-react";
import styles from "./WhyChooseNH.module.css";

const FEATURE_CARDS = [
  {
    id: "clinical-excellence",
    title: "Clinical Excellence",
    subtitle: "Protocols and tracked outcomes for safer recovery paths",
    icon: ShieldCheck,
    image: "/clinical-excellence.png",
  },
  {
    id: "top-medical-experts",
    title: "Top Medical Experts",
    subtitle: "Senior specialists for complex procedures and continuity of care",
    icon: Stethoscope,
    image: "/top-medical-experts.png",
  },
  {
    id: "advanced-technology",
    title: "Advanced Technology",
    subtitle: "Modern diagnostics and surgical platforms for precision treatment",
    icon: Microscope,
    image: "/advanced-technology.png",
  },
  {
    id: "patient-first-support",
    title: "Patient-First Support",
    subtitle: "Clear communication and care navigation for every family",
    icon: Award,
    image: "/patient-first-support.png",
  },
];

const accreditations = [
  {
    key: "jci",
    title: "JCI Accredited",
    short: "JCI",
    logo: "/Joint Commission International accreditation logo.png",
    alt: "Joint Commission International accreditation logo",
  },
  {
    key: "nabh",
    title: "NABH Certified Nursing Services",
    short: "NABH",
    logo: "/NABH certified nursing services logo.png",
    alt: "NABH certified nursing services logo",
  },
  {
    key: "nabl",
    title: "NABL Accredited Laboratories",
    short: "NABL",
    logo: "/NABL accreditation board logo.png",
    alt: "NABL accreditation board logo",
  },
  {
    key: "cap",
    title: "CAP Accredited",
    short: "CAP",
    logo: "/College of American Pathologists accredited logo.png",
    alt: "College of American Pathologists accredited logo",
  },
];

function FeatureCardItem({
  card,
  index,
  total,
}: {
  card: typeof FEATURE_CARDS[0];
  index: number;
  total: number;
}) {
  const Icon = card.icon;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const parallaxY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 12;
    const y = (e.clientY - rect.top - rect.height / 2) / 12;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const cardRadiusClass =
    index === 0
      ? styles.firstCard
      : index === total - 1
      ? styles.lastCard
      : styles.middleCard;

  return (
    <div
      className={`${styles.specialityCard} ${cardRadiusClass}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.img
        src={card.image}
        alt={card.title}
        className={styles.cardImage}
        style={{ x: parallaxX, y: parallaxY, scale: 1.08 }}
        loading="lazy"
      />
      <div className={styles.cardTextWrap}>
        {/* Bottom Area: Icon Unit right above Card Title & Subtitle */}
        <div className={styles.cardBottomContent}>
          <div className={styles.iconBox}>
            <Icon size={24} color="#FFFFFF" />
          </div>
          <span className={styles.specialityName}>{card.title}</span>
          <p className={styles.specialitySubtitle}>{card.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function WhyChooseNH() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [translateXMax, setTranslateXMax] = useState(0);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  // Calculate exact translation shift so right edge of 4th card stops aligned at right page margin
  useEffect(() => {
    const updateMax = () => {
      if (gridRef.current && gridRef.current.children.length > 0) {
        const scrollWidth = gridRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const computedStyle = window.getComputedStyle(gridRef.current);
        const paddingLeft = parseFloat(computedStyle.paddingLeft) || 32;

        // Total shift distance so 4th card's right edge stops at (viewportWidth - paddingLeft)
        const maxShift = scrollWidth - viewportWidth + paddingLeft;
        setTranslateXMax(maxShift > 0 ? -maxShift : 0);
      }
    };

    updateMax();
    const timeout = setTimeout(updateMax, 150);
    window.addEventListener("resize", updateMax);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateMax);
    };
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, translateXMax]);

  return (
    <div ref={scrollContainerRef} className={styles.scrollContainer} id="why-choose-nh">
      <section className={`section ${styles.stickySection}`}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className="section-eyebrow" style={{ color: "var(--color-primary, #034EA2)" }}>BEST IN HEALTHCARE</div>
          <h2 className={styles.sectionTitle}>Why Choose Narayana Health?</h2>
          <p className={styles.sectionSubtitle}>
            Where your health &amp; well-being comes first, always.
          </p>
        </div>

        {/* Horizontal Ribbon Track (Pinned to Page Scroll) */}
        <div className={styles.specialitiesGridWrap}>
          <motion.div
            ref={gridRef}
            className={styles.specialitiesGrid}
            style={{ x }}
          >
            {FEATURE_CARDS.map((card, idx) => (
              <FeatureCardItem
                key={card.title}
                card={card}
                index={idx}
                total={FEATURE_CARDS.length}
              />
            ))}
          </motion.div>
        </div>

        {/* Accreditation Badges Row (Transparent background, no card wrapper, new PNG logos) */}
        <div className={styles.badgesWrap}>
          <div className={styles.badgesRow}>
            {accreditations.map((item, index) => (
              <div key={item.key} className={styles.badgeItem}>
                {failedLogos[item.key] ? (
                  <div className={styles.logoFallback}>{item.short}</div>
                ) : (
                  <img
                    src={item.logo}
                    alt={item.alt}
                    className={styles.badgeLogo}
                    loading="lazy"
                    onError={() => setFailedLogos((prev) => ({ ...prev, [item.key]: true }))}
                  />
                )}
                <span className={styles.badgeTitle}>{item.title}</span>
                {index < accreditations.length - 1 && (
                  <div className={styles.badgeDivider} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
