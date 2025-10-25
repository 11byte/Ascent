// components/SmoothScroll.tsx
"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Re-run useEffect to destroy/re-create Lenis on path change
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.1,
    });

    // Lenis's 'scroll' event updates ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Sync GSAP ticker with Lenis's render loop
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const ticker = gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Sync Lenis scroll
    });

    requestAnimationFrame(raf);

    // Cleanup on unmount or path change
    return () => {
      lenis.destroy();
      gsap.ticker.remove(ticker);
      // Optional: Kill all ScrollTriggers
      // ScrollTrigger.killAll();
    };
  }, [pathname]); // Re-create on path change

  return <>{children}</>;
}
