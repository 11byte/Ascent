"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Volume2, Search, AlertTriangle } from "lucide-react";

type TrackerTheme = {
  primary: string;
  success: string;
  danger: string;
  cardBg: string;
  cardBorder: string;
  fontPrimary: string;
};

type OddManOutMetrics = {
  avg_reaction_sec: number;
  accuracy_pct: number;
  misclicks: number;
};

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
      const AudioCtx = window.AudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.05);
    } catch {}
  },
  playSuccess: () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle"; osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch {}
  },
  playError: () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth"; osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }
};

// --- 3. Main Game Component ---
export default function FinalOddManOut({ theme, onComplete }: { theme: TrackerTheme, onComplete?: (metrics: OddManOutMetrics) => void }) {
  // Game State
  const [options, setOptions] = useState<{ id: string, word: string, domain: string, isOdd: boolean, state: 'idle' | 'correct' | 'wrong' | 'fade' }[]>([]);
  const [score, setScore] = useState(0);
  const [targetScore] = useState(5); // Win after 5 correct rounds
  const [isCompleting, setIsCompleting] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Prevents clicking during transitions
  
  // --- ML TELEMETRY TRACKERS ---
  const roundStart = useRef<number>(0);
  const stats = useRef({ time: 0, clicks: 0, misclicks: 0 });
  const bgContainerRef = useRef<HTMLDivElement>(null);
  const completionSentRef = useRef(false);

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

      const nextScore = score + 1;
      setScore(nextScore);

      if (nextScore >= targetScore) {
        // COMPILE ML METRICS ON WIN
        const accuracy = (targetScore / stats.current.clicks) * 100;
        const metrics = {
          avg_reaction_sec: Number((stats.current.time / stats.current.clicks).toFixed(2)),
          accuracy_pct: Number(accuracy.toFixed(2)),
          misclicks: stats.current.misclicks
        };

        setIsCompleting(true);

        // Auto-advance to telemetry dashboard step
        setTimeout(() => {
          if (!completionSentRef.current) {
            completionSentRef.current = true;
            onComplete?.(metrics);
          }
        }, 450);
      } else {
        // Faster round handoff to avoid delayed/game-feels-stuck perception
        setTimeout(generateRound, 350);
      }
    } else {
      // WRONG (MISCLICK)
      setIsProcessing(true);
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
        setIsProcessing(false);
      }, 600);
    }
  };

  return (
    <div ref={bgContainerRef} className="relative z-10 flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* Audio Toggle */}
      <button onClick={() => setAudioEnabled(!audioEnabled)} className="absolute top-4 right-4 z-50 p-2 bg-white/5 backdrop-blur-md rounded-full hover:bg-white/10 transition-colors border border-white/10">
        <Volume2 className={`w-5 h-5 ${audioEnabled ? 'opacity-100' : 'opacity-30 line-through'}`} style={{ color: theme.primary }} />
      </button>

      {/* Main Game Area */}
      <div className="relative z-10 mx-3 flex w-full max-w-2xl flex-col items-center md:mx-4">
        
        {/* Header HUD */}
        {!isCompleting && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-5 flex w-full items-end justify-between px-3 md:px-4">
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
        {!isCompleting && (
          <div className="grid w-full max-w-[500px] grid-cols-2 gap-3">
            <AnimatePresence>
              {options.map((opt) => {
                
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
                    initial={{ opacity: 0, scale: 0.92, y: 16 }}
                    animate={{ 
                      opacity: currentStyles.opacity, 
                      scale: opt.state === 'correct' ? 1.05 : opt.state === 'fade' ? 0.95 : 1, 
                      y: 0 
                    }}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.14 } }}
                    transition={{ 
                      duration: 0.16,
                      ease: "easeOut",
                    }}
                    whileHover={!isProcessing && opt.state === 'idle' ? {
                      scale: 1.03,
                      borderColor: theme.primary,
                      boxShadow: `0 0 20px ${theme.primary}50`,
                      backgroundColor: "rgba(255,255,255,0.05)",
                    } : {}}
                    whileTap={!isProcessing && opt.state === 'idle' ? { scale: 0.98 } : {}}
                    onMouseEnter={() => {
                      if (audioEnabled && !isProcessing && opt.state === 'idle') {
                        AudioEngine.playHover();
                      }
                    }}
                    onClick={() => handleSelect(opt.id, opt.isOdd)}
                    disabled={isProcessing}
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

        {/* Completion Overlay */}
        <AnimatePresence>
          {isCompleting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center"
            >
              <div
                className="rounded-3xl border px-8 py-6 text-center shadow-2xl backdrop-blur-2xl"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: `${theme.success}50`,
                  boxShadow: `0 0 40px ${theme.success}35`,
                }}
              >
                <p
                  className="text-sm uppercase tracking-[0.28em]"
                  style={{ color: theme.primary, fontFamily: theme.fontPrimary }}
                >
                  ANOMALY CLEARED
                </p>
                <p className="mt-2 text-gray-200">Syncing telemetry...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}