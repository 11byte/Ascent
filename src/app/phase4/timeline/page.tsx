"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SkillLogger from "../../../components/SkillLogger";

const sPositions = [
  { left: "30%", top: "20%" },
  { left: "60%", top: "32%" },
  { left: "30%", top: "58%" },
  { left: "60%", top: "78%" },
];

export default function TVAInteractiveTimeline() {
  const [focused, setFocused] = useState<number | null>(null);
  const [phases, setPhases] = useState<any[]>([]);

  const toggleFocus = (id: number) => setFocused((p) => (p === id ? null : id));

  const API = "http://localhost:5000/api/skills";

  /* =========================================
     Fetch timeline data from backend
  ========================================= */
  const fetchTimeline = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No auth token found");
        return;
      }

      const res = await fetch(`${API}/timeline`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Timeline request failed:", res.status);
        return;
      }

      const data = await res.json();
      if (!data.ok) return;

      const timeline = data.timeline;

      const phaseTitles = [
        "Foundation",
        "Skill Development",
        "Advanced Projects",
        "Achievements & Recognition",
      ];

      const phaseColors = ["#00E5FF", "#FF2EC8", "#00FF9D", "#FF8A36"];

      const dynamicPhases = [1, 2, 3, 4].map((phaseId) => {
        const skills = timeline[phaseId] || [];

        const categories: any = {};

        skills.forEach((skill: any) => {
          if (!categories[skill.category]) {
            categories[skill.category] = [];
          }

          categories[skill.category].push(skill);
        });

        const subNodes = Object.keys(categories).map((cat, index) => ({
          id: `${phaseId}-${index}`,
          name: cat,
          color: phaseColors[phaseId - 1],

          children: categories[cat].map((s: any, i: number) => ({
            id: `${phaseId}-${index}-${i}`,
            name: s.skillName,
            color: phaseColors[phaseId - 1],
          })),
        }));

        return {
          id: phaseId,
          roman: ["I", "II", "III", "IV"][phaseId - 1],
          title: phaseTitles[phaseId - 1],
          color: phaseColors[phaseId - 1],
          subNodes,
        };
      });

      setPhases(dynamicPhases);
    } catch (err) {
      console.error("Timeline fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#05010b] to-[#0c0b16] overflow-hidden font-[Cinzel] text-white">
      <div className="absolute right-0 top-25 z-50">
        <SkillLogger onSkillAdded={fetchTimeline} />
      </div>

      {/* Background glow */}

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side at 30% 20%, rgba(0,255,255,0.03), transparent 20%), radial-gradient(closest-side at 70% 80%, rgba(255,0,255,0.02), transparent 25%)",
          }}
        />
      </div>

      {/* S Curve */}

      {focused === null && (
        <svg
          viewBox="0 0 1000 900"
          className="absolute w-full h-full pointer-events-none left-[260px] top-[100px]"
          preserveAspectRatio="none"
        >
          <path
            d="M170 110 C 560 160, 560 330, 220 420 S 980 660, 150 800"
            stroke="#00E5FF33"
            strokeWidth={3.5}
            fill="none"
            strokeLinecap="round"
          />

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

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          {phases.map((p, i) => {
            const isFocused = focused === p.id;
            const isAnyFocused = focused !== null;
            const basePos = sPositions[i];

            const containerStyle: React.CSSProperties = isFocused
              ? { left: "6%", top: "22%", transform: "translateY(-50%)" }
              : isAnyFocused
                ? {
                    left: `${10 + i * 22}%`,
                    top: "86%",
                    transform: "translateY(0%)",
                  }
                : {
                    left: basePos.left,
                    top: basePos.top,
                    transform: "translate(-50%, -50%)",
                  };

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
                }}
                onClick={() => toggleFocus(p.id)}
              >
                <motion.div
                  whileHover={isAnyFocused ? {} : { scale: 1.08 }}
                  className="flex flex-col items-center justify-center rounded-full cursor-pointer"
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

                  {!isFocused && !isAnyFocused && (
                    <div className="mt-3 text-xs text-[#9fdff7]">{p.title}</div>
                  )}

                  {isFocused && (
                    <motion.div
                      className="absolute left-[calc(100%+30px)] top-1/2 -translate-y-1/2 w-[52vw] max-w-[900px]"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45 }}
                    >
                      <div
                        style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: p.color,
                        }}
                      >
                        {p.title}
                      </div>

                      <div className="mt-6 bg-[#0b0b12]/40 p-6 rounded-2xl border border-white/6 backdrop-blur-sm">
                        <div className="flex flex-col gap-8">
                          {p.subNodes.map((sub: any) => (
                            <div key={sub.id} className="flex flex-col gap-2">
                              <div
                                style={{ color: sub.color, fontWeight: 700 }}
                              >
                                {sub.name}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {sub.children.map((c: any) => (
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
    </div>
  );
}
