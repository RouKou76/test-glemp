import { createContext, useContext, useState, type ReactNode } from 'react'

export interface GlampInfo {
  phone: string
  wifiName: string
  wifiPassword: string
  rules: string
  description: string
  servicesText: string
}

const DEFAULT_INFO: GlampInfo = {
  phone: '+7 (999) 123-45-67',
  wifiName: 'Glamp_Guest',
  wifiPassword: 'forest2026',
  rules: '• Тихий час с 23:00 до 8:00\n• Курение только в отведённых местах\n• Выезд до 12:00',
  description: 'Добро пожаловать в наш глэмпинг! Здесь вы сможете насладиться природой без отрыва от комфорта. Наша команда всегда готова помочь вам. Обратите внимание, что заказ еды необходимо делать минимум за 1 час.',
  servicesText: 'Мы предоставляем: питание по меню, услуги трансфера, уборку домиков, пополнение мини-бара и свежие полотенца по запросу.',
}

interface GlampInfoContextType {
  info: GlampInfo
  updateInfo: (patch: Partial<GlampInfo>) => void
}

const GlampInfoContext = createContext<GlampInfoContextType>({
  info: DEFAULT_INFO,
  updateInfo: () => {},
})

export function GlampInfoProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<GlampInfo>(() => {
    try {
      const saved = localStorage.getItem('glamp-info')
      return saved ? { ...DEFAULT_INFO, ...JSON.parse(saved) } : DEFAULT_INFO
    } catch { return DEFAULT_INFO }
  })

  function updateInfo(patch: Partial<GlampInfo>) {
    setInfo(prev => {
      const next = { ...prev, ...patch }
      localStorage.setItem('glamp-info', JSON.stringify(next))
      return next
    })
  }

  return (
    <GlampInfoContext.Provider value={{ info, updateInfo }}>
      {children}
    </GlampInfoContext.Provider>
  )
}

export function useGlampInfo() {
  return useContext(GlampInfoContext)
}
