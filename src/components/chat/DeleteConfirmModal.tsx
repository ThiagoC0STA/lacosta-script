"use client";

import { X } from "lucide-react";
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
            className="fixed inset-0 bg-black/60 z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-60 w-full max-w-xs"
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.12 }}
          >
            <div className="mx-4 bg-bg-secondary border border-border rounded-lg shadow-2xl shadow-black/40 overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4 pb-1">
                <h2 className="text-sm font-semibold">Apagar conversa</h2>
                <button
                  onClick={onCancel}
                  className="w-6 h-6 rounded flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="px-4 py-3">
                <p className="text-xs text-text-muted leading-relaxed">
                  Apagar conversa com{" "}
                  <span className="text-text-secondary">
                    {clientName || "Sem nome"}
                  </span>
                  ? Esta acao nao pode ser desfeita.
                </p>
              </div>

              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2 rounded-lg text-xs text-text-muted border border-border hover:border-border-light transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 transition-colors"
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
