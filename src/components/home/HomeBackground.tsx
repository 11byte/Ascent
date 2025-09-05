'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Code, Monitor, Smartphone, Wifi, Database, Cloud, Terminal } from 'lucide-react'
import Image from 'next/image'

export const HomeBackground = () => {
  const [useImageBackground, setUseImageBackground] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Check if background image exists and loads properly
    const img = new window.Image()
    
    img.onload = () => {
      setUseImageBackground(true)
      setImageError(false)
      console.log('✅ Phase 2 background image loaded successfully')
    }
    
    img.onerror = () => {
      setUseImageBackground(false)
      setImageError(true)
      console.log('❌ Phase 2 background image failed to load, using fallback')
    }
    
    // Use the correct image path
    img.src = '/abc.png'
  }, [])

  const techIcons = useMemo(() => [
    { Icon: Cpu, position: { top: '15%', left: '10%' }, delay: 0 },
    { Icon: Code, position: { top: '25%', right: '15%' }, delay: 0.3 },
    { Icon: Monitor, position: { bottom: '30%', left: '8%' }, delay: 0.6 },
    { Icon: Smartphone, position: { top: '45%', right: '10%' }, delay: 0.9 },
    { Icon: Wifi, position: { bottom: '15%', right: '20%' }, delay: 1.2 },
    { Icon: Database, position: { top: '60%', left: '12%' }, delay: 1.5 },
    { Icon: Cloud, position: { top: '35%', left: '15%' }, delay: 1.8 },
    { Icon: Terminal, position: { bottom: '40%', right: '12%' }, delay: 2.1 }
  ], [])

  const binaryArray = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      char: '01010110'.charAt(Math.floor(Math.random() * 8)),
      left: Math.random() * 100,
      fontSize: Math.random() * 6 + 10,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4
    }))
  , [])

  // If image is successfully loaded, use it
  if (useImageBackground && !imageError) {
    return (
      <div className="absolute inset-0 z-0">
        <Image
          src="/abc.png"
          alt="Phase 2 Development Workspace"
          fill
          className="object-cover"
          priority
          quality={95}
          sizes="100vw"
        />
        
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/40" />
        
        {/* Additional glass overlay for modern feel */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.1) 100%)',
            backdropFilter: 'blur(1px)',
            WebkitBackdropFilter: 'blur(1px)'
          }}
        />

        {/* Subtle animated overlay elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating particles */}
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut" as const
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Fallback to code-generated background
  return (
    <div className="absolute inset-0 z-0">
      {/* Enhanced Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-teal-500 to-red-500" />
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/30" />
      
      {/* Tech illustration elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Fixed Floating geometric shapes */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" as const },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-white/20 rounded-lg transform rotate-45"
        />
        
        <motion.div
          animate={{
            rotate: -360,
            y: [0, -20, 0]
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" as const },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
          }}
          className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm"
        />

        {/* Fixed Tech icons */}
        {techIcons.map(({ Icon, position, delay }, index) => (
          <motion.div
            key={`tech-icon-${index}`}
            className="absolute"
            style={position}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -15, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              opacity: { delay, duration: 0.5 },
              scale: { delay, duration: 0.5 },
              y: { 
                duration: 3 + index * 0.5, 
                repeat: Infinity, 
                ease: "easeInOut" as const, 
                delay 
              },
              rotate: { 
                duration: 3 + index * 0.5, 
                repeat: Infinity, 
                ease: "easeInOut" as const, 
                delay 
              }
            }}
          >
            <Icon 
              size={32} 
              className="text-white/30 hover:text-white/50 transition-colors duration-300 drop-shadow-lg" 
            />
          </motion.div>
        ))}

        {/* Optimized Binary rain effect */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          {binaryArray.map((item) => (
            <motion.div
              key={`binary-${item.id}`}
              className="absolute text-white/50 font-mono text-xs select-none"
              style={{
                left: `${item.left}%`,
                fontSize: `${item.fontSize}px`
              }}
              animate={{
                y: ['0vh', '100vh'],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                delay: item.delay,
                ease: "linear" as const
              }}
            >
              {item.char}
            </motion.div>
          ))}
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>
      </div>
    </div>
  )
}