import type { Service } from '@glamping/types'

export const mockServices: Service[] = [
  {
    id: 'cs1',
    name: 'Русская баня',
    price: '3 000 ₽ / час',
    icon: '🛁',
    active: true,
    assignedTo: 'admin',
    fields: {
      desiredAt: { enabled: true, label: 'Удобное время' },
      guestCount: { enabled: true, label: 'Количество человек' },
      comment: { enabled: true },
    },
  },
  {
    id: 'cs2',
    name: 'Прокат велосипедов',
    price: '500 ₽ / час',
    icon: '🚲',
    active: true,
    assignedTo: 'admin',
    fields: {
      desiredAt: { enabled: true, label: 'Время начала' },
      guestCount: { enabled: true, label: 'Количество велосипедов' },
      catalog: { enabled: true, label: 'Выберите тип' },
    },
    items: [
      { id: 'bike1', name: 'Горный велосипед', price: 500, hidden: false },
      { id: 'bike2', name: 'Городской велосипед', price: 400, hidden: false },
      { id: 'bike3', name: 'Детский велосипед', price: 300, hidden: false },
    ],
  },
]
