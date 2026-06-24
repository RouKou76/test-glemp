import type { Service } from '@glamping/types'

export const mockServices: Service[] = [
  {
    id: 'cs1', name: 'Русская баня', price: '3 000 ₽ / час', icon: '🛁',
    active: true, assignedTo: 'admin',
    fields: {
      desiredAt: { enabled: true, label: 'Удобное время' },
      guestCount: { enabled: true, label: 'Количество человек' },
      comment: { enabled: true },
    },
  },
  {
    id: 'cs2', name: 'Прокат велосипедов', price: '500 ₽ / час', icon: '🚲',
    active: true, assignedTo: 'admin',
    fields: {
      desiredAt: { enabled: true, label: 'Время начала' },
      guestCount: { enabled: true, label: 'Количество велосипедов' },
    },
  },
]
