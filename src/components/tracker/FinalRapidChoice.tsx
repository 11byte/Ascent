"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ChevronRight, X, Heart, Zap } from "lucide-react";

// --- 1. Predefined Task Banks ---
// We show quick tasks. The user swipes right if they'd enjoy doing it, left if not.
const TASKS = [
  { id: 1, text: "Design a sleek User Interface", domain: "WebDev" },
  { id: 2, text: "Hunt for network vulnerabilities", domain: "Cybersecurity" },
  { id: 3, text: "Train a Deep Learning Model", domain: "AIML" },
  { id: 4, text: "Clean and organize massive CSV files", domain: "DataScience" },
  { id: 5, text: "Write complex API logic", domain: "WebDev" },
  { id: 6, text: "Reverse engineer a malware sample", domain: "Cybersecurity" },
  { id: 7, text: "Tweak algorithm hyperparameters", domain: "AIML" },
  { id: 8, text: "Plot statistical data trends", domain: "DataScience" }
].sort(() => 0.5 - Math.random()); // Shuffle on load

// --- 2. Custom Audio Engine ---
const AudioEngine = {
  playStamp: () => {
    if (typeof window === "undefined") return;
    try {
      const audio = new Audio("/tracker/stampeffect.mp3");
      audio.volume = 0.6;
      audio.play().catch(() => {
        // Fallback synthetic "thud"
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
      });
    } catch (e) {}
  }
};

// --- 3. Main Game Component ---
export default function FinalRapidChoice({ theme, onComplete }: { theme: any, onComplete?: (metrics: any) => void }) {
  const [cards, setCards] = useState(TASKS);
  const [results, setResults] = useState<{ domain: string, liked: boolean }[]>([]);
  const [gameWon, setGameWon] = useState(false);
  
  // --- ML TELEMETRY TRACKERS ---
  const lastSwipe = useRef<number>(0);
  const decisionTimes = useRef<number[]>([]);
  const [finalMetrics, setFinalMetrics] = useState<any>(null);

  // Set initial time for first decision
  useEffect(() => {
    lastSwipe.current = Date.now();
  }, []);

  // Handle a completed swipe
  const handleSwipe = (direction: "left" | "right", task: typeof TASKS[0]) => {
    AudioEngine.playStamp();
    
    // TRACK DECISION SPEED
    const currentTime = Date.now();
    const timeTaken = (currentTime - lastSwipe.current) / 1000;
    decisionTimes.current.push(timeTaken);
    lastSwipe.current = currentTime; // Reset for next card
    
    // Save the result
    const newResults = [...results, { domain: task.domain, liked: direction === "right" }];
    setResults(newResults);
    
    // Remove the top card
    setCards(prev => prev.slice(1));

    // If no cards left, trigger victory sequence
    if (cards.length <= 1) {
      // COMPILE FINAL ML METRICS
      const avgSpeed = decisionTimes.current.reduce((a, b) => a + b, 0) / decisionTimes.current.length;
      
      // Calculate choice pattern (+1 for like, -1 for nope)
      const pattern = newResults.reduce((acc: any, curr) => {
        if (acc[curr.domain] === undefined) acc[curr.domain] = 0;
        acc[curr.domain] += curr.liked ? 1 : -1;
        return acc;
      }, { WebDev: 0, Cybersecurity: 0, AIML: 0, DataScience: 0 }); // Pre-fill with zeros

      setFinalMetrics({
        avg_decision_sec: Number(avgSpeed.toFixed(2)),
        choice_pattern: pattern
      });

      setTimeout(() => setGameWon(true), 600);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col items-center justify-center font-sans overflow-hidden z-10">
      
      {/* Header UI */}
      <div className="absolute top-8 w-full max-w-md mx-auto z-20 px-4 text-center">
        <h2 className="font-bold text-3xl tracking-widest text-white drop-shadow-md" style={{ fontFamily: theme.fontPrimary }}>
          RAPID CHOICE
        </h2>
        <p className="font-semibold backdrop-blur-xl rounded-full py-2 px-6 inline-block mt-3 border shadow-xl text-sm" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, color: '#e5e7eb' }}>
          Trust your gut. Swipe <span style={{ color: theme.success }} className="font-bold">Right</span> or <span style={{ color: theme.danger }} className="font-bold">Left</span>.
        </p>
      </div>

      {/* Card Deck Area */}
      <div className="relative w-full max-w-sm h-[400px] flex items-center justify-center z-10 mt-10">
        <AnimatePresence>
          {!gameWon && cards.map((task, index) => {
            // Only render the top 3 cards for performance and visual stacking effect
            if (index > 2) return null;
            return (
              <SwipeCard 
                key={task.id} 
                task={task} 
                index={index} 
                theme={theme}
                onSwipe={(dir) => handleSwipe(dir, task)} 
              />
            );
          }).reverse()} {/* Reverse so index 0 is on top */}
        </AnimatePresence>
      </div>

      {/* Victory / Analysis Screen */}
      <AnimatePresence>
        {gameWon && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} 
            className="absolute z-50 flex items-center justify-center w-full"
          >
            <div className="border p-10 rounded-3xl text-center max-w-md w-full mx-4 shadow-2xl backdrop-blur-xl" style={{ backgroundColor: theme.cardBg, borderColor: `${theme.primary}50`, boxShadow: `0 0 60px ${theme.primary}30` }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }} className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${theme.primary}20` }}>
                <Zap className="w-10 h-10" style={{ color: theme.primary }} />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-widest" style={{ fontFamily: theme.fontPrimary }}>PROFILE SYNCED</h2>
              <p className="text-gray-400 mb-8">Your behavioral preferences have been logged.</p>
              
              <button 
                onClick={() => onComplete ? onComplete(finalMetrics) : alert(`Metrics Data:\n${JSON.stringify(finalMetrics, null, 2)}`)} 
                className="w-full font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.03] shadow-lg text-gray-900"
                style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
              >
                Finalize Calibration <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- 4. Draggable Tinder Card Component ---
function SwipeCard({ task, index, theme, onSwipe }: { task: any, index: number, theme: any, onSwipe: (dir: "left" | "right") => void }) {
  const isTopCard = index === 0;
  
  // Motion Values for physical dragging
  const x = useMotionValue(0);
  // Rotate the card slightly as it moves left/right
  const rotate = useTransform(x, [-200, 200], [-15, 15]); 
  
  // Fade in the stamps based on drag distance
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 100; // How far they have to drag to trigger a swipe
    const velocity = info.velocity.x;

    // Swipe Right
    if (info.offset.x > swipeThreshold || velocity > 500) {
      onSwipe("right");
    } 
    // Swipe Left
    else if (info.offset.x < -swipeThreshold || velocity < -500) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      className="absolute w-[320px] h-[420px] rounded-3xl shadow-2xl flex flex-col justify-center items-center p-8 text-center cursor-grab active:cursor-grabbing border origin-bottom backdrop-blur-3xl"
      style={{
        x: isTopCard ? x : 0,
        rotate: isTopCard ? rotate : 0,
        zIndex: 10 - index,
        // Stack effect: lower cards are slightly smaller and lower down
        scale: 1 - index * 0.05,
        top: index * 15,
        opacity: 1 - index * 0.2,
        backgroundColor: theme.cardBg,
        borderColor: theme.cardBorder,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      }}
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }} // Snap back to center if not thrown far enough
      onDragEnd={handleDragEnd}
      initial={{ scale: 0, y: 50 }}
      animate={{ scale: 1 - index * 0.05, y: 0 }}
      exit={{ x: x.get() > 0 ? 500 : -500, opacity: 0, transition: { duration: 0.3 } }} // Fly off screen when removed
    >
      
      {/* Visual Stamps (Visible only when dragging) */}
      <motion.div 
        className="absolute top-12 right-6 z-20 pointer-events-none rotate-[15deg]"
        style={{ opacity: likeOpacity }}
      >
        <div className="border-4 font-bold text-3xl py-2 px-4 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-xl tracking-widest"
             style={{ borderColor: theme.success, color: theme.success, backgroundColor: `${theme.success}10`, fontFamily: theme.fontPrimary }}>
          APPROVE
        </div>
      </motion.div>

      <motion.div 
        className="absolute top-12 left-6 z-20 pointer-events-none rotate-[-15deg]"
        style={{ opacity: dislikeOpacity }}
      >
        <div className="border-4 font-bold text-3xl py-2 px-4 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-xl tracking-widest"
             style={{ borderColor: theme.danger, color: theme.danger, backgroundColor: `${theme.danger}10`, fontFamily: theme.fontPrimary }}>
          REJECT
        </div>
      </motion.div>


      {/* Card Content */}
      <div className="text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest pointer-events-none border" style={{ backgroundColor: `${theme.primary}10`, color: theme.primary, borderColor: `${theme.primary}30` }}>
        Task Simulation
      </div>
      
      <h3 className="text-2xl font-bold text-white pointer-events-none leading-relaxed">
        {task.text}
      </h3>

      {/* Helper Icons at bottom of card */}
      <div className="absolute bottom-8 w-full px-8 flex justify-between pointer-events-none opacity-80">
        <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg" style={{ borderColor: theme.danger, color: theme.danger, backgroundColor: `${theme.danger}20` }}>
          <X className="w-6 h-6" />
        </div>
        <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg" style={{ borderColor: theme.success, color: theme.success, backgroundColor: `${theme.success}20` }}>
          <Heart className="w-6 h-6" />
        </div>
      </div>
      
    </motion.div>
  );
}