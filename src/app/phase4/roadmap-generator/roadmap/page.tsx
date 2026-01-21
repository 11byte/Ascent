"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Loader2,
  Wand2,
  Download,
  KeyRound,
  Sparkles,
  ChevronDown,
  Coins,
  Info,
  MousePointer2,
} from "lucide-react";
import ReactFlow, {
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import * as htmlToImage from "html-to-image";

// ---------- THEME ----------
const theme = { ink: "#000000", gold: "#CBAF68" };
const MODELS = [{ key: "gemini-3-flash-preview", label: "Gemini 3 Flash" }];

// ---------- CUSTOM NODE COMPONENT ----------
const RoadmapNode = ({ data }: any) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl border transition-all duration-300 shadow-xl ${
        data.isExpanded
          ? "bg-white/15 border-[#CBAF68] shadow-[#CBAF68]/20"
          : "bg-white/5 border-white/15"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-[#CBAF68] !w-2 !h-2"
      />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white whitespace-nowrap">
          {data.label}
        </span>
        {data.hasChildren && (
          <span className="text-[10px] text-[#CBAF68]">
            {data.isExpanded ? "▼" : "▶"}
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-[#CBAF68] !w-2 !h-2"
      />
    </div>
  );
};

const nodeTypes = { roadmap: RoadmapNode };

// ---------- SMART TREE LAYOUT LOGIC ----------
function buildGraph(tree: any, expandedSet: Set<string>) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function getSubtreeHeight(node: any, path: string): number {
    if (
      !expandedSet.has(path) ||
      !node.children ||
      node.children.length === 0
    ) {
      return 1;
    }
    return node.children.reduce((acc: number, child: any, i: number) => {
      return acc + getSubtreeHeight(child, `${path}-${i}`);
    }, 0);
  }

  function traverse(
    node: any,
    path: string = "0",
    x: number = 0,
    yOffset: number = 0,
    parentId: string | null = null,
  ) {
    const hasChildren =
      Array.isArray(node.children) && node.children.length > 0;
    const isExpanded = expandedSet.has(path);
    const subtreeHeight = getSubtreeHeight(node, path);

    const nodeY = yOffset + (subtreeHeight * 100) / 2;

    nodes.push({
      id: path,
      type: "roadmap",
      data: { label: node.name, hasChildren, isExpanded },
      position: { x, y: nodeY },
    });

    if (parentId !== null) {
      edges.push({
        id: `e-${parentId}-${path}`,
        source: parentId,
        target: path,
        type: "smoothstep",
        animated: isExpanded,
        style: {
          stroke: isExpanded ? theme.gold : "rgba(255,255,255,0.2)",
          strokeWidth: 2,
        },
      });
    }

    if (hasChildren && isExpanded) {
      let currentY = yOffset;
      node.children.forEach((child: any, idx: number) => {
        const childPath = `${path}-${idx}`;
        const childHeight = getSubtreeHeight(child, childPath);
        traverse(child, childPath, x + 300, currentY, path);
        currentY += childHeight * 100;
      });
    }
  }

  if (tree) traverse(tree);
  return { nodes, edges };
}

// ---------- MAIN PAGE COMPONENT ----------
export default function RoadmapGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [model, setModel] = useState("gemini-3-flash-preview");
  const [apiKey, setApiKey] = useState("");
  const [usePersonalKey, setUsePersonalKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tree, setTree] = useState<any>(null);
  const [credits, setCredits] = useState(1000);
  const [error, setError] = useState("");

  // Fetch credits and user info on mount
  // useEffect(() => {
  //   const fetchCredits = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5000/api/users/profile", {
  //         headers: { "userId": "user_id_from_auth" } // Replace with your actual auth userId
  //       });
  //       const data = await res.json();
  //       if (data.status) setCredits(data.credits);
  //     } catch (e) { console.error("Could not fetch credits"); }
  //   };
  //   fetchCredits();
  // }, []);

  const handleGenerate = async () => {
    setError("");
    if (!topic.trim()) return setError("Please enter a topic");
    if (usePersonalKey && !apiKey.trim())
      return setError("Please enter your API Key");
    if (!usePersonalKey && credits < 100)
      return setError("Insufficient credits (100 required)");

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/roadmap/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: topic,
            model: model,
            apiKey: usePersonalKey ? apiKey : null,
            mode: usePersonalKey ? "personal" : "credits",
            userId: localStorage.getItem("userId"),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(data.message || "Failed to generate roadmap");
      }

      setTree(data.tree);
      if (!usePersonalKey) setCredits((prev) => prev - 100);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white selection:bg-[#CBAF68]/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1a1a1a,transparent)]" />
      <div className="relative z-10 flex flex-col h-screen mt-16">
        {/* Credits Badge Overlay */}
        {/* <div className="absolute top-4 right-8 z-20 flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <Coins className="text-yellow-500" size={16} />
          <span className="text-sm font-bold font-mono text-yellow-500">{credits}</span>
        </div> */}

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-80 border-r border-white/10 p-6 flex flex-col gap-6 bg-black/20 overflow-y-auto">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase text-gray-500">
                Subject
              </label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Fullstack Web Dev"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#CBAF68]"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase text-gray-500">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
              >
                {MODELS.map((m) => (
                  <option key={m.key} value={m.key} className="bg-zinc-900">
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setUsePersonalKey(!usePersonalKey)}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <KeyRound size={14} />
              {usePersonalKey ? "Personal Key Active" : "Use Personal API Key"}
            </button>

            {usePersonalKey && (
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste Gemini Key..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs"
              />
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#CBAF68] text-black font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Wand2 size={18} />
              )}
              Generate Path
            </button>
            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}
          </aside>

          <main className="flex-1 relative">
            {!tree ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <MousePointer2 size={40} className="mb-4 opacity-20" />
                <p>Enter a topic to build your journey</p>
              </div>
            ) : (
              <ReactFlowProvider>
                <FlowContent tree={tree} />
              </ReactFlowProvider>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Separate component for internal ReactFlow hooks
function FlowContent({ tree }: { tree: any }) {
  const { fitView } = useReactFlow();
  const [expanded, setExpanded] = useState(new Set(["0"]));
  const flowRef = useRef<HTMLDivElement>(null);

  const { nodes, edges } = useMemo(
    () => buildGraph(tree, expanded),
    [tree, expanded],
  );

  useEffect(() => {
    setTimeout(() => fitView({ padding: 0.3, duration: 800 }), 100);
  }, [nodes.length, fitView]);

  const onNodeClick = useCallback((_: any, node: any) => {
    if (!node.data.hasChildren) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) next.delete(node.id);
      else next.add(node.id);
      return next;
    });
  }, []);

  const downloadPng = async () => {
    if (!flowRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(flowRef.current, {
        backgroundColor: "#0a0a0a",
        quality: 1,
        pixelRatio: 2, // 🚀 Makes the image high-resolution
        skipFonts: true, // 🛠️ FIX: Prevents the "trim" undefined error
        style: {
          // Ensures the fonts don't look weird when skipped
          fontFamily: "sans-serif",
        },
        // Filters out potential problematic elements
        filter: (node) => {
          const exclusionClasses = [
            "react-flow__controls",
            "react-flow__panel",
          ];
          return !exclusionClasses.some((cls) => node.classList?.contains(cls));
        },
      });

      const link = document.createElement("a");
      link.download = `roadmap.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export PNG:", err);
      // Fallback alert for the user
      alert("Export failed. Try closing other browser tabs to free up memory.");
    }
  };

  return (
    <div className="h-full w-full" ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#333" gap={20} />
        <Controls />
        <div className="absolute top-5 right-4 z-50">
          <button
            onClick={downloadPng}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 text-sm"
          >
            <Download size={16} /> PNG
          </button>
        </div>
      </ReactFlow>
    </div>
  );
}
