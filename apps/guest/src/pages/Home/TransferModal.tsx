import { useState } from 'react'
import { BottomSheet } from '@glamping/ui'
import { mockTransferDestinations } from '@glamping/utils'
import type { TransferDestination } from '@glamping/types'

type Step = 'edit' | 'review' | 'success'
interface TransferModalProps { open: boolean; onClose: () => void; onSubmit: (destination: TransferDestination, desiredAt: string) => void }

export function TransferModal({ open, onClose, onSubmit }: TransferModalProps) {
  const [step, setStep] = useState<Step>('edit')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [desiredAt, setDesiredAt] = useState('')
  const [timeError, setTimeError] = useState('')
  const selected = mockTransferDestinations.find(d => d.id === selectedId) ?? null

  function handleClose() { setStep('edit'); setSelectedId(null); setDesiredAt(''); setTimeError(''); onClose() }
  function validateAndNext() { if (!selected) return; if (!desiredAt) { setTimeError('Укажите желаемое время подачи'); return }; setTimeError(''); setStep('review') }
  function handleSubmit() { if (!selected) return; onSubmit(selected, desiredAt); setStep('success') }

  return (
    <BottomSheet open={open} onClose={handleClose} title="Трансфер">
      {step === 'edit' && (
        <div className="p-6 space-y-5">
          <div>
            <p className="text-xs font-bold text-gray-600 dark:text-white/50 uppercase tracking-wider mb-3">Направление</p>
            <div className="space-y-2">
              {mockTransferDestinations.map(dest => (
                <button key={dest.id} onClick={() => setSelectedId(dest.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors ${selectedId === dest.id ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-500 text-blue-800 dark:text-blue-400' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <span className="font-medium">{dest.name}</span>
                  <span className="text-sm text-gray-500 dark:text-white/60">{dest.price} ₽ · {dest.km} км</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-white/50 mt-2">Нет нужного направления? Напишите нам в чат.</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 dark:text-white/50 uppercase tracking-wider mb-2">Желаемое время подачи</p>
            <input type="datetime-local" value={desiredAt} onChange={e => { setDesiredAt(e.target.value); setTimeError('') }}
              className="w-full p-4 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none [color-scheme:dark]" />
            {timeError && <p className="text-xs text-red-500 mt-1">{timeError}</p>}
          </div>
          <button onClick={validateAndNext} disabled={!selected} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed">Далее</button>
        </div>
      )}
      {step === 'review' && selected && (
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {[['Направление', selected.name], ['Расстояние', `${selected.km} км`], ['Стоимость', `${selected.price} ₽`], ['Время подачи', new Date(desiredAt).toLocaleString('ru', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })]].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-white/10">
                <span className="text-gray-600 dark:text-white/50">{label}</span>
                <span className={`font-medium ${label === 'Стоимость' ? 'text-gray-800 dark:text-white font-bold' : 'text-gray-800 dark:text-white'}`}>{value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-white/50">Итоговая стоимость может отличаться. Точная цена — при выезде.</p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={() => setStep('edit')} className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/60 py-3.5 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors active:scale-95">← Назад</button>
            <button onClick={handleSubmit} className="bg-blue-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-blue-700 transition-colors active:scale-95 shadow-sm">Заказать трансфер</button>
          </div>
        </div>
      )}
      {step === 'success' && (
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
          <div><p className="text-gray-800 dark:text-white font-bold text-lg">Заявка принята!</p><p className="text-gray-600 dark:text-white/60 text-sm mt-1">Водитель будет подан к указанному времени.</p></div>
          <button onClick={handleClose} className="w-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/60 py-3 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors active:scale-95">Закрыть</button>
        </div>
      )}
    </BottomSheet>
  )
}
