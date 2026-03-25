"use client";

import { MessageSquare } from "lucide-react";
import Section from "../Section";
import MessageCard from "../MessageCard";
import { messageTemplates } from "@/data/messages";

interface MessagesSectionProps {
  clientName: string;
  product: string;
  value: string;
}

export default function MessagesSection({
  clientName,
  product,
  value,
}: MessagesSectionProps) {
  return (
    <Section
      title="Mensagens Prontas"
      subtitle="Copie e cole no WhatsApp — troque versões com os botões"
      icon={MessageSquare}
      badge="COPIAR"
      defaultOpen={true}
    >
      <div className="space-y-3">
        {messageTemplates.map((tmpl) => (
          <MessageCard
            key={tmpl.id}
            label={tmpl.label}
            phase={tmpl.phase}
            versions={tmpl.versions.map((fn) => fn(clientName, product, value))}
          />
        ))}
      </div>
    </Section>
  );
}
