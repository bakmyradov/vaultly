import { useState } from 'react'
import { generateQRDataURL, decodeQRFromFile } from '../utils/qr'
import { CameraScanner } from './CameraScanner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Upload, Camera, Type, ArrowLeft, Check } from 'lucide-react'
import type { CreatePassData, Category } from '@/types'

const CATEGORIES: Category[] = ['gym', 'transit', 'loyalty', 'work', 'travel', 'other']

interface DecodedQR {
  data: string
  imageUri: string
}

interface AddPassModalProps {
  onSave: (passData: CreatePassData) => void
  onClose: () => void
}

export function AddPassModal({ onSave, onClose }: AddPassModalProps) {
  const [step, setStep] = useState<'input' | 'confirm'>('input')
  const [decoded, setDecoded] = useState<DecodedQR | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('other')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setLoading(true)
    try {
      const data = await decodeQRFromFile(file)
      const imageUri = await generateQRDataURL(data)
      setDecoded({ data, imageUri })
      setStep('confirm')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode QR')
    } finally {
      setLoading(false)
    }
  }

  async function handlePasteSubmit(text: string) {
    if (!text.trim()) return
    setError('')
    setLoading(true)
    try {
      const imageUri = await generateQRDataURL(text.trim())
      setDecoded({ data: text.trim(), imageUri })
      setStep('confirm')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR')
    } finally {
      setLoading(false)
    }
  }

  function handleCameraDetected({ data }: { data: string; imageUri: string }) {
    generateQRDataURL(data).then(imageUri => {
      setDecoded({ data, imageUri })
      setStep('confirm')
    })
  }

  function handleSave() {
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }
    if (!decoded) return
    onSave({ name: name.trim(), category, notes, qrData: decoded.data, qrImageUri: decoded.imageUri })
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center">
      <Card className="w-full sm:max-w-md sm:rounded-lg rounded-t-2xl max-h-[92vh] overflow-y-auto border-border animate-in slide-in-from-bottom sm:fade-in-0 sm:zoom-in-95">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
          {step === 'confirm' ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={() => {
                setStep('input')
                setDecoded(null)
                setError('')
              }}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <h2 className="text-base font-semibold text-foreground">Add a Pass</h2>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-5">
          {step === 'input' ? (
            <>
              <Tabs defaultValue="upload" onValueChange={() => setError('')} className="w-full">
                <TabsList className="w-full mb-5">
                  <TabsTrigger value="upload" className="flex-1 gap-1.5 text-xs">
                    <Upload className="h-3.5 w-3.5" /> Upload
                  </TabsTrigger>
                  <TabsTrigger value="scan" className="flex-1 gap-1.5 text-xs">
                    <Camera className="h-3.5 w-3.5" /> Scan
                  </TabsTrigger>
                  <TabsTrigger value="paste" className="flex-1 gap-1.5 text-xs">
                    <Type className="h-3.5 w-3.5" /> Paste
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <label className="flex flex-col items-center gap-4 border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">Tap to select image</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Screenshot or photo with QR code
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  {loading && (
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      Scanning image…
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="scan">
                  <CameraScanner onDetected={handleCameraDetected} onClose={onClose} />
                </TabsContent>

                <TabsContent value="paste">
                  <PasteMethod onSubmit={handlePasteSubmit} loading={loading} />
                </TabsContent>
              </Tabs>

              {error && (
                <p className="mt-3 text-sm text-destructive text-center">{error}</p>
              )}
            </>
          ) : decoded ? (
            <div className="flex flex-col gap-4">
              <div className="flex justify-center rounded-lg p-4 bg-background border border-border">
                <img
                  src={decoded.imageUri}
                  alt="QR preview"
                  className="w-44 h-44 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              <p className="text-xs text-center text-muted-foreground bg-muted rounded-md px-3 py-2 font-mono break-all">
                {decoded.data.length > 80 ? decoded.data.slice(0, 80) + '…' : decoded.data}
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. My Gym Pass"
                  autoFocus
                />
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
                  Notes{' '}
                  <span className="text-muted-foreground font-normal normal-case">(optional)</span>
                </label>
                <Textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any additional info…"
                  rows={2}
                  className="resize-none"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                className="w-full gap-2 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                onClick={handleSave}
              >
                <Check className="h-4 w-4" />
                Save Pass
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

interface PasteMethodProps {
  onSubmit: (text: string) => void
  loading: boolean
}

function PasteMethod({ onSubmit, loading }: PasteMethodProps) {
  const [text, setText] = useState('')
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Enter a URL, membership number, or any text to generate a QR code:
      </p>
      <Textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste text or URL here…"
        rows={4}
        className="resize-none"
      />
      <Button
        onClick={() => onSubmit(text)}
        disabled={!text.trim() || loading}
        className="w-full gap-2"
      >
        {loading ? 'Generating…' : 'Generate QR Code'}
      </Button>
    </div>
  )
}
