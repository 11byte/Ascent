'use client';
import GitHubTracker from "@/components/GithubTracker";
import { HomeBackground } from "@components/home/HomeBackground";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const phase3Theme = {
  tBorder: { light: "#3338A0", dark: "#3338A0" },
  tColor: { light: "#FCC61D", dark: "#FCC61D" },
  tDepthColor: { light: "#F7F7F7", dark: "#F7F7F7" }
};

export default function Phase3GitHubTrackerPage() {
  const userId = "Paresh-0007"; // Replace with actual user id from your auth context
  const [token, setToken] = useState<string | null>('add your token here');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      fetch(`https://localhost:5000/api/github/usertokenexist/?userId=${userId}`)
        .then(res => res.json())
        .then(data => setToken(data.token || null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId, token]);

  // Show background + glass overlay
  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      {/* Glassy, animated background */}
      <HomeBackground username={userId} background="#000016" />
      {/* Frosted glass overlay */}
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
      {/* Main content container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Optionally, add a header/badge here for phase info */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                border: `4px solid ${phase3Theme.tBorder.light}`,
                borderTopColor: "transparent",
                borderRadius: "50%",
              }}
              className="w-16 h-16"
            />
          </div>
        ) : !token ? (
          <div className="text-center mt-20">
            <p>You need to connect your GitHub account to use the tracker.</p>
            <a
              href="/phase1/githubconnect/"
              className="px-6 py-3 rounded-xl bg-black text-white font-bold mt-4 inline-block"
            >
              Connect to GitHub
            </a>
          </div>
        ) : (
          <GitHubTracker githubToken={token} userId={userId} phase="phase3" theme={phase3Theme} />
        )}
      </div>
    </div>
  );
}