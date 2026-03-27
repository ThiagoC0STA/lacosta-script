"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import RuleForm from "./RuleForm";

interface RuleItem {
  id: string;
  rule: string;
  is_active?: boolean;
  created_at?: string;
}

interface RuleCardProps {
  ruleItem: RuleItem;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (id: string, rule: string, isActive: boolean) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onCancelEdit: () => void;
}

export default function RuleCard({
  ruleItem,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
}: RuleCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isEditing) {
    return (
      <RuleForm
        initialRule={ruleItem.rule}
        initialActive={ruleItem.is_active ?? true}
        onSubmit={(rule, isActive) => onUpdate(ruleItem.id, rule, isActive)}
        onCancel={onCancelEdit}
      />
    );
  }

  return (
    <div className="group border border-border rounded-lg bg-bg-secondary hover:border-border-light transition-all">
      <div className="px-3.5 py-3 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {ruleItem.rule}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-[10px] px-2 py-0.5 rounded ${
                ruleItem.is_active === false
                  ? "text-text-muted bg-bg-tertiary"
                  : "text-emerald-300 bg-emerald-400/10"
              }`}
            >
              {ruleItem.is_active === false ? "Inativa" : "Ativa"}
            </span>
            {ruleItem.created_at && (
              <span className="text-[10px] text-text-muted/30">
                {new Date(ruleItem.created_at).toLocaleDateString("pt-BR")}
              </span>
            )}
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
                onClick={() => onDelete(ruleItem.id)}
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
