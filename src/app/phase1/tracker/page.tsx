"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  {
    id: 1,
    question: "Which of these excites you the most?",
    options: [
      "🧠 AI & Machine Learning",
      "🌐 Web & App Development",
      "🔐 Cybersecurity",
      "📊 Data & Analytics",
      "⚙️ Hardware / IoT",
    ],
  },
  {
    id: 2,
    question: "How do you like to solve problems?",
    options: [
      "🎨 Creative projects",
      "🧩 Logical puzzles",
      "🛡️ Security challenges",
      "📈 Data-driven analysis",
      "🔧 Building real-world systems",
    ],
  },
  {
    id: 3,
    question: "Pick a project you’d love to work on:",
    options: [
      "🤖 AI chatbot",
      "🛒 E-commerce app",
      "🔍 Security audit tool",
      "📊 Data visualization dashboard",
      "📡 Smart IoT device",
    ],
  },
];

export default function BehaviourTracker() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (answer: string) => {
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setCompleted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0f2fe] to-[#fde68a] px-6 py-10 text-center font-serif">
      <motion.h1
        className="text-5xl font-bold mb-8 text-gray-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Behaviour Tracker ✨
      </motion.h1>

      {/* Progress indicator */}
      <div className="flex space-x-2 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full ${
              i <= currentQ ? "bg-purple-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Questions flow */}
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key={questions[currentQ].id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                {questions[currentQ].question}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[currentQ].options.map((opt) => (
                  <motion.button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="p-4 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl font-medium shadow"
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-3xl font-bold text-purple-700 mb-4">
                Your Interests 🌟
              </h2>
              <ul className="space-y-2 text-lg text-gray-700">
                {answers.map((ans, i) => (
                  <li key={i}>➡️ {ans}</li>
                ))}
              </ul>
              <p className="mt-6 text-gray-600 italic">
                We'll use this to map your technical domain interests 🎯
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
