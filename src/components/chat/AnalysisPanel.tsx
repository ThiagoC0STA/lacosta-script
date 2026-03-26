"use client";

import { useState } from "react";
import {
  X,
  BarChart3,
  Trophy,
  AlertTriangle,
  Lightbulb,
  Loader2,
  Brain,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Message, AnalysisResponse } from "@/types/database";

interface AnalysisPanelProps {
  open: boolean;
  onClose: () => void;
  messages: Message[];
  clientName: string;
  productType: string;
}

export default function AnalysisPanel({
  open,
  onClose,
  messages,
  clientName,
  productType,
}: AnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [learnStatus, setLearnStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
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
        setError(data.error || "Erro na análise");
        return;
      }

      setAnalysis(data);
      setHasLoaded(true);
    } catch {
      setError("Erro de conexão");
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

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-bg-secondary border-l border-border z-50 flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-info" />
                <h2 className="text-sm font-semibold">Análise da Conversa</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {!hasLoaded && !loading && (
                <div className="text-center py-12">
                  <BarChart3 size={32} className="text-text-muted/30 mx-auto mb-4" />
                  <p className="text-sm text-text-secondary mb-1">
                    Análise com IA
                  </p>
                  <p className="text-[11px] text-text-muted mb-6 max-w-[240px] mx-auto leading-relaxed">
                    A IA vai analisar toda a conversa e apontar acertos, erros e
                    sugestões de melhoria.
                  </p>
                  <button
                    onClick={loadAnalysis}
                    disabled={messages.length === 0}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-info text-white hover:bg-info/80 transition-colors disabled:opacity-30"
                  >
                    Analisar conversa
                  </button>
                  {messages.length === 0 && (
                    <p className="text-[10px] text-text-muted mt-3">
                      Inicie a conversa primeiro
                    </p>
                  )}
                </div>
              )}

              {loading && (
                <div className="text-center py-16">
                  <Loader2 size={24} className="text-info mx-auto mb-3 animate-spin" />
                  <p className="text-xs text-text-muted">Analisando...</p>
                </div>
              )}

              {error && (
                <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-xl px-4 py-2.5 mb-4">
                  {error}
                </p>
              )}

              {analysis && !loading && (
                <div className="space-y-5">
                  {/* Score */}
                  <div className={`rounded-xl border p-4 text-center ${scoreBg}`}>
                    <p className={`text-4xl font-bold ${scoreColor}`}>
                      {analysis.score}<span className="text-lg">/10</span>
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {analysis.summary}
                    </p>
                  </div>

                  {/* Wins */}
                  {analysis.wins.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Trophy size={13} className="text-accent" />
                        <p className="text-xs font-semibold text-accent">Acertos</p>
                      </div>
                      <div className="space-y-1.5">
                        {analysis.wins.map((w, i) => (
                          <div
                            key={i}
                            className="bg-accent/5 border border-accent/10 rounded-lg px-3 py-2"
                          >
                            <p className="text-[12px] text-text-secondary leading-relaxed">{w}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mistakes */}
                  {analysis.mistakes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle size={13} className="text-warning" />
                        <p className="text-xs font-semibold text-warning">Erros</p>
                      </div>
                      <div className="space-y-1.5">
                        {analysis.mistakes.map((m, i) => (
                          <div
                            key={i}
                            className="bg-warning/5 border border-warning/10 rounded-lg px-3 py-2"
                          >
                            <p className="text-[12px] text-text-secondary leading-relaxed">{m}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {analysis.suggestions.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Lightbulb size={13} className="text-info" />
                        <p className="text-xs font-semibold text-info">Sugestões</p>
                      </div>
                      <div className="space-y-1.5">
                        {analysis.suggestions.map((s, i) => (
                          <div
                            key={i}
                            className="bg-info/5 border border-info/10 rounded-lg px-3 py-2"
                          >
                            <p className="text-[12px] text-text-secondary leading-relaxed">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learn button */}
                  {learnStatus === "saved" && learnedInsights.length > 0 ? (
                    <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Brain size={13} className="text-accent" />
                        <p className="text-xs font-semibold text-accent">
                          Aprendido!
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        {learnedInsights.map((insight, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2"
                          >
                            <Check
                              size={11}
                              className="text-accent mt-0.5 shrink-0"
                            />
                            <p className="text-[11px] text-text-secondary leading-relaxed">
                              {insight}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-text-muted mt-2">
                        A IA vai usar esses aprendizados nas próximas conversas.
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleLearn}
                      disabled={learnStatus === "saving"}
                      className="w-full py-3 rounded-xl text-xs font-semibold border border-accent/30 text-accent bg-accent/5 hover:bg-accent/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {learnStatus === "saving" ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Aprendendo...
                        </>
                      ) : learnStatus === "error" ? (
                        "Erro ao salvar. Tente novamente"
                      ) : (
                        <>
                          <Brain size={13} />
                          Aprender com esta análise
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
                    className="w-full py-2.5 rounded-xl text-xs font-medium border border-border text-text-muted hover:text-text-secondary hover:bg-bg-tertiary transition-colors"
                  >
                    Analisar novamente
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
