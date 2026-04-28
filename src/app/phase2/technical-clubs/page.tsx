// src/app/phase2/technical-clubs/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, Brain, Cloud, BarChart, Chrome } from "lucide-react";
import { useState, useMemo } from "react";

// FIX 1: Use the Absolute Alias for global components (Guaranteed path)
import { Button } from "./components/ui/button";
// FIX 2: Corrected local Component import path
// Assuming ClubCard.tsx is located at src/app/phase2/technical-clubs/components/ClubCard.tsx
import ClubCard from "./components/clubs/ClubCard";

// --- Data Structure for the 5 clubs (UNCHANGED) ---
const clubs = [
  {
    name: "AIML CLub",
    icon: <Brain className="w-10 h-10 text-fuchsia-400" />,
    desc: "Deep learning, generative AI, LLMs, and MLOps deployment projects.",
    domain: "aiml",
    isRecommended: true,
    color: "fuchsia",
  },
  {
    name: "DevOps Club",
    icon: <Cloud className="w-10 h-10 text-cyan-400" />,
    desc: "Kubernetes, Docker, Terraform, CI/CD pipelines, and multi-cloud infrastructure.",
    domain: "devops",
    color: "cyan",
  },
  {
    name: "Cyber Security Club",
    icon: <Shield className="w-10 h-10 text-red-500" />,
    desc: "Pen-testing, threat analysis, incident response, and collegiate CTF contests.",
    domain: "cyber-sec",
    color: "red",
  },
  {
    name: "Data Science Club",
    icon: <BarChart className="w-10 h-10 text-lime-400" />,
    desc: "Statistical modeling, Python/R, big data visualization, and predictive analytics.",
    domain: "data-science",
    color: "lime",
  },
  {
    name: "Google Developers Club",
    icon: <Chrome className="w-10 h-10 text-blue-500" />,
    desc: "Android, Flutter, Firebase, Google Cloud, and building solutions for local impact.",
    domain: "gdsc",
    color: "blue",
  },
];

// --- Domain List for Filter Buttons (UNCHANGED) ---
const domains = [
  { label: "AI/ML", key: "aiml" },
  { label: "DevOps/Cloud", key: "devops" },
  { label: "Cyber Security", key: "cyber-sec" },
  { label: "Data Science", key: "data-science" },
  { label: "GDSC", key: "gdsc" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// --- Main Page Component ---
export default function TechnicalClubsPage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const filteredClubs = useMemo(() => {
    return clubs.filter(
      (club) => !selectedDomain || club.domain === selectedDomain,
    );
  }, [selectedDomain]);

  return (
    <main className="relative min-h-screen overflow-hidden p-23">
      {/* Background Layout */}
      <div className="absolute inset-0 bg-black" />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Header with Animation - CUBIC BEZIER FIX APPLIED */}
        <motion.h1
          className="text-6xl md:text-7xl font-extrabold text-center text-white leading-tight mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.0, 0.9] }}
        >
          <span className="bg-gradient-to-r from-yellow-200 to-yellow-300 text-transparent bg-clip-text font-[Orbitron]">
            Tech Clubs
          </span>{" "}
        </motion.h1>
        <motion.p
          className="mt-2 text-xl text-gray-400 text-center max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Find your passion and accelerate your skills. Join the technical
          communities shaping the future.
        </motion.p>

        {/* Domain Selector with Animated Underline and Slide-Fill Buttons */}
        <motion.div
          className="flex flex-wrap gap-3 sm:gap-4 mt-10 p-2 bg-[#1a1a12]/60 rounded-full border border-[#DDA853]/40"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
        >
          {/* All Clubs */}
          <div className="relative">
            {!selectedDomain && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-[#DDA853]/80 rounded-full shadow-lg shadow-[#DDA853]/30"
              />
            )}
            <button
              onClick={() => setSelectedDomain(null)}
              className="relative z-10 px-5 py-2 rounded-full font-semibold text-[#F5E6C8]"
            >
              All Clubs
            </button>
          </div>

          {/* Domains */}
          {domains.map((domain) => (
            <div key={domain.key} className="relative">
              {selectedDomain === domain.key && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-[#DDA853]/80 rounded-full shadow-lg shadow-[#DDA853]/30"
                />
              )}
              <button
                onClick={() => setSelectedDomain(domain.key)}
                className="relative z-10 px-5 py-2 rounded-full font-semibold text-[#F5E6C8]"
              >
                {domain.label}
              </button>
            </div>
          ))}
        </motion.div>

        {/* Clubs Grid with AnimatePresence and Staggering */}
        <motion.div
          className="mt-16 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredClubs.map((club, index) => (
              <ClubCard key={club.name} club={club} index={index} phaseNo={4} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Fallback for no clubs found */}
        {filteredClubs.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-2xl text-gray-500"
          >
            No clubs found in the selected domain.
          </motion.p>
        )}
      </div>
    </main>
  );
}
