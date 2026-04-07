"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
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
export default function FinalOddManOut({ theme, onComplete }: { theme: any, onComplete?: (metrics: any) => void }) {
  // Game State
  const [options, setOptions] = useState<{ id: string, word: string, domain: string, isOdd: boolean, state: 'idle' | 'correct' | 'wrong' | 'fade' }[]>([]);
  const [score, setScore] = useState(0);
  const [targetScore] = useState(5); // Win after 5 correct rounds
  const [gameWon, setGameWon] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Prevents clicking during transitions
  
  // --- ML TELEMETRY TRACKERS ---
  const roundStart = useRef<number>(0);
  const stats = useRef({ time: 0, clicks: 0, misclicks: 0 });
  const [finalMetrics, setFinalMetrics] = useState<any>(null);

  const bgContainerRef = useRef<HTMLDivElement>(null);

  // --- Round Generator ---
  const generateRound = useCallback(() => {
    setIsProcessing(false);
    
    // Reset the reaction timer for the new round
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
    
    // TRACK REACTION TIME & CLICKS
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
        // COMPILE ML METRICS ON WIN
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
      // WRONG (MISCLICK)
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
    <div ref={bgContainerRef} className="relative w-full h-full min-h-[700px] flex flex-col items-center justify-center font-sans overflow-hidden z-10">
      
      {/* Audio Toggle */}
      <button onClick={() => setAudioEnabled(!audioEnabled)} className="absolute top-4 right-4 z-50 p-2 bg-white/5 backdrop-blur-md rounded-full hover:bg-white/10 transition-colors border border-white/10">
        <Volume2 className={`w-5 h-5 ${audioEnabled ? 'opacity-100' : 'opacity-30 line-through'}`} style={{ color: theme.primary }} />
      </button>

      {/* Main Game Area */}
      <div className="relative z-10 w-full max-w-2xl mx-4 flex flex-col items-center mt-10">
        
        {/* Header HUD */}
        {!gameWon && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex justify-between items-end mb-8 px-4">
            <div className="backdrop-blur-xl border p-4 rounded-2xl shadow-xl" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
              <h2 className="text-white font-bold text-2xl tracking-widest flex items-center gap-2" style={{ fontFamily: theme.fontPrimary }}>
                <Search className="w-6 h-6" style={{ color: theme.primary }} /> ANOMALY DETECT
              </h2>
              <p className="text-sm font-mono mt-1 opacity-80" style={{ color: theme.primary }}>Isolate the odd packet out.</p>
            </div>
            
            <div className="backdrop-blur-xl border px-6 py-4 rounded-2xl shadow-xl text-center" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
              <p className="text-xs text-gray-400 font-bold tracking-widest mb-1">ROUNDS</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: theme.fontPrimary }}>
                <span style={{ color: theme.primary }}>{score}</span> / {targetScore}
              </p>
            </div>
          </motion.div>
        )}

        {/* The 2x2 Grid */}
        {!gameWon && (
          <div className="grid grid-cols-2 gap-4 w-full max-w-[500px]">
            <AnimatePresence mode="popLayout">
              {options.map((opt, index) => {
                
                // Dynamic styling based on state and theme
                let currentStyles: React.CSSProperties = {
                  backgroundColor: "rgba(0,0,0,0.4)",
                  borderColor: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  boxShadow: "none",
                  opacity: 1,
                  transform: "scale(1)"
                };

                if (opt.state === 'correct') {
                  currentStyles = {
                    backgroundColor: theme.success,
                    borderColor: theme.success,
                    color: "#000",
                    boxShadow: `0 0 30px ${theme.success}80`,
                    zIndex: 10
                  };
                } else if (opt.state === 'wrong') {
                  currentStyles = {
                    backgroundColor: theme.danger,
                    borderColor: theme.danger,
                    color: "#fff",
                    boxShadow: `0 0 30px ${theme.danger}80`
                  };
                } else if (opt.state === 'fade') {
                  currentStyles = {
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderColor: "rgba(255,255,255,0.05)",
                    color: "#666",
                    opacity: 0.4,
                    filter: "blur(2px)",
                    pointerEvents: "none"
                  };
                }

                return (
                  <motion.button
                    key={opt.id}
                    layoutId={opt.id} // Keeps animation smooth if order changes
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ 
                      opacity: currentStyles.opacity, 
                      scale: opt.state === 'correct' ? 1.05 : opt.state === 'fade' ? 0.95 : 1, 
                      y: 0 
                    }}
                    exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05, // Stagger entrance
                      type: "spring", stiffness: 300, damping: 20 
                    }}
                    onMouseEnter={() => { 
                      if(audioEnabled && !isProcessing) AudioEngine.playHover(); 
                      // Apply hover styles programmatically if idle
                      if(opt.state === 'idle') {
                         const el = document.getElementById(opt.id);
                         if(el) {
                           el.style.borderColor = theme.primary;
                           el.style.boxShadow = `0 0 20px ${theme.primary}50`;
                           el.style.backgroundColor = "rgba(255,255,255,0.05)";
                         }
                      }
                    }}
                    onMouseLeave={() => {
                      // Remove hover styles if idle
                      if(opt.state === 'idle') {
                         const el = document.getElementById(opt.id);
                         if(el) {
                           el.style.borderColor = "rgba(255,255,255,0.1)";
                           el.style.boxShadow = "none";
                           el.style.backgroundColor = "rgba(0,0,0,0.4)";
                         }
                      }
                    }}
                    onClick={() => handleSelect(opt.id, opt.isOdd)}
                    disabled={isProcessing}
                    id={opt.id}
                    className="relative w-full aspect-video rounded-3xl backdrop-blur-xl border-2 flex items-center justify-center transition-all duration-300 group overflow-hidden"
                    style={currentStyles}
                  >
                    {/* Glass glare effect */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    
                    <span className="text-xl md:text-2xl font-bold tracking-widest drop-shadow-md">
                      {opt.word}
                    </span>

                    {/* Alert icon for wrong answer */}
                    {opt.state === 'wrong' && (
                      <AlertTriangle className="absolute top-3 right-3 w-5 h-5 text-white animate-ping" />
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
              className="absolute inset-0 z-50 flex items-center justify-center w-full"
            >
              <div className="border p-10 rounded-3xl text-center w-full max-w-md shadow-2xl" style={{ backgroundColor: theme.cardBg, borderColor: `${theme.success}50`, boxShadow: `0 0 60px ${theme.success}30` }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: "spring", damping: 15 }} className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${theme.success}20` }}>
                  <CheckCircle2 className="w-12 h-12" style={{ color: theme.success }} />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-widest" style={{ fontFamily: theme.fontPrimary }}>ANOMALIES CLEARED</h2>
                <p className="text-gray-400 mb-8">You successfully identified all rogue data packets.</p>
                
                <button 
                  onClick={() => onComplete ? onComplete(finalMetrics) : alert(`Metrics Data:\n${JSON.stringify(finalMetrics, null, 2)}`)} 
                  className="w-full font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.03] shadow-lg text-gray-900"
                  style={{ background: `linear-gradient(90deg, ${theme.success}, ${theme.primary})` }}
                >
                  Complete Assessment <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}