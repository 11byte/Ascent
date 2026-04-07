"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Shield,
  Code,
  Database,
  Cpu,
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

// --- Domain Configuration for UI ---
const DOMAIN_UI: Record<string, any> = {
  AIML: {
    icon: Brain,
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/50",
    glow: "shadow-[0_0_30px_rgba(217,70,239,0.3)]",
  },
  Cybersecurity: {
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/50",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]",
  },
  WebDev: {
    icon: Code,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/50",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
  },
  DataScience: {
    icon: Database,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/50",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.3)]",
  },
  Default: {
    icon: Cpu,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/50",
    glow: "shadow-[0_0_30px_rgba(34,211,238,0.3)]",
  },
};

export default function PredictDomain() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictionData, setPredictionData] = useState<any>(null);

  // In a real app, pull this from your Auth Context (e.g., useSession, useSelector, etc.)
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("userId") || "guest";
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchPrediction = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/tracker/predict/${userId}`,
        );
        const data = await response.json();

        if (data.status) {
          setTimeout(() => {
            setPredictionData(data.prediction);
            setLoading(false);
          }, 2500);
        } else {
          setError(data.message);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to connect to the prediction server.");
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#05010b] flex flex-col items-center justify-center p-6 font-sans text-white overflow-hidden relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* --- STATE 1: LOADING / ANALYZING --- */}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center z-10"
          >
            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-t-4 border-cyan-400 rounded-full opacity-50"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-b-4 border-blue-500 rounded-full opacity-50"
              />
              <Activity className="w-12 h-12 text-cyan-300 animate-pulse" />
            </div>
            <h2 className="text-2xl font-[Orbitron] font-bold tracking-widest text-cyan-400 mb-2">
              ANALYZING TELEMETRY
            </h2>
            <p className="text-gray-400 font-mono text-sm animate-pulse">
              Running Zero-Shot Classification via Gemini-2.5-Flash...
            </p>
          </motion.div>
        )}

        {/* --- STATE 2: ERROR / INSUFFICIENT DATA --- */}
        {!loading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/80 border border-red-500/50 p-8 rounded-3xl max-w-md text-center z-10 shadow-[0_0_40px_rgba(239,68,68,0.2)]"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              CALIBRATION INCOMPLETE
            </h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl transition-colors font-bold tracking-widest">
              RETURN TO TRACKER
            </button>
          </motion.div>
        )}

        {/* --- STATE 3: SUCCESS / SHORTLIST REVEAL --- */}
        {!loading && predictionData && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl z-10"
          >
            <div className="text-center mb-12">
              <span className="bg-cyan-500/20 text-cyan-300 px-4 py-1 rounded-full text-xs font-bold tracking-widest border border-cyan-500/30 mb-4 inline-block">
                PHASE 1 COMPLETE
              </span>
              <h1 className="text-4xl md:text-5xl font-[Orbitron] font-bold text-white mb-4 shadow-cyan-500 drop-shadow-lg">
                APTITUDE PROFILE
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {predictionData.overall_analysis}
              </p>
            </div>

            {/* The 3 Shortlisted Domains */}
            <div className="flex flex-col gap-6 mb-12">
              {predictionData.shortlisted_domains.map(
                (item: any, index: number) => {
                  const ui = DOMAIN_UI[item.domain] || DOMAIN_UI["Default"];
                  const isTop = index === 0;

                  return (
                    <motion.div
                      key={item.domain}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`relative overflow-hidden rounded-3xl bg-gray-900/60 backdrop-blur-xl border ${ui.border} ${isTop ? ui.glow : "shadow-lg"} p-1`}
                    >
                      <div className="bg-gray-950/80 rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        {/* Rank & Icon */}
                        <div className="flex flex-col items-center justify-center shrink-0 w-24">
                          <span className="text-gray-600 font-[Orbitron] font-bold text-sm mb-2">
                            RANK 0{item.rank}
                          </span>
                          <div
                            className={`w-16 h-16 rounded-2xl ${ui.bg} border ${ui.border} flex items-center justify-center`}
                          >
                            <ui.icon className={`w-8 h-8 ${ui.color}`} />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 text-center md:text-left">
                          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide">
                            {item.domain}
                          </h2>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {item.reasoning}
                          </p>
                        </div>

                        {/* Confidence Score Bar */}
                        <div className="shrink-0 w-full md:w-48 flex flex-col items-center md:items-end">
                          <span className="text-3xl font-[Orbitron] font-bold text-white mb-1">
                            {item.confidence_score}
                            <span className={`text-lg ${ui.color}`}>%</span>
                          </span>
                          <span className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                            Confidence Match
                          </span>

                          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.confidence_score}%` }}
                              transition={{
                                duration: 1.5,
                                delay: 0.5 + index * 0.2,
                                ease: "easeOut",
                              }}
                              className={`h-full ${ui.color.replace("text-", "bg-")} shadow-[0_0_10px_currentColor]`}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                },
              )}
            </div>

            {/* Next Steps Footer */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
              <div>
                <p className="text-gray-300 font-bold mb-1">
                  Domain{" "}
                  <span className="text-red-400 line-through">
                    {predictionData.eliminated_domain}
                  </span>{" "}
                  has been eliminated.
                </p>
                <p className="text-sm text-gray-500">
                  Phase 2 will generate specialized challenges to narrow your
                  top 3 domains down to 2.
                </p>
              </div>
              <button className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 flex items-center gap-2 shrink-0">
                PROCEED TO PHASE 2 <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
