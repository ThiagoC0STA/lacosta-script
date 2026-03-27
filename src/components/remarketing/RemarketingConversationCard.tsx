"use client";

import { Loader2, ChevronRight, Sparkles } from "lucide-react";
import { products } from "@/data/products";
import ClientAvatar from "@/components/shared/ClientAvatar";
import type { Conversation } from "@/types/database";

interface RemarketingConversationCardProps {
  conversation: Conversation;
  messageCount: number;
  isSelected: boolean;
  isAnalyzing: boolean;
  hasAnalysis: boolean;
  score: number | null;
  onClick: () => void;
}

export default function RemarketingConversationCard({
  conversation,
  messageCount,
  isSelected,
  isAnalyzing,
  hasAnalysis,
  score,
  onClick,
}: RemarketingConversationCardProps) {
  const product = products.find((p) => p.id === conversation.product_type);

  const scoreColor =
    (score ?? 0) >= 7
      ? "text-accent bg-accent/10 border-accent/20"
      : (score ?? 0) >= 4
      ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
      : "text-danger bg-danger/10 border-danger/20";

  const timeSince = getTimeSince(conversation.updated_at);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all group ${
        isSelected
          ? "bg-amber-400/5 border-amber-400/30 shadow-lg shadow-amber-400/5"
          : "bg-bg-secondary border-border hover:border-border-light hover:bg-bg-secondary/80"
      }`}
    >
      <div className="flex items-start gap-3">
        <ClientAvatar name={conversation.client_name || ""} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">
              {conversation.client_name || "Sem nome"}
            </p>
            {hasAnalysis && score !== null && (
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${scoreColor}`}
              >
                {score}/10
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-text-muted truncate">
              {product?.emoji} {product?.name}
            </p>
            <span className="text-text-muted/30">·</span>
            <p className="text-xs text-text-muted">
              {messageCount} {messageCount === 1 ? "msg" : "msgs"}
            </p>
            <span className="text-text-muted/30">·</span>
            <p className="text-xs text-text-muted">{timeSince}</p>
          </div>
        </div>

        <div className="shrink-0 self-center">
          {isAnalyzing ? (
            <Loader2 size={16} className="text-amber-400 animate-spin" />
          ) : hasAnalysis ? (
            <ChevronRight
              size={16}
              className={
                isSelected ? "text-amber-400" : "text-text-muted/40 group-hover:text-text-muted"
              }
            />
          ) : (
            <Sparkles
              size={14}
              className="text-text-muted/30 group-hover:text-amber-400/60 transition-colors"
            />
          )}
        </div>
      </div>
    </button>
  );
}

function getTimeSince(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
