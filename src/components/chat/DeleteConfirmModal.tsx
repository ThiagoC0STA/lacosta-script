"use client";

import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteConfirmModalProps {
  open: boolean;
  clientName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  open,
  clientName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-60 w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.12 }}
          >
            <div className="mx-4 bg-bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center">
                    <AlertTriangle size={15} className="text-danger" />
                  </div>
                  <h2 className="text-sm font-semibold">Apagar conversa</h2>
                </div>
                <button
                  onClick={onCancel}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs text-text-secondary leading-relaxed">
                  Tem certeza que quer apagar a conversa com{" "}
                  <span className="font-semibold text-text-primary">
                    {clientName || "Sem nome"}
                  </span>
                  ? Todas as mensagens e análises serão perdidas.
                </p>
              </div>

              <div className="px-5 pb-5 flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium text-text-muted hover:text-text-secondary hover:bg-bg-tertiary border border-border transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-danger text-white hover:bg-danger/80 transition-colors"
                >
                  Apagar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
