export type Category = 'gym' | 'transit' | 'loyalty' | 'work' | 'travel' | 'other'

export interface Pass {
  id: string
  name: string
  category: Category
  qrData: string
  qrImageUri: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type CreatePassData = Pick<Pass, 'name' | 'category' | 'qrData' | 'qrImageUri'> &
  Partial<Pick<Pass, 'notes'>>
