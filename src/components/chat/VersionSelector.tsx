"use client";

import { useState } from "react";
import { Check, Pencil, Copy, Send, Star } from "lucide-react";
import { motion } from "framer-motion";
import AiRefineInput from "@/components/shared/AiRefineInput";

interface VersionSelectorProps {
  versions: string[];
  onSelect: (message: string) => void;
  onRefine?: (instruction: string) => void;
  isRefining?: boolean;
}

export default function VersionSelector({
  versions,
  onSelect,
  onRefine,
  isRefining,
}: VersionSelectorProps) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [savedIdx, setSavedIdx] = useState<number | null>(null);
  const [customMsg, setCustomMsg] = useState("");

  const handleEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditValue(versions[idx]);
  };

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSelect = (idx: number) => {
    onSelect(editingIdx === idx ? editValue : versions[idx]);
  };

  const handleFavorite = (text: string, idx: number) => {
    try {
      const key = "favorite-messages";
      const raw = window.localStorage.getItem(key);
      const favorites: string[] = raw ? JSON.parse(raw) : [];
      if (!favorites.includes(text)) {
        favorites.unshift(text);
        window.localStorage.setItem(key, JSON.stringify(favorites.slice(0, 50)));
      }
      setSavedIdx(idx);
      setTimeout(() => setSavedIdx(null), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs text-text-muted mb-3">
          {versions.length} opcoes geradas pela IA
        </p>

        <div className="space-y-2">
          {versions.map((version, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-bg-secondary border border-border rounded-lg overflow-hidden hover:border-border-light transition-all"
            >
              <div className="flex items-center justify-between px-3.5 py-2 border-b border-border">
                <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
                  Opcao {idx + 1}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => handleFavorite(editingIdx === idx ? editValue : version, idx)}
                    className={`p-1.5 rounded transition-colors ${
                      savedIdx === idx
                        ? "text-amber-400"
                        : "text-text-muted hover:text-amber-400/70 hover:bg-bg-tertiary"
                    }`}
                    title="Salvar como favorita"
                  >
                    <Star size={12} fill={savedIdx === idx ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => handleCopy(editingIdx === idx ? editValue : version, idx)}
                    className={`p-1.5 rounded text-text-muted transition-colors ${
                      copiedIdx === idx
                        ? "text-emerald-400"
                        : "hover:text-text-secondary hover:bg-bg-tertiary"
                    }`}
                  >
                    {copiedIdx === idx ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() =>
                      editingIdx === idx ? setEditingIdx(null) : handleEdit(idx)
                    }
                    className={`p-1.5 rounded transition-colors ${
                      editingIdx === idx
                        ? "text-text-primary bg-bg-tertiary"
                        : "text-text-muted hover:text-text-secondary hover:bg-bg-tertiary"
                    }`}
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => handleSelect(idx)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded text-text-primary bg-bg-tertiary text-[10px] font-medium hover:bg-border transition-colors ml-0.5"
                  >
                    <Check size={10} />
                    Usar
                  </button>
                </div>
              </div>

              <div className="px-3.5 py-3">
                {editingIdx === idx ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={5}
                    className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-border-light resize-none leading-relaxed"
                    autoFocus
                  />
                ) : (
                  <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                    {version}
                  </p>
                )}
              </div>
            </motion.div>
          ))}

          {/* Custom message */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: versions.length * 0.04 }}
            className="bg-bg-secondary border border-dashed border-border rounded-lg overflow-hidden"
          >
            <div className="px-3.5 py-2 border-b border-border/50">
              <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
                Sua mensagem
              </span>
            </div>
            <div className="p-3.5">
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                rows={3}
                placeholder="Escreva sua propria mensagem..."
                className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-border-light resize-none leading-relaxed placeholder:text-text-muted/30 transition-all"
              />
              <button
                onClick={() => {
                  if (customMsg.trim()) onSelect(customMsg.trim());
                }}
                disabled={!customMsg.trim()}
                className="mt-2 flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-bg-tertiary border border-border text-text-secondary text-xs font-medium hover:border-border-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={11} />
                Enviar
              </button>
            </div>
          </motion.div>

          {/* Refine AI input */}
          {onRefine && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (versions.length + 1) * 0.04 }}
            >
              <AiRefineInput
                onSubmit={onRefine}
                isLoading={isRefining}
                placeholder="Ex: mude o tom, seja mais direto, adicione o preco..."
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
