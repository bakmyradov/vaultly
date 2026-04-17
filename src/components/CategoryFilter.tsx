import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryDef {
  id: Category | 'all'
  label: string
}

const CATEGORIES: CategoryDef[] = [
  { id: 'all', label: 'All' },
  { id: 'gym', label: 'Gym' },
  { id: 'transit', label: 'Transit' },
  { id: 'loyalty', label: 'Loyalty' },
  { id: 'work', label: 'Work' },
  { id: 'travel', label: 'Travel' },
  { id: 'other', label: 'Other' },
]

export interface CategoryStyleEntry {
  className: string
}

export const CATEGORY_STYLE: Record<Category, CategoryStyleEntry> = {
  gym: { className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  transit: { className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  loyalty: { className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  work: { className: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
  travel: { className: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' },
  other: { className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
}

interface CategoryFilterProps {
  active: Category | 'all'
  onChange: (category: Category | 'all') => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap border transition-all',
            active === cat.id
              ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]'
              : 'bg-secondary text-muted-foreground border-border hover:text-foreground hover:bg-accent',
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
