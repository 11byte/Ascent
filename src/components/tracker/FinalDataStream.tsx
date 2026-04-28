"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, ChevronRight, Volume2, Target } from "lucide-react";

// --- 1. Predefined Word Banks ---
const WORD_BANKS: Record<string, string[]> = {
  "AIML": ["TENSOR", "NEURAL", "MODEL", "DATA", "LOGIC", "TRAIN", "BRAIN", "VISION"],
  "Cybersecurity": ["HACK", "SECURE", "LOCK", "VIRUS", "NODE", "PORT", "WALL", "CYBER"],
  "WebDev": ["REACT", "CODE", "HTML", "NODE", "CSS", "HOOK", "DOM", "ROUTE"],
  "DataScience": ["PANDAS", "DATA", "PLOT", "GRAPH", "MEAN", "MATH", "CHART", "STATS"]
};

// --- 2. Custom Audio Engine ---
const AudioEngine = {
  playSpawn: () => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  },
  playPop: () => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  },
  playError: () => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  },
  speakWord: (word: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 1.3;
      utterance.pitch = 1.5;
      const voices = window.speechSynthesis.getVoices();
      const techVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Samantha"));
      if (techVoice) utterance.voice = techVoice;
      window.speechSynthesis.speak(utterance);
    }
  }
};

// --- 3. Main Game Component ---
export default function FinalDataStream({ 
  domain = "Cybersecurity", 
  theme, 
  onComplete 
}: { 
  domain?: string, 
  theme: any, 
  onComplete?: (metrics: any) => void 
}) {
  const [bubbles, setBubbles] = useState<{ id: string, word: string, isTarget: boolean, x: number, y: number }[]>([]);
  const [blasts, setBlasts] = useState<{ id: string, x: number, y: number, color: string }[]>([]);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const targetScore = 5; // Collect 5 correct packets to win
  
  // --- ML TELEMETRY TRACKERS ---
  const startTime = useRef<number>(0);
  const stats = useRef({ clicks: 0, misclicks: 0 });
  const [finalMetrics, setFinalMetrics] = useState<any>(null);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set the start time on mount for telemetry
  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  // Bubble Spawner Logic
  useEffect(() => {
    if (gameWon) return;

    const spawnBubble = () => {
      // 60% chance to spawn target domain word, 40% chance for decoy
      const isTarget = Math.random() > 0.4;
      
      let wordPool = [];
      if (isTarget) {
        wordPool = WORD_BANKS[domain] || WORD_BANKS["AIML"];
      } else {
        // Pick a random domain that ISN'T the target
        const otherDomains = Object.keys(WORD_BANKS).filter(d => d !== domain);
        const randomDomain = otherDomains[Math.floor(Math.random() * otherDomains.length)];
        wordPool = WORD_BANKS[randomDomain];
      }
      
      const word = wordPool[Math.floor(Math.random() * wordPool.length)];
      
      // Random position (Keep within 10% to 80% to avoid edge clipping)
      const x = 10 + Math.random() * 70;
      const y = 15 + Math.random() * 65;

      const newBubble = { id: Date.now() + Math.random().toString(), word, isTarget, x, y };
      
      setBubbles(prev => [...prev, newBubble]);
      if (audioEnabled) AudioEngine.playSpawn();

      // Auto-despawn bubble after 3.5 seconds
      setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
      }, 3500);
    };

    const interval = setInterval(spawnBubble, 1200); // Spawn every 1.2s
    return () => clearInterval(interval);
  }, [domain, gameWon, audioEnabled]);

  // Interaction Logic
  const handleBubbleClick = (bubble: any, e: React.MouseEvent) => {
    // Remove bubble immediately
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));

    // TRACK OVERALL CLICK
    stats.current.clicks += 1;

    // Calculate click coordinates relative to the game area for the blast effect
    const rect = gameAreaRef.current?.getBoundingClientRect();
    const blastX = e.clientX - (rect?.left || 0);
    const blastY = e.clientY - (rect?.top || 0);

    if (bubble.isTarget) {
      // SUCCESS
      if (audioEnabled) {
        AudioEngine.playPop();
        AudioEngine.speakWord(bubble.word);
      }
      setScore(s => {
        const newScore = s + 1;
        if (newScore >= targetScore) {
          
          // COMPILE METRICS ON WIN
          const timeTaken = (Date.now() - startTime.current) / 1000;
          const accuracy = ((stats.current.clicks - stats.current.misclicks) / stats.current.clicks) * 100;

          setFinalMetrics({
            avg_reaction_sec: Number((timeTaken / stats.current.clicks).toFixed(2)),
            misclicks: stats.current.misclicks,
            accuracy_pct: Number(accuracy.toFixed(2)),
            speed_sec: Number(timeTaken.toFixed(2))
          });

          setTimeout(() => setGameWon(true), 500);
        }
        return newScore;
      });
      // Add success blast using theme color
      setBlasts(prev => [...prev, { id: bubble.id, x: blastX, y: blastY, color: theme.primary }]);
    } else {
      // PENALTY / ERROR
      stats.current.misclicks += 1;

      if (audioEnabled) AudioEngine.playError();
      setScore(s => Math.max(0, s - 1)); // Penalty, but don't drop below 0
      
      // Screen shake for error
      if (containerRef.current) {
        gsap.fromTo(containerRef.current, { x: -10 }, { x: 0, duration: 0.3, ease: "elastic.out(2, 0.1)" });
      }
      // Add error blast using theme color
      setBlasts(prev => [...prev, { id: bubble.id, x: blastX, y: blastY, color: theme.danger }]);
    }
  };

  return (
    <div ref={containerRef} className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden font-sans">
      
      {/* Audio Toggle */}
      <button onClick={() => setAudioEnabled(!audioEnabled)} className="absolute top-4 right-4 z-50 p-2 bg-white/5 backdrop-blur-md rounded-full hover:bg-white/10 transition-colors border border-white/10">
        <Volume2 className={`w-5 h-5 ${audioEnabled ? 'opacity-100' : 'opacity-30 line-through'}`} style={{ color: theme.primary }} />
      </button>

      {/* Main Game UI */}
      <div 
        className="relative z-10 mx-3 h-[min(58vh,560px)] w-full max-w-4xl overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl md:mx-4" 
        ref={gameAreaRef}
        style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
      >
        
        {/* HUD (Heads Up Display) */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-20">
          <div className="backdrop-blur-xl border p-4 rounded-2xl shadow-lg" style={{ backgroundColor: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.1)" }}>
            <h2 className="font-bold tracking-widest text-sm mb-1 flex items-center gap-2" style={{ color: theme.primary }}>
              <Target className="w-4 h-4" /> TARGET DOMAIN
            </h2>
            <p className="text-white text-2xl font-bold" style={{ fontFamily: theme.fontPrimary }}>{domain.toUpperCase()}</p>
          </div>

          <div className="backdrop-blur-xl border p-4 rounded-2xl shadow-lg text-center min-w-[120px]" style={{ backgroundColor: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.1)" }}>
            <h2 className="text-gray-400 font-bold tracking-widest text-sm mb-1">SCORE</h2>
            <p className="text-3xl font-bold" style={{ fontFamily: theme.fontPrimary, color: score > 0 ? theme.success : "#fff" }}>
              {score} <span className="text-sm text-gray-500">/ {targetScore}</span>
            </p>
          </div>
        </div>

        {/* Playable Area */}
        {!gameWon && (
          <AnimatePresence>
            {bubbles.map(bubble => (
              <motion.button
                key={bubble.id}
                onClick={(e: any) => handleBubbleClick(bubble, e)}
                // Spawn Animation & Idle Blinking
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ 
                  opacity: [0, 1, 0.8, 1, 0.7, 1], // Flickering opacity
                  scale: [0, 1.1, 1, 1.05, 1],      // Pulsing scale
                  y: 0 
                }}
                transition={{ duration: 3.5, times: [0, 0.1, 0.4, 0.6, 0.8, 1], ease: "easeInOut" }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute flex items-center justify-center rounded-full cursor-pointer group hover:scale-110 active:scale-90 transition-transform"
                style={{ 
                  left: `${bubble.x}%`, 
                  top: `${bubble.y}%`,
                  width: '100px',
                  height: '100px',
                  // The Glass Bubble Look
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), rgba(255,255,255,0.05) 60%, rgba(255,255,255,0))',
                  backdropFilter: 'blur(8px)',
                  boxShadow: 'inset 0 0 20px rgba(255,255,255,0.2), 0 10px 20px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                {/* Glossy top-left highlight */}
                <div className="absolute top-2 left-3 w-4 h-2 bg-white/50 rounded-full rotate-[-45deg] blur-[1px]"></div>
                
                <span className="text-white font-bold text-sm tracking-wider drop-shadow-md z-10 px-2 text-center pointer-events-none">
                  {bubble.word}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        )}

        {/* Blast Particles (Rings expanding when clicked) */}
        {blasts.map(blast => (
          <motion.div
            key={blast.id}
            initial={{ scale: 0.5, opacity: 1, borderWidth: "8px" }}
            animate={{ scale: 3, opacity: 0, borderWidth: "1px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={() => setBlasts(prev => prev.filter(b => b.id !== blast.id))}
            className="absolute rounded-full pointer-events-none border-solid z-0"
            style={{ 
              left: blast.x - 40, // Centering the 80x80 ring on the mouse click
              top: blast.y - 40,
              width: '80px',
              height: '80px',
              borderColor: blast.color
            }}
          />
        ))}

        {/* Victory Screen */}
        <AnimatePresence>
          {gameWon && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <div className="border p-10 rounded-3xl text-center max-w-md shadow-2xl" style={{ backgroundColor: theme.cardBg, borderColor: `${theme.success}50`, boxShadow: `0 0 50px ${theme.success}30` }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: "spring", damping: 15 }} className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${theme.success}20` }}>
                  <CheckCircle2 className="w-12 h-12" style={{ color: theme.success }} />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-widest" style={{ fontFamily: theme.fontPrimary }}>DATA SECURED</h2>
                <p className="text-gray-400 mb-8">You successfully isolated the {domain} packets.</p>
                
                <button 
                  onClick={() => onComplete && onComplete(finalMetrics)} 
                  className="w-full font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg text-gray-900"
                  style={{ background: `linear-gradient(90deg, ${theme.success}, ${theme.primary})` }}
                >
                  Next Challenge 
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}