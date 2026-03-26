"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Conversation, ConversationStatus } from "@/types/database";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import NewConversationModal from "@/components/chat/NewConversationModal";
import { MessageSquare } from "lucide-react";

export default function HomePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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
        if (data) setConversations(data as Conversation[]);
      });
  }, [supabase]);

  const handleCreate = async (clientName: string, productType: string) => {
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
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const handleStatusChange = async (
    id: string,
    newStatus: ConversationStatus
  ) => {
    await supabase.from("conversations").update({ status: newStatus }).eq("id", id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
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
        onDelete={handleDelete}
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
    </div>
  );
}
