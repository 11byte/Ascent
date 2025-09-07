'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react'

type TimerMode = 'work' | 'break' | 'longBreak'

export const PomodoroTimer = () => {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const modes = {
    work: { duration: 25 * 60, label: 'Focus Time', icon: BookOpen, color: 'text-red-400' },
    break: { duration: 5 * 60, label: 'Short Break', icon: Coffee, color: 'text-green-400' },
    longBreak: { duration: 15 * 60, label: 'Long Break', icon: Coffee, color: 'text-blue-400' }
  }

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer finished
            setIsRunning(false)
            playNotification()
            
            if (mode === 'work') {
              setSessions(prev => prev + 1)
              // After 4 work sessions, long break
              const newSessions = sessions + 1
              if (newSessions % 4 === 0) {
                setMode('longBreak')
                return modes.longBreak.duration
              } else {
                setMode('break')
                return modes.break.duration
              }
            } else {
              setMode('work')
              return modes.work.duration
            }
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, mode, sessions])

  const playNotification = () => {
    // Create a simple beep sound
    const context = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5)
    
    oscillator.start(context.currentTime)
    oscillator.stop(context.currentTime + 0.5)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(modes[mode].duration)
  }

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode)
    setTimeLeft(modes[newMode].duration)
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (modes[mode].duration - timeLeft) / modes[mode].duration

  const CurrentIcon = modes[mode].icon

  return (
    <div className="text-white h-full flex flex-col items-center justify-center">
      {/* Mode Selector */}
      <div className="flex gap-1 mb-6 bg-white/10 rounded-lg p-1">
        {(Object.keys(modes) as TimerMode[]).map((modeKey) => (
          <button
            key={modeKey}
            onClick={() => switchMode(modeKey)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              mode === modeKey
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {modes[modeKey].label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className={modes[mode].color}
            style={{
              strokeDasharray: `${2 * Math.PI * 45}`,
              strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress)}`
            }}
          />
        </svg>
        
        {/* Timer content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <CurrentIcon className={`w-8 h-8 mb-2 ${modes[mode].color}`} />
          <div className="text-3xl font-mono font-bold">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-white/60 mt-1">
            {modes[mode].label}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <motion.button
          onClick={toggleTimer}
          whileTap={{ scale: 0.95 }}
          className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-colors"
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </motion.button>
        
        <motion.button
          onClick={resetTimer}
          whileTap={{ scale: 0.95 }}
          className="bg-white/10 hover:bg-white/20 rounded-full p-4 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Session Counter */}
      <div className="mt-4 text-center">
        <div className="text-sm text-white/60">Sessions Completed</div>
        <div className="text-xl font-bold">{sessions}</div>
      </div>
    </div>
  )
}