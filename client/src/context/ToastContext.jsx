import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

let id = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    const key = ++id
    setToasts(prev => [...prev, { key, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.key !== key)), duration)
  }, [])

  const success = useCallback((msg, dur) => toast({ message: msg, type: 'success', duration: dur }), [toast])
  const error   = useCallback((msg, dur) => toast({ message: msg, type: 'error',   duration: dur || 4000 }), [toast])
  const info    = useCallback((msg, dur) => toast({ message: msg, type: 'info',    duration: dur }), [toast])

  const ICONS = { success: '✓', error: '✕', info: 'ℹ' }
  const STYLES = {
    success: 'bg-emerald-500 text-white',
    error:   'bg-red-500 text-white',
    info:    'bg-primary text-white',
  }

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.key}
            className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-xs ${STYLES[t.type]}`}
          >
            <span className="text-base font-bold">{ICONS[t.type]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
