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
  BookOpen,
  X,
  ExternalLink,
  Compass,
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
      // Passing description and link to the node data for the sidebar
      data: {
        label: node.name,
        hasChildren,
        isExpanded,
        description: node.moduleDescription,
        link: node.link,
      },
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
      <div className="relative flex flex-col h-screen mt-16">
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
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [resources, setResources] = useState<any>(null);
  const [loadingResources, setLoadingResources] = useState(false);
  const flowRef = useRef<HTMLDivElement>(null);

  const { nodes, edges } = useMemo(
    () => buildGraph(tree, expanded),
    [tree, expanded],
  );

  useEffect(() => {
    setTimeout(() => fitView({ padding: 0.3, duration: 800 }), 100);
  }, [nodes.length, fitView]);

  const onNodeClick = useCallback(async (_: any, node: any) => {
    if (node.data.hasChildren) {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) next.delete(node.id);
        else next.add(node.id);
        return next;
      });
    } else {
      // Leaf Node Selection Logic
      setSelectedNode(node.data);
      setResources(null);
      setLoadingResources(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/roadmap/module-resources?topic=${encodeURIComponent(node.data.label)}`,
        );
        const data = await res.json();
        if (data.status) setResources(data.resources);
      } catch (e) {
        console.error("Resource fetch error");
      } finally {
        setLoadingResources(false);
      }
    }
  }, []);

  const downloadPng = async () => {
    if (!flowRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(flowRef.current, {
        backgroundColor: "#0a0a0a",
        quality: 1,
        pixelRatio: 2,
        skipFonts: true,
        style: { fontFamily: "sans-serif" },
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
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 text-sm backdrop-blur-md"
          >
            <Download size={16} /> PNG
          </button>
        </div>
      </ReactFlow>

      {/* --- PREMIUM SIDEBAR --- */}
      <aside
        className={`fixed top-0 right-0 h-full w-[400px] bg-[#09090b]/95 border-l border-white/10 backdrop-blur-2xl transition-transform duration-500 z-[100] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] ${
          selectedNode ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto custom-scrollbar flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-[#09090b]/80 backdrop-blur-md px-8 py-6 border-b border-white/5 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#CBAF68]">
                <BookOpen size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Module Details
                </span>
              </div>
              <h2 className="text-xl font-bold text-white leading-tight">
                {selectedNode?.label}
              </h2>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-10">
            {selectedNode && (
              <>
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-black flex items-center gap-2">
                    <Info size={14} className="text-[#CBAF68]" /> Overview
                  </h4>
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 leading-relaxed">
                    <p className="text-gray-300 text-sm italic">
                      {selectedNode.description ||
                        "In-depth intelligence for this module is currently being synthesized."}
                    </p>
                  </div>
                </div>

                {/* YouTube Section */}
                <section className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-black">
                    Top Video Tutorials
                  </h4>
                  {loadingResources ? (
                    <div className="py-10 flex flex-col items-center justify-center gap-3">
                      <Loader2
                        className="animate-spin text-[#CBAF68]"
                        size={24}
                      />
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {resources?.videos.map((vid: any) => (
                        <a
                          key={vid.id}
                          href={vid.url}
                          target="_blank"
                          className="group flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.07] hover:border-[#CBAF68]/30 transition-all"
                        >
                          <img
                            src={vid.thumbnail}
                            className="w-24 h-14 object-cover rounded-lg"
                            alt=""
                          />
                          <span className="text-xs font-medium text-gray-300 group-hover:text-white line-clamp-2">
                            {vid.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </section>

                {/* Books Section */}
                <section className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-black">
                    Recommended Reading
                  </h4>
                  <div className="grid gap-3">
                    {resources?.books.map((book: any) => (
                      <a
                        key={book.id}
                        href={book.previewLink}
                        target="_blank"
                        className="group flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.07] hover:border-[#CBAF68]/30 transition-all"
                      >
                        {book.thumbnail ? (
                          <img
                            src={book.thumbnail}
                            className="w-12 h-16 object-cover rounded"
                            alt=""
                          />
                        ) : (
                          <div className="w-12 h-16 bg-white/5 rounded flex items-center justify-center text-gray-700">
                            <BookOpen size={16} />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-gray-200 group-hover:text-[#CBAF68] line-clamp-1">
                            {book.title}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {book.authors?.[0]}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>

                {/* Wikipedia Link */}
                {selectedNode.link && (
                  <div className="pt-6 border-t border-white/5">
                    <a
                      href={selectedNode.link}
                      target="_blank"
                      className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#CBAF68]/10 to-transparent border border-[#CBAF68]/20 rounded-2xl hover:from-[#CBAF68]/20 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#CBAF68] text-black rounded-lg">
                          <Compass size={16} />
                        </div>
                        <span className="text-sm font-bold text-white group-hover:text-[#CBAF68]">
                          Wikipedia Research
                        </span>
                      </div>
                      <ExternalLink size={16} className="text-[#CBAF68]" />
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
