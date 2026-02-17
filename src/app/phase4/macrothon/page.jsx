'use client'

import React, { useState } from 'react';
import { Trophy, Code, Terminal, Zap, Clock, User, Moon, Sun, Cpu, Database, Lock, Server, CheckCircle, Play, Star, Sparkles } from 'lucide-react';

export default function Macrothon() {
  const [activeTab, setActiveTab] = useState('challenges');
  const [darkMode, setDarkMode] = useState(true);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [showSubmission, setShowSubmission] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const startChallenge = (challengeId) => {
    setCurrentChallenge(challengeId);
    setShowSubmission(true);
  };

  const submitSolution = () => {
    if (currentChallenge && !completedChallenges.includes(currentChallenge)) {
      setCompletedChallenges(prev => [...prev, currentChallenge]);
    }
    setShowSubmission(false);
    setCurrentChallenge(null);
  };

  const categories = [
    { id: 'frontend', name: 'Frontend', color: 'from-blue-500 to-cyan-500', icon: Code, tech: 'React/Next.js' },
    { id: 'backend', name: 'Backend', color: 'from-green-500 to-emerald-500', icon: Server, tech: 'Node.js/API' },
    { id: 'database', name: 'Database', color: 'from-purple-500 to-pink-500', icon: Database, tech: 'SQL/NoSQL' },
    { id: 'algorithms', name: 'Algorithms', color: 'from-orange-500 to-red-500', icon: Cpu, tech: 'Data Structures' },
    { id: 'security', name: 'Security', color: 'from-yellow-500 to-amber-500', icon: Lock, tech: 'Auth/Encryption' }
  ];

  const dailyChallenges = [
    { 
      id: 1, 
      title: 'Build a Login Authentication System', 
      category: 'security', 
      points: 50, 
      duration: '45 min', 
      difficulty: 'Intermediate',
      description: 'Create a secure login system with email/password authentication and session management.',
      requirements: ['Password hashing', 'Session tokens', 'Input validation', 'Error handling'],
      tech: ['Node.js', 'Express', 'JWT', 'bcrypt']
    },
    { 
      id: 2, 
      title: 'Responsive Dashboard Component', 
      category: 'frontend', 
      points: 35, 
      duration: '30 min', 
      difficulty: 'Beginner',
      description: 'Build a responsive admin dashboard with charts and data tables.',
      requirements: ['Mobile-first design', 'Chart integration', 'Data fetching', 'Loading states'],
      tech: ['React', 'Tailwind CSS', 'Chart.js', 'API integration']
    },
    { 
      id: 3, 
      title: 'REST API for Todo App', 
      category: 'backend', 
      points: 40, 
      duration: '35 min', 
      difficulty: 'Intermediate',
      description: 'Develop a complete REST API for a todo application with CRUD operations.',
      requirements: ['GET/POST/PUT/DELETE', 'Data validation', 'Error handling', 'API documentation'],
      tech: ['Express.js', 'MongoDB', 'Mongoose', 'Postman']
    },
    { 
      id: 4, 
      title: 'Database Schema Design', 
      category: 'database', 
      points: 45, 
      duration: '40 min', 
      difficulty: 'Intermediate',
      description: 'Design and implement a database schema for an e-commerce platform.',
      requirements: ['Normalization', 'Relationships', 'Indexes', 'Query optimization'],
      tech: ['SQL', 'PostgreSQL', 'ER Diagrams', 'Performance']
    },
    { 
      id: 5, 
      title: 'Sorting Algorithm Visualizer', 
      category: 'algorithms', 
      points: 60, 
      duration: '50 min', 
      difficulty: 'Advanced',
      description: 'Create a visualizer for sorting algorithms with real-time animation.',
      requirements: ['Multiple algorithms', 'Visual animation', 'Performance metrics', 'User controls'],
      tech: ['JavaScript', 'Canvas API', 'Algorithms', 'UI/UX']
    },
    { 
      id: 6, 
      title: 'Password Strength Checker', 
      category: 'security', 
      points: 25, 
      duration: '20 min', 
      difficulty: 'Beginner',
      description: 'Build a real-time password strength analyzer with visual feedback.',
      requirements: ['Real-time validation', 'Strength metrics', 'Visual indicators', 'Security rules'],
      tech: ['JavaScript', 'Regex', 'CSS animations', 'Security']
    },
    { 
      id: 7, 
      title: 'Animated Landing Page', 
      category: 'frontend', 
      points: 45, 
      duration: '40 min', 
      difficulty: 'Intermediate',
      description: 'Create an eye-catching landing page with smooth scroll animations and parallax effects.',
      requirements: ['Scroll animations', 'Parallax effects', 'Responsive design', 'Performance optimization'],
      tech: ['React', 'Framer Motion', 'Tailwind CSS', 'Intersection Observer']
    },
    { 
      id: 8, 
      title: 'WebSocket Chat Server', 
      category: 'backend', 
      points: 55, 
      duration: '45 min', 
      difficulty: 'Advanced',
      description: 'Build a real-time chat server with WebSocket support and message persistence.',
      requirements: ['Real-time messaging', 'User authentication', 'Message history', 'Room management'],
      tech: ['Socket.io', 'Node.js', 'Redis', 'Express']
    },
    { 
      id: 9, 
      title: 'Query Optimization Challenge', 
      category: 'database', 
      points: 50, 
      duration: '40 min', 
      difficulty: 'Advanced',
      description: 'Optimize slow database queries and improve database performance by 10x.',
      requirements: ['Index optimization', 'Query analysis', 'Execution plans', 'Performance testing'],
      tech: ['SQL', 'PostgreSQL', 'EXPLAIN', 'Indexing']
    },
    { 
      id: 10, 
      title: 'Binary Search Tree Implementation', 
      category: 'algorithms', 
      points: 55, 
      duration: '45 min', 
      difficulty: 'Intermediate',
      description: 'Implement a balanced binary search tree with insertion, deletion, and traversal operations.',
      requirements: ['Tree balancing', 'CRUD operations', 'Tree traversal', 'Time complexity analysis'],
      tech: ['JavaScript', 'Data Structures', 'Algorithms', 'Testing']
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Alex Chen", points: 1245, challenges: 28, avatar: "AC", specialization: 'Full Stack' },
    { rank: 2, name: "Sarah Wilson", points: 1180, challenges: 25, avatar: "SW", specialization: 'Frontend' },
    { rank: 3, name: "Mike Rodriguez", points: 1120, challenges: 23, avatar: "MR", specialization: 'Backend' },
    { rank: 4, name: "Priya Patel", points: 985, challenges: 21, avatar: "PP", specialization: 'Security' },
    { rank: 5, name: "James Kim", points: 920, challenges: 19, avatar: "JK", specialization: 'DevOps' }
  ];

  const userStats = {
    totalPoints: 845,
    challengesCompleted: 18,
    currentStreak: 6,
    level: 'Intermediate Coder',
    specialization: 'Full Stack'
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : 'from-gray-500 to-gray-600';
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-500 text-white';
      case 'Intermediate': return 'bg-yellow-500 text-white';
      case 'Advanced': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const completedCount = completedChallenges.length;
  const totalPoints = dailyChallenges
    .filter(challenge => completedChallenges.includes(challenge.id))
    .reduce((sum, challenge) => sum + challenge.points, 0);

  const filteredChallenges = selectedCategory
    ? dailyChallenges.filter(challenge => challenge.category === selectedCategory)
    : dailyChallenges;

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-gray-50 to-cyan-50 text-gray-900'
    }`}>
      
      {/* Animated Background with Moving Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse ${
          darkMode ? 'bg-blue-500' : 'bg-blue-300'
        }`} style={{ animationDuration: '4s' }}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${
          darkMode ? 'bg-cyan-500' : 'bg-cyan-300'
        }`} style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 animate-pulse ${
          darkMode ? 'bg-purple-500' : 'bg-purple-300'
        }`} style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
        
        {/* Animated Connection Lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: darkMode ? '#3b82f6' : '#60a5fa', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: darkMode ? '#06b6d4' : '#22d3ee', stopOpacity: 0.4 }} />
              <stop offset="100%" style={{ stopColor: darkMode ? '#3b82f6' : '#60a5fa', stopOpacity: 0 }} />
            </linearGradient>
            <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: darkMode ? '#8b5cf6' : '#a78bfa', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: darkMode ? '#ec4899' : '#f472b6', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: darkMode ? '#8b5cf6' : '#a78bfa', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          
          {/* Horizontal traveling lines */}
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="url(#lineGradient1)" strokeWidth="1">
            <animate attributeName="x1" values="-100%;200%" dur="8s" repeatCount="indefinite" />
            <animate attributeName="x2" values="0%;300%" dur="8s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="45%" x2="100%" y2="45%" stroke="url(#lineGradient1)" strokeWidth="1">
            <animate attributeName="x1" values="-100%;200%" dur="12s" repeatCount="indefinite" />
            <animate attributeName="x2" values="0%;300%" dur="12s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="url(#lineGradient2)" strokeWidth="1">
            <animate attributeName="x1" values="-100%;200%" dur="10s" repeatCount="indefinite" />
            <animate attributeName="x2" values="0%;300%" dur="10s" repeatCount="indefinite" />
          </line>
          
          {/* Diagonal connecting lines */}
          <line x1="0%" y1="0%" x2="30%" y2="100%" stroke="url(#lineGradient1)" strokeWidth="1" strokeDasharray="4 4">
            <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite" />
            <animate attributeName="x1" values="0%;100%" dur="15s" repeatCount="indefinite" />
            <animate attributeName="x2" values="30%;130%" dur="15s" repeatCount="indefinite" />
          </line>
          <line x1="100%" y1="0%" x2="70%" y2="100%" stroke="url(#lineGradient2)" strokeWidth="1" strokeDasharray="4 4">
            <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite" />
            <animate attributeName="x1" values="100%;0%" dur="18s" repeatCount="indefinite" />
            <animate attributeName="x2" values="70%;-30%" dur="18s" repeatCount="indefinite" />
          </line>
          
          {/* Connection dots */}
          <circle cx="10%" cy="20%" r="3" fill={darkMode ? '#3b82f6' : '#60a5fa'} opacity="0.6">
            <animate attributeName="cx" values="10%;90%;10%" dur="20s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="90%" cy="45%" r="3" fill={darkMode ? '#06b6d4' : '#22d3ee'} opacity="0.5">
            <animate attributeName="cx" values="90%;10%;90%" dur="25s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="50%" cy="70%" r="3" fill={darkMode ? '#8b5cf6' : '#a78bfa'} opacity="0.7">
            <animate attributeName="cx" values="50%;20%;80%;50%" dur="22s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 pt-24">{/* Added pt-24 for top padding */}
        {activeTab === 'challenges' ? (
          <>
            {/* Header Section */}
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Macrothon - Today's Coding Challenges
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Solve real-world programming problems. Build portfolio projects. Level up your skills daily.
              </p>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`rounded-2xl p-6 shadow-lg border backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-600' 
                  : 'bg-white/50 border-blue-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalPoints}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Points Earned</div>
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-lg border backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-600' 
                  : 'bg-white/50 border-blue-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{completedCount}/{dailyChallenges.length}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Challenges Completed</div>
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-lg border backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-600' 
                  : 'bg-white/50 border-blue-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{userStats.currentStreak}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  selectedCategory === null
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-500'
                    : darkMode 
                      ? 'bg-gray-800 border-gray-600 hover:border-blue-500' 
                      : 'bg-white border-gray-300 hover:border-blue-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium text-sm">All Challenges</span>
                </div>
              </div>
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                      isSelected
                        ? `bg-gradient-to-r ${category.color} text-white border-transparent`
                        : darkMode 
                          ? 'bg-gray-800 border-gray-600 hover:border-blue-500' 
                          : 'bg-white border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`rounded-2xl p-6 shadow-lg border-2 transition-all duration-500 transform hover:scale-105 group ${
                    darkMode 
                      ? 'bg-gray-800/80 border-gray-600 hover:border-blue-500' 
                      : 'bg-white/80 border-gray-300 hover:border-blue-500'
                  } ${completedChallenges.includes(challenge.id) ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(challenge.category)}`}>
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-amber-600">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span className="font-bold">{challenge.points} XP</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors duration-300">
                    {challenge.title}
                  </h3>

                  <p className={`mb-4 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {challenge.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-sm">Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge.requirements.map((req, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded text-xs ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-sm">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge.tech.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded text-xs bg-blue-500 text-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center space-x-1 text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <Clock className="w-4 h-4" />
                        <span>{challenge.duration}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => startChallenge(challenge.id)}
                      disabled={completedChallenges.includes(challenge.id)}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                        completedChallenges.includes(challenge.id)
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                      }`}
                    >
                      {completedChallenges.includes(challenge.id) ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Play className="w-4 h-4" />
                          <span>Start Challenge</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Leaderboard Section */
          <div>
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Global Leaderboard
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Top coders ranked by their problem-solving skills and consistency
              </p>
            </div>

            {/* User Rank Card */}
            <div className={`rounded-2xl p-6 mb-8 shadow-lg border ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500/30' 
                : 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    You
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Your Progress</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {userStats.level} • {userStats.specialization}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{userStats.totalPoints} XP</div>
                  <div className="text-sm text-gray-500">#{leaderboard.length + 1} Rank</div>
                </div>
              </div>
            </div>

            {/* Leaderboard List */}
            <div className={`rounded-2xl overflow-hidden shadow-2xl border ${
              darkMode 
                ? 'bg-gray-800/80 border-gray-700' 
                : 'bg-white/80 border-gray-300'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-100 border-gray-300'
                  }`}>
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Coder</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Specialization</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Challenges</th>
                      <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {leaderboard.map((user, index) => (
                      <tr
                        key={user.rank}
                        className={`hover:bg-opacity-50 transition-colors duration-200 ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        } ${index < 3 ? 'bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-900/10' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {index < 3 ? (
                              <Trophy className={`w-6 h-6 ${
                                index === 1 ? 'text-gray-400' : 'text-orange-500'
                              }`} />
                            ) : (
                              <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">
                                {user.rank}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              {user.avatar}
                            </div>
                            <div>
                              <div className="font-semibold">{user.name}</div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Level {Math.floor(user.points / 100) + 1}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {user.specialization}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Code className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold">{user.challenges}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-xl font-bold text-blue-600">{user.points}</span>
                            <span className="text-sm text-gray-500">XP</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Challenge Submission Modal */}
      {showSubmission && currentChallenge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl max-w-2xl w-full p-8 shadow-2xl border ${
            darkMode 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-white border-gray-300'
          }`}>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              Submit Your Solution
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">GitHub Repository URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/yourusername/project-name"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Live Demo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://your-project.vercel.app"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Notes (Optional)</label>
                <textarea
                  placeholder="Any comments about your implementation..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowSubmission(false)}
                className={`flex-1 py-3 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'border-gray-600 hover:bg-gray-700' 
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={submitSolution}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg"
              >
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
