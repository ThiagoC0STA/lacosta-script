"use client";

import { useState } from "react";
import { Shield, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "../Section";
import CopyButton from "../CopyButton";
import { objections } from "@/data/objections";

export default function ObjectionsSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [versionMap, setVersionMap] = useState<Record<string, number>>({});

  const getVersion = (id: string) => versionMap[id] ?? 0;
  const setVersion = (id: string, v: number) =>
    setVersionMap((prev) => ({ ...prev, [id]: v }));

  return (
    <Section
      title="Objeções"
      subtitle="Cliente travou? Ache a resposta aqui"
      icon={Shield}
      badge={`${objections.length}`}
    >
      <p className="text-[10px] text-gold/60 -mt-1 mb-1">
        Valide primeiro, redirecione depois. Nunca confronte.
      </p>

      <div className="space-y-1.5">
        {objections.map((obj) => {
          const isOpen = openId === obj.id;
          const vi = getVersion(obj.id);
          const version = obj.versions[vi];

          return (
            <div
              key={obj.id}
              className="rounded-lg border border-foreground/5 overflow-hidden bg-navy-medium/30"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : obj.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-navy-medium/50 transition-colors"
              >
                <p className="text-xs font-medium text-foreground/80">
                  &quot;{obj.objection}&quot;
                </p>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronDown
                    size={14}
                    className="text-foreground/30 shrink-0 ml-2"
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-2">
                      {/* Version toggle */}
                      {obj.versions.length > 1 && (
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-foreground/30 mr-1">
                            Versão:
                          </span>
                          {obj.versions.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setVersion(obj.id, i)}
                              className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                                vi === i
                                  ? "bg-gold/20 text-gold border border-gold/40"
                                  : "bg-navy-medium text-foreground/30 border border-foreground/8 hover:text-foreground/50"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="bg-navy-medium/60 rounded-lg p-3">
                        <p className="text-[10px] font-semibold text-gold mb-1">
                          Responda:
                        </p>
                        <p className="text-xs text-foreground/70 italic leading-relaxed">
                          {version.response}
                        </p>
                      </div>
                      <div className="bg-accent-green/5 rounded-lg p-2.5 border border-accent-green/10">
                        <p className="text-[10px] text-accent-green font-medium">
                          Depois pergunte:
                        </p>
                        <p className="text-xs text-foreground/70 italic">
                          {version.followUp}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <CopyButton
                          text={`${version.response}\n\n${version.followUp}`}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
