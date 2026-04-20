import { useState, useRef } from 'react'
import { generateQRDataURL, decodeQRFromFile } from '../utils/qr'
import { CameraScanner } from './CameraScanner'
import { CAT_COLORS, CAT_LABELS } from './CategoryFilter'
import type { CreatePassData, Category } from '@/types'

const CAT_IDS: Category[] = ['gym', 'transit', 'loyalty', 'work', 'travel', 'other']
type Method = 'paste' | 'upload' | 'camera'

interface AddPassModalProps {
  onSave: (passData: CreatePassData) => void
  onClose: () => void
}

/* ── Icon helpers ──────────────────────────────────────────────────────────── */
function IconX() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
}
function IconCheck() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
}
function IconType() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>
}
function IconUpload() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
}
function IconCamera() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
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
  borderRadius: 10, color: 'var(--text-1)', fontSize: 14,
  outline: 'none', fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color 0.15s',
}

export function AddPassModal({ onSave, onClose }: AddPassModalProps) {
  const [method, setMethod] = useState<Method>('paste')
  const [step, setStep] = useState<'input' | 'confirm'>('input')

  // Input state
  const [pasteText, setPasteText] = useState('')
  const [rawData, setRawData] = useState('')           // resolved QR text (any method)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'decoding' | 'done' | 'error'>('idle')
  const [uploadError, setUploadError] = useState('')
  const [cameraDetected, setCameraDetected] = useState(false)

  // Metadata
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('other')
  const [notes, setNotes] = useState('')

  // Confirm state
  const [qrImageUri, setQrImageUri] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const effectiveData = method === 'paste' ? pasteText.trim() : rawData

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadStatus('decoding')
    setUploadError('')
    try {
      const data = await decodeQRFromFile(file)
      setRawData(data)
      setUploadStatus('done')
    } catch {
      setUploadStatus('error')
      setUploadError('No QR code found in image')
    }
  }

  function handleCameraDetected({ data }: { data: string; imageUri: string }) {
    setRawData(data)
    setCameraDetected(true)
  }

  async function handlePreview() {
    if (!effectiveData) {
      setError(method === 'paste' ? 'Enter some text or URL' : 'Please decode a QR code first')
      return
    }
    if (!name.trim()) { setError('Give this pass a name'); return }
    setError('')
    setLoading(true)
    try {
      const uri = await generateQRDataURL(effectiveData)
      setQrImageUri(uri)
      setStep('confirm')
    } catch {
      setError('Failed to generate QR code')
    } finally {
      setLoading(false)
    }
  }

  function handleSave() {
    onSave({ name: name.trim(), category, notes: notes.trim(), qrData: effectiveData, qrImageUri })
    onClose()
  }

  const methods: Array<{ id: Method; label: string; Icon: React.FC }> = [
    { id: 'paste',  label: 'Text / URL',    Icon: IconType },
    { id: 'upload', label: 'Upload Image',  Icon: IconUpload },
    { id: 'camera', label: 'Camera Scan',   Icon: IconCamera },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 900 }}>
      {/* Backdrop */}
      <div
        className="animate-backdrop-in"
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="animate-modal-up"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#0b1220', borderRadius: '22px 22px 0 0',
          border: '1px solid var(--vborder-2)', borderBottom: 'none',
          padding: '22px 20px 44px',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--vborder-2)', margin: '0 auto 20px' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)' }}>
            {step === 'confirm' ? 'Preview & Save' : 'Add Pass'}
          </h2>
          <button
            onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--vborder)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)' }}
          >
            <IconX />
          </button>
        </div>

        {step === 'input' ? (
          <>
            {/* Method tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4 }}>
              {methods.map(({ id, label, Icon }) => {
                const isA = method === id
                return (
                  <button key={id} onClick={() => { setMethod(id); setError('') }} style={{
                    flex: 1, padding: '9px 4px', borderRadius: 9, cursor: 'pointer',
                    background: isA ? 'rgba(59,158,255,0.18)' : 'transparent',
                    border: isA ? '1px solid rgba(59,158,255,0.4)' : '1px solid transparent',
                    color: isA ? '#3b9eff' : 'var(--text-3)',
                    fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    transition: 'all 0.15s',
                  }}>
                    <Icon />
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Method content */}
            {method === 'paste' && (
              <div style={{ marginBottom: 16 }}>
                <span style={sectionLabel}>Text or URL to encode</span>
                <textarea
                  rows={3}
                  placeholder="Paste a URL, membership ID, or any text…"
                  value={pasteText}
                  onChange={e => setPasteText(e.target.value)}
                  style={{ ...inputStyle, resize: 'none', fontFamily: "'DM Mono', monospace" }}
                />
              </div>
            )}

            {method === 'upload' && (
              <div style={{ marginBottom: 16 }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${uploadStatus === 'done' ? 'rgba(34,212,127,0.4)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 14, padding: 36, textAlign: 'center', cursor: 'pointer',
                    background: uploadStatus === 'done' ? 'rgba(34,212,127,0.05)' : 'transparent',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {uploadStatus === 'done' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22d47f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <div style={{ fontSize: 14, color: '#22d47f', fontWeight: 600 }}>QR decoded successfully</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, fontFamily: "'DM Mono', monospace", wordBreak: 'break-all' }}>{rawData.slice(0, 60)}{rawData.length > 60 ? '…' : ''}</div>
                    </>
                  ) : uploadStatus === 'decoding' ? (
                    <div style={{ fontSize: 14, color: 'var(--text-2)' }}>Scanning image…</div>
                  ) : uploadStatus === 'error' ? (
                    <>
                      <div style={{ fontSize: 14, color: '#ff7070' }}>Failed to decode</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{uploadError}</div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><IconUpload /></div>
                      <div style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 6 }}>Tap to select image</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>PNG, JPG or HEIC containing a QR code</div>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              </div>
            )}

            {method === 'camera' && (
              <div style={{ marginBottom: 16 }}>
                {cameraDetected ? (
                  <div style={{ border: '2px solid rgba(34,212,127,0.4)', borderRadius: 14, padding: 24, textAlign: 'center', background: 'rgba(34,212,127,0.05)' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                    <div style={{ fontSize: 13, color: '#22d47f', fontWeight: 600 }}>QR detected!</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, fontFamily: "'DM Mono', monospace", wordBreak: 'break-all' }}>{rawData.slice(0, 60)}{rawData.length > 60 ? '…' : ''}</div>
                    <button onClick={() => { setCameraDetected(false); setRawData('') }} style={{ marginTop: 10, fontSize: 12, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Scan again</button>
                  </div>
                ) : (
                  <CameraScanner onDetected={handleCameraDetected} onClose={onClose} />
                )}
              </div>
            )}

            {/* Pass name */}
            <div style={{ marginBottom: 14 }}>
              <span style={sectionLabel}>Pass name</span>
              <input type="text" placeholder="e.g. My Gym Pass" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            </div>

            {/* Category */}
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

            {/* Notes */}
            <div style={{ marginBottom: 20 }}>
              <span style={sectionLabel}>Notes (optional)</span>
              <input type="text" placeholder="Any extra info…" value={notes} onChange={e => setNotes(e.target.value)} style={inputStyle} />
            </div>

            {error && <div style={{ fontSize: 13, color: '#ff7777', marginBottom: 12 }}>{error}</div>}

            <button
              onClick={handlePreview}
              disabled={loading}
              style={{
                width: '100%', padding: 15, borderRadius: 13,
                background: 'linear-gradient(140deg, #1a70d9, #3b9eff)',
                border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: '0 4px 20px rgba(59,158,255,0.35)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Generating…' : 'Preview Pass →'}
            </button>
          </>
        ) : (
          <>
            {/* QR preview */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
              <img src={qrImageUri} alt="QR Preview" style={{ width: 220, height: 220, objectFit: 'contain' }} />
            </div>

            {/* Pass info */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>{name}</div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '3px 8px', borderRadius: 20,
                color: CAT_COLORS[category],
                background: CAT_COLORS[category] + '1a',
                border: `1px solid ${CAT_COLORS[category]}33`,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: CAT_COLORS[category], display: 'inline-block' }} />
                {CAT_LABELS[category]}
              </span>
              {notes && <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8 }}>{notes}</div>}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setStep('input')}
                style={{ flex: 1, padding: 14, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--vborder-2)', color: 'var(--text-1)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                ← Edit
              </button>
              <button
                onClick={handleSave}
                style={{
                  flex: 2, padding: 14, borderRadius: 12,
                  background: 'linear-gradient(140deg,#1a70d9,#3b9eff)', border: 'none',
                  color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 20px rgba(59,158,255,0.35)',
                }}
              >
                <IconCheck /> Save to Vault
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
