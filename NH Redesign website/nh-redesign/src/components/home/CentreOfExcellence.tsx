"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./CentreOfExcellence.module.css";
import Link from "next/link";
import advanceHeartCareImg from "../../../public/Advance Heart Care.jpg";
import oncologyInstituteImg from "../../../public/Oncology Institute.jpg";
import brainAndSpineImg from "../../../public/Brain and Spine.jpg";
import boneAndJointImg from "../../../public/Bone & Joint.jpg";
import digestiveHealthImg from "../../../public/Digestive Health.png";

const CARDS = [
  {
    id: "card-cardiac",
    category: "Cardiac Science",
    title: "Advanced Heart Care",
    desc: "Comprehensive cardiology services including complex adult and pediatric heart surgeries, heart transplants, and interventional cardiology with cutting-edge technology.",
    img: advanceHeartCareImg,
    link: "/specialities/cardiology",
  },
  {
    id: "card-cancer",
    category: "Cancer Care",
    title: "Oncology Institute",
    desc: "A multidisciplinary approach to cancer treatment offering medical, surgical, and radiation oncology with precise diagnostics and personalized care plans.",
    img: oncologyInstituteImg,
    link: "/specialities/oncology",
  },
  {
    id: "card-neuro",
    category: "Neurosciences",
    title: "Brain & Spine",
    desc: "Advanced treatment for neurological disorders including stroke management, brain tumor surgery, epilepsy treatment, and minimally invasive spine surgeries.",
    img: brainAndSpineImg,
    link: "/specialities/neurology",
  },
  {
    id: "card-ortho",
    category: "Orthopedics",
    title: "Bone & Joint Health",
    desc: "Expert care for musculoskeletal conditions with advanced joint replacements, sports medicine, and comprehensive rehabilitation programs.",
    img: boneAndJointImg,
    link: "/specialities/orthopedics",
  },
  {
    id: "card-gastro",
    category: "Gastro Sciences",
    title: "Digestive Health",
    desc: "Expert care for digestive and liver conditions involving advanced endoscopy, GI surgeries, and liver transplant procedures in highly specialized units.",
    img: digestiveHealthImg,
    link: "/specialities/gastroenterology",
  }
];

export default function CentreOfExcellence() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Track vertical page scroll of the section to drive vertical parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Calculate translation distance for the parallax image
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const handleScroll = () => {
    if (carouselRef.current) {
      const width = carouselRef.current.clientWidth;
      const scrollLeft = carouselRef.current.scrollLeft;
      const index = Math.round(scrollLeft / width);
      setActiveIndex(index);
    }
  };

  // Autoplay carousel every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const width = carouselRef.current.clientWidth;
        const nextIndex = (activeIndex + 1) % CARDS.length;
        carouselRef.current.scrollTo({
          left: nextIndex * width,
          behavior: "smooth",
        });
        setActiveIndex(nextIndex);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section ref={sectionRef} className={styles.section} id="centre-of-excellence">
      {/* Carousel */}
      <div className={styles.carouselWrapper}>
        <div 
          className={styles.carousel} 
          ref={carouselRef}
          onScroll={handleScroll}
          role="group" 
          aria-label="Centres of Excellence Carousel"
        >
          {CARDS.map((card, index) => (
            <div 
              key={card.id}
              className={styles.slide}
            >
              <div className={styles.card}>
                {/* Background Image covering the whole section with Parallax */}
                <div className={styles.cardImgWrap}>
                  <motion.div 
                    style={{ y: yParallax, height: "124%", top: "-12%", position: "absolute", width: "100%" }}
                  >
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      priority={index === 0}
                      className={styles.cardImg}
                      sizes="100vw"
                    />
                  </motion.div>
                  <div className={styles.imageOverlay} />
                </div>
                
                {/* Align the text using the container boundaries */}
                <div className="container" style={{ position: "relative", height: "100%", zIndex: 3 }}>
                  <motion.div 
                    className={styles.cardInfo}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Eyebrow tag is now inside cardInfo container to align perfectly */}
                    <div className={`${styles.eyebrow} section-eyebrow`}>
                      CENTRES OF EXCELLENCE
                    </div>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardDesc}>{card.desc}</p>
                    
                    <div>
                      <Link href={card.link} className={styles.cardCta}>
                        Know more
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicator Dots */}
        <div className={styles.dotsContainer}>
          {CARDS.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${activeIndex === index ? styles.activeDot : ""}`}
              onClick={() => {
                if (carouselRef.current) {
                  const width = carouselRef.current.clientWidth;
                  carouselRef.current.scrollTo({
                    left: index * width,
                    behavior: "smooth",
                  });
                }
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
