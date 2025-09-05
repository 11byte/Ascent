"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    id: 1,
    roman: "I",
    branches: ["Exploring Interests", "Joining Clubs", "Basic Courses"],
  },
  {
    id: 2,
    roman: "II",
    branches: ["Core Subjects", "Hackathons", "Mini Projects"],
  },
  {
    id: 3,
    roman: "III",
    branches: ["Internships", "Industry Projects", "Career Prep"],
  },
  {
    id: 4,
    roman: "IV",
    branches: ["Final Year Project", "Placements", "Farewell Memories"],
  },
];

export default function TimelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4000", // enough space for 4 phases
          scrub: 1,
          pin: true,
        },
      });

      // Initial zoom into first node (Phase I)
      tl.to(containerRef.current, {
        scale: 1.5,
        x: 0,
        duration: 1.5,
        ease: "power2.inOut",
      });

      // Traverse to Phase II
      tl.to(containerRef.current, {
        x: -400,
        duration: 1.5,
        ease: "power2.inOut",
      });

      // Traverse to Phase III
      tl.to(containerRef.current, {
        x: -800,
        duration: 1.5,
        ease: "power2.inOut",
      });

      // Traverse to Phase IV
      tl.to(containerRef.current, {
        x: -1200,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-[400vh] bg-black text-white overflow-hidden font-[Cinzel]">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        {/* DAG Container */}
        <motion.div
          ref={containerRef}
          className="relative flex items-center justify-center"
          initial={{ scale: 1 }}
        >
          {phases.map((phase, i) => (
            <div
              key={phase.id}
              className="major-node relative flex flex-col items-center mx-32"
            >
              {/* Major Node */}
              <motion.div
                className="w-32 h-32 rounded-full bg-cyan-400 shadow-[0_0_40px_#22d3ee] flex items-center justify-center text-3xl font-bold"
                animate={{
                  boxShadow: [
                    "0 0 20px #22d3ee",
                    "0 0 60px #22d3ee",
                    "0 0 20px #22d3ee",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {phase.roman}
              </motion.div>

              {/* Connecting line */}
              {i < phases.length - 1 && (
                <div className="absolute top-1/2 left-full w-32 h-[2px] bg-cyan-300" />
              )}

              {/* Branch nodes */}
              <div className="absolute top-full mt-12 flex flex-col gap-4">
                {phase.branches.map((b, j) => (
                  <motion.div
                    key={j}
                    className="branch-node px-4 py-2 rounded-full bg-purple-700/80 text-sm shadow-[0_0_15px_#9333ea]"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: j * 0.2, duration: 0.6 }}
                  >
                    {b}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
