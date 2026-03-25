"use client";

import { useState } from "react";
import { Check, Pencil, Copy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface VersionSelectorProps {
  versions: string[];
  onSelect: (message: string) => void;
}

export default function VersionSelector({
  versions,
  onSelect,
}: VersionSelectorProps) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

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

  return (
    <div className="px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={13} className="text-accent" />
          <p className="text-xs font-medium text-accent">
            {versions.length} versões geradas — escolha ou edite
          </p>
        </div>

        <div className="space-y-2">
          {versions.map((version, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-bg-secondary border border-border rounded-xl overflow-hidden hover:border-border-light transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3.5 py-2 border-b border-border/50">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  v{idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(editingIdx === idx ? editValue : version, idx)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      copiedIdx === idx
                        ? "text-accent bg-accent/10"
                        : "text-text-muted hover:text-text-secondary hover:bg-bg-tertiary"
                    }`}
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    onClick={() =>
                      editingIdx === idx ? setEditingIdx(null) : handleEdit(idx)
                    }
                    className={`p-1.5 rounded-lg transition-colors ${
                      editingIdx === idx
                        ? "text-accent bg-accent/10"
                        : "text-text-muted hover:text-text-secondary hover:bg-bg-tertiary"
                    }`}
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => handleSelect(idx)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-[10px] font-semibold hover:bg-accent/20 transition-colors"
                  >
                    <Check size={11} />
                    Usar
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-3.5 py-3">
                {editingIdx === idx ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={5}
                    className="w-full bg-bg-primary border border-accent/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/20 resize-none leading-relaxed"
                    autoFocus
                  />
                ) : (
                  <p className="text-[13px] text-text-secondary whitespace-pre-line leading-relaxed">
                    {version}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
