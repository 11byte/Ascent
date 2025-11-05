"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Wand2, Download, KeyRound, Sparkles, ChevronDown } from "lucide-react";
import ReactFlow, {
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

// ---------- THEME ----------
const theme = {
  ink: "#000000",
  parchment: "#E8E3D4",
  gold: "#CBAF68",
};

// Sample models with "gemini-2.5-flash"
const MODELS = [
  { key: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { key: "openai", label: "OpenAI" },
  { key: "groq", label: "Groq" },
  { key: "cohere", label: "Cohere" },
];

// Rich sample roadmap tree (multi-level) to display immediately and via "Load Sample"
const SAMPLE_TREE = {
  name: "Full‑Stack Web Development",
  children: [
    {
      name: "Fundamentals",
      children: [
        {
          name: "HTML & CSS",
          children: [{ name: "Semantics" }, { name: "Flex/Grid" }, { name: "Responsive" }],
        },
        {
          name: "JavaScript Basics",
          children: [{ name: "ES6+" }, { name: "Async/Await" }, { name: "Modules" }],
        },
        {
          name: "Version Control",
          children: [{ name: "Git Basics" }, { name: "Branching" }, { name: "PR Workflow" }],
        },
      ],
    },
    {
      name: "Frontend",
      children: [
        {
          name: "Framework",
          children: [{ name: "React" }, { name: "Next.js" }, { name: "Routing" }],
        },
        {
          name: "State Mgmt",
          children: [{ name: "Context" }, { name: "Redux" }, { name: "Server State" }],
        },
        {
          name: "Styling",
          children: [{ name: "Tailwind" }, { name: "CSS-in-JS" }, { name: "Design Systems" }],
        },
      ],
    },
    {
      name: "Backend",
      children: [
        {
          name: "Runtime & Framework",
          children: [{ name: "Node.js" }, { name: "Express" }, { name: "tRPC/GraphQL" }],
        },
        {
          name: "Databases",
          children: [{ name: "Postgres" }, { name: "MongoDB" }, { name: "ORM (Prisma)" }],
        },
        {
          name: "Auth & Security",
          children: [{ name: "JWT/OAuth" }, { name: "OWASP" }, { name: "Rate Limiting" }],
        },
      ],
    },
    {
      name: "DevOps",
      children: [
        {
          name: "CI/CD",
          children: [{ name: "GitHub Actions" }, { name: "Testing" }, { name: "Preview Apps" }],
        },
        {
          name: "Containers",
          children: [{ name: "Docker" }, { name: "Compose" }, { name: "Images" }],
        },
        {
          name: "Cloud",
          children: [{ name: "Vercel" }, { name: "AWS" }, { name: "Monitoring" }],
        },
      ],
    },
    {
      name: "Advanced",
      children: [
        {
          name: "Performance",
          children: [{ name: "Caching" }, { name: "Code Split" }, { name: "Profiling" }],
        },
        {
          name: "Architecture",
          children: [{ name: "Monorepos" }, { name: "Microservices" }, { name: "Event-Driven" }],
        },
        {
          name: "Testing",
          children: [{ name: "Unit" }, { name: "E2E" }, { name: "Contract" }],
        },
      ],
    },
  ],
};

// Lightweight mock tree generator so UI works without backend
function mockTree(topic: string) {
  const t = topic || "Your Topic";
  return {
    name: t,
    children: [
      {
        name: "Fundamentals",
        children: [{ name: "Basics" }, { name: "Tooling" }, { name: "Core APIs" }],
      },
      {
        name: "Intermediate",
        children: [{ name: "Patterns" }, { name: "Testing" }, { name: "State Mgmt" }],
      },
      {
        name: "Advanced",
        children: [{ name: "Performance" }, { name: "Security" }, { name: "Scaling" }],
      },
    ],
  };
}

// Build visible nodes/edges from tree based on expanded Set.
// Node IDs are stable path strings: "0", "0-1", "0-1-2"
function buildGraph(tree: any, expandedSet: Set<string>) {
  const nodes: any[] = [];
  const edges: any[] = [];
  const rows = new Map(); // depth -> array of node ids

  function traverse(node: any, path: string = "0", depth: number = 0, parentId: string | null = null) {
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const isExpanded = expandedSet.has(path);

    if (!rows.has(depth)) rows.set(depth, []);
    rows.get(depth).push(path);

    nodes.push({
      id: path,
      data: { label: node.name, hasChildren, isExpanded },
      position: { x: 0, y: 0 }, // set after traversal
      style: {
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "#fff",
        borderRadius: 12,
        padding: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        cursor: hasChildren ? "pointer" : "default",
        fontSize: 12,
      },
    });

    if (parentId !== null) {
      edges.push({
        id: `e-${parentId}-${path}`,
        source: parentId,
        target: path,
        type: "smoothstep",
        animated: false,
        style: { stroke: theme.gold, strokeWidth: 1.5 },
      });
    }

    if (hasChildren && isExpanded) {
      node.children.forEach((child: any, idx: number) => {
        traverse(child, `${path}-${idx}`, depth + 1, path);
      });
    }
  }

  traverse(tree);

  // Simple grid layout by depth/row
  const xGap = 260;
  const yGap = 120;
  const maxDepth = Math.max(...rows.keys());
  const colCount = maxDepth + 1;

  rows.forEach((ids: string[], depth: number) => {
    const colX = depth * xGap;
    const totalHeight = (ids.length - 1) * yGap;
    const startY = -totalHeight / 2;
    ids.forEach((id, i) => {
      const n = nodes.find((nn) => nn.id === id);
      if (n) n.position = { x: colX, y: startY + i * yGap };
    });
  });

  // center the whole graph horizontally
  const centerOffsetX = -((colCount - 1) * xGap) / 2;
  nodes.forEach((n) => (n.position.x += centerOffsetX));

  return { nodes, edges };
}

// function FlowCanvas({ tree }: { tree: any }) {
//   const { fitView } = useReactFlow();
//   // Expanded nodes tracked by stable path IDs. Root "0" expanded by default.
//   const [expanded, setExpanded] = useState(() => new Set(["0"]));

//   const { nodes, edges } = useMemo(() => buildGraph(tree, expanded), [tree, expanded]);

//   useEffect(() => {
//     const t = setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
//     return () => clearTimeout(t);
//   }, [fitView, nodes.length, edges.length]);

//   const onNodeClick = useCallback((_: any, node: any) => {
//     const hasChildren = node?.data?.hasChildren;
//     if (!hasChildren) return;
//     setExpanded((prev) => {
//       const next = new Set(prev);
//       if (next.has(node.id)) next.delete(node.id);
//       else next.add(node.id);
//       return next;
//     });
//   }, []);

//   // Small visual hint by appending an expand/collapse marker to label
//   const nodesWithHint = useMemo(
//     () =>
//       nodes.map((n) => ({
//         ...n,
//         data: {
//           ...n.data,
//           label: n.data.hasChildren
//             ? `${n.data.label} ${n.data.isExpanded ? "▾" : "▸"}`
//             : n.data.label,
//         },
//       })),
//     [nodes],
//   );

//   return (
//     <ReactFlow
//       nodes={nodesWithHint}
//       edges={edges}
//       fitView
//       panOnScroll
//       zoomOnScroll
//       elementsSelectable={false}
//       onNodeClick={onNodeClick}
//     >
//       <Background />
//       <Controls />
//     </ReactFlow>
//   );
// }
import * as htmlToImage from "html-to-image";
import "reactflow/dist/style.css";

function FlowCanvas({ tree }: { tree: any }) {
  const { fitView } = useReactFlow();
  const [expanded, setExpanded] = useState(() => new Set(["0"]));
  const flowRef = useRef<HTMLDivElement>(null);

  const { nodes, edges } = useMemo(() => buildGraph(tree, expanded), [tree, expanded]);

  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
    return () => clearTimeout(t);
  }, [fitView, nodes.length, edges.length]);

  const onNodeClick = useCallback((_: any, node: any) => {
    const hasChildren = node?.data?.hasChildren;
    if (!hasChildren) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) next.delete(node.id);
      else next.add(node.id);
      return next;
    });
  }, []);

  const nodesWithHint = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          label: n.data.hasChildren
            ? `${n.data.label} ${n.data.isExpanded ? "▾" : "▸"}`
            : n.data.label,
        },
      })),
    [nodes],
  );

  // 🔽 Download as PNG handler
  const handleDownloadPng = async () => {
    if (!flowRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(flowRef.current, {
        backgroundColor: "#111", // optional background for better contrast
        pixelRatio: 2, // higher quality
        skipFonts: true,
      });

      const link = document.createElement("a");
      link.download = "roadmap.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export PNG:", err);
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* ReactFlow canvas wrapped in ref */}
      <div ref={flowRef} className="h-full w-full rounded-xl overflow-hidden">
        <ReactFlow
          nodes={nodesWithHint}
          edges={edges}
          fitView
          panOnScroll
          zoomOnScroll
          elementsSelectable={false}
          onNodeClick={onNodeClick}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Download button overlay */}
      <button
        onClick={handleDownloadPng}
        className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90 hover:bg-white/15 backdrop-blur-md shadow-lg"
        title="Download PNG"
      >
        <Download size={16} />
        PNG
      </button>
    </div>
  );
}


export default function RoadmapGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  // Initialize with the rich sample tree so users see a roadmap immediately
  const [tree, setTree] = useState(SAMPLE_TREE);
  const [error, setError] = useState("");

  // Restore API keys per model from localStorage
  useEffect(() => {
    const key = localStorage.getItem(`${model.toUpperCase()}_API_KEY`) || "";
    setApiKey(key);
  }, [model]);

  const saveKey = () => {
    localStorage.setItem(`${model.toUpperCase()}_API_KEY`, apiKey);
  };

  const handleGenerate = useCallback(async () => {
    setError("");
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }
    setLoading(true);
    try {
      // Frontend-only stub call. Replace with your real backend later.
      await fetch("https://example.com/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, model }),
      });
      // Use mock tree so UI renders
      const t: any = mockTree(topic.trim());
      setTree(t);
    } catch (e) {
      setError("Failed to reach generator service. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [topic, model]);

  const loadSample = () => {
    setTopic(SAMPLE_TREE.name);
    setTree(SAMPLE_TREE);
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Gradient backdrop to match your site theme */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-950 via-gray-900 to-black" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(600px 200px at 50% -50px, rgba(203,175,104,0.25), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 pt-[70px] pb-10">
        {/* Controls */}
        <div className="mt-6">
          <div className="w-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 md:p-5 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              {/* Topic input */}
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleGenerate();
                }}
                placeholder="e.g. React, Backend, Machine Learning"
                className="flex-1 rounded-lg border border-white/15 bg-transparent px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#CBAF68]"
              />

              {/* Model select */}
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="appearance-none rounded-lg border border-white/15 bg-white/10 px-4 py-3 pr-10 text-white/90 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#CBAF68]"
                >
                  {MODELS.map((m) => (
                    <option key={m.key} value={m.key} className="bg-gray-900 text-white">
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
                />
              </div>

              {/* Add Key */}
              <button
                onClick={() => setShowKey((s) => !s)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white/90 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#CBAF68]"
                title="Add API Key"
              >
                <KeyRound size={16} />
                <span className="hidden sm:inline">Add Key</span>
              </button>

              {/* Generate */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.99]"
                style={{
                  background: `linear-gradient(90deg, ${theme.ink}, ${theme.gold})`,
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 size={18} />}
                {loading ? "Generating…" : "Generate"}
              </button>

              {/* Load Sample */}
              {/* <button
                onClick={loadSample}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold text-white/90 border border-white/15 bg-white/10 hover:bg-white/15"
                title="Load a rich sample roadmap"
              >
                Load Sample
              </button> */}
            </div>

            {/* Key input row */}
            {showKey && (
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`${model.toUpperCase()}_API_KEY`}
                  className="flex-1 rounded-lg border border-white/15 bg-transparent px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#CBAF68]"
                />
                <button
                  onClick={saveKey}
                  className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white/90 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#CBAF68]"
                >
                  Save Key
                </button>
              </div>
            )}

            {/* Quick examples */}
            {/* <div className="mt-3 flex flex-wrap gap-2">
              {["Frontend", "Backend", "Machine Learning", "DevOps"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTopic(tag)}
                  className="group relative rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-white/85 hover:bg-white/15"
                >
                  {tag}
                  <span className="pointer-events-none absolute left-2 right-2 -bottom-1 h-[2px] w-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all duration-300 group-hover:w-6" />
                </button>
              ))}
            </div> */}

            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
          </div>
        </div>

        {/* Graph + Side panel */}
        <div className="mt-8">
          {/* Graph */}
          <div className="lg:col-span-3 rounded-2xl p-2 h-[72vh] shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <ReactFlowProvider>
              <FlowCanvas tree={tree} />
            </ReactFlowProvider>
          </div>

          {/* Details panel (static UI placeholder) */}
          {/* <div className="lg:col-span-1 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 text-white shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-2 text-[#E8E3D4]">
              <Sparkles size={18} />
              <h3 className="font-semibold">AI Tips</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              <li>Click nodes with ▸/▾ to expand/collapse child topics.</li>
              <li>Switch models to compare different pathways.</li>
              <li>Save your API key locally for higher rate limits.</li>
            </ul>

            <hr className="my-5 border-white/10" />

            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white/90">Export</h4>
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-white/90 hover:bg-white/15"
                onClick={() => alert("Add PNG export later")}
              >
                <Download size={16} />
                PNG
              </button>
            </div>
            <p className="mt-2 text-xs text-white/60">
              Export and share your roadmap once you’re happy with it.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}