"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Quote } from "lucide-react";
import React, { useRef } from "react";
import styles from "./PatientStories.module.css";

const stories = [
  {
    id: "story-1",
    name: "Priya & Ramesh Kumar",
    location: "Bengaluru, India",
    condition: "Cardiac Surgery",
    quote: "The team at Narayana Health gave my husband a second chance at life. The care was exceptional — from diagnosis to recovery, every step was handled with the utmost precision and compassion.",
    image: "/assets/patient_1.png",
    rating: 5,
  },
  {
    id: "story-2",
    name: "Mohammed Al-Farsi",
    location: "Dubai, UAE",
    condition: "Bone Marrow Transplant",
    quote: "I traveled from Dubai after hearing about Narayana's world-class oncology team. The outcomes exceeded our expectations, and the international patient services made everything seamless.",
    image: "/assets/patient_in_2.png",
    rating: 5,
  },
  {
    id: "story-3",
    name: "Sarah Thompson",
    location: "London, UK",
    condition: "Spinal Surgery",
    quote: "After 3 failed surgeries in the UK, Dr. Rao at NH Bangalore performed a minimally invasive procedure that completely restored my mobility. I'm walking pain-free for the first time in 4 years.",
    image: "/assets/patient_in_3.png",
    rating: 5,
  },
  {
    id: "story-4",
    name: "Anita Desai",
    location: "Mumbai, India",
    condition: "Liver Transplant",
    quote: "The dedication of the transplant team was remarkable. They guided our entire family through the process with empathy and expertise. We can never thank Narayana Health enough.",
    image: "/assets/patient_in_4.png",
    rating: 5,
  },
];

export default function PatientStories() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scale up on scroll from 0.92 to 1.0 filling current state
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [24, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useSpring(mouseX, { stiffness: 90, damping: 30 });
  const parallaxY = useSpring(mouseY, { stiffness: 90, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(normalizedX * 6);
    mouseY.set(normalizedY * 3);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const videos = [
    { videoId: "ZSEB_JWPLXE", thumb: "/assets/patient_in_1.png", title: "Cardiac Recovery Journey with NH Team" },
    { videoId: "zj57LyreDYU", thumb: "/assets/patient_in_2.png", title: "Cancer Care Experience from Diagnosis to Healing" },
    { videoId: "k09KKJSy8e8", thumb: "/assets/patient_in_3.png", title: "Spine Surgery Success and Mobility Restoration" },
    { videoId: "UBNybY1lc6k", thumb: "/assets/patient_in_4.png", title: "Transplant Care Testimonial and Family Support" }
  ];

  const items = Array.from({ length: stories.length * 2 }, (_, i) => {
    if (i % 2 === 0) {
      return { type: "text" as const, data: stories[(i / 2) % stories.length] };
    } else {
      const vidObj = videos[Math.floor(i / 2) % videos.length];
      return { type: "video" as const, data: vidObj };
    }
  });

  const allItems = [...items, ...items]; // Duplicate for seamless scrolling

  const topRowImages = [stories[0].image, stories[1].image, stories[2].image, stories[3].image, videos[0].thumb, videos[1].thumb];
  const bottomRowImages = [videos[0].thumb, videos[1].thumb, videos[2].thumb, videos[3].thumb, stories[0].image, stories[1].image];

  const backgroundGridItems = [
    ...topRowImages,                     // Top row: 6 tiles
    null, null, null, null, null, null, // Middle row: 6 empty slots leaving space for carousel
    ...bottomRowImages,                  // Bottom row: 6 tiles
  ];

  return (
    <section ref={sectionRef} className={styles.sectionWrap}>
      <motion.div
        className={`section ${styles.section}`}
        id="patient-stories"
        style={{
          scale,
          borderRadius,
          transformOrigin: "bottom center",
          willChange: "transform, border-radius",
        }}
      >
        <div className={`container ${styles.contentContainer}`}>
          {/* Section Header */}
          <motion.div 
            className={styles.header}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.eyebrowWrap}>
              <div className="section-eyebrow" style={{ marginBottom: 0 }}>PATIENT STORIES</div>
              <div className={styles.eyebrowDash} />
            </div>
            <h2 className={`section-title ${styles.sectionTitle}`}>Lives Changed, Stories Told</h2>
            <p className="section-subtitle">
              Real patients. Real outcomes. Thousands of life-changing stories.
            </p>
          </motion.div>
        </div>

        <div 
          ref={containerRef} 
          className={styles.carouselWrap}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background Image Grid */}
          <div className={styles.backgroundGridWrap}>
            <div className={styles.backgroundGrid}>
              {backgroundGridItems.map((src, i) => (
                src ? (
                  <motion.div 
                    key={`bg-${i}`} 
                    className={styles.gridImageItem}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <Image src={src} alt="" fill sizes="25vw" style={{ objectFit: "cover" }} />
                  </motion.div>
                ) : (
                  <div key={`bg-empty-${i}`} />
                )
              ))}
            </div>
            <div className={styles.gridOverlay} />
          </div>

          <motion.div 
            className={styles.marqueeContainer}
            style={{ x: parallaxX, y: parallaxY }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className={styles.marqueeContent}>
              {allItems.map((item, i) => {
                if (item.type === "text") {
                  const story = item.data;
                  return (
                    <article key={`story-${story.id}-${i}`} className={styles.card}>
                      <div className={styles.quoteIconWrap}>
                        <Quote size={40} className={styles.quoteIcon} fill="var(--color-primary)" stroke="none" />
                      </div>
                      <p className={styles.quote}>{story.quote}</p>
                      <div className={styles.patient}>
                        <div className={styles.avatar}>
                          <Image src={story.image} alt={story.name} fill sizes="48px" style={{ objectFit: "cover" }} />
                        </div>
                        <div>
                          <h4 className={styles.patientName}>{story.name}</h4>
                          <p className={styles.patientMeta}>{story.condition}</p>
                        </div>
                      </div>
                    </article>
                  );
                }

                const video = item.data;
                return (
                  <article key={`video-${video.videoId}-${i}`} className={`${styles.card} ${styles.videoCard}`}>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.videoLink}
                    >
                      <div className={styles.videoThumbWrap}>
                        <Image src={video.thumb} alt={video.title} fill sizes="(max-width: 768px) 90vw, 420px" className={styles.videoThumb} />
                        <div className={styles.videoOverlay} />
                        <div className={styles.playButtonWrapper}>
                          <Play size={28} fill="var(--color-primary)" stroke="var(--color-primary)" />
                        </div>
                        <div className={styles.videoTitle}>{video.title}</div>
                      </div>
                    </a>
                  </article>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
