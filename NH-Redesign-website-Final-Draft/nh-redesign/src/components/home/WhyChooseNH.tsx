"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./WhyChooseNH.module.css";

const featureCards = [
  {
    video: "/6254600_Person_People_1280x720.mp4",
    title: "Clinical Excellence",
    descriptionLines: ["Protocols and tracked outcomes", "for safer recovery paths"],
  },
  {
    image: "/whychoose/experts.png",
    title: "Top Medical Experts",
    descriptionLines: ["Senior specialists for complex", "procedures and continuity of care"],
  },
  {
    image: "/whychoose/technology.png",
    title: "Advanced Technology",
    descriptionLines: ["Modern diagnostics and surgical", "platforms for precision treatment"],
  },
  {
    video: "/NH YT Vid 03.mp4",
    title: "Patient-First Support",
    descriptionLines: ["Clear communication and care", "navigation for every family"],
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

export default function WhyChooseNH() {
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  return (
    <section className={styles.section} id="why-choose-nh">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className="section-eyebrow" style={{ color: "#034EA2" }}>
            BEST IN HEALTHCARE
          </div>
          <h2 className={styles.sectionTitle}>Why Choose Narayana Health?</h2>
          <p className={styles.headerSubtitle}>
            Where your health &amp; well-being comes first, always.
          </p>
        </div>

        {/* 4 Staggered Feature Cards with Image/Video Directional Hover Tilt */}
        <div className={styles.featuresGrid}>
          {featureCards.map((card, index) => (
            <motion.article
              key={card.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.featureIllustration}>
                {card.video ? (
                  <div className={styles.videoWrapper}>
                    <video
                      src={card.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className={styles.featureVideo}
                    />
                  </div>
                ) : (
                  <img
                    src={card.image}
                    alt={card.title}
                    className={styles.featureImage}
                    loading="lazy"
                  />
                )}
              </div>
              <h3 className={styles.featureTitle}>{card.title}</h3>
              <p className={styles.featureDescription}>
                {card.descriptionLines.map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Accreditation Badges Row preserved from working repo */}
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
      </div>
    </section>
  );
}
