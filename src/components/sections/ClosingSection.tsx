"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import Section from "../Section";
import CopyButton from "../CopyButton";
import { closingTechniques } from "@/data/closing-techniques";

interface ClosingSectionProps {
  clientName: string;
}

export default function ClosingSection({ clientName }: ClosingSectionProps) {
  const name = clientName || "[nome]";
  const [versionMap, setVersionMap] = useState<Record<string, number>>({});

  const getVersion = (id: string) => versionMap[id] ?? 0;
  const setVersion = (id: string, v: number) =>
    setVersionMap((prev) => ({ ...prev, [id]: v }));

  return (
    <Section
      title="Fechamento"
      subtitle="Hora de converter — escolha a técnica"
      icon={Trophy}
    >
      <div className="space-y-2.5">
        {closingTechniques.map((tech) => {
          const vi = getVersion(tech.id);
          const intensityColor =
            tech.intensity === "soft"
              ? "text-blue-400 bg-blue-400/10"
              : tech.intensity === "medium"
              ? "text-amber-400 bg-amber-400/10"
              : "text-rose-400 bg-rose-400/10";

          const script = tech.versions[vi].replace(/\[NOME\]/g, name);

          return (
            <div
              key={tech.id}
              className="rounded-lg border border-foreground/5 bg-navy-medium/30 p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{tech.name}</span>
                  <span
                    className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ${intensityColor}`}
                  >
                    {tech.intensity === "soft"
                      ? "suave"
                      : tech.intensity === "medium"
                      ? "médio"
                      : "forte"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {tech.versions.length > 1 && (
                    <div className="flex items-center gap-0.5">
                      {tech.versions.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setVersion(tech.id, i)}
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
                  <CopyButton text={script} />
                </div>
              </div>
              <p className="text-[10px] text-foreground/40 mb-2">
                {tech.whenToUse}
              </p>
              <div className="bg-navy-medium/60 rounded-lg p-2.5">
                <p className="text-xs text-foreground/70 italic leading-relaxed">
                  &quot;{script}&quot;
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post-sale */}
      <div className="rounded-lg border border-gold/15 bg-gold/5 p-3 mt-1">
        <p className="text-xs font-semibold text-gold mb-2">
          Fechou? Agora:
        </p>
        <div className="space-y-1.5 text-[11px] text-foreground/60">
          <p>
            1. <span className="italic text-gold/70">&quot;Parabéns pela melhor decisão financeira!&quot;</span>
          </p>
          <p>
            2. <span className="italic text-gold/70">&quot;Vou te acompanhar em cada etapa.&quot;</span>
          </p>
          <p>
            3. <span className="italic text-gold/70">&quot;Conhece 2-3 pessoas com um sonho parecido?&quot;</span>
          </p>
          <p>
            4. <span className="italic text-gold/70">&quot;Quando contemplar, me grava um áudio contando?&quot;</span>
          </p>
        </div>
      </div>
    </Section>
  );
}
