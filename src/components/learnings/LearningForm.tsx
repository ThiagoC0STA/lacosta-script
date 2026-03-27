"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface LearningFormProps {
  categories: { value: string; label: string }[];
  initialInsight?: string;
  initialCategory?: string;
  onSubmit: (insight: string, category: string) => void;
  onCancel: () => void;
}

export default function LearningForm({
  categories,
  initialInsight = "",
  initialCategory = "general",
  onSubmit,
  onCancel,
}: LearningFormProps) {
  const [insight, setInsight] = useState(initialInsight);
  const [category, setCategory] = useState(initialCategory);

  const handleSubmit = () => {
    if (!insight.trim()) return;
    onSubmit(insight.trim(), category);
  };

  return (
    <div className="border border-border rounded-lg bg-bg-secondary overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-border">
        <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
          {initialInsight ? "Editar" : "Novo aprendizado"}
        </p>
      </div>

      <div className="p-3.5 space-y-3">
        <textarea
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          placeholder="Ex: Quando o cliente fala 'vou pensar', nunca insista. Pergunte o que ficou de duvida..."
          rows={3}
          autoFocus
          className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-border-light placeholder:text-text-muted/30 leading-relaxed transition-all"
        />

        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                category === c.value
                  ? "bg-bg-tertiary text-text-primary border border-border-light"
                  : "text-text-muted border border-transparent hover:text-text-secondary"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!insight.trim()}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-text-primary text-bg-primary hover:opacity-90 transition-all disabled:opacity-30"
          >
            <Check size={12} />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
