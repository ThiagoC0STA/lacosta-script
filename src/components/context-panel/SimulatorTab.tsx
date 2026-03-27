"use client";

import { useState, useMemo } from "react";
import { Calculator, Copy, Check, TrendingDown } from "lucide-react";

const TERMS = [60, 72, 84, 96, 120, 150, 180, 200, 240];
const ADMIN_RATE = 0.18;
const RESERVE_RATE = 0.02;
const ANNUAL_RATE = 0.12;
const MONTHLY_RATE = Math.pow(1 + ANNUAL_RATE, 1 / 12) - 1;

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function SimulatorTab() {
  const [creditValue, setCreditValue] = useState("");
  const [term, setTerm] = useState(120);
  const [copied, setCopied] = useState(false);

  const rawValue = useMemo(() => {
    const digits = creditValue.replace(/\D/g, "");
    return digits ? parseInt(digits, 10) / 100 : 0;
  }, [creditValue]);

  const result = useMemo(() => {
    if (rawValue <= 0 || term <= 0) return null;

    const totalConsorcio = rawValue * (1 + ADMIN_RATE + RESERVE_RATE);
    const parcelaConsorcio = totalConsorcio / term;

    const r = MONTHLY_RATE;
    const factor = (r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
    const parcelaFinanc = rawValue * factor;
    const totalFinanc = parcelaFinanc * term;

    const savings = totalFinanc - totalConsorcio;

    return { parcelaConsorcio, totalConsorcio, parcelaFinanc, totalFinanc, savings };
  }, [rawValue, term]);

  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) { setCreditValue(""); return; }
    const num = parseInt(digits, 10) / 100;
    setCreditValue(num.toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
  };

  const handleCopy = () => {
    if (!result) return;
    const text = [
      `📊 *Simulação Consórcio vs Financiamento*`,
      ``,
      `💰 Carta de crédito: ${formatBRL(rawValue)}`,
      `📅 Prazo: ${term} meses`,
      ``,
      `✅ *Consórcio*`,
      `Parcela: ${formatBRL(result.parcelaConsorcio)}`,
      `Total: ${formatBRL(result.totalConsorcio)}`,
      ``,
      `🏦 *Financiamento (CET ~12% a.a.)*`,
      `Parcela: ${formatBRL(result.parcelaFinanc)}`,
      `Total: ${formatBRL(result.totalFinanc)}`,
      ``,
      `🟢 *Economia com consórcio: ${formatBRL(result.savings)}*`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Calculator size={14} className="text-text-muted" />
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
          Simulador de Consórcio
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-2">
        <div>
          <label className="text-[10px] text-text-muted mb-1 block">Valor da Carta (R$)</label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-text-muted">R$</span>
            <input
              type="text"
              inputMode="numeric"
              value={creditValue}
              onChange={handleCurrencyInput}
              placeholder="0,00"
              className="w-full bg-bg-primary border border-border rounded-lg pl-8 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted/40 outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-text-muted mb-1 block">Prazo (meses)</label>
          <select
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:border-accent/50 transition-colors appearance-none cursor-pointer"
          >
            {TERMS.map((t) => (
              <option key={t} value={t}>{t} meses</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {/* Consorcio */}
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-2.5">
              <p className="text-[9px] font-semibold text-accent uppercase tracking-wider mb-2">Consórcio</p>
              <div className="space-y-1.5">
                <div>
                  <p className="text-[9px] text-text-muted">Parcela</p>
                  <p className="text-[13px] font-bold text-accent">{formatBRL(result.parcelaConsorcio)}</p>
                </div>
                <div>
                  <p className="text-[9px] text-text-muted">Total</p>
                  <p className="text-[11px] font-medium text-text-secondary">{formatBRL(result.totalConsorcio)}</p>
                </div>
              </div>
            </div>

            {/* Financiamento */}
            <div className="bg-danger/5 border border-danger/20 rounded-lg p-2.5">
              <p className="text-[9px] font-semibold text-danger uppercase tracking-wider mb-2">Financiamento</p>
              <div className="space-y-1.5">
                <div>
                  <p className="text-[9px] text-text-muted">Parcela</p>
                  <p className="text-[13px] font-bold text-danger">{formatBRL(result.parcelaFinanc)}</p>
                </div>
                <div>
                  <p className="text-[9px] text-text-muted">Total</p>
                  <p className="text-[11px] font-medium text-text-secondary">{formatBRL(result.totalFinanc)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Savings */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <TrendingDown size={12} className="text-accent" />
              <p className="text-[10px] font-semibold text-accent uppercase tracking-wider">Economia Total</p>
            </div>
            <p className="text-xl font-bold text-accent">{formatBRL(result.savings)}</p>
            <p className="text-[9px] text-text-muted mt-0.5">
              com consórcio vs financiamento
            </p>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="w-full py-2 rounded-lg text-xs font-medium border border-border text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <><Check size={12} className="text-accent" /><span className="text-accent">Copiado!</span></>
            ) : (
              <><Copy size={12} />Copiar resumo</>
            )}
          </button>
        </>
      )}

      {!result && (
        <div className="text-center py-6">
          <Calculator size={24} className="text-text-muted/20 mx-auto mb-2" />
          <p className="text-[11px] text-text-muted">
            Preencha os campos para simular
          </p>
        </div>
      )}
    </div>
  );
}
