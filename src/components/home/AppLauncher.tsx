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
} from "lucide-react";

interface App {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  category: "development" | "learning" | "productivity" | string;
  link: string;
  phases: string[]; // ✅ Added — list of phases where the app should appear
}

export const AppLauncher = ({ phase = "phase1" }) => {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // ✅ Define apps and assign them to specific phases
  const apps: App[] = useMemo(
    () => [
      {
        id: "timeline",
        name: "Timeline",
        icon: <Timeline className="w-8 h-8" />,
        color: "from-blue-500 to-blue-600",
        description: "Track your development journey",
        category: "productivity",
        link: `/${phase}/timeline`,
        phases: ["phase1", "phase2", "phase3", "phase4"], // ✅ visible in these phases
      },
      {
        id: "blogs",
        name: "Blogs",
        icon: <BookOpen className="w-8 h-8" />,
        color: "from-green-500 to-green-600",
        description: "Read and write technical blogs",
        category: "learning",
        link: `/${phase}/blog`,
        phases: ["phase1", "phase2", "phase3", "phase4"],
      },
      {
        id: "tracker",
        name: "Tracker",
        icon: <Brain className="w-8 h-8" />,
        color: "from-purple-500 to-purple-600",
        description: "Daily Data Feed",
        category: "learning",
        link: `/${phase}/tracker`,
        phases: ["phase1", "phase2", "phase3", "phase4"],
      },
      {
        id: "marathons",
        name: "Macro-thons",
        icon: <Trophy className="w-8 h-8" />,
        color: "from-yellow-500 to-orange-500",
        description: "Participate in coding marathons",
        category: "development",
        link: `/${phase}/macrothon`,
        phases: ["phase3", "phase4"],
      },
      {
        id: "leetspace",
        name: "LeetSpace",
        icon: <Code className="w-8 h-8" />,
        color: "from-red-500 to-red-600",
        description: "Practice coding problems",
        category: "development",
        link: `/${phase}/leetTracker`,
        phases: ["phase2", "phase3", "phase4"],
      },
      {
        id: "gittrack",
        name: "GitTrack",
        icon: <GitBranch className="w-8 h-8" />,
        color: "from-gray-600 to-gray-700",
        description: "Monitor your Git activity",
        category: "productivity",
        link: `/${phase}/githubtracker`,
        phases: ["phase3", "phase4"],
      },
      {
        id: "bountyhub",
        name: "BountyHub",
        icon: <DollarSign className="w-8 h-8" />,
        color: "from-emerald-500 to-emerald-600",
        description: "Discover coding bounties",
        category: "development",
        link: `/${phase}/bountyhub`,
        phases: ["phase2", "phase3", "phase4"],
      },
    ],
    [phase]
  );

  // ✅ Filter by both phase and search query
  const filteredApps = useMemo(() => {
    const phaseFiltered = apps.filter((app) => app.phases.includes(phase));
    if (!searchQuery) return phaseFiltered;
    return phaseFiltered.filter(
      (app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [apps, searchQuery, phase]);

  const toggleLauncher = () => {
    setIsLauncherOpen(!isLauncherOpen);
    setSearchQuery("");
  };

  const handleAppClick = (app: App) => {
    console.log(`Opening ${app.name}...`);
  };

  return (
    <>
      {/* Launcher Button */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.button
          onClick={toggleLauncher}
          className="relative w-16 h-16 bg-gradient-to-br from-primary-red to-accent-teal rounded-2xl shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all duration-100 backdrop-blur-sm border cursor-pointer border-white/20"
          animate={isLauncherOpen ? { rotate: 45 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          <Grid3X3 className="w-8 h-8 text-white drop-shadow-lg" />
        </motion.button>
      </motion.div>

      {/* Launcher Overlay */}
      <AnimatePresence>
        {isLauncherOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 overflow-hidden"
            onClick={toggleLauncher}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(20px) saturate(180%)",
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center p-4 pt-24"
              onClick={(e) => e.stopPropagation()}
              ref={scrollContainerRef}
            >
              <div className="w-full max-w-5xl max-h-[calc(100vh-8rem)] overflow-hidden rounded-3xl border border-white/30 shadow-2xl bg-white/10 backdrop-blur-2xl">
                <div className="flex justify-between items-center p-6 border-b border-white/20">
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      Applications
                    </h2>
                    <p className="text-white/60 text-sm mt-1 capitalize">
                      {phase.replace("phase", "Phase ")} Development Suite
                    </p>
                  </div>
                  <motion.button
                    onClick={toggleLauncher}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>

                <div
                  className="overflow-y-auto max-h-[calc(100vh-16rem)] p-6"
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  {/* Search */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-accent-teal"
                      />
                    </div>
                  </motion.div>

                  {/* App Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredApps.map((app, index) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className="group cursor-pointer"
                      >
                        <Link href={app.link}>
                          <div className="bg-white/10 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:bg-white/20 hover:shadow-xl">
                            <div
                              className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                            >
                              <div className="text-white">{app.icon}</div>
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-accent-teal">
                              {app.name}
                            </h3>
                            <p className="text-white/60 text-sm line-clamp-2">
                              {app.description}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* No Results */}
                  {filteredApps.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <p className="text-white/60 text-lg">
                        No applications found for this phase.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
