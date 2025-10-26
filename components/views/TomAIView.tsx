'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Send, Sparkles } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export default function TomAIMinimal() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)

  const listRef = useRef<HTMLDivElement | null>(null)
  const taRef = useRef<HTMLTextAreaElement | null>(null)

  // -- helpers --
  const persist = (next: Message[]) => {
    setMessages(next)
    try { localStorage.setItem('tomai_messages', JSON.stringify(next)) } catch {}
  }

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return
    const user: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed, timestamp: Date.now() }
    persist([...messages, user])
    setInput('')
    setIsTyping(true)

    // demo assistant reply
    setTimeout(() => {
      const reply: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          "I'm TOM AI. Ask me about schedules, staff, or inventory. (Demo reply)",
        timestamp: Date.now(),
      }
      persist([...messages, user, reply])
      setIsTyping(false)
    }, 900)
  }

  // load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('tomai_messages')
      if (raw) setMessages(JSON.parse(raw))
    } catch {}
  }, [])

  // auto-scroll when messages change
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  // auto-resize textarea
  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = '0px'
    ta.style.height = Math.min(160, ta.scrollHeight) + 'px'
  }, [input])

  const suggestions = [
    'Show tomorrow\'s theatre schedule',
    'Which staff can cover emergencies tonight?',
    'Do we need this implant next week?',
    'What does Mr. Smith need for Saturday\'s case?'
  ]

  return (
    <div className="flex h-dvh min-h-[480px] w-full flex-col bg-white text-gray-900">
      {/* Header – minimal, sticky */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold">TOM AI</h1>
            <p className="text-[11px] text-gray-500">Theatre Operations Assistant</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main ref={listRef} className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="mt-10 space-y-3">
            <h2 className="text-base font-semibold">How can I help?</h2>
            {showSuggestions && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setShowSuggestions(false); send(s) }}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={
                'max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed sm:max-w-[70%] ' +
                (m.role === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-900')
              }
            >
              {m.content}
              <div className={`mt-1 text-[11px] ${m.role === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-gray-100 px-4 py-3 text-gray-900">
              <span className="inline-flex items-center gap-2 text-sm">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]"></span>
                </span>
                typing…
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Composer */}
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white/90 pb-[max(0px,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              placeholder="Ask about schedules, staff, or inventory…"
              rows={1}
              className="min-h-[44px] max-h-40 w-full resize-none rounded-2xl border border-gray-300 bg-white px-3 py-2 text-[15px] shadow-sm outline-none focus:border-gray-400 focus:ring-0"
            />
            <button
              aria-label="Send"
              disabled={!input.trim() || isTyping}
              onClick={() => send(input)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                input.trim() && !isTyping ? 'bg-gray-900 text-white hover:bg-black' : 'bg-gray-200 text-gray-500'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-1 text-center text-[11px] text-gray-500">Press Enter to send • Shift+Enter for newline</p>
        </div>
      </div>
    </div>
  )
}
