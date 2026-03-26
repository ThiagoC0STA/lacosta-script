"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Conversation, ConversationStatus } from "@/types/database";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import NewConversationModal from "@/components/chat/NewConversationModal";
import DeleteConfirmModal from "@/components/chat/DeleteConfirmModal";
import ImportConversationModal from "@/components/chat/ImportConversationModal";
import { MessageSquare } from "lucide-react";

const STATUS_OVERRIDES_KEY = "conversation-status-overrides";

function readStatusOverrides(): Record<string, ConversationStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STATUS_OVERRIDES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ConversationStatus>;
  } catch {
    return {};
  }
}

function writeStatusOverrides(overrides: Record<string, ConversationStatus>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STATUS_OVERRIDES_KEY, JSON.stringify(overrides));
}

export default function HomePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAI, setPendingClientMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const initialized = useRef(false);

  const activeConversation = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          const overrides = readStatusOverrides();
          const merged = (data as Conversation[]).map((conv) =>
            overrides[conv.id] ? { ...conv, status: overrides[conv.id] } : conv
          );
          setConversations(merged);
        }
      });
  }, [supabase]);

  const handleCreate = async (
    clientName: string,
    productType: string,
    clientMessage?: string
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        client_name: clientName,
        product_type: productType,
      })
      .select()
      .single();

    if (!error && data) {
      const conv = data as Conversation;
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv.id);

      if (clientMessage) {
        await supabase
          .from("messages")
          .insert({
            conversation_id: conv.id,
            role: "client",
            content: clientMessage,
          });
        setPendingClientMessage(conv.id);
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from("conversations").delete().eq("id", deleteTarget);
    setConversations((prev) => prev.filter((c) => c.id !== deleteTarget));
    if (activeId === deleteTarget) setActiveId(null);
    setDeleteTarget(null);
  };

  const handleStatusChange = async (
    id: string,
    newStatus: ConversationStatus
  ) => {
    const { error } = await supabase
      .from("conversations")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      const overrides = readStatusOverrides();
      if (overrides[id]) {
        delete overrides[id];
        writeStatusOverrides(overrides);
      }
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      return;
    }

    // Fallback for databases that still don't accept the new enum value.
    if (newStatus === "desqualified") {
      const overrides = readStatusOverrides();
      overrides[id] = "desqualified";
      writeStatusOverrides(overrides);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "desqualified" } : c))
      );
      return;
    }

    alert(`Não foi possível salvar o status: ${error.message}`);
  };

  const handleClientNameChange = async (id: string, newName: string) => {
    await supabase
      .from("conversations")
      .update({ client_name: newName })
      .eq("id", id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, client_name: newName } : c))
    );
  };

  const handleImport = async (
    clientName: string,
    productType: string,
    messages: { role: "client" | "seller"; content: string }[]
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        client_name: clientName,
        product_type: productType,
      })
      .select()
      .single();

    if (!error && data) {
      const conv = data as Conversation;

      const rows = messages.map((m) => ({
        conversation_id: conv.id,
        role: m.role,
        content: m.content,
      }));

      await supabase.from("messages").insert(rows);

      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv.id);

      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === "client") {
        setPendingClientMessage(conv.id);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNewClick={() => setModalOpen(true)}
        onImportClick={() => setImportOpen(true)}
        onDelete={setDeleteTarget}
        onLogout={handleLogout}
      />

      {activeConversation ? (
        <ChatArea
          key={activeConversation.id}
          conversationId={activeConversation.id}
          clientName={activeConversation.client_name}
          productType={activeConversation.product_type}
          status={activeConversation.status || "active"}
          onStatusChange={handleStatusChange}
          onClientNameChange={handleClientNameChange}
          autoTriggerAI={pendingAI === activeConversation.id}
          onAutoTriggerDone={() => setPendingClientMessage(null)}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-bg-primary">
          <div className="w-14 h-14 rounded-2xl bg-bg-secondary border border-border flex items-center justify-center mb-5">
            <MessageSquare size={24} className="text-text-muted" />
          </div>
          <h2 className="text-base font-semibold text-text-secondary mb-1">
            Script de Vendas com IA
          </h2>
          <p className="text-xs text-text-muted max-w-xs leading-relaxed">
            Crie uma nova conversa para começar. A IA vai gerar opções de
            resposta para cada mensagem do cliente.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-5 px-5 py-2.5 rounded-xl text-sm font-medium bg-accent text-bg-primary hover:bg-accent-hover transition-colors"
          >
            Nova conversa
          </button>
        </div>
      )}

      <NewConversationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />

      <ImportConversationModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        clientName={
          conversations.find((c) => c.id === deleteTarget)?.client_name || ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
