"use client";

import { useState } from "react";
import Header from "@/components/Header";
import MessagesSection from "@/components/sections/MessagesSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import ObjectionsSection from "@/components/sections/ObjectionsSection";
import ClosingSection from "@/components/sections/ClosingSection";
import TipsSection from "@/components/sections/TipsSection";
import RemarketingSection from "@/components/sections/RemarketingSection";
import { products } from "@/data/products";

export default function ScriptPage() {
  const [clientName, setClientName] = useState("");
  const [productId, setProductId] = useState("imovel");
  const [creditValue, setCreditValue] = useState("");

  const selectedProduct = products.find((p) => p.id === productId);

  return (
    <div className="flex flex-col min-h-screen">
      <Header clientName={clientName} onNameChange={setClientName} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-5 space-y-4 pb-24">
        {/* Quick context bar */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[140px]">
              <label className="text-[10px] text-foreground/40 mb-1.5 block">
                Produto
              </label>
              <div className="flex flex-wrap gap-1.5">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProductId(p.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1 ${
                      productId === p.id
                        ? "bg-gold/20 text-gold border border-gold/40"
                        : "bg-navy-medium border border-foreground/8 text-foreground/40 hover:text-foreground/60 hover:border-foreground/15"
                    }`}
                  >
                    <span className="text-xs">{p.emoji}</span>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-36">
              <label className="text-[10px] text-foreground/40 mb-1.5 block">
                Valor pedido
              </label>
              <input
                type="text"
                value={creditValue}
                onChange={(e) => setCreditValue(e.target.value)}
                placeholder="R$ 100.000"
                className="w-full bg-navy-medium border border-foreground/10 rounded-lg px-3 py-1.5 text-xs focus:border-gold/40 focus:outline-none transition-colors placeholder:text-foreground/20"
              />
            </div>
          </div>
        </div>

        <MessagesSection
          clientName={clientName}
          product={selectedProduct?.name || ""}
          value={creditValue}
        />

        <ComparisonSection productId={productId} clientName={clientName} />

        <ObjectionsSection />

        <ClosingSection clientName={clientName} />

        <TipsSection />

        <div className="text-center py-4">
          <p className="text-[10px] text-foreground/20">
            La Costa Consórcios — Parceiros Servopa e Rodobens
          </p>
        </div>
      </main>

      <RemarketingSection clientName={clientName} />
    </div>
  );
}
