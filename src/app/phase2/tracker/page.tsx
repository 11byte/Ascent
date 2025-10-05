"use client";
import EnhancedBehaviorTracker from "@/components/EnhancedBehaviorTracker";
import { HomeBackground } from "@components/home/HomeBackground";
import { motion } from "framer-motion";

const phase2Theme = {
  tBorder: { light: "#E53E3E", dark: "#EF4444" },
  tColor: { light: "#14B8A6", dark: "#06B6D4" },
  tDepthColor: { light: "#059669", dark: "#3B82F6" }
};


export default function Phase2TrackerPage() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      {/* Glassy, animated background */}
      <HomeBackground username="Paresh" background="#450C1C" />
      {/* Frosted glass overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(119,190,240,0.2) 0%, rgba(234,91,111,0.2) 100%)",
          backdropFilter: "blur(18px) saturate(120%)",
          WebkitBackdropFilter: "blur(18px) saturate(120%)",
        }}
      />
      {/* Main content container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Optionally, add a header/badge here for phase info */}
        <EnhancedBehaviorTracker phase="phase2" theme={phase2Theme} />
      </div>
    </div>
  );
}