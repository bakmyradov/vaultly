import { useState } from 'react'
import { CAT_COLORS, CAT_LABELS } from './CategoryFilter'
import type { Pass, Category } from '@/types'

const CAT_IDS: Category[] = ['gym', 'transit', 'loyalty', 'work', 'travel', 'other']

/* ── Icon helpers ─────────────────────────────────────────────────────────── */
function IconBack() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}
function IconEdit() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}
function IconTrash() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}
function IconExpand() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  )
}
function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ── MetaRow ──────────────────────────────────────────────────────────────── */
function MetaRow({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ padding: '13px 16px', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
        {label}
      </span>
      {children}
    </div>
  )
}

/* ── IconBtn ──────────────────────────────────────────────────────────────── */
function IconBtn({ onClick, children, danger }: { onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 38, height: 38, borderRadius: 10, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: danger ? 'rgba(255,80,80,0.08)' : 'var(--surface)',
        border: `1px solid ${danger ? 'rgba(255,80,80,0.2)' : 'var(--vborder)'}`,
        color: danger ? '#ff7070' : 'var(--text-2)',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      {children}
    </button>
  )
}

/* ── PassDetail ───────────────────────────────────────────────────────────── */
interface PassDetailProps {
  pass: Pass
  onClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Omit<Pass, 'id' | 'createdAt'>>) => void
  onFullscreen: (pass: Pass) => void
}

export function PassDetail({ pass, onClose, onDelete, onUpdate, onFullscreen }: PassDetailProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const color = CAT_COLORS[pass.category] ?? '#7a90bb'

  return (
    <div className="animate-slide-in-right" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '48px 20px 20px', flexShrink: 0 }}>
        <button
          onClick={onClose}
          style={{
            padding: '8px 12px', gap: 6, display: 'flex', alignItems: 'center',
            background: 'var(--surface)', border: '1px solid var(--vborder)', borderRadius: 10,
            color: 'var(--text-1)', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            transition: 'background 0.15s',
          }}
        >
          <IconBack /> Back
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn onClick={() => setShowEdit(true)}><IconEdit /></IconBtn>
          <IconBtn onClick={() => setShowDelete(true)} danger><IconTrash /></IconBtn>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }}>
        {/* Category badge */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            padding: '3px 8px', borderRadius: 20,
            color, background: color + '1a', border: `1px solid ${color}33`,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block' }} />
            {CAT_LABELS[pass.category] ?? pass.category}
          </span>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 20 }}>
          {pass.name}
        </h1>

        {/* QR box */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: 24, marginBottom: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 0 2px ${color}28`,
        }}>
          <img
            src={pass.qrImageUri}
            alt="QR Code"
            style={{ width: '100%', maxWidth: 300, height: 'auto', display: 'block' }}
          />
        </div>

        {/* Fullscreen button */}
        <button
          onClick={() => onFullscreen(pass)}
          style={{
            width: '100%', padding: 14, borderRadius: 13, marginBottom: 16,
            background: `linear-gradient(135deg, ${color}28, ${color}14)`,
            border: `1px solid ${color}40`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            color, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.18s',
          }}
        >
          <IconExpand /> Open Fullscreen for Scanning
        </button>

        {/* Meta table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--vborder)', borderRadius: 14, overflow: 'hidden' }}>
          <MetaRow label="Encoded data">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--text-2)', wordBreak: 'break-all' }}>
              {pass.qrData}
            </span>
          </MetaRow>
          {pass.notes && (
            <MetaRow label="Notes">
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{pass.notes}</span>
            </MetaRow>
          )}
          <MetaRow label="Added" last>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
              {new Date(pass.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </MetaRow>
        </div>
      </div>

      {/* Edit bottom sheet */}
      {showEdit && (
        <EditSheet pass={pass} onClose={() => setShowEdit(false)} onSave={(updates) => { onUpdate(pass.id, updates); setShowEdit(false) }} />
      )}

      {/* Delete confirm */}
      {showDelete && (
        <div
          className="animate-backdrop-in"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}
        >
          <div
            className="animate-slide-up"
            style={{ background: '#0d1528', border: '1px solid var(--vborder-2)', borderRadius: 20, padding: 24, maxWidth: 320, width: '100%' }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Delete Pass?</h3>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24, lineHeight: 1.5 }}>
              "{pass.name}" will be permanently removed from your vault.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowDelete(false)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={() => { onDelete(pass.id); onClose() }} style={deleteBtnStyle}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const cancelBtnStyle: React.CSSProperties = {
  flex: 1, padding: 13, borderRadius: 11,
  background: 'var(--surface)', border: '1px solid var(--vborder-2)',
  color: 'var(--text-1)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
}

const deleteBtnStyle: React.CSSProperties = {
  flex: 1, padding: 13, borderRadius: 11,
  background: 'rgba(255,70,70,0.14)', border: '1px solid rgba(255,70,70,0.3)',
  color: '#ff7070', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
}

/* ── EditSheet ────────────────────────────────────────────────────────────── */
interface EditSheetProps {
  pass: Pass
  onClose: () => void
  onSave: (updates: Partial<Omit<Pass, 'id' | 'createdAt'>>) => void
}

function EditSheet({ pass, onClose, onSave }: EditSheetProps) {
  const [name, setName] = useState(pass.name)
  const [category, setCategory] = useState<Category>(pass.category)
  const [notes, setNotes] = useState(pass.notes ?? '')

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 900 }}>
      <div
        className="animate-backdrop-in"
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      />
      <div
        className="animate-modal-up"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#0b1220', borderRadius: '22px 22px 0 0',
          border: '1px solid var(--vborder-2)', borderBottom: 'none',
          padding: '22px 20px 44px',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--vborder-2)', margin: '0 auto 20px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)' }}>Edit Pass</h2>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--vborder)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)' }}>
            <IconX />
          </button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <span style={sectionLabel}>Pass name</span>
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <span style={sectionLabel}>Category</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {CAT_IDS.map(id => {
              const isA = category === id
              const col = CAT_COLORS[id]
              return (
                <button key={id} onClick={() => setCategory(id)} style={{
                  padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                  fontSize: 12, fontWeight: isA ? 700 : 400, fontFamily: "'DM Sans', sans-serif",
                  background: isA ? `${col}1e` : 'var(--surface)',
                  border: isA ? `1px solid ${col}50` : '1px solid var(--vborder)',
                  color: isA ? col : 'var(--text-2)', transition: 'all 0.12s',
                }}>
                  {CAT_LABELS[id]}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <span style={sectionLabel}>Notes</span>
          <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes…" style={inputStyle} />
        </div>

        <button
          onClick={() => onSave({ name, category, notes })}
          style={primaryBtn}
        >
          <IconCheck /> Save Changes
        </button>
      </div>
    </div>
  )
}

const sectionLabel: React.CSSProperties = {
  fontSize: 11, color: 'var(--text-3)', fontWeight: 700,
  letterSpacing: '0.07em', textTransform: 'uppercase',
  display: 'block', marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--vborder-2)',
  borderRadius: 10, color: 'var(--text-1)',
  fontSize: 14, outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
}

const primaryBtn: React.CSSProperties = {
  width: '100%', padding: 15, borderRadius: 13,
  background: 'linear-gradient(140deg, #1a70d9, #3b9eff)',
  border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
  boxShadow: '0 4px 20px rgba(59,158,255,0.35)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
}
