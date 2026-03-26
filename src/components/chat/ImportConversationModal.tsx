"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  ClipboardPaste,
  Upload,
  MessageCircle,
  User,
  Headset,
  AlertCircle,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { parseWhatsApp, type ParsedMessage } from "@/lib/whatsapp-parser";
import { products } from "@/data/products";

interface ImportConversationModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (
    clientName: string,
    productType: string,
    messages: { role: "client" | "seller"; content: string }[]
  ) => Promise<void> | void;
}

export default function ImportConversationModal({
  open,
  onClose,
  onImport,
}: ImportConversationModalProps) {
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState<ParsedMessage[] | null>(null);
  const [clientName, setClientName] = useState("");
  const [product, setProduct] = useState("");
  const [parseError, setParseError] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setRawText("");
      setParsed(null);
      setClientName("");
      setProduct("");
      setParseError("");
      setEditingIdx(null);
      setEditValue("");
      setIsImporting(false);
    }
  }, [open]);

  const handleParse = () => {
    if (!rawText.trim()) return;

    const result = parseWhatsApp(rawText);

    if (result.messages.length === 0) {
      setParseError(
        "Nenhuma mensagem encontrada. Cole o texto exportado do WhatsApp no formato [hora, data] nome: mensagem"
      );
      setParsed(null);
      return;
    }

    setParseError("");
    setParsed(result.messages);
    if (result.clientName && !clientName) {
      setClientName(result.clientName);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setRawText(text);
      textareaRef.current?.focus();
    } catch {
      textareaRef.current?.focus();
    }
  };

  const handleImport = async () => {
    if (!parsed || parsed.length === 0 || isImporting) return;
    setIsImporting(true);
    try {
      await onImport(
        clientName.trim(),
        product,
        parsed.map((m) => ({ role: m.role, content: m.content }))
      );
      onClose();
    } finally {
      setIsImporting(false);
    }
  };

  const handleStartEdit = (idx: number, content: string) => {
    setEditingIdx(idx);
    setEditValue(content);
  };

  const handleSaveEdit = () => {
    if (editingIdx === null || !parsed) return;
    const next = [...parsed];
    next[editingIdx] = { ...next[editingIdx], content: editValue.trim() };
    setParsed(next.filter((m) => m.content.length > 0));
    setEditingIdx(null);
    setEditValue("");
  };

  const handleDeleteMessage = (idx: number) => {
    if (!parsed) return;
    const next = parsed.filter((_, i) => i !== idx);
    setParsed(next);
    if (editingIdx === idx) {
      setEditingIdx(null);
      setEditValue("");
    }
  };

  const clientCount = parsed?.filter((m) => m.role === "client").length ?? 0;
  const sellerCount = parsed?.filter((m) => m.role === "seller").length ?? 0;

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[95vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
          >
            <div className="mx-4 bg-bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-2 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                    <Upload size={14} className="text-info" />
                  </div>
                  <h2 className="text-sm font-semibold">
                    Importar conversa do WhatsApp
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {!parsed ? (
                  <>
                    {/* Paste area */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-text-muted">
                          Cole a conversa exportada do WhatsApp
                        </label>
                        <button
                          onClick={handlePaste}
                          className="flex items-center gap-1 text-[10px] text-text-muted hover:text-info transition-colors px-2 py-1 rounded-md hover:bg-info/10"
                        >
                          <ClipboardPaste size={11} />
                          Colar
                        </button>
                      </div>
                      <textarea
                        ref={textareaRef}
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        rows={12}
                        placeholder={"[14:44, 23/03/2026] +55 12 99131-7968: Olá, vim pelo site...\n[14:54, 23/03/2026] LA COSTA CORRETORA: Boa tarde, tudo bem?"}
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs font-mono resize-none focus:border-info/50 focus:outline-none focus:ring-1 focus:ring-info/20 transition-all placeholder:text-text-muted/30 leading-relaxed"
                      />
                      {parseError && (
                        <div className="flex items-start gap-2 mt-2 bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                          <AlertCircle
                            size={13}
                            className="text-danger mt-0.5 shrink-0"
                          />
                          <p className="text-[11px] text-danger">{parseError}</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Parsed preview */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-lg px-3 py-1.5">
                        <MessageCircle size={12} className="text-accent" />
                        <span className="text-[11px] font-medium text-accent">
                          {parsed.length} mensagens
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-bg-tertiary border border-border rounded-lg px-3 py-1.5">
                        <User size={12} className="text-text-muted" />
                        <span className="text-[11px] text-text-secondary">
                          {clientCount} cliente
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-bg-tertiary border border-border rounded-lg px-3 py-1.5">
                        <Headset size={12} className="text-text-muted" />
                        <span className="text-[11px] text-text-secondary">
                          {sellerCount} vendedor
                        </span>
                      </div>
                    </div>

                    {/* Name + product */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-text-muted mb-1.5 block">
                          Nome do cliente
                        </label>
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Ex: Kleide..."
                          className="w-full bg-bg-primary border border-border rounded-xl px-3.5 py-2.5 text-sm focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted mb-1.5 block">
                          Produto
                        </label>
                        <select
                          value={product}
                          onChange={(e) => setProduct(e.target.value)}
                          className="w-full bg-bg-primary border border-border rounded-xl px-3.5 py-2.5 text-sm focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all text-text-secondary"
                        >
                          <option value="">Não definido</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.emoji} {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message preview */}
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-2">
                        Prévia
                      </p>
                      <div className="bg-bg-primary border border-border rounded-xl p-3 max-h-72 overflow-y-auto space-y-1.5">
                        {parsed.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex gap-2 ${
                              msg.role === "seller" ? "justify-end" : ""
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-3 py-1.5 ${
                                msg.role === "seller"
                                  ? "bg-accent/10 border border-accent/15"
                                  : "bg-bg-tertiary border border-border"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <p className="text-[10px] text-text-muted">
                                  {msg.role === "seller" ? "Vendedor" : "Cliente"} ·{" "}
                                  {msg.timestamp}
                                </p>
                                <div className="flex items-center gap-1">
                                  {editingIdx === i ? (
                                    <button
                                      onClick={handleSaveEdit}
                                      className="p-1 rounded-md text-accent hover:bg-accent/10 transition-colors"
                                    >
                                      <Check size={11} />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleStartEdit(i, msg.content)}
                                      className="p-1 rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-secondary/80 transition-colors"
                                    >
                                      <Pencil size={11} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteMessage(i)}
                                    className="p-1 rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                              {editingIdx === i ? (
                                <textarea
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  rows={3}
                                  className="w-full bg-bg-secondary border border-border rounded-lg px-2.5 py-2 text-[11px] text-text-secondary leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-accent/20"
                                  autoFocus
                                />
                              ) : (
                                <p className="text-[11px] text-text-secondary leading-relaxed whitespace-pre-line">
                                  {msg.content}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-5 pt-2 flex gap-3 shrink-0">
                {!parsed ? (
                  <>
                    <button
                      onClick={onClose}
                      className="flex-1 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-secondary hover:bg-bg-tertiary border border-border transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleParse}
                      disabled={!rawText.trim()}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-info text-white hover:bg-info/80 transition-colors disabled:opacity-30"
                    >
                      Processar conversa
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setParsed(null);
                        setParseError("");
                      }}
                      className="flex-1 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-secondary hover:bg-bg-tertiary border border-border transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={isImporting || parsed.length === 0}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-accent text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isImporting
                        ? "Importando..."
                        : `Importar ${parsed.length} mensagens`}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
