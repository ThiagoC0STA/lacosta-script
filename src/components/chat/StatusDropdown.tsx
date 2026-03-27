"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Clock, RefreshCcw, CheckCircle, UserX } from "lucide-react";
import type { ConversationStatus } from "@/types/database";

const OPTIONS: {
  value: ConversationStatus;
  label: string;
  icon: typeof Clock;
  color: string;
  dot: string;
}[] = [
  { value: "active", label: "Ativo", icon: Clock, color: "text-emerald-400", dot: "bg-emerald-400" },
  { value: "remarketing", label: "Remarketing", icon: RefreshCcw, color: "text-amber-400", dot: "bg-amber-400" },
  { value: "closed", label: "Fechado", icon: CheckCircle, color: "text-blue-400", dot: "bg-blue-400" },
  { value: "desqualified", label: "Desqualificado", icon: UserX, color: "text-red-400", dot: "bg-red-400" },
];

interface StatusDropdownProps {
  value: ConversationStatus;
  onChange: (status: ConversationStatus) => void;
}

export default function StatusDropdown({ value, onChange }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = OPTIONS.find((o) => o.value === value) || OPTIONS[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border border-border bg-bg-secondary hover:border-border-light text-text-secondary"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown size={11} className={`text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-border shadow-2xl shadow-black/50 overflow-hidden z-50 bg-[#1a1a1e]">
          {OPTIONS.map((opt) => {
            const OptIcon = opt.icon;
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition-colors ${
                  isSelected
                    ? "text-text-primary bg-white/5"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                }`}
              >
                <OptIcon size={13} className={isSelected ? current.color : "text-text-muted"} />
                <span className="flex-1 text-left">{opt.label}</span>
                {isSelected && (
                  <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
