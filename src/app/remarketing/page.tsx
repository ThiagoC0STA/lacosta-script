"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Sparkles, RefreshCcw, Inbox, Search } from "lucide-react";
import { products } from "@/data/products";
import type { Conversation, Message, RemarketingAnalysis } from "@/types/database";
import RemarketingHeader from "@/components/remarketing/RemarketingHeader";
import RemarketingConversationCard from "@/components/remarketing/RemarketingConversationCard";
import RemarketingAnalysisView from "@/components/remarketing/RemarketingAnalysisView";
import AiRefineInput from "@/components/shared/AiRefineInput";

export default function RemarketingPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  const [analysisMap, setAnalysisMap] = useState<Record<string, RemarketingAnalysis>>({});
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [refiningId, setRefiningId] = useState<string | null>(null);
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
      const convs = data as Conversation[];
      setConversations(convs);

      const [msgs, saved] = await Promise.all([
        loadMessages(convs),
        loadSavedAnalyses(convs),
      ]);
      setMessagesMap(msgs);
      setAnalysisMap(saved);
    }
    setLoadingConversations(false);
  };

  const loadMessages = async (
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

  const loadSavedAnalyses = async (
    convs: Conversation[]
  ): Promise<Record<string, RemarketingAnalysis>> => {
    const map: Record<string, RemarketingAnalysis> = {};
    const ids = convs.map((c) => c.id);
    if (ids.length === 0) return map;

    const { data } = await supabase
      .from("remarketing_analyses")
      .select("conversation_id, analysis")
      .in("conversation_id", ids);

    if (data) {
      for (const row of data) {
        map[row.conversation_id] = row.analysis as RemarketingAnalysis;
      }
    }
    return map;
  };

  const saveAnalysis = async (convId: string, analysis: RemarketingAnalysis) => {
    await supabase
      .from("remarketing_analyses")
      .upsert(
        { conversation_id: convId, analysis, updated_at: new Date().toISOString() },
        { onConflict: "conversation_id" }
      );
  };

  const handleSelect = (convId: string) => {
    setSelectedId(convId);
    setError("");
  };

  const handleAnalyze = async (convId?: string) => {
    const targetId = convId || selectedId;
    if (!targetId) return;

    const messages = messagesMap[targetId] || [];
    if (messages.length === 0) {
      setError("Essa conversa não tem mensagens para analisar.");
      return;
    }

    const conv = conversations.find((c) => c.id === targetId);
    if (!conv) return;

    setAnalyzingId(targetId);
    setError("");

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
        setError(data.error || "Erro na análise");
        return;
      }

      setAnalysisMap((prev) => ({ ...prev, [targetId]: data }));
      await saveAnalysis(targetId, data);
    } catch {
      setError("Erro de conexão com a IA");
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
    await handleAnalyze(selectedId);
  };

  const handleRefineRemarketing = async (instruction: string) => {
    if (!selectedId) return;

    const messages = messagesMap[selectedId] || [];
    if (messages.length === 0) return;

    const conv = conversations.find((c) => c.id === selectedId);
    if (!conv) return;

    setRefiningId(selectedId);
    setError("");

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
          refinement: instruction,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro no refinamento");
        return;
      }

      setAnalysisMap((prev) => ({ ...prev, [selectedId]: data }));
      await saveAnalysis(selectedId, data);
    } catch {
      setError("Erro de conexão com a IA");
    } finally {
      setRefiningId(null);
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedId);
  const selectedAnalysis = selectedId ? analysisMap[selectedId] : null;
  const analyzedCount = Object.keys(analysisMap).length;
  const isAnalyzingSelected = analyzingId === selectedId;

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <RemarketingHeader
        totalCount={conversations.length}
        analyzedCount={analyzedCount}
      />

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Conversation list */}
        <div className={`w-full lg:max-w-sm border-b lg:border-b-0 lg:border-r border-border flex flex-col shrink-0 ${selectedId ? "hidden lg:flex" : "flex-1"}`}>
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
                <p className="text-[11px] text-text-muted">Carregando...</p>
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
        <div className={`flex-1 overflow-y-auto ${selectedId ? "flex flex-col" : "hidden lg:flex lg:flex-col"}`}>
          {selectedId && (
            <button
              onClick={() => setSelectedId(null)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 text-xs font-medium text-text-muted hover:text-text-primary border-b border-border transition-colors"
            >
              <span>&larr;</span> Voltar para lista
            </button>
          )}
          {!selectedId ? (
            <SelectPrompt />
          ) : isAnalyzingSelected ? (
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

                <div className="mt-5">
                  <AiRefineInput
                    onSubmit={handleRefineRemarketing}
                    isLoading={refiningId === selectedId}
                    accentColor="amber"
                    placeholder="Ex: gere mensagens mais casuais, foque em urgência, mude o tom..."
                  />
                </div>
              </div>
            </div>
          ) : selectedConv ? (
            <AnalyzePrompt
              clientName={selectedConv.client_name}
              messageCount={messagesMap[selectedId]?.length || 0}
              onAnalyze={() => handleAnalyze(selectedId)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AnalyzePrompt({
  clientName,
  messageCount,
  onAnalyze,
}: {
  clientName: string;
  messageCount: number;
  onAnalyze: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/15 flex items-center justify-center mb-5">
        <Search size={22} className="text-amber-400/50" />
      </div>
      <h2 className="text-sm font-semibold text-text-secondary mb-1">
        {clientName || "Sem nome"}
      </h2>
      <p className="text-[11px] text-text-muted max-w-[280px] leading-relaxed mb-5">
        {messageCount > 0
          ? `${messageCount} mensagens nesta conversa. Clique para a IA analisar o lead e gerar estratégia de reabordagem.`
          : "Essa conversa não tem mensagens para analisar."}
      </p>
      {messageCount > 0 && (
        <button
          onClick={onAnalyze}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all bg-linear-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 text-amber-300 border border-amber-400/25 hover:border-amber-400/40 hover:from-amber-500/20 hover:via-orange-500/20 hover:to-amber-500/20"
        >
          <Sparkles size={16} />
          Analisar com IA
        </button>
      )}
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
        Clique em uma conversa à esquerda para ver a análise salva ou gerar uma
        nova com IA.
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
