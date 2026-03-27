"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutDashboard,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Conversation, ConversationStatus, ClientIntelligence } from "@/types/database";
import { products } from "@/data/products";
import { getAllSavedIntel } from "@/components/context-panel/IntelligenceTab";
import { readAllNotes } from "@/components/context-panel/QuickNotes";
import MetricsBar from "@/components/dashboard/MetricsBar";
import KanbanBoard from "@/components/dashboard/KanbanBoard";

function getDaysInactive(dateString: string): number {
  return Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
}

function isThisWeek(dateString: string): boolean {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return new Date(dateString).getTime() >= start.getTime();
}

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [msgCounts, setMsgCounts] = useState<Record<string, number>>({});
  const [intelMap, setIntelMap] = useState<Record<string, ClientIntelligence>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const initialized = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    setIntelMap(getAllSavedIntel());
    setNotesMap(readAllNotes());

    (async () => {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (data) {
        const convs = data as Conversation[];
        setConversations(convs);

        const ids = convs.map((c) => c.id);
        if (ids.length > 0) {
          const { data: msgs } = await supabase
            .from("messages")
            .select("conversation_id")
            .in("conversation_id", ids);

          if (msgs) {
            const counts: Record<string, number> = {};
            for (const m of msgs) {
              counts[m.conversation_id] = (counts[m.conversation_id] || 0) + 1;
            }
            setMsgCounts(counts);
          }
        }
      }
      setLoading(false);
    })();
  }, [supabase]);

  const byStatus = (status: ConversationStatus) =>
    conversations.filter((c) => (c.status || "active") === status);

  const staleConversations = conversations.filter(
    (c) =>
      ((c.status || "active") === "active" || c.status === "remarketing") &&
      getDaysInactive(c.updated_at) >= 3
  );

  const total = conversations.length;
  const activeCount = byStatus("active").length;
  const closedCount = byStatus("closed").length;
  const thisWeekNew = conversations.filter((c) => isThisWeek(c.created_at)).length;
  const thisWeekClosed = byStatus("closed").filter((c) => isThisWeek(c.updated_at)).length;

  const handleCardClick = (convId: string) => {
    router.push(`/?conv=${convId}`);
  };

  const handleStatusChange = async (convId: string, newStatus: ConversationStatus) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, status: newStatus } : c))
    );

    await supabase
      .from("conversations")
      .update({ status: newStatus })
      .eq("id", convId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-text-muted/30 border-t-text-primary rounded-full animate-spin" />
          <p className="text-xs text-text-muted">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border bg-bg-secondary sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <LayoutDashboard size={16} className="text-info" />
          <h1 className="text-sm font-semibold">Dashboard</h1>
          <span className="text-[10px] text-text-muted ml-1">{total} leads</span>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 py-5 space-y-5">
        {/* Metrics */}
        <MetricsBar
          total={total}
          active={activeCount}
          closed={closedCount}
          staleCount={staleConversations.length}
          thisWeekNew={thisWeekNew}
          thisWeekClosed={thisWeekClosed}
        />

        {/* Stale alerts */}
        {staleConversations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={13} className="text-warning" />
              <p className="text-xs font-semibold text-warning">
                Precisam de follow-up
              </p>
              <span className="text-[10px] text-text-muted">
                ({staleConversations.length})
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {staleConversations
                .sort((a, b) => getDaysInactive(b.updated_at) - getDaysInactive(a.updated_at))
                .map((conv) => {
                  const product = products.find((p) => p.id === conv.product_type);
                  const days = getDaysInactive(conv.updated_at);
                  const intel = intelMap[conv.id];
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleCardClick(conv.id)}
                      className="shrink-0 bg-warning/5 border border-warning/20 rounded-lg px-3 py-2.5 text-left hover:bg-warning/10 transition-colors min-w-[200px]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-text-primary truncate">
                          {conv.client_name || "Sem nome"}
                        </p>
                        <span className="flex items-center gap-1 text-[10px] text-warning font-medium shrink-0 ml-2">
                          <Clock size={9} />
                          {days}d
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted">
                        {product ? `${product.emoji} ${product.name}` : "N/D"}
                        {intel ? ` · ${intel.stageLabel}` : ""}
                      </p>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* Kanban with drag and drop */}
        <div>
          <p className="text-[10px] text-text-muted mb-3">
            Arraste os cards entre colunas para mudar o status
          </p>
          <KanbanBoard
            conversations={conversations}
            intelMap={intelMap}
            notesMap={notesMap}
            msgCounts={msgCounts}
            onStatusChange={handleStatusChange}
            onCardClick={handleCardClick}
          />
        </div>
      </div>
    </div>
  );
}
