import { ThemeToggle } from '@glamping/ui'

export default function Info() {
  return (
    <div className="p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Eco Glamp "Forest Haven"</h1>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1a1d27] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 transition-colors">
          <h3 className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Связь с администратором</h3>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">+7 (999) 123-45-67</p>
        </div>
        <div className="bg-white dark:bg-[#1a1d27] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 transition-colors">
          <h3 className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Wi-Fi Подключение</h3>
          <p className="text-base text-gray-800 dark:text-gray-200">Сеть: <strong>Glamp_Guest</strong></p>
          <p className="text-base text-gray-800 dark:text-gray-200">Пароль: <strong>forest2026</strong></p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1d27] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 mb-6 transition-colors">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">О нас</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
          Добро пожаловать в наш глэмпинг! Здесь вы сможете насладиться природой без отрыва от комфорта.
          Наша команда всегда готова помочь вам. Обратите внимание, что заказ еды необходимо делать минимум за 1 час.
        </p>
      </div>

      <div className="bg-glamp-50 dark:bg-glamp-900/30 p-6 rounded-3xl border border-glamp-100 dark:border-glamp-500/20 transition-colors">
        <h2 className="text-lg font-bold text-glamp-900 dark:text-glamp-100 mb-3">Наши услуги</h2>
        <p className="text-glamp-800 dark:text-glamp-200 leading-relaxed text-base">
          Мы предоставляем: питание по меню, услуги трансфера, уборку домиков, пополнение мини-бара и свежие полотенца по запросу.
        </p>
      </div>
    </div>
  )
}
