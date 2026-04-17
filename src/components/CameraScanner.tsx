import { useEffect, useRef, useState } from 'react'
import { useCamera } from '../hooks/useCamera'
import { decodeQRFromImageData } from '../utils/qr'

interface QRDetectedPayload {
  data: string
  imageUri: string
}

interface CameraScannerProps {
  onDetected: (payload: QRDetectedPayload) => void
  onClose: () => void
}

export function CameraScanner({ onDetected, onClose: _onClose }: CameraScannerProps) {
  const { videoRef, isActive, error, start, stop } = useCamera()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const [scanning, setScanning] = useState(true)

  useEffect(() => {
    start()
    return () => {
      stop()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [start, stop])

  useEffect(() => {
    if (!isActive || !scanning) return

    function scan() {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState !== 4) {
        rafRef.current = requestAnimationFrame(scan)
        return
      }
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const result = decodeQRFromImageData(imageData.data, canvas.width, canvas.height)
      if (result) {
        setScanning(false)
        stop()
        try {
          const audioCtx = new AudioContext()
          const osc = audioCtx.createOscillator()
          osc.connect(audioCtx.destination)
          osc.frequency.value = 880
          osc.start()
          osc.stop(audioCtx.currentTime + 0.1)
        } catch {
          // beep is non-critical
        }
        const dataUri = canvas.toDataURL('image/png')
        onDetected({ data: result.data, imageUri: dataUri })
        return
      }
      rafRef.current = requestAnimationFrame(scan)
    }

    rafRef.current = requestAnimationFrame(scan)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [isActive, scanning, stop, onDetected, videoRef])

  return (
    <div className="flex flex-col items-center gap-4">
      {error ? (
        <div className="text-red-500 text-sm text-center p-4 bg-red-50 rounded-xl w-full">
          <p className="font-medium">Camera unavailable</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : (
        <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '1' }}>
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-white rounded-xl opacity-70">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-xl" />
            </div>
          </div>
          {isActive && (
            <p className="absolute bottom-3 w-full text-center text-white text-xs opacity-80">
              Point camera at a QR code
            </p>
          )}
        </div>
      )}
    </div>
  )
}
