"use client";

import { useState } from "react";
import { RotateCcw, Loader2 } from "lucide-react";

interface AiRefineInputProps {
  onSubmit: (instruction: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  accentColor?: "accent" | "amber";
}

export default function AiRefineInput({
  onSubmit,
  isLoading = false,
  placeholder = "Ex: mude o tom, seja mais direto, adicione o preco...",
}: AiRefineInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <div className="rounded-lg border border-border bg-bg-secondary overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <RotateCcw size={11} className="text-text-muted" />
        <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
          Refinar resposta
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
          className="flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-border-light placeholder:text-text-muted/30 transition-all disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-bg-tertiary border border-border text-text-secondary text-[11px] font-medium hover:border-border-light transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        >
          {isLoading ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <RotateCcw size={11} />
          )}
          Refinar
        </button>
      </div>
    </div>
  );
}
