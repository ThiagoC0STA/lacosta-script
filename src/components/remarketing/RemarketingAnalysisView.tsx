"use client";

import {
  Target,
  AlertTriangle,
  MessageSquare,
  Brain,
  Clock,
  Compass,
  Volume2,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Lightbulb,
  User,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import type { RemarketingAnalysis } from "@/types/database";

interface RemarketingAnalysisViewProps {
  analysis: RemarketingAnalysis;
  clientName: string;
}

export default function RemarketingAnalysisView({
  analysis,
  clientName,
}: RemarketingAnalysisViewProps) {
  return (
    <div className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <ScoreCard analysis={analysis} clientName={clientName} />
      <ClientProfileCard profile={analysis.client_profile} />
      <ErrorsCard errors={analysis.conversation_errors} />
      <StrategyCard strategy={analysis.reapproach_strategy} />
      <SuggestedMessagesCard messages={analysis.suggested_messages} />
      <ReasoningCard reasoning={analysis.reasoning} />
    </div>
  );
}

function ScoreCard({
  analysis,
  clientName,
}: {
  analysis: RemarketingAnalysis;
  clientName: string;
}) {
  const score = analysis.remarketing_score;
  const scoreColor =
    score >= 7 ? "text-accent" : score >= 4 ? "text-amber-400" : "text-danger";
  const scoreBg =
    score >= 7
      ? "from-accent/10 to-accent/5 border-accent/20"
      : score >= 4
      ? "from-amber-400/10 to-amber-400/5 border-amber-400/20"
      : "from-danger/10 to-danger/5 border-danger/20";
  const badgeBg =
    score >= 7
      ? "bg-accent/15 text-accent border-accent/30"
      : score >= 4
      ? "bg-amber-400/15 text-amber-300 border-amber-400/30"
      : "bg-danger/15 text-danger border-danger/30";

  return (
    <div
      className={`rounded-xl border bg-linear-to-br ${scoreBg} p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} className={scoreColor} />
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${scoreColor}`}
            >
              Remarketing Score
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className={`text-4xl font-bold ${scoreColor}`}>{score}</span>
            <span className="text-lg text-text-muted">/10</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {analysis.verdict}
          </p>
        </div>

        <div
          className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider shrink-0 ${badgeBg}`}
        >
          {analysis.is_good_lead ? "Reabordar" : "Baixa prioridade"}
        </div>
      </div>

      {clientName && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-[11px] text-text-muted">
            Lead: <span className="text-text-secondary font-medium">{clientName}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function ClientProfileCard({
  profile,
}: {
  profile: RemarketingAnalysis["client_profile"];
}) {
  const interestConfig = {
    high: { label: "Alto", color: "text-accent", bg: "bg-accent/10" },
    medium: { label: "Médio", color: "text-amber-400", bg: "bg-amber-400/10" },
    low: { label: "Baixo", color: "text-danger", bg: "bg-danger/10" },
  };

  const interest = interestConfig[profile.interest_level];

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-4">
      <div className="flex items-center gap-2 mb-3">
        <User size={13} className="text-info" />
        <p className="text-xs font-semibold text-info">Perfil do Cliente</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-bg-primary rounded-lg p-3 border border-border">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
            Interesse
          </p>
          <div className="flex items-center gap-1.5">
            <TrendingUp size={12} className={interest.color} />
            <span className={`text-xs font-semibold ${interest.color}`}>
              {interest.label}
            </span>
          </div>
        </div>
        <div className="bg-bg-primary rounded-lg p-3 border border-border">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
            Estágio
          </p>
          <div className="flex items-center gap-1.5">
            <ShoppingCart size={12} className="text-text-secondary" />
            <span className="text-xs font-medium text-text-secondary truncate">
              {profile.buying_stage}
            </span>
          </div>
        </div>
      </div>

      {profile.desires.length > 0 && (
        <div className="mb-2.5">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">
            O que o cliente quer
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.desires.map((d, i) => (
              <span
                key={i}
                className="text-[11px] bg-accent/8 text-accent/80 border border-accent/15 rounded-lg px-2.5 py-1"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {profile.objections.length > 0 && (
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">
            Objeções levantadas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.objections.map((o, i) => (
              <span
                key={i}
                className="text-[11px] bg-warning/8 text-warning/80 border border-warning/15 rounded-lg px-2.5 py-1"
              >
                {o}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ErrorsCard({
  errors,
}: {
  errors: RemarketingAnalysis["conversation_errors"];
}) {
  if (errors.length === 0) return null;

  const impactConfig = {
    critical: {
      label: "Crítico",
      color: "text-danger",
      bg: "bg-danger/10 border-danger/15",
      icon: ShieldAlert,
    },
    moderate: {
      label: "Moderado",
      color: "text-warning",
      bg: "bg-warning/10 border-warning/15",
      icon: AlertTriangle,
    },
    minor: {
      label: "Menor",
      color: "text-text-muted",
      bg: "bg-bg-tertiary border-border",
      icon: Lightbulb,
    },
  };

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={13} className="text-warning" />
        <p className="text-xs font-semibold text-warning">
          Erros na Conversa
        </p>
        <span className="text-[10px] bg-warning/10 text-warning/70 rounded-full px-2 py-0.5 font-medium">
          {errors.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {errors.map((err, i) => {
          const config = impactConfig[err.impact];
          const Icon = config.icon;
          return (
            <div key={i} className={`rounded-lg border p-3 ${config.bg}`}>
              <div className="flex items-start gap-2">
                <Icon size={13} className={`${config.color} mt-0.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[12px] font-medium text-text-primary">
                      {err.error}
                    </p>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider ${config.color} shrink-0`}
                    >
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 mt-1.5">
                    <TrendingDown
                      size={10}
                      className="text-accent mt-0.5 shrink-0"
                    />
                    <p className="text-[11px] text-accent/80 leading-relaxed">
                      {err.fix}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StrategyCard({
  strategy,
}: {
  strategy: RemarketingAnalysis["reapproach_strategy"];
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-4">
      <div className="flex items-center gap-2 mb-3">
        <Compass size={13} className="text-amber-400" />
        <p className="text-xs font-semibold text-amber-400">
          Estratégia de Reabordagem
        </p>
      </div>

      <div className="grid gap-2.5">
        <div className="flex items-start gap-2.5 bg-bg-primary rounded-lg p-3 border border-border">
          <Clock size={13} className="text-info mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
              Timing ideal
            </p>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              {strategy.best_timing}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-bg-primary rounded-lg p-3 border border-border">
          <Target size={13} className="text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
              Ângulo de abordagem
            </p>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              {strategy.angle}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-bg-primary rounded-lg p-3 border border-border">
          <Volume2 size={13} className="text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
              Tom recomendado
            </p>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              {strategy.tone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestedMessagesCard({
  messages,
}: {
  messages: RemarketingAnalysis["suggested_messages"];
}) {
  if (messages.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={13} className="text-accent" />
        <p className="text-xs font-semibold text-accent">
          Mensagens Prontas para Enviar
        </p>
      </div>

      <div className="space-y-3">
        {messages.map((msg, i) => (
          <MessageCard key={i} message={msg.message} style={msg.style} index={i} />
        ))}
      </div>
    </div>
  );
}

function MessageCard({
  message,
  style,
  index,
}: {
  message: string;
  style: string;
  index: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.replace(/\\n/g, "\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-bg-primary rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
          Opção {index + 1} · {style}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-text-muted hover:text-accent transition-colors px-2 py-1 rounded-md hover:bg-accent/10"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <div className="px-3 py-3">
        <p className="text-[12px] text-text-secondary leading-relaxed whitespace-pre-line">
          {message}
        </p>
      </div>
    </div>
  );
}

function ReasoningCard({ reasoning }: { reasoning: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-4">
      <div className="flex items-center gap-2 mb-2">
        <Brain size={13} className="text-info" />
        <p className="text-xs font-semibold text-info">Raciocínio da IA</p>
      </div>
      <p className="text-[12px] text-text-muted leading-relaxed">{reasoning}</p>
    </div>
  );
}
