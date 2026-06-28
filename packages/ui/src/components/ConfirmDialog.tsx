import React from 'react'
import { Modal } from './Modal'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  variant?: 'danger' | 'primary'
  onConfirm: () => void
  onClose: () => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Подтвердить',
  variant = 'danger',
  onConfirm,
  onClose,
}) => {
  const btnClass = variant === 'danger'
    ? 'bg-red-500 hover:bg-red-600 text-white'
    : 'bg-glamp-600 hover:bg-glamp-700 text-white'

  return (
    <Modal open={open} onClose={onClose} title="">
      <div className="p-6 text-center space-y-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${variant === 'danger' ? 'bg-red-100 dark:bg-red-500/20 text-red-500' : 'bg-glamp-100 dark:bg-glamp-500/20 text-glamp-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        </div>
        <p className="text-gray-800 dark:text-gray-200 font-bold text-xl">{title}</p>
        <p className="text-gray-600 dark:text-gray-400 text-lg">{message}</p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button onClick={onClose}
            className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-400 py-3.5 rounded-2xl font-semibold text-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors active:scale-95">
            Отмена
          </button>
          <button onClick={onConfirm}
            className={`${btnClass} py-3.5 rounded-2xl font-semibold text-lg transition-colors active:scale-95 shadow-sm`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
