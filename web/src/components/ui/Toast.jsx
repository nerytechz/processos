import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext({
  ok: () => {},
  warn: () => {},
  err: () => {},
})

const TONE_CLASS = {
  ok: 'border-primary/40 text-foreground',
  warn: 'border-warning/50 text-foreground',
  err: 'border-danger/50 text-foreground',
}

const TONE_DOT = {
  ok: 'bg-primary',
  warn: 'bg-warning',
  err: 'bg-danger',
}

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])

  const push = useCallback((tone, message) => {
    const text = String(message || '').trim()
    if (!text) return
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setItems((prev) => [...prev.slice(-2), { id, message: text, tone }])
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 2800)
  }, [])

  const api = useMemo(
    () => ({
      ok: (m) => push('ok', m),
      warn: (m) => push('warn', m),
      err: (m) => push('err', m),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-20 left-1/2 z-[200] w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 space-y-2 md:bottom-6">
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-full border bg-surface/95 px-4 py-2.5 shadow-xl backdrop-blur-sm ${TONE_CLASS[t.tone]}`}
          >
            <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${TONE_DOT[t.tone]}`} />
            <p className="truncate font-mono text-[11px] tracking-wide whitespace-nowrap">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
