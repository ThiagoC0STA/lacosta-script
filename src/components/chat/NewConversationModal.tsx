"use client";

import { useState, useEffect, useRef } from "react";
import { X, ClipboardPaste, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";

interface NewConversationModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (
    clientName: string,
    productType: string,
    clientMessage?: string
  ) => void;
}

export default function NewConversationModal({
  open,
  onClose,
  onCreate,
}: NewConversationModalProps) {
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [showMessageField, setShowMessageField] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setProduct("");
      setClientMessage("");
      setShowMessageField(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleCreate = () => {
    const trimmedMsg = clientMessage.trim();
    onCreate(name.trim(), product, trimmedMsg || undefined);
    onClose();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setClientMessage(text);
      textareaRef.current?.focus();
    } catch {
      textareaRef.current?.focus();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.12 }}
          >
            <div className="mx-4 bg-bg-secondary border border-border rounded-lg shadow-2xl shadow-black/40 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <h2 className="text-sm font-semibold">Nova conversa</h2>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-3 space-y-4">
                {/* Client name */}
                <div>
                  <label className="text-[11px] text-text-muted mb-1.5 block">
                    Nome do cliente{" "}
                    <span className="text-text-muted/40">(opcional)</span>
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !showMessageField && handleCreate()
                    }
                    placeholder="Ex: Francielli, Joao..."
                    className="w-full bg-bg-primary border border-border rounded-lg px-3.5 py-2.5 text-sm focus:border-border-light focus:outline-none transition-all placeholder:text-text-muted/30"
                  />
                </div>

                {/* Product */}
                <div>
                  <label className="text-[11px] text-text-muted mb-1.5 block">
                    Produto{" "}
                    <span className="text-text-muted/40">(opcional)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setProduct("")}
                      className={`px-3 py-2 rounded-lg text-[11px] font-medium transition-all col-span-3 ${
                        product === ""
                          ? "bg-bg-tertiary text-text-primary border border-border-light"
                          : "bg-bg-primary border border-border text-text-muted hover:border-border-light"
                      }`}
                    >
                      Nao definido
                    </button>
                    {products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setProduct(product === p.id ? "" : p.id)}
                        className={`px-3 py-2 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 justify-center ${
                          product === p.id
                            ? "bg-bg-tertiary text-text-primary border border-border-light"
                            : "bg-bg-primary border border-border text-text-muted hover:border-border-light"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggle client message */}
                {!showMessageField ? (
                  <button
                    onClick={() => {
                      setShowMessageField(true);
                      setTimeout(() => textareaRef.current?.focus(), 100);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[11px] text-text-muted border border-dashed border-border hover:border-border-light transition-all"
                  >
                    <span>Colar mensagem do cliente</span>
                    <ChevronDown size={12} />
                  </button>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] text-text-muted">
                        Mensagem do cliente
                      </label>
                      <button
                        onClick={handlePaste}
                        className="flex items-center gap-1 text-[10px] text-text-muted hover:text-text-secondary transition-colors px-1.5 py-0.5 rounded"
                      >
                        <ClipboardPaste size={10} />
                        Colar
                      </button>
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      placeholder="Cole a mensagem do WhatsApp..."
                      rows={4}
                      className="w-full bg-bg-primary border border-border rounded-lg px-3.5 py-2.5 text-sm resize-none focus:border-border-light focus:outline-none transition-all placeholder:text-text-muted/30 leading-relaxed"
                    />
                    <p className="text-[10px] text-text-muted/40 mt-1">
                      A IA vai gerar opcoes de resposta automaticamente.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 pt-2 flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg text-xs text-text-muted hover:text-text-secondary border border-border hover:border-border-light transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 py-2.5 rounded-lg text-xs font-medium bg-text-primary text-bg-primary hover:opacity-90 transition-all"
                >
                  {clientMessage.trim()
                    ? "Criar e analisar"
                    : "Criar conversa"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
