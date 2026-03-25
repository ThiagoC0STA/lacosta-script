"use client";

import { motion } from "framer-motion";

export default function LoadingDots() {
  return (
    <div className="px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2.5 bg-bg-secondary border border-border rounded-xl px-4 py-3 w-fit"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <p className="text-[11px] text-text-muted">Gerando versões...</p>
        </motion.div>
      </div>
    </div>
  );
}
