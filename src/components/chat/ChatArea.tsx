"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message, AiResponse } from "@/types/database";
import { products } from "@/data/products";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import StarterPicker from "./StarterPicker";
import VersionSelector from "./VersionSelector";
import AnalysisBanner from "./AnalysisBanner";
import LoadingDots from "./LoadingDots";

interface ChatAreaProps {
  conversationId: string;
  clientName: string;
  productType: string;
}

export default function ChatArea({
  conversationId,
  clientName,
  productType,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [creditValue, setCreditValue] = useState("");
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const productName =
    products.find((p) => p.id === productType)?.name || productType;

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
          clientName,
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
    <div className="flex-1 flex flex-col h-screen bg-bg-primary">
      {/* Header */}
      <div className="border-b border-border bg-bg-secondary/50 backdrop-blur-sm px-4 py-3 shrink-0">
        <div className="max-w-3xl mx-auto pl-10 lg:pl-0">
          <p className="text-sm font-semibold">
            {clientName || "Sem nome"}
          </p>
          <p className="text-[11px] text-text-muted">
            {products.find((p) => p.id === productType)?.emoji} {productName}
            {creditValue && ` · ${creditValue}`}
          </p>
        </div>
      </div>

      {/* Chat body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <StarterPicker
            clientName={clientName}
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
                clientName={clientName}
              />
            ))}
          </div>
        )}

        {isLoading && <LoadingDots />}

        {waitingForSelection && aiResponse && (
          <>
            <AnalysisBanner tips={aiResponse.tips} errors={aiResponse.errors} />
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
  );
}
