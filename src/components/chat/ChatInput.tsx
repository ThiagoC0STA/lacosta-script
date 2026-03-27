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
    <div className="border-t border-border bg-bg-secondary p-4">
      <div className="max-w-5xl mx-auto flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={2}
          className="flex-1 bg-bg-primary border border-border rounded-lg px-3.5 py-2.5 text-sm focus:border-border-light focus:outline-none resize-none placeholder:text-text-muted/30 disabled:opacity-40 leading-relaxed transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="w-9 h-9 rounded-lg bg-text-primary text-bg-primary flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
