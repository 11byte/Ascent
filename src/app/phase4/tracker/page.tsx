"use client";
import EnhancedBehaviorTracker from "../../../components/EnhancedBehaviorTracker";
import { HomeBackground } from "../../../components/home/HomeBackground";
import { motion } from "framer-motion";

const phase4Theme = {
  tBorder: { light: "#F3F3E0", dark: "#F3F3E0" },
  tColor: { light: "#183B4E", dark: "#183B4E" },
  tDepthColor: { light: "#DDA853", dark: "#DDA853" },
};

export default function Phase4TrackerPage() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      <HomeBackground username="Paresh" background="#0B262B" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(221,168,83,0.14) 0%, rgba(24,59,78,0.14) 100%)",
          backdropFilter: "blur(16px) saturate(120%)",
          WebkitBackdropFilter: "blur(16px) saturate(120%)",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        <EnhancedBehaviorTracker phase="phase4" theme={phase4Theme} />
      </div>
    </div>
  );
}