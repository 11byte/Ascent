"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PSCalendar from "../../../components/PScalendar";
import LeaderboardChart from "../../../components/LeaderboardChart";

/* ---------------- TYPES ---------------- */

type Challenge = {
  id: number;
  title: string;
  domain: string;
  difficulty: string;
  description: string;
  start: string;
  expiry: string;
  requirements: string[];
};

/* ---------------- THEME ---------------- */

const theme = {
  name: "Elite",
  accent: "#E6B76A",
  border: "#3A3324",
  soft: "rgba(230,183,106,0.08)",
};

/* ---------------- DATA ---------------- */

const DOMAINS = ["all", "frontend", "backend", "ai", "dsa"];

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "AI Email Generator",
    domain: "ai",
    difficulty: "Advanced",
    start: "2026-04-01",
    expiry: "2026-04-10",
    description: "Generate emails using user style modeling.",
    requirements: ["LLM", "Prompting"],
  },
  {
    id: 2,
    title: "Realtime Chat App",
    domain: "backend",
    difficulty: "Intermediate",
    start: "2026-04-05",
    expiry: "2026-04-18",
    description: "Build socket-based chat system.",
    requirements: ["WebSockets", "Auth"],
  },
  {
    id: 3,
    title: "Portfolio UI",
    domain: "frontend",
    difficulty: "Beginner",
    start: "2026-04-08",
    expiry: "2026-04-22",
    description: "Modern animated portfolio.",
    requirements: ["Responsive"],
  },
];

const LEADERBOARD = [
  { name: "Omkar", score: 320 },
  { name: "DevX", score: 280 },
  { name: "User_02", score: 250 },
  { name: "User_02", score: 250 },
  { name: "User_02", score: 250 },
  { name: "User_02", score: 250 },
];

/* ---------------- LEADERBOARD COMPONENT ---------------- */

/* ---------------- MAIN ---------------- */

export default function Macrothon() {
  const [activeDomain, setActiveDomain] = useState("all");
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [locked, setLocked] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState<"explore" | "myspace">("explore");

  const lockPS = (ps: Challenge) => {
    if (locked.length >= 2) {
      alert("You can only lock 2 PS per month");
      return;
    }

    if (!locked.find((l) => l.id === ps.id)) {
      setLocked([...locked, ps]);
      setSelected(null);
    }
  };

  const filtered =
    activeDomain === "all"
      ? CHALLENGES
      : CHALLENGES.filter((c) => c.domain === activeDomain);

  const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white px-6 py-16 mt-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-5xl font-bold tracking-tight font-[Orbitron]">
          Macrothon
        </h1>
        {/* HERO LEADERBOARD */}
        <LeaderboardChart data={LEADERBOARD} theme={theme} />

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <div
            className="p-4 rounded-xl border"
            style={{ borderColor: theme.border }}
          >
            <div className="text-gray-400 text-sm">Challenges</div>
            <div className="text-2xl">{CHALLENGES.length}</div>
          </div>

          <div
            className="p-4 rounded-xl border"
            style={{ borderColor: theme.border }}
          >
            <div className="text-gray-400 text-sm">Ending Soon</div>
            <div className="text-2xl">
              {CHALLENGES.filter((c) => getDaysLeft(c.expiry) <= 2).length}
            </div>
          </div>

          <div
            className="p-4 rounded-xl border"
            style={{ borderColor: theme.border }}
          >
            <div className="text-gray-400 text-sm">Domains</div>
            <div className="text-2xl">{DOMAINS.length - 1}</div>
          </div>
        </div>

        {/* DOMAIN FILTER */}
        <div className="flex gap-2">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d)}
              className="px-4 py-2 rounded-lg text-sm capitalize"
              style={{
                background: activeDomain === d ? theme.accent : "transparent",
                color: activeDomain === d ? "#000" : "#9ca3af",
                border: `1px solid ${theme.border}`,
              }}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex gap-4 mb-8">
          {["explore", "myspace"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className="px-4 py-2 rounded-lg text-sm capitalize"
              style={{
                background: activeTab === tab ? theme.accent : "transparent",
                color: activeTab === tab ? "#000" : "#9ca3af",
                border: `1px solid ${theme.border}`,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ===================== CHALLENGE GRID ===================== */}
        {activeTab === "explore" && (
          <>
            {filtered.length === 0 ? (
              <div className="text-gray-500 text-sm">
                No challenges in this domain.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filtered.map((c) => {
                  const daysLeft = getDaysLeft(c.expiry);
                  const isLocked = locked.some((l) => l.id === c.id);

                  return (
                    <motion.div
                      key={c.id}
                      whileHover={!isLocked ? { y: -6, scale: 1.02 } : {}}
                      onClick={() => !isLocked && setSelected(c)}
                      className={`relative rounded-2xl p-6 overflow-hidden ${
                        isLocked
                          ? "opacity-70 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      style={{
                        border: `1px solid ${theme.border}`,
                        background: theme.soft,
                      }}
                    >
                      {/* Glow */}
                      {!isLocked && (
                        <div
                          className="absolute inset-0 opacity-0 hover:opacity-100 transition"
                          style={{
                            background: `radial-gradient(circle at top left, ${theme.accent}22, transparent)`,
                          }}
                        />
                      )}

                      {/* LOCKED BADGE */}
                      {isLocked && (
                        <div className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                          🔒 Locked
                        </div>
                      )}

                      {/* HEADER */}
                      <div className="flex justify-between items-center text-xs mb-3">
                        <div className="flex gap-2 items-center">
                          <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                            {c.domain}
                          </span>

                          {daysLeft <= 2 && (
                            <span className="text-[10px] px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                              ⚡ Urgent
                            </span>
                          )}
                        </div>

                        <span className="text-gray-400">{daysLeft}d</span>
                      </div>

                      {/* TITLE */}
                      <h3 className="text-lg font-medium mb-2">{c.title}</h3>

                      {/* DESCRIPTION */}
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {c.description}
                      </p>

                      {/* FOOTER */}
                      <div className="mt-4 flex justify-between items-center text-xs">
                        <span className="text-gray-500">{c.difficulty}</span>

                        <span
                          className="text-[10px] px-2 py-1 rounded"
                          style={{
                            background: `${theme.accent}15`,
                            color: theme.accent,
                          }}
                        >
                          View →
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ===================== MY SPACE ===================== */}
        {activeTab === "myspace" && (
          <div className="space-y-8">
            {locked.length === 0 ? (
              <div className="text-gray-500 text-sm">
                No locked challenges yet.
              </div>
            ) : (
              locked.map((ps) => (
                <div
                  key={ps.id}
                  className="relative p-8 rounded-3xl space-y-6"
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: `linear-gradient(to bottom, ${theme.soft}, transparent)`,
                  }}
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight">
                        {ps.title}
                      </h3>

                      <div className="text-xs text-gray-500 mt-1">
                        {ps.domain} • {ps.difficulty}
                      </div>
                    </div>

                    <span className="text-[10px] px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400">
                      Active
                    </span>
                  </div>

                  {/* META */}
                  <div className="flex justify-between items-center text-xs text-gray-400 border-b border-white/10 pb-4">
                    <span>
                      {ps.start} → {ps.expiry}
                    </span>

                    <span
                      className="px-2 py-1 rounded"
                      style={{
                        background: `${theme.accent}15`,
                        color: theme.accent,
                      }}
                    >
                      Submission Open
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <h4 className="text-xs text-gray-400 mb-2">Overview</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {ps.description}
                    </p>
                  </div>

                  {/* REQUIREMENTS */}
                  <div>
                    <h4 className="text-xs text-gray-400 mb-2">Requirements</h4>

                    <div className="grid grid-cols-2 gap-2">
                      {ps.requirements.map((r, i) => (
                        <div
                          key={i}
                          className="text-xs px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
                        >
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SUBMISSION SECTION */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs text-gray-400">Submission</h4>

                    <div className="space-y-3">
                      <input
                        placeholder="GitHub Repository Link"
                        className="w-full px-5 py-3 rounded-full bg-black border border-white/10 focus:outline-none focus:border-white/30 transition"
                      />

                      <input
                        placeholder="Live Demo Link"
                        className="w-full px-5 py-3 rounded-full bg-black border border-white/10 focus:outline-none focus:border-white/30 transition"
                      />
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="flex justify-end pt-2">
                    <button
                      className="px-6 py-2 rounded-lg text-sm font-medium transition"
                      style={{
                        background: theme.accent,
                        color: "#000",
                        boxShadow: `0 0 20px ${theme.accent}33`,
                      }}
                    >
                      Submit Solution
                    </button>
                  </div>

                  {/* SUBTLE GLOW */}
                  <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top left, ${theme.accent}22, transparent)`,
                    }}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* CALENDAR */}
        <PSCalendar challenges={CHALLENGES} theme={theme} />
        {selected && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl p-8 rounded-3xl"
              style={{
                border: `1px solid ${theme.border}`,
                background: `linear-gradient(to bottom, #111, #0b0b0c)`,
              }}
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {selected.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {selected.domain} • {selected.difficulty}
                  </p>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-500 text-sm hover:text-white transition"
                >
                  Close
                </button>
              </div>

              {/* META */}
              <div className="flex justify-between items-center text-xs text-gray-400 mb-6 border-b border-white/10 pb-4">
                <span>
                  {selected.start} → {selected.expiry}
                </span>

                <span
                  className="px-2 py-1 rounded"
                  style={{
                    background: `${theme.accent}15`,
                    color: theme.accent,
                  }}
                >
                  Active Window
                </span>
              </div>

              {/* DESCRIPTION */}
              <div className="mb-6">
                <h3 className="text-sm text-gray-400 mb-2">Overview</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selected.description}
                </p>
              </div>

              {/* REQUIREMENTS */}
              <div className="mb-8">
                <h3 className="text-sm text-gray-400 mb-2">Requirements</h3>

                <div className="grid grid-cols-2 gap-2">
                  {selected.requirements.map((r, i) => (
                    <div
                      key={i}
                      className="text-xs px-3 py-2 rounded-lg border border-white/10 bg-white/5"
                    >
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setSelected(null)}
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>

                <button
                  onClick={() => lockPS(selected)}
                  className="px-5 py-2 rounded-lg text-sm font-medium transition"
                  style={{
                    background: theme.accent,
                    color: "#000",
                    boxShadow: `0 0 20px ${theme.accent}33`,
                  }}
                >
                  Lock Challenge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
