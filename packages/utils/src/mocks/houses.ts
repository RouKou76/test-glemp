import type { House } from '@glamping/types'

export const mockHouses: House[] = [
  { id: 'h1', number: 1, status: 'occupied', guestCount: 2, lang: 'ru', checkInAt: '2026-06-15T14:00:00Z' },
  { id: 'h2', number: 2, status: 'occupied', guestCount: 4, lang: 'en', checkInAt: '2026-06-14T12:00:00Z' },
  { id: 'h3', number: 3, status: 'vacant', lang: 'ru' },
  { id: 'h4', number: 4, status: 'occupied', guestCount: 3, lang: 'ru', checkInAt: '2026-06-16T10:00:00Z' },
  { id: 'h5', number: 5, status: 'vacant', lang: 'ru' },
  { id: 'h6', number: 6, status: 'occupied', guestCount: 2, lang: 'zh', checkInAt: '2026-06-13T15:00:00Z' },
]
