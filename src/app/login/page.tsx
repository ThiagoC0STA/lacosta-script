"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email ou senha incorretos"
          : authError.message
      );
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-accent">LC</span>
          </div>
          <h1 className="text-lg font-semibold">La Costa</h1>
          <p className="text-xs text-text-muted mt-1">Script de Vendas com IA</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted/40"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="text-xs text-text-muted mb-1.5 block">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-text-muted/40"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-accent text-bg-primary font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-[10px] text-text-muted/40 text-center mt-10">
          Parceiros Servopa e Rodobens
        </p>
      </div>
    </div>
  );
}
