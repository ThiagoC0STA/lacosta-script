"use client";

import { useState } from "react";
import { Copy, Check, Search, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import { objectionsBank } from "@/data/objections-bank";

export default function ObjectionBank() {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = search
    ? objectionsBank.filter(
        (o) =>
          o.trigger.toLowerCase().includes(search.toLowerCase()) ||
          o.description.toLowerCase().includes(search.toLowerCase())
      )
    : objectionsBank;

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-3 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted/50" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar objecao..."
          className="w-full bg-bg-primary/60 border border-border rounded-lg pl-7 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted/30 focus:outline-none focus:border-border-light transition-colors"
        />
      </div>

      {/* Objections List */}
      <div className="space-y-2">
        {filtered.map((objection) => {
          const isExpanded = expandedId === objection.id;

          return (
            <div
              key={objection.id}
              className="bg-bg-primary/60 border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : objection.id)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-bg-tertiary/50 transition-colors"
              >
                <ShieldAlert size={12} className="text-warning shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">
                    {objection.trigger}
                  </p>
                  <p className="text-[10px] text-text-muted truncate">
                    {objection.description}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp size={12} className="text-text-muted shrink-0" />
                ) : (
                  <ChevronDown size={12} className="text-text-muted shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-1.5 border-t border-border/50 pt-2">
                  {objection.responses.map((response, idx) => {
                    const copyKey = `${objection.id}-${idx}`;
                    const isCopied = copiedId === copyKey;

                    return (
                      <div
                        key={idx}
                        className="group flex items-start gap-2 bg-bg-secondary rounded-md px-2.5 py-2 hover:bg-bg-tertiary transition-colors"
                      >
                        <p className="flex-1 text-[11px] text-text-secondary leading-relaxed">
                          {response}
                        </p>
                        <button
                          onClick={() => handleCopy(response, copyKey)}
                          className={`p-1 rounded shrink-0 transition-colors ${
                            isCopied
                              ? "text-accent"
                              : "text-text-muted/0 group-hover:text-text-muted hover:text-text-primary"
                          }`}
                          title="Copiar"
                        >
                          {isCopied ? <Check size={11} /> : <Copy size={11} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs text-text-muted">Nenhuma objecao encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
