import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { ConnectionBanner, ThemeToggle } from '@glamping/ui'
import type { ConnectionStatus } from '@glamping/ui'
import { GateAlertBanner } from './GateAlertBanner'

const connectionStatus: ConnectionStatus = 'connected'

interface GateRequest {
  houseId: string
  houseNumber: number
}

export default function AdminLayout() {
  const [gateRequest, setGateRequest] = useState<GateRequest | null>(null)

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-800 dark:text-white overflow-hidden transition-colors">
      <ConnectionBanner status={connectionStatus} />

      {gateRequest && (
        <GateAlertBanner
          houseNumber={gateRequest.houseNumber}
          onConfirm={() => setGateRequest(null)}
          onDismiss={() => setGateRequest(null)}
        />
      )}

      <header className="px-4 py-3 bg-white dark:bg-[#1a1d27] border-b border-gray-200 dark:border-white/10 shrink-0 transition-colors">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-gray-800 dark:text-white">Glamping · Администратор</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="flex border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1d27] shrink-0 transition-colors">
        {[
          { to: '/', label: 'Заявки', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>, end: true },
          { to: '/chats', label: 'Чат', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>, end: false },
          { to: '/menu', label: 'Меню', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>, end: false },
          { to: '/checkin', label: 'Домики', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, end: false },
          { to: '/services', label: 'Услуги', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>, end: false },
        ].map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-bold transition-colors ${isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-white/60'}`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
