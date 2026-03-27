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
  Brain,
  LayoutDashboard,
  AlertTriangle,
  Swords,
  MoreHorizontal,
} from "lucide-react";
import { products } from "@/data/products";
import type { Conversation, ConversationStatus } from "@/types/database";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  staleCount?: number;
  onSelect: (id: string) => void;
  onNewClick: () => void;
  onImportClick: () => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

const STATUS_ACCENT: Record<ConversationStatus, string> = {
  active: "before:bg-emerald-400/80",
  remarketing: "before:bg-amber-400/80",
  closed: "before:bg-blue-400/80",
  desqualified: "before:bg-red-400/80",
};

const STATUS_DOT: Record<ConversationStatus, string> = {
  active: "bg-emerald-400",
  remarketing: "bg-amber-400",
  closed: "bg-blue-400",
  desqualified: "bg-red-400",
};

const STATUS_BADGE: Record<ConversationStatus, string> = {
  active: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  remarketing: "text-amber-300 bg-amber-400/10 border-amber-400/20",
  closed: "text-blue-300 bg-blue-400/10 border-blue-400/20",
  desqualified: "text-red-300 bg-red-400/10 border-red-400/20",
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
  staleCount = 0,
  onSelect,
  onNewClick,
  onImportClick,
  onDelete,
  onLogout,
}: ChatSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState<ConversationStatus | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
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
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
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
      <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center">
            <span className="text-[10px] font-bold text-text-secondary">LC</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">La Costa</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Sales Copilot</p>
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
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={() => {
            onNewClick();
            setMobileOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-bg-primary bg-text-primary border border-transparent hover:opacity-90 transition-all"
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
            className="w-full bg-bg-primary/70 border border-border rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-border-light placeholder:text-text-muted/30 transition-all"
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

      <div className="h-px bg-border/70 mx-3" />

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
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
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:rounded-full ${
                STATUS_ACCENT[status]
              } ${
                isActive
                  ? "bg-bg-tertiary border-border-light shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                  : "bg-bg-primary/30 border-border/80 hover:bg-bg-tertiary/60 hover:border-border-light"
              }`}
              onClick={() => {
                onSelect(conv.id);
                setMobileOpen(false);
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-bg-primary border border-border/80 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-semibold text-text-muted">
                  {getInitials(conv.client_name || "")}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium truncate text-text-primary">
                    {conv.client_name || "Sem nome"}
                  </p>
                  {status !== "active" && <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />}
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

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`px-1.5 py-0.5 rounded-md border text-[9px] uppercase tracking-wider ${STATUS_BADGE[status]}`}>
                  {FILTER_LABELS[status]}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-400 transition-all p-1 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer - compact icon bar + more menu */}
      <div className="border-t border-border/70 px-3 py-2.5">
        {/* Primary: Dashboard (full width) */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-primary bg-bg-tertiary border border-border-light hover:bg-border/60 transition-all font-medium mb-2"
        >
          <LayoutDashboard size={13} />
          <span>Dashboard</span>
          {staleCount > 0 && (
            <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-warning">
              <AlertTriangle size={10} />
              {staleCount}
            </span>
          )}
        </button>

        {/* Secondary: icon row */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              onImportClick();
              setMobileOpen(false);
            }}
            title="Importar conversa"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-text-muted hover:text-text-secondary hover:bg-bg-tertiary/60 transition-all"
          >
            <Upload size={13} />
            <span className="text-[10px]">Importar</span>
          </button>

          <button
            onClick={() => router.push("/remarketing")}
            title="Remarketing"
            className="flex-1 relative flex items-center justify-center gap-1.5 py-2 rounded-lg text-text-muted hover:text-text-secondary hover:bg-bg-tertiary/60 transition-all"
          >
            <RefreshCcw size={13} />
            <span className="text-[10px]">Remarketing</span>
            {remarketingCount > 0 && (
              <span className="absolute -top-0.5 right-2 w-3.5 h-3.5 rounded-full bg-amber-400 text-[8px] font-bold text-black flex items-center justify-center">
                {remarketingCount}
              </span>
            )}
          </button>

          {/* More menu */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              title="Mais opcoes"
              className={`p-2 rounded-lg transition-all ${
                moreOpen
                  ? "text-text-primary bg-bg-tertiary"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-tertiary/60"
              }`}
            >
              <MoreHorizontal size={14} />
            </button>

            {moreOpen && (
              <div className="absolute bottom-full right-0 mb-1 w-44 rounded-lg border border-border shadow-2xl shadow-black/50 overflow-hidden z-50 bg-[#1a1a1e]">
                <button
                  onClick={() => {
                    router.push("/training");
                    setMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  <Swords size={13} />
                  Modo Treino
                </button>
                <button
                  onClick={() => {
                    router.push("/learnings");
                    setMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                >
                  <Brain size={13} />
                  Aprendizados da IA
                </button>
                <div className="h-px bg-border/50 mx-2" />
                <button
                  onClick={() => {
                    onLogout();
                    setMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-text-muted hover:text-red-400 hover:bg-white/5 transition-colors"
                >
                  <LogOut size={13} />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
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
