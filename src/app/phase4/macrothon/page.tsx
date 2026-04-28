"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PSCalendar from "../../../components/PScalendar";
import LeaderboardChart from "../../../components/LeaderboardChart";

/* ---------------- TYPES ---------------- */

type Macrothon = {
  id: number;
  title: string;
  description: string;
  prize: string;
  startDate: string;
  deadline: string;
  domain: string;
  club?: {
    name: string;
  };
};

/* ---------------- THEME ---------------- */

const theme = {
  name: "Elite",
  accent: "#E6B76A",
  border: "#3A3324",
  soft: "rgba(230,183,106,0.08)",
};

/* ---------------- CONSTANTS ---------------- */

const DOMAINS = ["all", "frontend", "backend", "ai", "dsa"];

const LEADERBOARD = [
  { name: "Omkar", score: 320 },
  { name: "DevX", score: 280 },
];

/* ---------------- MAIN ---------------- */

export default function Macrothon() {
  const [activeDomain, setActiveDomain] = useState("all");
  const [macrothons, setMacrothons] = useState<Macrothon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"explore" | "myspace">("explore");

  const [selected, setSelected] = useState<Macrothon | null>(null);
  const [locked, setLocked] = useState<Macrothon[]>([]);
  const [submitModal, setSubmitModal] = useState<Macrothon | null>(null);

  const [submission, setSubmission] = useState({
    github: "",
    demo: "",
  });

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchMacrothons = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/club/macrothons/all",
        );
        const data = await res.json();

        if (!data.ok) throw new Error("Failed");

        setMacrothons(data.macrothons);
      } catch (err) {
        console.error("Macrothon fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMacrothons();
  }, []);

  /* ---------------- LOGIC ---------------- */
  const calendarData = macrothons.map((m) => ({
    id: m.id,
    title: m.title,
    start: m.startDate, // ✅ real start
    expiry: m.deadline,
  }));

  const filtered =
    activeDomain === "all"
      ? macrothons
      : macrothons.filter((c) => c.domain === activeDomain);

  const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const lockPS = (ps: Macrothon) => {
    if (locked.length >= 2) {
      alert("Max 2 macrothons allowed");
      return;
    }
    if (!locked.find((l) => l.id === ps.id)) {
      setLocked([...locked, ps]);
      setSelected(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Macrothons...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white px-6 py-16 mt-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-5xl font-bold font-[Orbitron]">Macrothon</h1>

        <LeaderboardChart data={LEADERBOARD} theme={theme} />

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

        {/* TABS */}
        <div className="flex gap-4">
          {["explore", "myspace"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className="px-4 py-2 rounded-lg text-sm"
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

        {/* ================= EXPLORE ================= */}
        {activeTab === "explore" && (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((c) => {
              const daysLeft = getDaysLeft(c.deadline);
              const isLocked = locked.some((l) => l.id === c.id);

              return (
                <motion.div
                  key={c.id}
                  whileHover={!isLocked ? { y: -6, scale: 1.02 } : {}}
                  onClick={() => !isLocked && setSelected(c)}
                  className="p-6 rounded-2xl cursor-pointer"
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: theme.soft,
                  }}
                >
                  <div className="flex justify-between text-xs mb-3">
                    <span>{c.domain}</span>
                    <span>{daysLeft}d</span>
                  </div>

                  <h3 className="text-lg mb-2">{c.title}</h3>
                  <p className="text-sm text-gray-400">{c.description}</p>

                  <div className="mt-3 flex gap-2 text-xs">
                    <span style={{ color: theme.accent }}>
                      Prize: {c.prize}
                    </span>
                    <span className="text-gray-500">{c.club?.name}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ================= MY SPACE ================= */}
        {activeTab === "myspace" && (
          <div className="space-y-8">
            {locked.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-12">
                No active macrothons yet.
              </div>
            ) : (
              locked.map((ps) => {
                const daysLeft = Math.ceil(
                  (new Date(ps.deadline).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                );

                return (
                  <motion.div
                    key={ps.id}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="relative p-8 rounded-3xl overflow-hidden"
                    style={{
                      border: `1px solid ${theme.border}`,
                      background: `linear-gradient(145deg, rgba(20,20,25,0.9), rgba(10,10,12,0.9))`,
                    }}
                  >
                    {/* 🔥 Glow Layer */}
                    <div
                      className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500"
                      style={{
                        background: `radial-gradient(circle at top left, ${theme.accent}22, transparent)`,
                      }}
                    />

                    {/* HEADER */}
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight">
                          {ps.title}
                        </h3>

                        <div className="text-xs text-gray-500 mt-1">
                          {ps.domain} • {ps.club?.name || "Club"}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className="text-[10px] px-3 py-1 rounded-full border"
                          style={{
                            borderColor: `${theme.accent}40`,
                            color: theme.accent,
                            background: `${theme.accent}10`,
                          }}
                        >
                          Active
                        </span>

                        <span className="text-xs text-gray-400">
                          {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                        </span>
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-sm text-gray-300 leading-relaxed mb-6 relative z-10">
                      {ps.description}
                    </p>

                    {/* PROGRESS BAR */}
                    <div className="mb-6 relative z-10">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>In Progress</span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: "20%" }}
                          animate={{ width: "60%" }} // 🔥 replace later with real progress
                          className="h-full"
                          style={{
                            background: `linear-gradient(90deg, ${theme.accent}, #FFD54F)`,
                          }}
                        />
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex gap-2 text-xs">
                        <span
                          className="px-2 py-1 rounded"
                          style={{
                            background: `${theme.accent}15`,
                            color: theme.accent,
                          }}
                        >
                          Prize: {ps.prize}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-full text-xs border border-white/10 hover:bg-white/5 transition">
                          View Details
                        </button>

                        <button
                          onClick={() => setSubmitModal(ps)}
                          className="px-5 py-2 rounded-full text-sm font-medium transition"
                          style={{
                            background: theme.accent,
                            color: "#000",
                            boxShadow: `0 0 20px ${theme.accent}33`,
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* MODAL */}
        {selected && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
            <div className="bg-[#111] p-6 rounded-xl max-w-lg w-full">
              <h2 className="text-xl">{selected.title}</h2>
              <p className="text-gray-400">{selected.description}</p>

              <button
                onClick={() => lockPS(selected)}
                className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded"
              >
                Lock Macrothon
              </button>
            </div>
          </div>
        )}

        {submitModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl"
              style={{
                background: "#111",
                border: `1px solid ${theme.border}`,
              }}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Submit – {submitModal.title}
                </h2>

                <button
                  onClick={() => setSubmitModal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* INPUTS */}
              <div className="space-y-4">
                <input
                  placeholder="GitHub Repository Link"
                  value={submission.github}
                  onChange={(e) =>
                    setSubmission({ ...submission, github: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-full bg-black border border-white/10 focus:outline-none focus:border-white/30"
                />

                <input
                  placeholder="Live Demo Link"
                  value={submission.demo}
                  onChange={(e) =>
                    setSubmission({ ...submission, demo: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-full bg-black border border-white/10 focus:outline-none focus:border-white/30"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setSubmitModal(null)}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        "http://localhost:5000/api/macrothon/submit",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            macrothonId: submitModal.id,
                            github: submission.github,
                            demo: submission.demo,
                          }),
                        },
                      );

                      const data = await res.json();

                      if (data.ok) {
                        setSubmitModal(null);
                        setSubmission({ github: "", demo: "" });
                      }
                    } catch (err) {
                      console.error("Submission error:", err);
                    }
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    background: theme.accent,
                    color: "#000",
                  }}
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <PSCalendar challenges={calendarData} theme={theme} />
    </div>
  );
}
