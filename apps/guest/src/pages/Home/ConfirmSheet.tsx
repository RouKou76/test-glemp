import { useState } from 'react'
import { BottomSheet } from '@glamping/ui'
import { SuccessScreen } from './SuccessScreen'

export interface ConfirmSheetConfig {
  title: string
  description: string
  confirmLabel: string
  successMessage: string
  icon: React.ReactNode
}

export const CONFIRM_CONFIGS: Record<string, ConfirmSheetConfig> = {
  towels: {
    title: 'Замена полотенец', description: 'Мы принесём свежие полотенца в ближайшее время.',
    confirmLabel: 'Запросить', successMessage: 'Заявка принята! Полотенца будут доставлены.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>,
  },
  gates: {
    title: 'Открыть ворота', description: 'Отправить запрос администратору на открытие ворот.',
    confirmLabel: 'Отправить запрос', successMessage: 'Запрос отправлен! Ожидайте подтверждения.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>,
  },
}

export type ConfirmSheetType = keyof typeof CONFIRM_CONFIGS

interface ConfirmSheetProps { open: boolean; type: ConfirmSheetType; onClose: () => void; onConfirm: (type: ConfirmSheetType) => void }

export function ConfirmSheet({ open, type, onClose, onConfirm }: ConfirmSheetProps) {
  const [step, setStep] = useState<'confirm' | 'success'>('confirm')
  const config = CONFIRM_CONFIGS[type]

  function handleConfirm() { onConfirm(type); setStep('success') }
  function handleClose() { setStep('confirm'); onClose() }

  return (
    <BottomSheet open={open} onClose={handleClose} title={step === 'confirm' ? config.title : undefined}>
      {step === 'confirm' ? (
        <div className="p-5 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-glamp-100 dark:bg-glamp-500/20 rounded-full flex items-center justify-center text-glamp-600 dark:text-green-400 mx-auto mb-3">{config.icon}</div>
            <p className="text-gray-600 dark:text-gray-400">{config.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleClose} className="flex-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-400 py-3 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors active:scale-95 text-sm">Отмена</button>
            <button onClick={handleConfirm} className="flex-1 bg-glamp-600 text-white py-3 rounded-2xl font-semibold hover:bg-glamp-700 transition-colors active:scale-95 shadow-sm text-sm">{config.confirmLabel}</button>
          </div>
        </div>
      ) : (
        <SuccessScreen title="Готово!" message={config.successMessage} onClose={handleClose} />
      )}
    </BottomSheet>
  )
}
