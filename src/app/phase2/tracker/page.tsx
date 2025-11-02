"use client";
import EnhancedBehaviorTracker from "../../../components/EnhancedBehaviorTracker";
import { HomeBackground } from "../../../components/home/HomeBackground";
import { motion } from "framer-motion";

const phase2Theme = {
  tBorder: { light: "#E53E3E", dark: "#EF4444" },
  tColor: { light: "#14B8A6", dark: "#06B6D4" },
  tDepthColor: { light: "#059669", dark: "#3B82F6" },
};

export default function Phase2TrackerPage() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      <HomeBackground username="Paresh" background="#450C1C" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(229,62,62,0.14) 0%, rgba(20,184,166,0.14) 100%)",
          backdropFilter: "blur(16px) saturate(120%)",
          WebkitBackdropFilter: "blur(16px) saturate(120%)",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        <EnhancedBehaviorTracker phase="phase2" theme={phase2Theme} />
      </div>
    </div>
  );
}