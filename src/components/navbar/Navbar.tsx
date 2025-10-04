"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import Image from "next/image";

const Navbar = ({
  phaseNo = 2,
  username = "Paresh",
  points = 1000,
  triangle = true,
  tBorder = {
    light: "#E53E3E",
    dark: "#EF4444",
  },
  tColor = {
    dark: "#06B6D4",
    light: "#14B8A6",
  },
  tDepthColor = {
    dark: "#3B82F6",
    light: "#059669",
  },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle scroll effect and dark mode detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check for dark mode preference
    const checkDarkMode = () => {
      setIsDarkMode(
        document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    };

    window.addEventListener("scroll", handleScroll);
    checkDarkMode();

    // Listen for dark mode changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkDarkMode);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mediaQuery.removeEventListener("change", checkDarkMode);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[70px] ${
        isScrolled
          ? "bg-white/20 backdrop-blur-xl shadow-2xl border-b border-white/30"
          : "bg-white/10 backdrop-blur-lg border-b border-white/20"
      }`}
      style={{
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20 relative">
          {/* Left - Logo GIF */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 z-10"
          >
            <Link href="/" className="block">
              <div className="relative w-[150px] h-[150px] lg:w-[150px] lg:h-[150px]">
                <Image
                  src={"/logo.png"}
                  alt="Ascent Logo"
                  width={150}
                  height={150}
                  className="object-contain mt-4"
                  priority
                />
              </div>
            </Link>
          </motion.div>

          {/* Center - Extended Triangle (Connected to Top) */}
          {triangle && (
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 hidden lg:block font-[Orbitron]">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative flex flex-col items-center"
              >
                {/* Extended Inverted Triangle (Base touches navbar top) */}
                <div className="relative">
                  <svg
                    width="160"
                    height="120"
                    viewBox="0 0 160 120"
                    className="drop-shadow-2xl"
                    style={{ marginTop: "-20px" }}
                  >
                    {/* Outer inverted triangle (base at top, point down) */}
                    <path
                      d="M80 110 L10 0 L150 0 Z"
                      fill="url(#triangleGradient)"
                      stroke={isDarkMode ? tBorder.dark : tBorder.light}
                      strokeWidth="3"
                    />
                    {/* Inner inverted triangle */}
                    <path
                      d="M80 100 L26 15 L135 15 Z"
                      fill={isDarkMode ? tColor.dark : tColor.light}
                      opacity="0.9"
                    />
                    {/* Additional accent triangle for depth */}
                    <path
                      d="M80 90 L40 25 L120 25 Z"
                      fill={isDarkMode ? tDepthColor.dark : tDepthColor.light}
                      opacity="0.6"
                    />
                    <defs>
                      <linearGradient
                        id="triangleGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor={isDarkMode ? "#EF4444" : "#E53E3E"}
                          stopOpacity="0.1"
                        />
                        <stop
                          offset="30%"
                          stopColor={isDarkMode ? "#06B6D4" : "#14B8A6"}
                          stopOpacity="0.15"
                        />
                        <stop
                          offset="70%"
                          stopColor={isDarkMode ? "#3B82F6" : "#059669"}
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor={isDarkMode ? "#EF4444" : "#E53E3E"}
                          stopOpacity="0.3"
                        />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Phase Text in center of triangle */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ marginTop: "0px" }}
                  >
                    <span className="font-bold text-lg text-white drop-shadow-lg font-[Orbitron]">
                      PHASE
                    </span>
                    <span className="font-bold text-4xl text-white drop-shadow-lg -mt-1">
                      {phaseNo}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Right - User Profile Box */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden lg:flex items-center z-10 h-[20px]"
          >
            <div
              className="bg-white/20 rounded-full px-4 py-0.5 mb-2 border border-white/30 shadow-2xl hover:bg-white/30 hover:shadow-3xl transition-all duration-300"
              style={{
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
              }}
            >
              <div className="flex items-center space-x-3 p-0.5">
                {/* User Avatar */}
                <div className="w-8 h-8 bg-transparent rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>

                {/* User Info */}
                <div className="flex flex-col font-[Orbitron]">
                  <span className="text-sm font-semibold text-white drop-shadow-sm">
                    {username}
                  </span>
                  <span className="text-xs font-medium text-cyan-200 drop-shadow-sm">
                    {points} pts
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 transition-all duration-200 z-10 text-white hover:bg-white/30 shadow-lg"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-white/30 shadow-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <div className="px-4 py-6">
              {/* Mobile Phase Indicator */}
              {triangle && (
                <div className="flex items-center justify-center mb-6">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      <svg
                        width="80"
                        height="60"
                        viewBox="0 0 80 60"
                        className="drop-shadow-xl"
                      >
                        <path
                          d="M40 55 L5 0 L75 0 Z"
                          fill={isDarkMode ? tBorder.dark : tBorder.light}
                          opacity="0.3"
                          stroke={isDarkMode ? tBorder.dark : tBorder.light}
                          strokeWidth="2"
                        />
                        <path
                          d="M40 45 L15 8 L65 8 Z"
                          fill={isDarkMode ? tColor.dark : tColor.light}
                          opacity="0.8"
                        />
                        <path
                          d="M40 35 L25 12 L56 12 Z"
                          fill={
                            isDarkMode ? tDepthColor.dark : tDepthColor.light
                          }
                          opacity="0.6"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-white drop-shadow-lg">
                          Phase
                        </span>
                        <span className="text-xl font-bold text-white drop-shadow-lg -mt-1">
                          {phaseNo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile User Info */}
              <div
                className="rounded-full p-4 text-center bg-white/20 border border-white/30 shadow-xl"
                style={{
                  backdropFilter: "blur(16px) saturate(180%)",
                  WebkitBackdropFilter: "blur(16px) saturate(180%)",
                }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white drop-shadow-sm">
                      {username}
                    </div>
                    <div className="text-sm font-medium text-cyan-200 drop-shadow-sm">
                      {points} pts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
