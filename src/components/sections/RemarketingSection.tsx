"use client";

import { useState } from "react";
import { RefreshCcw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageCard from "../MessageCard";
import { remarketingIdeas } from "@/data/messages";

interface RemarketingSectionProps {
  clientName: string;
}

export default function RemarketingSection({ clientName }: RemarketingSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-gold text-navy font-bold text-sm shadow-lg shadow-gold/30 hover:shadow-gold/50 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RefreshCcw size={16} />
        Remarketing
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed inset-x-4 top-[5%] bottom-[5%] sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 z-50 flex flex-col bg-navy-light rounded-2xl border border-gold/15 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/5">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <RefreshCcw size={18} className="text-gold" />
                    Remarketing
                  </h2>
                  <p className="text-[10px] text-foreground/40 mt-0.5">
                    Lead esfriou? Escolha a abordagem ideal
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-navy-medium transition-colors text-foreground/40 hover:text-foreground/70"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {remarketingIdeas.map((idea) => (
                  <div key={idea.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-gold/60 uppercase tracking-wider">
                        {idea.context}
                      </span>
                    </div>
                    <MessageCard
                      label={idea.label}
                      versions={idea.versions.map((fn) => fn(clientName))}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
