"use client";

import {
  Flame,
  Thermometer,
  Snowflake,
  StickyNote,
  MessageSquare,
  Clock,
} from "lucide-react";
import type { Conversation, ClientIntelligence } from "@/types/database";
import { products } from "@/data/products";

interface KanbanCardProps {
  conversation: Conversation;
  intel: ClientIntelligence | null;
  note: string;
  messageCount: number;
  onClick: () => void;
}

const TEMP_CONFIG = {
  hot: { icon: Flame, label: "Quente", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  warm: { icon: Thermometer, label: "Morno", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  cold: { icon: Snowflake, label: "Frio", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
};

function getTimeSince(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function getDaysInactive(dateString: string): number {
  return Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
}

export default function KanbanCard({
  conversation,
  intel,
  note,
  messageCount,
  onClick,
}: KanbanCardProps) {
  const product = products.find((p) => p.id === conversation.product_type);
  const daysInactive = getDaysInactive(conversation.updated_at);
  const isStale = daysInactive >= 3 && (conversation.status === "active" || conversation.status === "remarketing");

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-bg-primary border rounded-lg p-3 hover:border-border-light transition-all group ${
        isStale ? "border-warning/30" : "border-border"
      }`}
    >
      {/* Header: Name + Temperature */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-text-primary truncate">
            {conversation.client_name || "Sem nome"}
          </p>
          <p className="text-[10px] text-text-muted truncate">
            {product ? `${product.emoji} ${product.name}` : "N/D"}
          </p>
        </div>
        {intel && (
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-medium shrink-0 ${TEMP_CONFIG[intel.temperature].bg} ${TEMP_CONFIG[intel.temperature].color}`}>
            {(() => { const Icon = TEMP_CONFIG[intel.temperature].icon; return <Icon size={9} />; })()}
            {TEMP_CONFIG[intel.temperature].label}
          </div>
        )}
      </div>

      {/* Intel summary */}
      {intel && (
        <div className="mb-2">
          {/* Stage bar */}
          <div className="flex items-center gap-0.5 mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full ${
                  s <= intel.stage ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>
          <p className="text-[9px] text-text-muted">{intel.stageLabel}</p>
          {intel.summary && (
            <p className="text-[10px] text-text-secondary leading-relaxed mt-1 line-clamp-2">
              {intel.summary}
            </p>
          )}
        </div>
      )}

      {/* Note preview */}
      {note && (
        <div className="flex items-start gap-1.5 mb-2 bg-bg-secondary/60 rounded px-2 py-1.5">
          <StickyNote size={9} className="text-text-muted mt-0.5 shrink-0" />
          <p className="text-[10px] text-text-muted line-clamp-2 leading-relaxed">{note}</p>
        </div>
      )}

      {/* Footer: msgs + time */}
      <div className="flex items-center gap-3 text-[10px] text-text-muted">
        <span className="flex items-center gap-1">
          <MessageSquare size={9} />
          {messageCount}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={9} />
          {getTimeSince(conversation.updated_at)}
        </span>
        {isStale && (
          <span className="text-warning font-medium ml-auto">
            {daysInactive}d parado
          </span>
        )}
      </div>
    </button>
  );
}
