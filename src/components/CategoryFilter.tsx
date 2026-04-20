import type { Category } from '@/types'

export const CAT_COLORS: Record<Category | 'all', string> = {
  all:     '#3b9eff',
  gym:     '#3b9eff',
  transit: '#22d47f',
  loyalty: '#f5a623',
  work:    '#b48afe',
  travel:  '#2dd4bf',
  other:   '#7a90bb',
}

export const CAT_LABELS: Record<Category, string> = {
  gym:     'Gym',
  transit: 'Transit',
  loyalty: 'Loyalty',
  work:    'Work',
  travel:  'Travel',
  other:   'Other',
}

const CATEGORIES: Array<{ id: Category | 'all'; label: string }> = [
  { id: 'all',     label: 'All' },
  { id: 'gym',     label: 'Gym' },
  { id: 'transit', label: 'Transit' },
  { id: 'loyalty', label: 'Loyalty' },
  { id: 'work',    label: 'Work' },
  { id: 'travel',  label: 'Travel' },
  { id: 'other',   label: 'Other' },
]

interface CategoryFilterProps {
  active: Category | 'all'
  onChange: (category: Category | 'all') => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div
      className="scrollbar-hide"
      style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 14, flexShrink: 0 }}
    >
      {CATEGORIES.map(cat => {
        const isActive = active === cat.id
        const color = CAT_COLORS[cat.id]
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: 24,
              border: isActive ? `1px solid ${color}55` : '1px solid var(--vborder)',
              background: isActive ? `${color}18` : 'var(--surface)',
              color: isActive ? color : 'var(--text-2)',
              fontSize: 12,
              fontWeight: isActive ? 700 : 400,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.15s',
              boxShadow: isActive ? `0 0 14px ${color}28` : 'none',
            }}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
