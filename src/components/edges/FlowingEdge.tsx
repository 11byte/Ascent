"use client";

import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";
import { motion } from "framer-motion";

export default function ParticleEdge(props: EdgeProps) {
  const [edgePath] = getBezierPath(props);

  return (
    <>
      {/* Base line */}
      <BaseEdge
        path={edgePath}
        style={{
          stroke: "rgba(255,255,255,0.15)",
          strokeWidth: 2,
        }}
      />

      {/* Flow effect */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke="#7CF3FF"
        strokeWidth={3}
        strokeDasharray="10 20"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -40 }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          filter: "drop-shadow(0 0 6px #7CF3FF)",
        }}
      />
    </>
  );
}
