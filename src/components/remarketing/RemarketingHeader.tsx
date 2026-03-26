"use client";

import { ArrowLeft, RefreshCcw, Zap } from "lucide-react";
import Link from "next/link";

interface RemarketingHeaderProps {
  totalCount: number;
  analyzedCount: number;
}

export default function RemarketingHeader({
  totalCount,
  analyzedCount,
}: RemarketingHeaderProps) {
  return (
    <header className="border-b border-border bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary border border-transparent hover:border-border transition-all shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/20 flex items-center justify-center shrink-0">
                <RefreshCcw size={16} className="text-amber-400" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-semibold truncate">
                  Central de Remarketing
                </h1>
                <p className="text-[11px] text-text-muted">
                  Análise inteligente de leads para reabordagem
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-1.5">
              <Zap size={12} className="text-amber-400" />
              <span className="text-[11px] font-medium text-amber-300">
                {totalCount} {totalCount === 1 ? "conversa" : "conversas"}
              </span>
            </div>
            {analyzedCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-lg px-3 py-1.5">
                <span className="text-[11px] font-medium text-accent">
                  {analyzedCount} {analyzedCount === 1 ? "analisada" : "analisadas"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
