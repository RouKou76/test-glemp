import { useState } from 'react'
import { mockServices } from '@glamping/utils'
import type { Service, AssignedRole, ServiceFieldConfig } from '@glamping/types'

const ROLE_LABELS: Record<AssignedRole, string> = { cook: '👨‍🍳 Повар', cleaning: '🧹 Клининг', driver: '🚗 Водитель', admin: '👤 Администратор' }
const FIELD_LABELS: Record<keyof ServiceFieldConfig, string> = { desiredAt: '⏱ Время', location: '📍 Место', catalog: '📋 Каталог', geo: '🗺 Адрес', guestCount: '👥 Персоны', comment: '💬 Комментарий' }
type ServiceFields = Required<ServiceFieldConfig>
const DEFAULT_FIELDS: ServiceFields = { desiredAt: { enabled: false }, location: { enabled: false }, catalog: { enabled: false }, geo: { enabled: false }, guestCount: { enabled: false }, comment: { enabled: false } }

export default function Services() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [showForm, setShowForm] = useState(false); const [editService, setEditService] = useState<Service | null>(null)
  const [formName, setFormName] = useState(''); const [formPrice, setFormPrice] = useState(''); const [formIcon, setFormIcon] = useState('')
  const [formRole, setFormRole] = useState<AssignedRole>('admin'); const [formFields, setFormFields] = useState<ServiceFields>(DEFAULT_FIELDS)

  function openAdd() { setEditService(null); setFormName(''); setFormPrice(''); setFormIcon(''); setFormRole('admin'); setFormFields(DEFAULT_FIELDS); setShowForm(true) }
  function openEdit(service: Service) { setEditService(service); setFormName(service.name); setFormPrice(service.price ?? ''); setFormIcon(service.icon ?? ''); setFormRole(service.assignedTo); setFormFields({ desiredAt: service.fields.desiredAt ?? { enabled: false }, location: service.fields.location ?? { enabled: false }, catalog: service.fields.catalog ?? { enabled: false }, geo: service.fields.geo ?? { enabled: false }, guestCount: service.fields.guestCount ?? { enabled: false }, comment: service.fields.comment ?? { enabled: false } }); setShowForm(true) }
  function toggleField(key: keyof ServiceFieldConfig) { setFormFields(prev => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } })) }
  function handleSave() {
    if (!formName.trim()) return
    if (editService) { setServices(prev => prev.map(s => s.id === editService.id ? { ...s, name: formName.trim(), price: formPrice || undefined, icon: formIcon || undefined, assignedTo: formRole, fields: formFields } : s)) }
    else { setServices(prev => [...prev, { id: `cs-${Date.now()}`, name: formName.trim(), price: formPrice || undefined, icon: formIcon || undefined, active: true, assignedTo: formRole, fields: formFields }]) }
    setShowForm(false)
  }
  function toggleActive(id: string) { setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s)) }
  function handleDelete(id: string) { setServices(prev => prev.filter(s => s.id !== id)) }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Услуги</h2>
        <button onClick={openAdd} className="px-4 py-2 bg-glamp-600 text-white text-xs font-bold rounded-xl hover:bg-glamp-700 transition-colors active:scale-95">+ Добавить</button>
      </div>
      <div className="space-y-3">
        {services.length === 0 ? (<div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-white/20"><p className="text-4xl mb-3">⚡</p><p className="text-sm">Нет услуг</p></div>) : services.map(service => (
          <div key={service.id} className={`bg-white dark:bg-[#1a1d27] border rounded-2xl p-4 space-y-3 shadow-sm transition-opacity ${service.active ? 'border-gray-100 dark:border-white/10' : 'border-gray-100 dark:border-white/5 opacity-50'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{service.icon ?? '⚡'}</span>
                <div><p className="text-sm font-bold text-gray-800 dark:text-white">{service.name}</p><p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">{service.price ?? 'Цена не указана'} · {ROLE_LABELS[service.assignedTo]}</p></div>
              </div>
              <button onClick={() => toggleActive(service.id)} className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${service.active ? 'bg-glamp-600' : 'bg-gray-300 dark:bg-white/10'}`}><span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${service.active ? 'left-6' : 'left-1'}`} /></button>
            </div>
            {Object.entries(service.fields).filter(([, f]) => f?.enabled).map(([key, f]) => (<div key={key} className="text-xs text-gray-500 dark:text-white/60 flex items-center gap-2"><span>{FIELD_LABELS[key as keyof ServiceFieldConfig]}</span>{f?.label && <span className="text-gray-400 dark:text-white/20">→ «{f.label}»</span>}</div>))}
            <div className="flex gap-2 pt-1">
              <button onClick={() => openEdit(service)} className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">✏️ Редактировать</button>
              <button onClick={() => handleDelete(service.id)} className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-500/20 text-red-400 dark:text-red-400/60 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">🗑</button>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-end" onClick={() => setShowForm(false)}>
          <div className="w-full bg-gray-50 dark:bg-[#1a1d27] rounded-t-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{editService ? 'Редактировать услугу' : 'Новая услуга'}</h3>
            <div><label className="text-xs font-bold text-gray-600 dark:text-white/60 mb-1 block">Название</label><input type="text" value={formName} onChange={e => setFormName(e.target.value)} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-glamp-500" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-bold text-gray-600 dark:text-white/60 mb-1 block">Иконка</label><input type="text" value={formIcon} onChange={e => setFormIcon(e.target.value)} placeholder="🚲" className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-glamp-500" /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-white/60 mb-1 block">Цена</label><input type="text" value={formPrice} onChange={e => setFormPrice(e.target.value)} placeholder="500 ₽ / час" className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-glamp-500" /></div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 dark:text-white/60 mb-2 block">Ответственный</label>
              <div className="grid grid-cols-2 gap-2">{(Object.entries(ROLE_LABELS) as [AssignedRole, string][]).map(([role, label]) => (<button key={role} onClick={() => setFormRole(role)} className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors text-left ${formRole === role ? 'bg-glamp-600 border-glamp-600 text-white' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5'}`}>{label}</button>))}</div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 dark:text-white/60 mb-2 block">Поля для гостя</label>
              <div className="space-y-2">{(Object.entries(FIELD_LABELS) as [keyof ServiceFieldConfig, string][]).map(([key, label]) => (<div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5"><span className="text-sm text-gray-600 dark:text-white/60">{label}</span><button onClick={() => toggleField(key)} className={`w-11 h-6 rounded-full transition-colors relative ${formFields[key].enabled ? 'bg-glamp-600' : 'bg-gray-300 dark:bg-white/10'}`}><span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formFields[key].enabled ? 'left-6' : 'left-1'}`} /></button></div>))}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Отмена</button>
              <button onClick={handleSave} disabled={!formName.trim()} className="py-2.5 rounded-xl bg-glamp-600 hover:bg-glamp-700 disabled:opacity-30 text-white text-sm font-bold transition-colors active:scale-95">{editService ? 'Сохранить' : 'Создать'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
