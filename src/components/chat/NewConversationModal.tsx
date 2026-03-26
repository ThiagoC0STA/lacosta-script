"use client";

import { useState, useEffect, useRef } from "react";
import { X, ClipboardPaste } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setProduct("");
      setClientMessage("");
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl"
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

              {/* Two-column body */}
              <div className="px-6 py-4 flex gap-0 items-stretch min-h-[320px]">
                {/* Left: form */}
                <div className="flex-1 space-y-4 pr-5">
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
                      onKeyDown={(e) =>
                        e.key === "Enter" && !clientMessage && handleCreate()
                      }
                      placeholder="Ex: Francielli, João..."
                      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-sm focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-text-muted mb-2 block">
                      Produto de interesse{" "}
                      <span className="text-text-muted/50">(opcional)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setProduct("")}
                        className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 justify-center col-span-2 ${
                          product === ""
                            ? "bg-info/10 text-info border border-info/30"
                            : "bg-bg-primary border border-border text-text-secondary hover:border-border-light hover:text-text-primary"
                        }`}
                      >
                        <span>🤷</span>
                        Ainda não sei / cliente não disse
                      </button>
                      {products.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setProduct(product === p.id ? "" : p.id)}
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

                {/* Divider */}
                <div className="flex flex-col items-center gap-2 px-1">
                  <div className="flex-1 w-px bg-border" />
                  <span className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest py-1">
                    ou
                  </span>
                  <div className="flex-1 w-px bg-border" />
                </div>

                {/* Right: paste client message */}
                <div className="flex-1 flex flex-col pl-5">
                  <div>
                    <label className="text-xs text-text-muted mb-1.5 block">
                      Nome do cliente{" "}
                      <span className="text-text-muted/50">(opcional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Francielli, João..."
                      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-sm focus:border-info/50 focus:outline-none focus:ring-1 focus:ring-info/20 transition-all placeholder:text-text-muted/40"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3 mb-1.5">
                    <label className="text-xs text-text-muted">
                      Mensagem do cliente
                    </label>
                    <button
                      onClick={handlePaste}
                      className="flex items-center gap-1 text-[10px] text-text-muted hover:text-accent transition-colors px-2 py-1 rounded-md hover:bg-accent/10"
                    >
                      <ClipboardPaste size={11} />
                      Colar
                    </button>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    placeholder="Cole aqui a mensagem que o cliente mandou no WhatsApp..."
                    className="flex-1 w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-sm resize-none focus:border-info/50 focus:outline-none focus:ring-1 focus:ring-info/20 transition-all placeholder:text-text-muted/40 leading-relaxed"
                  />
                  <p className="text-[10px] text-text-muted/50 mt-1.5 leading-relaxed">
                    Se o cliente já mandou mensagem, cole aqui. A IA já vai
                    gerar opções de resposta.
                  </p>
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
