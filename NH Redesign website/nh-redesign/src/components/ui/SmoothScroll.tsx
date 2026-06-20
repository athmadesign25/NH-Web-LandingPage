"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    let lenis: any;

    const initLenis = async () => {
      const { default: Lenis } = await import("lenis");
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };

    initLenis();
    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  return null;
}
