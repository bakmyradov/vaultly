import { useState } from 'react'
import { CAT_COLORS, CAT_LABELS } from './CategoryFilter'
import type { Pass } from '@/types'

interface PassCardProps {
  pass: Pass
  onClick: (pass: Pass) => void
  compact?: boolean
}

export function PassCard({ pass, onClick, compact = false }: PassCardProps) {
  const [hovered, setHovered] = useState(false)
  const color = CAT_COLORS[pass.category] ?? '#7a90bb'

  return (
    <div
      onClick={() => onClick(pass)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="animate-v-fade-in"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? color + '55' : 'var(--vborder)'}`,
        borderRadius: 18,
        padding: 14,
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
        position: 'relative',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered
          ? `0 8px 32px ${color}22, 0 0 0 1px ${color}22`
          : '0 2px 10px rgba(0,0,0,0.25)',
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${color}, ${color}00)`,
          opacity: hovered ? 1 : 0.7,
          transition: 'opacity 0.2s',
        }}
      />

      {/* QR thumbnail */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          background: '#fff',
          borderRadius: compact ? 8 : 10,
          overflow: 'hidden',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={pass.qrImageUri}
          alt={`QR for ${pass.name}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          loading="lazy"
        />
      </div>

      {/* Name */}
      <div
        style={{
          fontSize: compact ? 11 : 13,
          fontWeight: 600,
          color: 'var(--text-1)',
          marginBottom: 5,
          lineHeight: 1.3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {pass.name}
      </div>

      {/* Category badge */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          fontSize: compact ? 9 : 10,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '3px 8px',
          borderRadius: 20,
          color: color,
          background: color + '1a',
          border: `1px solid ${color}33`,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: color,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        {CAT_LABELS[pass.category] ?? pass.category}
      </span>

      {/* Notes */}
      {!compact && pass.notes && (
        <div
          style={{
            marginTop: 7,
            fontSize: 11,
            color: 'var(--text-3)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {pass.notes}
        </div>
      )}
    </div>
  )
}
