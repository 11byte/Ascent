"use client";
import { ReactNode, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PremiumTileProps {
  left: ReactNode;
  right: ReactNode;
  children?: ReactNode; // Main Phase Section
}

export default function PremiumTile({
  left,
  right,
  children,
}: PremiumTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tile = tileRef.current;
    if (!tile) return;

    gsap.to(tile, {
      y: -100, // Amount to move upward for parallax (adjust as needed)
      ease: "none",
      scrollTrigger: {
        trigger: tile,
        start: "top bottom", // when top of tile hits bottom of viewport
        end: "bottom top", // when bottom of tile hits top of viewport
        scrub: true, // smooth parallax effect
      },
    });
  }, []);

  return (
    <div
      ref={tileRef}
      className="relative w-full max-w-[1200px] mx-auto p-6 bg-white shadow-lg rounded-2xl overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="flex gap-4 items-start">
        <div className="flex-1">{left}</div>
        <div className="flex-[2]">{children}</div>
        <div className="flex-1">{right}</div>
      </div>
    </div>
  );
}
