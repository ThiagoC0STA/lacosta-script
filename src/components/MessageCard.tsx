"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CopyButton from "./CopyButton";

interface MessageCardProps {
  label: string;
  versions: string[];
  phase?: string;
}

export default function MessageCard({ label, versions, phase }: MessageCardProps) {
  const [versionIndex, setVersionIndex] = useState(0);
  const message = versions[versionIndex];

  return (
    <motion.div
      className="glass-card rounded-xl p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          {phase && (
            <span className="text-[9px] font-bold text-gold/50 uppercase tracking-wider">
              {phase}
            </span>
          )}
          <p className="text-xs font-semibold text-foreground/80">{label}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {versions.length > 1 && (
            <div className="flex items-center gap-0.5">
              {versions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setVersionIndex(i)}
                  className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                    versionIndex === i
                      ? "bg-gold/20 text-gold border border-gold/40"
                      : "bg-navy-medium text-foreground/30 border border-foreground/8 hover:text-foreground/50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
          <CopyButton text={message} />
        </div>
      </div>
      <div className="bg-navy-medium/70 rounded-lg p-3">
        <p className="text-sm text-foreground/70 whitespace-pre-line leading-relaxed">
          {message}
        </p>
      </div>
    </motion.div>
  );
}
