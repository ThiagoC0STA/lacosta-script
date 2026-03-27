"use client";

import { useState } from "react";
import {
  BarChart3,
  Trophy,
  AlertTriangle,
  Lightbulb,
  Loader2,
  Brain,
  Check,
} from "lucide-react";
import type { Message, AnalysisResponse } from "@/types/database";

interface AnalysisTabProps {
  messages: Message[];
  clientName: string;
  productType: string;
  isVisible: boolean;
}

export default function AnalysisTab({
  messages,
  clientName,
  productType,
  isVisible,
}: AnalysisTabProps) {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [learnStatus, setLearnStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [learnedInsights, setLearnedInsights] = useState<string[]>([]);

  const loadAnalysis = async () => {
    if (messages.length === 0) {
      setError("Precisa ter mensagens na conversa");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
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
        setError(data.error || "Erro na analise");
        return;
      }

      setAnalysis(data);
      setHasLoaded(true);
    } catch {
      setError("Erro de conexao");
    } finally {
      setLoading(false);
    }
  };

  const handleLearn = async () => {
    if (!analysis || learnStatus === "saving") return;
    setLearnStatus("saving");

    try {
      const res = await fetch("/api/learnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLearnStatus("error");
        return;
      }

      setLearnedInsights(data.insights || []);
      setLearnStatus("saved");
    } catch {
      setLearnStatus("error");
    }
  };

  const scoreColor =
    (analysis?.score ?? 0) >= 7
      ? "text-accent"
      : (analysis?.score ?? 0) >= 4
      ? "text-warning"
      : "text-danger";

  const scoreBg =
    (analysis?.score ?? 0) >= 7
      ? "bg-accent/10 border-accent/20"
      : (analysis?.score ?? 0) >= 4
      ? "bg-warning/10 border-warning/20"
      : "bg-danger/10 border-danger/20";

  if (!isVisible) return null;

  if (!hasLoaded && !loading) {
    return (
      <div className="text-center py-12 px-4">
        <BarChart3 size={28} className="text-text-muted/20 mx-auto mb-4" />
        <p className="text-xs text-text-secondary mb-1">Analise com IA</p>
        <p className="text-[11px] text-text-muted mb-6 max-w-[220px] mx-auto leading-relaxed">
          A IA analisa a conversa e aponta acertos, erros e sugestoes.
        </p>
        <button
          onClick={loadAnalysis}
          disabled={messages.length === 0}
          className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-info text-white hover:bg-info/80 transition-colors disabled:opacity-30"
        >
          Analisar conversa
        </button>
        {messages.length === 0 && (
          <p className="text-[10px] text-text-muted mt-3">Inicie a conversa primeiro</p>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader2 size={20} className="text-info mx-auto mb-3 animate-spin" />
        <p className="text-xs text-text-muted">Analisando...</p>
      </div>
    );
  }

  if (error && !analysis) {
    return (
      <div className="p-4">
        <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2.5 mb-3">
          {error}
        </p>
        <button
          onClick={loadAnalysis}
          className="w-full py-2 rounded-lg text-xs text-text-muted border border-border hover:bg-bg-tertiary transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="p-3 space-y-3">
      {/* Score */}
      <div className={`rounded-lg border p-3 text-center ${scoreBg}`}>
        <p className={`text-3xl font-bold ${scoreColor}`}>
          {analysis.score}<span className="text-sm">/10</span>
        </p>
        <p className="text-[11px] text-text-muted mt-1">{analysis.summary}</p>
      </div>

      {/* Wins */}
      {analysis.wins.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Trophy size={12} className="text-accent" />
            <p className="text-[10px] font-semibold text-accent uppercase tracking-wider">Acertos</p>
          </div>
          <div className="space-y-1">
            {analysis.wins.map((w, i) => (
              <div key={i} className="bg-accent/5 border border-accent/10 rounded-md px-2.5 py-2">
                <p className="text-[11px] text-text-secondary leading-relaxed">{w}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mistakes */}
      {analysis.mistakes.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle size={12} className="text-warning" />
            <p className="text-[10px] font-semibold text-warning uppercase tracking-wider">Erros</p>
          </div>
          <div className="space-y-1">
            {analysis.mistakes.map((m, i) => (
              <div key={i} className="bg-warning/5 border border-warning/10 rounded-md px-2.5 py-2">
                <p className="text-[11px] text-text-secondary leading-relaxed">{m}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb size={12} className="text-info" />
            <p className="text-[10px] font-semibold text-info uppercase tracking-wider">Sugestoes</p>
          </div>
          <div className="space-y-1">
            {analysis.suggestions.map((s, i) => (
              <div key={i} className="bg-info/5 border border-info/10 rounded-md px-2.5 py-2">
                <p className="text-[11px] text-text-secondary leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learn button */}
      {learnStatus === "saved" && learnedInsights.length > 0 ? (
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Brain size={12} className="text-accent" />
            <p className="text-[10px] font-semibold text-accent">Aprendido!</p>
          </div>
          <div className="space-y-1">
            {learnedInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check size={10} className="text-accent mt-0.5 shrink-0" />
                <p className="text-[10px] text-text-secondary leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={handleLearn}
          disabled={learnStatus === "saving"}
          className="w-full py-2.5 rounded-lg text-xs font-semibold border border-accent/30 text-accent bg-accent/5 hover:bg-accent/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {learnStatus === "saving" ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Aprendendo...
            </>
          ) : learnStatus === "error" ? (
            "Erro ao salvar. Tente novamente"
          ) : (
            <>
              <Brain size={12} />
              Aprender com esta analise
            </>
          )}
        </button>
      )}

      {/* Re-analyze */}
      <button
        onClick={() => {
          setLearnStatus("idle");
          setLearnedInsights([]);
          loadAnalysis();
        }}
        className="w-full py-2 rounded-lg text-xs font-medium border border-border text-text-muted hover:text-text-secondary hover:bg-bg-tertiary transition-colors"
      >
        Analisar novamente
      </button>
    </div>
  );
}
