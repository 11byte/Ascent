"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Shield,
  Code,
  Database,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- Game Configurations ---
const DOMAINS = [
  {
    id: "Cybersecurity",
    icon: Shield,
    color: "text-red-500",
    bg: "bg-red-500/20",
  },
  {
    id: "AIML",
    icon: Brain,
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/20",
  },
  { id: "WebDev", icon: Code, color: "text-blue-500", bg: "bg-blue-500/20" },
  {
    id: "DataScience",
    icon: Database,
    color: "text-green-500",
    bg: "bg-green-500/20",
  },
];

const SCRAMBLE_WORDS = [
  { word: "TENSOR", domain: "AIML" },
  { word: "REACT", domain: "WebDev" },
  { word: "FIREWALL", domain: "Cybersecurity" },
  { word: "PANDAS", domain: "DataScience" },
];

const POP_ITEMS = [
  { text: "Neural Network", domain: "AIML" },
  { text: "SQL Injection", domain: "Cybersecurity" },
  { text: "Tailwind", domain: "WebDev" },
  { text: "PyTorch", domain: "AIML" },
  { text: "Clustering", domain: "DataScience" },
  { text: "Phishing", domain: "Cybersecurity" },
];

const SORTING_ITEMS = [
  { text: "TensorFlow", domain: "AIML" },
  { text: "Next.js", domain: "WebDev" },
  { text: "Penetration Testing", domain: "Cybersecurity" },
  { text: "Data Cleaning", domain: "DataScience" },
];

const RAPID_CHOICES = [
  {
    left: { text: "Design UI", domain: "WebDev" },
    right: { text: "Write API", domain: "WebDev" },
  },
  {
    left: { text: "Train Model", domain: "AIML" },
    right: { text: "Fix Security Bug", domain: "Cybersecurity" },
  },
  {
    left: { text: "Clean Dataset", domain: "DataScience" },
    right: { text: "Setup Cloud", domain: "WebDev" },
  },
];

export default function TrackerV2({ phase }: { phase: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Scoring & ML Metrics
  const [scores, setScores] = useState({
    Cybersecurity: 0,
    AIML: 0,
    WebDev: 0,
    DataScience: 0,
  });
  const [metrics, setMetrics] = useState<any>({
    domainSelection: null,
    scramble: [],
    popGame: { accuracy: 0, misclicks: 0, speed: 0 },
    sorting: [],
    rapidChoice: [],
    totalTime: 0,
  });

  const stepStartTime = useRef(Date.now());
  const globalStartTime = useRef(Date.now());

  const trackTime = () => (Date.now() - stepStartTime.current) / 1000;
  const resetTimer = () => {
    stepStartTime.current = Date.now();
  };

  // Update Score Helper
  const addScore = (domain: string, points: number) => {
    setScores((prev) => ({
      ...prev,
      [domain]: prev[domain as keyof typeof prev] + points,
    }));
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
    resetTimer();
  };

  // --- Step 1: Domain Selection ---
  const handleDomainSelect = (domainId: string) => {
    setMetrics({
      ...metrics,
      domainSelection: { declaredInterest: domainId, timeTaken: trackTime() },
    });
    nextStep();
  };

  // --- Final Submit to Backend ---
  const submitData = async () => {
    const totalTime = (Date.now() - globalStartTime.current) / 1000;
    const userId = localStorage.getItem("userId") || "guest";

    // Pro Insight Generation: Compare stated interest vs actual performance
    const topPerformanceDomain = Object.keys(scores).reduce((a, b) =>
      scores[a as keyof typeof scores] > scores[b as keyof typeof scores]
        ? a
        : b,
    );
    const statedDomain = metrics.domainSelection?.declaredInterest;

    const proInsight = {
      declared: statedDomain,
      actualPerformance: topPerformanceDomain,
      alignment:
        statedDomain === topPerformanceDomain
          ? "Aligned"
          : "Exploratory/Hidden Talent",
      engagementDepth: totalTime > 120 ? "High" : "Normal",
    };

    const payload = {
      userId,
      feature: "trackerv2_games",
      data: {
        rawScores: scores,
        metrics: { ...metrics, totalTimeSpent: totalTime },
        mlFeatures: {
          scrambleSpeedAvg:
            metrics.scramble.reduce((a: any, b: any) => a + b.timeTaken, 0) /
            (metrics.scramble.length || 1),
          popAccuracy: metrics.popGame.accuracy,
          sortingAccuracyAvg:
            metrics.sorting.filter((s: any) => s.correct).length /
            (metrics.sorting.length || 1),
          rapidChoiceSpeedAvg:
            metrics.rapidChoice.reduce((a: any, b: any) => a + b.timeTaken, 0) /
            (metrics.rapidChoice.length || 1),
        },
        proInsight,
      },
    };

    try {
      await fetch("http://localhost:5000/tracker/quiz/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // Redirect based on phase
      router.push(`/${phase}`);
    } catch (err) {
      console.error("Failed to save tracker v2 data", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900/80 backdrop-blur-xl border border-gray-700 p-8 rounded-3xl shadow-2xl text-white min-h-[500px] flex flex-col justify-center">
      {/* Progress Bar */}
      <div className="w-full bg-gray-800 h-2 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-fuchsia-500"
          initial={{ width: 0 }}
          animate={{ width: `${(step / 6) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && <IntroScreen onStart={nextStep} />}

        {step === 1 && <DomainSelection onSelect={handleDomainSelect} />}

        {step === 2 && (
          <WordScramble
            words={SCRAMBLE_WORDS}
            onComplete={(res) => {
              setMetrics({ ...metrics, scramble: res });
              res.forEach((r: any) => {
                if (r.domain === "AIML") addScore("AIML", 3);
              }); // Scoring rule
              nextStep();
            }}
          />
        )}

        {step === 3 && (
          <PopGame
            items={POP_ITEMS}
            onComplete={(res) => {
              setMetrics({ ...metrics, popGame: res });
              addScore("Cybersecurity", res.correctSecurity * 2); // Scoring rule
              nextStep();
            }}
          />
        )}

        {step === 4 && (
          <SortingGame
            items={SORTING_ITEMS}
            onComplete={(res) => {
              setMetrics({ ...metrics, sorting: res });
              const correctDS = res.filter(
                (r: any) => r.domain === "DataScience" && r.correct,
              ).length;
              addScore("DataScience", correctDS * 2); // Scoring rule
              nextStep();
            }}
          />
        )}

        {step === 5 && (
          <RapidChoice
            choices={RAPID_CHOICES}
            onComplete={(res) => {
              setMetrics({ ...metrics, rapidChoice: res });
              const uiChoices = res.filter(
                (r: any) => r.chosenDomain === "WebDev",
              ).length;
              addScore("WebDev", uiChoices * 2); // Scoring rule
              submitData();
              nextStep();
            }}
          />
        )}

        {step === 6 && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Zap className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Profile Calibrated!</h2>
            <p className="text-gray-400">Your custom learning path is ready.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Mini Games Sub-Components ---

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="text-center"
    >
      <h2 className="text-4xl font-bold mb-4 font-[Orbitron]">
        Welcome to Ascent Assessment
      </h2>
      <p className="text-gray-400 mb-8 max-w-lg mx-auto">
        We've ditched the boring forms. Play 4 quick mini-games (under 3
        minutes) so our AI can calibrate your ideal engineering domain.
      </p>
      <button
        onClick={onStart}
        className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform"
      >
        Start Challenge
      </button>
    </motion.div>
  );
}

function DomainSelection({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <motion.div
      key="domain"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        What's your current primary interest?
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {DOMAINS.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            className={`${d.bg} border border-gray-700 hover:border-gray-400 p-6 rounded-2xl flex flex-col items-center transition-all hover:scale-105`}
          >
            <d.icon className={`w-12 h-12 mb-3 ${d.color}`} />
            <span className="font-semibold">{d.id}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export function WordScramble({
  onComplete,
}: {
  onComplete: (data: any) => void;
}) {
  // Using a master word that contains smaller words
  const masterWord = "TENSOR";
  const validWords = [
    "TENSOR",
    "TEN",
    "NET",
    "NOT",
    "ROT",
    "SON",
    "TON",
    "REST",
    "SENT",
    "SORE",
  ];

  const [letters] = useState(
    masterWord.split("").sort(() => Math.random() - 0.5),
  );
  const [activePath, setActivePath] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Setup circular layout coordinates
  const radius = 120;
  const center = { x: 150, y: 150 };
  const nodes = letters.map((letter, i) => {
    const angle = (i * 2 * Math.PI) / letters.length - Math.PI / 2;
    return {
      id: i,
      letter,
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    };
  });

  const handlePointerDown = (id: number) => {
    setIsDragging(true);
    setActivePath([id]);
  };

  const handlePointerEnter = (id: number) => {
    if (isDragging && !activePath.includes(id)) {
      setActivePath([...activePath, id]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    const formedWord = activePath.map((id) => nodes[id].letter).join("");

    if (validWords.includes(formedWord) && !foundWords.includes(formedWord)) {
      setFoundWords([...foundWords, formedWord]);
    }
    setActivePath([]);
  };

  // Auto-progress after finding 3 words (or add a timer here)
  useEffect(() => {
    if (foundWords.length >= 3) {
      setTimeout(
        () => onComplete({ foundWords, total: foundWords.length }),
        1000,
      );
    }
  }, [foundWords]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center w-full"
    >
      <h2 className="text-3xl font-[Orbitron] font-bold mb-2 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
        Neural Link
      </h2>
      <p className="text-gray-400 mb-4">
        Swipe to connect nodes. Find 3 valid tech words.
      </p>

      {/* Found Words Display */}
      <div className="flex justify-center gap-2 mb-6 h-8">
        {foundWords.map((w, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-cyan-900/50 border border-cyan-500 text-cyan-300 rounded-md font-bold text-sm shadow-[0_0_10px_rgba(34,211,238,0.3)]"
          >
            {w}
          </span>
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto w-[300px] h-[300px] touch-none select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Draw Laser Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {activePath.map((nodeId, i) => {
            if (i === 0) return null;
            const prev = nodes[activePath[i - 1]];
            const curr = nodes[nodeId];
            return (
              <line
                key={i}
                x1={prev.x}
                y1={prev.y}
                x2={curr.x}
                y2={curr.y}
                stroke="#22d3ee"
                strokeWidth="6"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_#22d3ee]"
              />
            );
          })}
          {/* Line trailing to mouse cursor */}
          {isDragging && activePath.length > 0 && (
            <line
              x1={nodes[activePath[activePath.length - 1]].x}
              y1={nodes[activePath[activePath.length - 1]].y}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="#22d3ee"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.5"
            />
          )}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = activePath.includes(node.id);
          return (
            <motion.div
              key={node.id}
              onPointerDown={() => handlePointerDown(node.id)}
              onPointerEnter={() => handlePointerEnter(node.id)}
              animate={{
                scale: isActive ? 1.2 : 1,
                backgroundColor: isActive ? "#0891b2" : "#1f2937",
                borderColor: isActive ? "#22d3ee" : "#374151",
              }}
              className={`absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer border-2 transition-colors duration-150 ${isActive ? "text-white shadow-[0_0_15px_#22d3ee]" : "text-gray-300"}`}
              style={{ left: node.x, top: node.y }}
            >
              {node.letter}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function DataStreamGame({
  items,
  onComplete,
}: {
  items: any[];
  onComplete: (data: any) => void;
}) {
  const [activeNodes, setActiveNodes] = useState<
    { id: number; text: string; domain: string; x: number }[]
  >([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // Game ends in 15 seconds
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );

  const spawnId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Spawner Logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setActiveNodes((prev) => [
        ...prev,
        {
          id: spawnId.current++,
          text: randomItem.text,
          domain: randomItem.domain,
          x: Math.random() * 80, // Random horizontal start (0 to 80%)
        },
      ]);
    }, 800); // Spawns a new node every 0.8 seconds

    return () => clearInterval(interval);
  }, [items, timeLeft]);

  // Timer & Progression Logic
  useEffect(() => {
    if (timeLeft <= 0) {
      // Auto-progress when time is up
      onComplete({ score, timePlayed: 15 });
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete, score]);

  const handleIntercept = (e: React.MouseEvent, node: any) => {
    // Determine if correct
    if (node.domain === "AIML") setScore((s) => s + 1);
    else setScore((s) => s - 1); // Penalty for wrong click!

    // Create explosion at click coordinates relative to container
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setBursts((prev) => [
        ...prev,
        { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top },
      ]);
    }

    // Remove node
    setActiveNodes((prev) => prev.filter((n) => n.id !== node.id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center w-full relative"
    >
      <div className="flex justify-between items-end mb-4 px-4">
        <h2 className="text-3xl font-[Orbitron] font-bold text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]">
          Data Stream
        </h2>
        <div className="text-right">
          <p className="text-xl font-bold text-white">
            Score:{" "}
            <span className={score >= 0 ? "text-green-400" : "text-red-400"}>
              {score}
            </span>
          </p>
          <p className="text-sm text-gray-400">
            Time: 0:{timeLeft.toString().padStart(2, "0")}
          </p>
        </div>
      </div>

      <p className="text-gray-300 font-semibold mb-6">
        Intercept only the <span className="text-fuchsia-400">AI/ML</span>{" "}
        packets!
      </p>

      <div
        ref={containerRef}
        className="relative w-full h-[350px] bg-gray-950/50 rounded-2xl border border-fuchsia-900/50 overflow-hidden shadow-inner"
      >
        <AnimatePresence>
          {activeNodes.map((node) => (
            <motion.button
              key={node.id}
              onClick={(e) => handleIntercept(e, node)}
              initial={{ y: -50, opacity: 0, scale: 0.8 }}
              animate={{ y: 400, opacity: 1, scale: 1 }}
              transition={{ duration: 4, ease: "linear" }}
              onAnimationComplete={() =>
                setActiveNodes((prev) => prev.filter((n) => n.id !== node.id))
              } // Remove when it hits bottom
              className="absolute bg-gray-800 border-2 border-fuchsia-500/50 text-white px-4 py-2 rounded-full font-bold hover:bg-fuchsia-900 shadow-[0_0_15px_rgba(232,121,249,0.3)] z-10"
              style={{ left: `${node.x}%` }}
            >
              {node.text}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Explosion Effects */}
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onAnimationComplete={() =>
              setBursts((prev) => prev.filter((b) => b.id !== burst.id))
            }
            className="absolute w-10 h-10 bg-fuchsia-400 rounded-full pointer-events-none z-0 mix-blend-screen blur-sm"
            style={{ left: burst.x - 20, top: burst.y - 20 }}
          />
        ))}

        {/* Sleek Scanning line background effect */}
        <motion.div
          animate={{ y: [0, 350, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-1 bg-fuchsia-500/20 blur-sm pointer-events-none"
        />
      </div>
    </motion.div>
  );
}

function SortingGame({
  items,
  onComplete,
}: {
  items: any[];
  onComplete: (data: any) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const startTime = useRef(Date.now());

  const handleSort = (domain: string) => {
    const isCorrect = items[idx].domain === domain;
    const newRes = [
      ...results,
      {
        item: items[idx].text,
        domain,
        correct: isCorrect,
        time: (Date.now() - startTime.current) / 1000,
      },
    ];
    setResults(newRes);

    if (idx + 1 < items.length) {
      setIdx(idx + 1);
      startTime.current = Date.now();
    } else {
      onComplete(newRes);
    }
  };

  if (idx >= items.length) return null;

  return (
    <motion.div
      key="sort"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-center"
    >
      <h2 className="text-2xl font-bold mb-2">Quick Sorting</h2>
      <p className="text-gray-400 mb-8">Where does this belong?</p>

      <motion.div
        key={items[idx].text}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-blue-600 text-white text-3xl font-bold py-8 rounded-2xl mb-8 shadow-xl"
      >
        {items[idx].text}
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {DOMAINS.map((d) => (
          <button
            key={d.id}
            onClick={() => handleSort(d.id)}
            className="bg-gray-800 hover:bg-gray-700 py-4 rounded-xl font-semibold border border-gray-600 transition-colors"
          >
            {d.id}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function RapidChoice({
  choices,
  onComplete,
}: {
  choices: any[];
  onComplete: (data: any) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const startTime = useRef(Date.now());

  const handleChoose = (choice: any) => {
    const newRes = [
      ...results,
      {
        chosenText: choice.text,
        chosenDomain: choice.domain,
        timeTaken: (Date.now() - startTime.current) / 1000,
      },
    ];
    setResults(newRes);
    if (idx + 1 < choices.length) {
      setIdx(idx + 1);
      startTime.current = Date.now();
    } else {
      onComplete(newRes);
    }
  };

  if (idx >= choices.length) return null;

  return (
    <motion.div
      key="rapid"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <h2 className="text-2xl font-bold mb-2">Rapid Choice</h2>
      <p className="text-gray-400 mb-8">
        Don't think. Just click what you'd rather do.
      </p>

      <div className="flex gap-4 justify-center mt-10">
        <button
          onClick={() => handleChoose(choices[idx].left)}
          className="flex-1 bg-gray-800 hover:bg-gray-700 p-10 rounded-2xl border border-gray-600 text-xl font-bold transition-all hover:scale-105"
        >
          {choices[idx].left.text}
        </button>
        <div className="flex items-center justify-center font-bold text-gray-500">
          VS
        </div>
        <button
          onClick={() => handleChoose(choices[idx].right)}
          className="flex-1 bg-gray-800 hover:bg-gray-700 p-10 rounded-2xl border border-gray-600 text-xl font-bold transition-all hover:scale-105"
        >
          {choices[idx].right.text}
        </button>
      </div>
    </motion.div>
  );
}
