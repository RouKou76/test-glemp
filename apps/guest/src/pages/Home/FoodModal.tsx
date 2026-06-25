import { useState, useMemo } from 'react'
import { Modal } from '@glamping/ui'
import { mockMenuItems } from '@glamping/utils'
import type { ServiceLocation, TicketItem, MealPeriod } from '@glamping/types'
import { SuccessScreen } from './SuccessScreen'

const PERIOD_LABELS: Record<MealPeriod, string> = { breakfast: 'Завтрак', lunch: 'Обед', dinner: 'Ужин', none: 'Кухня закрыта' }
const LOCATION_OPTIONS: { value: ServiceLocation; label: string }[] = [
  { value: 'cabin', label: '🏠 В домик' }, { value: 'terrace', label: '🌿 На террасу' }, { value: 'gazebo', label: '⛺ В беседку' },
]
const MEAL_OPTIONS: { value: MealPeriod; label: string }[] = [
  { value: 'breakfast', label: '🌅 Завтрак' }, { value: 'lunch', label: '☀️ Обед' }, { value: 'dinner', label: '🌙 Ужин' },
]

type CartMap = Record<string, number>
type Step = 'edit' | 'review' | 'success'

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function tomorrowStr(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function computePeriodFromTime(time: string): MealPeriod {
  if (!time) return 'none'
  const [h, m] = time.split(':').map(Number)
  const min = h * 60 + m
  if (min >= 8 * 60 && min < 12 * 60) return 'breakfast'
  if (min >= 13 * 60 && min < 17 * 60) return 'lunch'
  if (min >= 19 * 60 && min < 23 * 60) return 'dinner'
  return 'none'
}

function getMinTime(dateStr: string): string {
  if (dateStr === todayStr()) {
    const now = new Date()
    now.setHours(now.getHours() + 1)
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  }
  return '00:00'
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const today = todayStr()
  const tomorrow = tomorrowStr()
  if (dateStr === today) return 'Сегодня'
  if (dateStr === tomorrow) return 'Завтра'
  return d.toLocaleDateString('ru', { day: '2-digit', month: 'long' })
}

interface FoodModalProps { open: boolean; onClose: () => void; onSubmit: (items: TicketItem[], location: ServiceLocation) => void }

export function FoodModal({ open, onClose, onSubmit }: FoodModalProps) {
  const [step, setStep] = useState<Step>('edit')
  const [orderDate, setOrderDate] = useState(todayStr)
  const [orderTime, setOrderTime] = useState('')
  const [manualPeriod, setManualPeriod] = useState<MealPeriod | null>(null)
  const [location, setLocation] = useState<ServiceLocation>('cabin')
  const [cart, setCart] = useState<CartMap>({})

  const selectedPeriod = manualPeriod ?? computePeriodFromTime(orderTime)
  const periodItems = useMemo(() => mockMenuItems.filter(item => item.category === selectedPeriod && !item.hidden), [selectedPeriod])

  const cartItems: TicketItem[] = useMemo(() =>
    Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, quantity]) => {
      const item = mockMenuItems.find(m => m.id === id)!
      return { menuItemId: id, name: item.name, price: item.price, quantity }
    }), [cart])

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const isEmpty = cartItems.length === 0

  const timeValid = useMemo(() => {
    if (!orderTime) return false
    const minTime = getMinTime(orderDate)
    return orderTime >= minTime
  }, [orderTime, orderDate])

  const canProceed = orderDate && orderTime && timeValid && selectedPeriod !== 'none'

  function setQty(id: string, delta: number) {
    setCart(prev => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }
      if (next[id] === 0) delete next[id]
      return next
    })
  }

  function handleClose() {
    setStep('edit')
    setOrderDate(todayStr())
    setOrderTime('')
    setManualPeriod(null)
    setLocation('cabin')
    setCart({})
    onClose()
  }

  function handleSubmit() { onSubmit(cartItems, location); setStep('success') }

  return (
    <Modal open={open} onClose={handleClose} title="Заказ питания">
      {step === 'edit' && (
        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-600 dark:text-white/50 uppercase tracking-wider mb-2 block">Дата</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setOrderDate(todayStr())}
                className={`py-3 rounded-xl text-sm font-semibold border transition-colors ${orderDate === todayStr() ? 'bg-glamp-600 border-glamp-600 text-white' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                Сегодня
              </button>
              <button onClick={() => setOrderDate(tomorrowStr())}
                className={`py-3 rounded-xl text-sm font-semibold border transition-colors ${orderDate === tomorrowStr() ? 'bg-glamp-600 border-glamp-600 text-white' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                Завтра
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 dark:text-white/50 uppercase tracking-wider mb-2 block">Время подачи</label>
            <input type="time" value={orderTime} min={getMinTime(orderDate)}
              onChange={e => { setOrderTime(e.target.value); setManualPeriod(null) }}
              className="w-full p-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-glamp-500 [color-scheme:dark]" />
            {orderTime && !timeValid && (
              <p className="text-xs text-red-500 mt-1">Минимум за 1 час до текущего времени</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 dark:text-white/50 uppercase tracking-wider mb-2 block">Приём пищи</label>
            <div className="grid grid-cols-3 gap-2">
              {MEAL_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setManualPeriod(opt.value)}
                  className={`py-3 rounded-xl text-sm font-semibold border transition-colors ${selectedPeriod === opt.value ? 'bg-glamp-600 border-glamp-600 text-white' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
            {manualPeriod && (
              <p className="text-xs text-gray-500 dark:text-white/40 mt-1">Авто-выбор по времени: {PERIOD_LABELS[computePeriodFromTime(orderTime)]}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 dark:text-white/50 uppercase tracking-wider mb-2 block">Место подачи</label>
            <div className="grid grid-cols-3 gap-2">
              {LOCATION_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setLocation(opt.value)}
                  className={`py-3 rounded-xl text-sm font-semibold border transition-colors ${location === opt.value ? 'bg-glamp-600 border-glamp-600 text-white' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {selectedPeriod !== 'none' && periodItems.length > 0 && (
            <div>
              <label className="text-xs font-bold text-gray-600 dark:text-white/50 uppercase tracking-wider mb-3 block">Меню — {PERIOD_LABELS[selectedPeriod]}</label>
              <div className="space-y-3">
                {periodItems.map(item => (
                  <div key={item.id} className="flex bg-white dark:bg-[#1a1d27] border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-sm items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">{item.name}</h4>
                      {item.showPrice && <p className="text-sm text-gray-500 dark:text-white/60 mt-0.5">{item.price} ₽</p>}
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-white/10">
                      <button onClick={() => setQty(item.id, -1)} disabled={!cart[item.id]}
                        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white dark:bg-white/10 shadow-sm text-gray-600 dark:text-white/60 font-bold text-xl active:scale-95 disabled:opacity-30 transition-all">−</button>
                      <span className="w-6 text-center font-bold text-gray-800 dark:text-white">{cart[item.id] ?? 0}</span>
                      <button onClick={() => setQty(item.id, +1)}
                        className="w-10 h-10 flex justify-center items-center rounded-lg bg-glamp-600 text-white shadow-sm font-bold text-xl active:scale-95 transition-all">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPeriod === 'none' && orderTime && (
            <div className="text-center py-6 text-gray-500 dark:text-white/40">
              <div className="text-4xl mb-3">🌙</div>
              <p className="text-sm">Кухня не работает в это время</p>
              <p className="text-xs mt-1">Завтрак: 08:00–12:00 · Обед: 13:00–17:00 · Ужин: 19:00–23:00</p>
            </div>
          )}

          <div className="pt-2 space-y-3">
            {!isEmpty && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-white/50">Позиций: {cartItems.reduce((s, i) => s + i.quantity, 0)}</span>
                <span className="text-gray-800 dark:text-white font-bold">{totalPrice} ₽</span>
              </div>
            )}
            <button onClick={() => setStep('review')} disabled={!canProceed || isEmpty}
              className="w-full bg-glamp-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-glamp-700 active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed">
              Далее
            </button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-white/10">
              <span className="text-gray-600 dark:text-white/50">Дата</span>
              <span className="text-gray-800 dark:text-white font-medium">{formatDisplayDate(orderDate)}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-white/10">
              <span className="text-gray-600 dark:text-white/50">Время</span>
              <span className="text-gray-800 dark:text-white font-medium">{orderTime}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-white/10">
              <span className="text-gray-600 dark:text-white/50">Приём пищи</span>
              <span className="text-gray-800 dark:text-white font-medium">{PERIOD_LABELS[selectedPeriod]}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-white/10">
              <span className="text-gray-600 dark:text-white/50">Место</span>
              <span className="text-gray-800 dark:text-white font-medium">{LOCATION_OPTIONS.find(o => o.value === location)?.label}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-600 dark:text-white/50 uppercase tracking-wider">Блюда</p>
            {cartItems.map(item => (
              <div key={item.menuItemId} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-white/10">
                <span className="text-gray-800 dark:text-white">{item.name} × {item.quantity}</span>
                <span className="text-gray-600 dark:text-white/50">{item.price * item.quantity} ₽</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm font-bold pt-1 text-gray-800 dark:text-white">
            <span>Итого</span><span>{totalPrice} ₽</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={() => setStep('edit')}
              className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/60 py-3.5 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors active:scale-95">← Назад</button>
            <button onClick={handleSubmit}
              className="bg-glamp-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-glamp-700 transition-colors active:scale-95 shadow-sm">Отправить заказ</button>
          </div>
        </div>
      )}

      {step === 'success' && <SuccessScreen title="Заказ принят!" message="Мы приготовим и доставим ваш заказ." onClose={handleClose} />}
    </Modal>
  )
}
