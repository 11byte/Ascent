'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Check, 
  X, 
  Edit2, 
  Save, 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Download, 
  Upload,
  AlertCircle
} from 'lucide-react'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  updatedAt?: Date
  synced?: boolean
  userId?: string
}

interface SyncStatus {
  isLoading: boolean
  lastSync: Date | null
  error: string | null
  pendingChanges: number
}

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isLoading: false,
    lastSync: null,
    error: null,
    pendingChanges: 0
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const userId = 'Paresh-0007' // From your GitHub data

  // Load todos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('phase2-todos')
    if (saved) {
      try {
        const parsedTodos = JSON.parse(saved).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: todo.updatedAt ? new Date(todo.updatedAt) : undefined
        }))
        setTodos(parsedTodos)
      } catch (error) {
        console.error('Failed to load todos from localStorage:', error)
      }
    }
    
    // Load from backend on mount
    loadFromBackend()
  }, [])

  // Save to localStorage whenever todos change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('phase2-todos', JSON.stringify(todos))
      
      // Update pending changes count
      const pendingChanges = todos.filter(todo => !todo.synced).length
      setSyncStatus(prev => ({ ...prev, pendingChanges }))
    }
  }, [todos])

  // Auto-sync every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (syncStatus.pendingChanges > 0) {
        syncWithBackend()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [syncStatus.pendingChanges])

  // Backend API functions
  const loadFromBackend = useCallback(async () => {
    setSyncStatus(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const backendTodos = await response.json()
        const formattedTodos = backendTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: todo.updatedAt ? new Date(todo.updatedAt) : undefined,
          synced: true
        }))
        
        // Merge with local todos (prioritize local changes)
        const localTodos = JSON.parse(localStorage.getItem('phase2-todos') || '[]')
        const mergedTodos = mergeTodos(localTodos, formattedTodos)
        
        setTodos(mergedTodos)
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date(),
          pendingChanges: mergedTodos.filter(todo => !todo.synced).length
        }))
      } else {
        throw new Error(`Failed to load todos: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Load from backend failed:', error)
      setSyncStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load from server'
      }))
    } finally {
      setSyncStatus(prev => ({ ...prev, isLoading: false }))
    }
  }, [API_BASE_URL, userId])

  const syncWithBackend = useCallback(async () => {
    const unsyncedTodos = todos.filter(todo => !todo.synced)
    if (unsyncedTodos.length === 0) return

    setSyncStatus(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`${API_BASE_URL}/api/todos/${userId}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todos: unsyncedTodos.map(todo => ({
            ...todo,
            userId,
            createdAt: todo.createdAt.toISOString(),
            updatedAt: new Date().toISOString()
          }))
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Mark todos as synced
        setTodos(prev => prev.map(todo => ({
          ...todo,
          synced: true,
          updatedAt: new Date()
        })))
        
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date(),
          pendingChanges: 0,
          error: null
        }))
        
        console.log(`✅ Synced ${unsyncedTodos.length} todos to backend`)
      } else {
        throw new Error(`Sync failed: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Sync with backend failed:', error)
      setSyncStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sync failed'
      }))
    } finally {
      setSyncStatus(prev => ({ ...prev, isLoading: false }))
    }
  }, [todos, API_BASE_URL, userId])

  // Merge local and backend todos
  const mergeTodos = (localTodos: any[], backendTodos: Todo[]): Todo[] => {
    const todoMap = new Map()
    
    // Add backend todos first
    backendTodos.forEach(todo => {
      todoMap.set(todo.id, { ...todo, synced: true })
    })
    
    // Override with local todos (they have priority)
    localTodos.forEach((todo: any) => {
      const existing = todoMap.get(todo.id)
      const localUpdated = new Date(todo.updatedAt || todo.createdAt)
      const backendUpdated = existing ? new Date(existing.updatedAt || existing.createdAt) : new Date(0)
      
      // Use local version if it's newer or doesn't exist in backend
      if (!existing || localUpdated > backendUpdated) {
        todoMap.set(todo.id, {
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: todo.updatedAt ? new Date(todo.updatedAt) : undefined,
          synced: false
        })
      }
    })
    
    return Array.from(todoMap.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        synced: false,
        userId
      }
      setTodos(prev => [todo, ...prev])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date(), synced: false }
        : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(prev => prev.map(todo =>
        todo.id === editingId 
          ? { ...todo, text: editText.trim(), updatedAt: new Date(), synced: false }
          : todo
      ))
    }
    setEditingId(null)
    setEditText('')
  }

  // Manual actions
  const handleManualSync = () => {
    syncWithBackend()
  }

  const handleManualLoad = () => {
    loadFromBackend()
  }

  const completedCount = todos.filter(todo => todo.completed).length

  return (
    <div className="text-white h-full flex flex-col">
      {/* Header with Sync Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">To-Do List</h3>
          
          {/* Sync Status Indicator */}
          <div className="flex items-center gap-2">
            {syncStatus.isLoading ? (
              <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
            ) : syncStatus.error ? (
              <AlertCircle className="w-4 h-4 text-red-400" /*title={syncStatus.error}*/ />
            ) : syncStatus.pendingChanges > 0 ? (
              <CloudOff className="w-4 h-4 text-yellow-400" /*title={`${syncStatus.pendingChanges} pending changes`}*/ />
            ) : (
              <Cloud className="w-4 h-4 text-green-400" /*title="All changes synced" */ />
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-white/60">
          <span>{completedCount} of {todos.length} completed</span>
          
          {/* Sync Info */}
          <div className="flex items-center gap-2">
            {syncStatus.pendingChanges > 0 && (
              <span className="text-yellow-400 text-xs">
                {syncStatus.pendingChanges} unsaved
              </span>
            )}
            {syncStatus.lastSync && (
              <span className="text-xs">
                Last sync: {syncStatus.lastSync.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        
        {/* Error Message */}
        {syncStatus.error && (
          <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-xs text-red-200">
            {syncStatus.error}
          </div>
        )}
      </div>

      {/* Sync Controls */}
      <div className="flex gap-1 mb-4">
        <motion.button
          onClick={handleManualSync}
          whileTap={{ scale: 0.95 }}
          disabled={syncStatus.isLoading || syncStatus.pendingChanges === 0}
          className="bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-gray-500/20 disabled:text-white/30 rounded-lg p-2 transition-colors text-xs flex items-center gap-1"
          title="Sync to server"
        >
          <Upload className="w-3 h-3" />
          Sync ({syncStatus.pendingChanges})
        </motion.button>
        
        <motion.button
          onClick={handleManualLoad}
          whileTap={{ scale: 0.95 }}
          disabled={syncStatus.isLoading}
          className="bg-green-500/20 hover:bg-green-500/30 disabled:bg-gray-500/20 disabled:text-white/30 rounded-lg p-2 transition-colors text-xs flex items-center gap-1"
          title="Load from server"
        >
          <Download className="w-3 h-3" />
          Load
        </motion.button>
      </div>

      {/* Add Todo */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-accent-teal"
        />
        <motion.button
          onClick={addTodo}
          whileTap={{ scale: 0.95 }}
          className="bg-accent-teal hover:bg-accent-teal/80 rounded-lg p-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`bg-white/5 border border-white/10 rounded-lg p-3 ${
                todo.completed ? 'opacity-60' : ''
              } ${!todo.synced ? 'border-l-4 border-l-yellow-400' : ''}`}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-white/30 hover:border-green-400'
                  }`}
                >
                  {todo.completed && <Check className="w-3 h-3 text-white" />}
                </button>

                {editingId === todo.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                      className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white"
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      className="text-green-400 hover:text-green-300"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`flex-1 text-sm ${
                        todo.completed ? 'line-through text-white/50' : ''
                      }`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => startEdit(todo)}
                      className="text-white/50 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Sync status indicator */}
                {!todo.synced && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Not synced" />
                )}

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Todo metadata */}
              <div className="mt-2 text-xs text-white/40 flex justify-between">
                <span>Created: {todo.createdAt.toLocaleDateString()}</span>
                {todo.updatedAt && todo.updatedAt !== todo.createdAt && (
                  <span>Updated: {todo.updatedAt.toLocaleDateString()}</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {todos.length === 0 && (
          <div className="text-center text-white/50 py-8">
            <p>No tasks yet. Add one above!</p>
          </div>
        )}
      </div>
    </div>
  )
}