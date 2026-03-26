"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Sparkles, RefreshCcw, Inbox } from "lucide-react";
import { products } from "@/data/products";
import type { Conversation, Message, RemarketingAnalysis } from "@/types/database";
import RemarketingHeader from "@/components/remarketing/RemarketingHeader";
import RemarketingConversationCard from "@/components/remarketing/RemarketingConversationCard";
import RemarketingAnalysisView from "@/components/remarketing/RemarketingAnalysisView";

export default function RemarketingPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  const [analysisMap, setAnalysisMap] = useState<Record<string, RemarketingAnalysis>>({});
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const supabase = createClient();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoadingConversations(true);
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .eq("status", "remarketing")
      .order("updated_at", { ascending: false });

    if (data) {
      setConversations(data as Conversation[]);
      const counts = await loadMessageCounts(data as Conversation[]);
      setMessagesMap(counts);
    }
    setLoadingConversations(false);
  };

  const loadMessageCounts = async (
    convs: Conversation[]
  ): Promise<Record<string, Message[]>> => {
    const map: Record<string, Message[]> = {};
    const ids = convs.map((c) => c.id);

    if (ids.length === 0) return map;

    const { data } = await supabase
      .from("messages")
      .select("*")
      .in("conversation_id", ids)
      .order("created_at", { ascending: true });

    if (data) {
      for (const msg of data as Message[]) {
        if (!map[msg.conversation_id]) map[msg.conversation_id] = [];
        map[msg.conversation_id].push(msg);
      }
    }

    return map;
  };

  const handleSelect = async (convId: string) => {
    setSelectedId(convId);
    setError("");

    if (analysisMap[convId]) return;

    const messages = messagesMap[convId] || [];
    if (messages.length === 0) {
      setError("This conversation has no messages to analyze.");
      return;
    }

    const conv = conversations.find((c) => c.id === convId);
    if (!conv) return;

    setAnalyzingId(convId);

    try {
      const productName =
        products.find((p) => p.id === conv.product_type)?.name ||
        conv.product_type;

      const res = await fetch("/api/remarketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          productType: productName,
          clientName: conv.client_name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Analysis error");
        return;
      }

      setAnalysisMap((prev) => ({ ...prev, [convId]: data }));
    } catch {
      setError("Connection error with AI");
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleReanalyze = async () => {
    if (!selectedId) return;
    setAnalysisMap((prev) => {
      const copy = { ...prev };
      delete copy[selectedId];
      return copy;
    });
    await handleSelect(selectedId);
  };

  const selectedConv = conversations.find((c) => c.id === selectedId);
  const selectedAnalysis = selectedId ? analysisMap[selectedId] : null;
  const analyzedCount = Object.keys(analysisMap).length;

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <RemarketingHeader
        totalCount={conversations.length}
        analyzedCount={analyzedCount}
      />

      <div className="flex-1 overflow-hidden flex">
        {/* Conversation list */}
        <div className="w-full max-w-sm border-r border-border flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">
              Conversas em remarketing
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loadingConversations ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2
                  size={20}
                  className="text-amber-400 animate-spin mb-2"
                />
                <p className="text-[11px] text-text-muted">Loading...</p>
              </div>
            ) : conversations.length === 0 ? (
              <EmptyState />
            ) : (
              conversations.map((conv) => (
                <RemarketingConversationCard
                  key={conv.id}
                  conversation={conv}
                  messageCount={messagesMap[conv.id]?.length || 0}
                  isSelected={selectedId === conv.id}
                  isAnalyzing={analyzingId === conv.id}
                  hasAnalysis={!!analysisMap[conv.id]}
                  score={analysisMap[conv.id]?.remarketing_score ?? null}
                  onClick={() => handleSelect(conv.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Analysis panel */}
        <div className="flex-1 overflow-y-auto">
          {!selectedId ? (
            <SelectPrompt />
          ) : analyzingId === selectedId ? (
            <AnalyzingState />
          ) : error && !selectedAnalysis ? (
            <div className="p-6">
              <div className="max-w-2xl mx-auto">
                <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-xl px-4 py-3">
                  {error}
                </p>
              </div>
            </div>
          ) : selectedAnalysis && selectedConv ? (
            <div className="p-6">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-sm font-semibold">
                      Análise: {selectedConv.client_name || "Sem nome"}
                    </h2>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {messagesMap[selectedId]?.length || 0} mensagens analisadas
                    </p>
                  </div>
                  <button
                    onClick={handleReanalyze}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium text-text-muted hover:text-text-secondary border border-border hover:border-border-light hover:bg-bg-tertiary transition-all"
                  >
                    <RefreshCcw size={12} />
                    Re-analisar
                  </button>
                </div>

                <RemarketingAnalysisView
                  analysis={selectedAnalysis}
                  clientName={selectedConv.client_name}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-4">
        <Inbox size={20} className="text-amber-400/50" />
      </div>
      <p className="text-sm font-medium text-text-secondary mb-1">
        Nenhuma conversa em remarketing
      </p>
      <p className="text-[11px] text-text-muted max-w-[220px] leading-relaxed">
        Marque conversas como &quot;Remarketing&quot; na área de chat para elas
        aparecerem aqui.
      </p>
    </div>
  );
}

function SelectPrompt() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/15 flex items-center justify-center mb-5">
        <Sparkles size={22} className="text-amber-400/50" />
      </div>
      <h2 className="text-sm font-semibold text-text-secondary mb-1">
        Selecione uma conversa
      </h2>
      <p className="text-[11px] text-text-muted max-w-[260px] leading-relaxed">
        Clique em uma conversa à esquerda para a IA analisar se o lead vale a
        pena e gerar estratégia de reabordagem.
      </p>
    </div>
  );
}

function AnalyzingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <Loader2 size={28} className="text-amber-400 animate-spin mb-4" />
      <h2 className="text-sm font-semibold text-text-secondary mb-1">
        Analisando conversa...
      </h2>
      <p className="text-[11px] text-text-muted max-w-[260px] leading-relaxed">
        A IA está avaliando o perfil do lead, erros na conversa e gerando
        estratégia de reabordagem.
      </p>
    </div>
  );
}
