"use client";

import HomeComposition from "@/components/layout/HomeComposition";
// Prototype only — the L1 drawer plus its trigger and control panel. When
// this is CMS-driven, only <MarketingDrawer config={...} /> remains.
import MarketingDrawerLab from "@/components/marketing/MarketingDrawer";

export default function HomePage() {
  return (
    <HomeComposition>
      <MarketingDrawerLab />
    </HomeComposition>
  );
}
