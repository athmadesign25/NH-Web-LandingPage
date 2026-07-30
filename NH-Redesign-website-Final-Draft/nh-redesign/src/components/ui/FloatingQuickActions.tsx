"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./FloatingQuickActions.module.css";

export default function FloatingQuickActions() {
  const [isVisible, setIsVisible] = useState(false);
  const [darkLinks, setDarkLinks] = useState<boolean[]>([false, false, false]);

  const containerRef = useRef<HTMLDivElement>(null);
  const linkRef0 = useRef<HTMLAnchorElement>(null);
  const linkRef1 = useRef<HTMLAnchorElement>(null);
  const linkRef2 = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScrollAndTheme = () => {
      // Floating button only appears after scrolling past hero section into Centre of Excellence
      const shouldBeVisible = window.scrollY >= window.innerHeight - 100;
      setIsVisible(shouldBeVisible);

      if (!shouldBeVisible || !containerRef.current) return;

      // Temporarily disable pointer events on container to sample element underneath
      const prevPointerEvents = containerRef.current.style.pointerEvents;
      containerRef.current.style.pointerEvents = "none";

      const linkRefs = [linkRef0, linkRef1, linkRef2];
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
            // As tile nears the end of Leadership section (within 100px of section bottom), swap to white
            if (rect.bottom >= sectionRect.bottom - 100) {
              return true;
            }
            return false; // Default blue text inside Leadership section
          }

          // Check if top-most visible section under this link is a dark section
          if (
            id === "hero-section-search-first" ||
            className.includes("HeroSearchFirst") ||
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

  return (
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
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"></path>
          </svg>
        </span>
        <span style={{ flexShrink: 0 }}>Book<br/>Appointment</span>
      </Link>

      <div aria-hidden="true" className={styles.divider}></div>

      <Link
        ref={linkRef1}
        className={`${styles.link} ${darkLinks[1] ? styles.linkOnDark : ""}`}
        href="/health-checks"
      >
        <span className={styles.iconWrap}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </span>
        <span style={{ flexShrink: 0 }}>Book Health<br/>Check-up</span>
      </Link>

      <div aria-hidden="true" className={styles.divider}></div>

      <Link
        ref={linkRef2}
        className={`${styles.link} ${darkLinks[2] ? styles.linkOnDark : ""}`}
        href="/find-a-doctor"
      >
        <span className={styles.iconWrap}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
            <path d="M12 5v6M9 8h6"></path>
          </svg>
        </span>
        <span style={{ flexShrink: 0 }}>Find a<br/>Hospital</span>
      </Link>
    </div>
  );
}
