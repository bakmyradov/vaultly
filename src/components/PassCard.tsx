import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CATEGORY_STYLE } from './CategoryFilter'
import { cn } from '@/lib/utils'
import type { Pass } from '@/types'

interface PassCardProps {
  pass: Pass
  onClick: (pass: Pass) => void
}

export function PassCard({ pass, onClick }: PassCardProps) {
  const style = CATEGORY_STYLE[pass.category] ?? CATEGORY_STYLE.other

  return (
    <Card
      onClick={() => onClick(pass)}
      className={cn(
        'cursor-pointer transition-all duration-200 hover:border-primary/30',
        'hover:shadow-[0_0_20px_hsl(var(--primary)/0.08)] active:scale-[0.97]',
      )}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-foreground text-sm leading-tight line-clamp-2 flex-1">
            {pass.name}
          </p>
          <Badge
            className={cn(
              'text-[10px] px-2 py-0.5 border shrink-0 mt-0.5 rounded-full font-medium capitalize',
              style.className,
            )}
          >
            {pass.category}
          </Badge>
        </div>

        {pass.qrImageUri && (
          <div className="flex justify-center rounded-lg p-2 bg-background">
            <img
              src={pass.qrImageUri}
              alt={`QR for ${pass.name}`}
              className="w-20 h-20 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        )}

        {pass.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {pass.notes}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
