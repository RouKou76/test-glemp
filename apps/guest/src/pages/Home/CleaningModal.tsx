import { useState } from 'react'
import { Modal } from '@glamping/ui'
import { SuccessScreen } from './SuccessScreen'

type Step = 'edit' | 'review' | 'success'
interface CleaningModalProps { open: boolean; onClose: () => void; onSubmit: (desiredAt: string) => void }

export function CleaningModal({ open, onClose, onSubmit }: CleaningModalProps) {
  const [step, setStep] = useState<Step>('edit')
  const [desiredAt, setDesiredAt] = useState('')
  const [error, setError] = useState('')

  function handleClose() { setStep('edit'); setDesiredAt(''); setError(''); onClose() }
  function validateAndNext() { if (!desiredAt) { setError('Укажите дату и время уборки'); return }; if (new Date(desiredAt) <= new Date()) { setError('Выберите время в будущем'); return }; setError(''); setStep('review') }
  function handleSubmit() { onSubmit(desiredAt); setStep('success') }

  const formattedDate = desiredAt ? new Date(desiredAt).toLocaleString('ru', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }) : ''

  return (
    <Modal open={open} onClose={handleClose} title="Заказ уборки">
      {step === 'edit' && (
        <div className="p-6 space-y-5">
          <p className="text-sm text-gray-600 dark:text-white/50">Выберите удобное время — мы проведём уборку домика.</p>
          <div>
            <p className="text-xs font-bold text-gray-600 dark:text-white/50 uppercase tracking-wider mb-2">Дата и время</p>
            <input type="datetime-local" value={desiredAt} onChange={e => { setDesiredAt(e.target.value); setError('') }}
              className="w-full p-4 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none [color-scheme:dark]" />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <button onClick={validateAndNext} disabled={!desiredAt} className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed">Далее</button>
        </div>
      )}
      {step === 'review' && (
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30">
            <p className="text-xs text-teal-600 dark:text-teal-400 mb-1">Время уборки</p>
            <p className="text-teal-800 dark:text-teal-300 font-semibold capitalize">{formattedDate}</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-white/50">Пожалуйста, будьте готовы освободить домик на время уборки.</p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={() => setStep('edit')} className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/60 py-3.5 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors active:scale-95">← Назад</button>
            <button onClick={handleSubmit} className="bg-teal-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-teal-700 transition-colors active:scale-95 shadow-sm">Подтвердить</button>
          </div>
        </div>
      )}
      {step === 'success' && <SuccessScreen title="Заявка принята!" message="Клининг будет проведён в указанное время." onClose={handleClose} />}
    </Modal>
  )
}
