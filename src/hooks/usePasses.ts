import { useState, useCallback } from 'react'
import { loadPasses, savePasses } from '../utils/storage'
import type { Pass, CreatePassData } from '../types'

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now()
}

interface UsePassesReturn {
  passes: Pass[]
  addPass: (passData: CreatePassData) => Pass
  updatePass: (id: string, updates: Partial<Omit<Pass, 'id' | 'createdAt'>>) => void
  deletePass: (id: string) => void
  getPassById: (id: string) => Pass | null
}

export function usePasses(): UsePassesReturn {
  const [passes, setPasses] = useState<Pass[]>(() => loadPasses())

  const addPass = useCallback((passData: CreatePassData): Pass => {
    const newPass: Pass = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: '',
      ...passData,
    }
    setPasses(prev => {
      const updated = [newPass, ...prev]
      savePasses(updated)
      return updated
    })
    return newPass
  }, [])

  const updatePass = useCallback(
    (id: string, updates: Partial<Omit<Pass, 'id' | 'createdAt'>>): void => {
      setPasses(prev => {
        const updated = prev.map(p =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
        )
        savePasses(updated)
        return updated
      })
    },
    [],
  )

  const deletePass = useCallback((id: string): void => {
    setPasses(prev => {
      const updated = prev.filter(p => p.id !== id)
      savePasses(updated)
      return updated
    })
  }, [])

  const getPassById = useCallback(
    (id: string): Pass | null => {
      return passes.find(p => p.id === id) ?? null
    },
    [passes],
  )

  return { passes, addPass, updatePass, deletePass, getPassById }
}
