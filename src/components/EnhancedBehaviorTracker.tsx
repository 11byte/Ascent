"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

// THEME TYPE
interface TrackerTheme {
  tBorder: { light: string; dark: string };
  tColor: { light: string; dark: string };
  tDepthColor: { light: string; dark: string };
}

// TYPES
interface TrackerData {
  questions: Question[];
  activities: Activity[];
  skillAssessments: SkillAssessment[];
  domainChallenges: DomainChallenge[];
}
interface Question {
  id: number;
  question: string;
  options: string[];
  category: "preference" | "behavior" | "interest" | "approach";
}
interface Activity {
  id: number;
  type: "ranking" | "matching" | "scenario" | "preference";
  title: string;
  description: string;
  data: any;
}
interface SkillAssessment {
  id: number;
  domain: string;
  questions: { question: string; options: string[]; correctAnswer?: number }[];
}
interface DomainChallenge {
  id: number;
  domain: string;
  challenge: string;
  type: "creative" | "problem-solving" | "analytical";
  prompt: string;
}
interface BehaviorTrackerProps {
  phase: "phase1" | "phase2" | "phase3" | "phase4";
  theme: TrackerTheme;
}

// ---- Design tokens
const useThemeTokens = (theme: TrackerTheme) => {
  return {
    border: theme.tBorder.light,
    text: theme.tColor.light,
    depth: theme.tDepthColor.light,
  };
};

// SIMPLE CARD
const ThemeCard = ({
  children,
  theme,
  className = "",
  style,
}: {
  children: React.ReactNode;
  theme: TrackerTheme;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const t = useThemeTokens(theme);
  return (
    <motion.div
      className={`rounded-2xl p-6 shadow-lg border ${className}`}
      style={{
        borderColor: t.border,
        background: "#ffffff",
        color: t.text,
        ...style,
      }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      {children}
    </motion.div>
  );
};

// Small components
const PhasePill = ({
  phase,
  theme,
}: {
  phase: string;
  theme: TrackerTheme;
}) => {
  const t = useThemeTokens(theme);
  return (
    <span
      className="text-xs font-semibold tracking-wide px-3 py-1 rounded-full"
      style={{
        background: t.depth,
        color: "#0F172A",
        border: `1px solid ${t.border}`,
      }}
    >
      {phase.toUpperCase()}
    </span>
  );
};

const Stat = ({
  label,
  value,
  theme,
}: {
  label: string;
  value: string | number;
  theme: TrackerTheme;
}) => {
  const t = useThemeTokens(theme);
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl p-3 border"
      style={{ borderColor: t.border, background: "#fff" }}
    >
      <div className="text-xl font-bold" style={{ color: t.text }}>
        {value}
      </div>
      <div className="text-xs opacity-70" style={{ color: "#334155" }}>
        {label}
      </div>
    </div>
  );
};

const ProgressRing = ({
  progress,
  size = 96,
  stroke = 10,
  theme,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  theme: TrackerTheme;
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const t = useThemeTokens(theme);

  return (
    <svg width={size} height={size}>
      <circle
        stroke="#E5E7EB"
        fill="transparent"
        strokeWidth={stroke}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        stroke={t.border}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ rotate: "-90deg", originX: "50%", originY: "50%" }}
        initial={{
          strokeDasharray: circumference,
          strokeDashoffset: circumference,
        }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.6 }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        style={{ fontSize: 16, fontWeight: 700, fill: "#0F172A" }}
      >
        {progress}%
      </text>
    </svg>
  );
};

const Stepper = ({
  steps,
  active,
  theme,
  onJump,
}: {
  steps: { key: string; label: string; icon: string }[];
  active: number;
  theme: TrackerTheme;
  onJump?: (index: number) => void;
}) => {
  const t = useThemeTokens(theme);
  return (
    <div className="flex items-center justify-between gap-2">
      {steps.map((s, idx) => {
        const isActive = idx === active;
        const isDone = idx < active;
        return (
          <button
            key={s.key}
            onClick={() => onJump?.(idx)}
            className="flex-1"
            style={{ cursor: onJump ? "pointer" : "default" }}
            aria-current={isActive ? "step" : undefined}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{
                borderColor: isActive || isDone ? t.border : "#E5E7EB",
                background: isActive ? t.depth : "#fff",
              }}
            >
              <span className="text-lg">{s.icon}</span>
              <span
                className="text-sm font-medium"
                style={{ color: isActive ? "#0F172A" : "#334155" }}
              >
                {s.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const Badge = ({ label }: { label: string }) => (
  <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
    {label}
  </span>
);

export default function EnhancedBehaviorTracker({
  phase,
  theme,
}: BehaviorTrackerProps) {
  // Phase config
  const phaseConfigs = {
    phase1: {
      name: "Explorer",
      endpoint: "/api/tracker/simple",
      fallbackFile: "phase1trackerdata.json",
    },
    phase2: {
      name: "Developer",
      endpoint: "/api/tracker/moderate",
      fallbackFile: "phase2trackerdata.json",
    },
    phase3: {
      name: "Specialist",
      endpoint: "/api/tracker/hard",
      fallbackFile: "phase3trackerdata.json",
    },
    phase4: {
      name: "Expert",
      endpoint: "/api/tracker/veryhard",
      fallbackFile: "phase4trackerdata.json",
    },
  } as const;
  const config = phaseConfigs[phase];
  const t = useThemeTokens(theme);

  // Data State
  const [trackerData, setTrackerData] = useState<TrackerData | null>(null);
  const [loading, setLoading] = useState(true);

  // Flow state
  const [currentSection, setCurrentSection] = useState<
    | "intro"
    | "questions"
    | "activities"
    | "assessment"
    | "challenges"
    | "results"
  >("intro");

  // Separate per-section indices (so you can perform ALL items)
  const [qIndex, setQIndex] = useState(0);
  const [aIndex, setAIndex] = useState(0);
  const [sIndex, setSIndex] = useState(0);
  const [cIndex, setCIndex] = useState(0);

  // Responses
  const [responses, setResponses] = useState<any[]>([]);

  // Gamification
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [achievements, setAchievements] = useState<string[]>([]);

  // Profile
  const [userProfile, setUserProfile] = useState({
    techInterests: {} as Record<string, number>,
    behaviorPattern: "",
    preferredLearningStyle: "",
    problemSolvingApproach: "",
    domains: ["AI/ML", "Web Dev", "Cybersecurity", "Data Analytics", "IoT"],
  });

  // Load data
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const loadTrackerData = async () => {
      try {
        const response = await fetch(config.endpoint, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Primary API failed");
        const data = await response.json();
        if (isMounted) setTrackerData(data);
      } catch {
        try {
          const fallbackResponse = await fetch(`/data/${config.fallbackFile}`, {
            signal: controller.signal,
          });
          const fallbackData = await fallbackResponse.json();
          if (isMounted) setTrackerData(fallbackData);
        } catch {
          if (isMounted)
            setTrackerData({
              questions: [],
              activities: [],
              skillAssessments: [],
              domainChallenges: [],
            });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadTrackerData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [config.endpoint, config.fallbackFile]);

  // Derived
  const steps = useMemo(
    () => [
      { key: "questions", label: "Questions", icon: "❓" },
      { key: "activities", label: "Activities", icon: "🎯" },
      { key: "assessment", label: "Assessment", icon: "📊" },
      { key: "challenges", label: "Challenges", icon: "🏆" },
      { key: "results", label: "Results", icon: "✨" },
    ],
    []
  );

  const sectionData = useMemo(() => {
    if (!trackerData) return [];
    switch (currentSection) {
      case "questions":
        return trackerData.questions;
      case "activities":
        return trackerData.activities;
      case "assessment":
        return trackerData.skillAssessments;
      case "challenges":
        return trackerData.domainChallenges;
      default:
        return [];
    }
  }, [trackerData, currentSection]);

  const sectionIndex = useMemo(() => {
    switch (currentSection) {
      case "questions":
        return qIndex;
      case "activities":
        return aIndex;
      case "assessment":
        return sIndex;
      case "challenges":
        return cIndex;
      default:
        return 0;
    }
  }, [currentSection, qIndex, aIndex, sIndex, cIndex]);

  const setSectionIndex = useCallback(
    (val: number) => {
      switch (currentSection) {
        case "questions":
          setQIndex(val);
          break;
        case "activities":
          setAIndex(val);
          break;
        case "assessment":
          setSIndex(val);
          break;
        case "challenges":
          setCIndex(val);
          break;
      }
    },
    [currentSection]
  );

  // Helper to set index for a target section (used on stepper jump)
  const setIndexFor = useCallback((key: string, val: number) => {
    switch (key) {
      case "questions":
        setQIndex(val);
        break;
      case "activities":
        setAIndex(val);
        break;
      case "assessment":
        setSIndex(val);
        break;
      case "challenges":
        setCIndex(val);
        break;
    }
  }, []);

  // Clamp index when section or data changes
  useEffect(() => {
    const len = sectionData.length;
    if (len > 0 && sectionIndex >= len) {
      setSectionIndex(0);
    }
  }, [currentSection, sectionData.length, sectionIndex, setSectionIndex]);

  // Totals and progress (unique items completed)
  const totalItems = useMemo(() => {
    if (!trackerData) return 0;
    return (
      (trackerData.questions?.length || 0) +
      (trackerData.activities?.length || 0) +
      (trackerData.skillAssessments?.length || 0) +
      (trackerData.domainChallenges?.length || 0)
    );
  }, [trackerData]);

  const getTotalProgress = useCallback(() => {
    if (!trackerData) return 0;
    if (currentSection === "results") return 100;

    const qIds = new Set<number>();
    const aIds = new Set<number>();
    const sIds = new Set<number>();
    const cIds = new Set<number>();

    for (const r of responses) {
      if (typeof r.questionId === "number") qIds.add(r.questionId);
      if (typeof r.activityId === "number") aIds.add(r.activityId);
      if (typeof r.assessmentId === "number") sIds.add(r.assessmentId);
      if (typeof r.challengeId === "number") cIds.add(r.challengeId);
    }

    const done = qIds.size + aIds.size + sIds.size + cIds.size;
    return totalItems > 0 ? Math.round((done / totalItems) * 100) : 0;
  }, [trackerData, currentSection, responses, totalItems]);

  // Gamification helpers
  const grantXP = (amount: number) => setXp((prev) => prev + amount);
  const unlockAchievement = (label: string) =>
    setAchievements((prev) => (prev.includes(label) ? prev : [...prev, label]));

  // Navigation inside current section
  const moveToNextSection = useCallback(() => {
    setCurrentSection((prevSection) => {
      switch (prevSection) {
        case "intro":
          return trackerData && trackerData.questions.length
            ? "questions"
            : "activities";
        case "questions":
          return "activities";
        case "activities":
          return "assessment";
        case "assessment":
          return "challenges";
        case "challenges":
          return "results";
        default:
          return "results";
      }
    });
  }, [trackerData]);

  const goPrev = useCallback(() => {
    if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
  }, [sectionIndex, setSectionIndex]);

  const goNext = useCallback(() => {
    const len = sectionData.length;
    if (len === 0) {
      moveToNextSection();
      return;
    }
    if (sectionIndex < len - 1) {
      setSectionIndex(sectionIndex + 1);
    } else {
      moveToNextSection();
    }
  }, [sectionData.length, sectionIndex, setSectionIndex, moveToNextSection]);

  const handleResponse = useCallback(
    (response: any, opts?: { xp?: number; achievement?: string }) => {
      setResponses((prev) => [...prev, response]);
      setUserProfile((prev) => {
        const updated = { ...prev };
        if (response.category === "preference") {
          response.selectedDomains?.forEach((domain: string) => {
            updated.techInterests[domain] =
              (updated.techInterests[domain] || 0) + 1;
          });
        }
        if (response.type === "scenario" && response.selectedScenario?.domain) {
          const d = response.selectedScenario.domain;
          updated.techInterests[d] = (updated.techInterests[d] || 0) + 1;
        }
        return updated;
      });
      if (opts?.xp) grantXP(opts.xp);
      if (opts?.achievement) unlockAchievement(opts.achievement);
      goNext();
    },
    [goNext]
  );

  // UI loading
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          style={{
            border: `6px solid ${t.border}`,
            borderTopColor: "transparent",
            borderRadius: "50%",
          }}
          className="w-16 h-16"
          aria-label="Loading"
        />
      </div>
    );
  }

  // Layout
  const activeStep = Math.max(
    0,
    steps.findIndex(
      (s) =>
        s.key === (currentSection === "intro" ? "questions" : currentSection)
    )
  );

  // Current index alias for UI controls
  const currentIndex = sectionIndex;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl md:text-3xl font-extrabold"
              style={{ color: "#0F172A" }}
            >
              Behavior Tracker
            </h1>
            <PhasePill phase={config.name} theme={theme} />
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Badge label="Adaptive" />
            <Badge label="Gamified" />
            <Badge label="Personalized" />
          </div>
        </div>
        <div className="mt-4">
          <Stepper
            steps={steps}
            active={activeStep}
            theme={theme}
            onJump={(idx) => {
              const target = steps[idx].key as typeof currentSection;
              if (target === "results") return;
              setCurrentSection(target);
              // Start each section at its first item on jump
              setIndexFor(target, 0);
            }}
          />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main */}
        <div className="space-y-6">
          {/* Progress block */}
          <ThemeCard theme={theme}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ background: t.border }}
                    initial={{ width: 0 }}
                    animate={{ width: `${getTotalProgress()}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-slate-600">
                  <span>Overall Progress</span>
                  <span className="font-semibold" style={{ color: "#0F172A" }}>
                    {getTotalProgress()}%
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <ProgressRing progress={getTotalProgress()} theme={theme} />
              </div>
            </div>
          </ThemeCard>

          {/* Sections */}
          <AnimatePresence mode="wait">
            {currentSection === "intro" && (
              <IntroSection
                key="intro"
                theme={theme}
                config={config}
                onStart={() => setCurrentSection("questions")}
              />
            )}

            {currentSection === "questions" && trackerData && (
              <QuestionsSection
                key={`q-${currentIndex}`}
                theme={theme}
                questions={trackerData.questions}
                currentIndex={currentIndex}
                onResponse={(resp: any) => handleResponse(resp, { xp: 5 })}
              />
            )}

            {currentSection === "activities" && trackerData && (
              <ActivitiesSection
                key={`a-${currentIndex}`}
                theme={theme}
                activities={trackerData.activities}
                currentIndex={currentIndex}
                onResponse={(resp: any) => handleResponse(resp, { xp: 10 })}
              />
            )}

            {currentSection === "assessment" && trackerData && (
              <AssessmentSection
                key={`s-${currentIndex}`}
                theme={theme}
                assessments={trackerData.skillAssessments}
                currentIndex={currentIndex}
                onResponse={(resp: any) =>
                  handleResponse(resp, { xp: 15, achievement: "Quiz Whiz" })
                }
              />
            )}

            {currentSection === "challenges" && trackerData && (
              <ChallengesSection
                key={`c-${currentIndex}`}
                theme={theme}
                challenges={trackerData.domainChallenges}
                currentIndex={currentIndex}
                onResponse={(resp: any) =>
                  handleResponse(resp, {
                    xp: 25,
                    achievement: "Creative Thinker",
                  })
                }
              />
            )}

            {currentSection === "results" && trackerData && (
              <ResultsSection
                key="results"
                theme={theme}
                userProfile={userProfile}
                responses={responses}
                xp={xp}
                streak={streak}
                achievements={achievements}
              />
            )}
          </AnimatePresence>

          {/* Navigation controls */}
          {currentSection !== "results" && currentSection !== "intro" && (
            <div className="flex items-center justify-between">
              <button
                onClick={goPrev}
                className="px-4 py-2 rounded-lg border text-sm font-medium"
                style={{
                  borderColor: t.border,
                  color: "#334155",
                  background: "#fff",
                }}
                disabled={currentIndex === 0}
              >
                ← Back
              </button>
              <button
                onClick={goNext}
                className="px-4 py-2 rounded-lg text-sm font-semibold shadow"
                style={{ background: t.border, color: "#0F172A" }}
              >
                Skip →
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <ThemeCard theme={theme}>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                style={{
                  background: t.depth,
                  color: "#0F172A",
                  border: `1px solid ${t.border}`,
                }}
                aria-label="User avatar"
              >
                U
              </div>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "#0F172A" }}
                >
                  Your Journey
                </div>
                <div className="text-xs text-slate-600">
                  Keep up the momentum!
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Stat label="XP" value={xp} theme={theme} />
              <Stat label="Streak" value={`${streak}d`} theme={theme} />
              <Stat label="Badges" value={achievements.length} theme={theme} />
            </div>
          </ThemeCard>

          <ThemeCard theme={theme}>
            <div className="flex items-center justify-between">
              <div className="font-semibold" style={{ color: "#0F172A" }}>
                Achievements
              </div>
              <span className="text-xs text-slate-500">
                {achievements.length}/8
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {achievements.length === 0 ? (
                <span className="text-xs text-slate-500">
                  No badges yet — earn XP to unlock!
                </span>
              ) : (
                achievements.map((a) => (
                  <span
                    key={a}
                    className="px-2 py-1 rounded-md text-[10px] font-semibold border"
                    style={{
                      background: t.depth,
                      borderColor: t.border,
                      color: "#0F172A",
                    }}
                    title={a}
                  >
                    {a}
                  </span>
                ))
              )}
            </div>
          </ThemeCard>

          <ThemeCard theme={theme}>
            <div className="font-semibold" style={{ color: "#0F172A" }}>
              Tips to Maximize XP
            </div>
            <ul className="list-disc pl-5 mt-2 text-sm text-slate-600 space-y-1">
              <li>Answer every question to boost your accuracy score.</li>
              <li>Complete activities for bonus XP.</li>
              <li>Write detailed challenge responses to unlock badges.</li>
            </ul>
          </ThemeCard>
        </div>
      </div>
    </div>
  );
}

// --- Section Components ---

function IntroSection({ theme, config, onStart }: any) {
  const t = useThemeTokens(theme);
  return (
    <ThemeCard theme={theme} className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold mb-2"
        style={{ color: "#0F172A" }}
      >
        Welcome to the {config.name} Journey 🚀
      </motion.h2>
      <p className="text-slate-600 max-w-2xl mx-auto">
        Discover your strengths, interests, and learning preferences through
        short, fun, and adaptive activities.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        {[
          { icon: "❓", title: "Questions" },
          { icon: "🎯", title: "Activities" },
          { icon: "📊", title: "Assessments" },
          { icon: "🏆", title: "Challenges" },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-xl shadow-sm border"
            style={{ borderColor: t.border, background: "#fff" }}
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="text-sm font-semibold">{item.title}</div>
          </div>
        ))}
      </div>
      <motion.button
        onClick={onStart}
        className="px-6 py-3 rounded-xl font-semibold shadow"
        style={{ background: t.border, color: "#0F172A" }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        Start Now
      </motion.button>
    </ThemeCard>
  );
}

function QuestionsSection({
  theme,
  questions,
  currentIndex,
  onResponse,
}: {
  theme: TrackerTheme;
  questions: Question[];
  currentIndex: number;
  onResponse: (r: any) => void;
}) {
  if (!questions || questions.length === 0 || currentIndex >= questions.length)
    return null;
  const question = questions[currentIndex];
  const t = useThemeTokens(theme);

  return (
    <ThemeCard theme={theme}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-slate-600">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <Badge label={question.category.toUpperCase()} />
      </div>
      <h2 className="text-xl font-bold mb-4" style={{ color: "#0F172A" }}>
        {question.question}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option: string, index: number) => (
          <motion.button
            key={index}
            onClick={() =>
              onResponse({
                questionId: question.id,
                answer: option,
                category: question.category,
              })
            }
            className="p-4 rounded-xl border text-left"
            style={{
              background: "#fff",
              color: "#0F172A",
              borderColor: t.border,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-semibold mr-2 text-slate-700">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </motion.button>
        ))}
      </div>
    </ThemeCard>
  );
}

function ActivitiesSection({
  theme,
  activities,
  currentIndex,
  onResponse,
}: {
  theme: TrackerTheme;
  activities: Activity[];
  currentIndex: number;
  onResponse: (r: any) => void;
}) {
  if (
    !activities ||
    activities.length === 0 ||
    currentIndex >= activities.length
  )
    return null;
  const activity = activities[currentIndex];
  const t = useThemeTokens(theme);

  return (
    <ThemeCard theme={theme}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-slate-600">
          Activity {currentIndex + 1} of {activities.length}
        </span>
        <Badge label={activity.type.toUpperCase()} />
      </div>
      <h2 className="text-xl font-bold mb-1" style={{ color: "#0F172A" }}>
        {activity.title}
      </h2>
      <p className="text-slate-600 mb-6">{activity.description}</p>

      {activity.type === "ranking" && (
        <RankingActivity
          activity={activity}
          theme={theme}
          onResponse={onResponse}
        />
      )}
      {activity.type === "matching" && (
        <MatchingActivity
          activity={activity}
          theme={theme}
          onResponse={onResponse}
        />
      )}
      {activity.type === "scenario" && (
        <ScenarioActivity
          activity={activity}
          theme={theme}
          onResponse={onResponse}
        />
      )}
      {activity.type === "preference" && (
        <PreferenceActivity
          activity={activity}
          theme={theme}
          onResponse={onResponse}
        />
      )}

      <div className="mt-6 text-xs text-slate-500">
        Complete this activity to earn bonus XP.
      </div>
    </ThemeCard>
  );
}

function RankingActivity({ activity, theme, onResponse }: any) {
  const t = useThemeTokens(theme);
  const [items, setItems] = useState<string[]>(
    activity.data.domains ||
      activity.data.stacks ||
      activity.data.technologies ||
      activity.data.moonshots ||
      []
  );

  const submitRanking = () =>
    onResponse({
      activityId: activity.id,
      type: "ranking",
      rankings: items,
      completeness: items.length > 0 ? 1 : 0,
    });

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Drag to reorder your preference (top = highest)
      </p>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-3"
      >
        {items.map((item: string) => (
          <Reorder.Item
            key={item}
            value={item}
            className="p-4 rounded-xl border flex items-center justify-between bg-white"
            style={{ borderColor: t.border }}
            whileDrag={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-slate-400">⠿</span>
              <span className="font-medium text-slate-800">{item}</span>
            </div>
            <span className="text-xs text-slate-500">drag</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <motion.button
        onClick={submitRanking}
        className="w-full px-6 py-3 rounded-xl font-semibold shadow"
        style={{ background: t.border, color: "#0F172A" }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Submit Ranking
      </motion.button>
    </div>
  );
}

function MatchingActivity({ activity, theme, onResponse }: any) {
  const t = useThemeTokens(theme);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const technologies = activity.data.technologies || [];
  const useCases =
    activity.data.applications ||
    activity.data.useCases ||
    activity.data.convergences ||
    [];

  const handleTechSelect = (tech: string) => setSelectedTech(tech);
  const handleUseCaseSelect = (useCase: string) => {
    if (selectedTech) {
      setMatches((prev) => ({ ...prev, [selectedTech]: useCase }));
      setSelectedTech(null);
    }
  };
  const removeMatch = (tech: string) => {
    setMatches((prev) => {
      const next = { ...prev };
      delete next[tech];
      return next;
    });
  };
  const submitMatches = () =>
    onResponse({
      activityId: activity.id,
      type: "matching",
      matches,
      completeness: Object.keys(matches).length / technologies.length,
    });

  const matchedUseCases = new Set(Object.values(matches));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tech list */}
        <div>
          <div className="text-sm font-semibold text-slate-700 mb-2">
            Technologies
          </div>
          <div className="space-y-2">
            {technologies.map((tech: string) => {
              const isSelected = selectedTech === tech;
              const isMatched = !!matches[tech];
              return (
                <button
                  key={tech}
                  onClick={() => !isMatched && handleTechSelect(tech)}
                  className="w-full text-left px-3 py-2 rounded-lg border transition"
                  style={{
                    borderColor: isSelected || isMatched ? t.border : "#E5E7EB",
                    background: isSelected ? t.depth : "#fff",
                    color: "#0F172A",
                    opacity: isMatched ? 0.7 : 1,
                  }}
                  disabled={isMatched}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{tech}</span>
                    {isMatched && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMatch(tech);
                        }}
                        className="text-slate-500 text-sm underline"
                      >
                        remove
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {/* Use cases */}
        <div>
          <div className="text-sm font-semibold text-slate-700 mb-2">
            Applications / Use Cases
          </div>
          <div className="space-y-2">
            {useCases.map((uc: string) => {
              const taken = matchedUseCases.has(uc);
              return (
                <button
                  key={uc}
                  onClick={() =>
                    !taken && selectedTech && handleUseCaseSelect(uc)
                  }
                  className="w-full text-left px-3 py-2 rounded-lg border transition"
                  style={{
                    borderColor: taken ? "#E5E7EB" : t.border,
                    background: taken ? "#F1F5F9" : "#fff",
                    color: taken ? "#94A3B8" : "#0F172A",
                  }}
                  disabled={taken || !selectedTech}
                >
                  {uc}
                </button>
              );
            })}
          </div>
          {selectedTech && (
            <div className="mt-3 text-xs text-slate-600">
              Selected tech:{" "}
              <span className="font-semibold">{selectedTech}</span> — choose a
              use case
            </div>
          )}
        </div>
      </div>

      {Object.keys(matches).length > 0 && (
        <div
          className="rounded-xl border p-3"
          style={{ borderColor: t.border }}
        >
          <div className="text-sm font-semibold text-slate-700 mb-2">
            Your Matches
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(matches).map(([tech, uc]) => (
              <span
                key={tech}
                className="px-2 py-1 rounded-lg text-xs font-semibold border bg-white"
                style={{ borderColor: t.border }}
              >
                {tech} → {uc}
              </span>
            ))}
          </div>
        </div>
      )}

      {Object.keys(matches).length > 0 && (
        <motion.button
          onClick={submitMatches}
          className="w-full px-6 py-3 rounded-xl font-semibold shadow"
          style={{ background: t.border, color: "#0F172A" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Submit Matches ({Object.keys(matches).length}/{technologies.length})
        </motion.button>
      )}
    </div>
  );
}

function ScenarioActivity({ activity, theme, onResponse }: any) {
  const t = useThemeTokens(theme);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [reason, setReason] = useState("");
  const scenarios = activity.data.scenarios || activity.data.approaches || [];

  const submitSelection = () =>
    onResponse({
      activityId: activity.id,
      type: "scenario",
      selectedScenario,
      reasoning: reason || "User preference",
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {scenarios.map((scenario: any, index: number) => {
          const active = selectedScenario === scenario;
          return (
            <motion.div
              key={index}
              onClick={() => setSelectedScenario(scenario)}
              className="p-5 rounded-xl border cursor-pointer"
              style={{
                borderColor: active ? t.border : "#E5E7EB",
                background: active ? t.depth : "#fff",
                color: "#0F172A",
              }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{scenario.title}</h3>
                <div className="flex gap-2">
                  {scenario.domain && <Badge label={scenario.domain} />}
                  {scenario.difficulty && <Badge label={scenario.difficulty} />}
                </div>
              </div>
              <p className="text-slate-700 mt-2">{scenario.description}</p>
            </motion.div>
          );
        })}
      </div>
      {selectedScenario && (
        <>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Why did you choose this?
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly explain your reasoning (optional)"
              className="w-full p-3 rounded-xl border text-sm"
              style={{ borderColor: t.border }}
              rows={3}
            />
          </div>
          <motion.button
            onClick={submitSelection}
            className="w-full px-6 py-3 rounded-xl font-semibold shadow"
            style={{ background: t.border, color: "#0F172A" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Select This Project
          </motion.button>
        </>
      )}
    </div>
  );
}

function PreferenceActivity({ activity, theme, onResponse }: any) {
  const t = useThemeTokens(theme);
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const paths =
    activity.data.paths ||
    activity.data.directions ||
    activity.data.strategies ||
    [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {paths.map((path: any, index: number) => {
          const active = selectedPath === path;
          return (
            <motion.div
              key={index}
              onClick={() => setSelectedPath(path)}
              className="p-5 rounded-xl border cursor-pointer"
              style={{
                borderColor: active ? t.border : "#E5E7EB",
                background: active ? t.depth : "#fff",
                color: "#0F172A",
              }}
              whileHover={{ scale: 1.01 }}
            >
              <h3 className="text-base font-bold">{path.title}</h3>
              <p className="text-slate-700 mt-2 text-sm">{path.description}</p>
            </motion.div>
          );
        })}
      </div>
      {selectedPath && (
        <motion.button
          onClick={() =>
            onResponse({
              activityId: activity.id,
              type: "preference",
              selectedPath,
            })
          }
          className="w-full px-6 py-3 rounded-xl font-semibold shadow"
          style={{ background: t.border, color: "#0F172A" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Choose This Path
        </motion.button>
      )}
    </div>
  );
}

function AssessmentSection({
  theme,
  assessments,
  currentIndex,
  onResponse,
}: {
  theme: TrackerTheme;
  assessments: SkillAssessment[];
  currentIndex: number;
  onResponse: (r: any) => void;
}) {
  if (
    !assessments ||
    assessments.length === 0 ||
    currentIndex >= assessments.length
  )
    return null;
  const assessment = assessments[currentIndex];
  const t = useThemeTokens(theme);

  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Reset inner quiz when the outer assessment index changes
  useEffect(() => {
    setQIdx(0);
    setAnswers([]);
    setShowResults(false);
  }, [currentIndex]);

  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => [...prev, answerIndex]);
    if (qIdx < assessment.questions.length - 1) setQIdx((i) => i + 1);
    else setShowResults(true);
  };

  const score = useMemo(() => {
    let correct = 0;
    assessment.questions.forEach((q, i) => {
      if (q.correctAnswer !== undefined && answers[i] === q.correctAnswer)
        correct++;
    });
    const total = assessment.questions.length;
    return {
      correct,
      total,
      percentage: Math.round((correct / (total || 1)) * 100),
    };
  }, [answers, assessment.questions]);

  const submitAssessment = () => {
    onResponse({
      assessmentId: assessment.id,
      domain: assessment.domain,
      answers,
      score,
    });
  };

  if (showResults) {
    return (
      <ThemeCard theme={theme}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold" style={{ color: "#0F172A" }}>
            {assessment.domain} — Results
          </h2>
          <Badge label="ASSESSMENT" />
        </div>
        <div className="text-center my-4">
          <div className="text-4xl font-extrabold" style={{ color: t.border }}>
            {score.percentage}%
          </div>
          <div className="text-sm text-slate-600">
            {score.correct} out of {score.total} correct
          </div>
        </div>
        <div className="space-y-3 mb-5">
          {assessment.questions.map((q, i) => {
            const isCorrect =
              q.correctAnswer !== undefined && answers[i] === q.correctAnswer;
            return (
              <div
                key={i}
                className="p-3 rounded-lg border"
                style={{
                  borderColor: isCorrect ? "#10B981" : "#EF4444",
                  background: "#fff",
                }}
              >
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  Q{i + 1}: {q.question}
                </p>
                <p className="text-sm text-slate-700">
                  Your answer: {q.options[answers[i]]}
                  {q.correctAnswer !== undefined &&
                    answers[i] !== q.correctAnswer && (
                      <span className="block text-emerald-600">
                        Correct: {q.options[q.correctAnswer]}
                      </span>
                    )}
                </p>
              </div>
            );
          })}
        </div>
        <motion.button
          onClick={submitAssessment}
          className="w-full px-6 py-3 rounded-xl font-semibold shadow"
          style={{ background: t.border, color: "#0F172A" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </ThemeCard>
    );
  }

  const currentQ = assessment.questions[qIdx];

  return (
    <ThemeCard theme={theme}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-slate-600">
          {assessment.domain} — Question {qIdx + 1} of{" "}
          {assessment.questions.length}
        </span>
        <div className="flex gap-1">
          {assessment.questions.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: 28,
                background:
                  i < qIdx ? t.border : i === qIdx ? t.depth : "#E5E7EB",
              }}
            />
          ))}
        </div>
      </div>
      <h2 className="text-lg font-bold mb-4" style={{ color: "#0F172A" }}>
        {currentQ.question}
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {currentQ.options.map((option: string, idx: number) => (
          <motion.button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className="p-4 rounded-xl border text-left"
            style={{
              background: "#fff",
              color: "#0F172A",
              borderColor: t.border,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-semibold mr-2 text-slate-700">
              {String.fromCharCode(65 + idx)}.
            </span>
            {option}
          </motion.button>
        ))}
      </div>
    </ThemeCard>
  );
}

function ChallengesSection({
  theme,
  challenges,
  currentIndex,
  onResponse,
}: {
  theme: TrackerTheme;
  challenges: DomainChallenge[];
  currentIndex: number;
  onResponse: (r: any) => void;
}) {
  const t = useThemeTokens(theme);
  if (
    !challenges ||
    challenges.length === 0 ||
    currentIndex >= challenges.length
  )
    return null;
  const challenge = challenges[currentIndex];
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSubmitted(false);
    setResponse("");
  }, [currentIndex]);

  const minChars = 50;
  const handleSubmit = () => {
    if (response.trim().length < minChars) {
      alert(`Please write at least ${minChars} characters`);
      return;
    }
    setSubmitted(true);
    onResponse({
      challengeId: challenge.id,
      domain: challenge.domain,
      challenge: challenge.challenge,
      response,
      wordCount: response.split(" ").filter(Boolean).length,
    });
  };

  if (submitted) {
    return (
      <ThemeCard theme={theme}>
        <h2
          className="text-xl font-bold text-center mb-4"
          style={{ color: "#0F172A" }}
        >
          Response Submitted 🎉
        </h2>
        <div
          className="p-4 rounded-xl border mb-4"
          style={{ borderColor: t.border, background: "#fff" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge label={challenge.domain} />
            <Badge label={challenge.type} />
          </div>
          <h3 className="font-semibold mb-2">{challenge.challenge}</h3>
          <p className="whitespace-pre-wrap text-slate-700">{response}</p>
          <div className="text-xs text-slate-500 mt-2">
            {response.split(" ").filter(Boolean).length} words
          </div>
        </div>
        <div className="text-center text-sm text-slate-600">
          Great job! Your creativity and reasoning have been recorded.
        </div>
      </ThemeCard>
    );
  }

  return (
    <ThemeCard theme={theme}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-slate-600">
          Challenge {currentIndex + 1} of {challenges.length}
        </span>
        <div className="flex items-center gap-2">
          <Badge label={challenge.domain} />
          <Badge label={challenge.type} />
        </div>
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ color: "#0F172A" }}>
        {challenge.challenge}
      </h2>
      <p className="text-slate-700 mb-4">{challenge.prompt}</p>

      <label className="text-sm font-medium text-slate-700 mb-2 block">
        Your Response
      </label>
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Think deeply, be creative, and explain your approach..."
        className="w-full p-3 rounded-xl border text-sm"
        style={{ borderColor: t.border, background: "#fff" }}
        rows={8}
      />
      <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
        <span>Minimum {minChars} characters required</span>
        <span>
          {response.length} characters |{" "}
          {response.split(" ").filter(Boolean).length} words
        </span>
      </div>

      <motion.button
        onClick={handleSubmit}
        disabled={response.trim().length < minChars}
        className="w-full mt-4 px-6 py-3 rounded-xl font-semibold shadow transition"
        style={{
          background: response.trim().length >= minChars ? t.border : "#E5E7EB",
          color: response.trim().length >= minChars ? "#0F172A" : "#9CA3AF",
          cursor:
            response.trim().length >= minChars ? "pointer" : "not-allowed",
        }}
        whileHover={response.trim().length >= minChars ? { scale: 1.02 } : {}}
        whileTap={response.trim().length >= minChars ? { scale: 0.98 } : {}}
      >
        Submit Response
      </motion.button>
    </ThemeCard>
  );
}

function ResultsSection({
  theme,
  userProfile,
  responses,
  xp,
  streak,
  achievements,
}: {
  theme: TrackerTheme;
  userProfile: { techInterests: Record<string, number> };
  responses: any[];
  xp: number;
  streak: number;
  achievements: string[];
}) {
  const t = useThemeTokens(theme);

  const sectionAnswers = useMemo(() => {
    const result = {
      questions: [] as any[],
      activities: [] as any[],
      assessments: [] as any[],
      challenges: [] as any[],
    };
    for (const resp of responses) {
      if (resp.questionId !== undefined) result.questions.push(resp);
      else if (resp.activityId !== undefined) result.activities.push(resp);
      else if (resp.assessmentId !== undefined) result.assessments.push(resp);
      else if (resp.challengeId !== undefined) result.challenges.push(resp);
    }
    return result;
  }, [responses]);

  const backendPayload = useMemo(
    () => ({
      profile: userProfile,
      questions: sectionAnswers.questions,
      activities: sectionAnswers.activities,
      assessments: sectionAnswers.assessments,
      challenges: sectionAnswers.challenges,
      timestamp: new Date().toISOString(),
    }),
    [userProfile, sectionAnswers]
  );
  const [status, setStatus] = useState("");
  const handleSaveToKafka = async () => {
    try {
      setStatus("Saving...");
      const userId = localStorage.getItem("userId") || "guest";

      const res = await fetch("http://localhost:5000/tracker/quiz/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, data: backendPayload }),
      });

      const result = await res.json();
      if (result.ok) {
        setStatus("✅ Data sent to backend and Kafka successfully!");
      } else {
        setStatus("⚠️ Failed to save data.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setStatus("❌ Error sending data.");
    }
  };

  return (
    <>
      <ThemeCard theme={theme}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold" style={{ color: "#0F172A" }}>
            Your Summary
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Stat label="XP Earned" value={xp} theme={theme} />
          <Stat label="Streak" value={`${streak}d`} theme={theme} />
          <Stat label="Responses" value={responses.length} theme={theme} />
          <Stat label="Badges" value={achievements.length} theme={theme} />
        </div>
      </ThemeCard>

      <ThemeCard theme={theme}>
        <h3 className="text-base font-bold mb-2" style={{ color: "#0F172A" }}>
          Interest Signals
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(userProfile.techInterests).length === 0 ? (
            <span className="text-sm text-slate-600">No signals captured.</span>
          ) : (
            Object.entries(userProfile.techInterests)
              .sort((a: any, b: any) => b[1] - a[1])
              .map(([domain, score]) => (
                <span
                  key={domain}
                  className="px-2 py-1 rounded-lg text-xs font-semibold border bg-white"
                  style={{ borderColor: t.border }}
                >
                  {domain}: {score}
                </span>
              ))
          )}
        </div>
      </ThemeCard>

      <ThemeCard theme={theme}>
        <h3 className="text-base font-bold mb-2" style={{ color: "#0F172A" }}>
          Backend Payload (Kafka/AI)
        </h3>
        <div
          className="p-4 text-xs font-mono overflow-auto rounded-xl border bg-white"
          style={{ borderColor: t.border }}
        >
          <pre>{JSON.stringify(backendPayload, null, 2)}</pre>
          <button
            onClick={handleSaveToKafka}
            className="mt-4 px-5 py-3 bg-cyan-600 text-white hover:bg-cyan-700 rounded-4xl"
          >
            Save & Send to Kafka
          </button>
        </div>
        <div className="mt-3 text-sm text-slate-600">
          This payload can power personalized recommendations, adaptive
          challenges, and analytics.
        </div>
      </ThemeCard>
    </>
  );
}
