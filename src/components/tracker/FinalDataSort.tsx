"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, ChevronRight, Volume2, Shield, Brain, Code, Database, RefreshCcw } from "lucide-react";

// --- 1. Predefined Word Banks & Domains ---
const DOMAINS = [
  { id: "Cybersecurity", label: "SECURITY", color: "bg-red-500", border: "border-red-500/50", icon: Shield },
  { id: "AIML", label: "AI / ML", color: "bg-fuchsia-500", border: "border-fuchsia-500/50", icon: Brain },
  { id: "WebDev", label: "WEB DEV", color: "bg-blue-500", border: "border-blue-500/50", icon: Code },
  { id: "DataScience", label: "DATA SCI", color: "bg-green-500", border: "border-green-500/50", icon: Database }
];

const WORD_BANKS: Record<string, string[]> = {
  "Cybersecurity": ["FIREWALL", "PHISHING", "MALWARE", "ENCRYPTION"],
  "AIML": ["TENSOR", "NEURAL", "DATASET", "EPOCH"],
  "WebDev": ["REACT", "CSS", "HTML", "FRONTEND"],
  "DataScience": ["PANDAS", "PYTHON", "CSV", "CLEANING"]
};

// --- 2. Custom Audio Engine ---
const AudioEngine = {
  playGrab: () => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  },
  playDrop: () => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle"; osc.frequency.setValueAtTime(200, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  },
  playSuccess: () => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  },
  playError: () => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth"; osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }
};

// --- 3. Main Game Component ---
// UPDATED: onComplete expects the metrics payload
export default function FinalDataSort({ onComplete }: { onComplete?: (metrics: any) => void }) {
  // Game State
  const [items, setItems] = useState<{ id: string, word: string, domain: string, zone: string, status: 'idle' | 'correct' | 'wrong' }[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // --- ADDED: ML TELEMETRY TRACKERS ---
  const startTime = useRef<number>(0);
  const dragCount = useRef<number>(0);
  const [finalMetrics, setFinalMetrics] = useState<any>(null);

  const bgContainerRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);

  // Initialize Game Data (Pick 2 random words from each domain)
  useEffect(() => {
    const generatedItems: any[] = [];
    DOMAINS.forEach(d => {
      const shuffled = [...WORD_BANKS[d.id]].sort(() => 0.5 - Math.random()).slice(0, 2);
      shuffled.forEach(word => {
        generatedItems.push({ id: `${d.id}-${word}`, word, domain: d.id, zone: "pool", status: 'idle' });
      });
    });
    // Shuffle the final pool
    setItems(generatedItems.sort(() => 0.5 - Math.random()));
    
    // --- ADDED: Start timer when items are loaded ---
    startTime.current = Date.now();
  }, []);

  // Background Parallax
  useGSAP(() => {
    gsap.to(groundRef.current, { backgroundPositionX: "1301px", duration: 20, ease: "none", repeat: -1, force3D: true });
    gsap.to(cloudsRef.current, { backgroundPositionX: "-2247px", duration: 52, ease: "none", repeat: -1, force3D: true });
  }, []);

  // --- Drag & Drop Logic ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    if (audioEnabled) AudioEngine.playGrab();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetZone: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    
    // --- ADDED: TRACK EACH DRAG (used for confidence/hesitation metric) ---
    dragCount.current += 1;

    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, zone: targetZone } : item
    ));
    
    if (audioEnabled) AudioEngine.playDrop();
  };

  // --- Evaluation Logic ---
  const handleVerify = async () => {
    setEvaluating(true);
    let allCorrect = true;

    // Check each item one by one for dramatic effect
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.zone !== "pool") {
        await new Promise(res => setTimeout(res, 300)); // Delay between checks
        
        const isCorrect = item.domain === item.zone;
        if (!isCorrect) allCorrect = false;

        setItems(prev => prev.map(p => 
          p.id === item.id 
            ? { ...p, status: isCorrect ? 'correct' : 'wrong', zone: isCorrect ? p.zone : "pool" } 
            : p
        ));

        if (audioEnabled) {
          isCorrect ? AudioEngine.playSuccess() : AudioEngine.playError();
        }

        // Screen shake on error
        if (!isCorrect && bgContainerRef.current) {
          gsap.fromTo(bgContainerRef.current, { x: -10 }, { x: 0, duration: 0.3, ease: "elastic.out(2, 0.1)" });
        }
      }
    }

    if (allCorrect) {
      // --- ADDED: COMPILE METRICS ON WIN ---
      const timeTaken = (Date.now() - startTime.current) / 1000;
      const totalItems = items.length;
      // If they dragged exactly minimum times, hesitation is 0. Anything over is hesitation.
      const hesitations = dragCount.current - totalItems; 
      
      setFinalMetrics({
        speed_sec: Number(timeTaken.toFixed(2)),
        total_drags: dragCount.current,
        undos_hesitations: hesitations > 0 ? hesitations : 0
      });

      setTimeout(() => setGameWon(true), 800);
    } else {
      setTimeout(() => setEvaluating(false), 800);
      // Reset wrong items to idle so they can be sorted again
      setTimeout(() => {
        setItems(prev => prev.map(p => p.status === 'wrong' ? { ...p, status: 'idle' } : p));
      }, 1500);
    }
  };

  const poolItems = items.filter(i => i.zone === "pool");
  const isPoolEmpty = poolItems.length === 0;

  return (
    <div ref={bgContainerRef} className="relative w-full h-screen min-h-[800px] bg-[#63D0FF] overflow-hidden flex items-center justify-center font-sans">
      
      {/* Parallax Background */}
      <div ref={cloudsRef} className="absolute top-0 left-0 w-full h-[230px] z-0 pointer-events-none" style={{ backgroundImage: 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/56901/bg-clouds2-tinypng.png")', backgroundRepeat: 'repeat-x', backgroundPosition: '0 bottom' }} />
      <div ref={groundRef} className="absolute bottom-0 left-0 w-full h-[192px] z-0 pointer-events-none" style={{ backgroundImage: 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/56901/grass_tile-tinypng.png")', backgroundRepeat: 'repeat-x', backgroundPosition: '0 0' }} />

      {/* Audio Toggle */}
      <button onClick={() => setAudioEnabled(!audioEnabled)} className="absolute top-6 right-6 z-50 p-3 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition-colors border border-white/20 text-white">
        <Volume2 className={`w-6 h-6 ${audioEnabled ? 'opacity-100' : 'opacity-30 line-through'}`} />
      </button>

      {/* Main Game UI */}
      <div className="relative z-10 w-full max-w-5xl mx-4 flex flex-col gap-4">
        
        {/* Header */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-xl flex justify-between items-center px-8">
          <div>
            <h2 className="text-white font-bold text-2xl font-[Orbitron] tracking-widest">DATA SORT</h2>
            <p className="text-cyan-300 text-sm font-mono">Drag the packets into their correct subsystem.</p>
          </div>
          {isPoolEmpty && !evaluating && !gameWon && (
            <motion.button 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              onClick={handleVerify}
              className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-transform hover:scale-105"
            >
              <RefreshCcw className="w-5 h-5" /> VERIFY SORT
            </motion.button>
          )}
        </div>

        {/* Tier Maker Grid */}
        <div className="flex flex-col gap-3 bg-gray-900/60 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl">
          {DOMAINS.map((domain) => {
            const domainItems = items.filter(i => i.zone === domain.id);
            return (
              <div key={domain.id} className="flex min-h-[80px] rounded-2xl overflow-hidden bg-black/40 border border-white/5 shadow-inner">
                {/* Tier Label */}
                <div className={`w-32 flex flex-col items-center justify-center text-center p-2 shadow-lg z-10 ${domain.color}`}>
                  <domain.icon className="w-6 h-6 text-white mb-1 opacity-80" />
                  <span className="text-white font-bold text-xs tracking-widest">{domain.label}</span>
                </div>
                
                {/* Drop Zone */}
                <div 
                  className="flex-1 p-3 flex flex-wrap gap-3 items-center transition-colors duration-300 relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, domain.id)}
                >
                  {domainItems.length === 0 && (
                     <span className="text-gray-600 font-mono text-sm absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none">Drop {domain.label} packets here...</span>
                  )}
                  <AnimatePresence>
                    {domainItems.map(item => (
                      <DraggableChip key={item.id} item={item} onDragStart={handleDragStart} evaluating={evaluating} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Pool */}
        {!gameWon && (
          <div 
            className={`min-h-[120px] bg-gray-900/80 backdrop-blur-xl border-2 border-dashed rounded-3xl p-6 shadow-2xl transition-colors duration-300 ${isPoolEmpty ? 'border-gray-700/50' : 'border-cyan-500/50'}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "pool")}
          >
             <div className="flex flex-wrap gap-4 justify-center items-center h-full">
                <AnimatePresence>
                  {poolItems.map(item => (
                    <DraggableChip key={item.id} item={item} onDragStart={handleDragStart} evaluating={evaluating} />
                  ))}
                </AnimatePresence>
                {isPoolEmpty && <span className="text-cyan-600/50 font-mono font-bold">POOL EMPTY - READY TO VERIFY</span>}
             </div>
          </div>
        )}

        {/* Victory Screen Overlay */}
        <AnimatePresence>
          {gameWon && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} 
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-3xl"
            >
              <div className="bg-gray-900 border border-green-500/50 p-10 rounded-3xl shadow-[0_0_60px_rgba(34,197,94,0.3)] text-center max-w-md">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: "spring", damping: 15 }} className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2 font-[Orbitron]">DATABASE SORTED</h2>
                <p className="text-green-200/70 mb-8">All subsystems correctly classified.</p>
                
                {/* --- ADDED: Pass the finalMetrics to the parent Controller when clicked --- */}
                <button 
                  onClick={() => onComplete ? onComplete(finalMetrics) : alert(`Metrics Data:\n${JSON.stringify(finalMetrics, null, 2)}`)} 
                  className="w-full group bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-300 hover:to-cyan-400 text-gray-900 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.03] shadow-lg"
                >
                  Next Challenge <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Draggable Chip Sub-Component ---
// Using Framer Motion's "layout" prop so it glides smoothly between lists!
function DraggableChip({ item, onDragStart, evaluating }: { item: any, onDragStart: any, evaluating: boolean }) {
  
  // Dynamic styling based on evaluation status
  let bgColors = "bg-gray-800 border-gray-600 text-gray-200 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]";
  if (item.status === 'correct') bgColors = "bg-green-500 border-green-400 text-gray-900 shadow-[0_0_15px_rgba(34,197,94,0.6)]";
  if (item.status === 'wrong') bgColors = "bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.6)]";

  return (
    <motion.div
      layout // This is the magic Framer Motion prop that glides it between lists!
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      whileHover={!evaluating ? { scale: 1.05 } : {}}
      whileTap={!evaluating ? { scale: 0.95 } : {}}
      draggable={!evaluating && item.status !== 'correct'}
      onDragStart={(e: any) => onDragStart(e, item.id)}
      className={`px-4 py-2 rounded-lg font-bold text-sm tracking-wider cursor-grab active:cursor-grabbing border-2 transition-colors duration-300 ${bgColors} ${evaluating ? 'pointer-events-none' : ''}`}
    >
      {item.word}
    </motion.div>
  );
}