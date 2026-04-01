"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, ChevronRight, Volume2, Search, AlertTriangle } from "lucide-react";

// --- 1. Predefined Word Banks ---
const WORD_BANKS: Record<string, string[]> = {
  "AIML": ["TENSOR", "NEURAL", "MODEL", "DATA", "LOGIC", "TRAIN", "BRAIN", "VISION", "EPOCH", "GPU"],
  "Cybersecurity": ["HACK", "SECURE", "LOCK", "VIRUS", "NODE", "PORT", "WALL", "CYBER", "PHISH", "DDOS"],
  "WebDev": ["REACT", "CODE", "HTML", "CSS", "HOOK", "DOM", "ROUTE", "API", "FLEX", "GRID"],
  "DataScience": ["PANDAS", "PLOT", "GRAPH", "MEAN", "MATH", "CHART", "STATS", "CSV", "CLEAN", "SCIPY"]
};

// --- 2. Custom Audio Engine ---
const AudioEngine = {
  playHover: () => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  },
  playSuccess: () => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle"; osc.frequency.setValueAtTime(600, ctx.currentTime);
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
// UPDATED: onComplete expects the ML metrics payload
export default function FinalOddManOut({ onComplete }: { onComplete?: (metrics: any) => void }) {
  // Game State
  const [options, setOptions] = useState<{ id: string, word: string, domain: string, isOdd: boolean, state: 'idle' | 'correct' | 'wrong' | 'fade' }[]>([]);
  const [score, setScore] = useState(0);
  const [targetScore] = useState(5); // Win after 5 correct rounds
  const [gameWon, setGameWon] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Prevents clicking during transitions
  
  // --- ADDED: ML TELEMETRY TRACKERS ---
  const roundStart = useRef<number>(0);
  const stats = useRef({ time: 0, clicks: 0, misclicks: 0 });
  const [finalMetrics, setFinalMetrics] = useState<any>(null);

  const bgContainerRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);

  // Background Parallax
  useGSAP(() => {
    gsap.to(groundRef.current, { backgroundPositionX: "1301px", duration: 20, ease: "none", repeat: -1, force3D: true });
    gsap.to(cloudsRef.current, { backgroundPositionX: "-2247px", duration: 52, ease: "none", repeat: -1, force3D: true });
  }, []);

  // --- Round Generator ---
  const generateRound = useCallback(() => {
    setIsProcessing(false);
    
    // --- ADDED: Reset the reaction timer for the new round ---
    roundStart.current = Date.now();

    const domains = Object.keys(WORD_BANKS);
    
    // 1. Pick a "Base" Domain (Majority)
    const baseDomain = domains[Math.floor(Math.random() * domains.length)];
    
    // 2. Pick an "Odd" Domain (Minority)
    let oddDomain = domains[Math.floor(Math.random() * domains.length)];
    while (oddDomain === baseDomain) {
      oddDomain = domains[Math.floor(Math.random() * domains.length)];
    }

    // 3. Select 3 words from Base, 1 word from Odd
    const baseWords = [...WORD_BANKS[baseDomain]].sort(() => 0.5 - Math.random()).slice(0, 3);
    const oddWord = [...WORD_BANKS[oddDomain]].sort(() => 0.5 - Math.random())[0];

    // 4. Combine and Shuffle
    const newOptions = [
      ...baseWords.map((w, i) => ({ id: `base-${i}-${Date.now()}`, word: w, domain: baseDomain, isOdd: false, state: 'idle' as const })),
      { id: `odd-${Date.now()}`, word: oddWord, domain: oddDomain, isOdd: true, state: 'idle' as const }
    ].sort(() => 0.5 - Math.random());

    setOptions(newOptions);
  }, []);

  // Initialize first round
  useEffect(() => {
    generateRound();
  }, [generateRound]);

  // --- Interaction Logic ---
  const handleSelect = (selectedId: string, isOdd: boolean) => {
    if (isProcessing) return;
    
    // --- ADDED: TRACK REACTION TIME & CLICKS ---
    const timeTaken = (Date.now() - roundStart.current) / 1000;
    stats.current.time += timeTaken;
    stats.current.clicks += 1;

    if (isOdd) {
      // SUCCESS
      setIsProcessing(true);
      if (audioEnabled) AudioEngine.playSuccess();
      
      setOptions(prev => prev.map(opt => ({
        ...opt,
        state: opt.id === selectedId ? 'correct' : 'fade' // Highlight winner, fade losers
      })));

      setScore(s => s + 1);

      if (score + 1 >= targetScore) {
        // --- ADDED: COMPILE ML METRICS ON WIN ---
        const accuracy = (targetScore / stats.current.clicks) * 100;
        
        setFinalMetrics({
          avg_reaction_sec: Number((stats.current.time / stats.current.clicks).toFixed(2)),
          accuracy_pct: Number(accuracy.toFixed(2)),
          misclicks: stats.current.misclicks
        });

        setTimeout(() => setGameWon(true), 800);
      } else {
        setTimeout(generateRound, 1000); // Load next round after delay
      }
    } else {
      // WRONG
      // --- ADDED: TRACK MISCLICKS ---
      stats.current.misclicks += 1;

      if (audioEnabled) AudioEngine.playError();
      
      setOptions(prev => prev.map(opt => ({
        ...opt,
        state: opt.id === selectedId ? 'wrong' : opt.state // Mark as wrong
      })));

      // Screen shake
      if (bgContainerRef.current) {
        gsap.fromTo(bgContainerRef.current, { x: -10 }, { x: 0, duration: 0.4, ease: "elastic.out(2, 0.1)" });
      }

      // Reset wrong state after a second so they can try again
      setTimeout(() => {
        setOptions(prev => prev.map(opt => ({
          ...opt,
          state: opt.state === 'wrong' ? 'idle' : opt.state
        })));
      }, 600);
    }
  };

  return (
    <div ref={bgContainerRef} className="relative w-full h-screen min-h-[700px] bg-[#63D0FF] overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* Background Layers */}
      <div ref={cloudsRef} className="absolute top-0 left-0 w-full h-[230px] z-0 pointer-events-none" style={{ backgroundImage: 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/56901/bg-clouds2-tinypng.png")', backgroundRepeat: 'repeat-x', backgroundPosition: '0 bottom' }} />
      <div ref={groundRef} className="absolute bottom-0 left-0 w-full h-[192px] z-0 pointer-events-none" style={{ backgroundImage: 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/56901/grass_tile-tinypng.png")', backgroundRepeat: 'repeat-x', backgroundPosition: '0 0' }} />

      {/* Audio Toggle */}
      <button onClick={() => setAudioEnabled(!audioEnabled)} className="absolute top-6 right-6 z-50 p-3 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition-colors border border-white/20 text-white">
        <Volume2 className={`w-6 h-6 ${audioEnabled ? 'opacity-100' : 'opacity-30 line-through'}`} />
      </button>

      {/* Main Game Area */}
      <div className="relative z-10 w-full max-w-2xl mx-4 flex flex-col items-center">
        
        {/* Header HUD */}
        {!gameWon && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex justify-between items-end mb-8 px-4">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl">
              <h2 className="text-white font-bold text-2xl font-[Orbitron] tracking-widest flex items-center gap-2">
                <Search className="text-cyan-400 w-6 h-6" /> ANOMALY DETECT
              </h2>
              <p className="text-cyan-300/70 text-sm font-mono mt-1">Isolate the odd packet out.</p>
            </div>
            
            <div className="bg-gray-900/80 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-2xl shadow-xl text-center">
              <p className="text-xs text-gray-400 font-bold tracking-widest mb-1">ROUNDS</p>
              <p className="text-2xl font-bold font-[Orbitron] text-white">
                <span className="text-cyan-400">{score}</span> / {targetScore}
              </p>
            </div>
          </motion.div>
        )}

        {/* The 2x2 Grid */}
        {!gameWon && (
          <div className="grid grid-cols-2 gap-4 w-full max-w-[500px]">
            <AnimatePresence mode="popLayout">
              {options.map((opt, index) => {
                
                // Dynamic styling based on state
                let cardStyle = "bg-gray-900/60 border-white/20 text-white hover:bg-white/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]";
                if (opt.state === 'correct') cardStyle = "bg-green-500 border-green-400 text-gray-900 shadow-[0_0_30px_rgba(34,197,94,0.6)] scale-105 z-10";
                if (opt.state === 'wrong') cardStyle = "bg-red-600 border-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)]";
                if (opt.state === 'fade') cardStyle = "bg-gray-900/20 border-white/5 text-gray-600 scale-95 opacity-40 blur-[2px] pointer-events-none";

                return (
                  <motion.button
                    key={opt.id}
                    layoutId={opt.id} // Keeps animation smooth if order changes
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ 
                      opacity: opt.state === 'fade' ? 0.4 : 1, 
                      scale: opt.state === 'correct' ? 1.05 : opt.state === 'fade' ? 0.95 : 1, 
                      y: 0 
                    }}
                    exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05, // Stagger entrance
                      type: "spring", stiffness: 300, damping: 20 
                    }}
                    onMouseEnter={() => { if(audioEnabled && !isProcessing) AudioEngine.playHover(); }}
                    onClick={() => handleSelect(opt.id, opt.isOdd)}
                    disabled={isProcessing}
                    className={`relative w-full aspect-video rounded-3xl backdrop-blur-xl border-2 flex items-center justify-center transition-colors duration-300 group overflow-hidden ${cardStyle}`}
                  >
                    {/* Glass glare effect */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    
                    <span className="text-xl md:text-2xl font-bold tracking-widest drop-shadow-md">
                      {opt.word}
                    </span>

                    {/* Alert icon for wrong answer */}
                    {opt.state === 'wrong' && (
                      <AlertTriangle className="absolute top-3 right-3 w-5 h-5 text-red-200 animate-ping" />
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Victory Screen */}
        <AnimatePresence>
          {gameWon && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} 
              className="absolute z-50 flex items-center justify-center w-full"
            >
              <div className="bg-gray-900 border border-green-500/50 p-10 rounded-3xl shadow-[0_0_60px_rgba(34,197,94,0.3)] text-center w-full max-w-md">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: "spring", damping: 15 }} className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2 font-[Orbitron]">ANOMALIES CLEARED</h2>
                <p className="text-green-200/70 mb-8">You successfully identified all rogue data packets.</p>
                
                {/* --- ADDED: Pass finalMetrics to parent Controller --- */}
                <button 
                  onClick={() => onComplete ? onComplete(finalMetrics) : alert(`Metrics Data:\n${JSON.stringify(finalMetrics, null, 2)}`)} 
                  className="w-full group bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-300 hover:to-cyan-400 text-gray-900 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.03] shadow-lg"
                >
                  Complete Assessment <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}