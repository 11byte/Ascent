'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Clock, Calendar, GitBranch } from 'lucide-react'

export const SystemStats = () => {
  const [stats, setStats] = useState({
    uptime: '2h 34m',
    commits: 15,
    productivity: 87,
    activeProjects: 3
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        productivity: Math.floor(Math.random() * 20) + 80, // 80-100%
        commits: prev.commits + Math.floor(Math.random() * 2), // Random commits
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const statItems = [
    {
      label: 'Uptime',
      value: stats.uptime,
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      label: 'Today\'s Commits',
      value: stats.commits.toString(),
      icon: GitBranch,
      color: 'text-green-400'
    },
    {
      label: 'Productivity',
      value: `${stats.productivity}%`,
      icon: Activity,
      color: 'text-yellow-400'
    },
    {
      label: 'Active Projects',
      value: stats.activeProjects.toString(),
      icon: Calendar,
      color: 'text-purple-400'
    }
  ]

  return (
    <div className="text-white h-full">
      <div className="grid grid-cols-2 gap-3 h-full">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col justify-center items-center text-center"
          >
            <item.icon className={`w-6 h-6 mb-2 ${item.color}`} />
            <div className="text-lg font-bold mb-1">{item.value}</div>
            <div className="text-xs text-white/60">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}