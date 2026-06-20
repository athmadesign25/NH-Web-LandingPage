"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Play, Stethoscope, Users, Building2, Activity, Clock, Calendar, Search, FileText, User } from "lucide-react";
import styles from "./HeroSection.module.css";
import SplitText from "@/components/ui/SplitText";
import MagneticButton from "@/components/ui/MagneticButton";

/* Floating tag badge, like in the reference */
function FloatingBadge({
  icon,
  label,
  delay,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  delay: number;
  className: string;
}) {
  return (
    <motion.div
      className={`${styles.floatBadge} ${className}`}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.badgeIconWrap}>{icon}</div>
      <span className={styles.badgeLabel}>{label}</span>
    </motion.div>
  );
}

// Speciality lists for auto-suggest with semantic keywords (symptoms, organs, treatments)
const specialitiesData = [
  { 
    name: "Cardiology", 
    slug: "cardiology",
    keywords: ["heart", "chest pain", "valve", "cardiac", "bypass", "bp", "hypertension", "angioplasty", "artery", "cardio", "palpitation"] 
  },
  { 
    name: "Neurology", 
    slug: "neurology",
    keywords: ["brain", "nerve", "stroke", "migraine", "headache", "spine", "seizure", "epilepsy", "paralysis", "neuro", "back pain"] 
  },
  { 
    name: "Oncology", 
    slug: "oncology",
    keywords: ["cancer", "tumor", "chemotherapy", "radiation", "biopsy", "leukemia", "lymphoma", "onco", "tumor", "lump"] 
  },
  { 
    name: "Orthopaedics", 
    slug: "orthopaedics",
    keywords: ["bone", "joint", "fracture", "knee", "hip", "arthritis", "ligament", "sprain", "ortho", "backbone"] 
  },
  { 
    name: "Paediatrics", 
    slug: "paediatrics",
    keywords: ["child", "baby", "kid", "newborn", "vaccination", "paediatrician", "infant", "pediatric"] 
  },
  { 
    name: "Gastroenterology", 
    slug: "gastroenterology",
    keywords: ["stomach", "liver", "digestion", "acidity", "gastric", "endoscopy", "ulcer", "gastro", "diarrhea"] 
  },
  { 
    name: "Ophthalmology", 
    slug: "ophthalmology",
    keywords: ["eye", "vision", "blind", "cataract", "lasik", "glasses", "lens", "sight"] 
  },
  { 
    name: "ENT", 
    slug: "ent",
    keywords: ["ear", "nose", "throat", "sinus", "tonsils", "hearing", "voice", "throat pain", "cold"] 
  },
  {
    name: "Gynecology",
    slug: "gynecology",
    keywords: ["women", "pregnancy", "female", "maternity", "obgyn", "delivery", "period", "uterus"]
  },
  {
    name: "Dermatology",
    slug: "dermatology",
    keywords: ["skin", "hair", "nails", "acne", "rash", "dandruff", "eczema", "allergy"]
  },
  {
    name: "Urology",
    slug: "urology",
    keywords: ["urine", "bladder", "prostate", "kidney stone", "urinary"]
  },
  {
    name: "Pulmonology",
    slug: "pulmonology",
    keywords: ["lungs", "breathing", "asthma", "respiratory", "cough", "bronchitis", "pneumonia"]
  },
  {
    name: "Dental Care",
    slug: "dental-care",
    keywords: ["teeth", "toothache", "root canal", "dental", "oral", "gums", "braces"]
  }
];

const doctorsData = [
  {
    name: "Dr. Rajiv Menon",
    speciality: "Cardiology",
    keywords: ["cardiology", "heart", "rajiv", "menon", "doctor", "specialist"]
  },
  {
    name: "Dr. Priya Sharma",
    speciality: "Neurology",
    keywords: ["neurology", "brain", "priya", "sharma", "doctor", "specialist"]
  },
  {
    name: "Dr. Arun Krishnan",
    speciality: "Oncology",
    keywords: ["oncology", "cancer", "arun", "krishnan", "doctor", "specialist"]
  },
  {
    name: "Dr. Sunita Patel",
    speciality: "Orthopaedics",
    keywords: ["orthopaedics", "bone", "joint", "sunita", "patel", "doctor", "specialist"]
  },
  {
    name: "Dr. Mohammed Raza",
    speciality: "Cardiology",
    keywords: ["cardiology", "heart", "mohammed", "raza", "doctor", "specialist"]
  },
  {
    name: "Dr. Ananya Roy",
    speciality: "Neurology",
    keywords: ["neurology", "brain", "ananya", "roy", "doctor", "specialist"]
  }
];

const doctorRoles = [
  {
    role: "Cardiologists",
    keywords: ["cardiology", "heart", "cardio", "bypass", "chest pain", "angioplasty", "clogged"]
  },
  {
    role: "Cardiac Surgeon",
    keywords: ["cardiology", "heart", "cardio", "bypass", "surgery", "angioplasty", "surgeon"]
  },
  {
    role: "Cardio Specialists",
    keywords: ["cardiology", "heart", "cardio", "specialist"]
  },
  {
    role: "Neurologists",
    keywords: ["neurology", "brain", "neuro", "stroke", "migraine", "headache"]
  },
  {
    role: "Neuro Surgeons",
    keywords: ["neurology", "brain", "neuro", "spine", "surgery", "surgeon"]
  },
  {
    role: "Oncologists",
    keywords: ["oncology", "cancer", "tumor", "chemotherapy"]
  },
  {
    role: "Cancer Specialists",
    keywords: ["oncology", "cancer", "onco", "tumor", "specialist"]
  },
  {
    role: "Orthopaedic Surgeons",
    keywords: ["orthopaedics", "bone", "joint", "ortho", "knee", "surgeon"]
  },
  {
    role: "Bone & Joint Specialists",
    keywords: ["orthopaedics", "bone", "joint", "ortho", "specialist"]
  },
  {
    role: "Paediatricians",
    keywords: ["paediatrics", "child", "kid", "baby", "pediatric"]
  },
  {
    role: "Gastroenterologists",
    keywords: ["gastroenterology", "stomach", "liver", "gastro"]
  }
];

const treatmentsData = [
  {
    name: "Angioplasty & Bypass Surgery",
    keywords: ["heart", "chest pain", "valve", "cardiac", "bypass", "angioplasty", "artery", "cardio", "clogged"]
  },
  {
    name: "Deep Brain Stimulation (DBS)",
    keywords: ["brain", "nerve", "stroke", "spine", "seizure", "epilepsy", "parkinson", "tremor"]
  },
  {
    name: "Precision Radiotherapy & Chemotherapy",
    keywords: ["cancer", "tumor", "chemotherapy", "radiation", "biopsy", "leukemia", "lymphoma", "chemo"]
  },
  {
    name: "Knee & Hip Joint Replacements",
    keywords: ["bone", "joint", "fracture", "knee", "hip", "arthritis", "ligament", "sprain", "replacement"]
  },
  {
    name: "Advanced Gastrointestinal Endoscopy",
    keywords: ["stomach", "liver", "digestion", "acidity", "gastric", "endoscopy", "ulcer", "gastro"]
  },
  {
    name: "Executive Full Body Health Checkup",
    keywords: ["health package", "checkup", "full body", "preventive", "blood test", "screening", "urine test", "ecg", "ultrasound", "package", "health"]
  },
  {
    name: "Comprehensive Cardiac Health Package",
    keywords: ["heart checkup", "cardiac", "blood test", "ecg", "cholesterol", "lipid profile", "health package", "package", "heart"]
  },
  {
    name: "Advanced Diabetes Screening Package",
    keywords: ["diabetes", "sugar check", "blood test", "hba1c", "glucose", "insulin", "health package", "package"]
  },
  {
    name: "CBC (Complete Blood Count) Lab Test",
    keywords: ["cbc", "blood test", "lab test", "hemoglobin", "infection", "anemia", "test"]
  },
  {
    name: "Thyroid Profile (T3, T4, TSH) Lab Test",
    keywords: ["thyroid", "tsh", "blood test", "lab test", "hormone", "hypothyroidism", "test"]
  },
  {
    name: "Lipid Profile (Cholesterol) Lab Test",
    keywords: ["lipid profile", "cholesterol", "blood test", "lab test", "heart", "triglycerides", "test"]
  }
];

const articlesData = [
  {
    name: "Understanding Heart Health: 5 Tips to Keep Your Heart Strong",
    keywords: ["heart", "cardiac", "strong", "healthy", "lifestyle", "angioplasty"]
  },
  {
    name: "Living with Migraines: Identifying Triggers and Finding Relief",
    keywords: ["migraine", "headache", "brain", "nerve", "seizure", "triggers"]
  },
  {
    name: "Cancer Care: The Role of Early Screening & Detection",
    keywords: ["cancer", "tumor", "chemo", "screening", "detection"]
  },
  {
    name: "Keeping Joints and Bones Healthy in Your Golden Years",
    keywords: ["bone", "joint", "healthy", "aging", "arthritis"]
  }
];

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;

  const regex = new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className={styles.highlight}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdownTab, setActiveDropdownTab] = useState<"all" | "doctors" | "specialities" | "treatments" | "articles">("all");
  const [isOpen, setIsOpen] = useState(false);
  const [lastSearch, setLastSearch] = useState<string | null>(null);
  const searchRef = useRef<HTMLFormElement>(null);

  // Load last search from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nh_last_search");
      if (saved) {
        setLastSearch(saved);
      }
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      if (typeof window !== "undefined") {
        localStorage.setItem("nh_last_search", query);
        setLastSearch(query);
      }
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (name: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nh_last_search", name);
      setLastSearch(name);
    }
    router.push(`/search?q=${encodeURIComponent(name)}`);
    setIsOpen(false);
  };

  // Filter lists based on input (semantic keyword search & exact name match)
  const showDefaults = !searchQuery.trim();
  
  const isDoctorQuery = searchQuery.toLowerCase().includes("dr") || searchQuery.toLowerCase().includes("doctor");

  const filteredDoctors = showDefaults 
    ? doctorRoles.slice(0, 6).map(r => ({ name: r.role, subtitle: "Doctor Role", matchingKeyword: null }))
    : isDoctorQuery
      ? doctorsData.map((doc) => {
          const nameMatch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
          const specMatch = doc.speciality.toLowerCase().includes(searchQuery.toLowerCase());
          const matchingKeyword = doc.keywords.find((kw) => 
            kw.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return {
            name: doc.name,
            subtitle: doc.speciality,
            nameMatch,
            specMatch,
            matchingKeyword,
            score: nameMatch ? 3 : specMatch ? 2 : matchingKeyword ? 1 : 0
          };
        })
        .filter((doc) => doc.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
      : doctorRoles.map((role) => {
          const nameMatch = role.role.toLowerCase().includes(searchQuery.toLowerCase());
          const matchingKeyword = role.keywords.find((kw) => 
            kw.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return {
            name: role.role,
            subtitle: "Doctor Role",
            nameMatch,
            matchingKeyword,
            score: nameMatch ? 3 : matchingKeyword ? 1 : 0
          };
        })
        .filter((role) => role.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

  const filteredSpecs = showDefaults 
    ? specialitiesData.slice(0, 6).map(spec => ({ ...spec, matchingKeyword: null }))
    : specialitiesData.map((spec) => {
        const nameMatch = spec.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchingKeyword = spec.keywords.find((kw) => 
          kw.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return {
          ...spec,
          nameMatch,
          matchingKeyword,
          score: nameMatch ? 2 : matchingKeyword ? 1 : 0
        };
      })
      .filter((spec) => spec.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

  const filteredTreatments = showDefaults 
    ? treatmentsData.slice(0, 6).map(t => ({ ...t, matchingKeyword: null }))
    : treatmentsData.map((t) => {
        const nameMatch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchingKeyword = t.keywords.find((kw) => 
          kw.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return {
          ...t,
          nameMatch,
          matchingKeyword,
          score: nameMatch ? 2 : matchingKeyword ? 1 : 0
        };
      })
      .filter((t) => t.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

  const filteredArticles = showDefaults 
    ? articlesData.slice(0, 6).map(a => ({ ...a, matchingKeyword: null }))
    : articlesData.map((a) => {
        const nameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchingKeyword = a.keywords.find((kw) => 
          kw.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return {
          ...a,
          nameMatch,
          matchingKeyword,
          score: nameMatch ? 2 : matchingKeyword ? 1 : 0
        };
      })
      .filter((a) => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

  const hasSuggestions = filteredDoctors.length > 0 || filteredSpecs.length > 0 || filteredTreatments.length > 0 || filteredArticles.length > 0;

  return (
    <section className={styles.hero} id="hero-section">
      {/* Full-screen Background Video */}
      <video
        src="/Hero Video.mp4"
        autoPlay
        muted
        loop
        playsInline
        className={styles.bgVideo}
      />
      <div className={styles.videoOverlay} />

      <div className={styles.inner}>

        {/* ── LEFT: Content panel ── */}
        <div className={styles.leftPanel}>



          <div className={styles.headlineWrap}>
            <SplitText
              text="Healthcare for Personalised"
              tag="h1"
              className={styles.headline}
              delay={0.05}
            />
            <SplitText
              text="Wellness Solutions"
              tag="h1"
              className={styles.headline}
              delay={0.15}
            />
          </div>



          <motion.form
            ref={searchRef}
            onSubmit={handleSearch}
            className={styles.searchBarForm}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search doctors, specialities, or treatments..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                className={styles.searchInput}
              />
              {searchQuery.trim().length > 0 && (
                <button type="submit" className={styles.searchBtn}>
                  Search
                </button>
              )}
            </div>

            {/* Progressive Search Dropdown */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className={styles.dropdown}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  data-lenis-prevent
                >
                  {/* Tabs Selector at the top */}
                  <div className={styles.dropdownTabs}>
                    <button
                      type="button"
                      onClick={() => setActiveDropdownTab("all")}
                      className={`${styles.dropdownTab} ${activeDropdownTab === "all" ? styles.activeTab : ""}`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDropdownTab("doctors")}
                      className={`${styles.dropdownTab} ${activeDropdownTab === "doctors" ? styles.activeTab : ""}`}
                    >
                      Doctors ({filteredDoctors.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDropdownTab("specialities")}
                      className={`${styles.dropdownTab} ${activeDropdownTab === "specialities" ? styles.activeTab : ""}`}
                    >
                      Specialities ({filteredSpecs.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDropdownTab("treatments")}
                      className={`${styles.dropdownTab} ${activeDropdownTab === "treatments" ? styles.activeTab : ""}`}
                    >
                      Treatments & Tests ({filteredTreatments.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDropdownTab("articles")}
                      className={`${styles.dropdownTab} ${activeDropdownTab === "articles" ? styles.activeTab : ""}`}
                    >
                      Articles ({filteredArticles.length})
                    </button>
                  </div>

                  <div className={styles.dropdownTabContent} data-lenis-prevent>
                    {activeDropdownTab === "all" && (
                      <div className={styles.dropdownSection} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {/* Doctors Section */}
                        {filteredDoctors.length > 0 && (
                          <div>
                            <div className={styles.sectionHeader}>Doctors</div>
                            {filteredDoctors.slice(0, 4).map((doc) => (
                              <div
                                key={doc.name}
                                onClick={() => handleSelectSuggestion(doc.name)}
                                className={styles.suggestionItem}
                              >
                                <div className={styles.itemIconWrap}>
                                  <User size={14} />
                                </div>
                                <div className={styles.itemText}>
                                  <div style={{ fontWeight: 600, fontSize: "14.5px" }}>
                                    <HighlightMatch text={doc.name} query={searchQuery} />
                                  </div>
                                  {doc.subtitle && doc.subtitle !== "Doctor Role" && (
                                    <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                                      {doc.subtitle}
                                    </div>
                                  )}
                                </div>
                                {lastSearch && lastSearch.toLowerCase() === doc.name.toLowerCase() && (
                                  <span className={styles.itemTag}>Last Searched</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Specialities Section */}
                        {filteredSpecs.length > 0 && (
                          <div>
                            <div className={styles.sectionHeader}>Specialities</div>
                            {filteredSpecs.slice(0, 4).map((spec) => (
                              <div
                                key={spec.name}
                                onClick={() => handleSelectSuggestion(spec.name)}
                                className={styles.suggestionItem}
                              >
                                <div className={styles.itemIconWrap}>
                                  <Stethoscope size={14} />
                                </div>
                                <div className={styles.itemText}>
                                  <div style={{ fontWeight: 600, fontSize: "14.5px" }}>
                                    <HighlightMatch text={spec.name} query={searchQuery} />
                                  </div>
                                  {spec.matchingKeyword && (
                                    <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                                      Relates to: <HighlightMatch text={spec.matchingKeyword} query={searchQuery} />
                                    </div>
                                  )}
                                </div>
                                {lastSearch && lastSearch.toLowerCase() === spec.name.toLowerCase() && (
                                  <span className={styles.itemTag}>Last Searched</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Treatments Section */}
                        {filteredTreatments.length > 0 && (
                          <div>
                            <div className={styles.sectionHeader}>Treatments, Packages & Tests</div>
                            {filteredTreatments.slice(0, 4).map((t) => (
                              <div
                                key={t.name}
                                onClick={() => handleSelectSuggestion(t.name)}
                                className={styles.suggestionItem}
                              >
                                <div className={styles.itemIconWrap}>
                                  <Activity size={14} />
                                </div>
                                <div className={styles.itemText}>
                                  <div style={{ fontWeight: 600, fontSize: "14.5px" }}>
                                    <HighlightMatch text={t.name} query={searchQuery} />
                                  </div>
                                  {t.matchingKeyword && (
                                    <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                                      Relates to: <HighlightMatch text={t.matchingKeyword} query={searchQuery} />
                                    </div>
                                  )}
                                </div>
                                {lastSearch && lastSearch.toLowerCase() === t.name.toLowerCase() && (
                                  <span className={styles.itemTag}>Last Searched</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Articles Section */}
                        {filteredArticles.length > 0 && (
                          <div>
                            <div className={styles.sectionHeader}>Articles</div>
                            {filteredArticles.slice(0, 4).map((a) => (
                              <div
                                key={a.name}
                                onClick={() => handleSelectSuggestion(a.name)}
                                className={styles.suggestionItem}
                              >
                                <div className={styles.itemIconWrap}>
                                  <FileText size={14} />
                                </div>
                                <div className={styles.itemText}>
                                  <div style={{ fontWeight: 600, fontSize: "14.5px" }}>
                                    <HighlightMatch text={a.name} query={searchQuery} />
                                  </div>
                                  {a.matchingKeyword && (
                                    <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                                      Relates to: <HighlightMatch text={a.matchingKeyword} query={searchQuery} />
                                    </div>
                                  )}
                                </div>
                                {lastSearch && lastSearch.toLowerCase() === a.name.toLowerCase() && (
                                  <span className={styles.itemTag}>Last Searched</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {!hasSuggestions && (
                          <div className={styles.noResults}>No matching results found</div>
                        )}
                      </div>
                    )}

                    {activeDropdownTab === "doctors" && (
                      <div className={styles.dropdownSection}>
                        {filteredDoctors.length > 0 ? (
                          filteredDoctors.map((doc) => (
                            <div
                              key={doc.name}
                              onClick={() => handleSelectSuggestion(doc.name)}
                              className={styles.suggestionItem}
                            >
                              <div className={styles.itemIconWrap}>
                                <User size={14} />
                              </div>
                              <div className={styles.itemText}>
                                <div style={{ fontWeight: 600, fontSize: "14.5px" }}>
                                  <HighlightMatch text={doc.name} query={searchQuery} />
                                </div>
                                {doc.subtitle && doc.subtitle !== "Doctor Role" && (
                                  <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                                    {doc.subtitle}
                                  </div>
                                )}
                              </div>
                              {lastSearch && lastSearch.toLowerCase() === doc.name.toLowerCase() && (
                                <span className={styles.itemTag}>Last Searched</span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className={styles.noResults}>No matching doctors found</div>
                        )}
                      </div>
                    )}

                    {activeDropdownTab === "specialities" && (
                      <div className={styles.dropdownSection}>
                        {filteredSpecs.length > 0 ? (
                          filteredSpecs.map((spec) => (
                            <div
                              key={spec.name}
                              onClick={() => handleSelectSuggestion(spec.name)}
                              className={styles.suggestionItem}
                            >
                              <div className={styles.itemIconWrap}>
                                <Stethoscope size={14} />
                              </div>
                              <div className={styles.itemText}>
                                <div style={{ fontWeight: 600, fontSize: "14.5px" }}>
                                  <HighlightMatch text={spec.name} query={searchQuery} />
                                </div>
                                {spec.matchingKeyword && (
                                  <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                                    Relates to: <HighlightMatch text={spec.matchingKeyword} query={searchQuery} />
                                  </div>
                                )}
                              </div>
                              {lastSearch && lastSearch.toLowerCase() === spec.name.toLowerCase() && (
                                <span className={styles.itemTag}>Last Searched</span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className={styles.noResults}>No matching specialities found</div>
                        )}
                      </div>
                    )}

                    {activeDropdownTab === "treatments" && (
                      <div className={styles.dropdownSection}>
                        {filteredTreatments.length > 0 ? (
                          filteredTreatments.map((t) => (
                            <div
                              key={t.name}
                              onClick={() => handleSelectSuggestion(t.name)}
                              className={styles.suggestionItem}
                            >
                              <div className={styles.itemIconWrap}>
                                <Activity size={14} />
                              </div>
                              <div className={styles.itemText}>
                                <div style={{ fontWeight: 600, fontSize: "14.5px" }}>
                                  <HighlightMatch text={t.name} query={searchQuery} />
                                </div>
                                {t.matchingKeyword && (
                                  <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                                    Relates to: <HighlightMatch text={t.matchingKeyword} query={searchQuery} />
                                  </div>
                                )}
                              </div>
                              {lastSearch && lastSearch.toLowerCase() === t.name.toLowerCase() && (
                                <span className={styles.itemTag}>Last Searched</span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className={styles.noResults}>No matching treatments found</div>
                        )}
                      </div>
                    )}

                    {activeDropdownTab === "articles" && (
                      <div className={styles.dropdownSection}>
                        {filteredArticles.length > 0 ? (
                          filteredArticles.map((a) => (
                            <div
                              key={a.name}
                              onClick={() => handleSelectSuggestion(a.name)}
                              className={styles.suggestionItem}
                            >
                              <div className={styles.itemIconWrap}>
                                <FileText size={14} />
                              </div>
                              <div className={styles.itemText}>
                                <div style={{ fontWeight: 600, fontSize: "14.5px" }}>
                                  <HighlightMatch text={a.name} query={searchQuery} />
                                </div>
                                {a.matchingKeyword && (
                                  <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                                    Relates to: <HighlightMatch text={a.matchingKeyword} query={searchQuery} />
                                  </div>
                                )}
                              </div>
                              {lastSearch && lastSearch.toLowerCase() === a.name.toLowerCase() && (
                                <span className={styles.itemTag}>Last Searched</span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className={styles.noResults}>No matching articles found</div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
          >
            <Link href="/doctors" className={styles.primaryCta} id="hero-book-btn">
              <Calendar size={18} />
              Book Appointment
              <ChevronRight size={16} />
            </Link>

            <Link href="/" className={styles.secondaryCta} id="hero-find-hospital">
              <Building2 size={18} />
              Find a Hospital
              <ChevronRight size={18} />
            </Link>
          </motion.div>


        </div>

        {/* ── RIGHT: Video overlay & Badges panel ── */}
        <div className={styles.rightPanel}>
        </div>

      </div>
    </section>
  );
}
