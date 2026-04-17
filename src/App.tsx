import { useState } from 'react'
import { usePasses } from './hooks/usePasses'
import { PassCard } from './components/PassCard'
import { PassDetail } from './components/PassDetail'
import { AddPassModal } from './components/AddPassModal'
import { CategoryFilter } from './components/CategoryFilter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Pass, Category } from './types'

type AppView = 'vault' | 'detail' | 'fullscreen'

export default function App() {
  const { passes, addPass, updatePass, deletePass } = usePasses()
  const [view, setView] = useState<AppView>('vault')
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = passes.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function handlePassClick(pass: Pass) {
    setSelectedPass(pass)
    setView('detail')
  }

  function handleAddSave(passData: Parameters<typeof addPass>[0]) {
    addPass(passData)
    setShowAdd(false)
  }

  function handleUpdate(id: string, updates: Partial<Omit<Pass, 'id' | 'createdAt'>>) {
    updatePass(id, updates)
    setSelectedPass(prev => (prev ? { ...prev, ...updates } : prev))
  }

  function handleDelete(id: string) {
    deletePass(id)
    setView('vault')
    setSelectedPass(null)
  }

  function handleFullscreen(pass: Pass) {
    setSelectedPass(pass)
    setView('fullscreen')
    try {
      document.documentElement.requestFullscreen?.()
      navigator.wakeLock?.request('screen').catch(() => {})
    } catch {
      // fullscreen/wakelock are best-effort
    }
  }

  function exitFullscreen() {
    setView('detail')
    try {
      document.exitFullscreen?.()
    } catch {
      // ignore
    }
  }

  if (view === 'fullscreen' && selectedPass) {
    return (
      <div
        className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 cursor-pointer"
        onClick={exitFullscreen}
      >
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <img
            src={selectedPass.qrImageUri}
            alt={selectedPass.name}
            className="w-64 h-64 object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <p className="mt-5 text-base font-semibold text-foreground">{selectedPass.name}</p>
        <p className="text-sm text-muted-foreground mt-2">Tap anywhere to exit</p>
      </div>
    )
  }

  if (view === 'detail' && selectedPass) {
    return (
      <PassDetail
        pass={selectedPass}
        onClose={() => setView('vault')}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onFullscreen={handleFullscreen}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 pt-12 pb-4 relative overflow-hidden">
        <div
          className="absolute -top-10 right-0 w-56 h-56 pointer-events-none opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }}
        />

        <div className="relative flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="4" width="12" height="9" rx="2" stroke="white" strokeWidth="1.5" />
                  <path
                    d="M4 4V3a3 3 0 016 0v1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">Vaultly</span>
            </div>
            <p className="text-xs text-muted-foreground pl-9">
              {passes.length} {passes.length === 1 ? 'pass' : 'passes'} stored
            </p>
          </div>

          <Button
            size="icon"
            onClick={() => setShowAdd(true)}
            className="rounded-full h-9 w-9 shadow-[0_0_16px_hsl(var(--primary)/0.4)]"
            aria-label="Add pass"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search passes…"
            className="pl-9"
          />
        </div>
      </header>

      <div className="px-5 pb-3">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      <main className="flex-1 px-4 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className={cn('text-muted-foreground')}
              >
                <rect x="2" y="7" width="20" height="15" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M7 7V5a5 5 0 0110 0v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M12 16v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-foreground mb-1">
              {passes.length === 0 ? 'Your vault is empty' : 'No passes found'}
            </h2>
            <p className="text-xs text-muted-foreground mb-5 max-w-[180px]">
              {passes.length === 0
                ? 'Add your first QR pass to get started'
                : 'Try a different search or category'}
            </p>
            {passes.length === 0 && (
              <Button size="sm" onClick={() => setShowAdd(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Add First Pass
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(pass => (
              <PassCard key={pass.id} pass={pass} onClick={handlePassClick} />
            ))}
          </div>
        )}
      </main>

      {showAdd && <AddPassModal onSave={handleAddSave} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
