import { useState, useRef, useEffect } from 'react'
import { mockMessages } from '@glamping/utils'
import type { Message } from '@glamping/types'

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(mockMessages.filter(m => m.houseId === 'h1'))
  const [msg, setMsg] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function send() {
    if (!msg.trim()) return
    const newMsg: Message = {
      id: `msg${Date.now()}`, houseId: 'h1', sender: 'guest',
      text: msg, timestamp: new Date().toISOString(), read: true,
    }
    setMessages(prev => [...prev, newMsg])
    setMsg('')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white dark:bg-[#1a1d27] p-6 border-b border-gray-100 dark:border-white/10 shadow-sm flex items-center gap-4 transition-colors">
        <div className="w-12 h-12 bg-glamp-100 dark:bg-glamp-500/20 rounded-full flex items-center justify-center text-glamp-600 dark:text-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        </div>
        <div>
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">Администратор</h2>
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> В сети</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-[#0f1117] transition-colors">
        {messages.length === 0 && <p className="text-center text-gray-500 dark:text-white/50 text-sm mt-10">Начните диалог с администратором</p>}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'guest' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-4 rounded-2xl ${m.sender === 'guest' ? 'bg-glamp-600 text-white rounded-br-sm' : 'bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white rounded-bl-sm shadow-sm'}`}>
              <p className="text-lg">{m.text}</p>
              <span className={`text-xs mt-2 block ${m.sender === 'guest' ? 'text-glamp-200' : 'text-gray-500 dark:text-white/50'}`}>
                {new Date(m.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-4 bg-white dark:bg-[#1a1d27] border-t border-gray-200 dark:border-white/10 transition-colors">
        <div className="flex gap-2 bg-gray-50 dark:bg-white/5 p-2 rounded-full border border-gray-200 dark:border-white/10">
          <input type="text" value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Написать сообщение..." className="flex-1 bg-transparent px-4 outline-none text-lg text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/30" />
          <button onClick={send} className="w-12 h-12 bg-glamp-600 text-white rounded-full flex items-center justify-center hover:bg-glamp-700 shadow-md active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
