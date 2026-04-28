"use client";

import React, {
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveRadar } from "@nivo/radar";
import { Virtuoso } from "react-virtuoso";

import { Search, Filter, FilePlus, Download, ExternalLink } from "lucide-react";

/* -------------------------
   TYPES
------------------------- */
type Phase = 1 | 2 | 3 | 4;

type Student = {
  id: string;
  name: string;
  roll: string;
  email: string;
  phase: Phase;
  domains: string[];
  placementInterest: string;
  skillLog: { name: string; level: number }[];
  achievements: string[];
  gitContribs: number;
  leetSolved: number;
  behaviorScore: number;
  timelineScore: number[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };

  // 🔥 NEW: ML fields
  aiAnalysis?: string;
};

/* -------------------------
   HELPERS
------------------------- */
const PHASE_LABEL = (p: Phase) => ["FE", "SE", "TE", "BE"][p - 1];

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
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

/* -------------------------
   STUDENT ROW
------------------------- */
function StudentRow({
  student,
  onSelect,
}: {
  student: Student;
  onSelect: (s: Student) => void;
}) {
  return (
    <div
      onClick={() => onSelect(student)}
      className="w-full px-3 py-2 rounded-md hover:bg-emerald-900/10 flex justify-between items-center cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-500 text-white font-semibold">
          {student.name[0]}
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
   MAIN DASHBOARD
------------------------- */
export default function HODDashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<Phase | "all">("all");
  const [loading, setLoading] = useState(true);
  const jumpRef = useRef<HTMLInputElement | null>(null);

  /* -------------------------
     🔥 FETCH FROM BACKEND
  ------------------------- */
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard/students");
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();

    // 🔥 auto refresh every 5 sec (Kafka sync)
    const interval = setInterval(fetchStudents, 5000);
    return () => clearInterval(interval);
  }, []);

  /* -------------------------
     GROUPING
  ------------------------- */
  const grouped = useMemo(() => {
    const groups: Record<Phase, Student[]> = { 1: [], 2: [], 3: [], 4: [] };

    students.forEach((s) => {
      if (phaseFilter === "all" || s.phase === phaseFilter) {
        if (!query) groups[s.phase].push(s);
        else {
          const q = query.toLowerCase();
          if (
            s.name.toLowerCase().includes(q) ||
            s.roll.toLowerCase().includes(q)
          ) {
            groups[s.phase].push(s);
          }
        }
      }
    });

    return groups;
  }, [students, query, phaseFilter]);

  /* -------------------------
     EXPORT
  ------------------------- */
  const exportCSV = useCallback(() => {
    const csv = formatCSV(Object.values(grouped).flat());
    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
  }, [grouped]);

  /* -------------------------
     UI
  ------------------------- */
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#021713] to-[#04291e] text-emerald-100">
      <h1 className="text-3xl font-bold mb-4">Student Analysis Dashboard</h1>

      {/* Controls */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 bg-[#05251c] rounded-md"
        />

        <button onClick={exportCSV} className="bg-emerald-600 px-3 py-2">
          Export
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Loading students...</p>}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((p) => (
          <div key={p} className="bg-[#05251c] p-3 rounded-xl h-[600px]">
            <h3 className="mb-2 font-bold">{PHASE_LABEL(p as Phase)}</h3>

            <Virtuoso
              style={{ height: 500 }}
              totalCount={grouped[p as Phase].length}
              itemContent={(index) => (
                <StudentRow
                  student={grouped[p as Phase][index]}
                  onSelect={setSelected}
                />
              )}
            />
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-0 w-[40%] h-full bg-[#021714] p-6 overflow-auto"
          >
            <h2 className="text-xl font-bold">{selected.name}</h2>
            <p>{selected.email}</p>

            <div className="mt-4">
              <h3>Domains</h3>
              <p>{selected.domains.join(", ")}</p>
            </div>

            {/* 🔥 ML OUTPUT */}
            <div className="mt-4">
              <h3>AI Insight</h3>
              <p>{selected.aiAnalysis || "No analysis yet"}</p>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 bg-red-500 px-3 py-2"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
