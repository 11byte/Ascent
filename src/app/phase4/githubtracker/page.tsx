"use client";
import { HomeBackground } from "../../../components/home/HomeBackground";
import { motion } from "framer-motion";
import GitHubTracker from "../../../components/GithubTracker";

const phase4Theme = {
  tBorder: { light: "#E8E3D4", dark: "#E8E3D4" }, // Soft ivory gold — refined light tone
  tColor: { light: "#fff", dark: "black" }, // Deep teal for contrast & clarity
  tDepthColor: { light: "#CBAF68", dark: "#CBAF68" }, // Muted golden amber — luxurious highlight
};

export default function Phase4GitHubTrackerPage() {
  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      {/* Background */}
      <HomeBackground username="GitHub Tracker" background="#0B262B" />

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
        <GitHubTracker theme={phase4Theme} />
      </div>
    </div>
  );
}
