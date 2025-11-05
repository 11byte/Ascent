"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Database, ArrowDownCircle, Activity } from "lucide-react";

interface PredictionResult {
  predicted_domain: string;
  confidence: number;
}

export default function DomainPredictorPage() {
  const [userData, setUserData] = useState<any>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const userName =
    typeof window !== "undefined" ? localStorage.getItem("userName") : "";
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : "";

  const handleFetchKafkaData = async () => {
    try {
      setFetching(true);
      const res = await fetch(
        `http://localhost:5000/api/kafka/data/${userId}` // your backend endpoint that aggregates user Kafka data
      );
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error("❌ Error fetching Kafka data:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleFeedToModel = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/domain/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }), // ✅ send only userId
      });
      const result = await res.json();
      setPrediction(result);
    } catch (err) {
      console.error("❌ Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#12121b] text-white px-6 py-10 font-[Inter] mt-18 ">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-[Orbitron] tracking-wide text-cyan-400">
          Domain Intelligence Monitor
        </h1>
        <p className="text-gray-400 mt-2">
          AI-driven domain prediction based on your Ascent activity footprint
        </p>
      </motion.div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-[#141421] border border-cyan-700/30 p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div>
          <p className="text-lg text-gray-300">👤 Logged in as:</p>
          <h2 className="text-2xl font-semibold text-cyan-400">{userName}</h2>
          <p className="text-sm text-gray-400 mt-1">User ID: {userId}</p>
        </div>
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleFetchKafkaData}
            disabled={fetching}
            className="flex items-center gap-2 bg-cyan-500/20 border border-cyan-400 px-6 py-2 rounded-xl hover:bg-cyan-500/30 transition-all"
          >
            <Database className="w-5 h-5 text-cyan-300" />
            {fetching ? "Fetching..." : "Retrieve User Data"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleFeedToModel}
            disabled={!userData || loading}
            className={`flex items-center gap-2 border px-6 py-2 rounded-xl transition-all ${
              userData
                ? "bg-pink-500/20 border-pink-400 hover:bg-pink-500/30"
                : "bg-gray-700 border-gray-600 cursor-not-allowed"
            }`}
          >
            <Cpu className="w-5 h-5 text-pink-300" />
            {loading ? "Analyzing..." : "Feed Data to Model"}
          </motion.button>
        </div>
      </motion.div>

      {/* User Data Display */}
      <AnimatePresence>
        {userData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-[#1a1a28]/80 border border-cyan-800/30 rounded-3xl p-6 shadow-md backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <ArrowDownCircle className="text-cyan-400 w-5 h-5" />
              <h3 className="text-xl font-semibold text-cyan-300">
                Kafka Aggregated Data
              </h3>
            </div>
            <pre className="bg-black/50 text-cyan-100 text-sm p-4 rounded-xl overflow-x-auto max-h-[350px] border border-cyan-700/20">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prediction Result */}
      <AnimatePresence>
        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 border border-pink-600/40 bg-gradient-to-r from-pink-900/30 to-purple-900/30 p-6 rounded-3xl shadow-xl text-center"
          >
            <div className="flex justify-center items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-pink-400" />
              <h3 className="text-xl font-bold text-pink-400">
                Domain Prediction Result
              </h3>
            </div>

            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="text-3xl font-extrabold text-pink-300"
            >
              {prediction.predicted_domain}
            </motion.p>
            <p className="text-sm text-gray-300 mt-2">
              Confidence:{" "}
              <span className="font-semibold text-pink-400">
                {(prediction.confidence * 100).toFixed(2)}%
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
