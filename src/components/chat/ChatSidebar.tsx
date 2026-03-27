"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  LogOut,
  X,
  Menu,
  Trash2,
  RefreshCcw,
  Upload,
  Search,
  Filter,
  ChevronDown,
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

const STATUS_DOT: Record<ConversationStatus, string> = {
  active: "bg-emerald-400",
  remarketing: "bg-amber-400",
  closed: "bg-blue-400",
  desqualified: "bg-red-400",
};

const FILTER_LABELS: Record<ConversationStatus | "all", string> = {
  all: "Todos",
  active: "Ativos",
  remarketing: "Remarketing",
  closed: "Fechados",
  desqualified: "Desqualificados",
};

function getTimeSince(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function getInitials(name: string): string {
  if (!name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const remarketingCount = conversations.filter(
    (c) => (c.status || "active") === "remarketing"
  ).length;

  const filtered = conversations.filter((c) => {
    const status = c.status || "active";
    if (filter !== "all" && status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const name = (c.client_name || "").toLowerCase();
      if (!name.includes(q)) return false;
    }
    return true;
  });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filterCount = (val: ConversationStatus | "all") =>
    val === "all"
      ? conversations.length
      : conversations.filter((c) => (c.status || "active") === val).length;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-bg-secondary">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center">
            <span className="text-[10px] font-bold text-text-secondary">LC</span>
          </div>
          <div>
            <p className="text-sm font-semibold">La Costa</p>
            <p className="text-[10px] text-text-muted">Script de Vendas</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-text-muted hover:text-text-primary"
        >
          <X size={16} />
        </button>
      </div>

      {/* New conversation */}
      <div className="px-3 pb-3">
        <button
          onClick={() => {
            onNewClick();
            setMobileOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-text-primary bg-bg-tertiary border border-border hover:border-border-light transition-all"
        >
          <Plus size={14} />
          Nova conversa
        </button>
      </div>

      {/* Search + Filter row */}
      <div className="px-3 pb-2 flex gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full bg-bg-primary border border-border rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-border-light placeholder:text-text-muted/30 transition-all"
          />
        </div>

        {/* Filter dropdown */}
        <div ref={filterRef} className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs border transition-all ${
              filter !== "all"
                ? "border-border-light bg-bg-tertiary text-text-primary"
                : "border-border bg-bg-primary text-text-muted hover:text-text-secondary"
            }`}
          >
            <Filter size={12} />
            <ChevronDown size={10} className={`transition-transform ${filterOpen ? "rotate-180" : ""}`} />
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-border shadow-2xl shadow-black/50 overflow-hidden z-50 bg-[#1a1a1e]">
              {(Object.keys(FILTER_LABELS) as (ConversationStatus | "all")[]).map((key) => {
                const count = filterCount(key);
                const isSelected = filter === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setFilter(key);
                      setFilterOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition-colors ${
                      isSelected
                        ? "text-text-primary bg-white/5"
                        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    }`}
                  >
                    {key !== "all" && (
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[key]}`} />
                    )}
                    <span className="flex-1 text-left">{FILTER_LABELS[key]}</span>
                    <span className="text-text-muted text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {filter !== "all" && (
        <div className="px-3 pb-2">
          <button
            onClick={() => setFilter("all")}
            className="flex items-center gap-1.5 text-[10px] text-text-muted hover:text-text-secondary transition-colors"
          >
            <X size={10} />
            Filtro: {FILTER_LABELS[filter]} ({filterCount(filter)})
          </button>
        </div>
      )}

      <div className="h-px bg-border mx-3" />

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {filtered.length === 0 && (
          <p className="text-xs text-text-muted/40 text-center py-10">
            {search ? "Nenhum resultado" : filter === "all" ? "Nenhuma conversa" : "Nenhuma nesse filtro"}
          </p>
        )}
        {filtered.map((conv) => {
          const product = products.find((p) => p.id === conv.product_type);
          const isActive = activeId === conv.id;
          const status = conv.status || "active";
          return (
            <div
              key={conv.id}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                isActive
                  ? "bg-bg-tertiary"
                  : "hover:bg-bg-tertiary/50"
              }`}
              onClick={() => {
                onSelect(conv.id);
                setMobileOpen(false);
              }}
            >
              {/* Initials avatar */}
              <div className="w-8 h-8 rounded-lg bg-bg-primary border border-border flex items-center justify-center shrink-0">
                <span className="text-[10px] font-semibold text-text-muted">
                  {getInitials(conv.client_name || "")}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium truncate text-text-primary">
                    {conv.client_name || "Sem nome"}
                  </p>
                  {status !== "active" && (
                    <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[10px] text-text-muted truncate">
                    {product ? `${product.name}` : "N/D"}
                  </p>
                  <span className="text-text-muted/20 text-[10px]">·</span>
                  <p className="text-[10px] text-text-muted shrink-0">
                    {getTimeSince(conv.updated_at)}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-400 transition-all p-1 rounded shrink-0"
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-1.5">
        <button
          onClick={() => {
            onImportClick();
            setMobileOpen(false);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-text-secondary border border-border hover:border-border-light hover:bg-bg-tertiary/50 transition-all"
        >
          <Upload size={13} />
          Importar conversa
        </button>

        <button
          onClick={() => router.push("/remarketing")}
          className="w-full relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-text-secondary border border-border hover:border-border-light hover:bg-bg-tertiary/50 transition-all"
        >
          <RefreshCcw size={13} />
          <span>Remarketing</span>
          {remarketingCount > 0 && (
            <span className="ml-auto text-amber-400 text-[10px] font-semibold">
              {remarketingCount}
            </span>
          )}
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          <LogOut size={13} />
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

      <aside className="hidden lg:flex w-72 border-r border-border flex-col h-screen shrink-0">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col shadow-2xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
