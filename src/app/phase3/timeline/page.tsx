"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Dummy JSON data (swap for fetch later)
 */
const phases = [
  {
    id: 1,
    roman: "I",
    title: "Foundation",
    color: "#00E5FF",
    subNodes: [
      {
        id: "1-1",
        name: "Core Academics",
        color: "#00E5FF",
        children: [
          { id: "1-1-a", name: "Top Grades in Math", color: "#9ff7ff" },
          { id: "1-1-b", name: "Top Grades in Science", color: "#6fe0d6" },
          { id: "1-1-c", name: "Strong Problem Solving", color: "#7ff0d0" },
        ],
      },
      {
        id: "1-2",
        name: "Early Extracurriculars",
        color: "#8A7BFF",
        children: [
          { id: "1-2-a", name: "Coding Club", color: "#9b97ff" },
          { id: "1-2-b", name: "Math Olympiad", color: "#b3adff" },
        ],
      },
    ],
  },
  {
    id: 2,
    roman: "II",
    title: "Skill Development",
    color: "#FF2EC8",
    subNodes: [
      {
        id: "2-1",
        name: "Technical Skills",
        color: "#FF81C9",
        children: [
          { id: "2-1-a", name: "Python Projects", color: "#ffb0dd" },
          { id: "2-1-b", name: "Web Development", color: "#ffd0ea" },
          { id: "2-1-c", name: "Data Structures", color: "#ffcff2" },
        ],
      },
      {
        id: "2-2",
        name: "Certifications & Competitions",
        color: "#FF4DA6",
        children: [
          { id: "2-2-a", name: "Hackathons Won", color: "#ff90be" },
          { id: "2-2-b", name: "Certified in AWS", color: "#ff7aa8" },
          { id: "2-2-c", name: "LeetCode Rating 1800+", color: "#ff6f92" },
        ],
      },
    ],
  },
  {
    id: 3,
    roman: "III",
    title: "Advanced Projects",
    color: "#00FF9D",
    subNodes: [
      {
        id: "3-1",
        name: "Research & Innovation",
        color: "#61ffc9",
        children: [
          { id: "3-1-a", name: "AI Mini Projects", color: "#8fffd6" },
          { id: "3-1-b", name: "Open Source Contributions", color: "#55e6b8" },
        ],
      },
      {
        id: "3-2",
        name: "Leadership & Impact",
        color: "#22FFB0",
        children: [
          { id: "3-2-a", name: "Tech Club Lead", color: "#9fffe0" },
          { id: "3-2-b", name: "Community Workshops", color: "#6ef7cf" },
          { id: "3-2-c", name: "Mentoring Juniors", color: "#4fd9b5" },
        ],
      },
    ],
  },
  {
    id: 4,
    roman: "IV",
    title: "Achievements & Recognition",
    color: "#FF8A36",
    subNodes: [
      {
        id: "4-1",
        name: "Competitions & Awards",
        color: "#FFA560",
        children: [
          { id: "4-1-a", name: "National Hackathon Winner", color: "#ffc89a" },
          { id: "4-1-b", name: "Coding Championship Gold", color: "#ffb37a" },
          { id: "4-1-c", name: "Research Paper Published", color: "#ff9f66" },
        ],
      },
      {
        id: "4-2",
        name: "Personal Growth",
        color: "#FFD94D",
        children: [
          { id: "4-2-a", name: "Strong Networking Skills", color: "#fff2b3" },
          { id: "4-2-b", name: "Confidence & Leadership", color: "#ffeb99" },
          { id: "4-2-c", name: "Time Management Mastery", color: "#ffe680" },
        ],
      },
    ],
  },
];

/**
 * Positions along an S-curve (percent values)
 * These are the *default* positions (S shape).
 * Feel free to tweak x,y values for a different curve.
 */
const sPositions = [
  { left: "30%", top: "20%" }, // Phase I (top-left)
  { left: "60%", top: "32%" }, // Phase II (top-right)
  { left: "30%", top: "58%" }, // Phase III (mid-left)
  { left: "60%", top: "78%" }, // Phase IV (bottom-right)
];

export default function TVAInteractiveTimeline() {
  const [focused, setFocused] = useState<number | null>(null);

  // handle click: toggle focused node
  const toggleFocus = (id: number) => setFocused((p) => (p === id ? null : id));

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#05010b] to-[#0c0b16] overflow-hidden font-[Cinzel] text-white">
      {/* faint grid / glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side at 30% 20%, rgba(0,255,255,0.03), transparent 20%), radial-gradient(closest-side at 70% 80%, rgba(255,0,255,0.02), transparent 25%)",
          }}
        />
      </div>

      {/* S-curve path (SVG) */}
      {focused === null && (
        <svg
          viewBox="0 0 1000 900"
          className="absolute w-full h-full pointer-events-none left-[260px] top-[100px]"
          preserveAspectRatio="none"
        >
          {/* main S path */}
          <path
            d="M170 110 C 560 160, 560 330, 220 420 S 980 660, 150 800"
            stroke="#00E5FF33"
            strokeWidth={3.5}
            fill="none"
            strokeLinecap="round"
          />
          {/* faint secondary glow */}
          <path
            d="M170 110 C 560 160, 560 330, 220 420 S 980 660, 150 800"
            stroke="#FF2EC833"
            strokeWidth={1}
            fill="none"
            strokeLinecap="round"
            style={{ mixBlendMode: "screen" }}
          />
        </svg>
      )}
      {/* Main layout container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* This container holds the nodes in absolute positions */}
        <div className="relative w-full h-full pointer-events-auto">
          {phases.map((p, i) => {
            const isFocused = focused === p.id;
            const isAnyFocused = focused !== null;
            const basePos = sPositions[i];

            // If focused, clicked node moves to left-center.
            // Other nodes shrink and move to bottom row.
            const containerStyle: React.CSSProperties = isFocused
              ? {
                  left: "6%", // left-center area
                  top: "22%",
                  transform: "translateY(-50%)",
                }
              : isAnyFocused
              ? {
                  left: `${10 + i * 22}%`, // bottom row positions (before translate)
                  top: "86%",
                  transform: "translateY(0%)",
                }
              : {
                  left: basePos.left,
                  top: basePos.top,
                  transform: "translate(-50%, -50%)",
                };

            // zIndex to ensure focused node on top
            const zIdx = isFocused ? 30 : isAnyFocused ? 10 : 20;

            return (
              <motion.div
                key={p.id}
                layout
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
                style={{
                  position: "absolute",
                  ...containerStyle,
                  zIndex: zIdx,
                  width: isFocused ? 420 : isAnyFocused ? 72 : 120,
                  height: isFocused ? 420 : isAnyFocused ? 72 : 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "auto",
                }}
                onClick={() => toggleFocus(p.id)}
                onKeyDown={() => toggleFocus(p.id)}
                role="button"
                tabIndex={0}
              >
                {/* Node visual */}
                <motion.div
                  whileHover={isAnyFocused ? {} : { scale: 1.08 }}
                  animate={{ scale: isFocused ? 1 : 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center justify-center rounded-full select-none cursor-pointer "
                >
                  <div
                    style={{
                      width: isFocused ? 150 : isAnyFocused ? 56 : 100,
                      height: isFocused ? 150 : isAnyFocused ? 56 : 100,
                      borderRadius: 9999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 0 ${isFocused ? 40 : 20}px ${p.color}`,
                      border: `2px solid ${p.color}`,
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: isFocused ? 34 : isAnyFocused ? 14 : 22,
                        fontWeight: 800,
                        color: p.color,
                      }}
                    >
                      {p.roman}
                    </div>
                  </div>

                  {/* small title when not focused */}
                  {!isFocused && !isAnyFocused && (
                    <div className="mt-3 text-xs text-[#9fdff7]">{p.title}</div>
                  )}

                  {/* when focused, main panel shows left and content right */}
                  {isFocused && (
                    <motion.div
                      className="absolute left-[calc(100%+30px)] top-1/2 -translate-y-1/2 w-[52vw] max-w-[900px]"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.45 }}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-6">
                        <div className="flex flex-col items-start">
                          <div
                            style={{
                              fontSize: 28,
                              fontWeight: 700,
                              color: p.color,
                            }}
                          >
                            {p.title}
                          </div>
                          <div className="text-xs text-[#c9dff7aa] mt-1">
                            Phase {p.roman} — full branch view
                          </div>
                        </div>
                      </div>

                      {/* Branch area */}
                      <div className="mt-6 bg-[#0b0b12]/40 p-6 rounded-2xl border border-white/6 backdrop-blur-sm">
                        <div className="flex flex-col gap-8">
                          {p.subNodes.map((sub, idx) => (
                            <div
                              key={sub.id}
                              className="relative flex items-start gap-6"
                            >
                              {/* curved connector from main node to subnode */}
                              <svg
                                className="absolute left-[-80px] top-2"
                                width="80"
                                height="80"
                                viewBox="0 0 80 80"
                                preserveAspectRatio="none"
                                style={{ overflow: "visible" }}
                              >
                                <path
                                  d="M70 40 C 45 40, 35 20, 0 18"
                                  fill="none"
                                  stroke={sub.color + "88"}
                                  strokeWidth={2.2}
                                  strokeLinecap="round"
                                />
                              </svg>

                              {/* Subnode card */}
                              <div
                                style={{
                                  minWidth: 220,
                                  background: `${sub.color}20`,
                                  border: `1px solid ${sub.color}66`,
                                }}
                                className="rounded-lg p-3"
                              >
                                <div
                                  style={{ color: sub.color, fontWeight: 700 }}
                                >
                                  {sub.name}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {/* sub-sub nodes */}
                                  {sub.children.map((c) => (
                                    <div
                                      key={c.id}
                                      className="px-3 py-1 rounded-full text-xs"
                                      style={{
                                        border: `1px solid ${c.color}`,
                                        background: `${c.color}22`,
                                        color: c.color,
                                      }}
                                    >
                                      {c.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* bottom row label (when focused) */}
      <AnimatePresence>
        {focused && (
          <motion.div
            className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* small pills for other phases (already rendered as nodes - this is decorative) */}
            {phases
              .filter((ph) => ph.id !== focused)
              .map((ph, idx) => (
                <div
                  key={ph.id}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    background: `${ph.color}22`,
                    border: `1px solid ${ph.color}55`,
                    color: ph.color,
                  }}
                >
                  {ph.title}
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
