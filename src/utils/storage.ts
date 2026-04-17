import type { Pass } from '../types'

const KEY = 'vaultly_passes'

export function loadPasses(): Pass[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Pass[]) : []
  } catch {
    return []
  }
}

export function savePasses(passes: Pass[]): void {
  localStorage.setItem(KEY, JSON.stringify(passes))
}
