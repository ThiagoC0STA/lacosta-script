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
        className={`relative max-w-[80%] sm:max-w-[70%] rounded-lg px-3.5 py-3 ${
          isClient
            ? "bg-bg-tertiary"
            : "bg-bg-secondary border border-border"
        }`}
      >
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 p-1 rounded transition-all ${
            copied
              ? "text-text-secondary opacity-100"
              : "opacity-0 group-hover:opacity-100 text-text-muted hover:text-text-secondary"
          }`}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
        </button>

        <p
          className={`text-[10px] font-medium mb-1 ${
            isClient ? "text-text-muted" : "text-text-muted"
          }`}
        >
          {isClient ? clientName || "Cliente" : "Voce"}
        </p>
        <p className="text-sm text-text-primary whitespace-pre-line leading-relaxed pr-5">
          {message.content}
        </p>
        <p className="text-[10px] text-text-muted/30 mt-1.5 text-right">
          {new Date(message.created_at).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
