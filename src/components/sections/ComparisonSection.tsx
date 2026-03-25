"use client";

import { useState, useMemo } from "react";
import { BarChart3 } from "lucide-react";
import Section from "../Section";
import CopyButton from "../CopyButton";
import { getProductById } from "@/data/products";

interface ComparisonSectionProps {
  productId: string;
  clientName: string;
}

export default function ComparisonSection({
  productId,
  clientName,
}: ComparisonSectionProps) {
  const product = getProductById(productId);
  const [creditValue, setCreditValue] = useState(100000);
  const [months, setMonths] = useState(120);

  const calc = useMemo(() => {
    if (!product) return null;

    const monthlyRate = product.financingRate / 100;
    const finInstallment =
      (creditValue * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const finTotal = finInstallment * months;
    const finInterest = finTotal - creditValue;

    const adminFee = creditValue * product.consortiumRate;
    const conInstallment = (creditValue + adminFee) / months;
    const conTotal = creditValue + adminFee;

    const savings = finTotal - conTotal;

    return {
      finInstallment,
      finTotal,
      finInterest,
      conInstallment,
      conTotal,
      adminFee,
      savings,
    };
  }, [creditValue, months, product]);

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(v);

  if (!product || !calc) return null;

  const comparisonText = `${clientName ? `${clientName}, ` : ""}olha a diferença:\n\n🔴 Financiamento de ${fmt(creditValue)}:\nParcela: ${fmt(calc.finInstallment)}/mês\nTotal pago: ${fmt(calc.finTotal)}\n💸 Juros pro banco: ${fmt(calc.finInterest)}\n\n🟢 Consórcio de ${fmt(creditValue)}:\nParcela: ${fmt(calc.conInstallment)}/mês\nTotal pago: ${fmt(calc.conTotal)}\n✅ Economia: ${fmt(calc.savings)}\n\nSão ${fmt(calc.savings)} que ficam no SEU bolso, não no banco! Com essa economia, ${product.closingHook}.`;

  return (
    <Section
      title="Comparativo"
      subtitle="Financiamento vs Consórcio — com números reais"
      icon={BarChart3}
    >
      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-navy-medium/40 rounded-lg p-3">
        <div>
          <label className="text-[10px] text-foreground/50 mb-1 block">
            Crédito: <span className="text-gold font-semibold">{fmt(creditValue)}</span>
          </label>
          <input
            type="range"
            min={20000}
            max={1000000}
            step={10000}
            value={creditValue}
            onChange={(e) => setCreditValue(Number(e.target.value))}
            className="w-full accent-gold h-1.5"
          />
        </div>
        <div>
          <label className="text-[10px] text-foreground/50 mb-1 block">
            Prazo: <span className="text-gold font-semibold">{months} meses</span>
          </label>
          <input
            type="range"
            min={24}
            max={240}
            step={12}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full accent-gold h-1.5"
          />
        </div>
      </div>

      {/* Side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3 bg-accent-red/5 border border-accent-red/15">
          <p className="text-[10px] font-bold text-accent-red mb-2">
            🔴 FINANCIAMENTO
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[10px] text-foreground/40">Parcela</span>
              <span className="text-xs font-bold text-accent-red">
                {fmt(calc.finInstallment)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-foreground/40">Total</span>
              <span className="text-[11px] text-foreground/60">
                {fmt(calc.finTotal)}
              </span>
            </div>
            <div className="h-px bg-accent-red/10" />
            <div className="flex justify-between">
              <span className="text-[10px] text-accent-red/70">Juros</span>
              <span className="text-xs font-bold text-accent-red">
                {fmt(calc.finInterest)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-3 bg-accent-green/5 border border-accent-green/15">
          <p className="text-[10px] font-bold text-accent-green mb-2">
            🟢 CONSÓRCIO
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[10px] text-foreground/40">Parcela</span>
              <span className="text-xs font-bold text-accent-green">
                {fmt(calc.conInstallment)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-foreground/40">Total</span>
              <span className="text-[11px] text-foreground/60">
                {fmt(calc.conTotal)}
              </span>
            </div>
            <div className="h-px bg-accent-green/10" />
            <div className="flex justify-between">
              <span className="text-[10px] text-accent-green/70">Taxa adm</span>
              <span className="text-xs font-bold text-accent-green">
                {fmt(calc.adminFee)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings */}
      <div className="text-center bg-navy-medium/50 rounded-lg p-3">
        <p className="text-[10px] text-foreground/40 mb-1">
          Economia total
        </p>
        <p className="text-xl font-bold shimmer-gold">{fmt(calc.savings)}</p>
      </div>

      {/* Copy comparison */}
      <div className="flex justify-end">
        <CopyButton text={comparisonText} className="text-xs" />
      </div>
    </Section>
  );
}
