import { useState, useMemo } from 'react'
import { mockMenuItems } from '@glamping/utils'
import type { MenuItem, MenuCategory } from '@glamping/types'
import { ConfirmDialog } from '@glamping/ui'

type CategoryFilter = MenuCategory | 'all'
const CATEGORY_LABELS: Record<MenuCategory, string> = { breakfast: 'Завтрак', lunch: 'Обед', dinner: 'Ужин', minibar: 'Минибар' }

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems)
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const [formName, setFormName] = useState(''); const [formPrice, setFormPrice] = useState('')
  const [formCategory, setFormCategory] = useState<MenuCategory>('breakfast'); const [formShowPrice, setFormShowPrice] = useState(true)

  const filtered = useMemo(() => items.filter(i => category === 'all' || i.category === category), [items, category])
  function openAdd() { setEditItem(null); setFormName(''); setFormPrice(''); setFormCategory('breakfast'); setFormShowPrice(true); setShowForm(true) }
  function openEdit(item: MenuItem) { setEditItem(item); setFormName(item.name); setFormPrice(String(item.price)); setFormCategory(item.category); setFormShowPrice(item.showPrice); setShowForm(true) }
  const [formErrors, setFormErrors] = useState<{ name?: string; price?: string }>({})
  function handleSave() {
    const errs: { name?: string; price?: string } = {}
    if (!formName.trim()) errs.name = 'Введите название'
    const price = Number(formPrice)
    if (!formPrice || isNaN(price) || price < 0) errs.price = 'Укажите корректную цену'
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }
    setFormErrors({})
    if (editItem) { setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, name: formName.trim(), price, category: formCategory, showPrice: formShowPrice } : i)) }
    else { setItems(prev => [...prev, { id: `m-${Date.now()}`, name: formName.trim(), price, category: formCategory, hidden: false, showPrice: formShowPrice }]) }
    setShowForm(false)
  }
  function toggleHidden(id: string) { setItems(prev => prev.map(i => i.id === id ? { ...i, hidden: !i.hidden } : i)) }
  const [deleteId, setDeleteId] = useState<string | null>(null)
  function handleDeleteConfirm() { if (deleteId) setItems(prev => prev.filter(i => i.id !== deleteId)); setDeleteId(null) }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Меню F&B</h2>
        <button onClick={openAdd} className="px-4 py-2 bg-glamp-600 text-white text-xs font-bold rounded-xl hover:bg-glamp-700 transition-colors active:scale-95">+ Добавить</button>
      </div>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {([['all', 'Все'], ...Object.entries(CATEGORY_LABELS)] as [CategoryFilter, string][]).map(([val, label]) => (
          <button key={val} onClick={() => setCategory(val)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${category === val ? 'bg-glamp-600 border-glamp-600 text-white' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5'}`}>{label}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.length === 0 ? (<div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-white/20"><p className="text-4xl mb-3">🍽</p><p className="text-sm">Нет позиций</p></div>) : filtered.map(item => (
          <div key={item.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-opacity ${item.hidden ? 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 opacity-60' : 'border-gray-100 dark:border-white/10 bg-white dark:bg-[#1a1d27] shadow-sm'}`}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.name}</p>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">{CATEGORY_LABELS[item.category]} · {item.showPrice ? `${item.price} ₽` : 'Цена скрыта'}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggleHidden(item.id)} className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-1">
                {item.hidden ? 'Показать' : 'Скрыть'}
              </button>
              <button onClick={() => openEdit(item)} className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              </button>
              <button onClick={() => setDeleteId(item.id)} className="text-xs px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-500/20 text-red-400 dark:text-red-400/60 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-end" onClick={() => setShowForm(false)}>
          <div className="w-full bg-gray-50 dark:bg-[#1a1d27] rounded-t-3xl p-6 space-y-4 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{editItem ? 'Редактировать блюдо' : 'Новое блюдо'}</h3>
            <div><label className="text-sm font-bold text-gray-600 dark:text-white/60 mb-1 block">Название *</label><input type="text" value={formName} onChange={e => { setFormName(e.target.value); setFormErrors(p => ({ ...p, name: undefined })) }} className={`w-full bg-white dark:bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-glamp-500 ${formErrors.name ? 'border-red-400' : 'border-gray-200 dark:border-white/10'}`} />{formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}</div>
            <div><label className="text-sm font-bold text-gray-600 dark:text-white/60 mb-1 block">Цена (₽) *</label><input type="number" value={formPrice} onChange={e => { setFormPrice(e.target.value); setFormErrors(p => ({ ...p, price: undefined })) }} min={0} className={`w-full bg-white dark:bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-glamp-500 ${formErrors.price ? 'border-red-400' : 'border-gray-200 dark:border-white/10'}`} />{formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}</div>
            <div>
              <label className="text-xs font-bold text-gray-600 dark:text-white/60 mb-2 block">Категория</label>
              <div className="grid grid-cols-2 gap-2">{(Object.entries(CATEGORY_LABELS) as [MenuCategory, string][]).map(([val, label]) => (<button key={val} onClick={() => setFormCategory(val)} className={`py-2 rounded-xl text-xs font-medium border transition-colors ${formCategory === val ? 'bg-glamp-600 border-glamp-600 text-white' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5'}`}>{label}</button>))}</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-white/70">Показывать цену гостям</span>
              <button onClick={() => setFormShowPrice(p => !p)} className={`w-12 h-6 rounded-full transition-colors relative ${formShowPrice ? 'bg-glamp-600' : 'bg-gray-300 dark:bg-white/10'}`}><span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formShowPrice ? 'left-7' : 'left-1'}`} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Отмена</button>
              <button onClick={handleSave} disabled={!formName.trim() || !formPrice} className="py-2.5 rounded-xl bg-glamp-600 hover:bg-glamp-700 disabled:opacity-30 text-white text-sm font-bold transition-colors active:scale-95">{editItem ? 'Сохранить' : 'Добавить'}</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteId} title="Удалить блюдо?" message="Блюдо будет удалено из меню безвозвратно." confirmLabel="Удалить" onConfirm={handleDeleteConfirm} onClose={() => setDeleteId(null)} />
    </div>
  )
}
