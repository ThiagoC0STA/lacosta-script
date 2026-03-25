"use client";

import { useState } from "react";
import {
  Plus,
  MessageCircle,
  LogOut,
  X,
  Menu,
  Trash2,
} from "lucide-react";
import { products } from "@/data/products";
import type { Conversation } from "@/types/database";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewClick: () => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

export default function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNewClick,
  onDelete,
  onLogout,
}: ChatSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="px-3 pb-3">
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

      {/* Divider */}
      <div className="h-px bg-border mx-3" />

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {conversations.length === 0 && (
          <p className="text-[11px] text-text-muted/50 text-center py-10">
            Nenhuma conversa
          </p>
        )}
        {conversations.map((conv) => {
          const product = products.find((p) => p.id === conv.product_type);
          const isActive = activeId === conv.id;

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
                className={isActive ? "text-accent shrink-0" : "text-text-muted shrink-0"}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate">
                  {conv.client_name || "Sem nome"}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {product?.emoji} {product?.name}
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
      <div className="p-3 border-t border-border">
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
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-40 w-9 h-9 rounded-lg bg-bg-secondary border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
      >
        <Menu size={16} />
      </button>

      {/* Desktop */}
      <aside className="hidden lg:flex w-64 border-r border-border flex-col h-screen shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
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
