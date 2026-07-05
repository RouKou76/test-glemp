import { useState, useMemo } from 'react'
import { mockTickets, mockHouses, mockTransferDestinations } from '@glamping/utils'
import type { Ticket, TicketStatus, TicketType } from '@glamping/types'
import { Badge } from '@glamping/ui'

type FilterStatus = TicketStatus | 'all'
type FilterType = TicketType | 'all'

const TYPE_LABELS: Record<string, string> = {
  food: '🍔 Еда', minibar: '🍷 Минибар', transfer: '🚗 Трансфер',
  cleaning: '✨ Клининг', towels: '🧺 Полотенца', gates: '🚪 Ворота', custom: '⚡ Услуга',
}

const LOCATION_LABELS: Record<string, string> = {
  cabin: '🏠 В домик', terrace: '🌿 На террасу', gazebo: '⛺ В беседку',
}

const NEXT_STATUS: Partial<Record<TicketStatus, TicketStatus>> = { new: 'accepted', accepted: 'in_progress', in_progress: 'done' }
const NEXT_LABEL: Partial<Record<TicketStatus, string>> = { new: 'Принять', accepted: 'В работу', in_progress: 'Готово' }

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets.filter(t => t.type !== 'gates'))
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')

  function getHouseNumber(houseId: string): number { return mockHouses.find(h => h.id === houseId)?.number ?? 0 }
  function handleStatusChange(id: string, status: TicketStatus) { setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t)) }
  function handleArchive(id: string) { setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'archived' } : t)) }

  const filtered = useMemo(() => tickets.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchType = typeFilter === 'all' || t.type === typeFilter
    return matchStatus && matchType && t.status !== 'archived'
  }), [tickets, statusFilter, typeFilter])

  const newCount = tickets.filter(t => t.status === 'new').length

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Заявки гостей</h2>
        {newCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{newCount}</span>}
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
            {t === 'all' ? 'Все типы' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-white/20"><p className="text-4xl mb-3">📭</p><p className="text-sm">Нет заявок</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ticket => {
            const houseNumber = getHouseNumber(ticket.houseId)
            const sentAt = new Date(ticket.sentAt).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
            const desiredAt = ticket.desiredAt ? new Date(ticket.desiredAt).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) : null
            const nextStatus = NEXT_STATUS[ticket.status]
            const nextLabel = NEXT_LABEL[ticket.status]

            return (
              <div key={ticket.id} className="bg-white dark:bg-[#1a1d27] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{TYPE_LABELS[ticket.type]?.split(' ')[0] ?? '📋'}</span>
                    <div>
                      <span className="font-medium text-gray-800 dark:text-white text-sm">{TYPE_LABELS[ticket.type]?.split(' ').slice(1).join(' ') ?? 'Услуга'}</span>
                      <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/50 text-[10px] font-bold px-2 py-1 rounded-md ml-2">Домик #{houseNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-white/50">{sentAt}</span>
                    <Badge status={ticket.status} />
                  </div>
                </div>
                {ticket.items && ticket.items.length > 0 && (
                  <div className="space-y-1 my-2">
                    {ticket.items.map(item => (<div key={item.menuItemId} className="flex justify-between text-xs text-gray-600 dark:text-white/50"><span>{item.name} × {item.quantity}</span><span>{item.price * item.quantity} ₽</span></div>))}
                  </div>
                )}
                <div className="space-y-1 text-xs text-gray-500 dark:text-white/50 my-2">
                  {desiredAt && <p>⏱ Желаемое время: <span className="text-gray-600 dark:text-white/60">{desiredAt}</span></p>}
                  {ticket.location && <p>📍 Место: <span className="text-gray-600 dark:text-white/60">{LOCATION_LABELS[ticket.location] ?? ticket.location}</span></p>}
                  {ticket.geo && <p>🗺 Направление: <span className="text-gray-600 dark:text-white/60">{mockTransferDestinations.find(d => d.id === ticket.geo)?.name ?? ticket.geo}</span></p>}
                  {ticket.description && <p>💬 <span className="text-gray-600 dark:text-white/60">{ticket.description}</span></p>}
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 dark:border-white/10 pt-3 mt-2">
                  <div className="flex gap-2">
                    {nextStatus && nextLabel && (
                      <button onClick={() => handleStatusChange(ticket.id, nextStatus)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${ticket.status === 'new' ? 'bg-amber-500' : ticket.status === 'accepted' ? 'bg-blue-500' : 'bg-green-500'}`}>{nextLabel}</button>
                    )}
                    {ticket.status === 'done' && <button onClick={() => handleArchive(ticket.id)} className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-xs font-bold text-gray-600 dark:text-white/50">В архив</button>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
