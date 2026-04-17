import jsQR from 'jsqr'
import QRCode from 'qrcode'

export async function generateQRDataURL(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 400,
    margin: 2,
    color: { dark: '#0C447C', light: '#FFFFFF' },
  })
}

export function decodeQRFromImageData(
  imageData: Uint8ClampedArray,
  width: number,
  height: number,
): ReturnType<typeof jsQR> {
  return jsQR(imageData, width, height)
}

export async function decodeQRFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('Could not get canvas context'))
        return
      }
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const result = jsQR(imageData.data, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      if (result) {
        resolve(result.data)
      } else {
        reject(new Error('No QR code found in image'))
      }
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}
