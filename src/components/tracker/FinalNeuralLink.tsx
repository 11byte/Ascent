"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Zap, CheckCircle2, ChevronRight, Gamepad2, Volume2 } from "lucide-react";

// --- 1. Predefined Word Banks ---
const WORD_BANKS: Record<string, string[]> = {
  "AIML": ["TENSOR", "NEURAL", "MODEL", "DATA", "LOGIC", "TRAIN", "BRAIN", "VISION"],
  "Cybersecurity": ["HACK", "SECURE", "LOCK", "VIRUS", "NODE", "PORT", "WALL", "CYBER"],
  "WebDev": ["REACT", "CODE", "HTML", "NODE", "CSS", "HOOK", "DOM", "ROUTE"],
  "DataScience": ["PANDAS", "DATA", "PLOT", "GRAPH", "MEAN", "MATH", "CHART", "STATS"]
};

// --- 2. Custom Game Audio Engine (No external files needed!) ---
const AudioEngine = {
  // Synthesize a retro "blip" sound. Pitch gets higher based on 'step'
  playConnect: (step: number) => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      // Base frequency 400Hz, goes up by 150Hz for each connected node
      osc.frequency.setValueAtTime(400 + (step * 150), ctx.currentTime); 
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) { console.warn("Audio blocked"); }
  },

  // Synthesize a low error "buzz"
  playError: () => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  },

  // Synthesize a happy success "chime"
  playSuccess: () => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  },

  // Use Browser's built in AI Voice to speak the word
  speakWord: (word: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 1.1; // Slightly faster, more energetic
      utterance.pitch = 1.2; // Slightly higher pitch for a "tech" feel
      // Optional: Try to find a specific voice
      const voices = window.speechSynthesis.getVoices();
      const techVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Samantha"));
      if (techVoice) utterance.voice = techVoice;
      
      window.speechSynthesis.speak(utterance);
    }
  }
};

// --- 3. Free Scramble Text Hook ---
function useScrambleText(text: string, trigger: boolean) {
  const [displayText, setDisplayText] = useState("");
  const chars = "!<>-_\\\\/[]{}—=+*^?#_";
  
  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split("").map((letter, index) => {
        if (index < iteration) return letter;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3; 
    }, 30);
    return () => clearInterval(interval);
  }, [text, trigger]);

  return displayText;
}

// --- 4. Main Game Component ---
// UPDATED: onComplete now expects a metrics object to send to the ML payload
export default function FinalNeuralLink({ domain = "AIML", onComplete }: { domain?: string, onComplete?: (metrics: any) => void }) {
  const [validWords, setValidWords] = useState<string[]>([]);
  const [letters, setLetters] = useState<{id: number, letter: string, x: number, y: number}[]>([]);
  const [activePath, setActivePath] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true); // Let user toggle sound if they want
  
  // --- ADDED: ML TELEMETRY TRACKERS ---
  const startTime = useRef<number>(0);
  const attempts = useRef<number>(0);
  const [finalMetrics, setFinalMetrics] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const bgContainerRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  
  const scrambledTitle = useScrambleText("NEURAL LINK ESTABLISHED", !loading && !gameWon);

  useEffect(() => {
    // Ensure speech synthesis voices are loaded in advance
    if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.getVoices();
    }

    const timer = setTimeout(() => {
      const pool = WORD_BANKS[domain] || WORD_BANKS["AIML"];
      const selectedWords = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
      setValidWords(selectedWords);

      const combinedString = selectedWords.join("");
      const uniqueLettersArray = Array.from(combinedString.split(""));
      
      const radius = 110;
      const center = { x: 160, y: 160 }; 
      
      const nodes = uniqueLettersArray.map((letter, i) => {
        const angle = (i * 2 * Math.PI) / uniqueLettersArray.length - Math.PI / 2;
        return {
          id: i, letter: letter as string,
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle),
        };
      });

      setLetters(nodes);
      setLoading(false);

      // --- ADDED: Start the timer exactly when nodes load ---
      startTime.current = Date.now();
    }, 800);
    return () => clearTimeout(timer);
  }, [domain]);

  useGSAP(() => {
    gsap.to(groundRef.current, { backgroundPositionX: "1301px", duration: 20, ease: "none", repeat: -1, force3D: true });
    gsap.to(cloudsRef.current, { backgroundPositionX: "-2247px", duration: 52, ease: "none", repeat: -1, force3D: true });

    if (!loading && !gameWon && nodesRef.current.length > 0) {
      gsap.fromTo(nodesRef.current, 
        { scale: 0, opacity: 0, rotation: -180, y: 50 }, 
        { scale: 1, opacity: 1, rotation: 0, y: 0, duration: 0.8, stagger: 0.08, ease: "elastic.out(1, 0.5)" }
      );
    }
  }, [loading, gameWon]);

  // --- Interaction Logic with Audio Integration ---
  const handlePointerDown = (id: number, e: React.PointerEvent) => {
    e.preventDefault(); 
    setIsDragging(true); 
    setActivePath([id]);
    if (audioEnabled) AudioEngine.playConnect(0); // Play first note
  };

  const handlePointerEnter = (id: number) => {
    if (isDragging && !activePath.includes(id)) {
      const newPath = [...activePath, id];
      setActivePath(newPath);
      // The pitch goes higher the longer the chain is!
      if (audioEnabled) AudioEngine.playConnect(newPath.length); 
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    if (activePath.length === 0) return;
    
    // --- ADDED: Increment total attempts every time they drag and release ---
    attempts.current += 1;
    
    const formedWord = activePath.map((id) => letters[id].letter).join("");
    
    if (validWords.includes(formedWord) && !foundWords.includes(formedWord)) {
      const newFound = [...foundWords, formedWord];
      setFoundWords(newFound);
      
      // Correct Word Feedback
      if (audioEnabled) {
        AudioEngine.playSuccess();
        setTimeout(() => AudioEngine.speakWord(formedWord), 300); // Speak after chime
      }
      
      if (newFound.length >= validWords.length) {
        // --- ADDED: Calculate final ML metrics when they win ---
        const timeTaken = (Date.now() - startTime.current) / 1000;
        const accuracy = (validWords.length / attempts.current) * 100;
        
        setFinalMetrics({
          speed_sec: Number(timeTaken.toFixed(2)),
          total_attempts: attempts.current,
          accuracy_pct: Number(accuracy.toFixed(2)),
          correct_words: validWords.length
        });

        setTimeout(() => setGameWon(true), 1200); // Wait a bit longer so voice finishes
      }
    } else if (activePath.length > 1) {
      // Wrong Word Feedback
      if (audioEnabled) AudioEngine.playError();
      
      // Shake animation for error
      if (containerRef.current) {
        gsap.fromTo(containerRef.current, 
          { x: -10 }, { x: 0, duration: 0.4, ease: "elastic.out(2, 0.1)" }
        );
      }
    }
    setActivePath([]);
  };

  return (
    <div ref={bgContainerRef} className="relative w-full h-screen min-h-[700px] bg-[#63D0FF] overflow-hidden flex items-center justify-center font-sans">
      
      <div ref={cloudsRef} className="absolute top-0 left-0 w-full h-[230px] z-0 pointer-events-none" style={{ backgroundImage: 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/56901/bg-clouds2-tinypng.png")', backgroundRepeat: 'repeat-x', backgroundPosition: '0 bottom' }} />
      <div ref={groundRef} className="absolute bottom-0 left-0 w-full h-[192px] z-0 pointer-events-none" style={{ backgroundImage: 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/56901/grass_tile-tinypng.png")', backgroundRepeat: 'repeat-x', backgroundPosition: '0 0' }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        <AnimatePresence mode="wait">
          
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="bg-gray-900/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl flex flex-col items-center justify-center h-[500px]">
              <Gamepad2 className="w-12 h-12 text-cyan-400 mb-4 animate-pulse" />
              <h2 className="text-white font-bold text-xl tracking-widest animate-pulse font-mono">INITIALIZING...</h2>
            </motion.div>
          )}

          {!loading && !gameWon && (
            <motion.div key="game" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-gray-900/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              
              {/* Audio Toggle Button */}
              <button 
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10 text-cyan-400"
              >
                <Volume2 className={`w-5 h-5 ${audioEnabled ? 'opacity-100' : 'opacity-30 line-through'}`} />
              </button>

              <div className="text-center mb-6 mt-2">
                <h2 className="text-lg font-bold tracking-widest text-cyan-300 mb-1 font-mono h-6">{scrambledTitle}</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-gray-400 uppercase font-bold">Domain:</span>
                  <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">{domain}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8 min-h-[32px]">
                {validWords.map((w) => (
                  <span key={w} className={`px-4 py-1.5 rounded-full font-bold text-sm tracking-widest transition-all duration-300 ${foundWords.includes(w) ? "bg-cyan-400 text-gray-900 shadow-[0_0_15px_#22d3ee]" : "bg-black/40 text-gray-500 border border-white/10"}`}>
                    {foundWords.includes(w) ? w : w.replace(/./g, "•")}
                  </span>
                ))}
              </div>

              <div ref={containerRef} className="relative mx-auto w-[320px] h-[320px] touch-none select-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                  {activePath.map((nodeId, i) => {
                    if (i === 0) return null;
                    const prev = letters.find(l => l.id === activePath[i - 1])!;
                    const curr = letters.find(l => l.id === nodeId)!;
                    return <line key={i} x1={prev.x} y1={prev.y} x2={curr.x} y2={curr.y} stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" />;
                  })}
                  {isDragging && activePath.length > 0 && (
                    <line x1={letters.find(l=>l.id===activePath[activePath.length - 1])!.x} y1={letters.find(l=>l.id===activePath[activePath.length - 1])!.y} x2={mousePos.x} y2={mousePos.y} stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" opacity="0.5" strokeDasharray="8 8" />
                  )}
                </svg>

                {letters.map((node, index) => {
                  const isActive = activePath.includes(node.id);
                  return (
                    <div
                      key={node.id}
                      ref={(el) => { nodesRef.current[index] = el; }}
                      onPointerDown={(e: any) => handlePointerDown(node.id, e)}
                      onPointerEnter={() => handlePointerEnter(node.id)}
                      className={`absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-200 z-10
                        ${isActive ? 'bg-cyan-400 text-gray-900 shadow-[0_0_25px_rgba(34,211,238,1)] scale-110' : 'bg-white/10 text-white backdrop-blur-md border border-white/30 hover:bg-white/20 hover:border-cyan-300'}`}
                      style={{ left: node.x, top: node.y }}
                    >
                      {node.letter}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {gameWon && (
            <motion.div key="victory" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900/80 backdrop-blur-2xl border border-green-500/30 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 12 }} className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2 font-[Orbitron]">SYSTEM CRACKED</h2>
              <p className="text-green-200/70 mb-8">All nodes successfully linked.</p>
              
              {/* --- ADDED: Pass the finalMetrics to the parent Controller when clicked --- */}
              <button onClick={() => onComplete ? onComplete(finalMetrics) : alert("Go to next game!")} className="w-full group bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-300 hover:to-cyan-400 text-gray-900 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg">
                Proceed to Data Stream 
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}