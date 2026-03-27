"use client";

import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";

interface AiRefineInputProps {
  onSubmit: (instruction: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  accentColor?: "accent" | "amber";
}

export default function AiRefineInput({
  onSubmit,
  isLoading = false,
  placeholder = "Ex: mude o tom, seja mais direto, adicione o preço...",
  accentColor = "accent",
}: AiRefineInputProps) {
  const [value, setValue] = useState("");

  const colors =
    accentColor === "amber"
      ? {
          border: "border-amber-400/20 focus-within:border-amber-400/40",
          icon: "text-amber-400",
          button: "bg-amber-400/10 text-amber-300 hover:bg-amber-400/20",
          label: "text-amber-400/70",
        }
      : {
          border: "border-accent/20 focus-within:border-accent/40",
          icon: "text-accent",
          button: "bg-accent/10 text-accent hover:bg-accent/20",
          label: "text-accent/70",
        };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <div
      className={`rounded-xl border bg-bg-secondary/50 overflow-hidden transition-colors ${colors.border}`}
    >
      <div className="flex items-center gap-2 px-3.5 py-2 border-b border-border/50">
        <Wand2 size={12} className={colors.icon} />
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${colors.label}`}>
          Pedir ajuste à IA
        </span>
      </div>
      <div className="p-3 flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/15 placeholder:text-text-muted/40 transition-all disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0 ${colors.button}`}
        >
          {isLoading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Wand2 size={12} />
          )}
          Refinar
        </button>
      </div>
    </div>
  );
}
