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
    name: "Cognito AI Labs",
    icon: <Brain className="w-10 h-10 text-fuchsia-400" />,
    desc: "Deep learning, generative AI, LLMs, and MLOps deployment projects.",
    domain: "aiml",
    isRecommended: true,
    color: "fuchsia",
  },
  {
    name: "Aether Cloud Ops",
    icon: <Cloud className="w-10 h-10 text-cyan-400" />,
    desc: "Kubernetes, Docker, Terraform, CI/CD pipelines, and multi-cloud infrastructure.",
    domain: "devops",
    color: "cyan",
  },
  {
    name: "Aegis Security",
    icon: <Shield className="w-10 h-10 text-red-500" />,
    desc: "Pen-testing, threat analysis, incident response, and collegiate CTF contests.",
    domain: "cyber-sec",
    color: "red",
  },
  {
    name: "Nexus Data Core",
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
  { label: "AI/ML", key: "ai-ml" },
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
      (club) => !selectedDomain || club.domain === selectedDomain
    );
  }, [selectedDomain]);

  return (
    <main className="relative min-h-screen overflow-hidden p-23">
      {/* Background Layout */}
      <div
        className="absolute inset-0 bg-[linear-gradient(-45deg,#ff9a9e,#fad0c4,#fbc2eb,#a18cd1)]
                bg-[length:400%_400%] animate-[gradient_15s_ease_infinite]"
      />
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
          <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 text-transparent bg-clip-text font-[Orbitron]">
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
          className="flex flex-wrap gap-3 sm:gap-4 mt-10 p-2 bg-gray-800/50 rounded-full border border-fuchsia-500/40"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
        >
          {/* All Clubs Button */}
          <Button
            onClick={() => setSelectedDomain(null)}
            // When ACTIVE: Use 'default' (fuchsia background, solid color)
            // When INACTIVE: Use 'slide-fill' (transparent, ready for hover animation)
            variant={!selectedDomain ? "default" : "slide-fill"}
            className={`relative rounded-full px-5 py-2 font-semibold transition-colors z-10`}
          >
            All Clubs
            {/* The active pill is now handled purely by Framer Motion on the default button */}
            {!selectedDomain && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-fuchsia-600/80 rounded-full -z-10 shadow-lg shadow-fuchsia-500/30"
              />
            )}
          </Button>
          {/* Filter Buttons */}
          {domains.map((domain) => (
            <Button
              key={domain.key}
              onClick={() => setSelectedDomain(domain.key)}
              variant={selectedDomain === domain.key ? "default" : "slide-fill"}
              className={`relative rounded-full px-5 py-2 font-semibold transition-colors z-10`}
            >
              {domain.label}
              {selectedDomain === domain.key && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-fuchsia-600/80 rounded-full -z-10 shadow-lg shadow-fuchsia-500/30"
                />
              )}
            </Button>
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
              <ClubCard key={club.name} club={club} index={index} />
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
