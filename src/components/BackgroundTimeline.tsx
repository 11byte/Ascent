"use client";

import { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import ParticleEdge from "./edges/ParticleEdge";

const edgeTypes = {
  particle: ParticleEdge,
};

type Skill = {
  skillName: string;
};

type ThemeType = "aurora" | "ocean" | "ember";

const THEMES: Record<ThemeType, { colors: string[]; bg: string }> = {
  aurora: {
    colors: ["#7CF3FF", "#B388FF", "#69F0AE", "#FFD180"],
    bg: "from-[#050505] via-[#0b0f1a] to-[#050505]",
  },
  ocean: {
    colors: ["#4FC3F7", "#4DD0E1", "#81C784", "#64B5F6"],
    bg: "from-[#02121a] to-[#031b26]",
  },
  ember: {
    colors: ["#FF8A65", "#FF7043", "#FFB74D", "#E57373"],
    bg: "from-[#1a0c0c] to-[#140505]",
  },
};

export default function BackgroundTimeline() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [skills, setSkills] = useState<Record<string, Skill[]>>({});
  const [themeIndex, setThemeIndex] = useState(0);

  const themeKeys: ThemeType[] = ["aurora", "ocean", "ember"];
  const theme = themeKeys[themeIndex];
  const themeColors = THEMES[theme].colors;

  const API = "http://localhost:5000/api/skills";

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API}/timeline`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.ok) return;

      setSkills(data.timeline);
    };

    fetchData();
  }, []);

  const getPosition = (i: number) => ({
    x: 150 + i * 300,
    y: i % 2 === 0 ? 180 : 320,
  });

  const createNodes = (): Node[] =>
    themeColors.map((color, i) => {
      const id = String(i + 1);
      const isActive = expanded === id;
      const isDimmed = expanded !== null && !isActive;

      return {
        id,
        position: getPosition(i),
        data: {
          label: (
            <motion.div
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((prev) => (prev === id ? null : id));
              }}
              animate={{
                scale: isActive ? 1.2 : isDimmed ? 0.85 : 1,
                opacity: isDimmed ? 0.4 : 1,
                y: [0, -6, 0],
              }}
              transition={{
                y: { duration: 4, repeat: Infinity },
              }}
              className="cursor-pointer"
            >
              <div
                className="relative flex items-center justify-center text-center"
                style={{
                  width: isActive ? 180 : 120,
                  height: isActive ? 180 : 120,
                  borderRadius: "50%",
                  border: `1px solid ${color}55`,
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  boxShadow: `0 10px 40px ${color}22`,
                }}
              >
                <div
                  className="text-3xl font-semibold font-[Orbitron] px-2"
                  style={{ color }}
                >
                  {["FE", "SE", "TE", "BE"][i]}
                </div>

                {isActive && (
                  <div
                    className="absolute w-[220px] p-4 rounded-2xl"
                    style={{
                      top: i % 2 === 0 ? "110%" : "auto",
                      bottom: i % 2 !== 0 ? "110%" : "auto",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(10,10,15,0.75)",
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${color}33`,
                    }}
                  >
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(skills[id] || []).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            border: `1px solid ${color}`,
                            color,
                            background: `${color}15`,
                          }}
                        >
                          {s.skillName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ),
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });

  const [nodes, setNodes, onNodesChange] = useNodesState(createNodes());

  useEffect(() => {
    setNodes(createNodes());
  }, [expanded, skills, themeIndex]);

  // 🔥 PARTICLE EDGES HERE
  const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", type: "particle" },
    { id: "e2-3", source: "2", target: "3", type: "particle" },
    { id: "e3-4", source: "3", target: "4", type: "particle" },
  ];

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div className="absolute inset-0 z-0">
      <div
        className={`absolute inset-0 bg-gradient-to-b ${THEMES[theme].bg}`}
      />

      {/* Theme toggle */}
      <div className="absolute top-20 left-6 z-50 flex items-center gap-3">
        {/* Toggle Button */}
        <motion.div
          onClick={() => setThemeIndex((p) => (p + 1) % themeKeys.length)}
          className="w-16 h-8 rounded-full cursor-pointer bg-white/10 relative"
        >
          <motion.div
            className="absolute top-1 w-6 h-6 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${themeColors[0]}, #ffffffcc)`,
            }}
            animate={{ x: themeIndex * 20 }}
          />
        </motion.div>

        {/* Text (Column) */}
        <div className="flex flex-col leading-tight">
          <span
            className="font-[Orbitron] text-xs"
            style={{ color: themeColors[0] }}
          >
            Theme
          </span>
          <span
            className="font-[Orbitron] text-xs"
            style={{ color: themeColors[0] }}
          >
            Toggle
          </span>
        </div>
      </div>

      <div className="w-full h-full pointer-events-none">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="pointer-events-auto"
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={40} size={1} color="#ffffff10" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}
