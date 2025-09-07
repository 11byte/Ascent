'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FogLiftSection } from '@src/components/animations/FogLiftSection'
import { AppLauncher } from '@src/components/home/AppLauncher'
import { HomeBackground } from '@src/components/home/HomeBackground'
import { WidgetSystem } from '@src/components/widgets/WidgetSystem'
import { usePhase2 } from "@src/context/phase2Context"

export default function Home() {
  const { username } = usePhase2()
  const [currentTime, setCurrentTime] = useState(new Date())

  // 🔹 Generate binary elements only on client
  const [binaryElements, setBinaryElements] = useState<
    { left: string; top: string; value: string; delay: number; duration: number }[]
  >([])

  useEffect(() => {
    // Clock updater
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Random binary elements (only client-side)
    const elements = Array.from({ length: 8 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      value: Math.random() > 0.5 ? '1' : '0',
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 4
    }))
    setBinaryElements(elements)

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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <HomeBackground />

      {/* Main Content */}
      <FogLiftSection className="min-h-screen relative z-10 pt-20">

        {/* Top Right - Clock */}
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

        {/* Compact Greeting - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-28 lg:bottom-10 right-10"
        >
          <h1 className="text-2xl font-bold text-white mb-2">
            <span className="text-accent-teal">Hola</span> {username}!
          </h1>
        </motion.div>

        {/* Subtle Binary Background Elements (Hydration Safe) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ delay: 2, duration: 2 }}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          {binaryElements.map((el, i) => (
            <motion.div
              key={`binary-${i}`}
              className="absolute text-accent-teal/30 font-mono text-xs select-none"
              style={{ left: el.left, top: el.top }}
              animate={{
                opacity: [0, 0.2, 0],
                y: [-10, 10]
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                delay: el.delay,
                ease: "easeInOut"
              }}
            >
              {el.value}
            </motion.div>
          ))}
        </motion.div>
      </FogLiftSection>

      {/* Widget System */}
      <WidgetSystem />

      {/* App Launcher */}
      <AppLauncher />
    </div>
  )
}
