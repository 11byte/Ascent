"use client";
import EnhancedBehaviorTracker from "../../../components/EnhancedBehaviorTracker";
import { HomeBackground } from "../../../components/home/HomeBackground";
import { motion } from "framer-motion";

const phase1Theme = {
  tBorder: { light: "#77BEF0", dark: "#77BEF0" },
  tColor: { light: "#FFCB61", dark: "#FFCB61" },
  tDepthColor: { light: "#EA5B6F", dark: "#EA5B6F" },
};

export default function Phase1TrackerPage() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      <HomeBackground username="Paresh" background="#00008B" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(119,190,240,0.18) 0%, rgba(234,91,111,0.18) 100%)",
          backdropFilter: "blur(16px) saturate(120%)",
          WebkitBackdropFilter: "blur(16px) saturate(120%)",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        <EnhancedBehaviorTracker phase="phase1" theme={phase1Theme} />
      </div>
    </div>
  );
}