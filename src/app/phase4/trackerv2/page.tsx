"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Database,
  Terminal,
  CheckCircle2,
  ChevronRight,
  Brain,
  Zap,
  Layers,
  MousePointerClick,
  Search,
  Info,
  Clock3,
  SkipForward,
} from "lucide-react";

import FinalNeuralLink from "../../../components/tracker/FinalNeuralLink";
import FinalDataStream from "../../../components/tracker/FinalDataStream";
import FinalDataSort from "../../../components/tracker/FinalDataSort";
import FinalRapidChoice from "../../../components/tracker/FinalRapidChoice";
import FinalOddManOut from "../../../components/tracker/FinalOddManOut";

// --- 1. Global Theme Configuration ---
export const GLOBAL_THEME = {
  primary: "#DDA853", // tDepthColor (Muted Gold)
  secondary: "#F3F3E0", // tBorder (Cream)
  accent: "#183B4E", // tColor (Deep Teal)
  success: "#34d399", // Muted Emerald
  danger: "#fb7185", // Muted Rose
  background: "#020608", // Almost black with a tiny hint of teal
  cardBg: "rgba(24, 59, 78, 0.35)", // Using tColor as a tinted glass background
  cardBorder: "rgba(243, 243, 224, 0.15)", // tBorder with 15% opacity
  fontPrimary: "'Orbitron', sans-serif",
  fontSecondary: "system-ui, -apple-system, sans-serif",
};

// --- 2. Tarot Cards Configuration ---
const TAROT_CARDS = [
  {
    id: "neural",
    title: "NEURAL LINK",
    icon: Brain,
    desc: "Pattern Recognition",
    instructions:
      "Connect the scattered nodes to form the correct technical term. Speed and accuracy count.",
  },
  {
    id: "stream",
    title: "DATA STREAM",
    icon: MousePointerClick,
    desc: "Reflex & Precision",
    instructions:
      "Intercept the target data packets while ignoring decoys. Avoid misclicks to maintain a high score.",
  },
  {
    id: "sort",
    title: "DATA SORT",
    icon: Layers,
    desc: "Logical Categorization",
    instructions:
      "Drag and drop the incoming concepts into their correct subsystems. Minimize hesitations.",
  },
  {
    id: "rapid",
    title: "RAPID CHOICE",
    icon: Zap,
    desc: "Intuition Mapping",
    instructions:
      "Swipe right for tasks you'd enjoy, left for tasks you wouldn't. Trust your gut instinct.",
  },
  {
    id: "odd",
    title: "ANOMALY",
    icon: Search,
    desc: "Anomaly Detection",
    instructions:
      "Identify the rogue data packet that does not belong in the cluster as fast as possible.",
  },
];

const DOMAINS = ["AIML", "Cybersecurity", "WebDev", "DataScience"];
const GAME_TIME_LIMIT_SECONDS = 75;

const GAME_STEPS = [
  { id: "neural_link", title: "NEURAL LINK" },
  { id: "data_stream", title: "DATA STREAM" },
  { id: "data_sort", title: "DATA SORT" },
  { id: "rapid_choice", title: "RAPID CHOICE" },
  { id: "odd_man_out", title: "ANOMALY" },
] as const;

function formatGameTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safeSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

// --- 3. Persistent Ambient Background Component ---
// --- 3. Persistent Ambient Background Component ---
export function AmbientBackground({ theme }: { theme: any }) {
  // Animation states: 'orbit' -> 'collide' -> 'explode' -> 'settled'
  const [stage, setStage] = useState<
    "orbit" | "collide" | "explode" | "settled"
  >("orbit");

  useEffect(() => {
    // 12-Second Master Timeline
    // Orbit takes 9 seconds (exactly 3/4 of the animation)
    const t1 = setTimeout(() => setStage("collide"), 9000);
    // Spiral inward takes 2 seconds
    const t2 = setTimeout(() => setStage("explode"), 11000);
    // Explosion flash takes 0.5 seconds before settling
    const t3 = setTimeout(() => setStage("settled"), 11500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center"
      // Permanently change the background to the explosion color
      animate={{
        backgroundColor:
          stage === "explode" || stage === "settled"
            ? theme.primary
            : theme.background,
      }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* 1. BINARY STAR SYSTEM */}
      {stage !== "settled" && (
        <motion.div
          className="absolute flex items-center justify-center"
          animate={{
            // 4 full spins during orbit, 6 more spins during collision, then stop
            rotate:
              stage === "explode" ? 3600 : stage === "collide" ? 3420 : 1440,
          }}
          transition={{
            duration: stage === "orbit" ? 9 : stage === "collide" ? 2 : 0.5,
            // "easeIn" creates the exponential acceleration starting from slow to extremely fast
            ease: stage === "orbit" ? "easeIn" : "linear",
          }}
        >
          {/* Star 1 (Primary Color) */}
          <motion.div
            animate={{
              x: stage === "orbit" ? -250 : 0, // Held at a distance, then pulled to center
              scale: stage === "explode" ? 0 : 1, // Shrinks instantly on explosion
            }}
            transition={{
              x: {
                duration: stage === "collide" ? 2 : 9,
                ease: stage === "collide" ? "easeIn" : "linear",
              },
              scale: { duration: 0.1 },
            }}
            className="absolute w-[400px] h-[400px] rounded-full blur-[60px] opacity-90 mix-blend-screen"
            style={{
              background: `radial-gradient(circle, ${theme.primary}, transparent 70%)`,
            }}
          />

          {/* Star 2 (Accent Color) */}
          <motion.div
            animate={{
              x: stage === "orbit" ? 250 : 0, // Held at a distance, then pulled to center
              scale: stage === "explode" ? 0 : 1,
            }}
            transition={{
              x: {
                duration: stage === "collide" ? 2 : 9,
                ease: stage === "collide" ? "easeIn" : "linear",
              },
              scale: { duration: 0.1 },
            }}
            className="absolute w-[400px] h-[400px] rounded-full blur-[60px] opacity-90 mix-blend-screen"
            style={{
              background: `radial-gradient(circle, ${theme.accent}, transparent 70%)`,
            }}
          />
        </motion.div>
      )}

      {/* 2. THE EXPLOSION FLASHBANG */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={
          stage === "explode"
            ? { scale: [1, 50], opacity: [0, 1, 0] }
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute w-[100px] h-[100px] rounded-full blur-[10px] mix-blend-screen"
        style={{
          background: `radial-gradient(circle, #ffffff, ${theme.primary}, transparent)`,
        }}
      />

      {/* 3. POST-COLLISION SETTLED BACKGROUND (Permanent Aftermath) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === "settled" ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        {/* Dark Vignette Overlay: Ensures white UI text remains readable against the new bright background */}
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `radial-gradient(circle at center, transparent 0%, ${theme.background} 100%)`,
          }}
        />

        {/* Slow, ambient floating dark matter to keep the background feeling alive */}
        <motion.div
          animate={{ x: [-50, 50, -50], y: [-30, 80, -30], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-40 mix-blend-multiply"
          style={{
            background: `radial-gradient(circle, ${theme.background}, transparent)`,
          }}
        />
        <motion.div
          animate={{ x: [50, -50, 50], y: [50, -20, 50], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] rounded-full blur-[180px] opacity-40 mix-blend-multiply"
          style={{
            background: `radial-gradient(circle, ${theme.secondary}, transparent)`,
          }}
        />
      </motion.div>

      {/* Noise Overlay to bind it all together */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.apply/noise.svg')] opacity-20 mix-blend-overlay z-10"></div>
    </motion.div>
  );
}

function TrackerGameChrome({
  theme,
  title,
  stepNumber,
  remainingTime,
  playCount,
  playCountLoading,
  onNext,
  children,
}: {
  theme: any;
  title: string;
  stepNumber: number;
  remainingTime: number;
  playCount: number | null;
  playCountLoading: boolean;
  onNext: () => void;
  children: React.ReactNode;
}) {
  const isUrgent = remainingTime <= 10;

  return (
    <div className="relative isolate flex min-h-[calc(100vh-70px)] w-full items-stretch justify-center overflow-hidden px-3 py-3 md:px-6">
      <div className="pointer-events-none absolute left-0 right-0 top-3 z-20 px-3 md:px-6">
        <div
          className="mx-auto flex w-full max-w-6xl flex-col gap-2 rounded-[1.5rem] border bg-black/45 px-3 py-2.5 shadow-2xl backdrop-blur-2xl md:flex-row md:items-center md:justify-between md:px-4"
          style={{
            borderColor: isUrgent ? "rgba(251, 113, 133, 0.35)" : theme.cardBorder,
            boxShadow: isUrgent
              ? "0 0 35px rgba(251, 113, 133, 0.12)"
              : "0 0 35px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="rounded-2xl border px-3 py-2"
              style={{ borderColor: theme.cardBorder }}
            >
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400">
                Stage
              </p>
              <p
                className="mt-1 text-sm font-semibold tracking-[0.28em]"
                style={{ color: theme.primary, fontFamily: theme.fontPrimary }}
              >
                {stepNumber}/5
              </p>
            </div>

            <div
              className="rounded-2xl border px-3 py-2"
              style={{ borderColor: theme.cardBorder }}
            >
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400">
                Previous runs
              </p>
              <p
                className="mt-1 text-sm font-semibold tracking-[0.2em] text-white"
                style={{ fontFamily: theme.fontPrimary }}
              >
                {playCountLoading ? "SYNCING" : playCount ?? 0}
              </p>
            </div>

            <div
              className="rounded-2xl border px-3 py-2"
              style={{ borderColor: theme.cardBorder }}
            >
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-gray-400">
                <Clock3 className="h-3.5 w-3.5" />
                Time left
              </p>
              <p
                className="mt-1 text-sm font-semibold tracking-[0.24em]"
                style={{
                  color: isUrgent ? theme.danger : theme.secondary,
                  fontFamily: theme.fontPrimary,
                }}
              >
                {formatGameTime(remainingTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 md:justify-end">
            <div className="hidden text-right md:block">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
                Active stage
              </p>
              <p
                className="mt-1 text-sm font-semibold tracking-[0.24em]"
                style={{ fontFamily: theme.fontPrimary, color: theme.secondary }}
              >
                {title}
              </p>
            </div>

            <button
              onClick={onNext}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] transition-all hover:scale-[1.02]"
              style={{
                background: `linear-gradient(90deg, ${theme.primary}20, ${theme.accent}40)`,
                borderColor: theme.cardBorder,
                color: theme.secondary,
                boxShadow: `0 0 18px rgba(221, 168, 83, 0.12)`,
                fontFamily: theme.fontPrimary,
              }}
            >
              <SkipForward className="h-4 w-4" />
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex w-full items-center justify-center pt-20 pb-2 md:pt-24">
        <div className="w-full max-w-7xl">{children}</div>
      </div>
    </div>
  );
}

// --- 4. Main Controller ---
export default function TrackerV2() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [showRawJson, setShowRawJson] = useState(false);
  const [userId, setUserId] = useState<string>("guest");
  const [trackerPlayCount, setTrackerPlayCount] = useState<number | null>(null);
  const [trackerStatsLoading, setTrackerStatsLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(GAME_TIME_LIMIT_SECONDS);
  const stepAdvanceLockRef = useRef(false);

  const [mlPayload, setMlPayload] = useState<any>({
    timestamp: 0,
    userId: "",
    assigned_target_domain: "",
    games: {},
  });

  useEffect(() => {
    const id = localStorage.getItem("userId") || "guest";
    // Secretly pick a random domain to prevent bias
    const randomTarget = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];

    setUserId(id);
    setSelectedDomain(randomTarget);
    setMlPayload((prev: any) => ({
      ...prev,
      timestamp: Date.now(),
      userId: id,
      assigned_target_domain: randomTarget,
    }));

    const loadTrackerStats = async () => {
      setTrackerStatsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/tracker/quiz/stats/${id}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load tracker stats");
        }

        const result = await response.json();
        setTrackerPlayCount(Number(result.playCount ?? 0));
      } catch (error) {
        console.error("Tracker stats fetch error:", error);
        setTrackerPlayCount(0);
      } finally {
        setTrackerStatsLoading(false);
      }
    };

    loadTrackerStats();
  }, []);

  useEffect(() => {
    if (currentStep < 1 || currentStep > 5) {
      setRemainingTime(GAME_TIME_LIMIT_SECONDS);
      return;
    }

    stepAdvanceLockRef.current = false;
    setRemainingTime(GAME_TIME_LIMIT_SECONDS);

    const timer = window.setInterval(() => {
      setRemainingTime((timeLeft) => Math.max(timeLeft - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [currentStep]);

  useEffect(() => {
    if (currentStep < 1 || currentStep > 5 || remainingTime > 0) {
      return;
    }

    const activeGame = GAME_STEPS[currentStep - 1];

    if (activeGame && !stepAdvanceLockRef.current) {
      stepAdvanceLockRef.current = true;
      setMlPayload((prev: any) => ({
        ...prev,
        games: {
          ...prev.games,
          [activeGame.id]: {
            status: "timeout",
            skipped: true,
            autoAdvanced: true,
            timeLimitSec: GAME_TIME_LIMIT_SECONDS,
            timeSpentSec: GAME_TIME_LIMIT_SECONDS,
            timeRemainingSec: 0,
          },
        },
      }));
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  }, [currentStep, remainingTime]);

  const handleGameAdvance = (
    gameId: string,
    metrics: any,
    status: "completed" | "skipped" | "timeout",
  ) => {
    if (stepAdvanceLockRef.current) {
      return;
    }

    stepAdvanceLockRef.current = true;
    setMlPayload((prev: any) => ({
      ...prev,
      games: {
        ...prev.games,
        [gameId]: {
          ...(metrics || {}),
          status,
          skipped: status !== "completed",
          autoAdvanced: status === "timeout",
          timeLimitSec: GAME_TIME_LIMIT_SECONDS,
          timeSpentSec: Math.max(0, GAME_TIME_LIMIT_SECONDS - remainingTime),
          timeRemainingSec: Math.max(0, remainingTime),
        },
      },
    }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleGameComplete = (gameId: string, metrics: any) => {
    handleGameAdvance(gameId, metrics, "completed");
  };

  const handleSkipCurrentGame = () => {
    const activeGame = GAME_STEPS[currentStep - 1];

    if (!activeGame) {
      return;
    }

    handleGameAdvance(activeGame.id, { reason: "Skipped by user" }, "skipped");
  };

  const submitToBackend = async () => {
    try {
      const API_URL = "http://localhost:5000/tracker/quiz/save";
      console.log("Sending ML Payload to Backend:", mlPayload);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mlPayload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Telemetry successfully synced to AI backend!");
        window.location.href = "/phase1"; // or wherever you redirect
      } else {
        alert(`Failed to sync profile: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className="relative flex w-full min-h-[calc(100vh-70px)] flex-col items-center justify-center overflow-hidden font-sans text-white selection:bg-cyan-500/30">
      <AmbientBackground theme={GLOBAL_THEME} />

      {/* Global Progress HUD */}
      {/* <AnimatePresence>
        {currentStep > 0 && currentStep < 6 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-0 w-full z-20 px-4 flex justify-end items-center pointer-events-none md:px-8"
          >
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2 hidden md:block">
                Phase
              </span>
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className="w-2 h-2 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor:
                      currentStep > step
                        ? GLOBAL_THEME.success
                        : currentStep === step
                          ? GLOBAL_THEME.primary
                          : "#374151",
                    boxShadow:
                      currentStep >= step
                        ? `0 0 10px ${currentStep > step ? GLOBAL_THEME.success : GLOBAL_THEME.primary}`
                        : "none",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Main Content Area */}
      <div className="relative z-10 flex h-full w-full items-center justify-center min-h-[calc(100vh-70px)]">
        <AnimatePresence mode="wait">
          {/* STEP 0: TAROT ONBOARDING */}
          {currentStep === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full max-w-6xl px-4 flex flex-col items-center"
            >
              <div className="text-center mb-12 flex flex-col items-center">
                <div className="relative inline-flex items-center justify-center gap-3">
                  <h1
                    className="text-4xl md:text-5xl font-bold tracking-widest"
                    style={{ fontFamily: GLOBAL_THEME.fontPrimary }}
                  >
                    Tracker V2
                  </h1>

                  {/* TOOLTIP ICON */}
                  <div className="relative group flex items-center mt-1">
                    <Info
                      className="w-7 h-7 opacity-60 hover:opacity-100 transition-opacity cursor-help"
                      style={{ color: GLOBAL_THEME.primary }}
                    />

                    {/* The Tooltip Dropdown */}
                    <div
                      className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-64 p-4 rounded-2xl shadow-2xl text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 text-center scale-95 group-hover:scale-100 backdrop-blur-xl border"
                      style={{
                        backgroundColor: GLOBAL_THEME.cardBg,
                        borderColor: GLOBAL_THEME.cardBorder,
                        color: "#e5e7eb",
                      }}
                    >
                      Prepare for a 5-stage behavioral assessment. Flip the
                      cards to review the protocols, then initialize the games.
                      {/* Tooltip Arrow */}
                      {/* <div
                        className="absolute -bottom-2  -translate-x-1/2 border-8 border-transparent"
                        style={{ borderTopColor: GLOBAL_THEME.cardBorder }}
                      ></div> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 inline-flex items-center gap-3 rounded-full border px-5 py-3 text-sm backdrop-blur-md" style={{ background: GLOBAL_THEME.cardBg, borderColor: GLOBAL_THEME.cardBorder }}>
                <span className="text-gray-400 uppercase tracking-[0.35em] text-[10px]">
                  Previous tracker runs
                </span>
                <span className="text-base font-semibold tracking-[0.25em]" style={{ color: GLOBAL_THEME.secondary, fontFamily: GLOBAL_THEME.fontPrimary }}>
                  {trackerStatsLoading ? "SYNCING" : trackerPlayCount ?? 0}
                </span>
              </div>

              {/* 3D Tarot Cards Grid */}
              <div className="flex flex-wrap justify-center gap-6 mb-12 perspective-[1000px]">
                {TAROT_CARDS.map((card, idx) => (
                  <TarotCard
                    key={card.id}
                    card={card}
                    index={idx}
                    theme={GLOBAL_THEME}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(1)}
                className="relative font-bold py-4 px-10 rounded-xl flex items-center gap-3 tracking-widest border backdrop-blur-md transition-all duration-300"
                style={{
                  background: GLOBAL_THEME.cardBg,
                  borderColor: GLOBAL_THEME.cardBorder,
                  fontFamily: GLOBAL_THEME.fontPrimary,
                  color: GLOBAL_THEME.primary,
                  boxShadow: `0 0 20px rgba(221,168,83,0.15)`,
                }}
              >
                {/* Glow on hover */}
                <span 
                  className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, ${GLOBAL_THEME.primary}20, transparent)`,
                  }}
                />

                <span className="relative z-10 flex items-center gap-3">
                  Lets Begin
                  <ChevronRight
                    className="w-6 h-6"
                    style={{ color: GLOBAL_THEME.primary }}
                  />
                </span>
              </motion.button>
            </motion.div>
          )}

          {/* GAMES (Passing theme and domain down) */}
          {currentStep === 1 && (
            <motion.div
              key="g1"
              className="absolute inset-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <TrackerGameChrome
                theme={GLOBAL_THEME}
                title={GAME_STEPS[0].title}
                stepNumber={1}
                remainingTime={remainingTime}
                playCount={trackerPlayCount}
                playCountLoading={trackerStatsLoading}
                onNext={handleSkipCurrentGame}
              >
                <FinalNeuralLink
                  theme={GLOBAL_THEME}
                  domain={selectedDomain}
                  onComplete={(m) => handleGameComplete("neural_link", m)}
                />
              </TrackerGameChrome>
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              key="g2"
              className="absolute inset-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <TrackerGameChrome
                theme={GLOBAL_THEME}
                title={GAME_STEPS[1].title}
                stepNumber={2}
                remainingTime={remainingTime}
                playCount={trackerPlayCount}
                playCountLoading={trackerStatsLoading}
                onNext={handleSkipCurrentGame}
              >
                <FinalDataStream
                  theme={GLOBAL_THEME}
                  domain={selectedDomain}
                  onComplete={(m) => handleGameComplete("data_stream", m)}
                />
              </TrackerGameChrome>
            </motion.div>
          )}
          {currentStep === 3 && (
            <motion.div
              key="g3"
              className="absolute inset-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <TrackerGameChrome
                theme={GLOBAL_THEME}
                title={GAME_STEPS[2].title}
                stepNumber={3}
                remainingTime={remainingTime}
                playCount={trackerPlayCount}
                playCountLoading={trackerStatsLoading}
                onNext={handleSkipCurrentGame}
              >
                <FinalDataSort
                  theme={GLOBAL_THEME}
                  onComplete={(m) => handleGameComplete("data_sort", m)}
                />
              </TrackerGameChrome>
            </motion.div>
          )}
          {currentStep === 4 && (
            <motion.div
              key="g4"
              className="absolute inset-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <TrackerGameChrome
                theme={GLOBAL_THEME}
                title={GAME_STEPS[3].title}
                stepNumber={4}
                remainingTime={remainingTime}
                playCount={trackerPlayCount}
                playCountLoading={trackerStatsLoading}
                onNext={handleSkipCurrentGame}
              >
                <FinalRapidChoice
                  theme={GLOBAL_THEME}
                  onComplete={(m) => handleGameComplete("rapid_choice", m)}
                />
              </TrackerGameChrome>
            </motion.div>
          )}
          {currentStep === 5 && (
            <motion.div
              key="g5"
              className="absolute inset-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <TrackerGameChrome
                theme={GLOBAL_THEME}
                title={GAME_STEPS[4].title}
                stepNumber={5}
                remainingTime={remainingTime}
                playCount={trackerPlayCount}
                playCountLoading={trackerStatsLoading}
                onNext={handleSkipCurrentGame}
              >
                <FinalOddManOut
                  theme={GLOBAL_THEME}
                  onComplete={(m) => handleGameComplete("odd_man_out", m)}
                />
              </TrackerGameChrome>
            </motion.div>
          )}

          {/* STEP 6: OUTPUT */}
          {currentStep === 6 && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-5xl z-20 p-4"
            >
              <div
                className="backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border"
                style={{
                  backgroundColor: GLOBAL_THEME.cardBg,
                  borderColor: GLOBAL_THEME.cardBorder,
                }}
              >
                <div className="flex justify-between items-center border-b border-gray-800 pb-6 mb-6">
                  <div>
                    <h2
                      className="text-3xl font-bold tracking-widest"
                      style={{ fontFamily: GLOBAL_THEME.fontPrimary }}
                    >
                      TELEMETRY COMPILED
                    </h2>
                    <p className="text-gray-400 font-mono mt-1">
                      Ready for Machine Learning ingestion.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowRawJson(!showRawJson)}
                    className="flex items-center gap-2 bg-black/40 hover:bg-black/60 px-4 py-2 rounded-lg border border-white/10 transition-colors font-mono text-sm"
                  >
                    <Terminal className="w-4 h-4" />{" "}
                    {showRawJson ? "View Dashboard" : "View Raw JSON"}
                  </button>
                </div>

                {!showRawJson ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {Object.entries(mlPayload.games).map(
                      ([gameName, data]: [string, any]) => (
                        <div
                          key={gameName}
                          className="bg-black/30 p-5 rounded-2xl border border-white/5"
                        >
                          <h3
                            className="font-bold uppercase text-sm tracking-widest mb-4 border-b border-white/10 pb-2 flex items-center gap-2"
                            style={{ color: GLOBAL_THEME.primary }}
                          >
                            <CheckCircle2 className="w-4 h-4" />{" "}
                            {gameName.replace(/_/g, " ")}
                          </h3>
                          <div className="space-y-3">
                            {Object.entries(data).map(
                              ([key, val]: [string, any]) => (
                                <div
                                  key={key}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <span className="text-gray-400 capitalize">
                                    {key.replace(/_/g, " ")}
                                  </span>
                                  <span className="text-white font-mono bg-white/10 px-2 py-1 rounded">
                                    {typeof val === "number"
                                      ? val.toFixed(2)
                                      : typeof val === "object"
                                        ? "{...}"
                                        : val}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="bg-black/80 p-6 rounded-2xl border border-gray-800 mb-8 overflow-x-auto max-h-[50vh]">
                    <pre
                      className="font-mono text-sm whitespace-pre-wrap"
                      style={{ color: GLOBAL_THEME.success }}
                    >
                      {JSON.stringify(mlPayload, null, 2)}
                    </pre>
                  </div>
                )}

                <button
                  onClick={submitToBackend}
                  className="w-full font-bold tracking-widest py-5 rounded-xl transition-all hover:scale-[1.01] shadow-lg flex justify-center items-center gap-3 text-lg text-gray-900"
                  style={{
                    background: `linear-gradient(90deg, ${GLOBAL_THEME.primary}, ${GLOBAL_THEME.secondary})`,
                  }}
                >
                  <Database className="w-6 h-6" /> INGEST TO ML PIPELINE
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- 5. Interactive 3D Tarot Card Component ---
function TarotCard({
  card,
  index,
  theme,
}: {
  card: any;
  index: number;
  theme: any;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="w-48 h-72 cursor-pointer relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="w-full h-full relative preserve-3d duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl border flex flex-col items-center justify-center p-4 shadow-xl hover:shadow-2xl transition-shadow"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
            backfaceVisibility: "hidden",
          }}
        >
          <card.icon
            className="w-16 h-16 mb-4 opacity-80"
            style={{ color: theme.primary }}
          />
          <h3
            className="font-bold text-center tracking-widest text-sm"
            style={{ fontFamily: theme.fontPrimary }}
          >
            {card.title}
          </h3>
          <p className="text-xs text-gray-400 mt-2 text-center">{card.desc}</p>
        </div>

        {/* Back of Card (Instructions) */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl border flex flex-col items-center justify-center p-5 shadow-xl"
          style={{
            backgroundColor: theme.secondary,
            borderColor: theme.cardBorder,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h3
            className="font-bold text-gray-900 text-sm mb-3 tracking-widest"
            style={{ fontFamily: theme.fontPrimary }}
          >
            PROTOCOL
          </h3>
          <p className="text-xs text-gray-900 text-center leading-relaxed font-medium">
            {card.instructions}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
