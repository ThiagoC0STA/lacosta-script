"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Swords,
  Send,
  Loader2,
  Trophy,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  User,
  Headset,
} from "lucide-react";
import { motion } from "framer-motion";

interface RoleplayMessage {
  role: "seller" | "client";
  content: string;
}

interface Feedback {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  tip: string;
}

const SCENARIOS = [
  { id: "price", label: "Objecao de preco", description: "Cliente acha caro e nao cabe no orcamento", difficulty: "Medio" },
  { id: "trust", label: "Desconfianca", description: "Cliente nao confia em consorcio", difficulty: "Dificil" },
  { id: "financing", label: "Prefere financiamento", description: "Cliente quer financiamento, nao consorcio", difficulty: "Medio" },
  { id: "thinking", label: "Vou pensar", description: "Cliente sempre adia a decisao", difficulty: "Facil" },
  { id: "expert", label: "Cliente expert", description: "Ja conhece consorcio e testa seu conhecimento", difficulty: "Dificil" },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Facil: "text-accent bg-accent/10 border-accent/20",
  Medio: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Dificil: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function TrainingPage() {
  const [scenario, setScenario] = useState<string | null>(null);
  const [messages, setMessages] = useState<RoleplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleStart = async (scenarioId: string) => {
    setScenario(scenarioId);
    setMessages([]);
    setFinished(false);
    setFeedback(null);
    setLoading(true);

    try {
      const res = await fetch("/api/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: scenarioId, messages: [] }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([{ role: "client", content: data.message }]);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading || finished || !scenario) return;

    const sellerMsg: RoleplayMessage = { role: "seller", content: input.trim() };
    const updated = [...messages, sellerMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, messages: updated }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "client", content: data.message }]);
        if (data.isFinished) {
          setFinished(true);
          setFeedback(data.feedback);
        }
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleReset = () => {
    setScenario(null);
    setMessages([]);
    setFinished(false);
    setFeedback(null);
    setInput("");
  };

  const scoreColor = (feedback?.score ?? 0) >= 7 ? "text-accent" : (feedback?.score ?? 0) >= 4 ? "text-warning" : "text-danger";

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border bg-bg-secondary shrink-0">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <Swords size={16} className="text-info" />
          <h1 className="text-sm font-semibold">Modo Treino</h1>
          {scenario && (
            <button onClick={handleReset} className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-text-muted border border-border hover:bg-bg-tertiary transition-colors">
              <RotateCcw size={11} />
              Novo cenario
            </button>
          )}
        </div>
      </header>

      {/* Scenario selection */}
      {!scenario && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="text-center mb-6">
              <Swords size={32} className="text-info/30 mx-auto mb-3" />
              <h2 className="text-sm font-semibold text-text-primary mb-1">Escolha um cenario</h2>
              <p className="text-[11px] text-text-muted max-w-sm mx-auto">
                A IA simula um cliente real. Pratique suas respostas e receba feedback no final.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleStart(s.id)}
                  className="bg-bg-secondary border border-border rounded-lg p-4 text-left hover:border-border-light hover:bg-bg-tertiary/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-text-primary group-hover:text-info transition-colors">
                      {s.label}
                    </p>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${DIFFICULTY_COLOR[s.difficulty]}`}>
                      {s.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">{s.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat area */}
      {scenario && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "seller" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === "seller" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                      msg.role === "seller" ? "bg-info/10 text-info" : "bg-bg-tertiary text-text-muted"
                    }`}>
                      {msg.role === "seller" ? <Headset size={12} /> : <User size={12} />}
                    </div>
                    <div className={`rounded-lg px-3 py-2 ${
                      msg.role === "seller"
                        ? "bg-info/10 border border-info/20"
                        : "bg-bg-secondary border border-border"
                    }`}>
                      <p className="text-xs text-text-secondary whitespace-pre-line leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-text-muted">
                  <Loader2 size={14} className="animate-spin" />
                  <p className="text-[11px]">Cliente digitando...</p>
                </div>
              )}

              {/* Feedback */}
              {finished && feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-bg-secondary border border-border rounded-lg p-4 space-y-3"
                >
                  <div className="text-center">
                    <p className={`text-3xl font-bold ${scoreColor}`}>
                      {feedback.score}<span className="text-sm">/10</span>
                    </p>
                    <p className="text-[11px] text-text-muted mt-1">{feedback.summary}</p>
                  </div>

                  {feedback.strengths.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Trophy size={11} className="text-accent" />
                        <p className="text-[10px] font-semibold text-accent uppercase tracking-wider">Pontos fortes</p>
                      </div>
                      {feedback.strengths.map((s, i) => (
                        <p key={i} className="text-[11px] text-text-secondary ml-4 leading-relaxed">- {s}</p>
                      ))}
                    </div>
                  )}

                  {feedback.improvements.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <AlertTriangle size={11} className="text-warning" />
                        <p className="text-[10px] font-semibold text-warning uppercase tracking-wider">Melhorar</p>
                      </div>
                      {feedback.improvements.map((s, i) => (
                        <p key={i} className="text-[11px] text-text-secondary ml-4 leading-relaxed">- {s}</p>
                      ))}
                    </div>
                  )}

                  {feedback.tip && (
                    <div className="bg-info/5 border border-info/10 rounded-md px-3 py-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Lightbulb size={11} className="text-info" />
                        <p className="text-[10px] font-semibold text-info">Dica</p>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed">{feedback.tip}</p>
                    </div>
                  )}

                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:bg-bg-tertiary transition-colors"
                  >
                    Treinar outro cenario
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Input */}
          {!finished && (
            <div className="border-t border-border bg-bg-secondary px-4 py-3 shrink-0">
              <div className="max-w-3xl mx-auto flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Responda como vendedor..."
                  disabled={loading}
                  className="flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-border-light placeholder:text-text-muted/30 disabled:opacity-50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="px-4 py-2.5 rounded-lg bg-info text-white text-xs font-medium hover:bg-info/80 transition-colors disabled:opacity-30"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
