"use client";
import { HomeBackground } from "../../../components/home/HomeBackground";
import { motion } from "framer-motion";
import GitHubTracker from "../../../components/GithubTracker";

const phase3Theme = {
  tBorder: { light: "#3338A0", dark: "#3338A0" },
  tColor: { light: "#FCC61D", dark: "#FCC61D" },
  tDepthColor: { light: "#F7F7F7", dark: "#F7F7F7" },
};

export default function Phase3GitHubTrackerPage() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      {/* Background */}
      <HomeBackground username="GitHub Tracker" background="#000016" />

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(119,190,240,0.2) 0%, rgba(234,91,111,0.2) 100%)",
          backdropFilter: "blur(18px) saturate(120%)",
          WebkitBackdropFilter: "blur(18px) saturate(120%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-1 py-10">
        <GitHubTracker theme={phase3Theme} />
      </div>
    </div>
  );
}
