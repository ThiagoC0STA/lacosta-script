"use client";

import { useState } from "react";
import {
  X,
  Radar,
  ShieldAlert,
  StickyNote,
  BarChart3,
  PanelRightClose,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Message } from "@/types/database";
import IntelligenceTab from "./IntelligenceTab";
import ObjectionBank from "./ObjectionBank";
import QuickNotes from "./QuickNotes";
import AnalysisTab from "./AnalysisTab";

type TabId = "radar" | "objections" | "notes" | "analysis";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: "radar", label: "Radar", icon: Radar },
  { id: "objections", label: "Objecoes", icon: ShieldAlert },
  { id: "notes", label: "Notas", icon: StickyNote },
  { id: "analysis", label: "Analise", icon: BarChart3 },
];

interface ContextPanelProps {
  open: boolean;
  onClose: () => void;
  messages: Message[];
  clientName: string;
  productType: string;
  conversationId: string;
}

export default function ContextPanel({
  open,
  onClose,
  messages,
  clientName,
  productType,
  conversationId,
}: ContextPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("radar");

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Mobile overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel - fixed on mobile, inline on desktop */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 w-full max-w-[380px] z-50 lg:relative lg:z-auto lg:max-w-none lg:w-[380px] bg-bg-secondary border-l border-border flex flex-col shadow-2xl lg:shadow-none shrink-0"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <PanelRightClose size={14} className="text-text-muted" />
                <p className="text-xs font-semibold text-text-primary">Contexto</p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border shrink-0">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors relative ${
                      isActive
                        ? "text-text-primary"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="context-tab-indicator"
                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-text-primary rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "radar" && (
                <IntelligenceTab
                  messages={messages}
                  clientName={clientName}
                  productType={productType}
                  isVisible={activeTab === "radar"}
                />
              )}
              {activeTab === "objections" && <ObjectionBank />}
              {activeTab === "notes" && (
                <QuickNotes conversationId={conversationId} />
              )}
              {activeTab === "analysis" && (
                <AnalysisTab
                  messages={messages}
                  clientName={clientName}
                  productType={productType}
                  isVisible={activeTab === "analysis"}
                />
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
