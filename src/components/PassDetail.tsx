import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { CATEGORY_STYLE } from './CategoryFilter'
import { cn } from '@/lib/utils'
import { ArrowLeft, Trash2, Pencil, Maximize2, X, Check } from 'lucide-react'
import type { Pass, Category } from '@/types'

const CATEGORIES: Category[] = ['gym', 'transit', 'loyalty', 'work', 'travel', 'other']

interface PassDetailProps {
  pass: Pass
  onClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Omit<Pass, 'id' | 'createdAt'>>) => void
  onFullscreen: (pass: Pass) => void
}

export function PassDetail({ pass, onClose, onDelete, onUpdate, onFullscreen }: PassDetailProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(pass.name)
  const [category, setCategory] = useState<Category>(pass.category)
  const [notes, setNotes] = useState(pass.notes ?? '')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const style = CATEGORY_STYLE[pass.category] ?? CATEGORY_STYLE.other

  function handleSave() {
    onUpdate(pass.id, { name, category, notes })
    setEditing(false)
  }

  function handleCancel() {
    setEditing(false)
    setName(pass.name)
    setCategory(pass.category)
    setNotes(pass.notes ?? '')
  }

  return (
    <div className="fixed inset-0 bg-background z-40 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-1">
          {!editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {editing ? (
          <div className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </label>
              <Input value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </label>
              <Select value={category} onValueChange={val => setCategory(val as Category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Notes
              </label>
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={handleCancel}>
                <X className="h-4 w-4" /> Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                <Check className="h-4 w-4" /> Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground flex-1">{pass.name}</h1>
              <Badge className={cn('border capitalize font-medium', style.className)}>
                {pass.category}
              </Badge>
            </div>

            {pass.qrImageUri && (
              <Card>
                <CardContent className="p-5 flex justify-center bg-background rounded-lg">
                  <img
                    src={pass.qrImageUri}
                    alt="QR Code"
                    className="w-56 h-56 object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </CardContent>
              </Card>
            )}

            <Button
              className="w-full gap-2 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
              onClick={() => onFullscreen(pass)}
            >
              <Maximize2 className="h-4 w-4" />
              Show Fullscreen
            </Button>

            {pass.notes && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Notes
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{pass.notes}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  QR Data
                </p>
                <p className="text-xs text-muted-foreground font-mono break-all leading-relaxed">
                  {pass.qrData}
                </p>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground text-center">
              Added{' '}
              {new Date(pass.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-sm animate-in fade-in-0 zoom-in-95 sm:rounded-lg">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center mb-4">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">Delete pass?</h3>
              <p className="text-sm text-muted-foreground mb-5">
                &quot;{pass.name}&quot; will be permanently removed from your vault.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => onDelete(pass.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Separator is imported but used only as a structural element in the original.
// Re-export to prevent unused import errors if consumers need it.
export { Separator }
