"use client";

import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import Link from "next/link";
import { Wand, Telescope, ArrowUpRight } from "lucide-react";
import MarqueeDemo from "../../components/ui/marque-wrapper";
import { string } from "three/src/nodes/TSL.js";

const phase2Theme = {
  tBorder: { light: "#E8E3D4", dark: "#E8E3D4" },
  tColor: { light: "#ffffff", dark: "#000000" },
  tDepthColor: { light: "#CBAF68", dark: "#CBAF68" },
};

function CountUp({ to = 0, duration = 1.2 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, duration]);
  return <span>{val.toLocaleString()}</span>;
}

export default function RoadmapHeroClient({
  phase = "4",
  totalRoadmaps = 0,
  trendyRoadmaps = {},
  applyTopOffset = true,
  topOffset = 70,
}:{
  phase: string;
  totalRoadmaps?: number;
  trendyRoadmaps?: Record<string, string>;
  applyTopOffset?: boolean;
  topOffset?: number;
}) {
  return (
    <section className="relative w-full">
      {/* Gradient background behind the fixed navbar */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-950 via-gray-900 to-black" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(600px 200px at 50% -50px, rgba(203,175,104,0.25), transparent 70%)",
        }}
      />

      <div
        className="mx-auto max-w-6xl px-6 py-12 sm:py-14 lg:py-16"
        style={{
          paddingTop: applyTopOffset
            ? `calc(${topOffset}px + env(safe-area-inset-top, 0px))`
            : undefined,
        }}
      >
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center font-[Orbitron] text-4xl sm:text-5xl font-bold tracking-tight"
          style={{ color: phase2Theme.tBorder.dark }}
        >
          Roadmap Generator
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 text-center text-gray-300 sm:text-lg"
        >
          Enter a topic and let the AI generate a roadmap for you
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-7 flex items-center justify-center gap-3"
        >
          <Link href={`/phase${phase}/roadmap-generator/roadmap`}>
            <button
              className="px-5 py-3 rounded-lg font-semibold text-white shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-transform"
              style={{
                background: `linear-gradient(90deg, ${phase2Theme.tColor.dark}, ${phase2Theme.tDepthColor.dark})`,
              }}
            >
              <span className="flex items-center gap-2">
                <Wand size={18} />
                Generate
              </span>
            </button>
          </Link>

          <Link href="/explore">
            <button className="px-5 py-3 rounded-lg font-semibold text-white/90 hover:text-white border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-md transition-colors">
              <span className="flex items-center gap-2">
                <Telescope size={18} />
                Explore
              </span>
            </button>
          </Link>
        </motion.div>

        {/* Trendy roadmaps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          {Object.entries(trendyRoadmaps).map(([name, id]) => (
            <Link
              key={id}
              href={`/roadmap/${id}`}
              className="group flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/85 hover:text-white hover:bg-white/15 backdrop-blur-md transition-colors"
            >
              {name}
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
              />
              <span
                className="pointer-events-none ml-1 h-[2px] w-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all duration-300 group-hover:w-3"
                aria-hidden
              />
            </Link>
          ))}
        </motion.div>

        {/* Counter */}
        <div className="mt-7 flex flex-col items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-base sm:text-lg font-semibold text-white/90"
          >
            <span className="align-middle">Over </span>
            <span
              className="mx-1 align-middle text-white"
              style={{ textShadow: "0 0 12px rgba(203,175,104,0.35)" }}
            >
              <CountUp to={Number(totalRoadmaps) || 0} duration={1.2} />
            </span>
            <span className="align-middle">roadmaps generated</span>
            <span className="align-middle text-white/60"> — and counting!</span>
          </motion.div>
        </div>

        {/* Helper note */}
        <div className="mt-8 flex items-center justify-center">
          <button className="rounded-xl border border-white/20 px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            Override limits by{" "}
            <span
              className="font-semibold"
              style={{ color: phase2Theme.tDepthColor.dark }}
            >
              adding your API key
            </span>
          </button>
        </div>

        {/* Themed Marquee at the bottom of the hero */}
        <div className="mt-10">
          <MarqueeDemo />
        </div>
      </div>
    </section>
  );
}