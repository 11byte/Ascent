'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FogLiftSection } from '@src/components/animations/FogLiftSection'
import { AppLauncher } from '@src/components/home/AppLauncher'
import { HomeBackground } from '@src/components/home/HomeBackground'

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const username = "Paresh"

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeData = useMemo(() => ({
    time: currentTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    }),
    date: currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }), [currentTime])

  // Your recent repositories for potential quick access
  const recentRepos = useMemo(() => [
    'SeleniumHQ/selenium',
    'one2grow-backend', 
    '11byte/Mythos',
    'one2grow',
    'Lumber_Spine'
  ], [])

  const floatingElements = useMemo(() => [
    {
      id: 'float-1',
      className: "absolute top-1/4 left-8 lg:left-16",
      size: "w-16 h-16 lg:w-24 lg:h-24",
      gradient: "from-accent-teal to-primary-red",
      opacity: "opacity-20",
      animate: {
        y: [0, -20, 0],
        rotate: [0, 5, 0]
      },
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    {
      id: 'float-2',
      className: "absolute bottom-1/4 right-8 lg:right-16",
      size: "w-20 h-20 lg:w-32 lg:h-32",
      gradient: "from-primary-red to-accent-teal",
      opacity: "opacity-15",
      animate: {
        y: [0, 25, 0],
        rotate: [0, -8, 0]
      },
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: 2
      }
    }
  ], [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with your phase2-background.png */}
      <HomeBackground />
      
      {/* Main Content with navbar spacing */}
      <FogLiftSection className="min-h-screen flex flex-col justify-center items-center relative z-10 pt-20">
        {/* Enhanced Time Display */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="absolute top-28 lg:top-36 right-8 text-right"
        >
          <div className="text-4xl lg:text-6xl font-bold text-white/95 font-mono tracking-wider drop-shadow-2xl">
            {timeData.time}
          </div>
          <div className="text-lg lg:text-xl text-white/80 mt-2 drop-shadow-lg">
            {timeData.date}
          </div>
        </motion.div>

        {/* Main Greeting with your actual username */}
        <div className="text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-6xl lg:text-8xl xl:text-9xl font-bold text-white mb-4">
              <motion.span 
                className="bg-gradient-to-r from-primary-red via-accent-teal to-primary-red bg-clip-text"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear" as const
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Hola
              </motion.span>
            </h1>
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-4xl lg:text-6xl font-semibold text-white/95 drop-shadow-xl"
            >
              {username}...
            </motion.h2>
          </motion.div>

          {/* Enhanced Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-xl lg:text-2xl text-white/85 max-w-3xl mx-auto"
          >
            <p className="mb-4 drop-shadow-lg">
              Welcome to <span className="font-bold text-accent-teal drop-shadow-md">Phase 2</span> - where the fog lifts and clarity emerges
            </p>
            <p className="text-lg text-white/70 drop-shadow-md">
              Your development workspace awaits below
            </p>
            
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="mt-6 text-sm text-white/60"
            >
              <p>Recent activity: {recentRepos.length} active repositories</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Fixed Floating Elements */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            animate={element.animate}
            transition={element.transition}
            className={element.className}
          >
            <div className={`${element.size} bg-gradient-to-br ${element.gradient} rounded-full ${element.opacity} backdrop-blur-sm`} />
          </motion.div>
        ))}

        {/* Optimized Binary Code Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ delay: 2, duration: 2 }}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={`binary-${i}`}
              className="absolute text-accent-teal/60 font-mono text-sm select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.4, 0],
                y: [-15, 15]
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut" as const
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </motion.div>
          ))}
        </motion.div>
      </FogLiftSection>

      {/* Enhanced App Launcher */}
      <AppLauncher />
    </div>
  )
}