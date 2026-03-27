"use client";

import { useState, useRef, useCallback } from "react";
import { Save, Check, StickyNote } from "lucide-react";

const NOTES_KEY = "conversation-notes";

export function readAllNotes(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllNotes(notes: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

interface QuickNotesProps {
  conversationId: string;
}

export default function QuickNotes({ conversationId }: QuickNotesProps) {
  const [note, setNote] = useState(() => readAllNotes()[conversationId] || "");
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistNote = useCallback(
    (value: string) => {
      const all = readAllNotes();
      if (value.trim()) {
        all[conversationId] = value;
      } else {
        delete all[conversationId];
      }
      saveAllNotes(all);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [conversationId]
  );

  const handleChange = (value: string) => {
    setNote(value);
    setSaved(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => persistNote(value), 800);
  };

  const handleManualSave = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    persistNote(note);
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <StickyNote size={12} className="text-text-muted" />
          <p className="text-[10px] text-text-muted uppercase tracking-wider">
            Anotacoes desta conversa
          </p>
        </div>
        <button
          onClick={handleManualSave}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
            saved
              ? "text-accent bg-accent/10"
              : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary"
          }`}
        >
          {saved ? <Check size={10} /> : <Save size={10} />}
          {saved ? "Salvo" : "Salvar"}
        </button>
      </div>

      <textarea
        value={note}
        onChange={(e) => handleChange(e.target.value)}
        rows={8}
        placeholder="Anote detalhes importantes sobre este cliente...&#10;&#10;Ex:&#10;- Precisa do imovel ate dezembro&#10;- Esposa precisa aprovar&#10;- Orcamento max: R$ 1.500/mes&#10;- Ja tem outro consorcio (Embracon)"
        className="w-full bg-bg-primary/60 border border-border rounded-lg px-3 py-2.5 text-xs text-text-primary placeholder:text-text-muted/25 focus:outline-none focus:border-border-light resize-none leading-relaxed transition-colors"
      />

      <p className="text-[9px] text-text-muted/50">
        Salva automaticamente. Dados ficam no seu navegador.
      </p>
    </div>
  );
}
