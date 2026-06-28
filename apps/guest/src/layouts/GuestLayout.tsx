import { Outlet, NavLink } from 'react-router-dom'
import { ThemeToggle } from '@glamping/ui'

export default function GuestLayout() {
  return (
    <div className="flex flex-col h-screen bg-glamp-50 dark:bg-[#0f1117] text-gray-800 dark:text-gray-200 overflow-hidden transition-colors">
      <main className="flex-1 overflow-y-auto pb-24 relative">
        <div className="fixed top-4 right-4 z-40">
          <ThemeToggle />
        </div>
        <Outlet />
      </main>

      <nav className="fixed bottom-0 w-full h-24 bg-white dark:bg-[#1a1d27] border-t border-gray-200 dark:border-white/10 flex justify-around items-center px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-none z-30 transition-colors">
        <NavLink to="/info" className={({ isActive }) => `flex flex-col items-center justify-center w-24 gap-1 transition-colors ${isActive ? 'text-glamp-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
          <span className="text-xs font-semibold">Информация</span>
        </NavLink>

        <div className="-mt-8">
          <NavLink to="/" end className={({ isActive }) => `w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-transform ${isActive ? 'bg-glamp-600 scale-110' : 'bg-gray-800 dark:bg-white/10 hover:bg-gray-700 dark:hover:bg-white/20'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
          </NavLink>
          <span className="block text-center text-xs font-medium text-gray-800 dark:text-gray-400 mt-1">Услуги</span>
        </div>

        <NavLink to="/chat" className={({ isActive }) => `flex flex-col items-center justify-center w-24 gap-1 transition-colors ${isActive ? 'text-glamp-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
          <span className="text-xs font-semibold">Связь</span>
        </NavLink>
      </nav>
    </div>
  )
}
