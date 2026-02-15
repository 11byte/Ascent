"use client";

import React, { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import Link from "next/link";
import { 
  Telescope, 
  Search, 
  LayoutGrid, 
  ArrowUpRight, 
  Loader2, 
  Wand,
  Compass,
  FolderTree,
  Network
} from "lucide-react";

// Matches your Phase 2/4 Theme
const theme = {
  tBorder: "#E8E3D4",
  gold: "#CBAF68",
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

interface RoadmapItem {
  id: number;
  title: string;
}

export default function ExploreRoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/roadmap/get/all");
        const data = await res.json();
        if (data.status) setRoadmaps(data.roadmaps);
      } catch (err) {
        console.error("Failed to fetch library:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const filtered = roadmaps.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full bg-[#09090b] text-white">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-950 via-gray-900 to-black" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(800px 300px at 50% -100px, rgba(203,175,104,0.15), transparent 80%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 pt-32 pb-20">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-[#CBAF68] mb-4"
          >
            <Compass size={20} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Discovery Hub</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-[Orbitron] text-4xl sm:text-6xl font-bold tracking-tight"
            style={{ color: theme.tBorder }}
          >
            Explore <span style={{ color: theme.gold }}>Roadmaps</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Access hundreds of AI-generated learning paths created by our college students.
          </motion.p>
        </div>

        {/* Stats & Search Toolbar */}
        {/* <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#CBAF68] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-1 focus:ring-[#CBAF68] backdrop-blur-md transition-all"
            />
          </div>

          <div className="flex items-center gap-8 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-center">
              <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Database</p>
              <p className="text-xl font-bold text-white">
                <CountUp to={roadmaps.length} />
              </p>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <Link href="/phase4/roadmap-generator/roadmap">
              <button className="flex items-center gap-2 text-sm font-bold text-[#CBAF68] hover:text-white transition-colors">
                <Wand size={16} />
                Generate New
              </button>
            </Link>
          </div>
        </div> */}

        {/* Roadmap Grid */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4 text-gray-500">
            <Loader2 className="animate-spin text-[#CBAF68]" size={32} />
            <p className="font-medium">Synchronizing with Archive...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((roadmap, index) => (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/phase4/roadmap-generator/roadmap/${roadmap.id}`}
                  className="group relative block p-6 h-full rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-[#CBAF68]/40 backdrop-blur-sm transition-all overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
                      <Network size={20} className="text-[#CBAF68]" />
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="text-gray-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#CBAF68] transition-colors leading-tight mb-2">
                    {roadmap.title}
                  </h3>
                  {/* <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                    Interactive visualization available for this subject. Click to explore modules and resources.
                  </p> */}

                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#CBAF68]/60 group-hover:text-[#CBAF68]">
                      View Path
                    </span>
                    <div className="h-[1px] flex-1 bg-white/10 group-hover:bg-[#CBAF68]/30 transition-colors" />
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#CBAF68]/5 rounded-full blur-2xl group-hover:bg-[#CBAF68]/15 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
            <Telescope size={48} className="mx-auto text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-gray-400">No paths found</h2>
            <p className="text-gray-600 text-sm mt-1">Try a different keyword or generate a new roadmap.</p>
          </div>
        )}
      </div>
    </div>
  );
}