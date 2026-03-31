"use client";

import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";
import { motion } from "framer-motion";

export default function ParticleEdge(props: EdgeProps) {
  const [edgePath] = getBezierPath(props);

  return (
    <>
      {/* Base subtle line */}
      <BaseEdge
        path={edgePath}
        style={{
          stroke: "rgba(255,255,255,0.15)",
          strokeWidth: 2,
        }}
      />

      {/* 🔥 MAIN FLOW LINE (VISIBLE MOTION) */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke="url(#flowGradient)"
        strokeWidth={3}
        strokeDasharray="30 30" // 👈 BIG DASH (important)
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -60 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          filter: "drop-shadow(0 0 8px rgba(124,243,255,0.6))",
        }}
      />

      {/* ✨ SECOND LAYER (SOFT TRAIL) */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke="rgba(124,243,255,0.2)"
        strokeWidth={6}
        strokeDasharray="30 30"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -60 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          filter: "blur(4px)",
        }}
      />

      {/* 🌈 Gradient */}
      <defs>
        <linearGradient id="flowGradient" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7CF3FF" />
          <stop offset="50%" stopColor="#B388FF" />
          <stop offset="100%" stopColor="#7CF3FF" />
        </linearGradient>
      </defs>
    </>
  );
}
