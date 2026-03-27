"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  PanelRight,
  Pencil,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Message, AiResponse, ConversationStatus } from "@/types/database";
import { products } from "@/data/products";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import StarterPicker from "./StarterPicker";
import VersionSelector from "./VersionSelector";
import AnalysisBanner from "./AnalysisBanner";
import LoadingDots from "./LoadingDots";
import StatusDropdown from "./StatusDropdown";
import ClientAvatar from "@/components/shared/ClientAvatar";
import ContextPanel from "@/components/context-panel/ContextPanel";

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
  const [isRefining, setIsRefining] = useState(false);
  const [creditValue, setCreditValue] = useState("");
  const [parcelaValue, setParcelaValue] = useState("");
  const [error, setError] = useState("");
  const [showContext, setShowContext] = useState(true);
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

  const productMatch = products.find((p) => p.id === productType);
  const productName = productMatch?.name || "";
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
    autoTriggeredRef.current = false;

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
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role !== "client") return;
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

  const callAI = async (allMessages: Message[], refinement?: string) => {
    const lastMsg = allMessages[allMessages.length - 1];
    if (!refinement && lastMsg?.role !== "client") return;

    const refining = !!refinement;
    if (refining) {
      setIsRefining(true);
    } else {
      setIsLoading(true);
      setAiResponse(null);
    }
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
          refinement,
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
      setIsRefining(false);
    }
  };

  const handleRefine = (instruction: string) => {
    callAI(messages, instruction);
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
        <div className="border-b border-border bg-bg-secondary px-4 py-3 shrink-0">
          <div className="max-w-6xl mx-auto pl-10 lg:pl-0 flex items-center gap-4">
            <ClientAvatar name={displayName || ""} size="md" />

            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
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
                    className="bg-bg-primary border border-border-light rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-text-muted w-48 transition-all"
                    placeholder="Nome do cliente"
                  />
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={commitNameChange}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors shrink-0"
                  >
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="group flex items-center gap-2 hover:bg-bg-tertiary rounded-lg px-2 py-1 -ml-2 transition-colors"
                >
                  <p className="text-sm font-bold truncate">
                    {displayName || "Sem nome"}
                  </p>
                  <Pencil
                    size={12}
                    className="text-text-muted/0 group-hover:text-text-muted transition-colors shrink-0"
                  />
                </button>
              )}
              <p className="text-xs text-text-muted truncate mt-0.5">
                {productMatch ? (
                  <>
                    {productMatch.emoji} {productName}
                    {creditValue && ` · ${creditValue}`}
                    {parcelaValue && ` · Parcela ${parcelaValue}`}
                  </>
                ) : (
                  <span className="text-text-muted/50 italic">
                    Produto nao definido
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <StatusDropdown
                value={status || "active"}
                onChange={(s) => onStatusChange(conversationId, s)}
              />

              <button
                onClick={() => setShowContext(!showContext)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                  showContext
                    ? "bg-bg-tertiary border-border-light text-text-primary"
                    : "border-border text-text-muted hover:text-text-secondary hover:border-border-light"
                }`}
              >
                <PanelRight size={13} />
                <span className="hidden sm:inline">Contexto</span>
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
              parcelaValue={parcelaValue}
              onCreditChange={setCreditValue}
              onParcelaChange={setParcelaValue}
              onSend={handleStarterSend}
            />
          ) : (
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
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
                onRefine={handleRefine}
                isRefining={isRefining}
              />
            </>
          )}

          {error && (
            <div className="px-4 pb-2">
              <div className="max-w-6xl mx-auto">
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

      {/* Context Panel */}
      <ContextPanel
        open={showContext}
        onClose={() => setShowContext(false)}
        messages={messages}
        clientName={displayName}
        productType={productName}
        conversationId={conversationId}
      />
    </div>
  );
}
