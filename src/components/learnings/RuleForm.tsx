"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface RuleFormProps {
  initialRule?: string;
  initialActive?: boolean;
  onSubmit: (rule: string, isActive: boolean) => Promise<void> | void;
  onCancel: () => void;
}

export default function RuleForm({
  initialRule = "",
  initialActive = true,
  onSubmit,
  onCancel,
}: RuleFormProps) {
  const [rule, setRule] = useState(initialRule);
  const [isActive, setIsActive] = useState(initialActive);

  const handleSubmit = async () => {
    if (!rule.trim()) return;
    await onSubmit(rule.trim(), isActive);
  };

  return (
    <div className="border border-border rounded-lg bg-bg-secondary overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-border">
        <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
          {initialRule ? "Editar regra" : "Nova regra"}
        </p>
      </div>
      <div className="p-3.5 space-y-3">
        <textarea
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          rows={3}
          autoFocus
          placeholder="Ex: Sempre manter tom consultivo, sem pressão."
          className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-border-light placeholder:text-text-muted/30 leading-relaxed transition-all"
        />
        <label className="flex items-center gap-2 text-xs text-text-muted">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="accent-white"
          />
          Regra ativa
        </label>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!rule.trim()}
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
