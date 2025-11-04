// src/app/phase2/technical-clubs/ai-ml/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { User, Layers, ArrowLeft, Brain, Code, Terminal } from "lucide-react";
import React from "react";

// ===============================================
// 1. DATA AND TYPE DEFINITIONS
// ===============================================

const theme = { color: "text-fuchsia-400", ring: "ring-fuchsia-500" };

const club = {
  name: "Cognito AI Labs",
  tagline: "Building Intelligence, One Model at a Time.",
  icon: Brain,
  description:
    "The **Cognito AI Labs** focuses on cutting-edge deep learning, Generative AI research, and practical machine learning engineering (MLOps). Our goal is to train students to deploy scalable AI solutions in real-world environments.",
  activities: [
    "Weekly Deep Learning Workshops (PyTorch/TensorFlow)",
    "Monthly Generative AI Challenges",
    "MLOps and Cloud Deployment Sprints",
    "Ethical AI and Data Bias Seminars",
  ],
  coreMembers: [
    {
      name: "Aditya Sharma",
      role: "President (ML Eng)",
      domain: "Generative AI",
    },
    { name: "Priya Varma", role: "VP (Research)", domain: "Computer Vision" },
    { name: "Karan Mehta", role: "MLOps Lead", domain: "Cloud Deployment" },
  ],
};

// ===============================================
// 2. MAIN COMPONENT
// ===============================================

export default function AIClubPage() {
  const IconComponent = club.icon;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-10 lg:px-20 bg-gray-900 relative">
      {/* Background Gradient/Glow */}
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-fuchsia-900/30 rounded-full blur-[200px] -translate-x-1/2 -z-0"></div>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <Link href="/phase2/technical-clubs" passHref>
          <Button
            variant="ghost"
            className="mb-8 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to All Clubs
          </Button>
        </Link>

        {/* Club Header Section */}
        <motion.header
          className="p-8 rounded-2xl border border-fuchsia-500/50 bg-gray-800/70 shadow-2xl mb-12"
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            {IconComponent && (
              <IconComponent className="w-12 h-12 text-fuchsia-400" />
            )}
            <h1 className="text-5xl font-extrabold text-fuchsia-400">
              {club.name}
            </h1>
          </div>

          <p className="mt-2 text-xl italic text-gray-200">{club.tagline}</p>
          <p className="mt-4 text-gray-300 max-w-4xl">{club.description}</p>

          <Button
            variant="default"
            className="mt-6 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold"
          >
            <Layers className="w-5 h-5 mr-2" /> Request to Join
          </Button>
        </motion.header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Core Member Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-5 text-fuchsia-400 flex items-center">
              <User className="w-6 h-6 mr-3 text-fuchsia-400" /> Core Team
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {club.coreMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-xl border border-fuchsia-500/50 bg-gray-800/70 shadow-md transition-all duration-300 hover:ring-2 ring-fuchsia-500"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium mt-1 text-fuchsia-400">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Focus: {member.domain}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Activities Section */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold mb-5 text-fuchsia-400 flex items-center">
              <Terminal className="w-6 h-6 mr-3 text-fuchsia-400" /> Key
              Activities
            </h2>
            <ul className="space-y-3 p-4 rounded-xl bg-gray-800/70 border border-fuchsia-500/50">
              {club.activities.map((activity, index) => (
                <motion.li
                  key={index}
                  className="flex items-start text-gray-300 text-sm"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Code className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-fuchsia-400" />
                  {activity}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
