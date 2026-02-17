"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Download,
  Share2,
  Maximize2,
  ExternalLink,
  BookOpen,
  X,
  Info,
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

// ---------- THEME & CUSTOM COMPONENTS ----------
const theme = { ink: "#000000", gold: "#CBAF68" };

const RoadmapNode = ({ data }: any) => (
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

const nodeTypes = { roadmap: RoadmapNode };

// ---------- LAYOUT LOGIC ----------
function buildGraph(tree: any, expandedSet: Set<string>) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function getSubtreeHeight(node: any, path: string): number {
    if (!expandedSet.has(path) || !node.children || node.children.length === 0)
      return 1;
    return node.children.reduce(
      (acc: number, child: any, i: number) =>
        acc + getSubtreeHeight(child, `${path}-${i}`),
      0,
    );
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

// ---------- VIEWPORT COMPONENT ----------
function FlowViewer({ tree, title }: { tree: any; title: string }) {
  const { fitView } = useReactFlow();
  const [expanded, setExpanded] = useState(new Set(["0"]));
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  // Inside FlowViewer component
  const [resources, setResources] = useState<{
    videos: any[];
    books: any[];
  } | null>(null);
  const [loadingResources, setLoadingResources] = useState(false);

  const { nodes, edges } = useMemo(
    () => buildGraph(tree, expanded),
    [tree, expanded],
  );

  useEffect(() => {
    setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 100);
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
      setSelectedNode(node.data);
      setResources(null); // Reset
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
    const dataUrl = await htmlToImage.toPng(flowRef.current, {
      backgroundColor: "#0a0a0a",
      skipFonts: true,
    });
    const link = document.createElement("a");
    link.download = `${title.replace(/\s+/g, "_")}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="h-full w-full flex relative" ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#222" gap={20} />
        <Controls />
        <div className="absolute top-6 right-6 z-50 flex gap-3">
          <button
            onClick={downloadPng}
            className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 text-sm backdrop-blur-md"
          >
            <Download size={16} /> PNG
          </button>
        </div>
      </ReactFlow>

      {/* Detail Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-[400px] bg-[#09090b]/95 border-l border-white/10 backdrop-blur-2xl transition-transform duration-500 z-[100] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] ${
          selectedNode ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto custom-scrollbar flex flex-col">
          {/* Header Section */}
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

          <div className="p-8 space-y-10">
            {selectedNode && (
              <>
                {/* Overview Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-black flex items-center gap-2">
                    <Info size={14} className="text-[#CBAF68]" /> Overview
                  </h4>
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 leading-relaxed">
                    <p className="text-gray-300 text-sm italic">
                      {selectedNode.description ||
                        "In-depth intelligence for this module is currently being synthesized by the AI core."}
                    </p>
                  </div>
                </div>

                {/* YouTube Videos Section */}
                <section className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-black flex items-center justify-between">
                    <span>Top Video Tutorials</span>
                    <span className="text-[#CBAF68]/50">05 Results</span>
                  </h4>

                  {loadingResources ? (
                    <div className="py-10 flex flex-col items-center justify-center gap-3">
                      <Loader2
                        className="animate-spin text-[#CBAF68]"
                        size={24}
                      />
                      <span className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">
                        Fetching Streams...
                      </span>
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
                          <div className="relative flex-shrink-0">
                            <img
                              src={vid.thumbnail}
                              className="w-24 h-14 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform"
                              alt=""
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors rounded-lg" />
                          </div>
                          <span className="text-xs font-medium text-gray-300 group-hover:text-white line-clamp-2 leading-snug">
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
                            className="w-12 h-16 object-cover rounded shadow-md group-hover:-rotate-2 transition-transform"
                            alt=""
                          />
                        ) : (
                          <div className="w-12 h-16 bg-white/5 rounded flex items-center justify-center text-gray-700">
                            <BookOpen size={16} />
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-200 group-hover:text-[#CBAF68] transition-colors line-clamp-1">
                            {book.title}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {book.authors?.[0] || "Unknown Archive"}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>

                {/* External Links */}
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
                      <ExternalLink
                        size={16}
                        className="text-[#CBAF68] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
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

// ---------- PAGE EXPORT ----------
export default function RoadmapViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/roadmap/get/${id}`);
        const data = await res.json();
        if (data.status) setRoadmap(data.roadmap);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRoadmap();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#CBAF68]" size={32} />
        <span className="text-gray-500 font-medium tracking-widest text-xs uppercase">
          Reconstructing Path
        </span>
      </div>
    );

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(203,175,104,0.05),transparent_50%)] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 px-8 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md flex justify-between items-center mt-16">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              {roadmap?.title}
            </h1>
            {/* <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
              <Maximize2 size={10} /> Interactive Visualization
            </div> */}
          </div>
        </div>
        <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-[#CBAF68] transition-all">
          <Share2 size={18} />
        </button>
      </header>

      {/* Main Flow Container */}
      <main className="flex-1 relative">
        <ReactFlowProvider>
          <FlowViewer tree={roadmap?.content} title={roadmap?.title} />
        </ReactFlowProvider>
      </main>
    </div>
  );
}
