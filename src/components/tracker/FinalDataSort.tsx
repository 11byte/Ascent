"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, ChevronRight, Volume2, Shield, Brain, Code, Database, RefreshCcw, Cpu } from "lucide-react";

// --- 1. Predefined Word Banks & Dynamic Domains ---
const WORD_BANKS: Record<string, string[]> = {
  "AIML": ["TENSOR", "NEURAL", "DATASET", "EPOCH"],
  "Cybersecurity": ["FIREWALL", "PHISHING", "MALWARE", "ENCRYPTION"],
  "WebDev": ["REACT", "CSS", "HTML", "FRONTEND"],
  "DataScience": ["PANDAS", "PYTHON", "CSV", "CLEANING"]
};

// We map domains to specific icons for the UI, but colors will come from the theme
const DOMAIN_ICONS: Record<string, any> = {
  "AIML": Brain,
  "Cybersecurity": Shield,
  "WebDev": Code,
  "DataScience": Database,
  "Default": Cpu
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
export default function FinalDataSort({ theme, onComplete }: { theme: any, onComplete?: (metrics: any) => void }) {
  // Game State
  const [items, setItems] = useState<{ id: string, word: string, domain: string, zone: string, status: 'idle' | 'correct' | 'wrong' }[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // --- ML TELEMETRY TRACKERS ---
  const startTime = useRef<number>(0);
  const dragCount = useRef<number>(0);
  const [finalMetrics, setFinalMetrics] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Game Data (Pick 2 random words from each domain)
  useEffect(() => {
    const generatedItems: any[] = [];
    const availableDomains = Object.keys(WORD_BANKS);
    
    availableDomains.forEach(domainId => {
      const shuffled = [...WORD_BANKS[domainId]].sort(() => 0.5 - Math.random()).slice(0, 2);
      shuffled.forEach(word => {
        generatedItems.push({ id: `${domainId}-${word}`, word, domain: domainId, zone: "pool", status: 'idle' });
      });
    });
    // Shuffle the final pool
    setItems(generatedItems.sort(() => 0.5 - Math.random()));
    startTime.current = Date.now();
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
        if (!isCorrect && containerRef.current) {
          gsap.fromTo(containerRef.current, { x: -10 }, { x: 0, duration: 0.3, ease: "elastic.out(2, 0.1)" });
        }
      }
    }

    if (allCorrect) {
      const timeTaken = (Date.now() - startTime.current) / 1000;
      const totalItems = items.length;
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
  const availableDomains = Object.keys(WORD_BANKS);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[800px] flex items-center justify-center font-sans">
      
      {/* Audio Toggle */}
      <button onClick={() => setAudioEnabled(!audioEnabled)} className="absolute top-4 right-4 z-50 p-2 bg-white/5 backdrop-blur-md rounded-full hover:bg-white/10 transition-colors border border-white/10">
        <Volume2 className={`w-5 h-5 ${audioEnabled ? 'opacity-100' : 'opacity-30 line-through'}`} style={{ color: theme.primary }} />
      </button>

      {/* Main Game UI */}
      <div className="relative z-10 w-full max-w-5xl mx-4 flex flex-col gap-4">
        
        {/* Header */}
        <div className="backdrop-blur-xl p-4 rounded-3xl shadow-xl flex justify-between items-center px-8 border" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
          <div>
            <h2 className="font-bold text-2xl tracking-widest text-white" style={{ fontFamily: theme.fontPrimary }}>DATA SORT</h2>
            <p className="text-sm font-mono mt-1" style={{ color: theme.primary }}>Drag the packets into their correct subsystem.</p>
          </div>
          {isPoolEmpty && !evaluating && !gameWon && (
            <motion.button 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              onClick={handleVerify}
              className="font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-transform hover:scale-105 text-gray-900"
              style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
            >
              <RefreshCcw className="w-5 h-5" /> VERIFY SORT
            </motion.button>
          )}
        </div>

        {/* Tier Maker Grid */}
        <div className="flex flex-col gap-3 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
          {availableDomains.map((domainId) => {
            const domainItems = items.filter(i => i.zone === domainId);
            const Icon = DOMAIN_ICONS[domainId] || DOMAIN_ICONS["Default"];
            
            return (
              <div key={domainId} className="flex min-h-[80px] rounded-2xl overflow-hidden border shadow-inner" style={{ backgroundColor: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.05)" }}>
                {/* Tier Label */}
                <div className="w-32 flex flex-col items-center justify-center text-center p-2 shadow-lg z-10" style={{ backgroundColor: `${theme.primary}20`, borderRight: `1px solid ${theme.primary}50` }}>
                  <Icon className="w-6 h-6 mb-1 opacity-80" style={{ color: theme.primary }} />
                  <span className="text-white font-bold text-xs tracking-widest uppercase">{domainId}</span>
                </div>
                
                {/* Drop Zone */}
                <div 
                  className="flex-1 p-3 flex flex-wrap gap-3 items-center transition-colors duration-300 relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, domainId)}
                >
                  {domainItems.length === 0 && (
                     <span className="font-mono text-sm absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.2)" }}>Drop {domainId} packets here...</span>
                  )}
                  <AnimatePresence>
                    {domainItems.map(item => (
                      <DraggableChip key={item.id} item={item} onDragStart={handleDragStart} evaluating={evaluating} theme={theme} />
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
            className="min-h-[120px] backdrop-blur-xl border-2 border-dashed rounded-3xl p-6 shadow-2xl transition-colors duration-300"
            style={{ 
              backgroundColor: theme.cardBg, 
              borderColor: isPoolEmpty ? "rgba(255,255,255,0.1)" : `${theme.primary}50` 
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "pool")}
          >
             <div className="flex flex-wrap gap-4 justify-center items-center h-full">
                <AnimatePresence>
                  {poolItems.map(item => (
                    <DraggableChip key={item.id} item={item} onDragStart={handleDragStart} evaluating={evaluating} theme={theme} />
                  ))}
                </AnimatePresence>
                {isPoolEmpty && <span className="font-mono font-bold" style={{ color: `${theme.primary}80` }}>POOL EMPTY - READY TO VERIFY</span>}
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
              <div className="border p-10 rounded-3xl text-center max-w-md shadow-2xl" style={{ backgroundColor: theme.cardBg, borderColor: `${theme.success}50`, boxShadow: `0 0 50px ${theme.success}30` }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: "spring", damping: 15 }} className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${theme.success}20` }}>
                  <CheckCircle2 className="w-12 h-12" style={{ color: theme.success }} />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-widest" style={{ fontFamily: theme.fontPrimary }}>DATABASE SORTED</h2>
                <p className="text-gray-400 mb-8">All subsystems correctly classified.</p>
                
                <button 
                  onClick={() => onComplete && onComplete(finalMetrics)} 
                  className="w-full font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.03] shadow-lg text-gray-900"
                  style={{ background: `linear-gradient(90deg, ${theme.success}, ${theme.primary})` }}
                >
                  Next Challenge <ChevronRight className="w-5 h-5" />
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
function DraggableChip({ item, onDragStart, evaluating, theme }: { item: any, onDragStart: any, evaluating: boolean, theme: any }) {
  
  // Dynamic styling based on evaluation status
  let currentStyles = {
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#e5e7eb",
    borderColor: "rgba(255,255,255,0.1)",
    boxShadow: "none"
  };

  if (item.status === 'correct') {
    currentStyles = {
      backgroundColor: theme.success,
      color: "#000",
      borderColor: theme.success,
      boxShadow: `0 0 15px ${theme.success}80`
    };
  } else if (item.status === 'wrong') {
    currentStyles = {
      backgroundColor: theme.danger,
      color: "#fff",
      borderColor: theme.danger,
      boxShadow: `0 0 15px ${theme.danger}80`
    };
  }

  return (
    <motion.div
      layout // This is the magic Framer Motion prop that glides it between lists!
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      whileHover={!evaluating && item.status !== 'correct' ? { 
        scale: 1.05, 
        borderColor: theme.primary, 
        boxShadow: `0 0 10px ${theme.primary}50` 
      } : {}}
      whileTap={!evaluating ? { scale: 0.95 } : {}}
      draggable={!evaluating && item.status !== 'correct'}
      onDragStart={(e: any) => onDragStart(e, item.id)}
      className={`px-4 py-2 rounded-lg font-bold text-sm tracking-wider border-2 transition-colors duration-300 ${evaluating ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'}`}
      style={currentStyles}
    >
      {item.word}
    </motion.div>
  );
}