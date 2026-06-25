import { useState } from 'react'
import { mockServices } from '@glamping/utils'
import type { TicketItem, ServiceLocation, Service } from '@glamping/types'
import { ServiceTile } from './ServiceTile'
import { ConfirmSheet, type ConfirmSheetType } from './ConfirmSheet'
import { FoodModal } from './FoodModal'
import { MinibarModal } from './MinibarModal'
import { TransferModal } from './TransferModal'
import { CleaningModal } from './CleaningModal'
import { CustomServiceModal } from './CustomServiceModal'
import type { TransferDestination } from '@glamping/types'

type ActiveModal = ConfirmSheetType | 'food' | 'minibar' | 'transfer' | 'cleaning' | null

const SERVICE_COLORS: Record<string, string> = {
  cs1: 'bg-amber-500',
  cs2: 'bg-emerald-500',
}

export default function Home() {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [activeService, setActiveService] = useState<Service | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const isConfirmType = (m: ActiveModal): m is ConfirmSheetType => m === 'towels' || m === 'gates'

  function handleConfirm(type: ConfirmSheetType) { showToast(type === 'towels' ? 'Замена полотенец заказана' : 'Запрос на ворота отправлен') }
  function handleFoodSubmit(_items: TicketItem[], _location: ServiceLocation) { showToast('Заказ еды оформлен') }
  function handleMinibarSubmit(_items: TicketItem[]) { showToast('Заказ из минибара оформлен') }
  function handleTransferSubmit(_destination: TransferDestination, _desiredAt: string) { showToast('Трансфер заказан') }
  function handleCleaningSubmit(_desiredAt: string) { showToast('Клининг запланирован') }
  function handleCustomServiceSubmit(data: { serviceId: string }) {
    const service = mockServices.find(s => s.id === data.serviceId)
    showToast(`Заявка «${service?.name ?? 'Услуга'}» отправлена`)
  }

  const activeServices = mockServices.filter(s => s.active)

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Заказ услуг</h1>
      <p className="text-gray-500 dark:text-white/60 mb-8">Домик №1</p>

      <div className="grid grid-cols-2 gap-6 animate-slide-up">
        <ServiceTile icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>} label="Заказ питания" color="bg-orange-500" onClick={() => setActiveModal('food')} />
        <ServiceTile icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>} label="Трансфер" color="bg-blue-500" onClick={() => setActiveModal('transfer')} />
        <ServiceTile icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>} label="Вызов клининга" color="bg-teal-500" onClick={() => setActiveModal('cleaning')} />
        <ServiceTile icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>} label="Замена полотенец" color="bg-cyan-500" onClick={() => setActiveModal('towels')} />
        <ServiceTile icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>} label="Пополнение мини-бара" color="bg-purple-500" onClick={() => setActiveModal('minibar')} />

        <div onClick={() => setActiveModal('gates')}
          className="bg-glamp-600 text-white rounded-3xl p-6 shadow-md cursor-pointer hover:bg-glamp-700 transition-all active:scale-95 flex flex-col justify-between h-40 group relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10 transform group-hover:scale-110 transition-transform">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
          </div>
          <div className="p-3 bg-white/20 rounded-2xl w-fit text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg></div>
          <h3 className="text-xl font-bold">Открыть ворота</h3>
        </div>

        {activeServices.map(service => (
          <ServiceTile
            key={service.id}
            icon={<span className="text-2xl">{service.icon ?? '✨'}</span>}
            label={service.name}
            sublabel={service.price}
            color={SERVICE_COLORS[service.id] ?? 'bg-gray-600'}
            onClick={() => setActiveService(service)}
          />
        ))}
      </div>

      {isConfirmType(activeModal) && <ConfirmSheet open={true} type={activeModal} onClose={() => setActiveModal(null)} onConfirm={handleConfirm} />}
      {activeModal === 'food' && <FoodModal open={true} onClose={() => setActiveModal(null)} onSubmit={handleFoodSubmit} />}
      {activeModal === 'minibar' && <MinibarModal open={true} onClose={() => setActiveModal(null)} onSubmit={handleMinibarSubmit} />}
      {activeModal === 'transfer' && <TransferModal open={true} onClose={() => setActiveModal(null)} onSubmit={handleTransferSubmit} />}
      {activeModal === 'cleaning' && <CleaningModal open={true} onClose={() => setActiveModal(null)} onSubmit={handleCleaningSubmit} />}
      {activeService && <CustomServiceModal open={true} service={activeService} onClose={() => setActiveService(null)} onSubmit={handleCustomServiceSubmit} />}

      {toast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-3 rounded-full shadow-2xl font-medium animate-slide-up z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
