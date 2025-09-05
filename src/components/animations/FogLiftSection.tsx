'use client'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface FogLiftSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const FogLiftSection: React.FC<FogLiftSectionProps> = ({ 
  children, 
  className = '',
  delay = 0
}) => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0.3, filter: 'blur(10px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ 
        duration: 1.2, 
        ease: "easeInOut" as const,
        delay
      }}
      className={`${className}`}
    >
      {children}
    </motion.section>
  )
}