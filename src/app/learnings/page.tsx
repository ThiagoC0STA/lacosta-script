"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Loader2,
  Brain,
  Shield,
} from "lucide-react";
import LearningCard from "../../components/learnings/LearningCard";
import LearningForm from "../../components/learnings/LearningForm";
import RuleCard from "../../components/learnings/RuleCard";
import RuleForm from "../../components/learnings/RuleForm";
import { useToast } from "@/components/shared/Toast";

interface Learning {
  id: string;
  insight: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface RuleItem {
  id: string;
  rule: string;
  is_active?: boolean;
  created_at?: string;
}

const CATEGORIES = [
  { value: "general", label: "Geral" },
  { value: "objections", label: "Objecoes" },
  { value: "approach", label: "Abordagem" },
  { value: "product", label: "Produto" },
  { value: "closing", label: "Fechamento" },
];

export default function LearningsPage() {
  const [learnings, setLearnings] = useState<Learning[]>([]);
  const [rules, setRules] = useState<RuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addingRule, setAddingRule] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [activeSection, setActiveSection] = useState<"learnings" | "rules">(
    "learnings"
  );
  const router = useRouter();
  const { toast } = useToast();

  const fetchLearnings = useCallback(async () => {
    try {
      const [learnRes, rulesRes] = await Promise.all([
        fetch("/api/learnings"),
        fetch("/api/ai-rules"),
      ]);
      const learnData = await learnRes.json();
      const rulesData = await rulesRes.json();

      if (!learnRes.ok) {
        throw new Error(learnData.error || "Falha ao carregar aprendizados");
      }

      setLearnings(learnData);
      if (rulesRes.ok) {
        setRules(rulesData);
      } else {
        setRules([]);
      }
    } catch {
      toast("Nao foi possivel carregar aprendizados", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLearnings();
  }, [fetchLearnings]);

  const handleAdd = async (insight: string, category: string) => {
    const res = await fetch("/api/learnings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ insight, category }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || "Falha ao salvar aprendizado", "error");
      return;
    }
    setLearnings((prev) => [data, ...prev]);
    setAdding(false);
    toast("Aprendizado salvo");
  };

  const handleUpdate = async (id: string, insight: string, category: string) => {
    const res = await fetch("/api/learnings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, insight, category }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast(data.error || "Falha ao atualizar aprendizado", "error");
      return;
    }
    setLearnings((prev) => prev.map((l) => (l.id === id ? data : l)));
    setEditingId(null);
    toast("Aprendizado atualizado");
  };

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/learnings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast(data.error || "Falha ao apagar aprendizado", "error");
      return;
    }
    setLearnings((prev) => prev.filter((l) => l.id !== id));
    toast("Aprendizado apagado");
  };

  const handleAddRule = async (rule: string, isActive: boolean) => {
    const res = await fetch("/api/ai-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rule, is_active: isActive }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || "Falha ao salvar regra", "error");
      return;
    }
    setRules((prev) => [data, ...prev]);
    setAddingRule(false);
    toast("Regra salva");
  };

  const handleUpdateRule = async (id: string, rule: string, isActive: boolean) => {
    const res = await fetch("/api/ai-rules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, rule, is_active: isActive }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || "Falha ao atualizar regra", "error");
      return;
    }
    setRules((prev) => prev.map((r) => (r.id === id ? data : r)));
    setEditingRuleId(null);
    toast("Regra atualizada");
  };

  const handleDeleteRule = async (id: string) => {
    const res = await fetch("/api/ai-rules", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || "Falha ao apagar regra", "error");
      return;
    }
    setRules((prev) => prev.filter((r) => r.id !== id));
    toast("Regra apagada");
  };

  const filtered =
    filterCategory === "all"
      ? learnings
      : learnings.filter((l) => l.category === filterCategory);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="border-b border-border bg-bg-secondary">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold">Aprendizados da IA</h1>
            <p className="text-[10px] text-text-muted mt-0.5">
              {learnings.length} aprendizados • {rules.length} regras
            </p>
          </div>
          <button
            onClick={() => {
              if (activeSection === "learnings") {
                setAdding(true);
                setEditingId(null);
              } else {
                setAddingRule(true);
                setEditingRuleId(null);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-text-primary text-bg-primary hover:opacity-90 transition-all"
          >
            <Plus size={13} />
            {activeSection === "learnings" ? "Aprendizado" : "Regra"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Info */}
        <div className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-bg-secondary mb-4">
          <Brain size={14} className="text-text-muted mt-0.5 shrink-0" />
          <p className="text-[11px] text-text-muted leading-relaxed">
            Aprendizados e Regras ficam juntos, mas sao coisas diferentes:
            Aprendizados = memoria operacional do que funciona melhor no seu funil.
            Regras = limites fixos de comportamento da IA (tom, formato, proibicoes).
          </p>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <button
            onClick={() => setActiveSection("learnings")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium ${
              activeSection === "learnings"
                ? "bg-bg-tertiary text-text-primary border border-border-light"
                : "text-text-muted border border-transparent hover:text-text-secondary"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Brain size={12} />
              Aprendizados
            </span>
          </button>
          <button
            onClick={() => setActiveSection("rules")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium ${
              activeSection === "rules"
                ? "bg-bg-tertiary text-text-primary border border-border-light"
                : "text-text-muted border border-transparent hover:text-text-secondary"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Shield size={12} />
              Regras
            </span>
          </button>
        </div>

        {activeSection === "learnings" && (
          <>
            {/* Filter */}
            <div className="flex items-center gap-1.5 mb-4 overflow-x-auto">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
                  filterCategory === "all"
                    ? "bg-bg-tertiary text-text-primary border border-border-light"
                    : "text-text-muted border border-transparent hover:text-text-secondary"
                }`}
              >
                Todos ({learnings.length})
              </button>
              {CATEGORIES.map((c) => {
                const count = learnings.filter((l) => l.category === c.value).length;
                if (count === 0) return null;
                return (
                  <button
                    key={c.value}
                    onClick={() => setFilterCategory(c.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
                      filterCategory === c.value
                        ? "bg-bg-tertiary text-text-primary border border-border-light"
                        : "text-text-muted border border-transparent hover:text-text-secondary"
                    }`}
                  >
                    {c.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Add form */}
            {adding && (
              <div className="mb-4">
                <LearningForm
                  categories={CATEGORIES}
                  onSubmit={handleAdd}
                  onCancel={() => setAdding(false)}
                />
              </div>
            )}
          </>
        )}

        {activeSection === "rules" && addingRule && (
          <div className="mb-4">
            <RuleForm onSubmit={handleAddRule} onCancel={() => setAddingRule(false)} />
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={16} className="animate-spin text-text-muted" />
          </div>
        ) : activeSection === "learnings" && filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xs text-text-muted/40">
              {learnings.length === 0
                ? "Nenhum aprendizado adicionado"
                : "Nenhum nessa categoria"}
            </p>
          </div>
        ) : activeSection === "rules" && rules.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xs text-text-muted/40">Nenhuma regra adicionada</p>
          </div>
        ) : activeSection === "learnings" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map((learning) => (
              <LearningCard
                key={learning.id}
                learning={learning}
                categories={CATEGORIES}
                isEditing={editingId === learning.id}
                onEdit={() => {
                  setEditingId(learning.id);
                  setAdding(false);
                }}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onCancelEdit={() => setEditingId(null)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {rules.map((ruleItem) => (
              <RuleCard
                key={ruleItem.id}
                ruleItem={ruleItem}
                isEditing={editingRuleId === ruleItem.id}
                onEdit={() => {
                  setEditingRuleId(ruleItem.id);
                  setAddingRule(false);
                }}
                onUpdate={handleUpdateRule}
                onDelete={handleDeleteRule}
                onCancelEdit={() => setEditingRuleId(null)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
