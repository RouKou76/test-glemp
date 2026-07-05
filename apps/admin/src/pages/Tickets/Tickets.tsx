import { useState, useMemo } from 'react'
import { mockTickets, mockHouses, mockTransferDestinations } from '@glamping/utils'
import type { Ticket, TicketStatus, TicketType } from '@glamping/types'
import { Badge } from '@glamping/ui'
import { ConfirmDialog } from '@glamping/ui'

type FilterStatus = TicketStatus | 'all'
type FilterType = TicketType | 'all'

const TYPE_CONFIG: Record<string, { icon: string; label: string }> = {
  food: { icon: '🍽', label: 'Питание' },
  minibar: { icon: '🥤', label: 'Минибар' },
  transfer: { icon: '🚗', label: 'Трансфер' },
  cleaning: { icon: '🧹', label: 'Уборка' },
  towels: { icon: '🧺', label: 'Полотенца' },
  gates: { icon: '🚪', label: 'Ворота' },
  custom: { icon: '⚡', label: 'Услуга' },
}

const LOCATION_LABELS: Record<string, string> = {
  cabin: '🏠 В домик', terrace: '🌿 На террасу', gazebo: '⛺ В беседку',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-orange-500', accepted: 'bg-blue-500', in_progress: 'bg-purple-500', done: 'bg-green-500',
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const time = d.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
  return isToday ? time : d.toLocaleDateString('ru', { day: '2-digit', month: 'short' }) + ' ' + time
}

function getMainContent(ticket: Ticket): { title: string; items: string[] } {
  switch (ticket.type) {
    case 'food':
      return { title: 'Заказ', items: ticket.items?.map(i => `${i.name} ×${i.quantity}`) ?? [] }
    case 'transfer': {
      const dest = mockTransferDestinations.find(d => d.id === ticket.geo)
      return { title: 'Адрес', items: dest ? [dest.name] : [ticket.geo ?? ''] }
    }
    case 'cleaning': return { title: '', items: ['Полная уборка домика'] }
    case 'towels': return { title: '', items: ['Замена полотенец'] }
    case 'minibar': return { title: '', items: ['Пополнение минибара'] }
    case 'custom': return { title: '', items: [ticket.description ?? 'Заявка'] }
    default: return { title: '', items: [] }
  }
}

function getExtraInfo(ticket: Ticket): string[] {
  const info: string[] = []
  if (ticket.desiredAt) {
    const t = new Date(ticket.desiredAt)
    info.push(`🕒 ${t.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}`)
  }
  if (ticket.location) info.push(`📍 ${LOCATION_LABELS[ticket.location] ?? ticket.location}`)
  if (ticket.guestCount) info.push(`👤 ${ticket.guestCount} чел.`)
  if (ticket.description && ticket.type !== 'custom') info.push(`💬 ${ticket.description}`)
  return info
}

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets.filter(t => t.type !== 'gates'))
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [actionTicket, setActionTicket] = useState<Ticket | null>(null)

  function getHouseNumber(houseId: string): number { return mockHouses.find(h => h.id === houseId)?.number ?? 0 }
  function handleStatusChange(id: string, status: TicketStatus) { setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t)); setActionTicket(null) }

  const filtered = useMemo(() => tickets.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchType = typeFilter === 'all' || t.type === typeFilter
    return matchStatus && matchType && t.status !== 'archived'
  }), [tickets, statusFilter, typeFilter])

  const newCount = tickets.filter(t => t.status === 'new').length

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Заявки</h2>
        {newCount > 0 && <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{newCount}</span>}
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {(['all', 'new', 'accepted', 'in_progress', 'done'] as FilterStatus[]).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${statusFilter === s ? 'bg-glamp-600 border-glamp-600 text-white' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
            {s === 'all' ? 'Все' : s === 'new' ? 'Новые' : s === 'accepted' ? 'Приняты' : s === 'in_progress' ? 'В работе' : 'Готово'}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {(['all', 'food', 'minibar', 'transfer', 'cleaning', 'towels'] as FilterType[]).map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${typeFilter === t ? 'bg-gray-800 dark:bg-white/15 border-gray-800 dark:border-white/30 text-white' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
            {t === 'all' ? 'Все типы' : `${TYPE_CONFIG[t]?.icon} ${TYPE_CONFIG[t]?.label}`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-white/20">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">Нет заявок</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ticket => {
            const config = TYPE_CONFIG[ticket.type] ?? { icon: '📋', label: 'Заявка' }
            const houseNumber = getHouseNumber(ticket.houseId)
            const mainContent = getMainContent(ticket)
            const extraInfo = getExtraInfo(ticket)
            const isExpanded = expandedId === ticket.id
            const nextStatusMap: Record<string, TicketStatus> = { new: 'accepted', accepted: 'in_progress', in_progress: 'done' }
            const nextStatus = nextStatusMap[ticket.status]

            return (
              <div key={ticket.id} className="bg-white dark:bg-[#1a1d27] rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden transition-colors">
                {/* Шапка */}
                <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg shrink-0">{config.icon}</span>
                    <span className="font-bold text-sm text-gray-800 dark:text-white truncate">{config.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/50 text-[10px] font-bold px-2 py-0.5 rounded">#{houseNumber}</span>
                    <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[ticket.status] ?? 'bg-gray-400'}`}></span>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-white/50 uppercase">{ticket.status === 'new' ? 'Новая' : ticket.status === 'accepted' ? 'Принята' : ticket.status === 'in_progress' ? 'В работе' : 'Готово'}</span>
                  </div>
                </div>

                {/* Время */}
                <div className="px-4 pb-2">
                  <span className="text-[11px] text-gray-400 dark:text-white/30">{formatTime(ticket.sentAt)}</span>
                </div>

                {/* Основная информация */}
                {mainContent.items.length > 0 && (
                  <div className="px-4 pb-2">
                    {mainContent.title && <p className="text-[11px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1">{mainContent.title}</p>}
                    <div className="space-y-0.5">
                      {mainContent.items.map((item, i) => (
                        <p key={i} className="text-sm font-medium text-gray-800 dark:text-white">{item}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Доп. информация */}
                {extraInfo.length > 0 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-x-4 gap-y-1">
                    {extraInfo.map((info, i) => (
                      <span key={i} className="text-xs text-gray-500 dark:text-white/40">{info}</span>
                    ))}
                  </div>
                )}

                {/* Кнопка */}
                <div className="px-4 pb-3 pt-1">
                  {isExpanded ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {nextStatus && (
                          <button onClick={() => handleStatusChange(ticket.id, nextStatus)}
                            className={`py-2 rounded-lg text-xs font-bold text-white ${ticket.status === 'new' ? 'bg-amber-500' : ticket.status === 'accepted' ? 'bg-blue-500' : 'bg-green-500'}`}>
                            {nextStatus === 'accepted' ? 'Принять' : nextStatus === 'in_progress' ? 'В работу' : 'Готово'}
                          </button>
                        )}
                        <button onClick={() => setExpandedId(null)}
                          className="py-2 rounded-lg text-xs font-medium text-gray-600 dark:text-white/50 bg-gray-100 dark:bg-white/5">
                          Свернуть
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                      className="w-full py-2 rounded-lg text-xs font-medium text-gray-500 dark:text-white/40 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                      Открыть заявку
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
