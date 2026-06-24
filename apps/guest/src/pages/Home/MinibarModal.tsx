import { useState, useMemo } from 'react'
import { Modal } from '@glamping/ui'
import { mockMenuItems } from '@glamping/utils'
import type { TicketItem } from '@glamping/types'

type CartMap = Record<string, number>
type Step = 'edit' | 'success'
interface MinibarModalProps { open: boolean; onClose: () => void; onSubmit: (items: TicketItem[]) => void }

export function MinibarModal({ open, onClose, onSubmit }: MinibarModalProps) {
  const [cart, setCart] = useState<CartMap>({})
  const [step, setStep] = useState<Step>('edit')
  const minibarItems = useMemo(() => mockMenuItems.filter(i => i.category === 'minibar' && !i.hidden), [])
  const cartItems: TicketItem[] = useMemo(() => Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, quantity]) => { const item = mockMenuItems.find(m => m.id === id)!; return { menuItemId: id, name: item.name, price: item.price, quantity } }), [cart])
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const isEmpty = cartItems.length === 0
  function setQty(id: string, delta: number) { setCart(prev => { const next = { ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }; if (next[id] === 0) delete next[id]; return next }) }
  function handleClose() { setCart({}); setStep('edit'); onClose() }
  function handleSubmit() { onSubmit(cartItems); setStep('success') }

  return (
    <Modal open={open} onClose={handleClose} title="Минибар">
      {step === 'edit' && (
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {minibarItems.map(item => (
              <div key={item.id} className="flex bg-white dark:bg-[#1a1d27] border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-sm items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">{item.name}</h4>
                  {item.showPrice && <p className="text-sm text-gray-400 dark:text-white/40 mt-0.5">{item.price} ₽</p>}
                </div>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-white/10">
                  <button onClick={() => setQty(item.id, -1)} disabled={!cart[item.id]} className="w-10 h-10 flex justify-center items-center rounded-lg bg-white dark:bg-white/10 shadow-sm text-gray-600 dark:text-white/60 font-bold text-xl active:scale-95 disabled:opacity-30 transition-all">−</button>
                  <span className="w-6 text-center font-bold text-gray-800 dark:text-white">{cart[item.id] ?? 0}</span>
                  <button onClick={() => setQty(item.id, +1)} className="w-10 h-10 flex justify-center items-center rounded-lg bg-purple-600 text-white shadow-sm font-bold text-xl active:scale-95 transition-all">+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 space-y-3">
            {!isEmpty && <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-white/50">Позиций: {cartItems.reduce((s, i) => s + i.quantity, 0)}</span><span className="text-gray-800 dark:text-white font-bold">{totalPrice} ₽</span></div>}
            <button onClick={handleSubmit} disabled={isEmpty} className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-purple-700 active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed">Заказать</button>
          </div>
        </div>
      )}
      {step === 'success' && (
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
          <div><p className="text-gray-800 dark:text-white font-bold text-lg">Заказ принят!</p><p className="text-gray-500 dark:text-white/40 text-sm mt-1">Доставим в ближайшее время.</p></div>
          <button onClick={handleClose} className="w-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/60 py-3 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors active:scale-95">Закрыть</button>
        </div>
      )}
    </Modal>
  )
}
