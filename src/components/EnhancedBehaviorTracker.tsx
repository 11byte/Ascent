// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// // GLASS CARD UTILITY
// const GlassCard = ({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => (
//   <motion.div
//     className={`bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 ${className}`}
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     exit={{ opacity: 0, y: -10 }}
//     layout
//   >
//     {children}
//   </motion.div>
// );

// // TYPES
// interface TrackerData {
//   questions: Question[];
//   activities: Activity[];
//   skillAssessments: SkillAssessment[];
//   domainChallenges: DomainChallenge[];
// }
// interface Question {
//   id: number;
//   question: string;
//   options: string[];
//   category: "preference" | "behavior" | "interest" | "approach";
// }
// interface Activity {
//   id: number;
//   type: "ranking" | "matching" | "scenario" | "preference";
//   title: string;
//   description: string;
//   data: any;
// }
// interface SkillAssessment {
//   id: number;
//   domain: string;
//   questions: { question: string; options: string[]; correctAnswer?: number }[];
// }
// interface DomainChallenge {
//   id: number;
//   domain: string;
//   challenge: string;
//   type: "creative" | "problem-solving" | "analytical";
//   prompt: string;
// }
// interface BehaviorTrackerProps {
//   phase: "phase1" | "phase2" | "phase3" | "phase4";
// }

// // PHASE CONFIGS
// const phaseConfigs = {
//   phase1: {
//     name: "Explorer",
//     difficulty: "Simple",
//     endpoint: "/api/tracker/simple",
//     fallbackFile: "phase1trackerdata.json",
//     theme: {
//       accent: "blue-500",
//       accentGlass: "from-blue-200 to-purple-200",
//       text: "blue-800",
//       button: "bg-blue-100 hover:bg-blue-200 text-blue-800",
//       progress: "bg-blue-600",
//       card: "bg-white/20",
//       gradient: "linear-gradient(135deg, #77bef0 0%, #ea5b6f 100%)",
//     },
//   },
//   phase2: {
//     name: "Developer",
//     difficulty: "Moderate",
//     endpoint: "/api/tracker/moderate",
//     fallbackFile: "phase2trackerdata.json",
//     theme: {
//       accent: "green-500",
//       accentGlass: "from-green-200 to-teal-200",
//       text: "green-800",
//       button: "bg-green-100 hover:bg-green-200 text-green-800",
//       progress: "bg-green-600",
//       card: "bg-white/20",
//       gradient: "linear-gradient(135deg, #34d399 0%, #14b8a6 100%)",
//     },
//   },
//   phase3: {
//     name: "Specialist",
//     difficulty: "Hard",
//     endpoint: "/api/tracker/hard",
//     fallbackFile: "phase3trackerdata.json",
//     theme: {
//       accent: "orange-500",
//       accentGlass: "from-orange-200 to-red-200",
//       text: "orange-800",
//       button: "bg-orange-100 hover:bg-orange-200 text-orange-800",
//       progress: "bg-orange-600",
//       card: "bg-white/20",
//       gradient: "linear-gradient(135deg, #fb923c 0%, #ef4444 100%)",
//     },
//   },
//   phase4: {
//     name: "Expert",
//     difficulty: "Very Hard",
//     endpoint: "/api/tracker/veryhard",
//     fallbackFile: "phase4trackerdata.json",
//     theme: {
//       accent: "purple-500",
//       accentGlass: "from-purple-200 to-pink-200",
//       text: "purple-800",
//       button: "bg-purple-100 hover:bg-purple-200 text-purple-800",
//       progress: "bg-purple-600",
//       card: "bg-white/20",
//       gradient: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)",
//     },
//   },
// };

// export default function EnhancedBehaviorTracker({
//   phase,
// }: BehaviorTrackerProps) {
//   const config = phaseConfigs[phase];
//   const [trackerData, setTrackerData] = useState<TrackerData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentSection, setCurrentSection] = useState<
//     | "intro"
//     | "questions"
//     | "activities"
//     | "assessment"
//     | "challenges"
//     | "results"
//   >("intro");
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [responses, setResponses] = useState<any[]>([]);
//   const [userProfile, setUserProfile] = useState({
//     techInterests: {} as Record<string, number>,
//     behaviorPattern: "",
//     preferredLearningStyle: "",
//     problemSolvingApproach: "",
//     domains: ["AI/ML", "Web Dev", "Cybersecurity", "Data Analytics", "IoT"],
//   });

//   useEffect(() => {
//     let isMounted = true;
//     const loadTrackerData = async () => {
//       try {
//         const response = await fetch(config.endpoint);
//         if (!response.ok) throw new Error();
//         const data = await response.json();
//         if (isMounted) setTrackerData(data);
//       } catch {
//         try {
//           const fallbackResponse = await fetch(`/data/${config.fallbackFile}`);
//           const fallbackData = await fallbackResponse.json();
//           if (isMounted) setTrackerData(fallbackData);
//         } catch {
//           if (isMounted)
//             setTrackerData({
//               questions: [],
//               activities: [],
//               skillAssessments: [],
//               domainChallenges: [],
//             });
//         }
//       }
//       if (isMounted) setLoading(false);
//     };
//     loadTrackerData();
//     return () => {
//       isMounted = false;
//     };
//   }, [config.endpoint, config.fallbackFile]);

//   const currentSectionData = useMemo(() => {
//     if (!trackerData) return [];
//     switch (currentSection) {
//       case "questions":
//         return trackerData.questions;
//       case "activities":
//         return trackerData.activities;
//       case "assessment":
//         return trackerData.skillAssessments;
//       case "challenges":
//         return trackerData.domainChallenges;
//       default:
//         return [];
//     }
//   }, [trackerData, currentSection]);

//   const totalItems = useMemo(() => {
//     if (!trackerData) return 0;
//     return (
//       trackerData.questions.length +
//       trackerData.activities.length +
//       trackerData.skillAssessments.length +
//       trackerData.domainChallenges.length
//     );
//   }, [trackerData]);

//   const getTotalProgress = useCallback(() => {
//     if (!trackerData) return 0;
//     if (currentSection === "results") return 100;
//     return totalItems > 0
//       ? Math.round((responses.length / totalItems) * 100)
//       : 0;
//   }, [trackerData, currentSection, responses.length, totalItems]);

//   const handleResponse = useCallback(
//     (response: any) => {
//       setResponses((prev) => [...prev, response]);
//       updateUserProfile(response);
//       moveToNext();
//     },
//     [responses, userProfile, currentSection, currentSectionData, currentIndex]
//   );

//   const updateUserProfile = useCallback(
//     (response: any) => {
//       const newProfile = { ...userProfile };
//       if (response.category === "preference") {
//         response.selectedDomains?.forEach((domain: string) => {
//           newProfile.techInterests[domain] =
//             (newProfile.techInterests[domain] || 0) + 1;
//         });
//       }
//       setUserProfile(newProfile);
//     },
//     [userProfile]
//   );

//   const moveToNext = useCallback(() => {
//     if (currentIndex < currentSectionData.length - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     } else {
//       moveToNextSection();
//     }
//   }, [currentIndex, currentSectionData]);

//   const moveToNextSection = useCallback(() => {
//     setCurrentIndex(0);
//     setCurrentSection((prevSection) => {
//       switch (prevSection) {
//         case "intro":
//           return "questions";
//         case "questions":
//           return "activities";
//         case "activities":
//           return "assessment";
//         case "assessment":
//           return "challenges";
//         case "challenges":
//           return "results";
//         default:
//           return "results";
//       }
//     });
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//           className={`w-16 h-16 border-4 border-${config.theme.accent} border-t-transparent rounded-full`}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <GlassCard className="mb-8 flex flex-col items-center justify-center">
//         <div className="w-full">
//           <div className="bg-white/40 rounded-full h-4 overflow-hidden shadow-inner">
//             <motion.div
//               className={`h-full ${config.theme.progress}`}
//               initial={{ width: 0 }}
//               animate={{ width: `${getTotalProgress()}%` }}
//               transition={{ duration: 0.5 }}
//               style={{
//                 background: config.theme.gradient,
//                 boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
//               }}
//             />
//           </div>
//           <p
//             className={`text-center mt-2 font-bold text-${config.theme.text} drop-shadow-lg`}
//           >
//             Progress: {getTotalProgress()}%
//           </p>
//         </div>
//       </GlassCard>
//       <AnimatePresence mode="wait">
//         {currentSection === "intro" && (
//           <IntroSection
//             config={config}
//             onStart={() => setCurrentSection("questions")}
//           />
//         )}
//         {currentSection === "questions" && trackerData && (
//           <QuestionsSection
//             config={config}
//             questions={trackerData.questions}
//             currentIndex={currentIndex}
//             onResponse={handleResponse}
//           />
//         )}
//         {currentSection === "activities" && trackerData && (
//           <ActivitiesSection
//             config={config}
//             activities={trackerData.activities}
//             currentIndex={currentIndex}
//             onResponse={handleResponse}
//           />
//         )}
//         {currentSection === "assessment" && trackerData && (
//           <AssessmentSection
//             config={config}
//             assessments={trackerData.skillAssessments}
//             currentIndex={currentIndex}
//             onResponse={handleResponse}
//           />
//         )}
//         {currentSection === "challenges" && trackerData && (
//           <ChallengesSection
//             config={config}
//             challenges={trackerData.domainChallenges}
//             currentIndex={currentIndex}
//             onResponse={handleResponse}
//           />
//         )}
//         {currentSection === "results" && (
//           <ResultsSection
//             config={config}
//             userProfile={userProfile}
//             responses={responses}
//             trackerData={trackerData}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// // --- Section components ---

// function IntroSection({ config, onStart }: any) {
//   return (
//     <GlassCard className="text-center">
//       <motion.h2
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={`text-4xl font-bold mb-6 text-${config.theme.text} drop-shadow-lg`}
//       >
//         Welcome to the {config.name} Tracker! 🚀
//       </motion.h2>
//       <p className={`text-lg mb-8 text-${config.theme.text} opacity-80`}>
//         Discover your interests, learning style, and more through interactive
//         glass-themed activities.
//       </p>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         {["Questions", "Activities", "Assessment", "Challenges"].map(
//           (label, i) => (
//             <div
//               className={`p-4 bg-gradient-to-br ${config.theme.accentGlass} rounded-xl shadow-lg border border-white/20`}
//               key={label}
//             >
//               <div className="text-3xl mb-2">{["❓", "🎯", "📊", "🏆"][i]}</div>
//               <div className={`text-sm font-medium text-${config.theme.text}`}>
//                 {label}
//               </div>
//             </div>
//           )
//         )}
//       </div>
//       <motion.button
//         onClick={onStart}
//         className={`px-8 py-4 ${config.theme.button} rounded-xl font-medium text-lg shadow-lg`}
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         Start Tracking! 🎯
//       </motion.button>
//     </GlassCard>
//   );
// }

// function QuestionsSection({
//   config,
//   questions,
//   currentIndex,
//   onResponse,
// }: any) {
//   if (!questions || questions.length === 0 || currentIndex >= questions.length)
//     return null;
//   const question = questions[currentIndex];
//   return (
//     <GlassCard>
//       <div className="mb-6">
//         <span
//           className={`text-sm font-medium text-${config.theme.text} opacity-60`}
//         >
//           Question {currentIndex + 1} of {questions.length}
//         </span>
//       </div>
//       <h2 className={`text-2xl font-semibold mb-6 text-${config.theme.text}`}>
//         {question.question}
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {question.options.map((option: string, index: number) => (
//           <motion.button
//             key={index}
//             onClick={() =>
//               onResponse({
//                 questionId: question.id,
//                 answer: option,
//                 category: question.category,
//               })
//             }
//             className={`p-4 ${config.theme.button} rounded-xl font-medium shadow text-left`}
//             whileHover={{
//               scale: 1.03,
//               backgroundColor: "#fff",
//               boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
//             }}
//             whileTap={{ scale: 0.96 }}
//           >
//             {option}
//           </motion.button>
//         ))}
//       </div>
//     </GlassCard>
//   );
// }

// function ActivitiesSection({
//   config,
//   activities,
//   currentIndex,
//   onResponse,
// }: any) {
//   if (
//     !activities ||
//     activities.length === 0 ||
//     currentIndex >= activities.length
//   )
//     return null;
//   const activity = activities[currentIndex];
//   return (
//     <GlassCard>
//       <div className="mb-6">
//         <span
//           className={`text-sm font-medium text-${config.theme.text} opacity-60`}
//         >
//           Activity {currentIndex + 1} of {activities.length}
//         </span>
//       </div>
//       <h2 className={`text-2xl font-semibold mb-2 text-${config.theme.text}`}>
//         {activity.title}
//       </h2>
//       <p className={`text-${config.theme.text} opacity-80 mb-6`}>
//         {activity.description}
//       </p>
//       {activity.type === "ranking" && (
//         <RankingActivity
//           activity={activity}
//           config={config}
//           onResponse={onResponse}
//         />
//       )}
//       {activity.type === "matching" && (
//         <MatchingActivity
//           activity={activity}
//           config={config}
//           onResponse={onResponse}
//         />
//       )}
//       {activity.type === "scenario" && (
//         <ScenarioActivity
//           activity={activity}
//           config={config}
//           onResponse={onResponse}
//         />
//       )}
//       {activity.type === "preference" && (
//         <PreferenceActivity
//           activity={activity}
//           config={config}
//           onResponse={onResponse}
//         />
//       )}
//     </GlassCard>
//   );
// }

// function RankingActivity({ activity, config, onResponse }: any) {
//   const [rankings, setRankings] = useState<string[]>([]);
//   const [draggedItem, setDraggedItem] = useState<string | null>(null);
//   const items =
//     activity.data.domains ||
//     activity.data.stacks ||
//     activity.data.technologies ||
//     activity.data.moonshots ||
//     [];

//   const handleDragStart = (item: string) => setDraggedItem(item);
//   const handleDragOver = (e: React.DragEvent) => e.preventDefault();
//   const handleDrop = (targetItem: string) => {
//     if (!draggedItem) return;
//     const newRankings = [...rankings];
//     const draggedIndex = newRankings.indexOf(draggedItem);
//     const targetIndex = newRankings.indexOf(targetItem);
//     if (draggedIndex !== -1) newRankings.splice(draggedIndex, 1);
//     newRankings.splice(
//       targetIndex !== -1 ? targetIndex : newRankings.length,
//       0,
//       draggedItem
//     );
//     setRankings(newRankings);
//     setDraggedItem(null);
//   };
//   const addToRanking = (item: string) =>
//     !rankings.includes(item) && setRankings([...rankings, item]);
//   const removeFromRanking = (item: string) =>
//     setRankings(rankings.filter((r) => r !== item));
//   const submitRanking = () =>
//     onResponse({
//       activityId: activity.id,
//       type: "ranking",
//       rankings,
//       completeness: rankings.length / items.length,
//     });

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className={`text-lg font-medium mb-4 text-${config.theme.text}`}>
//           Available Items (drag to rank):
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           {items
//             .filter((item: string) => !rankings.includes(item))
//             .map((item: string, index: number) => (
//               <motion.div
//                 key={index}
//                 draggable
//                 onDragStart={() => handleDragStart(item)}
//                 onClick={() => addToRanking(item)}
//                 className={`p-3 ${config.theme.button} rounded-lg cursor-move border-2 border-dashed border-transparent hover:border-${config.theme.accent} transition-all`}
//                 whileHover={{ scale: 1.02 }}
//               >
//                 {item}
//               </motion.div>
//             ))}
//         </div>
//       </div>
//       <div>
//         <h3 className={`text-lg font-medium mb-4 text-${config.theme.text}`}>
//           Your Ranking (1 = Most Preferred):
//         </h3>
//         <div className="space-y-3">
//           {rankings.map((item: string, index: number) => (
//             <motion.div
//               key={item}
//               draggable
//               onDragStart={() => handleDragStart(item)}
//               onDragOver={handleDragOver}
//               onDrop={() => handleDrop(item)}
//               className={`p-4 bg-gradient-to-br ${config.theme.accentGlass}/30 border border-${config.theme.accent}/30 rounded-lg cursor-move flex items-center justify-between`}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: index * 0.1 }}
//             >
//               <div className="flex items-center">
//                 <span
//                   className={`text-lg font-bold text-${config.theme.text} mr-4 min-w-8`}
//                 >
//                   {index + 1}.
//                 </span>
//                 <span className={`text-${config.theme.text}`}>{item}</span>
//               </div>
//               <button
//                 onClick={() => removeFromRanking(item)}
//                 className={`text-${config.theme.text} opacity-60 hover:opacity-100 text-xl`}
//               >
//                 ×
//               </button>
//             </motion.div>
//           ))}
//           {rankings.length === 0 && (
//             <div
//               className={`p-8 border-2 border-dashed border-${config.theme.accent}/30 rounded-lg text-center text-${config.theme.text} opacity-60`}
//               onDragOver={handleDragOver}
//               onDrop={() => draggedItem && handleDrop("")}
//             >
//               Drag items here to rank them
//             </div>
//           )}
//         </div>
//       </div>
//       {rankings.length > 0 && (
//         <motion.button
//           onClick={submitRanking}
//           className={`w-full px-6 py-3 ${config.theme.button} rounded-xl font-medium text-lg shadow-lg`}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           Submit Ranking ({rankings.length}/{items.length} ranked)
//         </motion.button>
//       )}
//     </div>
//   );
// }

// function MatchingActivity({ activity, config, onResponse }: any) {
//   const [matches, setMatches] = useState<Record<string, string>>({});
//   const [selectedTech, setSelectedTech] = useState<string | null>(null);
//   const technologies = activity.data.technologies || [];
//   const useCases = activity.data.applications || activity.data.useCases || activity.data.convergences || [];

//   const handleTechSelect = (tech: string) => setSelectedTech(tech);
//   const handleUseCaseSelect = (useCase: string) => {
//     if (selectedTech) {
//       setMatches({ ...matches, [selectedTech]: useCase });
//       setSelectedTech(null);
//     }
//   };
//   const removeMatch = (tech: string) => {
//     const newMatches = { ...matches };
//     delete newMatches[tech];
//     setMatches(newMatches);
//   };
//   const submitMatches = () => onResponse({ activityId: activity.id, type: "matching", matches, completeness: Object.keys(matches).length / technologies.length });

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Technologies */}
//         <div>
//           <h3 className={`text-lg font-medium mb-4 text-${config.theme.text}`}>Technologies:</h3>
//           <div className="space-y-2">
//             {technologies.map((tech: string, index: number) => (
//               <motion.button
//                 key={index}
//                 onClick={() => handleTechSelect(tech)}
//                 className={`w-full p-3 text-left rounded-lg transition-all ${
//                   selectedTech === tech
//                     ? `bg-gradient-to-br ${config.theme.accentGlass} text-white`
//                     : matches[tech]
//                     ? `bg-gradient-to-br ${config.theme.accentGlass}/20 text-${config.theme.text}`
//                     : config.theme.button
//                 }`}
//                 whileHover={{ scale: 1.02 }}
//                 disabled={!!matches[tech]}
//               >
//                 <div className="flex items-center justify-between">
//                   <span>{tech}</span>
//                   {matches[tech] && (
//                     <span
//                       className="text-lg opacity-60 hover:opacity-100 cursor-pointer ml-2"
//                       onClick={e => {
//                         e.stopPropagation();
//                         removeMatch(tech);
//                       }}
//                       role="button"
//                       tabIndex={0}
//                       aria-label="Remove match"
//                     >×</span>
//                   )}
//                 </div>
//               </motion.button>
//             ))}
//           </div>
//         </div>
//         {/* Use Cases */}
//         <div>
//           <h3 className={`text-lg font-medium mb-4 text-${config.theme.text}`}>Applications/Use Cases:</h3>
//           <div className="space-y-2">
//             {useCases.map((useCase: string, index: number) => (
//               <motion.button
//                 key={index}
//                 onClick={() => handleUseCaseSelect(useCase)}
//                 className={`w-full p-3 text-left rounded-lg transition-all ${
//                   Object.values(matches).includes(useCase)
//                     ? `bg-gradient-to-br ${config.theme.accentGlass}/20 text-${config.theme.text} opacity-50`
//                     : config.theme.button
//                 }`}
//                 whileHover={{ scale: selectedTech && !Object.values(matches).includes(useCase) ? 1.02 : 1 }}
//                 disabled={!selectedTech || Object.values(matches).includes(useCase)}
//               >
//                 {useCase}
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       </div>
//       {selectedTech && (
//         <div className={`p-4 bg-gradient-to-br ${config.theme.accentGlass}/10 rounded-lg border border-${config.theme.accent}/30`}>
//           <span className={`text-${config.theme.text}`}>
//             Selected: <strong>{selectedTech}</strong> - Click on a use case to match
//           </span>
//         </div>
//       )}
//       {Object.keys(matches).length > 0 && (
//         <motion.button
//           onClick={submitMatches}
//           className={`w-full px-6 py-3 ${config.theme.button} rounded-xl font-medium text-lg shadow-lg`}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           Submit Matches ({Object.keys(matches).length}/{technologies.length} matched)
//         </motion.button>
//       )}
//     </div>
//   );
// }
// function ScenarioActivity({ activity, config, onResponse }: any) {
//   const [selectedScenario, setSelectedScenario] = useState<any>(null);
//   const scenarios = activity.data.scenarios || activity.data.approaches || [];
//   const submitSelection = () =>
//     onResponse({
//       activityId: activity.id,
//       type: "scenario",
//       selectedScenario,
//       reasoning: "User preference selection",
//     });

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 gap-4">
//         {scenarios.map((scenario: any, index: number) => (
//           <motion.div
//             key={index}
//             onClick={() => setSelectedScenario(scenario)}
//             className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
//               selectedScenario === scenario
//                 ? `border-${config.theme.accent} bg-gradient-to-br ${config.theme.accentGlass}/10`
//                 : `border-${config.theme.accent}/20 ${config.theme.card}`
//             }`}
//             whileHover={{ scale: 1.02 }}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//           >
//             <h3
//               className={`text-xl font-semibold mb-2 text-${config.theme.text}`}
//             >
//               {scenario.title}
//             </h3>
//             <p className={`text-${config.theme.text} opacity-80 mb-4`}>
//               {scenario.description}
//             </p>
//             <div className="flex flex-wrap gap-2 text-sm">
//               {scenario.domain && (
//                 <span
//                   className={`px-3 py-1 bg-gradient-to-br ${config.theme.accentGlass}/20 text-${config.theme.text} rounded-full`}
//                 >
//                   {scenario.domain}
//                 </span>
//               )}
//               {scenario.difficulty && (
//                 <span
//                   className={`px-3 py-1 bg-gradient-to-br ${config.theme.accentGlass}/20 text-${config.theme.text} rounded-full`}
//                 >
//                   {scenario.difficulty}
//                 </span>
//               )}
//             </div>
//           </motion.div>
//         ))}
//       </div>
//       {selectedScenario && (
//         <motion.button
//           onClick={submitSelection}
//           className={`w-full px-6 py-3 ${config.theme.button} rounded-xl font-medium text-lg shadow-lg`}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           Select This Project
//         </motion.button>
//       )}
//     </div>
//   );
// }

// function PreferenceActivity({ activity, config, onResponse }: any) {
//   const [selectedPath, setSelectedPath] = useState<any>(null);
//   const paths =
//     activity.data.paths ||
//     activity.data.directions ||
//     activity.data.strategies ||
//     [];

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {paths.map((path: any, index: number) => (
//           <motion.div
//             key={index}
//             onClick={() => setSelectedPath(path)}
//             className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
//               selectedPath === path
//                 ? `border-${config.theme.accent} bg-gradient-to-br ${config.theme.accentGlass}/10`
//                 : `border-${config.theme.accent}/20 ${config.theme.card}`
//             }`}
//             whileHover={{ scale: 1.02 }}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//           >
//             <h3
//               className={`text-lg font-semibold mb-3 text-${config.theme.text}`}
//             >
//               {path.title}
//             </h3>
//             <p className={`text-${config.theme.text} opacity-80 mb-4 text-sm`}>
//               {path.description}
//             </p>
//           </motion.div>
//         ))}
//       </div>
//       {selectedPath && (
//         <motion.button
//           onClick={() =>
//             onResponse({
//               activityId: activity.id,
//               type: "preference",
//               selectedPath,
//             })
//           }
//           className={`w-full px-6 py-3 ${config.theme.button} rounded-xl font-medium text-lg shadow-lg`}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           Choose This Path
//         </motion.button>
//       )}
//     </div>
//   );
// }

// function AssessmentSection({
//   config,
//   assessments,
//   currentIndex,
//   onResponse,
// }: any) {
//   if (
//     !assessments ||
//     assessments.length === 0 ||
//     currentIndex >= assessments.length
//   )
//     return null;
//   const assessment = assessments[currentIndex];
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState<number[]>([]);
//   const [showResults, setShowResults] = useState(false);

//   const handleAnswer = (answerIndex: number) => {
//     const newAnswers = [...answers, answerIndex];
//     setAnswers(newAnswers);
//     if (currentQuestionIndex < assessment.questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       setShowResults(true);
//     }
//   };

//   const calculateScore = () => {
//     let correct = 0;
//     assessment.questions.forEach((question: any, index: number) => {
//       if (
//         question.correctAnswer !== undefined &&
//         answers[index] === question.correctAnswer
//       ) {
//         correct++;
//       }
//     });
//     return {
//       correct,
//       total: assessment.questions.length,
//       percentage: Math.round((correct / assessment.questions.length) * 100),
//     };
//   };

//   const submitAssessment = () => {
//     const score = calculateScore();
//     onResponse({
//       assessmentId: assessment.id,
//       domain: assessment.domain,
//       answers,
//       score,
//     });
//   };

//   if (showResults) {
//     const score = calculateScore();
//     return (
//       <GlassCard>
//         <h2 className={`text-2xl font-semibold mb-6 text-${config.theme.text}`}>
//           Assessment Results: {assessment.domain}
//         </h2>
//         <div className="text-center mb-6">
//           <div
//             className={`text-4xl font-bold text-${config.theme.accent} mb-2`}
//           >
//             {score.percentage}%
//           </div>
//           <p className={`text-${config.theme.text} opacity-80`}>
//             {score.correct} out of {score.total} correct
//           </p>
//         </div>
//         <div className="space-y-4 mb-6">
//           {assessment.questions.map((question: any, index: number) => (
//             <div
//               key={index}
//               className={`p-4 rounded-lg ${
//                 question.correctAnswer !== undefined &&
//                 answers[index] === question.correctAnswer
//                   ? "bg-green-100 border border-green-300"
//                   : question.correctAnswer !== undefined
//                   ? "bg-red-100 border border-red-300"
//                   : `bg-gradient-to-br ${config.theme.accentGlass}/10 border border-${config.theme.accent}/20`
//               }`}
//             >
//               <p className={`font-medium text-${config.theme.text} mb-2`}>
//                 Q{index + 1}: {question.question}
//               </p>
//               <p className={`text-${config.theme.text} text-sm`}>
//                 Your answer: {question.options[answers[index]]}
//                 {question.correctAnswer !== undefined &&
//                   answers[index] !== question.correctAnswer && (
//                     <span className="block mt-1 text-green-700">
//                       Correct: {question.options[question.correctAnswer]}
//                     </span>
//                   )}
//               </p>
//             </div>
//           ))}
//         </div>
//         <motion.button
//           onClick={submitAssessment}
//           className={`w-full px-6 py-3 ${config.theme.button} rounded-xl font-medium text-lg shadow-lg`}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//         >
//           Continue to Next Section
//         </motion.button>
//       </GlassCard>
//     );
//   }

//   const currentQuestion = assessment.questions[currentQuestionIndex];
//   return (
//     <GlassCard>
//       <div className="mb-6">
//         <span
//           className={`text-sm font-medium text-${config.theme.text} opacity-60`}
//         >
//           Assessment {currentIndex + 1} - {assessment.domain}
//         </span>
//         <div className="flex space-x-2 mt-2">
//           {assessment.questions.map((_: any, i: number) => (
//             <div
//               key={i}
//               className={`h-2 w-8 rounded-full ${
//                 i < currentQuestionIndex
//                   ? config.theme.progress
//                   : i === currentQuestionIndex
//                   ? `bg-${config.theme.accent}/50`
//                   : "bg-gray-300"
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//       <h2 className={`text-2xl font-semibold mb-6 text-${config.theme.text}`}>
//         Question {currentQuestionIndex + 1} of {assessment.questions.length}
//       </h2>
//       <p className={`text-lg mb-6 text-${config.theme.text}`}>
//         {currentQuestion.question}
//       </p>
//       <div className="grid grid-cols-1 gap-4">
//         {currentQuestion.options.map((option: string, index: number) => (
//           <motion.button
//             key={index}
//             onClick={() => handleAnswer(index)}
//             className={`p-4 ${config.theme.button} rounded-xl font-medium text-left`}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             <span className="font-bold mr-3">
//               {String.fromCharCode(65 + index)}.
//             </span>
//             {option}
//           </motion.button>
//         ))}
//       </div>
//     </GlassCard>
//   );
// }

// function ChallengesSection({
//   config,
//   challenges,
//   currentIndex,
//   onResponse,
// }: any) {
//   if (
//     !challenges ||
//     challenges.length === 0 ||
//     currentIndex >= challenges.length
//   )
//     return null;
//   const challenge = challenges[currentIndex];
//   const [response, setResponse] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     setSubmitted(false);
//     setResponse("");
//   }, [currentIndex]);

//   const handleSubmit = () => {
//     if (response.trim().length < 50) {
//       alert("Please provide a more detailed response (at least 50 characters)");
//       return;
//     }
//     setSubmitted(true);
//     onResponse({
//       challengeId: challenge.id,
//       domain: challenge.domain,
//       challenge: challenge.challenge,
//       response,
//       wordCount: response.split(" ").length,
//     });
//   };

//   if (submitted) {
//     return (
//       <GlassCard>
//         <h2
//           className={`text-2xl font-semibold mb-6 text-${config.theme.text} text-center`}
//         >
//           Challenge Response Submitted! 🎉
//         </h2>
//         <div
//           className={`p-6 bg-gradient-to-br ${config.theme.accentGlass}/10 rounded-xl mb-6`}
//         >
//           <h3
//             className={`text-lg font-semibold mb-2 text-${config.theme.text}`}
//           >
//             Your Response to: {challenge.challenge}
//           </h3>
//           <p
//             className={`text-${config.theme.text} opacity-80 whitespace-pre-wrap`}
//           >
//             {response}
//           </p>
//           <div className={`mt-4 text-sm text-${config.theme.text} opacity-60`}>
//             Word count: {response.split(" ").length} | Domain:{" "}
//             {challenge.domain}
//           </div>
//         </div>
//         <div className="text-center">
//           <p className={`text-${config.theme.text} opacity-80 mb-4`}>
//             Your creative thinking and problem-solving approach has been
//             recorded for analysis.
//           </p>
//         </div>
//       </GlassCard>
//     );
//   }

//   return (
//     <GlassCard>
//       <div className="mb-6">
//         <span
//           className={`text-sm font-medium text-${config.theme.text} opacity-60`}
//         >
//           Challenge {currentIndex + 1} of {challenges.length}
//         </span>
//       </div>
//       <div className="flex items-center mb-4">
//         <span
//           className={`px-3 py-1 bg-gradient-to-br ${config.theme.accentGlass}/20 text-${config.theme.text} rounded-full text-sm mr-3`}
//         >
//           {challenge.domain}
//         </span>
//         <span
//           className={`px-3 py-1 bg-gradient-to-br ${config.theme.accentGlass}/20 text-${config.theme.text} rounded-full text-sm`}
//         >
//           {challenge.type}
//         </span>
//       </div>
//       <h2 className={`text-2xl font-semibold mb-4 text-${config.theme.text}`}>
//         {challenge.challenge}
//       </h2>
//       <div
//         className={`p-6 bg-gradient-to-br ${config.theme.accentGlass}/10 rounded-xl mb-6`}
//       >
//         <p className={`text-${config.theme.text} leading-relaxed`}>
//           {challenge.prompt}
//         </p>
//       </div>
//       <div className="mb-6">
//         <label className={`block text-${config.theme.text} font-medium mb-3`}>
//           Your Response:
//         </label>
//         <textarea
//           value={response}
//           onChange={(e) => setResponse(e.target.value)}
//           placeholder="Share your thoughts, ideas, and solutions here. Be creative and detailed in your response..."
//           className={`w-full h-40 p-4 border border-${config.theme.accent}/30 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-${config.theme.accent} bg-white/50`}
//         />
//         <div className="flex justify-between mt-2">
//           <span className={`text-sm text-${config.theme.text} opacity-60`}>
//             Minimum 50 characters required
//           </span>
//           <span className={`text-sm text-${config.theme.text} opacity-60`}>
//             {response.length} characters |{" "}
//             {response.split(" ").filter((w) => w).length} words
//           </span>
//         </div>
//       </div>
//       <motion.button
//         onClick={handleSubmit}
//         disabled={response.trim().length < 50}
//         className={`w-full px-6 py-3 rounded-xl font-medium text-lg shadow-lg transition-all ${
//           response.trim().length >= 50
//             ? `${config.theme.button} hover:scale-102`
//             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//         }`}
//         whileHover={response.trim().length >= 50 ? { scale: 1.02 } : {}}
//         whileTap={response.trim().length >= 50 ? { scale: 0.98 } : {}}
//       >
//         Submit Challenge Response
//       </motion.button>
//     </GlassCard>
//   );
// }

// function ResultsSection({ config, userProfile, responses, trackerData }: any) {
//   // Collect answers per section
//   const sectionAnswers = useMemo(() => {
//     const result = {
//       questions: [] as any[],
//       activities: [] as any[],
//       assessments: [] as any[],
//       challenges: [] as any[],
//     };
//     for (const resp of responses) {
//       if (resp.questionId !== undefined) result.questions.push(resp);
//       else if (resp.activityId !== undefined) result.activities.push(resp);
//       else if (resp.assessmentId !== undefined) result.assessments.push(resp);
//       else if (resp.challengeId !== undefined) result.challenges.push(resp);
//     }
//     return result;
//   }, [responses]);

//   // Simulated backend payload (for Kafka/AI)
//   const backendPayload = useMemo(() => ({
//     profile: userProfile,
//     questions: sectionAnswers.questions,
//     activities: sectionAnswers.activities,
//     assessments: sectionAnswers.assessments,
//     challenges: sectionAnswers.challenges,
//     timestamp: new Date().toISOString(),
//   }), [userProfile, sectionAnswers]);

//   return (
//     <GlassCard>
//       <div className="flex flex-col items-center justify-center">
//         <h2 className={`text-3xl font-bold mb-3 text-blue-900`}>Backend Payload (Kafka/AI)</h2>
//         <div className="w-full max-w-3xl mx-auto mb-6">
//           <div className="bg-white/80 rounded-xl p-4 border border-blue-200 text-xs text-blue-900 font-mono overflow-auto">
//             <pre>{JSON.stringify(backendPayload, null, 2)}</pre>
//           </div>
//         </div>
//         <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-blue-800 text-base mb-2 w-full max-w-3xl mx-auto">
//           <strong>What can be done with this data?</strong>
//           <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-900">
//             <li>
//               <b>Personalized Learning:</b> AI can analyze preferences, strengths, and gaps to recommend tailored learning paths, resources, or projects.
//             </li>
//             <li>
//               <b>Profile Generation:</b> The backend can generate a tech profile, visualize interests, and track a student's growth over time.
//             </li>
//             <li>
//               <b>Adaptive Challenges:</b> Future activities can be selected or adapted based on user strengths and interests.
//             </li>
//             <li>
//               <b>Analytics & Insights:</b> Educators and admins can see aggregate data (across users) for domain interest, skill gaps, and behavioral trends.
//             </li>
//             <li>
//               <b>AI Recommendations:</b> The data can be streamed to a Kafka pipeline for real-time AI processing, clustering similar learners, or automating guidance.
//             </li>
//             <li>
//               <b>Feedback Loops:</b> User responses can be used to train AI models for better content, detect engagement, or even predict success.
//             </li>
//           </ul>
//         </div>
//         <div className="mt-4 text-blue-700 text-sm w-full max-w-3xl mx-auto">
//           <strong>Note for Review:</strong> This payload is exactly what will be sent to the backend via Kafka for further analytics, profile building, and AI-driven adaptive learning.
//         </div>
//       </div>
//     </GlassCard>
//   );
// }

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// SIMPLE CARD UTILITY (NO glassmorphism)
const ThemeCard = ({
  children,
  theme,
  className = "",
}: {
  children: React.ReactNode;
  theme: TrackerTheme;
  className?: string;
}) => (
  <motion.div
    className={`border-2 rounded-2xl p-8 shadow-lg ${className}`}
    style={{
      borderColor: theme.tBorder.light,
      background: theme.tDepthColor.light,
      color: theme.tColor.light,
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    layout
  >
    {children}
  </motion.div>
);

export default function EnhancedBehaviorTracker({
  phase,
  theme,
}: BehaviorTrackerProps) {
  // API/phase config
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
  };
  const config = phaseConfigs[phase];

  const [trackerData, setTrackerData] = useState<TrackerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<
    | "intro"
    | "questions"
    | "activities"
    | "assessment"
    | "challenges"
    | "results"
  >("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState({
    techInterests: {} as Record<string, number>,
    behaviorPattern: "",
    preferredLearningStyle: "",
    problemSolvingApproach: "",
    domains: ["AI/ML", "Web Dev", "Cybersecurity", "Data Analytics", "IoT"],
  });

  useEffect(() => {
    let isMounted = true;
    const loadTrackerData = async () => {
      try {
        const response = await fetch(config.endpoint);
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (isMounted) setTrackerData(data);
      } catch {
        try {
          const fallbackResponse = await fetch(`/data/${config.fallbackFile}`);
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
      }
      if (isMounted) setLoading(false);
    };
    loadTrackerData();
    return () => {
      isMounted = false;
    };
  }, [config.endpoint, config.fallbackFile]);

  const currentSectionData = useMemo(() => {
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

  const totalItems = useMemo(() => {
    if (!trackerData) return 0;
    return (
      trackerData.questions.length +
      trackerData.activities.length +
      trackerData.skillAssessments.length +
      trackerData.domainChallenges.length
    );
  }, [trackerData]);

  const getTotalProgress = useCallback(() => {
    if (!trackerData) return 0;
    if (currentSection === "results") return 100;
    return totalItems > 0
      ? Math.round((responses.length / totalItems) * 100)
      : 0;
  }, [trackerData, currentSection, responses.length, totalItems]);

  const handleResponse = useCallback(
    (response: any) => {
      setResponses((prev) => [...prev, response]);
      updateUserProfile(response);
      moveToNext();
    },
    [responses, userProfile, currentSection, currentSectionData, currentIndex]
  );

  const updateUserProfile = useCallback(
    (response: any) => {
      const newProfile = { ...userProfile };
      if (response.category === "preference") {
        response.selectedDomains?.forEach((domain: string) => {
          newProfile.techInterests[domain] =
            (newProfile.techInterests[domain] || 0) + 1;
        });
      }
      setUserProfile(newProfile);
    },
    [userProfile]
  );

  const moveToNext = useCallback(() => {
    if (currentIndex < currentSectionData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      moveToNextSection();
    }
  }, [currentIndex, currentSectionData]);

  const moveToNextSection = useCallback(() => {
    setCurrentIndex(0);
    setCurrentSection((prevSection) => {
      switch (prevSection) {
        case "intro":
          return "questions";
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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            border: `4px solid ${theme.tBorder.light}`,
            borderTopColor: "transparent",
            borderRadius: "50%",
          }}
          className="w-16 h-16"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <ThemeCard theme={theme} className="mb-8 flex flex-col items-center justify-center">
        <div className="w-full">
          <div
            style={{
              background: theme.tDepthColor.light,
              borderRadius: 9999,
              height: 16,
              overflow: "hidden",
              boxShadow: "inset 0 1px 8px rgba(0,0,0,0.08)",
            }}
          >
            <motion.div
              className="h-full"
              initial={{ width: 0 }}
              animate={{ width: `${getTotalProgress()}%` }}
              transition={{ duration: 0.5 }}
              style={{
                background: theme.tBorder.light,
                borderRadius: 9999,
                height: "100%",
              }}
            />
          </div>
          <p
            className={`text-center mt-2 font-bold`}
            style={{ color: theme.tColor.light }}
          >
            Progress: {getTotalProgress()}%
          </p>
        </div>
      </ThemeCard>
      <AnimatePresence mode="wait">
        {currentSection === "intro" && (
          <IntroSection
            theme={theme}
            config={config}
            onStart={() => setCurrentSection("questions")}
          />
        )}
        {currentSection === "questions" && trackerData && (
          <QuestionsSection
            theme={theme}
            config={config}
            questions={trackerData.questions}
            currentIndex={currentIndex}
            onResponse={handleResponse}
          />
        )}
        {currentSection === "activities" && trackerData && (
          <ActivitiesSection
            theme={theme}
            config={config}
            activities={trackerData.activities}
            currentIndex={currentIndex}
            onResponse={handleResponse}
          />
        )}
        {currentSection === "assessment" && trackerData && (
          <AssessmentSection
            theme={theme}
            config={config}
            assessments={trackerData.skillAssessments}
            currentIndex={currentIndex}
            onResponse={handleResponse}
          />
        )}
        {currentSection === "challenges" && trackerData && (
          <ChallengesSection
            theme={theme}
            config={config}
            challenges={trackerData.domainChallenges}
            currentIndex={currentIndex}
            onResponse={handleResponse}
          />
        )}
        {currentSection === "results" && (
          <ResultsSection
            theme={theme}
            config={config}
            userProfile={userProfile}
            responses={responses}
            trackerData={trackerData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Section Components ---
function IntroSection({ theme, config, onStart }: any) {
  return (
    <ThemeCard theme={theme} className="text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ color: theme.tColor.light }}
        className="text-4xl font-bold mb-6 drop-shadow-lg"
      >
        Welcome to the {config.name} Tracker! 🚀
      </motion.h2>
      <p className={`text-lg mb-8 opacity-80`} style={{ color: theme.tColor.light }}>
        Discover your interests, learning style, and more through interactive
        themed activities.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {["Questions", "Activities", "Assessment", "Challenges"].map(
          (label, i) => (
            <div
              style={{
                background: theme.tBorder.light,
                color: theme.tColor.light,
                borderRadius: 16,
              }}
              className="p-4 rounded-xl shadow-lg border border-white/20"
              key={label}
            >
              <div className="text-3xl mb-2">{["❓", "🎯", "📊", "🏆"][i]}</div>
              <div className="text-sm font-medium">{label}</div>
            </div>
          )
        )}
      </div>
      <motion.button
        onClick={onStart}
        style={{
          background: theme.tBorder.light,
          color: theme.tColor.light,
          borderRadius: 16,
        }}
        className="px-8 py-4 font-medium text-lg shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Tracking! 🎯
      </motion.button>
    </ThemeCard>
  );
}

function QuestionsSection({ theme, config, questions, currentIndex, onResponse }: any) {
  if (!questions || questions.length === 0 || currentIndex >= questions.length) return null;
  const question = questions[currentIndex];
  return (
    <ThemeCard theme={theme}>
      <div className="mb-6">
        <span style={{ color: theme.tColor.light, opacity: 0.6 }}>
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>
      <h2 style={{ color: theme.tColor.light }} className="text-2xl font-semibold mb-6">
        {question.question}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            style={{
              background: theme.tBorder.light,
              color: theme.tColor.light,
              borderRadius: 16,
            }}
            className="p-4 font-medium shadow text-left"
            whileHover={{
              scale: 1.03,
              backgroundColor: "#fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}
            whileTap={{ scale: 0.96 }}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </ThemeCard>
  );
}

function ActivitiesSection({ theme, config, activities, currentIndex, onResponse }: any) {
  if (!activities || activities.length === 0 || currentIndex >= activities.length) return null;
  const activity = activities[currentIndex];
  return (
    <ThemeCard theme={theme}>
      <div className="mb-6">
        <span style={{ color: theme.tColor.light, opacity: 0.6 }}>
          Activity {currentIndex + 1} of {activities.length}
        </span>
      </div>
      <h2 style={{ color: theme.tColor.light }} className="text-2xl font-semibold mb-2">
        {activity.title}
      </h2>
      <p style={{ color: theme.tColor.light, opacity: 0.8 }} className="mb-6">
        {activity.description}
      </p>
      {activity.type === "ranking" && (
        <RankingActivity activity={activity} theme={theme} onResponse={onResponse} />
      )}
      {activity.type === "matching" && (
        <MatchingActivity activity={activity} theme={theme} onResponse={onResponse} />
      )}
      {activity.type === "scenario" && (
        <ScenarioActivity activity={activity} theme={theme} onResponse={onResponse} />
      )}
      {activity.type === "preference" && (
        <PreferenceActivity activity={activity} theme={theme} onResponse={onResponse} />
      )}
    </ThemeCard>
  );
}

function RankingActivity({ activity, theme, onResponse }: any) {
  const [rankings, setRankings] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const items =
    activity.data.domains ||
    activity.data.stacks ||
    activity.data.technologies ||
    activity.data.moonshots ||
    [];

  const handleDragStart = (item: string) => setDraggedItem(item);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (targetItem: string) => {
    if (!draggedItem) return;
    const newRankings = [...rankings];
    const draggedIndex = newRankings.indexOf(draggedItem);
    const targetIndex = newRankings.indexOf(targetItem);
    if (draggedIndex !== -1) newRankings.splice(draggedIndex, 1);
    newRankings.splice(
      targetIndex !== -1 ? targetIndex : newRankings.length,
      0,
      draggedItem
    );
    setRankings(newRankings);
    setDraggedItem(null);
  };
  const addToRanking = (item: string) =>
    !rankings.includes(item) && setRankings([...rankings, item]);
  const removeFromRanking = (item: string) =>
    setRankings(rankings.filter((r) => r !== item));
  const submitRanking = () =>
    onResponse({
      activityId: activity.id,
      type: "ranking",
      rankings,
      completeness: rankings.length / items.length,
    });

  return (
    <div className="space-y-6">
      <div>
        <h3 style={{ color: theme.tColor.light }} className="text-lg font-medium mb-4">
          Available Items (drag to rank):
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items
            .filter((item: string) => !rankings.includes(item))
            .map((item: string, index: number) => (
              <motion.div
                key={index}
                draggable
                onDragStart={() => handleDragStart(item)}
                onClick={() => addToRanking(item)}
                style={{
                  background: theme.tBorder.light,
                  color: theme.tColor.light,
                  borderRadius: 12,
                  border: `2px dashed transparent`,
                }}
                className="p-3 rounded-lg cursor-move transition-all"
                whileHover={{ scale: 1.02 }}
              >
                {item}
              </motion.div>
            ))}
        </div>
      </div>
      <div>
        <h3 style={{ color: theme.tColor.light }} className="text-lg font-medium mb-4">
          Your Ranking (1 = Most Preferred):
        </h3>
        <div className="space-y-3">
          {rankings.map((item: string, index: number) => (
            <motion.div
              key={item}
              draggable
              onDragStart={() => handleDragStart(item)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(item)}
              style={{
                background: theme.tDepthColor.light,
                color: theme.tColor.light,
                borderRadius: 12,
                border: `2px solid ${theme.tBorder.light}`,
              }}
              className="p-4 cursor-move flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center">
                <span style={{ color: theme.tColor.light }} className="text-lg font-bold mr-4 min-w-8">
                  {index + 1}.
                </span>
                <span style={{ color: theme.tColor.light }}>{item}</span>
              </div>
              <button
                onClick={() => removeFromRanking(item)}
                style={{ color: theme.tColor.light, opacity: 0.6 }}
                className="hover:opacity-100 text-xl"
              >
                ×
              </button>
            </motion.div>
          ))}
          {rankings.length === 0 && (
            <div
              style={{
                border: `2px dashed ${theme.tBorder.light}`,
                borderRadius: 12,
                color: theme.tColor.light,
                opacity: 0.6,
              }}
              className="p-8 text-center"
              onDragOver={handleDragOver}
              onDrop={() => draggedItem && handleDrop("")}
            >
              Drag items here to rank them
            </div>
          )}
        </div>
      </div>
      {rankings.length > 0 && (
        <motion.button
          onClick={submitRanking}
          style={{
            background: theme.tBorder.light,
            color: theme.tColor.light,
            borderRadius: 16,
          }}
          className="w-full px-6 py-3 font-medium text-lg shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Submit Ranking ({rankings.length}/{items.length} ranked)
        </motion.button>
      )}
    </div>
  );
}

function MatchingActivity({ activity, theme, onResponse }: any) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const technologies = activity.data.technologies || [];
  const useCases = activity.data.applications || activity.data.useCases || activity.data.convergences || [];

  const handleTechSelect = (tech: string) => setSelectedTech(tech);
  const handleUseCaseSelect = (useCase: string) => {
    if (selectedTech) {
      setMatches({ ...matches, [selectedTech]: useCase });
      setSelectedTech(null);
    }
  };
  const removeMatch = (tech: string) => {
    const newMatches = { ...matches };
    delete newMatches[tech];
    setMatches(newMatches);
  };
  const submitMatches = () => onResponse({ activityId: activity.id, type: "matching", matches, completeness: Object.keys(matches).length / technologies.length });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Technologies */}
        <div>
          <h3 style={{ color: theme.tColor.light }} className="text-lg font-medium mb-4">Technologies:</h3>
          <div className="space-y-2">
            {technologies.map((tech: string, index: number) => (
              <motion.button
                key={index}
                onClick={() => handleTechSelect(tech)}
                style={{
                  background: selectedTech === tech
                    ? theme.tBorder.light
                    : matches[tech]
                    ? theme.tDepthColor.light
                    : theme.tBorder.light,
                  color: theme.tColor.light,
                  borderRadius: 16,
                }}
                className="w-full p-3 text-left rounded-lg transition-all"
                whileHover={{ scale: 1.02 }}
                disabled={!!matches[tech]}
              >
                <div className="flex items-center justify-between">
                  <span>{tech}</span>
                  {matches[tech] && (
                    <span
                      className="text-lg opacity-60 hover:opacity-100 cursor-pointer ml-2"
                      onClick={e => {
                        e.stopPropagation();
                        removeMatch(tech);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label="Remove match"
                    >×</span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        {/* Use Cases */}
        <div>
          <h3 style={{ color: theme.tColor.light }} className="text-lg font-medium mb-4">Applications/Use Cases:</h3>
          <div className="space-y-2">
            {useCases.map((useCase: string, index: number) => (
              <motion.button
                key={index}
                onClick={() => handleUseCaseSelect(useCase)}
                style={{
                  background: Object.values(matches).includes(useCase)
                    ? theme.tDepthColor.light
                    : theme.tBorder.light,
                  color: theme.tColor.light,
                  borderRadius: 16,
                  opacity: Object.values(matches).includes(useCase) ? 0.5 : 1,
                }}
                className="w-full p-3 text-left rounded-lg transition-all"
                whileHover={{ scale: selectedTech && !Object.values(matches).includes(useCase) ? 1.02 : 1 }}
                disabled={!selectedTech || Object.values(matches).includes(useCase)}
              >
                {useCase}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      {selectedTech && (
        <div
          style={{
            background: theme.tDepthColor.light,
            color: theme.tColor.light,
            borderRadius: 12,
            border: `1px solid ${theme.tBorder.light}`,
          }}
          className="p-4 mb-2"
        >
          Selected: <strong>{selectedTech}</strong> - Click on a use case to match
        </div>
      )}
      {Object.keys(matches).length > 0 && (
        <motion.button
          onClick={submitMatches}
          style={{
            background: theme.tBorder.light,
            color: theme.tColor.light,
            borderRadius: 16,
          }}
          className="w-full px-6 py-3 font-medium text-lg shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Submit Matches ({Object.keys(matches).length}/{technologies.length} matched)
        </motion.button>
      )}
    </div>
  );
}

function ScenarioActivity({ activity, theme, onResponse }: any) {
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const scenarios = activity.data.scenarios || activity.data.approaches || [];
  const submitSelection = () =>
    onResponse({
      activityId: activity.id,
      type: "scenario",
      selectedScenario,
      reasoning: "User preference selection",
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {scenarios.map((scenario: any, index: number) => (
          <motion.div
            key={index}
            onClick={() => setSelectedScenario(scenario)}
            style={{
              border: `2px solid ${selectedScenario === scenario ? theme.tBorder.light : theme.tDepthColor.light}`,
              background: selectedScenario === scenario ? theme.tDepthColor.light : "#fff",
              color: theme.tColor.light,
              borderRadius: 16,
            }}
            className="p-6 rounded-xl cursor-pointer transition-all"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-2">{scenario.title}</h3>
            <p className="opacity-80 mb-4">{scenario.description}</p>
            <div className="flex flex-wrap gap-2 text-sm">
              {scenario.domain && (
                <span
                  style={{
                    background: theme.tDepthColor.light,
                    color: theme.tColor.light,
                    borderRadius: 9999,
                  }}
                  className="px-3 py-1"
                >
                  {scenario.domain}
                </span>
              )}
              {scenario.difficulty && (
                <span
                  style={{
                    background: theme.tDepthColor.light,
                    color: theme.tColor.light,
                    borderRadius: 9999,
                  }}
                  className="px-3 py-1"
                >
                  {scenario.difficulty}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {selectedScenario && (
        <motion.button
          onClick={submitSelection}
          style={{
            background: theme.tBorder.light,
            color: theme.tColor.light,
            borderRadius: 16,
          }}
          className="w-full px-6 py-3 font-medium text-lg shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Select This Project
        </motion.button>
      )}
    </div>
  );
}

function PreferenceActivity({ activity, theme, onResponse }: any) {
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const paths =
    activity.data.paths ||
    activity.data.directions ||
    activity.data.strategies ||
    [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paths.map((path: any, index: number) => (
          <motion.div
            key={index}
            onClick={() => setSelectedPath(path)}
            style={{
              border: `2px solid ${selectedPath === path ? theme.tBorder.light : theme.tDepthColor.light}`,
              background: selectedPath === path ? theme.tDepthColor.light : "#fff",
              color: theme.tColor.light,
              borderRadius: 16,
            }}
            className="p-6 rounded-xl cursor-pointer transition-all"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-3">{path.title}</h3>
            <p className="opacity-80 mb-4 text-sm">{path.description}</p>
          </motion.div>
        ))}
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
          style={{
            background: theme.tBorder.light,
            color: theme.tColor.light,
            borderRadius: 16,
          }}
          className="w-full px-6 py-3 font-medium text-lg shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Choose This Path
        </motion.button>
      )}
    </div>
  );
}

function AssessmentSection({ theme, config, assessments, currentIndex, onResponse }: any) {
  if (!assessments || assessments.length === 0 || currentIndex >= assessments.length) return null;
  const assessment = assessments[currentIndex];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    assessment.questions.forEach((question: any, index: number) => {
      if (question.correctAnswer !== undefined && answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: assessment.questions.length,
      percentage: Math.round((correct / assessment.questions.length) * 100),
    };
  };

  const submitAssessment = () => {
    const score = calculateScore();
    onResponse({
      assessmentId: assessment.id,
      domain: assessment.domain,
      answers,
      score,
    });
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <ThemeCard theme={theme}>
        <h2 style={{ color: theme.tColor.light }} className="text-2xl font-semibold mb-6">
          Assessment Results: {assessment.domain}
        </h2>
        <div className="text-center mb-6">
          <div style={{ color: theme.tBorder.light }} className="text-4xl font-bold mb-2">
            {score.percentage}%
          </div>
          <p style={{ color: theme.tColor.light, opacity: 0.8 }}>
            {score.correct} out of {score.total} correct
          </p>
        </div>
        <div className="space-y-4 mb-6">
          {assessment.questions.map((question: any, index: number) => (
            <div
              key={index}
              style={{
                background: answers[index] === question.correctAnswer ? "#D1FAE5" : answers[index] !== undefined ? "#FEE2E2" : theme.tDepthColor.light,
                border: `1px solid ${theme.tBorder.light}`,
                borderRadius: 8,
              }}
              className="p-4"
            >
              <p style={{ color: theme.tColor.light, fontWeight: 600 }} className="mb-2">
                Q{index + 1}: {question.question}
              </p>
              <p style={{ color: theme.tColor.light }}>
                Your answer: {question.options[answers[index]]}
                {question.correctAnswer !== undefined &&
                  answers[index] !== question.correctAnswer && (
                    <span style={{ color: "#16A34A", display: "block" }}>
                      Correct: {question.options[question.correctAnswer]}
                    </span>
                  )}
              </p>
            </div>
          ))}
        </div>
        <motion.button
          onClick={submitAssessment}
          style={{
            background: theme.tBorder.light,
            color: theme.tColor.light,
            borderRadius: 16,
          }}
          className="w-full px-6 py-3 font-medium text-lg shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue to Next Section
        </motion.button>
      </ThemeCard>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  return (
    <ThemeCard theme={theme}>
      <div className="mb-6">
        <span style={{ color: theme.tColor.light, opacity: 0.6 }}>
          Assessment {currentIndex + 1} - {assessment.domain}
        </span>
        <div className="flex space-x-2 mt-2">
          {assessment.questions.map((_: any, i: number) => (
            <div
              key={i}
              style={{
                background: i < currentQuestionIndex
                  ? theme.tBorder.light
                  : i === currentQuestionIndex
                  ? theme.tDepthColor.light
                  : "#E5E7EB",
                borderRadius: 9999,
                height: 8,
                width: 32,
              }}
            />
          ))}
        </div>
      </div>
      <h2 style={{ color: theme.tColor.light }} className="text-2xl font-semibold mb-6">
        Question {currentQuestionIndex + 1} of {assessment.questions.length}
      </h2>
      <p style={{ color: theme.tColor.light }} className="text-lg mb-6">
        {currentQuestion.question}
      </p>
      <div className="grid grid-cols-1 gap-4">
        {currentQuestion.options.map((option: string, index: number) => (
          <motion.button
            key={index}
            onClick={() => handleAnswer(index)}
            style={{
              background: theme.tBorder.light,
              color: theme.tColor.light,
              borderRadius: 16,
            }}
            className="p-4 font-medium text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
            {option}
          </motion.button>
        ))}
      </div>
    </ThemeCard>
  );
}

function ChallengesSection({ theme, config, challenges, currentIndex, onResponse }: any) {
  if (!challenges || challenges.length === 0 || currentIndex >= challenges.length) return null;
  const challenge = challenges[currentIndex];
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSubmitted(false);
    setResponse("");
  }, [currentIndex]);

  const handleSubmit = () => {
    if (response.trim().length < 50) {
      alert("Please provide a more detailed response (at least 50 characters)");
      return;
    }
    setSubmitted(true);
    onResponse({
      challengeId: challenge.id,
      domain: challenge.domain,
      challenge: challenge.challenge,
      response,
      wordCount: response.split(" ").length,
    });
  };

  if (submitted) {
    return (
      <ThemeCard theme={theme}>
        <h2 style={{ color: theme.tColor.light }} className="text-2xl font-semibold mb-6 text-center">
          Challenge Response Submitted! 🎉
        </h2>
        <div style={{ background: theme.tDepthColor.light, borderRadius: 16 }} className="p-6 mb-6">
          <h3 style={{ color: theme.tColor.light }} className="text-lg font-semibold mb-2">
            Your Response to: {challenge.challenge}
          </h3>
          <p style={{ color: theme.tColor.light, whiteSpace: "pre-wrap" }}>{response}</p>
          <div style={{ color: theme.tColor.light, opacity: 0.6 }} className="mt-4 text-sm">
            Word count: {response.split(" ").length} | Domain: {challenge.domain}
          </div>
        </div>
        <div className="text-center">
          <p style={{ color: theme.tColor.light, opacity: 0.8 }} className="mb-4">
            Your creative thinking and problem-solving approach has been
            recorded for analysis.
          </p>
        </div>
      </ThemeCard>
    );
  }

  return (
    <ThemeCard theme={theme}>
      <div className="mb-6">
        <span style={{ color: theme.tColor.light, opacity: 0.6 }}>
          Challenge {currentIndex + 1} of {challenges.length}
        </span>
      </div>
      <div className="flex items-center mb-4">
        <span
          style={{
            background: theme.tDepthColor.light,
            color: theme.tColor.light,
            borderRadius: 9999,
            padding: "0.25em 0.75em",
            marginRight: 12,
          }}
        >
          {challenge.domain}
        </span>
        <span
          style={{
            background: theme.tDepthColor.light,
            color: theme.tColor.light,
            borderRadius: 9999,
            padding: "0.25em 0.75em",
          }}
        >
          {challenge.type}
        </span>
      </div>
      <h2 style={{ color: theme.tColor.light }} className="text-2xl font-semibold mb-4">
        {challenge.challenge}
      </h2>
      <div style={{ background: theme.tDepthColor.light, borderRadius: 16 }} className="p-6 mb-6">
        <p style={{ color: theme.tColor.light }}>{challenge.prompt}</p>
      </div>
      <div className="mb-6">
        <label style={{ color: theme.tColor.light }} className="block font-medium mb-3">
          Your Response:
        </label>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Share your thoughts, ideas, and solutions here. Be creative and detailed in your response..."
          style={{
            width: "100%",
            height: "10em",
            padding: "1em",
            border: `1px solid ${theme.tBorder.light}`,
            borderRadius: 16,
            resize: "none",
            background: "#fff",
          }}
        />
        <div className="flex justify-between mt-2">
          <span style={{ color: theme.tColor.light, opacity: 0.6 }} className="text-sm">
            Minimum 50 characters required
          </span>
          <span style={{ color: theme.tColor.light, opacity: 0.6 }} className="text-sm">
            {response.length} characters | {response.split(" ").filter((w) => w).length} words
          </span>
        </div>
      </div>
      <motion.button
        onClick={handleSubmit}
        disabled={response.trim().length < 50}
        style={{
          background: response.trim().length >= 50 ? theme.tBorder.light : "#E5E7EB",
          color: response.trim().length >= 50 ? theme.tColor.light : "#9CA3AF",
          borderRadius: 16,
          cursor: response.trim().length >= 50 ? "pointer" : "not-allowed",
        }}
        className="w-full px-6 py-3 font-medium text-lg shadow-lg transition-all"
        whileHover={response.trim().length >= 50 ? { scale: 1.02 } : {}}
        whileTap={response.trim().length >= 50 ? { scale: 0.98 } : {}}
      >
        Submit Challenge Response
      </motion.button>
    </ThemeCard>
  );
}

function ResultsSection({ theme, config, userProfile, responses, trackerData }: any) {
  // Collect answers per section
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

  // Simulated backend payload (for Kafka/AI)
  const backendPayload = useMemo(() => ({
    profile: userProfile,
    questions: sectionAnswers.questions,
    activities: sectionAnswers.activities,
    assessments: sectionAnswers.assessments,
    challenges: sectionAnswers.challenges,
    timestamp: new Date().toISOString(),
  }), [userProfile, sectionAnswers]);

  return (
    <ThemeCard theme={theme}>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-3" style={{ color: theme.tColor.light }}>
          Backend Payload (Kafka/AI)
        </h2>
        <div className="w-full max-w-3xl mx-auto mb-6">
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: `1px solid ${theme.tBorder.light}`,
              color: theme.tDepthColor.light,
            }}
            className="p-4 text-xs font-mono overflow-auto"
          >
            <pre>{JSON.stringify(backendPayload, null, 2)}</pre>
          </div>
        </div>
        <div
          style={{
            background: theme.tColor.light,
            borderRadius: 16,
            border: `1px solid ${theme.tBorder.light}`,
            color: theme.tDepthColor.light,
          }}
          className="p-4 text-base mb-2 w-full max-w-3xl mx-auto"
        >
          <strong>What can be done with this data?</strong>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              <b>Personalized Learning:</b> AI can analyze preferences, strengths, and gaps to recommend tailored learning paths, resources, or projects.
            </li>
            <li>
              <b>Profile Generation:</b> The backend can generate a tech profile, visualize interests, and track a student's growth over time.
            </li>
            <li>
              <b>Adaptive Challenges:</b> Future activities can be selected or adapted based on user strengths and interests.
            </li>
            <li>
              <b>Analytics & Insights:</b> Educators and admins can see aggregate data (across users) for domain interest, skill gaps, and behavioral trends.
            </li>
            <li>
              <b>AI Recommendations:</b> The data can be streamed to a Kafka pipeline for real-time AI processing, clustering similar learners, or automating guidance.
            </li>
            <li>
              <b>Feedback Loops:</b> User responses can be used to train AI models for better content, detect engagement, or even predict success.
            </li>
          </ul>
        </div>
        <div
          className="mt-4 text-sm w-full max-w-3xl mx-auto"
          style={{ color: theme.tBorder.light }}
        >
          <strong>Note for Review:</strong> This payload is exactly what will be sent to the backend via Kafka for further analytics, profile building, and AI-driven adaptive learning.
        </div>
      </div>
    </ThemeCard>
  );
}