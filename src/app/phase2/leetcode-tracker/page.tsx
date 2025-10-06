// src/app/phase2/leetcode-tracker/page.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Code, Trophy, ArrowRight, TrendingUp, Cpu, BarChart } from 'lucide-react';
import { useState } from 'react';
import React from 'react'; 
import Link from 'next/link';

// 🏆 FINAL, CORRECTED PATH: Use the direct path to the sibling 'technical-clubs' folder
import { Button } from "../technical-clubs/ui/button"; 

// --- MOCK DATA ---
const mockStats = {
  username: 'Aditya_CodeLord',
  collegeRank: 3,
  totalSolved: 350,
  easy: 150,
  medium: 180,
  hard: 20,
  rating: 1750,
  contributionDays: 95,
};

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } },
};

// --- LOCAL HELPER COMPONENT: StatsCard (Included for completeness) ---
interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  variant: 'green' | 'cyan' | 'purple' | 'red';
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, variant }) => {
    const colorMap = {
        green: "bg-green-500/10 border-green-600/50 text-green-400 hover:shadow-green-500/30",
        cyan: "bg-cyan-500/10 border-cyan-600/50 text-cyan-400 hover:shadow-cyan-500/30",
        purple: "bg-purple-500/10 border-purple-600/50 text-purple-400 hover:shadow-purple-500/30",
        red: "bg-red-500/10 border-red-600/50 text-red-400 hover:shadow-red-500/30",
    };

    return (
        <motion.div 
            variants={cardVariants}
            className={`p-5 rounded-xl border-2 shadow-xl backdrop-blur-sm transition-all duration-300 ${colorMap[variant]}`}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-white/10">{icon}</div>
                <p className="text-sm font-medium opacity-80">{title}</p>
            </div>
            <h3 className="text-4xl font-extrabold text-white mt-2">{value}</h3>
        </motion.div>
    );
};


// --- MAIN PAGE COMPONENT ---
export default function LeetCodeTrackerPage() {
  const [stats] = useState(mockStats);

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white relative overflow-hidden">
      
      {/* ANIMATED BACKGROUND GLOW EFFECT */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl opacity-30 animate-pulse-slow animation-delay-5000"></div>
      </div>
      
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10 mb-12"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
          {stats.username}'s Ascent Tracker
        </h1>
        <p className="text-xl text-gray-400 mt-2">
          Phase 2 Proficiency Metrics
        </p>
      </motion.header>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* LEFT COLUMN: User Profile and Key Stats (4/12) */}
        <div className="lg:col-span-4 space-y-8">
            
            {/* ANIMATED BOY AVATAR & INFO (3D TILT EFFECT) */}
            <Tilt
                glareEnable={true}
                glareMaxOpacity={0.5}
                glareColor="#ffffff"
                scale={1.02}
                perspective={1000}
            >
                <motion.div 
                    variants={cardVariants}
                    className="p-6 bg-gray-800 rounded-2xl shadow-2xl border-2 border-cyan-400/50"
                >
                    {/* Placeholder for the Animated Boy / Avatar */}
                    <div className="h-24 flex items-center justify-center mb-4">
                        <Cpu className="w-16 h-16 text-purple-400" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white">{stats.username}</h2>
                    <p className="text-lg text-cyan-400">Current Rating: {stats.rating}</p>
                    <p className="text-sm text-gray-400 mt-2">Days of Contribution: {stats.contributionDays}</p>
                    
                    {/* FIX: Simplified structure and removed deprecated legacyBehavior */}
                    <Link href="/phase3/leaderboard" passHref> 
                        <Button 
                            asChild 
                            variant="default" 
                            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {/* FIX: Ensure content is wrapped in a single element */}
                            <span className="flex items-center justify-center space-x-2"> 
                                <span>View Global Leaderboard</span>
                                <ArrowRight className="w-4 h-4" />
                            </span> 
                        </Button>
                    </Link>
                </motion.div>
            </Tilt>

            {/* Total Solved Stat */}
            <StatsCard 
                icon={<Code className="w-6 h-6" />}
                title="Total Problems Solved"
                value={stats.totalSolved}
                variant="green"
            />
            
            {/* College Rank Stat */}
            <StatsCard 
                icon={<Trophy className="w-6 h-6" />}
                title="College Rank"
                value={`#${stats.collegeRank}`}
                variant="cyan"
            />
        </div>

        {/* RIGHT COLUMN: Detailed Breakdown & Metrics (8/12) */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* Difficulty Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatsCard 
                    icon={<BarChart className="w-6 h-6" />}
                    title="Easy Solved"
                    value={stats.easy}
                    variant="green"
                />
                <StatsCard 
                    icon={<BarChart className="w-6 h-6" />}
                    title="Medium Solved"
                    value={stats.medium}
                    variant="purple"
                />
                <StatsCard 
                    icon={<BarChart className="w-6 h-6" />}
                    title="Hard Solved"
                    value={stats.hard}
                    variant="red"
                />
            </div>
            
            {/* Skill Tree / Timeline (Placeholder for future development) */}
            <motion.div 
                variants={cardVariants}
                className="bg-gray-800 p-8 rounded-2xl shadow-xl border-2 border-gray-700/50"
            >
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-3 text-red-400" /> DSA Progress & Skill Tree (Phase 4)
                </h2>
                <div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-lg border-dashed border border-gray-700">
                    <p className="text-gray-500">
                        Visualizing contest performance and skill mastery progress...
                    </p>
                </div>
            </motion.div>

        </div>
      </motion.div>
    </div>
  );
}