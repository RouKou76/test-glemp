import { useState, useMemo } from 'react'
import { BottomSheet } from '@glamping/ui'
import { mockMenuItems } from '@glamping/utils'
import type { ServiceLocation, TicketItem, MealPeriod } from '@glamping/types'
import { useMealPeriod } from '@/hooks/useMealPeriod'

const PERIOD_LABELS: Record<MealPeriod, string> = { breakfast: 'Завтрак', lunch: 'Обед', dinner: 'Ужин', none: 'Кухня закрыта' }
const LOCATION_OPTIONS: { value: ServiceLocation; label: string }[] = [
  { value: 'cabin', label: '🏠 В домик' }, { value: 'terrace', label: '🌿 На террасу' }, { value: 'gazebo', label: '⛺ В беседку' },
]
type CartMap = Record<string, number>
interface FoodModalProps { open: boolean; onClose: () => void; onSubmit: (items: TicketItem[], location: ServiceLocation) => void }
type Step = 'edit' | 'review' | 'success'

export function FoodModal({ open, onClose, onSubmit }: FoodModalProps) {
  const { currentPeriod, isInBuffer, nextPeriod, bufferEndsAt } = useMealPeriod()
  const [cart, setCart] = useState<CartMap>({})
  const [location, setLocation] = useState<ServiceLocation>('cabin')
  const [step, setStep] = useState<Step>('edit')

  const periodItems = useMemo(() => mockMenuItems.filter(item => item.category === currentPeriod && !item.hidden), [currentPeriod])
  const cartItems: TicketItem[] = useMemo(() => Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, quantity]) => { const item = mockMenuItems.find(m => m.id === id)!; return { menuItemId: id, name: item.name, price: item.price, quantity } }), [cart])
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const isEmpty = cartItems.length === 0

  function setQty(id: string, delta: number) { setCart(prev => { const next = { ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }; if (next[id] === 0) delete next[id]; return next }) }
  function handleClose() { setCart({}); setStep('edit'); onClose() }
  function handleSubmit() { onSubmit(cartItems, location); setStep('success') }

  return (
    <BottomSheet open={open} onClose={handleClose} title={PERIOD_LABELS[currentPeriod]}>
      {isInBuffer && bufferEndsAt && step === 'edit' && (
        <div className="mx-6 mb-4 p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30">
          <p className="text-sm text-orange-700 dark:text-orange-400">⏱ {PERIOD_LABELS[currentPeriod]} заканчивается в {bufferEndsAt.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}.{nextPeriod !== 'none' && ` Следующий период: ${PERIOD_LABELS[nextPeriod]}.`}</p>
        </div>
      )}
      {currentPeriod === 'none' && (
        <div className="text-center py-10 text-gray-500 dark:text-white/60 px-6">
          <div className="text-5xl mb-4">🌙</div>
          <p className="font-medium text-gray-600 dark:text-white/60">Кухня сейчас закрыта</p>
          <p className="text-sm mt-2">Завтрак: 08:00–10:00 · Обед: 13:00–15:00 · Ужин: 19:00–21:00</p>
        </div>
      )}
      {step === 'edit' && currentPeriod !== 'none' && (
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 p-4 rounded-xl text-sm border border-blue-100 dark:border-blue-500/30">Внимание: выполнение заказа занимает 1 час. Пожалуйста, выбирайте время с учетом этого.</div>
          <div className="space-y-3">
            {periodItems.map(item => (
              <div key={item.id} className="flex bg-white dark:bg-[#1a1d27] border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-sm items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">{item.name}</h4>
                  {item.showPrice && <p className="text-sm text-gray-500 dark:text-white/60 mt-0.5">{item.price} ₽</p>}
                </div>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-white/10">
                  <button onClick={() => setQty(item.id, -1)} disabled={!cart[item.id]} className="w-10 h-10 flex justify-center items-center rounded-lg bg-white dark:bg-white/10 shadow-sm text-gray-600 dark:text-white/60 font-bold text-xl active:scale-95 disabled:opacity-30 transition-all">−</button>
                  <span className="w-6 text-center font-bold text-gray-800 dark:text-white">{cart[item.id] ?? 0}</span>
                  <button onClick={() => setQty(item.id, +1)} className="w-10 h-10 flex justify-center items-center rounded-lg bg-glamp-600 text-white shadow-sm font-bold text-xl active:scale-95 transition-all">+</button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 dark:text-white/50 uppercase tracking-wider mb-2">Место подачи</p>
            <div className="grid grid-cols-3 gap-2">
              {LOCATION_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setLocation(opt.value)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors text-center ${location === opt.value ? 'bg-glamp-600 border-glamp-600 text-white' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-2 space-y-3">
            {!isEmpty && <div className="flex justify-between text-sm"><span className="text-gray-600 dark:text-white/50">Позиций: {cartItems.reduce((s, i) => s + i.quantity, 0)}</span><span className="text-gray-800 dark:text-white font-bold">{totalPrice} ₽</span></div>}
            <button onClick={() => setStep('review')} disabled={isEmpty} className="w-full bg-glamp-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-glamp-700 active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed">Перейти к подтверждению</button>
          </div>
        </div>
      )}
      {step === 'review' && (
        <div className="p-6 space-y-4">
          <div className="space-y-2">{cartItems.map(item => (<div key={item.menuItemId} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-white/10"><span className="text-gray-800 dark:text-white">{item.name} × {item.quantity}</span><span className="text-gray-600 dark:text-white/50">{item.price * item.quantity} ₽</span></div>))}</div>
          <div className="flex justify-between text-sm font-bold pt-1 text-gray-800 dark:text-white"><span>Итого</span><span>{totalPrice} ₽</span></div>
          <p className="text-sm text-gray-500 dark:text-white/60">Место: {LOCATION_OPTIONS.find(o => o.value === location)?.label}</p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={() => setStep('edit')} className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/60 py-3.5 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors active:scale-95">← Назад</button>
            <button onClick={handleSubmit} className="bg-glamp-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-glamp-700 transition-colors active:scale-95 shadow-sm">Отправить заказ</button>
          </div>
        </div>
      )}
      {step === 'success' && (
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
          <div><p className="text-gray-800 dark:text-white font-bold text-lg">Заказ принят!</p><p className="text-gray-600 dark:text-white/60 text-sm mt-1">Мы приготовим и доставим ваш заказ.</p></div>
          <button onClick={handleClose} className="w-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/60 py-3 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors active:scale-95">Закрыть</button>
        </div>
      )}
    </BottomSheet>
  )
}
