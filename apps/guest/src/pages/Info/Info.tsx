import { useState } from 'react'
import { useTheme } from '@glamping/ui'

export default function Info() {
  const { theme, toggle } = useTheme()

  return (
    <div className="p-8 animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Eco Glamp "Forest Haven"</h1>
        <button onClick={toggle} className="p-2 rounded-full bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1a1d27] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 transition-colors">
          <h3 className="text-gray-500 dark:text-white/40 text-sm font-semibold mb-2 uppercase tracking-wider">Связь с администратором</h3>
          <p className="text-xl font-bold text-gray-800 dark:text-white">+7 (999) 123-45-67</p>
        </div>
        <div className="bg-white dark:bg-[#1a1d27] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 transition-colors">
          <h3 className="text-gray-500 dark:text-white/40 text-sm font-semibold mb-2 uppercase tracking-wider">Wi-Fi Подключение</h3>
          <p className="text-lg text-gray-800 dark:text-white">Сеть: <strong>Glamp_Guest</strong></p>
          <p className="text-lg text-gray-800 dark:text-white">Пароль: <strong>forest2026</strong></p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1d27] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 mb-8 transition-colors">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">О нас</h2>
        <p className="text-gray-600 dark:text-white/60 leading-relaxed text-lg">
          Добро пожаловать в наш глэмпинг! Здесь вы сможете насладиться природой без отрыва от комфорта.
          Наша команда всегда готова помочь вам. Обратите внимание, что заказ еды необходимо делать минимум за 1 час.
        </p>
      </div>

      <div className="bg-glamp-50 dark:bg-glamp-900/30 p-8 rounded-3xl border border-glamp-100 dark:border-glamp-500/20 transition-colors">
        <h2 className="text-xl font-bold text-glamp-900 dark:text-glamp-100 mb-4">Наши услуги</h2>
        <p className="text-glamp-800 dark:text-glamp-200 leading-relaxed text-lg">
          Мы предоставляем: питание по меню, услуги трансфера, уборку домиков, пополнение мини-бара и свежие полотенца по запросу.
        </p>
      </div>
    </div>
  )
}
