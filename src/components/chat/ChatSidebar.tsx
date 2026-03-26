"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MessageCircle,
  LogOut,
  X,
  Menu,
  Trash2,
  RefreshCcw,
  CheckCircle,
  Clock,
  Upload,
  UserX,
} from "lucide-react";
import { products } from "@/data/products";
import type { Conversation, ConversationStatus } from "@/types/database";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewClick: () => void;
  onImportClick: () => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

const STATUS_CONFIG: Record<
  ConversationStatus,
  { label: string; color: string; bg: string; icon: typeof Clock }
> = {
  active: { label: "Ativo", color: "text-accent", bg: "bg-accent/10", icon: Clock },
  remarketing: { label: "Remarketing", color: "text-amber-400", bg: "bg-amber-400/10", icon: RefreshCcw },
  closed: { label: "Fechado", color: "text-info", bg: "bg-info/10", icon: CheckCircle },
  desqualified: { label: "Desqualificado", color: "text-danger", bg: "bg-danger/10", icon: UserX },
};

export default function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNewClick,
  onImportClick,
  onDelete,
  onLogout,
}: ChatSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState<ConversationStatus | "all">("all");
  const router = useRouter();

  const remarketingCount = conversations.filter(
    (c) => (c.status || "active") === "remarketing"
  ).length;

  const filtered =
    filter === "all"
      ? conversations
      : conversations.filter((c) => (c.status || "active") === filter);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-bg-secondary">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <span className="text-xs font-bold text-accent">LC</span>
          </div>
          <div>
            <p className="text-sm font-semibold">La Costa</p>
            <p className="text-[10px] text-text-muted">Script IA</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-text-muted hover:text-text-primary"
        >
          <X size={18} />
        </button>
      </div>

      {/* New button */}
      <div className="px-3 pb-2">
        <button
          onClick={() => {
            onNewClick();
            setMobileOpen(false);
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-text-primary bg-bg-tertiary hover:bg-border/50 border border-border transition-colors"
        >
          <Plus size={14} />
          Nova conversa
        </button>
      </div>

      {/* Filter pills */}
      <div className="px-3 pb-2 flex gap-1">
        {(["all", "active", "remarketing", "closed", "desqualified"] as const).map((f) => {
          const isAll = f === "all";
          const count = isAll
            ? conversations.length
            : conversations.filter((c) => (c.status || "active") === f).length;

          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider transition-all ${
                filter === f
                  ? "bg-bg-tertiary text-text-primary border border-border-light"
                  : "text-text-muted hover:text-text-secondary border border-transparent"
              }`}
            >
              {isAll ? "Todos" : STATUS_CONFIG[f].label}
              {count > 0 && (
                <span className="ml-0.5 opacity-50">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="h-px bg-border mx-3" />

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {filtered.length === 0 && (
          <p className="text-[11px] text-text-muted/50 text-center py-10">
            {filter === "all" ? "Nenhuma conversa" : "Nenhuma conversa nesse filtro"}
          </p>
        )}
        {filtered.map((conv) => {
          const product = products.find((p) => p.id === conv.product_type);
          const isActive = activeId === conv.id;
          const status = conv.status || "active";
          const statusConf = STATUS_CONFIG[status];
          return (
            <div
              key={conv.id}
              className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                isActive
                  ? "bg-accent/8 text-text-primary"
                  : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
              }`}
              onClick={() => {
                onSelect(conv.id);
                setMobileOpen(false);
              }}
            >
              <MessageCircle
                size={14}
                className={
                  isActive
                    ? `${statusConf.color} shrink-0`
                    : `${statusConf.color} shrink-0 opacity-70`
                }
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-medium truncate">
                    {conv.client_name || "Sem nome"}
                  </p>
                  {status !== "active" && (
                    <span
                      className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                        status === "remarketing"
                          ? "bg-amber-400"
                          : status === "closed"
                          ? "bg-info"
                          : "bg-danger"
                      }`}
                    />
                  )}
                </div>
                <p className="text-[10px] text-text-muted truncate">
                  {product
                    ? `${product.emoji} ${product.name}`
                    : "Produto não definido"}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all p-1 shrink-0"
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-2">
        <button
          onClick={() => {
            onImportClick();
            setMobileOpen(false);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-info border border-info/20 bg-info/5 hover:bg-info/10 hover:border-info/30 transition-all"
        >
          <Upload size={14} />
          Importar conversa
        </button>

        <button
          onClick={() => router.push("/remarketing")}
          className="w-full relative flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold transition-all overflow-hidden bg-linear-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 text-amber-300 border border-amber-400/20 hover:border-amber-400/40 hover:from-amber-500/15 hover:via-orange-500/15 hover:to-amber-500/15"
        >
          <RefreshCcw
            size={15}
            className="animate-[spin_4s_linear_infinite]"
          />
          <span>Remarketing</span>
          {remarketingCount > 0 && (
            <span className="ml-auto bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {remarketingCount}
            </span>
          )}
          {remarketingCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-text-muted hover:text-text-secondary hover:bg-bg-tertiary transition-colors"
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-40 w-9 h-9 rounded-lg bg-bg-secondary border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
      >
        <Menu size={16} />
      </button>

      <aside className="hidden lg:flex w-90 border-r border-border flex-col h-screen shrink-0">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-80 z-50 flex flex-col shadow-2xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
