"use client";

import { useState } from "react";
import { Send, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { starterMessages } from "@/data/starter-messages";

interface StarterPickerProps {
  clientName: string;
  productType: string;
  creditValue: string;
  parcelaValue: string;
  onCreditChange: (v: string) => void;
  onParcelaChange: (v: string) => void;
  onSend: (message: string) => void;
}

export default function StarterPicker({
  clientName,
  productType,
  creditValue,
  parcelaValue,
  onCreditChange,
  onParcelaChange,
  onSend,
}: StarterPickerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customMsg, setCustomMsg] = useState("");

  const rebuildMessage = (id: string, credit: string, parcela: string) => {
    const starter = starterMessages.find((s) => s.id === id);
    if (starter && id !== "custom") {
      setCustomMsg(starter.message(clientName, productType, credit, parcela));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const starter = starterMessages.find((s) => s.id === id);
    if (starter && id !== "custom") {
      setCustomMsg(starter.message(clientName, productType, creditValue, parcelaValue));
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
          <div className="w-10 h-10 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center mx-auto mb-3">
            <span className="text-[10px] font-bold text-text-secondary">LC</span>
          </div>
          <h2 className="text-sm font-semibold">
            {clientName ? `Conversa com ${clientName}` : "Nova conversa"}
          </h2>
          <p className="text-[10px] text-text-muted mt-1">
            Escolha como iniciar ou escreva sua mensagem
          </p>
        </div>

        {/* Value fields */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={creditValue}
            onChange={(e) => {
              onCreditChange(e.target.value);
              if (selectedId && selectedId !== "custom") {
                rebuildMessage(selectedId, e.target.value, parcelaValue);
              }
            }}
            placeholder="Valor da carta (ex: R$ 100.000)"
            className="flex-1 bg-bg-secondary border border-border rounded-lg px-3.5 py-2.5 text-xs focus:border-border-light focus:outline-none transition-all placeholder:text-text-muted/30"
          />
          <input
            type="text"
            value={parcelaValue}
            onChange={(e) => {
              onParcelaChange(e.target.value);
              if (selectedId && selectedId !== "custom") {
                rebuildMessage(selectedId, creditValue, e.target.value);
              }
            }}
            placeholder="Parcela (ex: R$ 800)"
            className="flex-1 bg-bg-secondary border border-border rounded-lg px-3.5 py-2.5 text-xs focus:border-border-light focus:outline-none transition-all placeholder:text-text-muted/30"
          />
        </div>

        {/* Starters */}
        <div className="space-y-1 mb-4">
          {starterMessages.map((starter) => (
            <button
              key={starter.id}
              onClick={() => handleSelect(starter.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all border group ${
                selectedId === starter.id
                  ? "bg-bg-tertiary border-border-light text-text-primary"
                  : "bg-bg-secondary border-border hover:border-border-light text-text-secondary"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">{starter.label}</p>
                  <p className="text-[10px] text-text-muted">{starter.context}</p>
                </div>
                <ArrowRight
                  size={12}
                  className={`shrink-0 transition-all ${
                    selectedId === starter.id
                      ? "text-text-primary opacity-100"
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
            className="space-y-2"
          >
            <textarea
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              rows={6}
              className="w-full bg-bg-secondary border border-border rounded-lg px-3.5 py-3 text-sm focus:border-border-light focus:outline-none resize-none placeholder:text-text-muted/30 leading-relaxed"
              placeholder="Escreva sua mensagem..."
            />
            <button
              onClick={handleSend}
              disabled={!customMsg.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium bg-text-primary text-bg-primary hover:opacity-90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send size={13} />
              Enviar primeira mensagem
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
