"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { Check, AlertTriangle, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

let nextId = 0;

const ICON_MAP = {
  success: Check,
  error: AlertTriangle,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 max-w-xs">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICON_MAP[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2.5 bg-[#1a1a1e] border border-border rounded-lg px-3.5 py-2.5 shadow-2xl shadow-black/40"
              >
                <Icon size={13} className={`shrink-0 ${t.type === "error" ? "text-red-400" : "text-text-muted"}`} />
                <p className="text-xs text-text-secondary flex-1">{t.message}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-text-muted/40 hover:text-text-muted transition-opacity shrink-0"
                >
                  <X size={12} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
