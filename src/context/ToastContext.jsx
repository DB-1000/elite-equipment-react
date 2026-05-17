import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext({})

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', show: false })

  const showToast = useCallback((message) => {
    setToast({ message, show: true })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={`toast${toast.show ? ' show' : ''}`}>{toast.message}</div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
