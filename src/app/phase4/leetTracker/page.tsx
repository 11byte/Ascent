"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeetCodeData {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
}

// ---------- THEME ----------
const phase2Theme = {
  tBorder: { light: "#E8E3D4", dark: "#E8E3D4" },
  tColor: { light: "#fff", dark: "black" },
  tDepthColor: { light: "#CBAF68", dark: "#CBAF68" },
};

export default function LeetObserver() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"analytics" | "progress">("analytics");

  const fetchLeetCodeData = async () => {
    if (!username) return setError("Please enter your LeetCode username");
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(
        `http://localhost:5000/auth/leetcode/${username}`
      );
      if (!res.ok) throw new Error("User not found or API issue");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white px-6 py-25 flex flex-col items-center">
      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-[Orbitron] mb-10 text-center text-[#E8E3D4]"
      >
        Leet Tracker
      </motion.h1>

      {/* USER INPUT */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <input
          type="text"
          placeholder="Enter LeetCode username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`bg-gray-800 text-white px-4 py-3 rounded-lg w-72 focus:outline-none focus:ring-2`}
          style={{
            boxShadow: `0 0 0 0px transparent`,
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 2px ${phase2Theme.tColor.dark}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 0px transparent`;
          }}
        />

        <button
          onClick={fetchLeetCodeData}
          disabled={loading}
          className="px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
          style={{
            background: `linear-gradient(to right, ${phase2Theme.tColor.dark}, ${phase2Theme.tDepthColor.dark})`,
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </motion.div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl bg-gray-900 bg-opacity-70 backdrop-blur-xl border border-gray-800 rounded-2xl p-10 shadow-2xl space-y-10"
        >
          {/* VIEW TOGGLE */}
          <div className="flex justify-center mb-4">
            <div className="bg-gray-800 rounded-full p-1 flex">
              <button
                onClick={() => setView("analytics")}
                className={`px-5 py-2 rounded-full font-medium transition-all ${
                  view === "analytics"
                    ? "shadow-lg text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                style={
                  view === "analytics"
                    ? {
                        background: `linear-gradient(to right, ${phase2Theme.tColor.dark}, ${phase2Theme.tDepthColor.dark})`,
                      }
                    : {}
                }
              >
                Analytical View
              </button>
              <button
                onClick={() => setView("progress")}
                className={`px-5 py-2 rounded-full font-medium transition-all ${
                  view === "progress"
                    ? "shadow-lg text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                style={
                  view === "progress"
                    ? {
                        background: `linear-gradient(to right, ${phase2Theme.tDepthColor.dark}, ${phase2Theme.tColor.dark})`,
                      }
                    : {}
                }
              >
                Progress View
              </button>
            </div>
          </div>

          {/* VIEW RENDER */}
          <AnimatePresence mode="wait">
            {view === "analytics" ? (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                {/* ANALYTICAL MODULES */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                  <Stat
                    label="Total Solved"
                    value={`${data.totalSolved}/${data.totalQuestions}`}
                    color={phase2Theme.tColor.dark}
                  />
                  <Stat
                    label="Ranking"
                    value={`#${data.ranking}`}
                    color={phase2Theme.tDepthColor.dark}
                  />
                  <Stat
                    label="Reputation"
                    value={data.reputation}
                    color={phase2Theme.tBorder.dark}
                  />
                  <Stat
                    label="Contribution"
                    value={data.contributionPoints}
                    color={phase2Theme.tColor.light}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <SubmissionVelocity theme={phase2Theme} />
                  <TagRadar theme={phase2Theme} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <SolveTimeBars theme={phase2Theme} />
                  <CognitiveLoadMeter data={data} theme={phase2Theme} />
                </div>

                <InsightBubble data={data} theme={phase2Theme} />
              </motion.div>
            ) : (
              <motion.div
                key="progress"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                {/* PROGRESS MODULES */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                  <Stat
                    label="Total Solved"
                    value={`${data.totalSolved}/${data.totalQuestions}`}
                    color={phase2Theme.tColor.dark}
                  />
                  <Stat
                    label="Ranking"
                    value={`#${data.ranking}`}
                    color={phase2Theme.tDepthColor.dark}
                  />
                  <Stat
                    label="Reputation"
                    value={data.reputation}
                    color={phase2Theme.tBorder.dark}
                  />
                  <Stat
                    label="Contribution"
                    value={data.contributionPoints}
                    color={phase2Theme.tColor.light}
                  />
                </div>

                <MilestoneTimeline data={data} theme={phase2Theme} />
                <SkillDepthGrid data={data} theme={phase2Theme} />
                <StreakVisualizer theme={phase2Theme} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 bg-opacity-70 rounded-xl p-4 shadow-md border border-gray-700"
    >
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </motion.div>
  );
}

/* SUBMISSION VELOCITY */
function SubmissionVelocity({ theme }: { theme: typeof phase2Theme }) {
  const activity = Array.from({ length: 20 }, () =>
    Math.floor(Math.random() * 12)
  );
  return (
    <div className="bg-gray-800 bg-opacity-70 p-6 rounded-xl">
      <p className="text-gray-400 mb-3">Submission Velocity (past 20 days)</p>
      <div className="flex items-end gap-1 h-32">
        {activity.map((v, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${v * 10}px` }}
            transition={{ delay: i * 0.02 }}
            className="w-3 rounded-md"
            style={{
              background: `linear-gradient(to top, ${theme.tDepthColor.dark}, ${theme.tColor.dark})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* TAG RADAR */
function TagRadar({ theme }: { theme: typeof phase2Theme }) {
  const tags = ["Arrays", "DP", "Graphs", "Greedy", "Strings", "Trees", "Math"];
  const coords = tags.map((_, i) => {
    const angle = (i / tags.length) * 2 * Math.PI;
    const r = 40 + Math.random() * 40;
    return [100 + r * Math.cos(angle), 100 + r * Math.sin(angle)];
  });
  const path = "M" + coords.map((c) => c.join(",")).join("L") + "Z";

  return (
    <div className="bg-gray-800 bg-opacity-70 p-6 rounded-xl">
      <p className="text-gray-400 mb-3">Problem Tag Mastery Radar</p>
      <svg viewBox="0 0 200 200" className="w-full h-56">
        <path
          d={path}
          fill={`${theme.tColor.dark}30`}
          stroke={theme.tColor.dark}
          strokeWidth="2"
        />
        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c[0]}
            cy={c[1]}
            r="3"
            fill={theme.tDepthColor.dark}
          />
        ))}
      </svg>
      <div className="flex justify-center flex-wrap gap-3 text-xs text-gray-400">
        {tags.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* SOLVE TIME BARS */
function SolveTimeBars({ theme }: { theme: typeof phase2Theme }) {
  const times = [
    { label: "Easy", value: 15 },
    { label: "Medium", value: 35 },
    { label: "Hard", value: 60 },
  ];
  return (
    <div className="bg-gray-800 bg-opacity-70 p-6 rounded-xl">
      <p className="text-gray-400 mb-3">Average Solve Time (minutes)</p>
      {times.map((t, i) => (
        <div key={i} className="mb-3">
          <div className="flex justify-between text-sm text-gray-300">
            <span>{t.label}</span>
            <span>{t.value}m</span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(t.value / 60) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-3 rounded-full"
            style={{
              background: `linear-gradient(to right, ${theme.tColor.dark}, ${theme.tDepthColor.dark})`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* COGNITIVE LOAD METER */
function CognitiveLoadMeter({
  data,
  theme,
}: {
  data: LeetCodeData;
  theme: typeof phase2Theme;
}) {
  const load =
    ((data.mediumSolved / data.totalMedium) * 0.5 +
      (data.hardSolved / data.totalHard) * 0.7 +
      data.reputation / 1000) *
    100;
  return (
    <div className="bg-gray-800 bg-opacity-70 p-6 rounded-xl text-center">
      <p className="text-gray-400 mb-3">Cognitive Load Balance</p>
      <div className="relative w-40 h-40 mx-auto">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full blur-xl opacity-40"
          style={{
            background: `linear-gradient(to right, ${theme.tColor.dark}, ${theme.tDepthColor.dark})`,
          }}
        />
        <div className="absolute inset-3 rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold">
          {Math.round(load)}%
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-400">Efficiency Index</p>
    </div>
  );
}

/* MILESTONE TIMELINE */
function MilestoneTimeline({
  data,
  theme,
}: {
  data: LeetCodeData;
  theme: typeof phase2Theme;
}) {
  const milestones = [
    { label: "First 50 Solved", reached: data.totalSolved >= 50 },
    { label: "First Hard Problem", reached: data.hardSolved >= 1 },
    { label: "100 Solved Milestone", reached: data.totalSolved >= 100 },
    { label: "Top 10k Rank", reached: data.ranking < 10000 },
    { label: "Reputation 200+", reached: data.reputation >= 200 },
  ];
  return (
    <div className="bg-gray-800 bg-opacity-70 p-6 rounded-xl">
      <p className="text-gray-400 mb-4">Skill Milestone Path</p>
      <div className="relative flex flex-col items-start">
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.2 }}
          >
            <div
              className={`w-4 h-4 rounded-full ${
                m.reached ? "shadow-lg" : "bg-gray-600"
              }`}
              style={{
                backgroundColor: m.reached
                  ? theme.tColor.dark
                  : "rgb(75 85 99)",
                boxShadow: m.reached ? `0 0 10px ${theme.tColor.dark}` : "none",
              }}
            ></div>
            <p
              className={`text-sm ${
                m.reached ? "text-white" : "text-gray-500"
              }`}
            >
              {m.label}
            </p>
          </motion.div>
        ))}
        <div
          className="absolute left-1 top-2 bottom-2 w-[2px] opacity-40"
          style={{
            background: `linear-gradient(to bottom, ${theme.tColor.dark}, ${theme.tDepthColor.dark})`,
          }}
        ></div>
      </div>
    </div>
  );
}

/* SKILL DEPTH GRID */
function SkillDepthGrid({
  data,
  theme,
}: {
  data: LeetCodeData;
  theme: typeof phase2Theme;
}) {
  const levels = [
    { label: "Easy", val: data.easySolved },
    { label: "Medium", val: data.mediumSolved },
    { label: "Hard", val: data.hardSolved },
  ];
  return (
    <div className="bg-gray-800 bg-opacity-70 p-6 rounded-xl text-center">
      <p className="text-gray-400 mb-3">Difficulty Skill Depth</p>
      <div className="flex justify-around mt-6">
        {levels.map((l, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-bold"
              style={{
                borderColor: theme.tColor.dark,
                color: theme.tColor.light,
              }}
            >
              {l.val}
            </div>
            <p className="mt-2 text-sm text-gray-400">{l.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* STREAK VISUALIZER */
function StreakVisualizer({ theme }: { theme: typeof phase2Theme }) {
  const days = Array.from({ length: 30 }, (_, i) => Math.random() > 0.5);
  return (
    <div className="bg-gray-800 bg-opacity-70 p-6 rounded-xl">
      <p className="text-gray-400 mb-3">30-Day Streak Visualizer</p>
      <div className="grid grid-cols-10 gap-2">
        {days.map((active, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.2 }}
            className="h-6 w-6 rounded-md"
            style={{
              backgroundColor: active ? theme.tColor.dark : "#374151",
            }}
          ></motion.div>
        ))}
      </div>
    </div>
  );
}

/* AI INSIGHT BUBBLE */
function InsightBubble({
  data,
  theme,
}: {
  data: LeetCodeData;
  theme: typeof phase2Theme;
}) {
  const insight =
    data.totalSolved > 300
      ? "You're in top percentile — your pattern depth and consistency suggest expert-tier discipline!"
      : data.hardSolved > 20
      ? "You’re diving deep into complex patterns — balance difficulty diversity to maintain sharpness."
      : "Momentum growing — stabilize streak rhythm and expand into new topics weekly.";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="border p-6 rounded-xl text-center italic text-lg shadow-lg"
      style={{
        background: `linear-gradient(to right, ${theme.tColor.dark}30, ${theme.tDepthColor.dark}30)`,
        borderColor: theme.tColor.dark,
      }}
    >
      “{insight}”
    </motion.div>
  );
}
