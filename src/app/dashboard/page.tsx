// /app/dashboard/page.tsx
"use client";

import React, { useMemo, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveRadar } from "@nivo/radar";
// Instead of import * as ReactWindow ...
import { Virtuoso } from "react-virtuoso";

import {
  Search,
  Filter,
  FilePlus,
  Download,
  ExternalLink,
  User,
} from "lucide-react";

/* ✅ runtime-safe extraction from react-window */

/**
 * Production-grade HOD Dashboard (client)
 * - Virtualized lists (react-window) for each phase
 * - Nivo charts for detail panel
 * - Dark jade/emerald theme
 *
 * Replace dummy data generation with your backend API.
 */

/* -------------------------
   Types
------------------------- */
type Phase = 1 | 2 | 3 | 4;
type Skill = { name: string; level: number };
type Student = {
  id: string;
  name: string;
  roll: string;
  email: string;
  phase: Phase;
  domains: string[];
  placementInterest: "Placement" | "Higher Studies" | "Undecided";
  skillLog: Skill[];
  achievements: string[];
  gitContribs: number;
  leetSolved: number;
  behaviorScore: number; // 0-100
  timelineScore: number[]; // length 4
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
};

/* -------------------------
   Dummy data generator (scales to thousands)
   Replace this with server data fetching in production
   
   ------------------------- */

const DOMAIN_POOL = [
  "Web",
  "AI",
  "Data Science",
  "Systems",
  "Cloud",
  "SRE",
  "Embedded",
  "Security",
  "Fullstack",
  "ML",
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[], n = 1) {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function generateStudent(i: number): Student {
  const phases: Phase[] = [1, 2, 3, 4];
  const phase = phases[randInt(0, phases.length - 1)] as Phase;
  const name = `Student ${i.toString().padStart(4, "0")}`;
  const roll = `${["FE", "SE", "TE", "BE"][phase - 1]}-${randInt(100, 999)}`;
  const domains = pick(DOMAIN_POOL, randInt(1, 2));
  const skillLog = domains
    .map((d) => ({
      name: `${d} Fundamentals`,
      level: randInt(30, 95),
    }))
    .concat(
      [
        { name: "Communication", level: randInt(30, 85) },
        { name: "Problem Solving", level: randInt(30, 95) },
      ].slice(0, 2)
    );
  const timelineScore = [
    randInt(10, 70),
    randInt(20, 80),
    randInt(20, 95),
    randInt(40, 99),
  ].map((s, idx) => (idx + 1 <= phase ? s : 0));
  const swot = {
    strengths: pick(
      [
        "Teamwork",
        "Strong fundamentals",
        "Quick learner",
        "Open source experience",
        "Leadership",
      ],
      randInt(1, 2)
    ),
    weaknesses: pick(
      [
        "Inconsistent practice",
        "Low portfolio",
        "Interview anxiety",
        "Lack of research exposure",
      ],
      randInt(0, 2)
    ),
    opportunities: pick(
      ["Hackathons", "Internships", "Research projects", "Clubs"],
      randInt(1, 2)
    ),
    threats: pick(
      ["Crowded placement pool", "Industry shifts", "Skill mismatch"],
      randInt(0, 2)
    ),
  };

  return {
    id: `stu-${i}`,
    name,
    roll,
    email: `${name.toLowerCase().replace(/\s/g, ".")}@example.edu`,
    phase,
    domains,
    placementInterest: ["Placement", "Higher Studies", "Undecided"][
      randInt(0, 2)
    ] as Student["placementInterest"],
    skillLog,
    achievements: pick(
      [
        "Hackathon Winner",
        "Intern",
        "Top 10 FE",
        "Published Article",
        "Club Lead",
      ],
      randInt(0, 2)
    ),
    gitContribs: randInt(0, 600),
    leetSolved: randInt(0, 1000),
    behaviorScore: randInt(30, 95),
    timelineScore,
    swot,
  };
}

const STUDENTS = Array.from({ length: 2000 }).map((_, i) =>
  generateStudent(i + 1)
);

/* -------------------------
   Helpers & small UI
------------------------- */
const PHASE_LABEL = (p: Phase) => ["FE", "SE", "TE", "BE"][p - 1];
const phaseBg = (p: Phase) => {
  const shades = ["#064e3b", "#065f46", "#047857", "#064e3b"];
  return shades[p - 1];
};

function formatCSV(arr: Student[]) {
  const header = [
    "id",
    "name",
    "roll",
    "email",
    "phase",
    "domains",
    "gitContribs",
    "leetSolved",
  ];
  const rows = arr.map((s) =>
    header
      .map((h) => {
        if (h === "domains") return `"${s.domains.join(";")}"`;
        return (s as any)[h];
      })
      .join(",")
  );
  return [header.join(","), ...rows].join("\n");
}

/* Simple accessible student row (keyboard focusable) */
function StudentRow({
  student,
  onSelect,
  style,
}: {
  student: Student;
  onSelect: (s: Student) => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect(student);
      }}
      onClick={() => onSelect(student)}
      className="w-full px-3 py-2 rounded-md hover:bg-emerald-900/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 flex justify-between items-center"
      style={style}
      aria-label={`Open ${student.name} details`}
    >
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-500 text-white font-semibold">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="text-sm font-medium text-emerald-100">
              {student.name}
            </div>
            <div className="text-xs text-emerald-300">
              {student.roll} • {student.domains.join(" · ")}
            </div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-emerald-200 font-semibold">
          {student.gitContribs + student.leetSolved}
        </div>
        <div className="text-xs text-emerald-400">{student.behaviorScore}%</div>
      </div>
    </div>
  );
}

/* -------------------------
   Dashboard Page component
------------------------- */
export default function HODDashboardPage() {
  const [students] = useState<Student[]>(STUDENTS);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<Phase | "all">("all");
  const jumpRef = useRef<HTMLInputElement | null>(null);

  // Phase-wise groups (memoized for performance)
  const grouped = useMemo(() => {
    const groups: Record<Phase, Student[]> = { 1: [], 2: [], 3: [], 4: [] };
    students.forEach((s) => {
      if (phaseFilter === "all" || phaseFilter === s.phase) {
        // simple filter by query
        if (!query.trim()) groups[s.phase].push(s);
        else {
          const q = query.toLowerCase();
          if (
            s.name.toLowerCase().includes(q) ||
            s.roll.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.domains.join(" ").toLowerCase().includes(q)
          ) {
            groups[s.phase].push(s);
          }
        }
      }
    });
    // sort by (git+leet) desc for visibility
    (Object.keys(groups) as unknown as Phase[]).forEach((p) =>
      groups[p].sort(
        (a, b) => b.gitContribs + b.leetSolved - (a.gitContribs + a.leetSolved)
      )
    );
    return groups;
  }, [students, query, phaseFilter]);

  // Basic totals
  const totals = useMemo(
    () => ({
      total: students.length,
      byPhase: [
        grouped[1].length,
        grouped[2].length,
        grouped[3].length,
        grouped[4].length,
      ],
      avgLeet: Math.round(
        students.reduce((a, b) => a + b.leetSolved, 0) / students.length
      ),
      avgGit: Math.round(
        students.reduce((a, b) => a + b.gitContribs, 0) / students.length
      ),
    }),
    [students, grouped]
  );

  const exportVisibleCSV = useCallback(() => {
    const visible = Object.values(grouped).flat();
    const csv = formatCSV(visible);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ascent_students_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [grouped]);

  const exportPhaseCSV = useCallback(
    (phase: Phase) => {
      const csv = formatCSV(grouped[phase]);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ascent_students_phase_${phase}_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [grouped]
  );

  const handleJumpTo = () => {
    const val = jumpRef.current?.value?.trim();
    if (!val) return;
    // Try to find student by roll or name
    const found = students.find(
      (s) =>
        s.roll.toLowerCase() === val.toLowerCase() ||
        s.name.toLowerCase() === val.toLowerCase()
    );
    if (found) {
      setSelected(found);
    } else {
      alert("No student found for that roll/name (demo).");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#021713] to-[#04291e] text-emerald-100">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold font-[Orbitron]">
              Student Analysis Dashboard
            </h1>
            <p className="text-emerald-300 text-sm mt-1">
              Phase-based student insights · scalable to thousands · actionable
              recommendations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="text-xs text-emerald-300">Total</div>
              <div className="text-xl font-semibold text-emerald-100">
                {totals.total}
              </div>
            </div>

            <button
              onClick={exportVisibleCSV}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-700/20 border border-emerald-600 rounded-md text-emerald-100 hover:bg-emerald-700/30"
            >
              <Download size={16} /> Export visible CSV
            </button>

            <button
              onClick={() => {
                /* placeholder: create new student */ alert(
                  "Create student flow (demo)"
                );
              }}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-black rounded-md"
            >
              <FilePlus size={16} /> Add student
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-start justify-between mb-6">
          <div className="flex items-center gap-3 w-full md:w-1/2">
            <Search className="text-emerald-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, roll, email or domain..."
              className="w-full bg-[#05251c] text-emerald-100 placeholder:emerald-400 rounded-md px-3 py-2 border border-[#0e3e2e] focus:ring-2 focus:ring-emerald-500"
            />
            <Filter className="text-emerald-400" />
            <select
              value={phaseFilter}
              onChange={(e) =>
                setPhaseFilter(
                  e.target.value === "all"
                    ? "all"
                    : (Number(e.target.value) as Phase)
                )
              }
              className="bg-[#05251c] px-3 py-2 rounded-md border border-[#0e3e2e] text-emerald-100"
            >
              <option value="all">All phases</option>
              <option value={1}>FE</option>
              <option value={2}>SE</option>
              <option value={3}>TE</option>
              <option value={4}>BE</option>
            </select>
          </div>

          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              ref={jumpRef}
              placeholder="Jump to roll or name..."
              className="bg-[#05251c] px-3 py-2 rounded-md border border-[#0e3e2e]"
            />
            <button
              onClick={handleJumpTo}
              className="px-3 py-2 rounded-md bg-emerald-600 text-black"
            >
              Go
            </button>
          </div>
        </div>

        {/* Phase sections grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 font-[Orbitron]">
          {[1, 2, 3, 4].map((p) => (
            <div
              key={p}
              className="bg-[#05251c] border border-[#0f3d2e] rounded-xl p-3 flex flex-col h-[700px]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-black font-bold">
                    {PHASE_LABEL(p as Phase)}
                  </div>
                  <div>
                    <div className="text-sm text-emerald-300">Phase {p}</div>
                    <div className="text-lg font-semibold text-emerald-100">
                      {grouped[p as Phase].length}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportPhaseCSV(p as Phase)}
                    className="px-2 py-1 rounded-md bg-emerald-700/20 border border-emerald-600 text-emerald-100 text-sm"
                  >
                    Export
                  </button>
                </div>
              </div>

              {/* Virtualized list for the phase */}
              <div className="flex-1">
                {grouped[p as Phase].length === 0 ? (
                  <div className="text-emerald-400 text-sm p-4">
                    No students found
                  </div>
                ) : (
                  <Virtuoso
                    style={{ height: 560 }}
                    totalCount={grouped[p as Phase].length}
                    itemContent={(index) => {
                      const stu = grouped[p as Phase][index];
                      return (
                        <StudentRow student={stu} onSelect={setSelected} />
                      );
                    }}
                  />
                )}
              </div>

              <div className="mt-3 text-xs text-emerald-400">
                Tip: click any row or press Enter when focused to open detailed
                insights.
              </div>
            </div>
          ))}
        </div>

        {/* Detailed slide-in panel */}
        <AnimatePresence>
          {selected && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full md:w-[55%] lg:w-[45%] bg-[#021714] border-l border-[#083427] z-50 overflow-auto p-6"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-black font-bold">
                      {selected.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-emerald-100">
                        {selected.name}
                      </h2>
                      <div className="text-sm text-emerald-300">
                        {selected.roll} · Phase {selected.phase} ·{" "}
                        {selected.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-emerald-300">
                    Domains: {selected.domains.join(", ")} · Placement:{" "}
                    {selected.placementInterest}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(selected.email);
                    }}
                    className="px-3 py-2 rounded-md bg-emerald-700/20 text-emerald-100"
                  >
                    Copy Email
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="px-3 py-2 rounded-md border border-emerald-700 text-emerald-100"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column: charts + swot */}
                <div className="space-y-4">
                  <div className="bg-[#05251c] rounded-xl p-3 h-[280px]">
                    <h4 className="text-emerald-200 text-sm mb-2">
                      Skill Distribution
                    </h4>
                    <div style={{ height: 220 }}>
                      <ResponsiveBar
                        data={selected.skillLog.map((s) => ({
                          skill: s.name,
                          level: s.level,
                        }))}
                        keys={["level"]}
                        indexBy="skill"
                        margin={{ top: 10, right: 10, bottom: 60, left: 60 }}
                        padding={0.3}
                        colors={{ scheme: "greens" }}
                        axisBottom={{
                          tickRotation: -25,
                          legend: "",
                          legendPosition: "middle",
                          legendOffset: 40,
                        }}
                        axisLeft={{
                          legend: "Level",
                          legendPosition: "middle",
                          legendOffset: -50,
                        }}
                        theme={{
                          text: { fill: "#9ff7e1" },
                          axis: {
                            legend: { text: { fill: "#9ff7e1" } },
                            ticks: { text: { fill: "#9ff7e1" } },
                          },
                          grid: { line: { stroke: "#052f24" } },
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-[#05251c] rounded-xl p-3 h-[320px]">
                    <h4 className="text-emerald-200 text-sm mb-2">
                      SWOT (summary radar)
                    </h4>
                    <div style={{ height: 260 }}>
                      <ResponsiveRadar
                        data={[
                          {
                            dimension: "Strengths",
                            score: Math.min(
                              100,
                              selected.swot.strengths.length * 30
                            ),
                          },
                          {
                            dimension: "Weaknesses",
                            score: Math.min(
                              100,
                              selected.swot.weaknesses.length * 30
                            ),
                          },
                          {
                            dimension: "Opportunities",
                            score: Math.min(
                              100,
                              selected.swot.opportunities.length * 30
                            ),
                          },
                          {
                            dimension: "Threats",
                            score: Math.min(
                              100,
                              selected.swot.threats.length * 30
                            ),
                          },
                        ]}
                        keys={["score"]}
                        indexBy="dimension"
                        maxValue={100}
                        colors={["#10b981"]}
                        margin={{ top: 30, right: 40, bottom: 30, left: 40 }}
                        theme={{
                          text: { fill: "#9ff7e1" },
                          grid: { line: { stroke: "#053426" } },
                        }}
                      />
                    </div>
                    <div className="mt-3 text-sm text-emerald-300">
                      <div>
                        <span className="font-semibold text-emerald-100">
                          Strengths:
                        </span>{" "}
                        {selected.swot.strengths.join(", ") || "—"}
                      </div>
                      <div>
                        <span className="font-semibold text-emerald-100">
                          Weaknesses:
                        </span>{" "}
                        {selected.swot.weaknesses.join(", ") || "—"}
                      </div>
                      <div>
                        <span className="font-semibold text-emerald-100">
                          Opportunities:
                        </span>{" "}
                        {selected.swot.opportunities.join(", ") || "—"}
                      </div>
                      <div>
                        <span className="font-semibold text-emerald-100">
                          Threats:
                        </span>{" "}
                        {selected.swot.threats.join(", ") || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column: timeline + details */}
                <div className="space-y-4">
                  <div className="bg-[#05251c] rounded-xl p-3 h-[220px]">
                    <h4 className="text-emerald-200 text-sm mb-2">
                      Timeline Progress
                    </h4>
                    <div style={{ height: 170 }}>
                      <ResponsiveLine
                        data={[
                          {
                            id: "Progress",
                            data: ["FE", "SE", "TE", "BE"].map((x, idx) => ({
                              x,
                              y: selected.timelineScore[idx] ?? 0,
                            })),
                          },
                        ]}
                        margin={{ top: 10, right: 20, bottom: 40, left: 60 }}
                        xScale={{ type: "point" }}
                        yScale={{ type: "linear", min: 0, max: 100 }}
                        colors={["#34d399"]}
                        axisBottom={{
                          tickRotation: 0,
                          legend: "Phase",
                          legendOffset: 28,
                          legendPosition: "middle",
                        }}
                        axisLeft={{
                          legend: "Score",
                          legendOffset: -40,
                          legendPosition: "middle",
                        }}
                        pointSize={8}
                        useMesh
                        theme={{
                          text: { fill: "#9ff7e1" },
                          grid: { line: { stroke: "#053426" } },
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-[#05251c] rounded-xl p-4">
                    <h4 className="text-emerald-200 text-sm mb-2">
                      Quick Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#021f19] p-3 rounded-md">
                        <div className="text-xs text-emerald-300">
                          Leet Solved
                        </div>
                        <div className="text-xl font-semibold text-emerald-100">
                          {selected.leetSolved}
                        </div>
                      </div>
                      <div className="bg-[#021f19] p-3 rounded-md">
                        <div className="text-xs text-emerald-300">
                          Git Contributions
                        </div>
                        <div className="text-xl font-semibold text-emerald-100">
                          {selected.gitContribs}
                        </div>
                      </div>
                      <div className="bg-[#021f19] p-3 rounded-md">
                        <div className="text-xs text-emerald-300">
                          Behaviour
                        </div>
                        <div className="text-xl font-semibold text-emerald-100">
                          {selected.behaviorScore}%
                        </div>
                      </div>
                      <div className="bg-[#021f19] p-3 rounded-md">
                        <div className="text-xs text-emerald-300">
                          Achievements
                        </div>
                        <div className="text-xl font-semibold text-emerald-100">
                          {selected.achievements.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#05251c] rounded-xl p-4">
                    <h4 className="text-emerald-200 text-sm mb-2">
                      AI Recommendation
                    </h4>
                    <div className="text-emerald-300 text-sm">
                      Based on activity, recommended next steps:
                      <ul className="list-disc ml-5 mt-2">
                        <li>
                          Enroll in a {selected.domains[0]} club and participate
                          in macrothons.
                        </li>
                        <li>
                          Contribute to 2 small OSS issues to increase Git
                          score.
                        </li>
                        <li>
                          Complete 3 medium difficulty Leet problems weekly to
                          reach placement readiness.
                        </li>
                      </ul>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-2 rounded-md bg-emerald-600 text-black">
                        Create action
                      </button>
                      <button className="px-3 py-2 rounded-md border border-emerald-600">
                        Message student
                      </button>
                      <a
                        className="ml-auto text-emerald-300 flex items-center gap-2"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Open profile (demo)");
                        }}
                      >
                        <ExternalLink size={14} /> Open Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
