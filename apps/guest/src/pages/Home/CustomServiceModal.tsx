import { useState } from 'react'
import { BottomSheet } from '@glamping/ui'
import type { Service, TicketItem } from '@glamping/types'

type Step = 'edit' | 'success'

interface CustomServiceModalProps {
  open: boolean
  service: Service
  onClose: () => void
  onSubmit: (data: { serviceId: string; desiredAt?: string; location?: string; guestCount?: number; comment?: string; items?: TicketItem[] }) => void
}

export function CustomServiceModal({ open, service, onClose, onSubmit }: CustomServiceModalProps) {
  const [step, setStep] = useState<Step>('edit')
  const [desiredAt, setDesiredAt] = useState('')
  const [location, setLocation] = useState('cabin')
  const [guestCount, setGuestCount] = useState(2)
  const [comment, setComment] = useState('')
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({})

  const fields = service.fields

  function handleClose() {
    setStep('edit')
    setDesiredAt('')
    setLocation('cabin')
    setGuestCount(2)
    setComment('')
    setSelectedItems({})
    onClose()
  }

  function handleSubmit() {
    onSubmit({
      serviceId: service.id,
      desiredAt: fields.desiredAt?.enabled ? desiredAt || undefined : undefined,
      location: fields.location?.enabled ? location : undefined,
      guestCount: fields.guestCount?.enabled ? guestCount : undefined,
      comment: fields.comment?.enabled ? comment || undefined : undefined,
      items: fields.catalog?.enabled ? service.items?.filter(i => selectedItems[i.id] && !i.hidden).map(i => ({
        menuItemId: i.id, name: i.name, price: i.price, quantity: 1,
      })) : undefined,
    })
    setStep('success')
  }

  const hasAnyField = fields.desiredAt?.enabled || fields.location?.enabled || fields.guestCount?.enabled || fields.comment?.enabled || fields.catalog?.enabled || fields.geo?.enabled

  return (
    <BottomSheet open={open} onClose={handleClose} title={service.name}>
      {step === 'edit' && (
        <div className="p-6 space-y-4">
          {service.price && (
            <p className="text-sm text-gray-500 dark:text-white/50">{service.price}</p>
          )}

          {fields.desiredAt?.enabled && (
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2 block">
                {fields.desiredAt.label || 'Желаемое время'}
              </label>
              <input type="datetime-local" value={desiredAt} onChange={e => setDesiredAt(e.target.value)}
                className="w-full p-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-glamp-500 [color-scheme:dark]" />
            </div>
          )}

          {fields.location?.enabled && (
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2 block">
                {fields.location.label || 'Место'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[['cabin', '🏠 Домик'], ['terrace', '🌿 Терраса'], ['gazebo', '⛺ Беседка']].map(([val, label]) => (
                  <button key={val} onClick={() => setLocation(val)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors text-center ${location === val ? 'bg-glamp-600 border-glamp-600 text-white' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {fields.guestCount?.enabled && (
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2 block">
                {fields.guestCount.label || 'Количество персон'}
              </label>
              <div className="flex items-center gap-4">
                <button onClick={() => setGuestCount(g => Math.max(1, g - 1))}
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/20 text-gray-600 dark:text-white flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-lg">−</button>
                <span className="text-xl font-bold text-gray-800 dark:text-white w-8 text-center">{guestCount}</span>
                <button onClick={() => setGuestCount(g => Math.min(20, g + 1))}
                  className="w-10 h-10 rounded-full bg-glamp-600 hover:bg-glamp-700 text-white flex items-center justify-center transition-colors text-lg">+</button>
              </div>
            </div>
          )}

          {fields.catalog?.enabled && service.items && service.items.filter(i => !i.hidden).length > 0 && (
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2 block">
                {fields.catalog.label || 'Выберите из каталога'}
              </label>
              <div className="space-y-2">
                {service.items.filter(i => !i.hidden).map(item => (
                  <label key={item.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${selectedItems[item.id] ? 'border-glamp-500 bg-glamp-50 dark:bg-glamp-500/10' : 'border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={!!selectedItems[item.id]}
                        onChange={e => setSelectedItems(p => ({ ...p, [item.id]: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-glamp-600 focus:ring-glamp-500" />
                      <span className="text-sm text-gray-800 dark:text-white">{item.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-white/50">{item.price} ₽</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {fields.geo?.enabled && (
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2 block">
                {fields.geo.label || 'Адрес / геолокация'}
              </label>
              <input type="text" placeholder="Введите адрес..."
                className="w-full p-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-glamp-500" />
            </div>
          )}

          {fields.comment?.enabled && (
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2 block">
                {fields.comment.label || 'Комментарий'}
              </label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Дополнительные пожелания..."
                className="w-full p-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-glamp-500 resize-none" />
            </div>
          )}

          {!hasAnyField && (
            <p className="text-sm text-gray-500 dark:text-white/50 text-center py-4">
              Нажмите «Отправить» чтобы создать заявку
            </p>
          )}

          <button onClick={handleSubmit}
            className="w-full bg-glamp-600 text-white py-3.5 rounded-2xl font-bold hover:bg-glamp-700 active:scale-95 transition-all shadow-sm">
            Отправить заявку
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <div>
            <p className="text-gray-800 dark:text-white font-bold text-lg">Заявка принята!</p>
            <p className="text-gray-500 dark:text-white/40 text-sm mt-1">{service.name} — ожидайте подтверждения</p>
          </div>
          <button onClick={handleClose}
            className="w-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/60 py-3 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors active:scale-95">
            Закрыть
          </button>
        </div>
      )}
    </BottomSheet>
  )
}
