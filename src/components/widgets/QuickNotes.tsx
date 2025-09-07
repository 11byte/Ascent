'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, 
  FileText, 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Download, 
  Upload, 
  AlertCircle,
  GitBranch,
  Calendar,
  Clock
} from 'lucide-react'

interface NoteData {
  id: string
  content: string
  userId: string
  createdAt: Date
  updatedAt: Date
  synced: boolean
  version: number
}

interface SyncStatus {
  isLoading: boolean
  lastSync: Date | null
  error: string | null
  hasUnsavedChanges: boolean
}

export const QuickNotes = () => {
  const [notes, setNotes] = useState('')
  const [noteData, setNoteData] = useState<NoteData | null>(null)
  const [isUnsaved, setIsUnsaved] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isLoading: false,
    lastSync: null,
    error: null,
    hasUnsavedChanges: false
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const userId = 'Paresh-0007'

  const currentDateTime = new Date('2025-09-06T19:02:42Z')

  // Load notes from localStorage and backend
  useEffect(() => {
    loadLocalNotes()
    loadFromBackend()
  }, [])

  // Auto-save after 3 seconds of inactivity
  useEffect(() => {
    if (isUnsaved) {
      const timeout = setTimeout(() => {
        saveToLocal()
        syncWithBackend()
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [notes, isUnsaved])

  const loadLocalNotes = () => {
    const saved = localStorage.getItem('phase2-notes')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setNotes(data.content || '')
        setNoteData({
          id: data.id || `note_${userId}_${Date.now()}`,
          content: data.content || '',
          userId,
          createdAt: new Date(data.createdAt || Date.now()),
          updatedAt: new Date(data.updatedAt || Date.now()),
          synced: data.synced || false,
          version: data.version || 1
        })
      } catch (error) {
        console.error('Failed to load notes from localStorage:', error)
      }
    } else {
      // Initialize with template
      initializeWithTemplate()
    }
  }

  const initializeWithTemplate = () => {
    const template = `# Quick Notes - Phase 2
Welcome to your development workspace! Type your notes here...

## Ideas
- Idea 1: 
- Idea 2:
Last updated: ${currentDateTime.toLocaleString()}
`

    setNotes(template)
    const newNoteData: NoteData = {
      id: `note_${userId}_${Date.now()}`,
      content: template,
      userId,
      createdAt: currentDateTime,
      updatedAt: currentDateTime,
      synced: false,
      version: 1
    }
    setNoteData(newNoteData)
    setIsUnsaved(true)
  }

  const loadFromBackend = useCallback(async () => {
    setSyncStatus(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const backendNote = await response.json()
        
        if (backendNote && backendNote.content) {
          const serverNote: NoteData = {
            ...backendNote,
            createdAt: new Date(backendNote.createdAt),
            updatedAt: new Date(backendNote.updatedAt),
            synced: true
          }
          
          // Merge with local version if local is newer
          const localData = localStorage.getItem('phase2-notes')
          if (localData) {
            const localNote = JSON.parse(localData)
            const localUpdated = new Date(localNote.updatedAt || 0)
            const serverUpdated = new Date(serverNote.updatedAt)
            
            if (localUpdated > serverUpdated) {
              // Local version is newer, keep it
              console.log('Local version is newer, keeping local changes')
              return
            }
          }
          
          // Use server version
          setNotes(serverNote.content)
          setNoteData(serverNote)
          saveToLocal(serverNote)
        }
        
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date(),
          error: null
        }))
      } else if (response.status === 404) {
        // No notes found on server, that's okay
        console.log('No notes found on server')
      } else {
        throw new Error(`Failed to load notes: ${response.statusText}`)
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
    if (!noteData || !isUnsaved) return

    setSyncStatus(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const updatedNote = {
        ...noteData,
        content: notes,
        updatedAt: new Date(),
        version: noteData.version + 1
      }

      const response = await fetch(`${API_BASE_URL}/api/notes/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedNote,
          createdAt: updatedNote.createdAt.toISOString(),
          updatedAt: updatedNote.updatedAt.toISOString()
        }),
      })

      if (response.ok) {
        const savedNote = await response.json()
        
        setNoteData({
          ...updatedNote,
          synced: true
        })
        
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date(),
          error: null,
          hasUnsavedChanges: false
        }))
        
        setIsUnsaved(false)
        console.log('✅ Notes synced to backend')
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
  }, [notes, noteData, isUnsaved, API_BASE_URL, userId])

  const saveToLocal = (data?: NoteData) => {
    const dataToSave = data || {
      ...noteData!,
      content: notes,
      updatedAt: new Date(),
      synced: false
    }
    
    localStorage.setItem('phase2-notes', JSON.stringify({
      ...dataToSave,
      createdAt: dataToSave.createdAt.toISOString(),
      updatedAt: dataToSave.updatedAt.toISOString()
    }))
    
    if (!data) {
      setNoteData(dataToSave)
    }
  }

  const handleNotesChange = (value: string) => {
    setNotes(value)
    setIsUnsaved(true)
    setSyncStatus(prev => ({ ...prev, hasUnsavedChanges: true }))
  }

  const handleManualSave = () => {
    saveToLocal()
    syncWithBackend()
  }

  const handleManualLoad = () => {
    loadFromBackend()
  }

  return (
    <div className="text-white h-full flex flex-col">
      {/* Header with Enhanced Controls */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Quick Notes</h3>
          </div>
          
          {/* Sync Status Indicator */}
          <div className="flex items-center gap-2">
            {syncStatus.isLoading ? (
              <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
            ) : syncStatus.error ? (
              <AlertCircle className="w-4 h-4 text-red-400" /*title={syncStatus.error}*/ />
            ) : isUnsaved ? (
              <CloudOff className="w-4 h-4 text-yellow-400" /*title="Unsaved changes" */ />
            ) : (
              <Cloud className="w-4 h-4 text-green-400" /*title="All changes synced" */ />
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-2">
          <motion.button
            onClick={handleManualSave}
            whileTap={{ scale: 0.95 }}
            disabled={syncStatus.isLoading || !isUnsaved}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              isUnsaved 
                ? 'bg-yellow-500/80 hover:bg-yellow-500 text-white' 
                : 'bg-green-500/80 text-white'
            } disabled:opacity-50`}
          >
            <Save className="w-3 h-3 mr-1 inline" />
            {isUnsaved ? 'Save' : 'Saved'}
          </motion.button>
          
          <motion.button
            onClick={handleManualLoad}
            whileTap={{ scale: 0.95 }}
            disabled={syncStatus.isLoading}
            className="bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 rounded text-xs px-2 py-1 transition-colors"
          >
            <Download className="w-3 h-3 mr-1 inline" />
            Load
          </motion.button>
        </div>

        {/* Error Message */}
        {syncStatus.error && (
          <div className="mb-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-xs text-red-200">
            {syncStatus.error}
          </div>
        )}
      </div>

      {/* Enhanced Notes Area */}
      <textarea
        value={notes}
        onChange={(e) => handleNotesChange(e.target.value)}
        placeholder={`Welcome to Phase 2 Quick Notes! Type Something here...`}
        className="flex-1 bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 resize-none focus:outline-none focus:border-accent-teal text-sm leading-relaxed"
        style={{ fontFamily: 'ui-monospace, monospace' }}
      />

      {/* Enhanced Footer */}
      <div className="mt-2 flex justify-between items-center text-xs text-white/50">
        <div className="flex items-center gap-4">
          {noteData?.updatedAt && (
            <span>Last saved: {noteData.updatedAt.toLocaleString()}</span>
          )}
          {syncStatus.lastSync && (
            <span>Last sync: {syncStatus.lastSync.toLocaleTimeString()}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {noteData && (
            <>
              <span>v{noteData.version}</span>
              <span>{notes.length} chars</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}