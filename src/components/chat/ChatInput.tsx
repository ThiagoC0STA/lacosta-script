"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Cole a resposta do cliente...",
}: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-bg-secondary/80 backdrop-blur-sm p-3">
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={2}
          className="flex-1 bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20 resize-none placeholder:text-text-muted/40 disabled:opacity-40 leading-relaxed"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="w-10 h-10 rounded-xl bg-accent text-bg-primary flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
