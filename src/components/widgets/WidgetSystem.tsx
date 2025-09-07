'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator } from './Calculator'
import { TodoList } from './TodoList'
import { PomodoroTimer } from './PomodoroTimer'
import { QuickNotes } from './QuickNotes'
import { SystemStats } from './SystemStats'
import { 
  Calculator as CalcIcon, 
  CheckSquare, 
  Timer, 
  StickyNote, 
  Activity,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react'

interface Widget {
  id: string
  name: string
  icon: React.ReactNode
  component: React.ReactNode
  defaultPosition: { x: number; y: number }
  size: { width: number; height: number }
  isOpen: boolean
  isMinimized: boolean
}

export const WidgetSystem = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: 'calculator',
      name: 'Calculator',
      icon: <CalcIcon className="w-5 h-5" />,
      component: <Calculator />,
      defaultPosition: { x: 50, y: 100 },
      size: { width: 320, height: 480 },
      isOpen: false,
      isMinimized: false
    },
    {
      id: 'todo',
      name: 'To-Do List',
      icon: <CheckSquare className="w-5 h-5" />,
      component: <TodoList />,
      defaultPosition: { x: 400, y: 100 },
      size: { width: 350, height: 500 },
      isOpen: false,
      isMinimized: false
    },
    {
      id: 'pomodoro',
      name: 'Pomodoro Timer',
      icon: <Timer className="w-5 h-5" />,
      component: <PomodoroTimer />,
      defaultPosition: { x: 780, y: 100 },
      size: { width: 300, height: 500 },
      isOpen: false,
      isMinimized: false
    },
    {
      id: 'notes',
      name: 'Quick Notes',
      icon: <StickyNote className="w-5 h-5" />,
      component: <QuickNotes />,
      defaultPosition: { x: 1100, y: 100 },
      size: { width: 350, height: 450 },
      isOpen: false,
      isMinimized: false
    },
    // {
    //   id: 'stats',
    //   name: 'System Stats',
    //   icon: <Activity className="w-5 h-5" />,
    //   component: <SystemStats />,
    //   defaultPosition: { x: 50, y: 200 },
    //   size: { width: 280, height: 200 },
    //   isOpen: false,
    //   isMinimized: false
    // }
  ])

  const openWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, isOpen: true, isMinimized: false }
        : widget
    ))
  }

  const closeWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, isOpen: false, isMinimized: false }
        : widget
    ))
  }

  return (
    <>
      {/* Widget Dock - Ubuntu style */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40"
      >
        <div 
          className="flex flex-col gap-2 p-3 rounded-2xl border border-white/20 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)'
          }}
        >
          {widgets.map((widget) => (
            <motion.button
              key={widget.id}
              onClick={() => openWidget(widget.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-200 ${
                widget.isOpen ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'
              }`}
              title={widget.name}
            >
              {widget.icon}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Widgets */}
      <AnimatePresence>
        {widgets.map((widget) => widget.isOpen && (
          <motion.div
            key={widget.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: widget.isMinimized ? 0.3 : 1, 
              opacity: widget.isMinimized ? 0.7 : 1 
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed z-30"
            style={{
              left: widget.defaultPosition.x,
              top: widget.defaultPosition.y,
              width: widget.size.width,
              height: widget.isMinimized ? 50 : widget.size.height,
            }}
            drag
            dragMomentum={false}
            dragElastic={0.1}
          >
            <div 
              className="w-full h-full rounded-2xl border border-white/30 shadow-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(25px) saturate(200%)',
                WebkitBackdropFilter: 'blur(25px) saturate(200%)'
              }}
            >
              {/* Widget Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/10">
                <div className="flex items-center gap-2">
                  {widget.icon}
                  <span className="text-white font-semibold text-sm">{widget.name}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => closeWidget(widget.id)}
                    className="w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>

              {/* Widget Content */}
              {!widget.isMinimized && (
                <div className="p-4 h-[calc(100%-60px)] overflow-y-auto">
                  {widget.component}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  )
}