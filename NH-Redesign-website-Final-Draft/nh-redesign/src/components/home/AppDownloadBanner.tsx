"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Calendar, FileText, Activity, Users, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import styles from "./AppDownloadBanner.module.css";

const features = [
  {
    id: 1,
    title: "Video consultations from home",
    icon: Video,
    img: "/app-feature-image-1.png",
  },
  {
    id: 2,
    title: "Book appointments in 60 seconds",
    icon: Calendar,
    img: "/app-feature-image-1.png",
  },
  {
    id: 3,
    title: "Access your health records anytime",
    icon: FileText,
    img: "/app-feature-image-1.png",
  },
  {
    id: 4,
    title: "Track vitals and wellness reports",
    icon: Activity,
    img: "/app-feature-image-1.png",
  },
  {
    id: 5,
    title: "Manage your entire family health",
    icon: Users,
    img: "/app-feature-image-1.png",
  },
];

export default function AppDownloadBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % features.length);
  };

  const activeFeature = features[activeIndex];
  const IconComponent = activeFeature.icon;

  return (
    <section className={styles.section} id="app-download-banner">
      <motion.div
        className={styles.contentCard}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Left Side: Copy + QR & Store Downloads */}
        <div className={styles.leftCol}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            NH CARE APP
          </div>

          <h2 className={styles.title}>
            Your Health,
            <br />
            <span className={styles.titleHighlight}>Always With You.</span>
          </h2>

          <p className={styles.subtitle}>
            India&apos;s most trusted hospital app. Millions of patients use NH Care to manage their journey end-to-end from booking to recovery.
          </p>

          {/* QR & Store Buttons Row */}
          <div className={styles.downloadsRow}>
            {/* QR Box */}
            <div className={styles.qrBox}>
              <div className={styles.qrImageWrap}>
                <Image src="/qr.svg" alt="QR Code" width={120} height={120} priority className={styles.qrSvg} />
              </div>
              <span className={styles.qrLabel}>SCAN TO INSTALL</span>
            </div>

            {/* App Store & Google Play Container */}
            <div className={styles.storesContainer}>
              <a href="#" className={styles.storeBadge} tabIndex={0}>
                <img alt="Download on the App Store" src="/App%20store.svg" />
              </a>
              <a href="#" className={styles.storeBadge} tabIndex={0}>
                <img alt="Get it on Google Play" src="/Google%20play.svg" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Feature Pill + Phone + Carousel Navigation */}
        <div className={styles.rightCol}>
          {/* Top Feature Name Pill with Concentric Revolving Halo Rings */}
          <div className={styles.pillWrapper}>
            {/* Concentric Rings */}
            <div className={`${styles.concentricRing} ${styles.ring1}`} />
            <div className={`${styles.concentricRing} ${styles.ring2}`} />

            {/* Pill Container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={styles.featurePill}
              >
                <div className={styles.pillIconBg}>
                  <IconComponent className={styles.pillIcon} size={16} />
                </div>
                <span className={styles.pillText}>{activeFeature.title}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Phone Display Unit with Left/Right Navigation Arrows */}
          <div className={styles.phoneCarouselUnit}>
            {/* Left Arrow Button */}
            <button
              onClick={handlePrev}
              className={styles.carouselArrowLeft}
              aria-label="Previous feature"
              type="button"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Phone Image Container */}
            <div className={styles.phoneMockupWrap}>
              <Image
                src={activeFeature.img}
                alt={activeFeature.title}
                width={320}
                height={620}
                className={styles.phoneImg}
                priority
              />
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={handleNext}
              className={styles.carouselArrowRight}
              aria-label="Next feature"
              type="button"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
