'use client'

import React, { useState, useEffect } from 'react';
import { Trophy, Award, Calendar, Target, X, ChevronRight, Medal, Clock, Star, User, Brain, Code, Cpu, Database, Globe, Moon, Sun } from 'lucide-react';

export default function BountyBoard() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeTab, setActiveTab] = useState('bounties');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const departments = [
    { id: 'aiml', name: 'AIML', color: 'bg-[#E53E3E]', desc: 'Artificial Intelligence', icon: Brain },
    { id: 'it', name: 'IT', color: 'bg-[#E53E3E]', desc: 'Information Technology', icon: Globe },
    { id: 'comps', name: 'COMPS', color: 'bg-[#E53E3E]', desc: 'Computer Science', icon: Code },
    { id: 'ecs', name: 'ECS', color: 'bg-[#E53E3E]', desc: 'Electronics & Communication', icon: Cpu },
    { id: 'cse', name: 'CSE', color: 'bg-[#E53E3E]', desc: 'Computer Systems', icon: Database }
  ];

  const bounties = {
    aiml: [
      { id: 1, title: "Build a Neural Network Visualizer", field: "Machine Learning", points: 100, date: "2025-10-05", difficulty: "Hard", description: "Create an interactive tool to visualize neural network architectures" },
      { id: 2, title: "Create a Sentiment Analysis Tool", field: "NLP", points: 85, date: "2025-10-06", difficulty: "Medium", description: "Build a sentiment analyzer for social media text" },
      { id: 3, title: "Implement K-Means Clustering Demo", field: "Data Science", points: 70, date: "2025-10-07", difficulty: "Medium", description: "Develop an interactive clustering visualization" }
    ],
    it: [
      { id: 4, title: "Design a RESTful API", field: "Backend Development", points: 90, date: "2025-10-05", difficulty: "Hard", description: "Design and document a scalable REST API" },
      { id: 5, title: "Build a Cloud Storage App", field: "Cloud Computing", points: 95, date: "2025-10-06", difficulty: "Hard", description: "Create a secure file storage solution" },
      { id: 6, title: "Create Network Monitoring Dashboard", field: "DevOps", points: 80, date: "2025-10-08", difficulty: "Medium", description: "Build a real-time network monitoring tool" }
    ],
    comps: [
      { id: 7, title: "Make a Login Page", field: "Web Development", points: 80, date: "2025-10-04", difficulty: "Easy", description: "Design an accessible authentication interface" },
      { id: 8, title: "Create Responsive Landing Page", field: "Frontend", points: 75, date: "2025-10-05", difficulty: "Medium", description: "Build a mobile-first landing page" },
      { id: 9, title: "Build a Task Manager App", field: "Full Stack", points: 110, date: "2025-10-07", difficulty: "Hard", description: "Develop a complete task management system" }
    ],
    ecs: [
      { id: 10, title: "Design PCB for IoT Device", field: "Hardware", points: 120, date: "2025-10-06", difficulty: "Hard", description: "Create PCB layout for IoT sensor node" },
      { id: 11, title: "Simulate Digital Circuits", field: "VLSI", points: 85, date: "2025-10-07", difficulty: "Medium", description: "Build digital circuit simulation tool" },
      { id: 12, title: "Create Arduino Weather Station", field: "Embedded Systems", points: 90, date: "2025-10-08", difficulty: "Medium", description: "Develop IoT weather monitoring system" }
    ],
    cse: [
      { id: 13, title: "Implement Sorting Algorithm Visualizer", field: "Algorithms", points: 70, date: "2025-10-05", difficulty: "Medium", description: "Create visual sorting algorithm comparison tool" },
      { id: 14, title: "Build a Compiler Front-end", field: "System Programming", points: 130, date: "2025-10-09", difficulty: "Hard", description: "Develop lexer and parser for custom language" },
      { id: 15, title: "Create Database Schema Designer", field: "Database", points: 95, date: "2025-10-06", difficulty: "Hard", description: "Build visual database design tool" }
    ]
  };

  const leaderboard = [
    { rank: 1, name: "Aaryan Ghawali", department: "COMPS", points: 1240, avatar: "AG", badges: 12 },
    { rank: 2, name: "Aditya Chaudhari", department: "AIML", points: 1180, avatar: "AC", badges: 11 },
    { rank: 3, name: "Paresh Gupta", department: "IT", points: 1150, avatar: "PG", badges: 10 },
    { rank: 4, name: "Omkar Chandgaonkar", department: "CSE", points: 1090, avatar: "OC", badges: 9 },
    { rank: 5, name: "Priya Sharma", department: "ECS", points: 980, avatar: "PS", badges: 8 },
    { rank: 6, name: "Rahul Verma", department: "COMPS", points: 920, avatar: "RV", badges: 7 },
    { rank: 7, name: "Sneha Patel", department: "AIML", points: 875, avatar: "SP", badges: 7 },
    { rank: 8, name: "Vikram Singh", department: "IT", points: 840, avatar: "VS", badges: 6 }
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-emerald-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      case 'Hard': return 'bg-rose-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRankMedal = (rank) => {
    switch(rank) {
      case 1: return <Medal className="w-7 h-7 text-yellow-500 fill-yellow-200" />;
      case 2: return <Medal className="w-7 h-7 text-gray-400 fill-gray-200" />;
      case 3: return <Medal className="w-7 h-7 text-orange-600 fill-orange-200" />;
      default: return <div className="w-7 h-7 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300">{rank}</div>;
    }
  };

  const getFieldIcon = (field) => {
    const fieldIcons = {
      'Machine Learning': <Brain className="w-4 h-4 mr-2 text-blue-500" />,
      'NLP': <Brain className="w-4 h-4 mr-2 text-blue-500" />,
      'Data Science': <Brain className="w-4 h-4 mr-2 text-blue-500" />,
      'Backend Development': <Code className="w-4 h-4 mr-2 text-blue-500" />,
      'Cloud Computing': <Globe className="w-4 h-4 mr-2 text-blue-500" />,
      'DevOps': <Globe className="w-4 h-4 mr-2 text-blue-500" />,
      'Web Development': <Code className="w-4 h-4 mr-2 text-blue-500" />,
      'Frontend': <Code className="w-4 h-4 mr-2 text-blue-500" />,
      'Full Stack': <Code className="w-4 h-4 mr-2 text-blue-500" />,
      'Hardware': <Cpu className="w-4 h-4 mr-2 text-blue-500" />,
      'VLSI': <Cpu className="w-4 h-4 mr-2 text-blue-500" />,
      'Embedded Systems': <Cpu className="w-4 h-4 mr-2 text-blue-500" />,
      'Algorithms': <Database className="w-4 h-4 mr-2 text-blue-500" />,
      'System Programming': <Database className="w-4 h-4 mr-2 text-blue-500" />,
      'Database': <Database className="w-4 h-4 mr-2 text-blue-500" />
    };
    return fieldIcons[field] || <Target className="w-4 h-4 mr-2 text-blue-500" />;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-[#FAF9F6] via-white to-[#F0EDE6] text-gray-900'
    }`}>
      {/* Navigation Bar */}
      <nav className={`backdrop-blur-lg border-b sticky top-0 z-50 shadow-sm transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800/90 border-gray-700 shadow-gray-900/50' 
          : 'bg-white/90 border-[#E53E3E]/10'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-[#E53E3E] p-2.5 rounded-xl shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">ASCENT Bounty Board</h1>
                <p className={`text-xs font-medium tracking-wide ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Challenge Yourself, Earn Rewards
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              <div className={`flex space-x-1 rounded-xl p-1.5 shadow-inner border transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-100 border-gray-300'
              }`}>
                <button
                  onClick={() => setActiveTab('bounties')}
                  className={`px-8 py-2.5 rounded-lg transition-all duration-300 font-semibold text-sm ${
                    activeTab === 'bounties'
                      ? 'bg-blue-500 text-white shadow-md transform scale-105'
                      : darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-600/60' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  Bounties
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-8 py-2.5 rounded-lg transition-all duration-300 font-semibold text-sm ${
                    activeTab === 'leaderboard'
                      ? 'bg-blue-500 text-white shadow-md transform scale-105'
                      : darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-600/60' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  Leaderboard
                </button>
              </div>
              
              {/* User Profile */}
              <div className={`flex items-center space-x-3 rounded-xl px-4 py-2.5 border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-600 hover:bg-gray-700/80' 
                  : 'bg-white/80 border-gray-300 hover:bg-white'
              }`}>
                <div className="w-10 h-10 bg-gradient-to-br from-[#E53E3E] to-[#C53030] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  <User className="w-5 h-5" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold">My Profile</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    View challenges
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'bounties' ? (
          <>
            {/* Department Cards */}
            <div className="mb-16">
              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-3 flex items-center tracking-tight">
                  <Award className="w-9 h-9 mr-3 text-[#E53E3E]" />
                  Select Your Department
                </h2>
                <p className={`ml-12 text-lg tracking-wide ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Choose your field of expertise to view relevant challenges
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {departments.map((dept) => {
                  const IconComponent = dept.icon;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDepartment(dept.id)}
                      className={`${dept.color} p-7 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-white/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden min-h-[160px] flex flex-col justify-center`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="text-center relative z-10">
                        <div className="flex justify-center mb-3">
                          <IconComponent className="w-8 h-8 text-white opacity-90" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-2 tracking-wide">{dept.name}</div>
                        <div className="text-xs text-white/90 mb-4 font-medium tracking-wide">{dept.desc}</div>
                        <div className="text-sm text-white flex items-center justify-center font-semibold tracking-wide">
                          View Challenges
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className={`border-t my-16 ${
              darkMode ? 'border-gray-700' : 'border-gray-300'
            }`}></div>

            {/* Today's Bounties Section */}
            <div>
              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-3 flex items-center tracking-tight">
                  <Trophy className="w-9 h-9 mr-3 text-[#E53E3E]" />
                  Featured Bounties
                </h2>
                <p className={`ml-12 text-lg tracking-wide ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Top challenges waiting for you today
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.values(bounties).flat().slice(0, 6).map((bounty) => (
                  <div
                    key={bounty.id}
                    className={`rounded-2xl p-7 hover:border-[#E53E3E] hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1 shadow-lg border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 hover:shadow-orange-500/20' 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-5">
                      <span className={`${getDifficultyColor(bounty.difficulty)} text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide shadow-sm`}>
                        {bounty.difficulty}
                      </span>
                      <div className={`flex items-center space-x-1.5 px-3 py-2 rounded-full shadow-sm ${
                        darkMode ? 'bg-amber-900/30' : 'bg-amber-100'
                      }`}>
                        <Star className={`w-4 h-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'} fill-current`} />
                        <span className={`font-bold text-base ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                          {bounty.points}
                        </span>
                      </div>
                    </div>
                    <h3 className={`text-xl font-bold mb-4 line-clamp-2 group-hover:text-[#E53E3E] transition-colors duration-300 tracking-tight leading-tight ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {bounty.title}
                    </h3>
                    <p className={`text-sm mb-6 line-clamp-2 leading-relaxed tracking-wide ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {bounty.description}
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className={`flex items-center text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {getFieldIcon(bounty.field)}
                        <span className="font-semibold tracking-wide">{bounty.field}</span>
                      </div>
                      <div className={`flex items-center text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="tracking-wide">Due: {new Date(bounty.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 tracking-wide">
                      Accept Challenge
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Leaderboard Section */
          <div>
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-3 flex items-center tracking-tight">
                <Trophy className="w-9 h-9 mr-3 text-[#E53E3E]" />
                Global Leaderboard
              </h2>
              <p className={`ml-12 text-lg tracking-wide ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Top performers across all departments
              </p>
            </div>
            <div className={`rounded-2xl overflow-hidden shadow-2xl border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 shadow-gray-900/50' 
                : 'bg-white border-gray-300'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${
                    darkMode 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600' 
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
                  }`}>
                    <tr>
                      <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wider">Rank</th>
                      <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wider">Student</th>
                      <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wider">Department</th>
                      <th className="px-8 py-6 text-left text-sm font-bold uppercase tracking-wider">Badges</th>
                      <th className="px-8 py-6 text-right text-sm font-bold uppercase tracking-wider">Points</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    darkMode ? 'divide-gray-700' : 'divide-gray-200'
                  }`}>
                    {leaderboard.map((student) => (
                      <tr
                        key={student.rank}
                        className={`hover:bg-opacity-50 transition-colors duration-200 group ${
                          student.rank <= 3 
                            ? darkMode 
                              ? 'bg-gradient-to-r from-amber-900/10 to-transparent' 
                              : 'bg-gradient-to-r from-amber-50 to-transparent'
                            : ''
                        } ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center transform group-hover:scale-110 transition-transform duration-200">
                            {getRankMedal(student.rank)}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#E53E3E] to-[#C53030] rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm transform group-hover:scale-110 transition-transform duration-200">
                              {student.avatar}
                            </div>
                            <span className="font-semibold text-base tracking-wide group-hover:text-[#E53E3E] transition-colors duration-200">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-block px-4 py-2 rounded-xl font-semibold text-sm tracking-wide shadow-sm ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {student.department}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-2">
                            <Award className="w-5 h-5 text-blue-500 transform group-hover:scale-110 transition-transform duration-200" />
                            <span className={`font-semibold text-base ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {student.badges}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-2xl font-bold text-[#E53E3E] tracking-tight">
                              {student.points.toLocaleString()}
                            </span>
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

      {/* Department Modal */}
      {selectedDepartment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className={`rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border shadow-2xl animate-in slide-in-from-bottom-8 duration-500 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-300'
          }`}>
            <div className="bg-gradient-to-r from-[#E53E3E] to-[#C53030] p-8 flex justify-between items-center shadow-lg">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
                  {departments.find(d => d.id === selectedDepartment)?.name} Department
                </h3>
                <p className="text-white/90 text-lg tracking-wide">{departments.find(d => d.id === selectedDepartment)?.desc} Challenges</p>
              </div>
              <button
                onClick={() => setSelectedDepartment(null)}
                className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-300 transform hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              {bounties[selectedDepartment]?.map((bounty) => (
                <div
                  key={bounty.id}
                  className={`rounded-2xl p-7 hover:border-[#E53E3E] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg border-2 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
                      : 'bg-gradient-to-br from-gray-50 to-white border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h4 className={`text-2xl font-bold mb-3 tracking-tight leading-tight ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {bounty.title}
                      </h4>
                      <p className={`mb-5 text-lg leading-relaxed tracking-wide ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {bounty.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className={`${getDifficultyColor(bounty.difficulty)} text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wide shadow-sm`}>
                          {bounty.difficulty}
                        </span>
                        <span className={`text-sm flex items-center px-4 py-2 rounded-full shadow-sm font-semibold tracking-wide ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {getFieldIcon(bounty.field)}
                          {bounty.field}
                        </span>
                        <span className={`text-sm flex items-center font-medium tracking-wide ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <Clock className="w-4 h-4 mr-1.5 text-blue-500" />
                          {new Date(bounty.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className={`flex items-center space-x-2 px-5 py-3 rounded-2xl mb-3 shadow-lg ${
                        darkMode ? 'bg-amber-900/30' : 'bg-amber-100'
                      }`}>
                        <Star className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-amber-600'} fill-current`} />
                        <span className={`font-bold text-3xl tracking-tight ${
                          darkMode ? 'text-amber-400' : 'text-amber-600'
                        }`}>
                          {bounty.points}
                        </span>
                      </div>
                      <span className={`text-sm font-semibold tracking-wide ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Points
                      </span>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 tracking-wide">
                    Accept Challenge
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


