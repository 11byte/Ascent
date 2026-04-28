// src/app/phase2/technical-club/components/clubs/technicalpagepage.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
// FIX 2a: Corrected path for generic Button component (assuming it's three levels up from /technical-club)
// You may need to adjust "three levels up" (../../../) based on your exact setup.
import { Button } from "../ui/button"; 
import { Shield, Brain, Cloud, BarChart, Chrome } from 'lucide-react';
import { useState, useMemo } from "react";
// FIX 2b: Corrected path for custom ClubCard (assuming it's in ./components/ClubCard.tsx)
import ClubCard from "../clubs/ClubCard"; 
// NOTE: cardVariants is no longer imported here, as it's only used inside ClubCard.

// --- Define the data structure for the 5 clubs (UNCHANGED) ---
const clubs = [
  { 
    name: "Cognito AI Labs", 
    icon: <Brain className="w-10 h-10 text-fuchsia-400" />, 
    desc: "Deep learning, generative AI, LLMs, and MLOps deployment projects.", 
    domain: "ai-ml", 
    isRecommended: true, 
    color: 'fuchsia'
  },
  { 
    name: "Aether Cloud Ops", 
    icon: <Cloud className="w-10 h-10 text-cyan-400" />, 
    desc: "Kubernetes, Docker, Terraform, CI/CD pipelines, and multi-cloud infrastructure.", 
    domain: "devops", 
    color: 'cyan'
  },
  { 
    name: "Aegis Security", 
    icon: <Shield className="w-10 h-10 text-red-500" />, 
    desc: "Pen-testing, threat analysis, incident response, and collegiate CTF contests.", 
    domain: "cyber-sec", 
    color: 'red'
  },
  { 
    name: "Nexus Data Core", 
    icon: <BarChart className="w-10 h-10 text-lime-400" />, 
    desc: "Statistical modeling, Python/R, big data visualization, and predictive analytics.", 
    domain: "data-science", 
    color: 'lime'
  },
  { 
    name: "Google Developers Club", 
    icon: <Chrome className="w-10 h-10 text-blue-500" />, 
    desc: "Android, Flutter, Firebase, Google Cloud, and building solutions for local impact.", 
    domain: "gdsc", 
    color: 'blue'
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

// --- Framer Motion Container Variant for Staggering (UNCHANGED) ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Stagger delay between children
        },
    },
};


// --- Main Page Component ---
export default function TechnicalClubsPage() {
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

    const filteredClubs = useMemo(() => {
        return clubs.filter((club) => !selectedDomain || club.domain === selectedDomain);
    }, [selectedDomain]);

    return (
        <div
            className="min-h-screen flex flex-col items-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-900 relative overflow-hidden"
        >
            {/* Background Light/Gradient Effect (UNCHANGED) */}
            <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-fuchsia-900/30 rounded-full blur-[200px] -translate-x-1/2 -z-0"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-900/20 rounded-full blur-[150px] z-0"></div>


            <div className="relative z-10 w-full flex flex-col items-center">

                {/* Header with Animation - FIX 1: Corrected the invalid ease value */}
                <motion.h1
                    className="text-6xl md:text-7xl font-extrabold text-center text-white leading-tight mb-4"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ y: 0, opacity: 1 }}
                    // FIX: Changed -0.01 to 0.0 to be a valid CSS cubic-bezier value
                    transition={{ duration: 0.8, ease: [0.6, 0.05, 0.0, 0.9] }} 
                >
                    <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 text-transparent bg-clip-text">
                        Ascent Clubs
                    </span> 🚀
                </motion.h1>
                <motion.p
                    className="mt-2 text-xl text-gray-400 text-center max-w-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    Find your passion and accelerate your skills. Join the technical communities shaping the future.
                </motion.p>

                {/* Domain Selector with Animated Underline (UNCHANGED) */}
                <motion.div
                    className="flex flex-wrap gap-3 sm:gap-4 mt-10 p-2 bg-gray-800/50 rounded-full border border-fuchsia-500/40"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                >
                    {/* All Clubs Button */}
                    <Button
                        onClick={() => setSelectedDomain(null)}
                        variant="ghost"
                        className={`relative rounded-full px-5 py-2 font-semibold transition-colors z-10
                                    ${!selectedDomain ? "text-white" : "text-gray-400 hover:text-white/80"}`}
                    >
                         All Clubs
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
                            variant="ghost"
                            className={`relative rounded-full px-5 py-2 font-semibold transition-colors z-10
                                        ${selectedDomain === domain.key ? "text-white" : "text-gray-400 hover:text-white/80"}`}
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

                {/* Clubs Grid with AnimatePresence and Staggering (USES ClubCard) */}
                <motion.div
                    className="mt-16 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredClubs.map((club, index) => (
                            <ClubCard
                                key={club.name}
                                club={club}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Fallback for no clubs found (UNCHANGED) */}
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
        </div>
    );
}