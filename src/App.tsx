import { useState } from 'react'
import { usePasses } from './hooks/usePasses'
import { PassCard } from './components/PassCard'
import { PassDetail } from './components/PassDetail'
import { AddPassModal } from './components/AddPassModal'
import { CategoryFilter } from './components/CategoryFilter'
import type { Pass, Category } from './types'

type AppView = 'vault' | 'detail' | 'fullscreen'
type Density = 'comfortable' | 'compact'

/* ── Icon helpers ─────────────────────────────────────────────────────────── */
function IconVault() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </svg>
  )
}
function IconPlus() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  )
}
function IconSliders() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}
function IconQr() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
      <path d="M14 14h3v3M17 14h3M14 17v3h3M17 17h3v3" />
    </svg>
  )
}
function IconX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export default function App() {
  const { passes, addPass, updatePass, deletePass } = usePasses()
  const [view, setView] = useState<AppView>('vault')
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [search, setSearch] = useState('')
  const [density, setDensity] = useState<Density>('comfortable')
  const [tweaksOpen, setTweaksOpen] = useState(false)

  const filtered = passes.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.notes.toLowerCase().includes(search.toLowerCase())
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
    } catch { /* best-effort */ }
  }

  function exitFullscreen() {
    setView('detail')
    try { document.exitFullscreen?.() } catch { /* ignore */ }
  }

  /* ── Fullscreen ─────────────────────────────────────────────────────────── */
  if (view === 'fullscreen' && selectedPass) {
    return (
      <div
        onClick={exitFullscreen}
        style={{
          position: 'fixed', inset: 0, background: '#ffffff',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, cursor: 'pointer',
        }}
        className="animate-v-fade-in"
      >
        <button
          onClick={exitFullscreen}
          style={{
            position: 'absolute', top: 28, right: 24,
            background: 'rgba(0,0,0,0.07)', border: 'none', borderRadius: 50,
            width: 42, height: 42, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <IconX />
        </button>
        <img
          src={selectedPass.qrImageUri}
          alt={selectedPass.name}
          style={{ width: 'min(78vw, 78vh)', height: 'min(78vw, 78vh)', objectFit: 'contain' }}
        />
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 4 }}>{selectedPass.name}</div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, fontSize: 12, color: '#bbb' }}>Tap to close</div>
      </div>
    )
  }

  /* ── Detail ─────────────────────────────────────────────────────────────── */
  if (view === 'detail' && selectedPass) {
    return (
      <div className="app-shell">
        <PassDetail
          pass={selectedPass}
          onClose={() => setView('vault')}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onFullscreen={handleFullscreen}
        />
      </div>
    )
  }

  /* ── Vault ──────────────────────────────────────────────────────────────── */
  return (
    <div className="app-shell">
      {/* Header */}
      <div style={{
        padding: '48px 20px 16px', flexShrink: 0,
        background: 'linear-gradient(180deg, rgba(59,158,255,0.06) 0%, transparent 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, #185FA5, #3b9eff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(59,158,255,0.4)',
              color: '#fff',
            }}>
              <IconVault />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-1)' }}>
              Vaultly
            </span>
          </div>

          {/* Right: pass count + tweaks */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              background: 'rgba(59,158,255,0.12)', border: '1px solid rgba(59,158,255,0.25)',
              borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#3b9eff',
            }}>
              {passes.length} {passes.length === 1 ? 'pass' : 'passes'}
            </div>
            <button
              onClick={() => setTweaksOpen(o => !o)}
              style={{
                width: 34, height: 34, borderRadius: 9,
                background: tweaksOpen ? 'rgba(59,158,255,0.15)' : 'var(--surface)',
                border: `1px solid ${tweaksOpen ? 'rgba(59,158,255,0.4)' : 'var(--vborder)'}`,
                color: tweaksOpen ? '#3b9eff' : 'var(--text-2)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              <IconSliders />
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none', display: 'flex' }}>
            <IconSearch />
          </span>
          <input
            type="text"
            placeholder="Search passes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px 12px 40px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--vborder-2)', borderRadius: 10,
              color: 'var(--text-1)', fontSize: 14, outline: 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>
      </div>

      {/* Category filter */}
      <div style={{ padding: '0 20px', flexShrink: 0 }}>
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 120px' }}>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '72px 0', gap: 14 }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--vborder)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
              <IconQr />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-2)' }}>No passes found</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center' }}>
              {search ? 'Try a different search term' : 'Tap + to add your first pass'}
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: density === 'compact' ? '1fr 1fr 1fr' : '1fr 1fr',
            gap: 12,
          }}>
            {filtered.map((pass, i) => (
              <div key={pass.id} style={{ animationDelay: `${i * 0.04}s` }}>
                <PassCard pass={pass} onClick={handlePassClick} compact={density === 'compact'} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        className="animate-fab-pulse"
        style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          width: 54, height: 54, borderRadius: '50%',
          background: 'linear-gradient(140deg, #1a70d9, #3b9eff)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', transition: 'transform 0.15s',
          zIndex: 10,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(-50%) scale(1.08)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(-50%)' }}
      >
        <IconPlus />
      </button>

      {/* Tweaks panel */}
      {tweaksOpen && (
        <div
          className="animate-v-fade-in"
          style={{
            position: 'absolute', bottom: 92, right: 16, zIndex: 20,
            background: '#0d1528', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 16, padding: 18, width: 220,
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          }}
        >
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14, letterSpacing: '0.02em' }}>
            Tweaks
          </h4>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Card Density
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['comfortable', 'compact'] as Density[]).map(d => (
                <button key={d} onClick={() => setDensity(d)} style={{
                  padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  background: density === d ? 'rgba(59,158,255,0.15)' : 'var(--surface)',
                  border: density === d ? '1px solid rgba(59,158,255,0.4)' : '1px solid var(--vborder)',
                  color: density === d ? '#3b9eff' : 'var(--text-2)',
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.12s',
                }}>
                  {d === 'comfortable' ? '2-col' : '3-col'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAdd && <AddPassModal onSave={handleAddSave} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
