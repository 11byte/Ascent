"use client";
import EnhancedBehaviorTracker from "../../../components/EnhancedBehaviorTracker";
import { HomeBackground } from "../../../components/home/HomeBackground";
import { motion } from "framer-motion";

const phase3Theme = {
  tBorder: { light: "#3338A0", dark: "#3338A0" },
  tColor: { light: "#FCC61D", dark: "#FCC61D" },
  tDepthColor: { light: "#F7F7F7", dark: "#F7F7F7" },
};

export default function Phase3TrackerPage() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      <HomeBackground username="Paresh" background="#000016" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(51,56,160,0.14) 0%, rgba(252,198,29,0.14) 100%)",
          backdropFilter: "blur(16px) saturate(120%)",
          WebkitBackdropFilter: "blur(16px) saturate(120%)",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        <EnhancedBehaviorTracker phase="phase3" theme={phase3Theme} />
      </div>
    </div>
  );
}