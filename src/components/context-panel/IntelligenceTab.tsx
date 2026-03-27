"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Loader2,
  RefreshCw,
  Target,
  Flame,
  Thermometer,
  Snowflake,
  ChevronRight,
  FileText,
  AlertCircle,
  TrendingUp,
  Hash,
} from "lucide-react";
import type { Message, ClientIntelligence } from "@/types/database";

interface IntelligenceTabProps {
  messages: Message[];
  clientName: string;
  productType: string;
  isVisible: boolean;
}

const STAGE_LABELS: Record<number, string> = {
  1: "Abertura",
  2: "Discovery",
  3: "Valor",
  4: "Objecoes",
  5: "Fechamento",
};

const TEMP_CONFIG = {
  hot: { icon: Flame, label: "Quente", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  warm: { icon: Thermometer, label: "Morno", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  cold: { icon: Snowflake, label: "Frio", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
};

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-orange-400",
  medium: "bg-amber-400",
  low: "bg-text-muted/40",
};

export default function IntelligenceTab({
  messages,
  clientName,
  productType,
  isVisible,
}: IntelligenceTabProps) {
  const [intel, setIntel] = useState<ClientIntelligence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastMsgCount = useRef(0);
  const hasFetched = useRef(false);

  const fetchIntel = useCallback(async () => {
    if (messages.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          productType,
          clientName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao gerar inteligencia");
        return;
      }
      setIntel(data);
      lastMsgCount.current = messages.length;
    } catch {
      setError("Erro de conexao");
    } finally {
      setLoading(false);
    }
  }, [messages, productType, clientName]);

  useEffect(() => {
    if (!isVisible || messages.length === 0) return;
    if (hasFetched.current && messages.length === lastMsgCount.current) return;
    hasFetched.current = true;
    fetchIntel();
  }, [isVisible, messages.length, fetchIntel]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Target size={28} className="text-text-muted/20 mb-3" />
        <p className="text-xs text-text-muted">
          Inicie a conversa para ver a inteligencia do cliente
        </p>
      </div>
    );
  }

  if (loading && !intel) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 size={20} className="text-text-muted animate-spin mb-3" />
        <p className="text-[11px] text-text-muted">Analisando conversa...</p>
      </div>
    );
  }

  if (error && !intel) {
    return (
      <div className="p-4">
        <div className="bg-danger/10 border border-danger/20 rounded-lg px-3 py-2.5">
          <p className="text-xs text-danger">{error}</p>
        </div>
        <button
          onClick={fetchIntel}
          className="mt-3 w-full py-2 rounded-lg text-xs text-text-muted border border-border hover:bg-bg-tertiary transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!intel) return null;

  const tempConfig = TEMP_CONFIG[intel.temperature];
  const TempIcon = tempConfig.icon;
  const stale = messages.length !== lastMsgCount.current;

  return (
    <div className="p-3 space-y-3">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-medium ${tempConfig.bg} ${tempConfig.color}`}>
            <TempIcon size={11} />
            {tempConfig.label}
          </div>
          {stale && (
            <span className="text-[9px] text-warning bg-warning/10 px-1.5 py-0.5 rounded">
              Desatualizado
            </span>
          )}
        </div>
        <button
          onClick={fetchIntel}
          disabled={loading}
          className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors disabled:opacity-40"
          title="Atualizar inteligencia"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stage Progress */}
      <div className="bg-bg-primary/60 border border-border rounded-lg p-3">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
          Etapa da venda
        </p>
        <div className="flex items-center gap-1 mb-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                s <= intel.stage ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>
        <p className="text-xs font-medium text-text-primary">
          {intel.stage}. {intel.stageLabel || STAGE_LABELS[intel.stage]}
        </p>
      </div>

      {/* Summary */}
      <div className="bg-bg-primary/60 border border-border rounded-lg p-3">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">
          Resumo
        </p>
        <p className="text-[12px] text-text-secondary leading-relaxed">
          {intel.summary}
        </p>
      </div>

      {/* Desires */}
      {intel.desires.length > 0 && (
        <div className="bg-bg-primary/60 border border-border rounded-lg p-3">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
            <TrendingUp size={10} className="inline mr-1" />
            O que o cliente quer
          </p>
          <div className="space-y-1">
            {intel.desires.map((d, i) => (
              <div key={i} className="flex items-start gap-2">
                <ChevronRight size={10} className="text-accent mt-0.5 shrink-0" />
                <p className="text-[11px] text-text-secondary">{d}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Objections */}
      {intel.objections.length > 0 && (
        <div className="bg-bg-primary/60 border border-border rounded-lg p-3">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
            <AlertCircle size={10} className="inline mr-1" />
            Objecoes levantadas
          </p>
          <div className="space-y-1">
            {intel.objections.map((o, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-warning mt-1.5 shrink-0" />
                <p className="text-[11px] text-warning/80">{o}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Numbers */}
      {intel.keyNumbers.length > 0 && (
        <div className="bg-bg-primary/60 border border-border rounded-lg p-3">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
            <Hash size={10} className="inline mr-1" />
            Numeros-chave
          </p>
          <div className="grid grid-cols-2 gap-2">
            {intel.keyNumbers.map((n, i) => (
              <div key={i} className="bg-bg-secondary rounded-md px-2.5 py-1.5">
                <p className="text-[9px] text-text-muted">{n.label}</p>
                <p className="text-xs font-semibold text-text-primary">{n.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Actions */}
      {intel.nextActions.length > 0 && (
        <div className="bg-bg-primary/60 border border-border rounded-lg p-3">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
            Proximos passos
          </p>
          <div className="space-y-1.5">
            {intel.nextActions.map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${PRIORITY_DOT[a.priority]}`} />
                <p className="text-[11px] text-text-secondary">{a.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Alert */}
      {intel.shouldSendPdf && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={12} className="text-accent" />
            <p className="text-xs font-semibold text-accent">Hora do PDF!</p>
          </div>
          {intel.pdfReason && (
            <p className="text-[11px] text-accent/70">{intel.pdfReason}</p>
          )}
        </div>
      )}
    </div>
  );
}
