"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";

interface NewConversationModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (clientName: string, productType: string) => void;
}

export default function NewConversationModal({
  open,
  onClose,
  onCreate,
}: NewConversationModalProps) {
  const [name, setName] = useState("");
  const [product, setProduct] = useState("imovel");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setProduct("imovel");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleCreate = () => {
    onCreate(name.trim(), product);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
          >
            <div className="mx-4 bg-bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <h2 className="text-base font-semibold">Nova conversa</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="text-xs text-text-muted mb-1.5 block">
                    Nome do cliente{" "}
                    <span className="text-text-muted/50">(opcional)</span>
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    placeholder="Ex: Francielli, João..."
                    className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-sm focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted/40"
                  />
                </div>

                <div>
                  <label className="text-xs text-text-muted mb-2 block">
                    Produto de interesse
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setProduct(p.id)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 justify-center ${
                          product === p.id
                            ? "bg-accent/10 text-accent border border-accent/30"
                            : "bg-bg-primary border border-border text-text-secondary hover:border-border-light hover:text-text-primary"
                        }`}
                      >
                        <span>{p.emoji}</span>
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 pt-2 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-secondary hover:bg-bg-tertiary border border-border transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-accent text-bg-primary hover:bg-accent-hover transition-colors"
                >
                  Criar conversa
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
