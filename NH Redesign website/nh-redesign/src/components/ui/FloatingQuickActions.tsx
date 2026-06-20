"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./FloatingQuickActions.module.css";

export default function FloatingQuickActions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show only after scrolling past the full-height hero section (100vh)
      setIsVisible(window.scrollY >= window.innerHeight - 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <motion.div
      role="region"
      aria-label="Quick health actions"
      initial={{ opacity: 0, x: 50, y: "-50%" }}
      animate={isVisible ? { opacity: 1, x: 0, y: "-50%" } : { opacity: 0, x: 50, y: "-50%" }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: "fixed",
        top: "50%",
        right: "24px",
        zIndex: 9000,
        pointerEvents: isVisible ? "auto" : "none",
        width: "100px",
        background: "linear-gradient(160deg, rgb(237, 28, 36) 0%, rgb(194, 18, 25) 100%)",
        borderRadius: "16px",
        boxShadow: "rgba(198, 18, 25, 0.42) 0px 8px 40px, rgba(0, 0, 0, 0.18) 0px 2px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        overflow: "hidden"
      }}
    >
      <Link className={styles.link} href="/find-a-doctor">
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

      <Link className={styles.link} href="/health-checks">
        <span className={styles.iconWrap}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </span>
        <span style={{ flexShrink: 0 }}>Book Health<br/>Check-up</span>
      </Link>

      <div aria-hidden="true" className={styles.divider}></div>

      <Link className={styles.link} href="/find-a-doctor">
        <span className={styles.iconWrap}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
            <path d="M12 5v6M9 8h6"></path>
          </svg>
        </span>
        <span style={{ flexShrink: 0 }}>Find a<br/>Hospital</span>
      </Link>
    </motion.div>
  );
}
