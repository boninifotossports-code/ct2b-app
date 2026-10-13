"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, ArrowRight, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Utilizador ou palavra-passe inválidos.");
        setCarregando(false);
        return;
      }

      // Identifica o papel retornado pela API
      const userRole = (data.usuario?.role || data.role || "").toUpperCase();

      // Redirecionamento condicional
      if (
        userRole === "ADMIN" ||
        userRole === "PROFESSOR" ||
        userRole === "TREINADOR" ||
        userRole === "COORDENADOR"
      ) {
        // Redireciona o administrador direto para a Dashboard principal (raiz)
        router.push("/");
      } else {
        // Área dos responsáveis/atletas
        router.push("/portal-pais");
      }
    } catch {
      setErro("Falha de comunicação com o servidor. Verifique a sua ligação.");
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Detalhe estético de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-600/20 border border-orange-500/40 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-600/10">
            <span className="text-2xl font-black text-orange-500">2B</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">CT 2B</h1>
          <p className="text-xs text-slate-400 mt-1">
            Sistema de Gestão Desportiva e Portal de Atletas
          </p>
        </div>

        {erro && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Identificação / Utilizador
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Nome de utilizador, email ou telefone"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Palavra-passe
              </label>
              <Link
                href={`/trocar-senha?usuario=${encodeURIComponent(usuario)}`}
                className="text-[11px] text-orange-500 hover:text-orange-400 transition-colors"
              >
                Esqueceu-se da senha?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full mt-2 py-3 px-4 bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {carregando ? (
              "Carregando..."
            ) : (
              <>
                <span>Entrar no Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}