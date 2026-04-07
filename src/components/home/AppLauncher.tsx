"use client";
import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Grid3X3,
  History as Timeline,
  BookOpen,
  Brain,
  Trophy,
  Code,
  GitBranch,
  DollarSign,
  X,
  Search,
  Network,
} from "lucide-react";

export const AppLauncher = ({ phase = "phase1" }) => {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const apps = useMemo(
    () => [
      {
        id: "timeline",
        name: "Timeline",
        icon: <Timeline className="w-7 h-7" />,
        color: "from-blue-500 to-cyan-400",
        description: "Track your development journey",
        link: `/${phase}/timeline`,
        phases: ["phase1", "phase2", "phase3", "phase4"],
      },
      {
        id: "blogs",
        name: "Blogs",
        icon: <BookOpen className="w-7 h-7" />,
        color: "from-green-400 to-emerald-500",
        description: "Read and write technical blogs",
        link: `/${phase}/blog`,
        phases: ["phase1", "phase2", "phase3", "phase4"],
      },
      {
        id: "tracker",
        name: "Tracker",
        icon: <Brain className="w-7 h-7" />,
        color: "from-purple-500 to-violet-500",
        description: "Daily Data Feed",
        link: `/${phase}/tracker`,
        phases: ["phase1", "phase2", "phase3", "phase4"],
      },
      {
        id: "trackerv2",
        name: "TrackerV2",
        icon: <Brain className="w-7 h-7" />,
        color: "from-purple-500 to-violet-500",
        description: "Enhanced Daily Data Feed",
        link: `/${phase}/trackerv2`,
        phases: ["phase1", "phase2", "phase3", "phase4"],
      },
      {
        id: "marathons",
        name: "Macro-thons",
        icon: <Trophy className="w-7 h-7" />,
        color: "from-yellow-400 to-orange-500",
        description: "Participate in coding marathons",
        link: `/${phase}/macrothon`,
        phases: ["phase3", "phase4"],
      },
      {
        id: "leetspace",
        name: "LeetSpace",
        icon: <Code className="w-7 h-7" />,
        color: "from-red-500 to-pink-500",
        description: "Practice coding problems",
        link: `/${phase}/leetTracker`,
        phases: ["phase2", "phase3", "phase4"],
      },
      {
        id: "gittrack",
        name: "GitTrack",
        icon: <GitBranch className="w-7 h-7" />,
        color: "from-gray-500 to-gray-700",
        description: "Monitor your Git activity",
        link: `/${phase}/githubtracker`,
        phases: ["phase3", "phase4"],
      },
      {
        id: "bountyhub",
        name: "BountyHub",
        icon: <DollarSign className="w-7 h-7" />,
        color: "from-emerald-400 to-green-600",
        description: "Discover coding bounties",
        link: `/${phase}/Bountyboard`,
        phases: ["phase2", "phase3", "phase4"],
      },
      {
        id: "roadmap-generator",
        name: "RoadMap",
        icon: <Network className="w-7 h-7" />,
        color: "from-indigo-400 to-purple-600",
        description: "Generate learning roadmap",
        link: `/${phase}/roadmap-generator`,
        phases: ["phase4"],
      },
    ],
    [phase],
  );

  const filteredApps = useMemo(() => {
    const phaseFiltered = apps.filter((app) => app.phases.includes(phase));
    if (!searchQuery) return phaseFiltered;
    return phaseFiltered.filter(
      (app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [apps, searchQuery, phase]);

  const toggleLauncher = () => {
    setIsLauncherOpen(!isLauncherOpen);
    setSearchQuery("");
  };

  return (
    <>
      {/* 🔥 Floating Button */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.button
          onClick={toggleLauncher}
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.4), inset 0 0 10px rgba(255,255,255,0.05)",
          }}
          animate={isLauncherOpen ? { rotate: 45 } : { rotate: 0 }}
        >
          <Grid3X3 className="w-7 h-7 text-white" />
        </motion.button>
      </motion.div>

      {/* 🔥 Overlay */}
      <AnimatePresence>
        {isLauncherOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleLauncher}
          >
            {/* Background Blur */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl" />

            {/* Content */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center p-4 pt-24"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                  <div>
                    <h2 className="text-3xl font-semibold text-white">
                      Applications
                    </h2>
                    <p className="text-white/50 text-sm mt-1">
                      {phase.toUpperCase()} Suite
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    onClick={toggleLauncher}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                  >
                    <X className="text-white w-5 h-5" />
                  </motion.button>
                </div>

                {/* Search */}
                <div className="p-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search apps..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                {/* Grid */}
                <div className="px-6 pb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredApps.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link href={app.link}>
                        <motion.div
                          whileHover={{
                            scale: 1.06,
                            y: -6,
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="relative p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden group"
                        >
                          {/* Glow */}
                          <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition bg-gradient-to-br ${app.color}`}
                          />

                          {/* Icon */}
                          <motion.div
                            whileHover={{ y: -2 }}
                            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${app.color}`}
                          >
                            {app.icon}
                          </motion.div>

                          {/* Text */}
                          <h3 className="text-white font-semibold text-lg">
                            {app.name}
                          </h3>
                          <p className="text-white/50 text-sm mt-1">
                            {app.description}
                          </p>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
