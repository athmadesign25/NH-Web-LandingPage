"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Calendar, Smartphone } from "lucide-react";
import Lottie from "lottie-react";
import pulseAnimation from "../../../public/assets/pulse animation.json";
import styles from "./FloatingQuickActions.module.css";

export default function FloatingQuickActions() {
  const [isVisible, setIsVisible] = useState(false);
  const [darkLinks, setDarkLinks] = useState<boolean[]>([false, false]);

  const containerRef = useRef<HTMLDivElement>(null);
  const linkRef0 = useRef<HTMLAnchorElement>(null);
  const linkRef1 = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScrollAndTheme = () => {
      // Floating buttons appear after scrolling past hero section into Centre of Excellence
      const shouldBeVisible = window.scrollY >= window.innerHeight - 100;
      setIsVisible(shouldBeVisible);

      if (!shouldBeVisible || !containerRef.current) return;

      // Temporarily disable pointer events on container to sample element underneath
      const prevPointerEvents = containerRef.current.style.pointerEvents;
      containerRef.current.style.pointerEvents = "none";

      const linkRefs = [linkRef0, linkRef1];
      const newDarkState = linkRefs.map((ref) => {
        if (!ref.current) return false;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let topEl = document.elementFromPoint(centerX, centerY);

        while (topEl) {
          const className = typeof topEl.className === "string" ? topEl.className : "";
          const id = topEl.id || "";
          const tag = topEl.tagName || "";

          // Check for Leadership section (ChairmanQuote)
          if (id === "chairman-quote" || className.includes("ChairmanQuote")) {
            const sectionRect = topEl.getBoundingClientRect();
            if (rect.bottom >= sectionRect.bottom - 100) {
              return true;
            }
            return false;
          }

          // Check if top-most visible section under this link is a dark section
          if (
            id === "hero-section-search-first" ||
            className.includes("HeroSearchFirst") ||
            className.includes("CentreOfExcellence") ||
            className.includes("HealthPackages_section") ||
            className.includes("AppDownloadBanner") ||
            className.includes("Footer") ||
            tag === "FOOTER"
          ) {
            return true;
          }
          topEl = topEl.parentElement;
        }

        return false;
      });

      containerRef.current.style.pointerEvents = prevPointerEvents;
      setDarkLinks(newDarkState);
    };

    window.addEventListener("scroll", handleScrollAndTheme, { passive: true });
    window.addEventListener("resize", handleScrollAndTheme, { passive: true });
    handleScrollAndTheme();

    return () => {
      window.removeEventListener("scroll", handleScrollAndTheme);
      window.removeEventListener("resize", handleScrollAndTheme);
    };
  }, []);

  const handlePulseClick = () => {
    window.dispatchEvent(new CustomEvent("openPulseModal"));
  };

  return (
    <>
      {/* Quick Health Actions Bar (Right Vertically Centered) */}
      <div
        ref={containerRef}
        role="region"
        aria-label="Quick health actions"
        className={`${styles.container} ${isVisible ? styles.visible : styles.hidden}`}
      >
        <Link
          ref={linkRef0}
          className={`${styles.link} ${darkLinks[0] ? styles.linkOnDark : ""}`}
          href="/find-a-doctor"
        >
          <span className={styles.iconWrap}>
            <Calendar size={17} />
          </span>
          <span style={{ flexShrink: 0 }}>Book<br/>Appointment</span>
        </Link>

        <div aria-hidden="true" className={styles.divider}></div>

        <Link
          ref={linkRef1}
          className={`${styles.link} ${darkLinks[1] ? styles.linkOnDark : ""}`}
          href="#app-download"
        >
          <span className={styles.iconWrap}>
            <Smartphone size={17} />
          </span>
          <span style={{ flexShrink: 0 }}>Download<br/>NH Care App</span>
        </Link>
      </div>

      {/* Standalone Fully Rounded Floating Pulse AI Button (Bottom Right Corner) */}
      <button
        type="button"
        aria-label="Ask Pulse AI"
        onClick={handlePulseClick}
        className={`${styles.pulseFloatingBtn} ${isVisible ? styles.pulseVisible : styles.pulseHidden}`}
      >
        <div className={styles.pulseLottieWrap}>
          <Lottie animationData={pulseAnimation} className={styles.pulseLottie} loop={true} />
        </div>
      </button>
    </>
  );
}
