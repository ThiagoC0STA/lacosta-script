"use client";

interface HeaderProps {
  clientName: string;
  onNameChange: (name: string) => void;
}

export default function Header({ clientName, onNameChange }: HeaderProps) {
  return (
    <header className="w-full glass-card border-b border-gold/10 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-gold">LC</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-foreground leading-tight">
              La Costa
            </h1>
            <p className="text-[9px] text-gold/60">Script de Vendas</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-foreground/40 hidden sm:block">
            Cliente:
          </span>
          <input
            type="text"
            value={clientName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Nome do cliente"
            className="bg-navy-medium border border-foreground/10 rounded-lg px-3 py-1.5 text-xs w-40 focus:border-gold/40 focus:outline-none transition-colors placeholder:text-foreground/20"
          />
        </div>
      </div>
    </header>
  );
}
