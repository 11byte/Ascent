"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Database,
  Shield,
  Brain,
  Code,
  ChartBar,
  Terminal,
  CheckCircle2,
} from "lucide-react";

// --- Import your 5 Game Components ---
// Adjust the import paths based on your folder structure
import FinalNeuralLink from "../../../components/tracker/FinalNeuralLink";
import FinalDataStream from "../../../components/tracker/FinalDataStream";
import FinalDataSort from "../../../components/tracker/FinalDataSort";
import FinalRapidChoice from "../../../components/tracker/FinalRapidChoice";
import FinalOddManOut from "../../../components/tracker/FinalOddManOut";

// --- Domain Configuration ---
const DOMAINS = [
  {
    id: "AIML",
    label: "AI & Machine Learning",
    icon: Brain,
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/30",
    hover: "hover:border-fuchsia-400 hover:bg-fuchsia-500/20",
  },
  {
    id: "Cybersecurity",
    label: "Cybersecurity",
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    hover: "hover:border-red-400 hover:bg-red-500/20",
  },
  {
    id: "WebDev",
    label: "Web Development",
    icon: Code,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    hover: "hover:border-blue-400 hover:bg-blue-500/20",
  },
  {
    id: "DataScience",
    label: "Data Science",
    icon: ChartBar,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    hover: "hover:border-green-400 hover:bg-green-500/20",
  },
];

export default function TrackerV2() {
  // --- Master State ---
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [showRawJson, setShowRawJson] = useState(true);
  const [userId, setUserId] = useState<string>("guest");

  // --- ML Telemetry Payload ---
  const [mlPayload, setMlPayload] = useState<any>({
    timestamp: 0,
    userId: userId,
    assigned_target_domain: "",
    games: {},
  });

  useEffect(() => {
    const id = localStorage.getItem("userId") || "guest";

    setUserId(id);

    setMlPayload((prev: any) => ({
      ...prev,
      timestamp: Date.now(),
      userId: id,
    }));
  }, []);

  // --- Handlers ---
  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId);
    setMlPayload((prev: any) => ({
      ...prev,
      assigned_target_domain: domainId,
    }));
    setCurrentStep(1); // Proceed to Game 1
  };

  const handleGameComplete = (gameId: string, metrics: any) => {
    // Save the metrics from the completed game
    setMlPayload((prev: any) => ({
      ...prev,
      games: { ...prev.games, [gameId]: metrics },
    }));
    // Move to next game or final screen
    setCurrentStep((prev) => prev + 1);
  };

  const submitToBackend = async () => {
    try {
      // Note: Make sure to replace the URL with your actual backend port/route
      // e.g., if your express app runs on port 5000 and the router is mounted at /api
      const API_URL = "http://localhost:5000/tracker/quiz/save";

      console.log("Sending ML Payload to Backend:", mlPayload);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${your_auth_token}` // Add this if your route is protected
        },
        body: JSON.stringify(mlPayload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Telemetry successfully sent to Machine Learning backend!");

        // Optional: Redirect the user back to their dashboard after success
        window.location.href = "/phase1";
      } else {
        console.error("Backend Error:", result);
        alert(`Failed to sync profile: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Failed to connect to the server. Is your backend running?");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#05010b] overflow-hidden relative font-sans text-white flex flex-col items-center justify-center selection:bg-cyan-500/30">
      {/* Global Header & Progress Bar (Hidden on selection screen and final screen) */}
      <AnimatePresence>
        {currentStep > 0 && currentStep < 6 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-20 right-6 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-3 bg-gray-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2 hidden md:block">
                Phase
              </span>

              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-8 md:w-12 h-2 rounded-full transition-all duration-500 ${
                    currentStep > step
                      ? "bg-green-400 shadow-[0_0_10px_#4ade80]"
                      : currentStep === step
                        ? "bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                        : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* STEP 0: DOMAIN SELECTION GATEWAY */}
        {currentStep === 0 && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
            className="w-full max-w-4xl px-4 z-10"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
              >
                <Activity className="w-10 h-10 text-cyan-400" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-[Orbitron] font-bold text-white mb-4 tracking-wider">
                INTEREST TRACKER
              </h1>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Select your primary area of interest. We will generate a rapid
                5-stage simulation to map your cognitive and behavioral
                aptitude.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DOMAINS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDomainSelect(d.id)}
                  className={`group relative flex items-center gap-6 p-6 rounded-3xl backdrop-blur-xl border-2 transition-all duration-300 overflow-hidden text-left bg-gray-900/60 ${d.border} ${d.hover}`}
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${d.bg}`}
                  />
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-950 border border-gray-800 z-10 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <d.icon className={`w-8 h-8 ${d.color}`} />
                  </div>
                  <div className="z-10">
                    <h3 className="text-2xl font-bold text-white mb-1 tracking-wide">
                      {d.label}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono group-hover:text-gray-300 transition-colors">
                      Initialize {d.id} protocols &rarr;
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- GAME SEQUENCE --- */}
        {currentStep === 1 && (
          <motion.div
            key="g1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <FinalNeuralLink
              domain={selectedDomain}
              onComplete={(metrics) =>
                handleGameComplete("neural_link", metrics)
              }
            />
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="g2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <FinalDataStream
              domain={selectedDomain}
              onComplete={(metrics) =>
                handleGameComplete("data_stream", metrics)
              }
            />
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="g3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Note: DataSort uses all domains internally, so we don't strictly need to pass it, but you can if you expand it later */}
            <FinalDataSort
              onComplete={(metrics) => handleGameComplete("data_sort", metrics)}
            />
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="g4"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <FinalRapidChoice
              onComplete={(metrics) =>
                handleGameComplete("rapid_choice", metrics)
              }
            />
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div
            key="g5"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <FinalOddManOut
              onComplete={(metrics) =>
                handleGameComplete("odd_man_out", metrics)
              }
            />
          </motion.div>
        )}

        {/* --- STEP 6: DATA AGGREGATION & ML OUTPUT DISPLAY --- */}
        {currentStep === 6 && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-[#05010b] p-4 md:p-6 z-20 overflow-y-auto"
          >
            <div className="max-w-5xl w-full bg-gray-900/80 backdrop-blur-2xl border border-cyan-500/30 p-6 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.15)] my-10">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                    <Database className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-[Orbitron] font-bold text-white">
                      ML TELEMETRY COMPILED
                    </h2>
                    <p className="text-gray-400 font-mono text-sm mt-1">
                      Target Domain:{" "}
                      <span className="text-cyan-400 font-bold">
                        {mlPayload.assigned_target_domain}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Toggle between UI View and Raw JSON View */}
                <button
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 transition-colors font-mono text-sm"
                >
                  <Terminal className="w-4 h-4" />
                  {showRawJson ? "View Dashboard" : "View Raw JSON"}
                </button>
              </div>

              {/* DASHBOARD VIEW */}
              {!showRawJson ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {Object.entries(mlPayload.games).map(
                    ([gameName, data]: [string, any]) => (
                      <div
                        key={gameName}
                        className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors shadow-inner"
                      >
                        <h3 className="text-cyan-400 font-bold uppercase text-sm tracking-widest mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />{" "}
                          {gameName.replace(/_/g, " ")}
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(data).map(
                            ([key, val]: [string, any]) => (
                              <div
                                key={key}
                                className="flex justify-between items-center text-sm"
                              >
                                <span className="text-gray-500 capitalize">
                                  {key.replace(/_/g, " ")}
                                </span>
                                <span className="text-white font-mono bg-white/5 px-2 py-1 rounded">
                                  {typeof val === "number"
                                    ? val.toFixed(2)
                                    : typeof val === "object"
                                      ? "{...}"
                                      : val}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                /* RAW JSON VIEW */
                <div className="bg-black/80 p-6 rounded-2xl border border-gray-800 mb-8 overflow-x-auto max-h-[50vh]">
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                    {JSON.stringify(mlPayload, null, 2)}
                  </pre>
                </div>
              )}

              {/* Final Submit Button */}
              <button
                onClick={submitToBackend}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold tracking-widest py-4 md:py-5 rounded-xl transition-all hover:scale-[1.01] shadow-[0_0_20px_rgba(34,211,238,0.4)] flex justify-center items-center gap-3 text-lg"
              >
                <Database className="w-6 h-6" /> INGEST TO ML PIPELINE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
