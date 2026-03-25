"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { Message } from "@/types/database";

interface ChatMessageProps {
  message: Message;
  clientName: string;
}

export default function ChatMessage({ message, clientName }: ChatMessageProps) {
  const isClient = message.role === "client";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`group flex ${isClient ? "justify-start" : "justify-end"}`}>
      <div
        className={`relative max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
          isClient
            ? "bg-bg-tertiary rounded-bl-md"
            : "bg-accent/10 border border-accent/10 rounded-br-md"
        }`}
      >
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all ${
            copied
              ? "bg-accent/15 text-accent opacity-100"
              : "opacity-0 group-hover:opacity-100 text-text-muted hover:text-text-secondary hover:bg-bg-primary/50"
          }`}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>

        <p
          className={`text-[10px] font-medium mb-1 ${
            isClient ? "text-text-muted" : "text-accent/70"
          }`}
        >
          {isClient ? clientName || "Cliente" : "Você"}
        </p>
        <p className="text-[13px] text-text-primary whitespace-pre-line leading-relaxed pr-6">
          {message.content}
        </p>
        <p className="text-[9px] text-text-muted/50 mt-1.5 text-right">
          {new Date(message.created_at).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
