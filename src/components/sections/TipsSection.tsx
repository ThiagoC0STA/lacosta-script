"use client";

import { Lightbulb } from "lucide-react";
import Section from "../Section";

export default function TipsSection() {
  const tips = [
    {
      title: "Nunca comece vendendo",
      desc: "Primeiro entenda o que o cliente quer. Pergunte sobre o sonho antes de falar de parcela.",
    },
    {
      title: "Escute mais, fale menos",
      desc: "O cliente que fala mais se sente ouvido. Quem se sente ouvido, confia. Quem confia, compra.",
    },
    {
      title: "Use o nome do cliente",
      desc: "Chamar pelo nome cria conexão instantânea. Use 3-4 vezes na conversa.",
    },
    {
      title: "Nunca prometa contemplação",
      desc: "Diga probabilidades e históricos. Honestidade gera confiança.",
    },
    {
      title: "Áudio > texto longo",
      desc: "No WhatsApp, áudios curtos (30s-1min) criam mais conexão que textão.",
    },
    {
      title: "Silencie depois do gancho",
      desc: "Depois de mostrar os números ou o sonho, pare. Deixe o silêncio trabalhar.",
    },
    {
      title: "Peça indicação SEMPRE",
      desc: "95% dos vendedores nunca pedem. Cada cliente é um gerador de novos clientes.",
    },
    {
      title: "Follow-up é obrigação",
      desc: "80% das vendas acontecem entre o 5º e o 12º contato. Não desista no primeiro.",
    },
  ];

  return (
    <Section
      title="Dicas Rápidas"
      subtitle="Regras de ouro para converter mais"
      icon={Lightbulb}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="bg-navy-medium/40 rounded-lg p-3 border border-foreground/5"
          >
            <p className="text-xs font-semibold text-gold mb-1">{tip.title}</p>
            <p className="text-[10px] text-foreground/50 leading-relaxed">
              {tip.desc}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
