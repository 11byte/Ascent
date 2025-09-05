'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, User } from 'lucide-react'
import Image from 'next/image'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Handle scroll effect and dark mode detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    // Check for dark mode preference
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark') || 
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    
    window.addEventListener('scroll', handleScroll)
    checkDarkMode()
    
    // Listen for dark mode changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkDarkMode)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      mediaQuery.removeEventListener('change', checkDarkMode)
    }
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? isDarkMode 
            ? 'bg-gray-900/10 backdrop-blur-md shadow-lg border-b border-gray-700' 
            : 'bg-neutral-light/5 backdrop-blur-md shadow-lg border-b border-neutral-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20 relative">
          
          {/* Left - Logo GIF */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 z-10"
          >
            <Link href="/" className="block">
              <div className="relative w-24 h-12 lg:w-32 lg:h-16">
                <Image
                  src={isDarkMode ? "/LIGHT.gif" : "/DARK.gif"}
                  alt="Ascent Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </motion.div>

          {/* Center - Extended Triangle (Connected to Top) */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 hidden lg:block">
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
                  className="drop-shadow-lg"
                  style={{ marginTop: '-20px' }} // Pull triangle up to connect with navbar top
                >
                  {/* Outer inverted triangle (base at top, point down) */}
                  <path
                    d="M80 110 L10 0 L150 0 Z"
                    fill="url(#triangleGradient)"
                    stroke={isDarkMode ? "#EF4444" : "#E53E3E"}
                    strokeWidth="3"
                  />
                  {/* Inner inverted triangle */}
                  <path
                    d="M80 100 L26 15 L135 15 Z"
                    fill={isDarkMode ? "#06B6D4" : "#14B8A6"}
                    opacity="0.9"
                  />
                  {/* Additional accent triangle for depth */}
                  <path
                    d="M80 90 L40 25 L120 25 Z"
                    fill={isDarkMode ? "#3B82F6" : "#059669"}
                    opacity="0.6"
                  />
                  <defs>
                    <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={isDarkMode ? "#EF4444" : "#E53E3E"} stopOpacity="0.1" />
                      <stop offset="30%" stopColor={isDarkMode ? "#06B6D4" : "#14B8A6"} stopOpacity="0.15" />
                      <stop offset="70%" stopColor={isDarkMode ? "#3B82F6" : "#059669"} stopOpacity="0.2" />
                      <stop offset="100%" stopColor={isDarkMode ? "#EF4444" : "#E53E3E"} stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Phase Text in center of triangle */}
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ marginTop: '0px' }}>
                  <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-neutral-dark'}`}>
                    Phase
                  </span>
                  <span className={`font-bold text-4xl ${isDarkMode ? 'text-red-400' : 'text-primary-red'} -mt-1`}>
                    2
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right - User Profile Box */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden lg:flex items-center z-10"
          >
            <div className={`${
              isDarkMode 
                ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' 
                : 'bg-gradient-to-r from-neutral-100 to-neutral-200 border-neutral-300'
            } rounded-xl px-6 py-3 border shadow-sm hover:shadow-md transition-all duration-300`}>
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <div className={`w-8 h-8 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-red-500 to-cyan-500' 
                    : 'bg-gradient-to-br from-red-500 to-cyan-500'
                } rounded-full flex items-center justify-center`}>
                  <User className="w-4 h-4 text-white" />
                </div>
                
                {/* User Info */}
                <div className="flex flex-col">
                  <span className={`text-sm font-semibold ${
                    isDarkMode ? 'text-white' : 'text-neutral-dark'
                  }`}>
                    Paresh-0007
                  </span>
                  <span className={`text-xs font-medium ${
                    isDarkMode ? 'text-cyan-400' : 'text-accent-teal'
                  }`}>
                    1000 pts
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors duration-200 z-10 ${
              isDarkMode 
                ? 'text-white hover:text-red-400 hover:bg-gray-800' 
                : 'text-neutral-dark hover:text-primary-red hover:bg-neutral-100'
            }`}
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
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden border-t shadow-lg ${
              isDarkMode 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-white border-neutral-200'
            }`}
          >
            <div className="px-4 py-6">
              {/* Mobile Phase Indicator */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <svg width="80" height="60" viewBox="0 0 80 60">
                      {/* Mobile version - also connected to top */}
                      <path
                        d="M40 55 L5 0 L75 0 Z"
                        fill={isDarkMode ? "#EF4444" : "#E53E3E"}
                        opacity="0.2"
                        stroke={isDarkMode ? "#EF4444" : "#E53E3E"}
                        strokeWidth="2"
                      />
                      <path
                        d="M40 45 L15 8 L65 8 Z"
                        fill={isDarkMode ? "#06B6D4" : "#14B8A6"}
                        opacity="0.8"
                      />
                      <path
                        d="M40 35 L25 12 L56 12 Z"
                        fill={isDarkMode ? "#3B82F6" : "#059669"}
                        opacity="0.6"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-sm font-bold ${
                        isDarkMode ? 'text-white' : 'text-neutral-dark'
                      }`}>
                        Phase
                      </span>
                      <span className={`text-xl font-bold ${
                        isDarkMode ? 'text-red-400' : 'text-primary-red'
                      } -mt-1`}>
                        2
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile User Info */}
              <div className={`rounded-lg p-4 text-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-neutral-100'
              }`}>
                <div className="flex items-center justify-center space-x-3">
                  <div className={`w-10 h-10 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-red-500 to-cyan-500' 
                      : 'bg-gradient-to-br from-primary-red to-accent-teal'
                  } rounded-full flex items-center justify-center`}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-neutral-dark'
                    }`}>
                      Paresh-0007
                    </div>
                    <div className={`text-sm font-medium ${
                      isDarkMode ? 'text-cyan-400' : 'text-accent-teal'
                    }`}>
                      1000 pts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar