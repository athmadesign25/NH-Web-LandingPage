"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./ChairmanQuote.module.css";

export default function ChairmanQuote() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Subtle mouse-interactive parallax offset calculation (-8px to +8px max)
  const parallaxX = isHovered && cardRef.current
    ? ((mousePos.x - cardRef.current.clientWidth / 2) / (cardRef.current.clientWidth / 2)) * -8
    : 0;

  const parallaxY = isHovered && cardRef.current
    ? ((mousePos.y - cardRef.current.clientHeight / 2) / (cardRef.current.clientHeight / 2)) * -8
    : 0;

  return (
    <section className={styles.section} id="chairman-quote">
      <div className="container">
        <motion.div
          ref={cardRef}
          className={styles.cardWrapper}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Base 20px Outer Glass Border */}
          <div className={styles.outerGlassFrame} />

          {/* Mouse-tracking whisper-subtle whiter glass glow on 20px outer border layer */}
          <div
            className={styles.borderGlowFrame}
            style={{
              opacity: isHovered ? 0.85 : 0,
              background: `radial-gradient(280px circle at ${mousePos.x + 20}px ${mousePos.y + 20}px, rgba(255, 255, 255, 0.45) 0%, rgba(200, 225, 255, 0.20) 45%, transparent 80%)`,
            }}
          />

          {/* Inner Content Card */}
          <div className={styles.card}>
            {/* Left Column: Dark Typography */}
            <motion.div
              className={styles.content}
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.eyebrow}>
                LEADERSHIP
                <span className={styles.eyebrowLine} />
              </div>

              <motion.h2
                className={styles.quote}
                initial={{ opacity: 0, y: 22, filter: "blur(16px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                Healthcare must move beyond buildings and beds.
              </motion.h2>

              <motion.p
                className={styles.body}
                initial={{ opacity: 0, y: 22, filter: "blur(16px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                The future lies in integrated systems that unite clinical excellence, digital
                intelligence, and human insight. When technology and care move as one, health shifts
                from episodic treatment to lifelong partnership, anticipating risk, enabling
                prevention, and creating a system that is connected, predictive, and truly
                transformative.
              </motion.p>
            </motion.div>

            {/* Right Column: Dr. Devi Shetty Video + Overlay Identity Badge */}
            <div className={styles.imageWrap}>
              <motion.div
                className={styles.imageFrame}
                initial={{ opacity: 0, x: 28, scale: 0.97 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                {/* Subtle mouse-interactive parallax video container */}
                <motion.video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={styles.video}
                  src="/DrShettyVideo.MOV"
                  animate={{
                    x: parallaxX,
                    y: parallaxY,
                    scale: 1.08,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                    mass: 0.5,
                  }}
                />

                <div className={styles.identityPill}>
                  <span className={styles.name}>Dr. Devi Prasad Shetty</span>
                  <span className={styles.title}>Founder and Chairman, Narayana Health</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
