import type { Pass } from '../types'

const KEY = 'vaultly_passes'

function sampleQrUri(data: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(data)}&color=111111&bgcolor=FFFFFF&margin=8&qzone=1`
}

const SAMPLE_PASSES: Pass[] = [
  { id: 's1', name: 'FitLife Gym',          category: 'gym',     qrData: 'https://fitlife.app/member/FL-29471',       qrImageUri: sampleQrUri('https://fitlife.app/member/FL-29471'),       notes: 'Main entrance + locker room', createdAt: '2026-04-10T09:00:00Z', updatedAt: '2026-04-10T09:00:00Z' },
  { id: 's2', name: 'Oyster Card',           category: 'transit', qrData: 'https://tfl.gov.uk/card/4829571',           qrImageUri: sampleQrUri('https://tfl.gov.uk/card/4829571'),           notes: '£42.50 weekly travelcard',   createdAt: '2026-04-08T14:30:00Z', updatedAt: '2026-04-08T14:30:00Z' },
  { id: 's3', name: 'Starbucks Rewards',     category: 'loyalty', qrData: 'https://starbucks.com/loyalty/482957182',   qrImageUri: sampleQrUri('https://starbucks.com/loyalty/482957182'),   notes: '340 stars',                  createdAt: '2026-04-05T11:00:00Z', updatedAt: '2026-04-05T11:00:00Z' },
  { id: 's4', name: 'Office Badge',          category: 'work',    qrData: 'EMP-2024-ADAM-7749',                        qrImageUri: sampleQrUri('EMP-2024-ADAM-7749'),                        notes: 'Floor 12–15 access',         createdAt: '2026-03-20T08:00:00Z', updatedAt: '2026-03-20T08:00:00Z' },
  { id: 's5', name: 'BA Flight LHR→JFK',    category: 'travel',  qrData: 'ADAM/SMITH BA0117 2026-04-22 14C',          qrImageUri: sampleQrUri('ADAM/SMITH BA0117 2026-04-22 14C'),          notes: 'Gate closes 13:45',          createdAt: '2026-04-15T16:00:00Z', updatedAt: '2026-04-15T16:00:00Z' },
  { id: 's6', name: 'Waitrose MyWaitrose',   category: 'loyalty', qrData: 'https://waitrose.com/loyalty/M927364819',  qrImageUri: sampleQrUri('https://waitrose.com/loyalty/M927364819'),  notes: '',                           createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-01T10:00:00Z' },
  { id: 's7', name: 'WeWork Key Card',       category: 'work',    qrData: 'WW-ACCESS-9284-LONDON',                    qrImageUri: sampleQrUri('WW-ACCESS-9284-LONDON'),                    notes: '24/7 access',                createdAt: '2026-03-15T10:00:00Z', updatedAt: '2026-03-15T10:00:00Z' },
  { id: 's8', name: 'Eurostar London→Paris', category: 'travel',  qrData: 'ES-7X29-SMITH-ADAM-20260601',              qrImageUri: sampleQrUri('ES-7X29-SMITH-ADAM-20260601'),              notes: 'Seat 12A, Coach 5',          createdAt: '2026-04-18T12:00:00Z', updatedAt: '2026-04-18T12:00:00Z' },
]

export function loadPasses(): Pass[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Pass[]
    // Seed with sample passes on first load
    savePasses(SAMPLE_PASSES)
    return SAMPLE_PASSES
  } catch {
    return SAMPLE_PASSES
  }
}

export function savePasses(passes: Pass[]): void {
  localStorage.setItem(KEY, JSON.stringify(passes))
}
