"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import LearningForm from "./LearningForm";

interface Learning {
  id: string;
  insight: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface LearningCardProps {
  learning: Learning;
  categories: { value: string; label: string }[];
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (id: string, insight: string, category: string) => void;
  onDelete: (id: string) => void;
  onCancelEdit: () => void;
}

export default function LearningCard({
  learning,
  categories,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
}: LearningCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const categoryLabel =
    categories.find((c) => c.value === learning.category)?.label || learning.category;

  if (isEditing) {
    return (
      <LearningForm
        categories={categories}
        initialInsight={learning.insight}
        initialCategory={learning.category}
        onSubmit={(insight, category) => onUpdate(learning.id, insight, category)}
        onCancel={onCancelEdit}
      />
    );
  }

  return (
    <div className="group border border-border rounded-lg bg-bg-secondary hover:border-border-light transition-all">
      <div className="px-3.5 py-3 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {learning.insight}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-text-muted bg-bg-tertiary px-2 py-0.5 rounded">
              {categoryLabel}
            </span>
            <span className="text-[10px] text-text-muted/30">
              {new Date(learning.created_at).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 rounded text-text-muted hover:text-text-secondary hover:bg-bg-tertiary transition-colors"
          >
            <Pencil size={12} />
          </button>

          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(learning.id)}
                className="px-2 py-1 rounded text-[10px] font-medium text-red-400 bg-red-400/10 hover:bg-red-400/15 transition-colors"
              >
                Apagar
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 rounded text-[10px] text-text-muted hover:text-text-secondary transition-colors"
              >
                Nao
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
