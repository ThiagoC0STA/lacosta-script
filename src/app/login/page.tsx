"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex">
      {/* Left: branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 border-r border-border">
        <div>
          <div className="flex items-center gap-2.5 mb-20">
            <div className="w-8 h-8 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center">
              <span className="text-[10px] font-bold text-text-secondary">LC</span>
            </div>
            <span className="text-sm font-medium text-text-muted">La Costa Consorcios</span>
          </div>

          <h1 className="text-3xl font-bold leading-tight max-w-md mb-3 text-text-primary">
            Script de vendas com inteligencia artificial
          </h1>
          <p className="text-sm text-text-muted max-w-sm leading-relaxed">
            Analise conversas, gere respostas estrategicas e faca remarketing inteligente para fechar mais negocios.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-text-muted">
          <span>Servopa</span>
          <span className="text-border">|</span>
          <span>Rodobens</span>
          <span className="text-border">|</span>
          <span>25+ anos de mercado</span>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-10 h-10 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center mx-auto mb-3">
              <span className="text-xs font-bold text-text-secondary">LC</span>
            </div>
            <h1 className="text-lg font-bold">La Costa</h1>
            <p className="text-xs text-text-muted mt-0.5">Script de Vendas</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-lg font-bold mb-1">Entrar</h2>
            <p className="text-sm text-text-muted">
              Acesse sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:border-border-light focus:outline-none transition-all placeholder:text-text-muted/30"
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
                className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:border-border-light focus:outline-none transition-all placeholder:text-text-muted/30"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/5 border border-red-400/10 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-text-primary text-bg-primary font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <p className="text-[10px] text-text-muted/30 text-center mt-12">
            Parceiros Servopa e Rodobens
          </p>
        </div>
      </div>
    </div>
  );
}
