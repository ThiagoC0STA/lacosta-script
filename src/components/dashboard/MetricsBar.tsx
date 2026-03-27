"use client";

import {
  Users,
  Zap,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface MetricsBarProps {
  total: number;
  active: number;
  closed: number;
  staleCount: number;
  thisWeekNew: number;
  thisWeekClosed: number;
}

export default function MetricsBar({
  total,
  active,
  closed,
  staleCount,
  thisWeekNew,
  thisWeekClosed,
}: MetricsBarProps) {
  const conversionRate = total > 0 ? Math.round((closed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {/* Total leads */}
      <div className="bg-bg-secondary border border-border rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Users size={13} className="text-info" />
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Total</p>
        </div>
        <p className="text-xl font-bold text-text-primary">{total}</p>
        <p className="text-[10px] text-text-muted mt-0.5">
          +{thisWeekNew} esta semana
        </p>
      </div>

      {/* Active */}
      <div className="bg-bg-secondary border border-border rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Zap size={13} className="text-emerald-400" />
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Ativos</p>
        </div>
        <p className="text-xl font-bold text-emerald-400">{active}</p>
        <p className="text-[10px] text-text-muted mt-0.5">em andamento</p>
      </div>

      {/* Conversion */}
      <div className="bg-bg-secondary border border-border rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <TrendingUp size={13} className="text-accent" />
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Conversao</p>
        </div>
        <p className="text-xl font-bold text-text-primary">{conversionRate}%</p>
        <p className="text-[10px] text-text-muted mt-0.5">
          {closed} fechado{closed !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Pending follow-up */}
      <div className={`bg-bg-secondary border rounded-lg p-3 ${
        staleCount > 0 ? "border-warning/30" : "border-border"
      }`}>
        <div className="flex items-center gap-2 mb-1.5">
          <AlertTriangle size={13} className={staleCount > 0 ? "text-warning" : "text-text-muted"} />
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Follow-up</p>
        </div>
        <p className={`text-xl font-bold ${staleCount > 0 ? "text-warning" : "text-text-primary"}`}>
          {staleCount}
        </p>
        <p className="text-[10px] text-text-muted mt-0.5">
          parado{staleCount !== 1 ? "s" : ""} 3+ dias
        </p>
      </div>

      {/* Weekly report mini */}
      <div className="bg-bg-secondary border border-border rounded-lg p-3 col-span-2 lg:col-span-1">
        <div className="flex items-center gap-2 mb-1.5">
          <TrendingUp size={13} className="text-info" />
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Semana</p>
        </div>
        <div className="flex items-baseline gap-3">
          <div>
            <p className="text-lg font-bold text-text-primary">{thisWeekNew}</p>
            <p className="text-[9px] text-text-muted">novos</p>
          </div>
          <div>
            <p className="text-lg font-bold text-accent">{thisWeekClosed}</p>
            <p className="text-[9px] text-text-muted">fechados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
