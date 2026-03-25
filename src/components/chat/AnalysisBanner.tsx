"use client";

import { Lightbulb, AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface AnalysisBannerProps {
  tips: string[];
  errors: string[];
}

export default function AnalysisBanner({ tips, errors }: AnalysisBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (tips.length === 0 && errors.length === 0)) return null;

  return (
    <div className="px-4 pb-1">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-bg-secondary border border-border rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-border/50">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Análise da IA
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-text-muted hover:text-text-secondary p-1 rounded-lg hover:bg-bg-tertiary transition-colors"
          >
            <X size={12} />
          </button>
        </div>
        <div className="px-3.5 py-2.5 space-y-1.5">
          {errors.map((error, i) => (
            <div key={`e-${i}`} className="flex items-start gap-2">
              <AlertTriangle size={12} className="text-warning mt-0.5 shrink-0" />
              <p className="text-[11px] text-warning/80">{error}</p>
            </div>
          ))}
          {tips.map((tip, i) => (
            <div key={`t-${i}`} className="flex items-start gap-2">
              <Lightbulb size={12} className="text-info mt-0.5 shrink-0" />
              <p className="text-[11px] text-text-muted">{tip}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
