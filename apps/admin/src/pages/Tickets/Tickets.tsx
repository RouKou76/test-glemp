import { useState, useMemo } from 'react'
import { mockTickets, mockHouses, mockTransferDestinations } from '@glamping/utils'
import type { Ticket, TicketStatus } from '@glamping/types'
import { Badge } from '@glamping/ui'
import { Modal } from '@glamping/ui'

type FilterStatus = TicketStatus | 'all'
type FilterType = string | 'all'

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

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая', accepted: 'Принята', in_progress: 'В работе', done: 'Готово',
}

function formatCreationTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
}

function formatDesiredTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const time = d.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
  if (isToday) return `Сегодня, ${time}`
  return d.toLocaleDateString('ru', { day: '2-digit', month: 'long' }) + ', ' + time
}

function getDesiredTimeLabel(type: string): string {
  switch (type) {
    case 'food': return 'Подать в'
    case 'transfer': return 'Выезд в'
    case 'cleaning': return 'Уборка'
    default: return 'Время'
  }
}

function getUrgency(desiredAt?: string): { color: string; label: string; sort: number } {
  if (!desiredAt) return { color: '', label: '', sort: 999 }
  const now = new Date()
  const target = new Date(desiredAt)
  const diffMin = (target.getTime() - now.getTime()) / 60000

  if (diffMin < 0) return { color: 'text-red-500 font-bold', label: 'Просрочено', sort: 0 }
  if (diffMin < 15) return { color: 'text-orange-500 font-bold', label: `${Math.round(diffMin)} мин`, sort: 1 }
  return { color: 'text-gray-800 dark:text-white', label: '', sort: 2 }
}

function getMainContent(ticket: Ticket): { title: string; items: string[] } {
  switch (ticket.type) {
    case 'food': return { title: 'Заказ', items: ticket.items?.map(i => `${i.name} ×${i.quantity}`) ?? [] }
    case 'transfer': {
      const dest = mockTransferDestinations.find(d => d.id === ticket.geo)
      return { title: 'Адрес', items: dest ? [dest.name] : [ticket.geo ?? ''] }
    }
    case 'cleaning': return { title: '', items: ['Полная уборка домика'] }
    case 'towels': return { title: '', items: ['Замена полотенец'] }
    case 'minibar': return { title: '', items: ['Пополнение минибар'] }
    case 'custom': return { title: '', items: [ticket.description ?? 'Заявка'] }
    default: return { title: '', items: [] }
  }
}

function getExtraInfo(ticket: Ticket): string[] {
  const info: string[] = []
  if (ticket.location) info.push(`📍 ${LOCATION_LABELS[ticket.location] ?? ticket.location}`)
  if (ticket.guestCount) info.push(`👤 ${ticket.guestCount} чел.`)
  if (ticket.description && ticket.type !== 'custom') info.push(`💬 ${ticket.description}`)
  return info
}

const NEXT_STATUS: Record<string, TicketStatus> = { new: 'accepted', accepted: 'in_progress', in_progress: 'done' }
const NEXT_LABEL: Record<string, string> = { new: 'Принять', accepted: 'В работу', in_progress: 'Готово' }

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets.filter(t => t.type !== 'gates'))
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  function getHouseNumber(houseId: string): number { return mockHouses.find(h => h.id === houseId)?.number ?? 0 }

  function handleStatusChange(id: string, status: TicketStatus) {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    setSelectedTicket(prev => prev && prev.id === id ? { ...prev, status } : prev)
  }

  function handleArchive(id: string) {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'archived' } : t))
    setSelectedTicket(null)
  }

  const filtered = useMemo(() => {
    const result = tickets.filter(t => {
      const matchStatus = statusFilter === 'all' || t.status === statusFilter
      const matchType = typeFilter === 'all' || t.type === typeFilter
      return matchStatus && matchType && t.status !== 'archived'
    })
    return result.sort((a, b) => {
      const urgA = getUrgency(a.desiredAt)
      const urgB = getUrgency(b.desiredAt)
      if (urgA.sort !== urgB.sort) return urgA.sort - urgB.sort
      return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    })
  }, [tickets, statusFilter, typeFilter])

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
            const urgency = getUrgency(ticket.desiredAt)

            return (
              <div key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="bg-white dark:bg-[#1a1d27] rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden transition-colors cursor-pointer active:scale-[0.98]">
                {/* Шапка */}
                <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg shrink-0">{config.icon}</span>
                    <span className="font-bold text-sm text-gray-800 dark:text-white truncate">{config.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/50 text-[10px] font-bold px-2 py-0.5 rounded">#{houseNumber}</span>
                    <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[ticket.status] ?? 'bg-gray-400'}`}></span>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-white/50 uppercase">{STATUS_LABELS[ticket.status] ?? ticket.status}</span>
                  </div>
                </div>

                {/* Время создания (мелкое, серое) */}
                <div className="px-4 pb-1">
                  <span className="text-[10px] text-gray-400 dark:text-white/25">{formatCreationTime(ticket.sentAt)}</span>
                </div>

                {/* Основная информация */}
                {mainContent.items.length > 0 && (
                  <div className="px-4 pb-1">
                    {mainContent.title && <p className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-0.5">{mainContent.title}</p>}
                    <div className="space-y-0">
                      {mainContent.items.map((item, i) => (
                        <p key={i} className="text-sm font-medium text-gray-800 dark:text-white leading-tight">{item}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Время выполнения — приоритет */}
                {ticket.desiredAt && (
                  <div className="px-4 py-1.5">
                    <span className={`text-sm font-semibold ${urgency.color}`}>
                      🕒 {getDesiredTimeLabel(ticket.type)} {formatDesiredTime(ticket.desiredAt)}
                    </span>
                    {urgency.label && <span className={`ml-2 text-xs ${urgency.color}`}>{urgency.label}</span>}
                  </div>
                )}

                {/* Доп. информация */}
                {extraInfo.length > 0 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-x-3 gap-y-0.5">
                    {extraInfo.map((info, i) => (
                      <span key={i} className="text-[11px] text-gray-500 dark:text-white/40">{info}</span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Экран деталей заявки */}
      {selectedTicket && (() => {
        const t = selectedTicket
        const config = TYPE_CONFIG[t.type] ?? { icon: '📋', label: 'Заявка' }
        const houseNumber = getHouseNumber(t.houseId)
        const mainContent = getMainContent(t)
        const urgency = getUrgency(t.desiredAt)
        const nextStatus = NEXT_STATUS[t.status]
        const nextLabel = NEXT_LABEL[t.status]

        return (
          <Modal open={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`${config.icon} ${config.label}`}>
            <div className="p-5 space-y-4">
              {/* Шапка */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/50 text-xs font-bold px-2 py-1 rounded">Домик #{houseNumber}</span>
                  <Badge status={t.status} />
                </div>
                <span className="text-xs text-gray-400 dark:text-white/30">{formatCreationTime(t.sentAt)}</span>
              </div>

              {/* Основная информация */}
              {mainContent.items.length > 0 && (
                <div>
                  {mainContent.title && <p className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1">{mainContent.title}</p>}
                  <div className="space-y-1">
                    {mainContent.items.map((item, i) => (
                      <p key={i} className="text-sm font-medium text-gray-800 dark:text-white">{item}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Время выполнения */}
              {t.desiredAt && (
                <div className={`p-3 rounded-xl ${urgency.color.includes('red') ? 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20' : urgency.color.includes('orange') ? 'bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20' : 'bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10'}`}>
                  <span className={`text-sm font-semibold ${urgency.color}`}>
                    🕒 {getDesiredTimeLabel(t.type)} {formatDesiredTime(t.desiredAt)}
                  </span>
                  {urgency.label && <span className={`ml-2 text-xs ${urgency.color}`}>{urgency.label}</span>}
                </div>
              )}

              {/* Все детали */}
              <div className="space-y-1 text-xs text-gray-500 dark:text-white/40">
                {t.location && <p>📍 {LOCATION_LABELS[t.location] ?? t.location}</p>}
                {t.guestCount && <p>👤 {t.guestCount} чел.</p>}
                {t.description && <p>💬 {t.description}</p>}
                {t.items && t.items.length > 0 && t.items.map(item => (
                  <p key={item.menuItemId}>• {item.name} ×{item.quantity} — {item.price * item.quantity} ₽</p>
                ))}
              </div>

              {/* Действия */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {nextStatus && (
                  <button onClick={() => handleStatusChange(t.id, nextStatus)}
                    className={`py-3 rounded-xl text-sm font-bold text-white ${t.status === 'new' ? 'bg-amber-500' : t.status === 'accepted' ? 'bg-blue-500' : 'bg-green-500'}`}>
                    {nextLabel}
                  </button>
                )}
                {t.status === 'done' && (
                  <button onClick={() => handleArchive(t.id)}
                    className="py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-white/50 bg-gray-100 dark:bg-white/5">
                    В архив
                  </button>
                )}
                <button onClick={() => setSelectedTicket(null)}
                  className="py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-white/50 bg-gray-100 dark:bg-white/5">
                  Закрыть
                </button>
              </div>
            </div>
          </Modal>
        )
      })()}
    </div>
  )
}
