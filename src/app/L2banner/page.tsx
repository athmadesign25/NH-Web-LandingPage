"use client";

/**
 * L2 banner iteration.
 *
 * The same landing page as `/`, with the top band in place of the L1
 * drawer prototype — so the two can be compared without one of them
 * carrying a floating toggle the other does not have. There is no control
 * panel here: the band has nothing to configure yet.
 */

import HomeComposition from "@/components/layout/HomeComposition";
import AnnouncementBand from "@/components/marketing/AnnouncementBand/AnnouncementBand";

export default function L2BannerPage() {
  return (
    <HomeComposition>
      <AnnouncementBand />
    </HomeComposition>
  );
}
