"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
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
    image: "/assets/doctor_1.png",
    rating: 5,
  },
  {
    id: "story-3",
    name: "Sarah Thompson",
    location: "London, UK",
    condition: "Spinal Surgery",
    quote: "After 3 failed surgeries in the UK, Dr. Rao at NH Bangalore performed a minimally invasive procedure that completely restored my mobility. I'm walking pain-free for the first time in 4 years.",
    image: "/assets/doctor_2.png",
    rating: 5,
  },
  {
    id: "story-4",
    name: "Anita Desai",
    location: "Mumbai, India",
    condition: "Liver Transplant",
    quote: "The dedication of the transplant team was remarkable. They guided our entire family through the process with empathy and expertise. We can never thank Narayana Health enough.",
    image: "/assets/doctor_3.png",
    rating: 5,
  },
];

export default function PatientStories() {
  return (
    <section className={`section ${styles.section}`} id="patient-stories">
      <div className="container">
        <div className={styles.header}>
          <div className="section-eyebrow">Patient Stories</div>
          <h2 className="section-title">Lives Changed, Stories Told</h2>
          <p className="section-subtitle">
            Real patients. Real outcomes. Thousands of life-changing stories.
          </p>
        </div>
      </div>

      <div className={styles.carouselWrap}>
        <ul className={styles.marqueeTrack}>
          {[...stories, ...stories].map((story, i) => (
            <li
              key={`${story.id}-${i}`}
              className={styles.card}
              id={`${story.id}-${i}`}
            >
              <div className={styles.topSection}>
                <p className={styles.quote}>"{story.quote}"</p>
              </div>
              <div className={styles.patient}>
                <div className={styles.avatar}>
                  <Image 
                    src={story.image} 
                    alt={story.name} 
                    fill 
                    sizes="48px" 
                    style={{ objectFit: "cover" }} 
                  />
                </div>
                <div>
                  <h4 className={styles.patientName}>{story.name}</h4>
                  <p className={styles.patientMeta}>
                    {story.condition}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
