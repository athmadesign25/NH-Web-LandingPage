import HeroSection from "@/components/home/HeroSection";
import CentreOfExcellence from "@/components/home/CentreOfExcellence";
import WhyChooseNH from "@/components/home/WhyChooseNH";
import SpecialitiesGrid from "@/components/home/SpecialitiesGrid";
import HealthPackages from "@/components/home/HealthPackages";

import PatientStories from "@/components/home/PatientStories";
import ChairmanQuote from "@/components/home/ChairmanQuote";
import AppDownloadBanner from "@/components/home/AppDownloadBanner";
import FloatingQuickActions from "@/components/ui/FloatingQuickActions";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <FloatingQuickActions />
      
      {/* Hero section will be positioned fixed behind the document flow */}
      <HeroSection />
      
      {/* Wrapper for the rest of the content overlaying the Hero on scroll */}
      <div 
        style={{ 
          position: "relative", 
          zIndex: 10, 
          background: "#ffffff", 
          marginTop: "100vh",
          boxShadow: "0 -20px 40px rgba(0, 0, 0, 0.15)" // Sleek shadow edge as it slides over the video
        }}
      >
        <CentreOfExcellence />
        <SpecialitiesGrid />
        <HealthPackages />
        <WhyChooseNH />

        <ChairmanQuote />
        <PatientStories />
        <AppDownloadBanner />
        <Footer />
      </div>
    </>
  );
}

