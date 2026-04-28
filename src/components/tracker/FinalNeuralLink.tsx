"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, ChevronRight, Gamepad2, Volume2 } from "lucide-react";

// --- 1. Predefined Word Banks ---
const WORD_BANKS: Record<string, string[]> = {
  "AIML": ["TENSOR", "NEURAL", "MODEL", "DATA", "LOGIC", "TRAIN", "BRAIN", "VISION"],
  "Cybersecurity": ["HACK", "SECURE", "LOCK", "VIRUS", "NODE", "PORT", "WALL", "CYBER"],
  "WebDev": ["REACT", "CODE", "HTML", "NODE", "CSS", "HOOK", "DOM", "ROUTE"],
  "DataScience": ["PANDAS", "DATA", "PLOT", "GRAPH", "MEAN", "MATH", "CHART", "STATS"]
};

// --- 2. Custom Game Audio Engine ---
const AudioEngine = {
  playConnect: (step: number) => {
    if (typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(400 + (step * 150), ctx.currentTime); 
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  },
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
  speakWord: (word: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 1.1; 
      utterance.pitch = 1.2; 
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

// --- 4. Main Component ---
export default function FinalNeuralLink({ 
  domain = "AIML", 
  theme, 
  onComplete 
}: { 
  domain?: string, 
  theme: any, 
  onComplete?: (metrics: any) => void 
}) {
  const [validWords, setValidWords] = useState<string[]>([]);
  const [letters, setLetters] = useState<{id: number, letter: string, x: number, y: number}[]>([]);
  const [activePath, setActivePath] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // --- ML TELEMETRY TRACKERS ---
  const startTime = useRef<number>(0);
  const attempts = useRef<number>(0);
  const [finalMetrics, setFinalMetrics] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const scrambledTitle = useScrambleText("NEURAL LINK ESTABLISHED", !loading && !gameWon);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.getVoices();
    }

    const timer = setTimeout(() => {
      const pool = WORD_BANKS[domain] || WORD_BANKS["AIML"];
      const selectedWords = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
      setValidWords(selectedWords);

      // --- INTELLIGENT CHARACTER FREQUENCY LOGIC ---
      const maxLetterCounts: Record<string, number> = {};
      
      selectedWords.forEach(word => {
        const currentWordCounts: Record<string, number> = {};
        for (const char of word) {
          currentWordCounts[char] = (currentWordCounts[char] || 0) + 1;
        }
        for (const char in currentWordCounts) {
          if (!maxLetterCounts[char] || currentWordCounts[char] > maxLetterCounts[char]) {
            maxLetterCounts[char] = currentWordCounts[char];
          }
        }
      });

      let finalLettersArray: string[] = [];
      for (const char in maxLetterCounts) {
        for (let i = 0; i < maxLetterCounts[char]; i++) {
          finalLettersArray.push(char);
        }
      }

      // Jumble the final letter array
      finalLettersArray = finalLettersArray.sort(() => 0.5 - Math.random());
      
      // Scale circle radius dynamically based on how many letters we generated
      const radius = Math.max(120, finalLettersArray.length * 8.5); 
      const center = { x: radius + 30, y: radius + 30 }; 
      
      const nodes = finalLettersArray.map((letter, i) => {
        const angle = (i * 2 * Math.PI) / finalLettersArray.length - Math.PI / 2;
        return {
          id: i, 
          letter: letter,
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle),
        };
      });

      setLetters(nodes);
      setLoading(false);
      startTime.current = Date.now();
    }, 800);

    return () => clearTimeout(timer);
  }, [domain]);

  useGSAP(() => {
    if (!loading && !gameWon && nodesRef.current.length > 0) {
      gsap.fromTo(nodesRef.current, 
        { scale: 0, opacity: 0, rotation: -180, y: 50 }, 
        { scale: 1, opacity: 1, rotation: 0, y: 0, duration: 0.8, stagger: 0.05, ease: "elastic.out(1, 0.5)" }
      );
    }
  }, [loading, gameWon]);

  useEffect(() => {
    if (loading || gameWon) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [loading, gameWon]);

  const getHintedWord = (word: string) => {
    if (foundWords.includes(word)) return word;

    const masked = Array.from(word).map(() => "•");
    const midIndex = Math.floor((word.length - 1) / 2);

    if (elapsedSeconds >= 12) {
      masked[0] = word[0];
    }

    if (elapsedSeconds >= 24) {
      masked[word.length - 1] = word[word.length - 1];
    }

    if (elapsedSeconds >= 36) {
      masked[midIndex] = word[midIndex];
    }

    return masked.join("");
  };

  // --- Interaction Logic ---
  const handlePointerDown = (id: number, e: React.PointerEvent) => {
    e.preventDefault(); 
    setIsDragging(true); 
    setActivePath([id]);
    if (audioEnabled) AudioEngine.playConnect(0); 
  };

  const handlePointerEnter = (id: number) => {
    if (isDragging && !activePath.includes(id)) {
      const newPath = [...activePath, id];
      setActivePath(newPath);
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
    
    attempts.current += 1;
    const formedWord = activePath.map((id) => letters[id].letter).join("");
    
    if (validWords.includes(formedWord) && !foundWords.includes(formedWord)) {
      const newFound = [...foundWords, formedWord];
      setFoundWords(newFound);
      
      if (audioEnabled) {
        AudioEngine.playSuccess();
        setTimeout(() => AudioEngine.speakWord(formedWord), 300); 
      }
      
      if (newFound.length >= validWords.length) {
        const timeTaken = (Date.now() - startTime.current) / 1000;
        const accuracy = (validWords.length / attempts.current) * 100;
        
        setFinalMetrics({
          speed_sec: Number(timeTaken.toFixed(2)),
          total_attempts: attempts.current,
          accuracy_pct: Number(accuracy.toFixed(2)),
          correct_words: validWords.length
        });

        setTimeout(() => setGameWon(true), 1200); 
      }
    } else if (activePath.length > 1) {
      if (audioEnabled) AudioEngine.playError();
      if (containerRef.current) {
        gsap.fromTo(containerRef.current, 
          { x: -10 }, { x: 0, duration: 0.4, ease: "elastic.out(2, 0.1)" }
        );
      }
    }
    setActivePath([]);
  };

  return (
    <div className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden font-sans">
      
      <div className="relative z-10 w-full max-w-xl px-3 md:px-4">
        <AnimatePresence mode="wait">
          
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} 
              className="flex h-[min(58vh,500px)] flex-col items-center justify-center rounded-3xl border p-10 shadow-2xl backdrop-blur-2xl"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
            >
              <Gamepad2 className="w-12 h-12 mb-4 animate-pulse" style={{ color: theme.primary }} />
              <h2 className="font-bold text-xl tracking-widest animate-pulse font-mono text-white">INITIALIZING...</h2>
            </motion.div>
          )}

          {!loading && !gameWon && (
            <motion.div key="game" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} 
              className="relative rounded-3xl border p-5 shadow-2xl backdrop-blur-xl md:p-6"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
            >
              <button 
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10"
              >
                <Volume2 className={`w-5 h-5 ${audioEnabled ? 'opacity-100' : 'opacity-30 line-through'}`} style={{ color: theme.primary }} />
              </button>

              <div className="text-center mb-6 mt-2">
                <h2 className="text-lg font-bold tracking-widest mb-1 font-mono h-6" style={{ color: theme.primary }}>{scrambledTitle}</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-gray-400 uppercase font-bold">Domain:</span>
                  <span className="text-sm px-2 py-0.5 rounded border" style={{ backgroundColor: `${theme.primary}20`, color: theme.primary, borderColor: `${theme.primary}50` }}>{domain}</span>
                </div>
              </div>

              {/* <div className="mb-2 text-center">
                {!gameWon && (
                  <p className="text-[11px] uppercase tracking-[0.28em] text-gray-400">
                    Hints unlock at 12s, 24s, 36s
                  </p>
                )}
              </div> */}

              <div className="mb-6 flex min-h-[32px] flex-wrap justify-center gap-2">
                {validWords.map((w) => {
                  const isFound = foundWords.includes(w);
                  return (
                    <span key={w} className="px-4 py-1.5 rounded-full font-bold text-sm tracking-widest transition-all duration-300 border"
                      style={{
                        backgroundColor: isFound ? theme.primary : "rgba(0,0,0,0.4)",
                        color: isFound ? "#000" : "#888",
                        borderColor: isFound ? theme.primary : "rgba(255,255,255,0.1)",
                        boxShadow: isFound ? `0 0 15px ${theme.primary}` : "none"
                      }}
                    >
                      {getHintedWord(w)}
                    </span>
                  );
                })}
              </div>

              {/* Dynamic SVG Drawing Area */}
              <div 
                ref={containerRef} 
                className="relative mx-auto touch-none select-none" 
                style={{ width: (Math.max(120, letters.length * 8.5) + 30) * 2, height: (Math.max(120, letters.length * 8.5) + 30) * 2 }}
                onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: `drop-shadow(0 0 8px ${theme.primary})` }}>
                  {activePath.map((nodeId, i) => {
                    if (i === 0) return null;
                    const prev = letters.find(l => l.id === activePath[i - 1])!;
                    const curr = letters.find(l => l.id === nodeId)!;
                    return <line key={i} x1={prev.x} y1={prev.y} x2={curr.x} y2={curr.y} stroke={theme.primary} strokeWidth="5" strokeLinecap="round" />;
                  })}
                  {isDragging && activePath.length > 0 && (
                    <line x1={letters.find(l=>l.id===activePath[activePath.length - 1])!.x} y1={letters.find(l=>l.id===activePath[activePath.length - 1])!.y} x2={mousePos.x} y2={mousePos.y} stroke={theme.primary} strokeWidth="5" strokeLinecap="round" opacity="0.5" strokeDasharray="6 6" />
                  )}
                </svg>

                {letters.map((node, index) => {
                  const isActive = activePath.includes(node.id);
                  // Scale nodes down slightly if there are many letters to prevent overlap
                  const nodeSize = letters.length > 15 ? "w-10 h-10 -ml-5 -mt-5 text-lg" : "w-12 h-12 -ml-6 -mt-6 text-xl";
                  
                  return (
                    <div
                      key={node.id}
                      ref={(el) => { nodesRef.current[index] = el; }}
                      onPointerDown={(e: any) => handlePointerDown(node.id, e)}
                      onPointerEnter={() => handlePointerEnter(node.id)}
                      className={`absolute rounded-full flex items-center justify-center font-bold cursor-pointer transition-all duration-200 z-10 border ${nodeSize}`}
                      style={{ 
                        left: node.x, 
                        top: node.y,
                        backgroundColor: isActive ? theme.primary : "rgba(255,255,255,0.05)",
                        color: isActive ? "#000" : "#fff",
                        borderColor: isActive ? theme.primary : "rgba(255,255,255,0.2)",
                        boxShadow: isActive ? `0 0 20px ${theme.primary}` : "none",
                        transform: isActive ? "scale(1.15)" : "scale(1)"
                      }}
                    >
                      {node.letter}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {gameWon && (
            <motion.div key="victory" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} 
              className="backdrop-blur-2xl border rounded-3xl p-10 text-center shadow-2xl"
              style={{ backgroundColor: theme.cardBg, borderColor: `${theme.success}50`, boxShadow: `0 0 50px ${theme.success}30` }}
            >
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 12 }} 
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${theme.success}20` }}
              >
                <CheckCircle2 className="w-12 h-12" style={{ color: theme.success }} />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-widest" style={{ fontFamily: theme.fontPrimary }}>SYSTEM CRACKED</h2>
              <p className="text-gray-400 mb-8">All nodes successfully linked.</p>
              
              <button 
                onClick={() => onComplete && onComplete(finalMetrics)} 
                className="w-full font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg text-gray-900"
                style={{ background: `linear-gradient(90deg, ${theme.success}, ${theme.primary})` }}
              >
                Proceed to Data Stream 
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}