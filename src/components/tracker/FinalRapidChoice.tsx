"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, ChevronRight, X, Heart, Zap } from "lucide-react";

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
      // Plays the custom MP3 file you placed in the public folder
      const audio = new Audio("/tracker/stampeffect.mp3");
      audio.volume = 0.6;
      audio.play().catch(() => {
        // Fallback synthetic "thud" if mp3 is missing or blocked
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
// UPDATED: onComplete now expects the ML metrics payload
export default function FinalRapidChoice({ onComplete }: { onComplete?: (metrics: any) => void }) {
  const [cards, setCards] = useState(TASKS);
  const [results, setResults] = useState<{ domain: string, liked: boolean }[]>([]);
  const [gameWon, setGameWon] = useState(false);
  
  // --- ADDED: ML TELEMETRY TRACKERS ---
  const lastSwipe = useRef<number>(0);
  const decisionTimes = useRef<number[]>([]);
  const [finalMetrics, setFinalMetrics] = useState<any>(null);

  const bgContainerRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);

  // Background Parallax
  useGSAP(() => {
    gsap.to(groundRef.current, { backgroundPositionX: "1301px", duration: 20, ease: "none", repeat: -1, force3D: true });
    gsap.to(cloudsRef.current, { backgroundPositionX: "-2247px", duration: 52, ease: "none", repeat: -1, force3D: true });
  }, []);

  // --- ADDED: Set initial time for first decision ---
  useEffect(() => {
    lastSwipe.current = Date.now();
  }, []);

  // Handle a completed swipe
  const handleSwipe = (direction: "left" | "right", task: typeof TASKS[0]) => {
    AudioEngine.playStamp();
    
    // --- ADDED: TRACK DECISION SPEED ---
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
      // --- ADDED: COMPILE FINAL ML METRICS ---
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
    <div ref={bgContainerRef} className="relative w-full h-screen min-h-[700px] bg-[#63D0FF] overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* Parallax Background */}
      <div ref={cloudsRef} className="absolute top-0 left-0 w-full h-[230px] z-0 pointer-events-none" style={{ backgroundImage: 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/56901/bg-clouds2-tinypng.png")', backgroundRepeat: 'repeat-x', backgroundPosition: '0 bottom' }} />
      <div ref={groundRef} className="absolute bottom-0 left-0 w-full h-[192px] z-0 pointer-events-none" style={{ backgroundImage: 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/56901/grass_tile-tinypng.png")', backgroundRepeat: 'repeat-x', backgroundPosition: '0 0' }} />

      {/* Header UI */}
      <div className="absolute top-8 w-full max-w-md mx-auto z-20 px-4 text-center">
        <h2 className="text-gray-900 font-bold text-2xl font-[Orbitron] tracking-widest drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">RAPID CHOICE</h2>
        <p className="text-gray-800 font-semibold bg-white/40 backdrop-blur-md rounded-full py-1 px-4 inline-block mt-2 border border-white/50">
          Trust your gut. Swipe <span className="text-green-700 font-bold">Right</span> or <span className="text-red-700 font-bold">Left</span>.
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
            className="absolute z-50 flex items-center justify-center"
          >
            <div className="bg-gray-900 border border-cyan-500/50 p-10 rounded-3xl shadow-[0_0_60px_rgba(34,211,238,0.3)] text-center max-w-md w-full mx-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }} className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-cyan-400" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2 font-[Orbitron]">PROFILE SYNCED</h2>
              <p className="text-cyan-200/70 mb-8">Your behavioral preferences have been logged.</p>
              
              {/* --- ADDED: Pass the finalMetrics to the parent Controller when clicked --- */}
              <button 
                onClick={() => onComplete ? onComplete(finalMetrics) : alert(`Metrics Data:\n${JSON.stringify(finalMetrics, null, 2)}`)} 
                className="w-full group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-gray-900 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.03] shadow-lg"
              >
                Finalize Calibration <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- 4. Draggable Tinder Card Component ---
function SwipeCard({ task, index, onSwipe }: { task: any, index: number, onSwipe: (dir: "left" | "right") => void }) {
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
      className="absolute w-[320px] h-[420px] bg-white rounded-3xl shadow-2xl flex flex-col justify-center items-center p-8 text-center cursor-grab active:cursor-grabbing border-4 border-gray-100 origin-bottom"
      style={{
        x: isTopCard ? x : 0,
        rotate: isTopCard ? rotate : 0,
        zIndex: 10 - index,
        // Stack effect: lower cards are slightly smaller and lower down
        scale: 1 - index * 0.05,
        top: index * 15,
        opacity: 1 - index * 0.2
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
        className="absolute top-10 right-8 z-20 pointer-events-none rotate-[15deg]"
        style={{ opacity: likeOpacity }}
      >
        {/* We use .png assuming you want transparency. Change to .jpg if absolutely necessary */}
        <img src="/tracker/like.png" alt="LIKE" className="w-32 h-auto opacity-80 mix-blend-multiply" 
             onError={(e) => { e.currentTarget.style.display='none'; }} // Hide if image doesn't exist yet
        />
        {/* Fallback CSS stamp if image isn't loaded */}
        {/* <div className="absolute inset-0 border-4 border-green-500 text-green-500 font-bold text-4xl py-1 px-3 rounded-lg flex items-center justify-center -z-10 bg-white/50">
          LIKE
        </div> */}
      </motion.div>

      <motion.div 
        className="absolute top-10 left-8 z-20 pointer-events-none rotate-[-15deg]"
        style={{ opacity: dislikeOpacity }}
      >
        <img src="/tracker/dislike.png" alt="DISLIKE" className="w-32 h-auto opacity-80 mix-blend-multiply" 
             onError={(e) => { e.currentTarget.style.display='none'; }}
        />
        {/* Fallback CSS stamp if image isn't loaded */}
        {/* <div className="absolute inset-0 border-4 border-red-500 text-red-500 font-bold text-4xl py-1 px-3 rounded-lg flex items-center justify-center -z-10 bg-white/50">
          NOPE
        </div> */}
      </motion.div>


      {/* Card Content */}
      <div className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-widest pointer-events-none">
        Task Simulation
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 pointer-events-none">
        {task.text}
      </h3>

      {/* Helper Icons at bottom of card */}
      <div className="absolute bottom-6 w-full px-8 flex justify-between pointer-events-none opacity-50">
        <div className="w-12 h-12 rounded-full border-2 border-red-400 text-red-400 flex items-center justify-center bg-red-50">
          <X className="w-6 h-6" />
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-green-400 text-green-400 flex items-center justify-center bg-green-50">
          <Heart className="w-6 h-6" />
        </div>
      </div>
      
    </motion.div>
  );
}