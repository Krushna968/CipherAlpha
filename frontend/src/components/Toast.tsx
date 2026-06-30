import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string, title?: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be called inside <ToastProvider>');
  return ctx;
};

// ─── Config maps ──────────────────────────────────────────────────────────────
const ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLE: Record<ToastType, { border: string; bg: string; iconCls: string; titleCls: string }> = {
  success: { border: 'border-[#4edea3]/40', bg: 'bg-[#4edea3]/08', iconCls: 'text-[#4edea3]', titleCls: 'text-[#4edea3]' },
  error:   { border: 'border-[#ffb4ab]/40', bg: 'bg-[#ffb4ab]/08', iconCls: 'text-[#ffb4ab]', titleCls: 'text-[#ffb4ab]' },
  warning: { border: 'border-yellow-400/40', bg: 'bg-yellow-400/08', iconCls: 'text-yellow-300', titleCls: 'text-yellow-300' },
  info:    { border: 'border-[#d2bbff]/40', bg: 'bg-[#d2bbff]/08', iconCls: 'text-[#d2bbff]', titleCls: 'text-[#d2bbff]' },
};

// ─── Individual toast ─────────────────────────────────────────────────────────
const Toast: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const Icon = ICONS[toast.type];
  const s = STYLE[toast.type];

  React.useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      initial={{ x: 80, opacity: 0, scale: 0.96 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 80, opacity: 0, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl ${s.border} ${s.bg} min-w-[280px] max-w-[360px] shadow-2xl`}
      style={{ background: 'rgba(17, 21, 35, 0.88)' }}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${s.iconCls}`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`text-xs font-bold mb-0.5 ${s.titleCls}`}>{toast.title}</p>
        )}
        <p className="text-xs text-on-surface-variant leading-relaxed break-words">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-on-surface-variant hover:text-on-surface transition-colors ml-1 flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev.slice(-4), { id, type, message, title }]); // max 5
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <Toast toast={t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
