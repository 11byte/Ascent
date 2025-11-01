"use client";
import { HomeBackground } from "../../../components/home/HomeBackground";
import { motion } from "framer-motion";
import GitHubTracker from "../../../components/GithubTracker";

const phase1Theme = {
  tBorder: { light: "#77BEF0", dark: "#77BEF0" },
  tColor: { light: "#FFCB61", dark: "#FFCB61" },
  tDepthColor: { light: "#EA5B6F", dark: "#EA5B6F" },
};

export default function Phase1GitHubTrackerPage() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      {/* Background */}
      <HomeBackground username="GitHub Tracker" background="#00008B" />

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
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        <GitHubTracker theme={phase1Theme} />
      </div>
    </div>
  );
}
