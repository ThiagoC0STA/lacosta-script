"use client";

import { useState } from "react";
import { Send, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { starterMessages } from "@/data/starter-messages";

interface StarterPickerProps {
  clientName: string;
  productType: string;
  creditValue: string;
  onCreditChange: (v: string) => void;
  onSend: (message: string) => void;
}

export default function StarterPicker({
  clientName,
  productType,
  creditValue,
  onCreditChange,
  onSend,
}: StarterPickerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customMsg, setCustomMsg] = useState("");

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const starter = starterMessages.find((s) => s.id === id);
    if (starter && id !== "custom") {
      setCustomMsg(starter.message(clientName, productType, creditValue));
    } else {
      setCustomMsg("");
    }
  };

  const handleSend = () => {
    if (!customMsg.trim()) return;
    onSend(customMsg.trim());
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-bold text-accent">LC</span>
          </div>
          <h2 className="text-lg font-semibold">
            {clientName ? `Conversa com ${clientName}` : "Nova conversa"}
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Escolha como iniciar ou escreva sua mensagem
          </p>
        </div>

        {/* Credit value */}
        <div className="mb-5">
          <input
            type="text"
            value={creditValue}
            onChange={(e) => {
              onCreditChange(e.target.value);
              if (selectedId && selectedId !== "custom") {
                const starter = starterMessages.find((s) => s.id === selectedId);
                if (starter) {
                  setCustomMsg(starter.message(clientName, productType, e.target.value));
                }
              }
            }}
            placeholder="Valor que o cliente pediu (ex: R$ 100.000)"
            className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted/40"
          />
        </div>

        {/* Starters */}
        <div className="space-y-1.5 mb-5">
          {starterMessages.map((starter) => (
            <button
              key={starter.id}
              onClick={() => handleSelect(starter.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all border group ${
                selectedId === starter.id
                  ? "bg-accent/8 border-accent/25 text-text-primary"
                  : "bg-bg-secondary border-border hover:border-border-light text-text-secondary hover:text-text-primary"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium">{starter.label}</p>
                  <p className="text-[11px] text-text-muted">{starter.context}</p>
                </div>
                <ArrowRight
                  size={14}
                  className={`shrink-0 transition-all ${
                    selectedId === starter.id
                      ? "text-accent opacity-100"
                      : "text-text-muted opacity-0 group-hover:opacity-50"
                  }`}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Edit + send */}
        {selectedId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3"
          >
            <textarea
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              rows={6}
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20 resize-none placeholder:text-text-muted/40 leading-relaxed"
              placeholder="Escreva sua mensagem..."
            />
            <button
              onClick={handleSend}
              disabled={!customMsg.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-accent text-bg-primary hover:bg-accent-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              Enviar primeira mensagem
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
