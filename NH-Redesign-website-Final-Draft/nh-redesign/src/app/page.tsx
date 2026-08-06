import HeroSearchFirst from "@/components/home/HeroSearchFirst";
import CentreOfExcellence from "@/components/home/CentreOfExcellence";
import WhyChooseNH from "@/components/home/WhyChooseNH";
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
      
      {/* Hero section in normal document flow */}
      <HeroSearchFirst />
      
      {/* Subsequent sections flow naturally after hero */}
      <div 
        style={{ 
          position: "relative", 
          background: "#ffffff",
          borderRadius: 0,
          marginTop: 0
        }}
      >
        <div style={{ background: "transparent", borderRadius: 0 }}>
          <CentreOfExcellence />
        </div>
        <PatientStories />
        <WhyChooseNH />

        {/* ChairmanQuote section pinned sticky so AppDownloadBanner overlays on top of it during scroll */}
        <div style={{ position: "sticky", top: 0, zIndex: 15 }}>
          <ChairmanQuote />
        </div>

        {/* AppDownloadBanner Section overlays on top of ChairmanQuote */}
        <div style={{ position: "relative", zIndex: 25 }}>
          <AppDownloadBanner />
        </div>

        {/* Subsequent sections scroll over/after AppDownloadBanner with solid z-index */}
        <div style={{ position: "relative", zIndex: 30, background: "#ffffff" }}>
          <HealthPackages />
        </div>
      </div>
    </>
  );
}
