"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BarChart3, RefreshCcw, CheckCircle, Clock, Pencil, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Message, AiResponse, ConversationStatus } from "@/types/database";
import { products } from "@/data/products";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import StarterPicker from "./StarterPicker";
import VersionSelector from "./VersionSelector";
import AnalysisBanner from "./AnalysisBanner";
import LoadingDots from "./LoadingDots";
import AnalysisPanel from "./AnalysisPanel";

interface ChatAreaProps {
  conversationId: string;
  clientName: string;
  productType: string;
  status: ConversationStatus;
  onStatusChange: (id: string, status: ConversationStatus) => void;
  onClientNameChange: (id: string, newName: string) => void;
  autoTriggerAI?: boolean;
  onAutoTriggerDone?: () => void;
}

const STATUS_OPTIONS: {
  value: ConversationStatus;
  label: string;
  icon: typeof Clock;
  color: string;
  activeBg: string;
}[] = [
  {
    value: "active",
    label: "Ativo",
    icon: Clock,
    color: "text-accent",
    activeBg: "bg-accent/10 border-accent/30",
  },
  {
    value: "remarketing",
    label: "Remarketing",
    icon: RefreshCcw,
    color: "text-amber-400",
    activeBg: "bg-amber-400/10 border-amber-400/30",
  },
  {
    value: "closed",
    label: "Fechado",
    icon: CheckCircle,
    color: "text-info",
    activeBg: "bg-info/10 border-info/30",
  },
];

export default function ChatArea({
  conversationId,
  clientName,
  productType,
  status,
  onStatusChange,
  onClientNameChange,
  autoTriggerAI,
  onAutoTriggerDone,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [creditValue, setCreditValue] = useState("");
  const [error, setError] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [localName, setLocalName] = useState(clientName);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    setLocalName(clientName);
  }, [clientName]);

  useEffect(() => {
    if (editingName) {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }
  }, [editingName]);

  const commitNameChange = useCallback(() => {
    setEditingName(false);
    const trimmed = localName.trim();
    if (trimmed !== clientName) {
      onClientNameChange(conversationId, trimmed);
    }
  }, [localName, clientName, conversationId, onClientNameChange]);

  const productName =
    products.find((p) => p.id === productType)?.name || productType;
  const displayName = localName || clientName;

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const loadedConvRef = useRef<string | null>(null);

  useEffect(() => {
    if (loadedConvRef.current === conversationId) return;
    loadedConvRef.current = conversationId;

    setAiResponse(null);
    setError("");
    setShowAnalysis(false);

    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as Message[]);
      });
  }, [conversationId, supabase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiResponse, isLoading]);

  const autoTriggeredRef = useRef(false);
  const onAutoTriggerDoneRef = useRef(onAutoTriggerDone);
  onAutoTriggerDoneRef.current = onAutoTriggerDone;

  useEffect(() => {
    if (!autoTriggerAI || messages.length === 0 || autoTriggeredRef.current) return;
    autoTriggeredRef.current = true;

    const doTrigger = async () => {
      await callAI(messages);
      onAutoTriggerDoneRef.current?.();
    };
    doTrigger();
  }, [autoTriggerAI, messages]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveMessage = async (role: "client" | "seller", content: string) => {
    const { data, error: dbError } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, role, content })
      .select()
      .single();

    if (dbError) {
      setError("Erro ao salvar: " + dbError.message);
      return null;
    }

    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    return data as Message;
  };

  const callAI = async (allMessages: Message[]) => {
    setIsLoading(true);
    setAiResponse(null);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          productType: productName,
          clientName: displayName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro na API");
        return;
      }
      setAiResponse(data);
    } catch {
      setError("Erro de conexão com a IA");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterSend = async (message: string) => {
    const saved = await saveMessage("seller", message);
    if (saved) setMessages((prev) => [...prev, saved]);
  };

  const handleClientMessage = async (message: string) => {
    const saved = await saveMessage("client", message);
    if (!saved) return;
    const updated = [...messages, saved];
    setMessages(updated);
    await callAI(updated);
  };

  const handleVersionSelect = async (message: string) => {
    const saved = await saveMessage("seller", message);
    if (saved) {
      setMessages((prev) => [...prev, saved]);
      setAiResponse(null);
    }
  };

  const hasMessages = messages.length > 0;
  const lastMessage = messages[messages.length - 1];
  const waitingForClient =
    hasMessages && lastMessage?.role === "seller" && !aiResponse && !isLoading;
  const waitingForSelection = !!aiResponse && !isLoading;

  return (
    <div className="flex-1 flex h-screen bg-bg-primary">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-border bg-bg-secondary/50 backdrop-blur-sm px-4 py-2.5 shrink-0">
          <div className="max-w-3xl mx-auto pl-10 lg:pl-0 flex items-center justify-between gap-3">
            <div className="min-w-0">
              {editingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitNameChange();
                      if (e.key === "Escape") {
                        setLocalName(clientName);
                        setEditingName(false);
                      }
                    }}
                    onBlur={commitNameChange}
                    className="bg-bg-primary border border-accent/40 rounded-lg px-2.5 py-1 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-accent/30 w-44 transition-all"
                    placeholder="Nome do cliente"
                  />
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={commitNameChange}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-accent hover:bg-accent/10 transition-colors shrink-0"
                  >
                    <Check size={13} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="group flex items-center gap-1.5 hover:bg-bg-tertiary rounded-lg px-1.5 py-0.5 -ml-1.5 transition-colors"
                >
                  <p className="text-sm font-semibold truncate">
                    {displayName || "Sem nome"}
                  </p>
                  <Pencil
                    size={11}
                    className="text-text-muted/0 group-hover:text-text-muted transition-colors shrink-0"
                  />
                </button>
              )}
              <p className="text-[11px] text-text-muted truncate">
                {products.find((p) => p.id === productType)?.emoji}{" "}
                {productName}
                {creditValue && ` · ${creditValue}`}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Status pills */}
              {STATUS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = (status || "active") === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onStatusChange(conversationId, opt.value)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all border ${
                      isSelected
                        ? `${opt.activeBg} ${opt.color}`
                        : "border-transparent text-text-muted hover:text-text-secondary hover:bg-bg-tertiary"
                    }`}
                  >
                    <Icon size={11} />
                    <span className="hidden sm:inline">{opt.label}</span>
                  </button>
                );
              })}

              {/* Divider */}
              <div className="w-px h-5 bg-border mx-1" />

              {/* Analysis toggle */}
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all border ${
                  showAnalysis
                    ? "bg-info/10 border-info/30 text-info"
                    : "border-transparent text-text-muted hover:text-text-secondary hover:bg-bg-tertiary"
                }`}
              >
                <BarChart3 size={12} />
                <span className="hidden sm:inline">Análise</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            <StarterPicker
              clientName={displayName}
              productType={productName}
              creditValue={creditValue}
              onCreditChange={setCreditValue}
              onSend={handleStarterSend}
            />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  clientName={displayName}
                />
              ))}
            </div>
          )}

          {isLoading && <LoadingDots />}

          {waitingForSelection && aiResponse && (
            <>
              <AnalysisBanner
                tips={aiResponse.tips}
                errors={aiResponse.errors}
              />
              <VersionSelector
                versions={aiResponse.versions}
                onSelect={handleVersionSelect}
              />
            </>
          )}

          {error && (
            <div className="px-4 pb-2">
              <div className="max-w-3xl mx-auto">
                <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-xl px-4 py-2.5">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        {hasMessages && !waitingForSelection && (
          <ChatInput
            onSend={handleClientMessage}
            disabled={isLoading}
            placeholder={
              waitingForClient
                ? "Cole aqui o que o cliente respondeu..."
                : "Aguarde a IA..."
            }
          />
        )}
      </div>

      {/* Analysis Panel */}
      <AnalysisPanel
        open={showAnalysis}
        onClose={() => setShowAnalysis(false)}
        messages={messages}
        clientName={displayName}
        productType={productName}
      />
    </div>
  );
}
